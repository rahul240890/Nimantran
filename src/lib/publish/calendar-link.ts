"use client";

import { useSyncExternalStore } from "react";

const noSubscribe = () => () => {};

/** iPhones, iPads and Macs open an .ics link straight into their own Calendar. */
function onApple(): boolean {
  const agent = navigator.userAgent;
  return /iPhone|iPad|iPod|Macintosh/.test(agent);
}

/**
 * One tap to the guest's own calendar: Apple devices take the .ics file into Calendar,
 * everyone else lands on Google Calendar's "add event" screen, already filled in. Before
 * the browser is known (the cached page), the .ics file stands in.
 */
export function useCalendarLink(
  ics: string | null | undefined,
  google: string | null | undefined,
): { href: string; external: boolean } | null {
  const apple = useSyncExternalStore(noSubscribe, onApple, () => true);
  const href = (apple ? (ics ?? google) : (google ?? ics)) ?? null;
  if (!href) return null;
  return { href, external: href === google };
}
