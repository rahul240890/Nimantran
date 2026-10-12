"use client";

import { useEffect, useMemo, useState } from "react";
import { invitePhotoUrls } from "@/actions/invites";
import type { InviteDraft } from "@/lib/editor/draft";
import { loadPhoto } from "@/lib/editor/photos";

/* Object URLs for stored photos and music clips, shared by every view and kept for the visit */
const urls = new Map<string, string>();
/** Which links are the account's, which run out; this device's own copies never do. */
const remote = new Set<string>();
/** Photos neither this device nor the account has any more: nothing can show them. */
const gone = new Set<string>();
/** Links that failed to load once already, and photos that failed again, given up on. */
const failed = new Set<string>();
const gaveUp = new Set<string>();
const changed = new Set<() => void>();

/** The account's links last an hour; ask for fresh ones a while before that. */
const REMOTE_LINK_MS = 45 * 60_000;

/** Keeps the account's links, and lets them go when they're about to run out. */
function rememberRemote(found: Record<string, string>) {
  const fresh = Object.entries(found).filter(([id]) => !urls.has(id));
  if (fresh.length === 0) return;
  for (const [id, url] of fresh) {
    urls.set(id, url);
    remote.add(id);
  }
  setTimeout(() => {
    const ran = fresh.filter(([id, url]) => urls.get(id) === url);
    if (ran.length === 0) return;
    for (const [id] of ran) forgetPhotoUrl(id);
    // Views showing them ask for new ones
    changed.forEach((listener) => listener());
  }, REMOTE_LINK_MS);
}

export function rememberPhotoUrl(id: string, blob: Blob) {
  gone.delete(id);
  if (remote.has(id)) forgetPhotoUrl(id);
  if (!urls.has(id)) urls.set(id, URL.createObjectURL(blob));
}

export function forgetPhotoUrl(id: string) {
  const url = urls.get(id);
  if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
  urls.delete(id);
  remote.delete(id);
}

/**
 * An <img> couldn't load a photo: its link is made afresh, once, from this device's copy or
 * the account (whose links run out). One that fails again shows as a placeholder.
 */
export function photoFailed(id: string) {
  forgetPhotoUrl(id);
  if (failed.has(id)) gaveUp.add(id);
  failed.add(id);
  changed.forEach((listener) => listener());
}

const REMOTE_TRIES = 3;
const REMOTE_WAIT_MS = 4_000;

/**
 * The account's links for an invite's photos. The editor drops ?invite= from the address
 * right after opening one, and a server action caught in that navigation can go unanswered,
 * so each try gives up after a few seconds and asks again.
 */
async function remotePhotoUrls(inviteId: string): Promise<Record<string, string> | null> {
  for (let attempt = 0; attempt < REMOTE_TRIES; attempt++) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const found = await Promise.race([
      invitePhotoUrls(inviteId).catch(() => null),
      new Promise<null>((resolve) => {
        timer = setTimeout(() => resolve(null), REMOTE_WAIT_MS);
      }),
    ]);
    clearTimeout(timer);
    if (found) return found;
  }
  return null;
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
  const [retry, setRetry] = useState(0);
  const key = ids.join(",");

  useEffect(() => {
    const listener = () => setRetry((count) => count + 1);
    changed.add(listener);
    return () => {
      changed.delete(listener);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const missing = key
      ? key.split(",").filter((id) => !urls.has(id) && !gone.has(id) && !gaveUp.has(id))
      : [];
    if (missing.length === 0) return;
    void (async () => {
      const unreadable = new Set<string>();
      await Promise.all(
        missing.map(async (id) => {
          try {
            const blob = await loadPhoto(id);
            if (blob) rememberPhotoUrl(id, blob);
          } catch {
            // Unreadable here (private mode): the account's copy or a placeholder shows
            unreadable.add(id);
          }
        }),
      );
      const still = missing.filter((id) => !urls.has(id));
      if (inviteId && still.length > 0) {
        const found = await remotePhotoUrls(inviteId);
        // Only a clear answer from the account says a photo is lost, never a missed one
        if (found) {
          rememberRemote(found);
          for (const id of still) if (!urls.has(id)) gone.add(id);
        }
      } else if (!inviteId) {
        for (const id of still) if (!unreadable.has(id)) gone.add(id);
      }
      if (!cancelled) setVersion((count) => count + 1);
    })();
    return () => {
      cancelled = true;
    };
  }, [key, inviteId, retry]);

  return Object.fromEntries(ids.map((id) => [id, urls.get(id)]));
}

const noIds: readonly string[] = [];

/** A URL for the host's music clip, from this device or the account; null without one. */
export function useClipUrl(draft: InviteDraft): string | null {
  const id = draft.music.clip?.id ?? null;
  const ids = useMemo(() => (id ? [id] : noIds), [id]);
  const urls = usePhotoUrls(ids, draft.remoteId);
  return (id && urls[id]) || null;
}

/**
 * Takes photos out of the draft once it's clear nothing can show them any more (taken off
 * this device and never saved to the account), so the summary and the frames don't keep
 * an empty or broken square for them.
 */
export function useDropLostPhotos(
  draft: InviteDraft,
  update: (change: (draft: InviteDraft) => InviteDraft) => void,
  enabled: boolean,
) {
  const ids = draft.photos.map((photo) => photo.id);
  const urls = usePhotoUrls(ids, draft.remoteId);
  const lost = ids.filter((id) => !urls[id] && gone.has(id)).join(",");

  useEffect(() => {
    if (!lost || !enabled) return;
    const drop = new Set(lost.split(","));
    update((current) => ({
      ...current,
      photos: current.photos.filter((photo) => !drop.has(photo.id)),
    }));
  }, [lost, update, enabled]);
}
