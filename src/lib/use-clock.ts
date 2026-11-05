"use client";

import { useSyncExternalStore } from "react";

/** Seconds since 1970, ticking once a second (once a minute in still mode); null on the server. */
export function useClock(still: boolean): number | null {
  return useSyncExternalStore(
    (onTick) => {
      const timer = window.setInterval(onTick, still ? 30_000 : 1000);
      return () => window.clearInterval(timer);
    },
    () => Math.floor(Date.now() / (still ? 60_000 : 1000)) * (still ? 60 : 1),
    () => null,
  );
}
