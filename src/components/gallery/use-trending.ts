"use client";

import { useEffect, useState } from "react";
import { DEFAULT_TRENDING } from "@/lib/gallery/trending";

/*
 * The trending designs on the page: the starting list as the page is built, then what
 * /api/trending counts, asked once per visit however many rows and badges need it.
 */

let asked: Promise<readonly string[]> | null = null;
let known: readonly string[] = DEFAULT_TRENDING;

function ask(): Promise<readonly string[]> {
  asked ??= fetch("/api/trending")
    .then((response) => (response.ok ? response.json() : null))
    .then((body: { trending?: unknown } | null) => {
      const list = body?.trending;
      if (Array.isArray(list) && list.length && list.every((id) => typeof id === "string")) {
        known = list;
      }
      return known;
    })
    .catch(() => known);
  return asked;
}

export function useTrending(): readonly string[] {
  const [trending, setTrending] = useState(known);
  useEffect(() => {
    let live = true;
    void ask().then((list) => live && setTrending(list));
    return () => {
      live = false;
    };
  }, []);
  return trending;
}
