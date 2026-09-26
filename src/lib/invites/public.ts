import "server-only";
import { cache } from "react";
import { authMode } from "@/lib/auth/mode";
import type { InviteDraft } from "@/lib/editor/draft";
import type { FunctionId } from "@/lib/events/functions";
import { isSlug } from "@/lib/publish/slug";
import { supabasePublic } from "@/lib/supabase/public";
import { previewDb, previewPhotoUrl } from "./preview-db";
import { rowsToDraft, type EventRow, type FunctionRow } from "./rows";

/*
 * A published invite as guests see it at /i/<slug>. Read through the database's
 * published_invite() function, which returns nothing for drafts, so a link only works
 * while the host has it published.
 */

export type PublicPhoto = { id: string; url: string; width: number; height: number };

export type PublicInvite = {
  id: string;
  slug: string;
  /** The invite in the editor's shape, so the card and wording draw exactly as previewed. */
  draft: InviteDraft;
  /** Each function's id in the database, for replies. */
  functionIds: Partial<Record<FunctionId, string>>;
  photos: PublicPhoto[];
  updatedAt: string;
};

const PHOTO_LINK_SECONDS = 60 * 60 * 6;

type RpcInvite = Omit<EventRow, "status" | "editor_step"> & {
  functions: (FunctionRow & { id: string })[];
  photos: { id: string; path: string; width: number | null; height: number | null }[];
};

async function fromSupabase(slug: string): Promise<PublicInvite | null> {
  const supabase = supabasePublic();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("published_invite", { p_slug: slug });
  if (error || !data) return null;
  const row = data as RpcInvite;
  const event: EventRow = { ...row, status: "published", editor_step: "preview" };
  const draft = rowsToDraft(event, row.functions, []);
  let photos: PublicPhoto[] = [];
  if (row.photos.length) {
    const { data: links } = await supabase.storage.from("event-media").createSignedUrls(
      row.photos.map((photo) => photo.path),
      PHOTO_LINK_SECONDS,
    );
    const byPath = new Map((links ?? []).map((link) => [link.path, link.signedUrl]));
    photos = row.photos.flatMap((photo) => {
      const url = byPath.get(photo.path);
      return url ? [{ id: photo.id, url, width: photo.width ?? 1, height: photo.height ?? 1 }] : [];
    });
  }
  return {
    id: row.id,
    slug: row.slug ?? slug,
    draft,
    functionIds: Object.fromEntries(row.functions.map((fn) => [fn.kind, fn.id])),
    photos,
    updatedAt: row.updated_at,
  };
}

function fromPreview(slug: string): PublicInvite | null {
  const stored = [...previewDb.invites.values()].find(
    (invite) => invite.event.slug === slug && invite.event.status === "published",
  );
  if (!stored) return null;
  const id = stored.event.id;
  return {
    id,
    slug,
    draft: rowsToDraft(stored.event, stored.functions, []),
    functionIds: Object.fromEntries(stored.functions.map((fn) => [fn.kind, `${id}:${fn.kind}`])),
    photos: [...stored.photos]
      .sort((a, b) => a.position - b.position)
      .flatMap((photo) => {
        const url = previewPhotoUrl(id, photo.id);
        return url
          ? [{ id: photo.id, url, width: photo.width ?? 1, height: photo.height ?? 1 }]
          : [];
      }),
    updatedAt: stored.event.updated_at,
  };
}

/** The published invite at /i/<slug>, or null. Cached for one request. */
export const findPublishedInvite = cache(async (slug: string): Promise<PublicInvite | null> => {
  if (!isSlug(slug)) return null;
  const mode = authMode();
  if (mode === "supabase") return fromSupabase(slug);
  if (mode === "preview") return fromPreview(slug);
  return null;
});
