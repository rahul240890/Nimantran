import "server-only";
import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Account } from "@/lib/auth/account";
import { authMode } from "@/lib/auth/mode";
import { includedFunctions } from "@/lib/editor/draft";
import { editionsActive, publishedPlan } from "@/lib/payments/editions";
import { OPEN_ALBUM_DAYS, WALL_RULES, wallWindow, type WallWindow } from "@/lib/photo-wall/rules";
import { PLANS } from "@/lib/plans/catalog";
import { todayInIndia } from "@/lib/publish/countdown";
import { supabasePublic } from "@/lib/supabase/public";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseService } from "@/lib/supabase/service";
import { previewDb, previewHosts, type PreviewWallPhoto } from "./preview-db";
import type { PublicInvite } from "./public";

/*
 * The shared photo wall (Step 24). Guests add photos through the invitation's link; the
 * server records each one with add_wall_photo() and stores its file as itself (the
 * service role), since guests never sign in. Hosts read, hide and delete through their
 * own connection, so row level security checks every step. Preview mode keeps the same
 * rules in memory.
 */

const BUCKET = "event-media";
const LINK_SECONDS = 60 * 60 * 6;

export type WallPhoto = {
  id: string;
  url: string;
  width: number;
  height: number;
  /** Who added it, as they gave their name; may be empty. */
  name: string;
  createdAt: string;
  /** Added from this phone, so the guest can take it back. */
  mine: boolean;
};

export type HostWallPhoto = Omit<WallPhoto, "mine"> & { hidden: boolean };

export type AddResult =
  | { ok: true; photo: WallPhoto }
  | { ok: false; reason: "closed" | "full" | "share" | "unavailable" | "failed" };

export type NewWallPhoto = {
  token: string | null;
  device: string;
  name: string;
  width: number;
  height: number;
  file: Blob;
};

const isPreview = () => authMode() === "preview";

function extension(type: string) {
  return type === "image/png" ? "png" : type === "image/jpeg" ? "jpg" : "webp";
}

export function wallPath(eventId: string, photoId: string, type: string) {
  return `${eventId}/wall-${photoId}.${extension(type)}`;
}

/* ---------- When the wall is open ---------- */

/** In preview mode a test can set the server's date for the wall with this cookie. */
const PREVIEW_TODAY_COOKIE = "shubh-preview-today";

async function today(): Promise<string> {
  if (isPreview()) {
    const set = (await cookies()).get(PREVIEW_TODAY_COOKIE)?.value;
    if (set && /^\d{4}-\d{2}-\d{2}$/.test(set)) return set;
  }
  return todayInIndia();
}

/** Whether the server can store guests' photos at all: Supabase's service key, or preview. */
export function wallAvailable(): boolean {
  if (isPreview()) return true;
  return authMode() === "supabase" && supabaseService() !== null;
}

/** How long the invite's edition keeps the wall open; a year until payments are switched on. */
async function albumDays(invite: PublicInvite): Promise<number> {
  if (!(await editionsActive())) return OPEN_ALBUM_DAYS;
  return PLANS[await publishedPlan(invite.slug, invite.id)].albumDays;
}

/** Whether guests can add photos to this invite's wall today. */
export async function inviteWallWindow(invite: PublicInvite): Promise<WallWindow> {
  if (!wallAvailable()) return { state: "off" };
  const dates = includedFunctions(invite.draft).map((kind) => invite.draft.functions[kind].date);
  return wallWindow(dates, await albumDays(invite), await today());
}

/* ---------- Guests ---------- */

type WallRow = {
  id: string;
  path: string;
  width: number;
  height: number;
  name: string;
  created_at: string;
  mine: boolean;
};

async function signed(
  client: { storage: SupabaseClient["storage"] },
  paths: string[],
): Promise<Map<string, string>> {
  if (paths.length === 0) return new Map();
  const { data } = await client.storage.from(BUCKET).createSignedUrls(paths, LINK_SECONDS);
  return new Map(
    (data ?? []).flatMap((link) =>
      link.path && link.signedUrl ? [[link.path, link.signedUrl]] : [],
    ),
  );
}

function previewUrl(path: string): string | null {
  const file = previewDb.files.get(path);
  return file ? `data:${file.type};base64,${Buffer.from(file.data).toString("base64")}` : null;
}

const previewPublished = (eventId: string, slug: string) => {
  const stored = previewDb.invites.get(eventId);
  return stored?.event.status === "published" && stored.event.slug === slug;
};

function previewGuestPhoto(row: PreviewWallPhoto, device: string): WallPhoto | null {
  const url = previewUrl(row.path);
  return url
    ? {
        id: row.id,
        url,
        width: row.width,
        height: row.height,
        name: row.name,
        createdAt: row.createdAt,
        mine: row.device === device,
      }
    : null;
}

