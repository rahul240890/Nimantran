import "server-only";
import { cache } from "react";
import { authMode } from "@/lib/auth/mode";
import type { InviteDraft } from "@/lib/editor/draft";
import { clipPath } from "@/lib/editor/music-clip";
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
  /** A link to the host's own music clip, when they chose one and it has uploaded. */
  clipUrl: string | null;
  updatedAt: string;
};

const PHOTO_LINK_SECONDS = 60 * 60 * 6;

type RpcInvite = Omit<EventRow, "status" | "editor_step"> & {
  functions: (FunctionRow & { id: string })[];
  photos: { id: string; path: string; width: number | null; height: number | null }[];
  /** Present once the RSVP migration (Step 10) has run. */
  questions?: { preset: string | null }[];
};

async function fromSupabase(slug: string): Promise<PublicInvite | null> {
  const supabase = supabasePublic();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("published_invite", { p_slug: slug });
  if (error || !data) return null;
  const row = data as RpcInvite;
  const event: EventRow = { ...row, status: "published", editor_step: "preview" };
  const draft = rowsToDraft(
    event,
    row.functions,
    [],
    (row.questions ?? []).flatMap((question) => (question.preset ? [question.preset] : [])),
  );
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
  // The clip sits beside the photos, so the same policy lets guests read it
  const clip = draft.music.clip;
  const clipLink = clip
    ? await supabase.storage
        .from("event-media")
        .createSignedUrl(clipPath(row.id, clip), PHOTO_LINK_SECONDS)
    : null;
  return {
    id: row.id,
    slug: row.slug ?? slug,
    draft,
    functionIds: Object.fromEntries(row.functions.map((fn) => [fn.kind, fn.id])),
    photos,
    clipUrl: clipLink?.data?.signedUrl ?? null,
    updatedAt: row.updated_at,
  };
}

function fromPreview(slug: string): PublicInvite | null {
  const stored = [...previewDb.invites.values()].find(
    (invite) => invite.event.slug === slug && invite.event.status === "published",
  );
  if (!stored) return null;
  const id = stored.event.id;
  const draft = rowsToDraft(stored.event, stored.functions, [], stored.questions);
  return {
    id,
    slug,
    draft,
    clipUrl: draft.music.clip ? previewPhotoUrl(id, draft.music.clip.id) : null,
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
