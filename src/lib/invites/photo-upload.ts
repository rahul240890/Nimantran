"use client";

import type { PhotoRef } from "@/lib/editor/draft";
import type { MusicClip } from "@/lib/editor/music-clip";
import { loadPhoto } from "@/lib/editor/photos";

/*
 * Sends photos that are on this device but not yet in the account. Photos picked on
 * another device aren't here, and are skipped: that device uploads them.
 */

/** How many photos go up at once: enough to fill the line, few enough to keep each quick. */
const AT_ONCE = 3;

export async function uploadPhotos(
  inviteId: string,
  photos: readonly PhotoRef[],
  missing: readonly string[],
): Promise<boolean> {
  // Each photo carries its own position, so they can go up side by side
  const waiting = [...photos.entries()].filter(([, photo]) => missing.includes(photo.id));
  let ok = true;
  const send = async () => {
    for (let next = waiting.shift(); next; next = waiting.shift()) {
      const [position, photo] = next;
      const blob = await loadPhoto(photo.id).catch(() => null);
      if (!blob) continue;
      const query = new URLSearchParams({
        w: String(Math.round(photo.width)),
        h: String(Math.round(photo.height)),
        position: String(position),
      });
      const response = await fetch(`/api/invites/${inviteId}/photos/${photo.id}?${query}`, {
        method: "POST",
        headers: { "content-type": blob.type },
        body: blob,
      }).catch(() => null);
      if (!response?.ok) ok = false;
    }
  };
  await Promise.all(Array.from({ length: AT_ONCE }, send));
  return ok;
}

/** Sends the host's music clip, when this device has it. */
export async function uploadClip(inviteId: string, clip: MusicClip): Promise<boolean> {
  const blob = await loadPhoto(clip.id).catch(() => null);
  if (!blob) return false;
  const response = await fetch(`/api/invites/${inviteId}/music/${clip.id}`, {
    method: "POST",
    headers: { "content-type": clip.type },
    body: blob,
  }).catch(() => null);
  return Boolean(response?.ok);
}
