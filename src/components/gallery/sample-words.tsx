"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SampleWords } from "@/lib/sample/words";

const SampleWordsContext = createContext<SampleWords>({ functions: {}, occasions: {} });

/** The words the gallery's previews print, from the server (lib/sample/words.ts). */
export function SampleWordsProvider({
  words,
  children,
}: {
  words: SampleWords;
  children: ReactNode;
}) {
  return <SampleWordsContext value={words}>{children}</SampleWordsContext>;
}

export function useSampleWords(): SampleWords {
  return useContext(SampleWordsContext);
}
