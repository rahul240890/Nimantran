"use client";

import { useMemo } from "react";
import { StoryPage } from "@/components/invitation/story/story-player";
import { useText } from "@/i18n/client";
import { uiText } from "@/i18n/copy/ui";
import { storyBeats } from "@/lib/engine/story";
import { SUITES, pageLook, type PageArt, type SuiteId } from "@/lib/suites/catalog";
import { CARD_STORY_WORDS } from "@/lib/templates/story-words";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useSampleInvite, type SampleFunction } from "./sample";

const noop = () => {};

/** The celebrations a theme has paintings for, in the order guests see them. */
const FUNCTION_ARTS: readonly SampleFunction[] = [
  "haldi",
  "mehendi",
  "sangeet",
  "baraat",
  "wedding",
  "reception",
];

/**
 * One page of a Story design in the gallery's preview, set as guests will see it: the
 * painting with the sample names, families' line or celebration printed on it in the
 * theme's own lettering, so the words' places can be judged, not only the painting.
 */
export function StorySample({ suite, art }: { suite: SuiteId; art: PageArt }) {
  const { uiStrings } = useText(uiText);
  const still = useReducedMotion();
  const { images } = SUITES[suite];
  const kinds = FUNCTION_ARTS.filter((kind) => images[kind]);
  const { copy, functions, lang } = useSampleInvite(kinds, SUITES[suite].occasions?.[0]);
  const blessing = Boolean(images.blessing);
  const beats = useMemo(
    () =>
      storyBeats({
        copy,
        functions,
        replies: true,
        words: CARD_STORY_WORDS[lang],
        blessing,
      }),
    [copy, functions, lang, blessing],
  );
  const beat = beats.find((b) => pageLook(b.scene).art === art) ?? beats[0];
  if (!beat) return null;
  return (
    <div
      aria-hidden
      lang={lang}
      data-suite={suite}
      data-mood={pageLook(beat.scene).mood}
      className="[container-type:size] absolute inset-0"
    >
      <StoryPage
        key={beat.id}
        beat={beat}
        copy={copy}
        suite={suite}
        textBox={false}
        still={still}
        reply={null}
        labels={uiStrings.invitation.story}
        onReply={noop}
        inert
        lang={lang}
      />
    </div>
  );
}
