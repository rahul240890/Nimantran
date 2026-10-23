"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/*
 * The invitation's paintings, fetched ahead (2026-10-19): the owner found a live sample's
 * pages coming in as words on an empty page while their paintings were still on the way.
 * The guest page warms every page's painting while the guest is still on the opening, a
 * couple at a time so the opening's own paintings come first, and each page waits for its
 * painting (a few seconds at most) before its words come in.
 *
 * On a slow connection (owner, 2026-10-22) the pages still turned as bare words, one after
 * another, while the paintings crawled in. Now each theme's tiny blurred copies
 * (public/suites/<theme>/blur.json, from scripts/painting-blurs.mjs) arrive first, so a page
 * can come in on its blurred painting, and a page's time only starts once its painting is in.
 */

/** How many paintings are fetched at once while warming. */
const AT_ONCE = 2;
/** The longest a page waits for its painting before its words come in anyway. */
export const PAINTING_WAIT_MS = 4000;
/** With its blurred copy to show, a page waits only this long before it comes in. */
export const BLUR_WAIT_MS = 1500;
/** The longest a page's time is held for its painting: a stalled one can't stop the story. */
export const PAINTING_HOLD_MS = 20_000;

const loaded = new Set<string>();
const started = new Map<string, Promise<void>>();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function changed() {
  for (const listener of listeners) listener();
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
      changed();
    });
  started.set(src, done);
  return done;
}

/** Paintings waiting to be fetched, the most wanted first. */
const queue: string[] = [];
let fetching = 0;

function pump() {
  while (fetching < AT_ONCE && queue.length) {
    const src = queue.shift()!;
    if (started.has(src)) continue;
    fetching += 1;
    void loadPainting(src).then(() => {
      fetching -= 1;
      pump();
    });
  }
}

/**
 * Warms the paintings in order, a couple at a time, skipping any already on the way. The
 * latest call goes first: the pages just ahead of the one showing come before the rest.
 */
export function warmPaintings(sources: readonly (string | undefined)[]): void {
  warmBlurs(sources);
  const wanted = [...new Set(sources.filter((src): src is string => Boolean(src)))].filter(
    (src) => !started.has(src),
  );
  const rest = queue.filter((src) => !wanted.includes(src));
  queue.splice(0, queue.length, ...wanted, ...rest);
  pump();
}

/** Each theme's blurred copies by painting name, once its blur.json is in. */
const blurs = new Map<string, Record<string, string>>();
const blurRequests = new Set<string>();

/** "/suites/kayal/haldi.webp" is painting "haldi" of theme "kayal". */
function paintingName(src: string): { theme: string; name: string } | null {
  const match = /^\/suites\/([a-z0-9-]+)\/([a-z0-9-]+)\.webp$/.exec(src);
  return match ? { theme: match[1]!, name: match[2]! } : null;
}

/**
 * Fetches the blurred copies for these paintings' themes, a few kilobytes each, once per
 * theme. A theme without them (or a failed fetch) just shows none.
 */
export function warmBlurs(sources: readonly (string | undefined)[]): void {
  for (const src of sources) {
    const painting = src ? paintingName(src) : null;
    if (!painting || blurRequests.has(painting.theme)) continue;
    const { theme } = painting;
    blurRequests.add(theme);
    void fetch(`/suites/${theme}/blur.json`)
      .then((response) => (response.ok ? response.json() : {}))
      .catch(() => ({}))
      .then((data: unknown) => {
        const copies: Record<string, string> = {};
        if (data && typeof data === "object") {
          for (const [name, url] of Object.entries(data)) {
            if (typeof url === "string" && url.startsWith("data:image/webp;base64,")) {
              copies[name] = url;
            }
          }
        }
        blurs.set(theme, copies);
        changed();
      });
  }
}

/** The painting's blurred copy, once its theme's copies are in (see warmBlurs). */
export function usePaintingBlur(src: string | undefined): string | undefined {
  return useSyncExternalStore(
    subscribe,
    () => {
      const painting = src ? paintingName(src) : null;
      return painting ? blurs.get(painting.theme)?.[painting.name] : undefined;
    },
    () => undefined,
  );
}

/**
 * A page's painting: `ready` once the page can come in (its painting loaded, or waited on for
 * BLUR_WAIT_MS with its blurred copy to show, or for PAINTING_WAIT_MS without), and `loaded`
 * once the painting itself is in (or PAINTING_HOLD_MS has gone by). A page without a painting
 * is both at once.
 */
export function usePainting(src: string | undefined): { ready: boolean; loaded: boolean } {
  const isLoaded = useSyncExternalStore(
    subscribe,
    () => (src ? loaded.has(src) : true),
    () => false,
  );
  const blur = usePaintingBlur(src);
  // How long this painting has been waited on, in the steps that matter
  const [waited, setWaited] = useState<{ src: string; ms: number } | null>(null);
  useEffect(() => {
    if (!src || loaded.has(src)) return;
    void loadPainting(src);
    const timers = [BLUR_WAIT_MS, PAINTING_WAIT_MS, PAINTING_HOLD_MS].map((ms) =>
      window.setTimeout(() => setWaited({ src, ms }), ms),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [src]);
  const ms = src !== undefined && waited?.src === src ? waited.ms : 0;
  const held = ms >= PAINTING_HOLD_MS;
  return {
    ready: isLoaded || ms >= PAINTING_WAIT_MS || (Boolean(blur) && ms >= BLUR_WAIT_MS),
    loaded: isLoaded || held,
  };
}
