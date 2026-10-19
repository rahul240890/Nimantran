"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/*
 * The invitation's paintings, fetched ahead (2026-10-19): the owner found a live sample's
 * pages coming in as words on an empty page while their paintings were still on the way.
 * The guest page warms every page's painting while the guest is still on the opening, a
 * couple at a time so the opening's own paintings come first, and each page waits for its
 * painting (a few seconds at most) before its words come in.
 */

/** How many paintings are fetched at once while warming. */
const AT_ONCE = 2;
/** The longest a page waits for its painting before its words come in anyway. */
export const PAINTING_WAIT_MS = 4000;

const loaded = new Set<string>();
const started = new Map<string, Promise<void>>();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Fetches and decodes one painting; a failed one counts as done, so nothing waits on it. */
export function loadPainting(src: string): Promise<void> {
  const known = started.get(src);
  if (known) return known;
  const image = new window.Image();
  image.decoding = "async";
  image.src = src;
  const done = image
    .decode()
    .catch(() => {})
    .then(() => {
      loaded.add(src);
      for (const listener of listeners) listener();
    });
  started.set(src, done);
  return done;
}

/** Warms the paintings in order, a couple at a time, skipping any already on the way. */
export function warmPaintings(sources: readonly (string | undefined)[]): void {
  const queue = [...new Set(sources.filter((src): src is string => Boolean(src)))].filter(
    (src) => !started.has(src),
  );
  const next = (): Promise<void> | undefined => {
    const src = queue.shift();
    return src ? loadPainting(src).then(next) : undefined;
  };
  for (let i = 0; i < AT_ONCE; i += 1) void next();
}

/**
 * Whether a page's painting is ready to show: loaded, or waited on for PAINTING_WAIT_MS.
 * A page without a painting is ready at once.
 */
export function usePaintingReady(src: string | undefined): boolean {
  const isLoaded = useSyncExternalStore(
    subscribe,
    () => (src ? loaded.has(src) : true),
    () => false,
  );
  const [gaveUp, setGaveUp] = useState<string | null>(null);
  useEffect(() => {
    if (!src || loaded.has(src)) return;
    void loadPainting(src);
    const timer = window.setTimeout(() => setGaveUp(src), PAINTING_WAIT_MS);
    return () => window.clearTimeout(timer);
  }, [src]);
  return isLoaded || (src !== undefined && gaveUp === src);
}
