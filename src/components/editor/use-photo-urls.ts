"use client";

import { useEffect, useState } from "react";
import { loadPhoto } from "@/lib/editor/photos";

/* Object URLs for stored photos, shared by every view and kept for the visit */
const urls = new Map<string, string>();

export function rememberPhotoUrl(id: string, blob: Blob) {
  if (!urls.has(id)) urls.set(id, URL.createObjectURL(blob));
}

export function forgetPhotoUrl(id: string) {
  const url = urls.get(id);
  if (url) URL.revokeObjectURL(url);
  urls.delete(id);
}

/** Maps each photo id to a URL an <img> can show, loading from IndexedDB as needed. */
export function usePhotoUrls(ids: readonly string[]): Record<string, string | undefined> {
  const [, setVersion] = useState(0);
  const key = ids.join(",");

  useEffect(() => {
    let cancelled = false;
    const missing = key ? key.split(",").filter((id) => !urls.has(id)) : [];
    if (missing.length === 0) return;
    void Promise.all(
      missing.map(async (id) => {
        try {
          const blob = await loadPhoto(id);
          if (blob) rememberPhotoUrl(id, blob);
        } catch {
          // Unreadable here (private mode): the tile shows its placeholder
        }
      }),
    ).then(() => {
      if (!cancelled) setVersion((version) => version + 1);
    });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return Object.fromEntries(ids.map((id) => [id, urls.get(id)]));
}
