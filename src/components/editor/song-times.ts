"use client";

import { useMemo } from "react";
import { useLocale } from "@/i18n/client";
import { cardLanguages, mainFunction, type InviteDraft } from "@/lib/editor/draft";
import {
  belowSeconds,
  sceneSeconds,
  songLengths,
  type SongLengths,
} from "@/lib/editor/song-length";
import {
  cardFunctions,
  draftShowsScene,
  draftSuite,
  storyFamily,
  storyFunctions,
} from "@/lib/publish/story";
import { guestLook } from "@/lib/suites/guest-look";
import { useStoryTimes } from "./page-pacing";

/**
 * How long the host's own song has to run for this invitation as it stands: the least
 * (the opening and the pages, or the Scene) and enough for the page below too.
 */
export function useSongLengths(draft: InviteDraft): SongLengths & { pages: number } {
  const locale = useLocale();
  const { pages, live } = useStoryTimes(draft);
  return useMemo(() => {
    const language = cardLanguages(draft)[0];
    const functions = cardFunctions(storyFunctions(draft, locale), draft, language).length;
    const scene = draftShowsScene(draft);
    const main = mainFunction(draft);
    const below = belowSeconds({
      themed: guestLook(draftSuite(draft)) !== null,
      functions,
      photos: draft.photos.length > 0,
      family: storyFamily(draft, language).length > 0,
      dated: Boolean(main && draft.functions[main].date),
    });
    return { ...songLengths(scene ? sceneSeconds(functions) : live, below), pages };
  }, [draft, locale, live, pages]);
}
