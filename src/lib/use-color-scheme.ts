"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-color-scheme: dark)";

function subscribe(onChange: () => void): () => void {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  // The theme switch sets data-theme on <html>
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => {
    media.removeEventListener("change", onChange);
    observer.disconnect();
  };
}

function getSnapshot(): boolean {
  const choice = document.documentElement.dataset.theme;
  if (choice === "dark") return true;
  if (choice === "light") return false;
  return window.matchMedia(QUERY).matches;
}

/** True when the page is showing its dark theme, by the OS setting or the theme switch. */
export function useDarkTheme(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