const newestFirst = (a: { createdAt: string }, b: { createdAt: string }) =>
  b.createdAt.localeCompare(a.createdAt);

/** The wall as guests see it, newest first, with this phone's own photos marked. */
export async function guestWall(invite: PublicInvite, device: string): Promise<WallPhoto[]> {
  if (isPreview()) {
    return [...previewDb.wall.values()]
      .filter((row) => row.eventId === invite.id && !row.hidden)
      .flatMap((row) => previewGuestPhoto(row, device) ?? [])
      .sort(newestFirst);
  }
  const supabase = supabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase.rpc("wall_photos_for", {
    p_slug: invite.slug,
    p_device: device,
  });
  if (error || !Array.isArray(data)) return [];
  const rows = data as WallRow[];
  const links = await signed(
    supabase,
    rows.map((row) => row.path),
  );
  return rows.flatMap((row) => {
    const url = links.get(row.path);
    return url
      ? [
          {
            id: row.id,
            url,
            width: row.width,
            height: row.height,
            name: row.name,
            createdAt: row.created_at,
            mine: row.mine,
          },
        ]
      : [];
  });
}

const LIMIT_REASONS: Record<string, "full" | "share"> = { "54000": "full", "54001": "share" };

/** Adds one guest photo, once the caller has checked the wall is open. */
export async function addWallPhoto(invite: PublicInvite, photo: NewWallPhoto): Promise<AddResult> {
  const id = randomUUID();
  const path = wallPath(invite.id, id, photo.file.type);
  const createdAt = new Date().toISOString();

  if (isPreview()) {
    if (!previewPublished(invite.id, invite.slug)) return { ok: false, reason: "closed" };
    const rows = [...previewDb.wall.values()].filter((row) => row.eventId === invite.id);
    if (rows.length >= WALL_RULES.perEvent) return { ok: false, reason: "full" };
    if (rows.filter((row) => row.device === photo.device).length >= WALL_RULES.perDevice) {
      return { ok: false, reason: "share" };
    }
    previewDb.files.set(path, {
      type: photo.file.type,
      data: new Uint8Array(await photo.file.arrayBuffer()),
    });
    const row: PreviewWallPhoto = {
      id,
      eventId: invite.id,
      guestToken: photo.token,
      name: photo.name,
      device: photo.device,
      path,
      width: photo.width,
      height: photo.height,
      hidden: false,
      createdAt,
    };
    previewDb.wall.set(id, row);
    const shown = previewGuestPhoto(row, photo.device);
    return shown ? { ok: true, photo: shown } : { ok: false, reason: "failed" };
  }

  const service = supabaseService();
  if (!service) return { ok: false, reason: "unavailable" };
  const { error } = await service.rpc("add_wall_photo", {
    p_slug: invite.slug,
    p_token: photo.token ?? "",
    p_device: photo.device,
    p_name: photo.name,
    p_id: id,
    p_path: path,
    p_width: photo.width,
    p_height: photo.height,
    per_device: WALL_RULES.perDevice,
    per_event: WALL_RULES.perEvent,
  });
  if (error) {
    const reason = LIMIT_REASONS[error.code ?? ""];
    return { ok: false, reason: reason ?? (error.code === "P0002" ? "closed" : "failed") };
  }
  const { error: uploadError } = await service.storage
    .from(BUCKET)
    .upload(path, photo.file, { contentType: photo.file.type, upsert: false });
  if (uploadError) {
    await service.from("wall_photos").delete().eq("id", id);
    return { ok: false, reason: "failed" };
  }
  const { data: link } = await service.storage.from(BUCKET).createSignedUrl(path, LINK_SECONDS);
  if (!link?.signedUrl) return { ok: false, reason: "failed" };
  return {
    ok: true,
    photo: {
      id,
      url: link.signedUrl,
      width: photo.width,
      height: photo.height,
      name: photo.name,
      createdAt,
      mine: true,
    },
  };
}

/** A guest taking back a photo this phone added. */
export async function removeOwnWallPhoto(
  invite: PublicInvite,
  device: string,
  photoId: string,
): Promise<boolean> {
  if (isPreview()) {
    const row = previewDb.wall.get(photoId);
    if (!row || row.eventId !== invite.id || row.device !== device) return false;
    previewDb.wall.delete(photoId);
    previewDb.files.delete(row.path);
    return true;
  }
  const service = supabaseService();
  if (!service) return false;
  const { data, error } = await service.rpc("remove_wall_photo", {
    p_slug: invite.slug,
    p_device: device,
    p_id: photoId,
  });
  if (error || typeof data !== "string") return false;
  await service.storage.from(BUCKET).remove([data]);
  return true;
}

