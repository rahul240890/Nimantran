"use client";

import { useEffect, useState } from "react";
import { invitePhotoUrls } from "@/actions/invites";
import { loadPhoto } from "@/lib/editor/photos";

/* Object URLs for stored photos, shared by every view and kept for the visit */
const urls = new Map<string, string>();

export function rememberPhotoUrl(id: string, blob: Blob) {
  if (!urls.has(id)) urls.set(id, URL.createObjectURL(blob));
}

export function forgetPhotoUrl(id: string) {
  const url = urls.get(id);
  if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
  urls.delete(id);
}

/**
 * Maps each photo id to a URL an <img> can show, loading from IndexedDB as needed. Photos
 * this device doesn't have come from the account when the invite is saved there.
 */
export function usePhotoUrls(
  ids: readonly string[],
  inviteId: string | null = null,
): Record<string, string | undefined> {
  const [, setVersion] = useState(0);
  const key = ids.join(",");

  useEffect(() => {
    let cancelled = false;
    const missing = key ? key.split(",").filter((id) => !urls.has(id)) : [];
    if (missing.length === 0) return;
    void (async () => {
      await Promise.all(
        missing.map(async (id) => {
          try {
            const blob = await loadPhoto(id);
            if (blob) rememberPhotoUrl(id, blob);
          } catch {
            // Unreadable here (private mode): the account's copy or a placeholder shows
          }
        }),
      );
      if (inviteId && missing.some((id) => !urls.has(id))) {
        const remote = await invitePhotoUrls(inviteId).catch(() => ({}));
        for (const [id, url] of Object.entries(remote)) if (!urls.has(id)) urls.set(id, url);
      }
      if (!cancelled) setVersion((version) => version + 1);
    })();
    return () => {
      cancelled = true;
    };
  }, [key, inviteId]);

  return Object.fromEntries(ids.map((id) => [id, urls.get(id)]));
}
