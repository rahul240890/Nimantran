"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  // The /design page can switch motion off with data-motion="reduce" on <html>
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-motion"],
  });
  return () => {
    media.removeEventListener("change", onChange);
    observer.disconnect();
  };
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches || document.documentElement.dataset.motion === "reduce";
}

/** True when motion should stay still: the OS setting, or the in-app preview switch. */
export function useReducedMotion(): boolean {
  // Assume still on the server so nothing animates before we know
  return useSyncExternalStore(subscribe, getSnapshot, () => true);
}
