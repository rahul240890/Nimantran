"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Words typed into a search box before the page finished loading. The server's copy of the
 * box takes keystrokes the app never hears about, and where the app draws its own box in
 * place of the server's (the Designs page's catalogue) that one starts empty. The box is
 * read once, as the app first draws, while the server's copy is still on the page, and
 * what was typed is handed to `take` straight after, so the search runs on it.
 */
export function useEarlyInput(id: string, take: (typed: string) => void) {
  const [typed] = useState(() =>
    typeof document === "undefined"
      ? ""
      : ((document.getElementById(id) as HTMLInputElement | null)?.value ?? ""),
  );
  const taken = useRef(false);
  useEffect(() => {
    if (taken.current || !typed.trim()) return;
    taken.current = true;
    take(typed);
  }, [typed, take]);
}
