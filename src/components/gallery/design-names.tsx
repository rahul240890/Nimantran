"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { GalleryDesign } from "@/lib/gallery/catalog";
import type { SearchWords } from "@/lib/gallery/search";
import { nameOf, type DesignNames } from "./design-name";
import { searchWords } from "./search-words";

/*
 * The page's design names, handed down by the server in the page's language only: every
 * language's list together is half a megabyte, too much for a phone to load for a row of
 * cards. The search finds a design by its name in any language, so it loads the rest once
 * someone searches.
 */
const DesignNamesContext = createContext<DesignNames | null>(null);

export function DesignNamesProvider({
  names,
  children,
}: {
  names: DesignNames;
  children: ReactNode;
}) {
  return <DesignNamesContext value={names}>{children}</DesignNamesContext>;
}

export function useDesignNames(): DesignNames {
  const names = useContext(DesignNamesContext);
  if (!names) throw new Error("Design cards need a DesignNamesProvider around them");
  return names;
}

/** A design's name and description in the page's language. */
export function useDesignWords(): (design: GalleryDesign) => {
  name: string;
  description: string;
} {
  const names = useDesignNames();
  return useCallback((design: GalleryDesign) => nameOf(names, design), [names]);
}

/**
 * What the search reads: designs by their names in the page's language at first, and in
 * every language once `searching` loads them, so "kamal" and "कमल" both find Lotus.
 */
export function useSearchWords(names: DesignNames, searching: boolean): SearchWords {
  const [every, setEvery] = useState<SearchWords | null>(null);
  useEffect(() => {
    if (!searching || every) return;
    let live = true;
    void import("./design-words").then((words) => live && setEvery(words.allSearchWords()));
    return () => {
      live = false;
    };
  }, [searching, every]);
  const own = useMemo(() => searchWords([names]), [names]);
  return every ?? own;
}