/* ---------- Hosts ---------- */

/** Every photo on the wall, newest first; null when this person doesn't host the invite. */
export async function hostWall(account: Account, eventId: string): Promise<HostWallPhoto[] | null> {
  if (isPreview()) {
    const stored = previewDb.invites.get(eventId);
    if (!stored || !previewHosts(stored, account.id)) return null;
    return [...previewDb.wall.values()]
      .filter((row) => row.eventId === eventId)
      .flatMap((row) => {
        const url = previewUrl(row.path);
        return url
          ? [
              {
                id: row.id,
                url,
                width: row.width,
                height: row.height,
                name: row.name,
                createdAt: row.createdAt,
                hidden: row.hidden,
              },
            ]
          : [];
      })
      .sort(newestFirst);
  }
  const supabase = await supabaseServer();
  if (!supabase) return null;
  const { data: event } = await supabase
    .from("events")
    .select("id")
    .eq("id", eventId)
    .maybeSingle();
  if (!event) return null;
  const { data, error } = await supabase
    .from("wall_photos")
    .select("id, storage_path, width, height, uploader_name, hidden, created_at")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });
  // Before the migration runs the table is missing: an empty wall, not an error page
  if (error || !data) return [];
  const rows = data as {
    id: string;
    storage_path: string;
    width: number;
    height: number;
    uploader_name: string;
    hidden: boolean;
    created_at: string;
  }[];
  const links = await signed(
    supabase,
    rows.map((row) => row.storage_path),
  );
  return rows.flatMap((row) => {
    const url = links.get(row.storage_path);
    return url
      ? [
          {
            id: row.id,
            url,
            width: row.width,
            height: row.height,
            name: row.uploader_name,
            createdAt: row.created_at,
            hidden: row.hidden,
          },
        ]
      : [];
  });
}

/** How many photos guests have added, for the host dashboard. */
export async function hostWallCount(account: Account, eventId: string): Promise<number> {
  if (isPreview()) {
    const stored = previewDb.invites.get(eventId);
    if (!stored || !previewHosts(stored, account.id)) return 0;
    return [...previewDb.wall.values()].filter((row) => row.eventId === eventId).length;
  }
  const supabase = await supabaseServer();
  if (!supabase) return 0;
  const { count, error } = await supabase
    .from("wall_photos")
    .select("id", { count: "exact", head: true })
    .eq("event_id", eventId);
  return error ? 0 : (count ?? 0);
}

export async function setWallHidden(
  account: Account,
  eventId: string,
  photoIds: string[],
  hidden: boolean,
): Promise<boolean> {
  if (isPreview()) {
    const stored = previewDb.invites.get(eventId);
    if (!stored || !previewHosts(stored, account.id)) return false;
    for (const id of photoIds) {
      const row = previewDb.wall.get(id);
      if (row?.eventId === eventId) row.hidden = hidden;
    }
    return true;
  }
  const supabase = await supabaseServer();
  if (!supabase) return false;
  const { error, count } = await supabase
    .from("wall_photos")
    .update({ hidden }, { count: "exact" })
    .eq("event_id", eventId)
    .in("id", photoIds);
  return !error && (count ?? 0) > 0;
}

export async function removeWallPhotos(
  account: Account,
  eventId: string,
  photoIds: string[],
): Promise<boolean> {
  if (isPreview()) {
    const stored = previewDb.invites.get(eventId);
    if (!stored || !previewHosts(stored, account.id)) return false;
    for (const id of photoIds) {
      const row = previewDb.wall.get(id);
      if (row?.eventId !== eventId) continue;
      previewDb.wall.delete(id);
      previewDb.files.delete(row.path);
    }
    return true;
  }
  const supabase = await supabaseServer();
  if (!supabase) return false;
  const { data, error } = await supabase
    .from("wall_photos")
    .delete()
    .eq("event_id", eventId)
    .in("id", photoIds)
    .select("storage_path");
  if (error || !data?.length) return false;
  await supabase.storage.from(BUCKET).remove(data.map((row) => row.storage_path as string));
  return true;
}

/** Every wall file of an invite, for deleting the invite (the rows go with the event). */
export async function wallFilePaths(eventId: string): Promise<string[]> {
  if (isPreview()) {
    return [...previewDb.wall.values()]
      .filter((row) => row.eventId === eventId)
      .map((row) => row.path);
  }
  const supabase = await supabaseServer();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("wall_photos")
    .select("storage_path")
    .eq("event_id", eventId);
  return error || !data ? [] : data.map((row) => row.storage_path as string);
}
