"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Words typed into a search box before the page finished loading. The server's copy of the
 * box takes keystrokes the app never hears about, and where the app draws its own box in
 * place of the server's (the Designs page's catalogue) that one starts empty. The server's
 * box is found once, as the app first draws, and read again once the app's own is on the
 * page: on a slow phone drawing takes a while, and words typed meanwhile still go into the
 * server's box. What was typed is handed to `take` straight after, so the search runs on it.
 */
export function useEarlyInput(id: string, take: (typed: string) => void) {
  const [early] = useState(() => {
    if (typeof document === "undefined") return null;
    const box = document.getElementById(id) as HTMLInputElement | null;
    return box && { box, typed: box.value };
  });
  const taken = useRef(false);
  useEffect(() => {
    if (taken.current || !early) return;
    // A box the app replaced still holds everything typed into it; one the app took over
    // as its own may have been emptied by it, so what it held at first counts
    const typed = early.box.isConnected ? early.typed : early.box.value;
    if (!typed.trim()) return;
    taken.current = true;
    take(typed);
  }, [early, take]);
}
