"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";

/**
 * How much slower than its CSS each opening plays (2026-10-12): the owner found the moves
 * too quick, so every door, curtain, petal and painting goes at this calmer pace. The
 * timers that follow the opening (opening.tsx) stretch by the same amount.
 */
export const OPENING_PACE = 1.6;

/** The longest the guest waits for the opening's paintings before it opens anyway. */
const READY_CAP_MS = 8000;

/** The images an element's inline style names, as `url(...)`: a mask or a cover painting. */
function styleUrls(root: HTMLElement): string[] {
  const urls: string[] = [];
  for (const el of root.querySelectorAll<HTMLElement>("[style*='url(']")) {
    for (const match of (el.getAttribute("style") ?? "").matchAll(/url\((['"]?)([^'")]+)\1\)/g)) {
      if (match[2] && !match[2].startsWith("#")) urls.push(match[2]);
    }
  }
  return urls;
}

/** Settles once the image has loaded (or failed) and is decoded, ready to draw at once. */
function settled(img: HTMLImageElement): Promise<unknown> {
  const decode = () => img.decode().catch(() => {});
  if (img.complete) return decode();
  return new Promise((resolve) => {
    img.addEventListener("load", resolve, { once: true });
    img.addEventListener("error", resolve, { once: true });
  }).then(decode);
}

/**
 * Whether every painting in the opening has loaded, so it never plays over empty space and
 * lands straight on the welcome. Keyed by the opening, so a new one waits afresh; a slow
 * line waits at most a few seconds.
 */
export function useOpeningReady(ref: RefObject<HTMLElement | null>, key: string): boolean {
  const [ready, setReady] = useState<string | null>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setReady(key);
    };
    const waits = [...root.querySelectorAll("img")].map(settled);
    for (const url of styleUrls(root)) {
      const img = new window.Image();
      img.src = url;
      waits.push(settled(img));
    }
    const cap = window.setTimeout(finish, READY_CAP_MS);
    void Promise.all(waits).then(finish);
    return () => {
      done = true;
      window.clearTimeout(cap);
    };
  }, [ref, key]);
  return ready === key;
}

/**
 * Plays the opening's own moves at OPENING_PACE once it opens. The moves are CSS keyed to
 * the stage's data-open; the ones that start on opening are slowed as they begin, delays
 * included, while the ones already running round the closed opening keep their pace.
 */
export function useOpeningPace(ref: RefObject<HTMLElement | null>, open: boolean, still: boolean) {
  const before = useRef<Set<Animation>>(new Set());
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || typeof root.getAnimations !== "function") return;
    // Reading the animations brings the styles up to date, so the opening's moves are there
    const now = root.getAnimations({ subtree: true });
    if (!open) {
      before.current = new Set(now);
      return;
    }
    if (still) return;
    for (const animation of now) {
      if (!before.current.has(animation)) animation.playbackRate = 1 / OPENING_PACE;
    }
  }, [ref, open, still]);
}
