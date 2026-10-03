"use client";

import { useMemo, type CSSProperties } from "react";
import { StoryPage } from "@/components/invitation/story/story-player";
import { ReviewHeader } from "@/components/shell/review-header";
import { useLocale, useText } from "@/i18n/client";
import { uiText } from "@/i18n/copy/ui";
import { draftCopy } from "@/lib/editor/draft";
import { pageType } from "@/lib/editor/type";
import { storyBeats } from "@/lib/engine/story";
import { cardFunctions, draftBlessing, storyFamily, storyFunctions } from "@/lib/publish/story";
import { SUITE_IDS, pageLook, type SuiteId } from "@/lib/suites/catalog";
import { sampleDraft } from "../_language-samples";
import type { CardLanguage } from "@/lib/templates/card-languages";
import { CARD_STORY_WORDS } from "@/lib/templates/story-words";
import "@/components/invitation/type/fonts.css";

const noop = () => {};

/** Every page of one theme in phones, side by side, for checking how the words sit. */
export function PageSheet({
  suite,
  language,
  textBox,
  width = 390,
  miniature = false,
}: {
  suite: SuiteId;
  language: CardLanguage;
  textBox: boolean;
  width?: number;
  miniature?: boolean;
}) {
  const locale = useLocale();
  const { uiStrings } = useText(uiText);
  const draft = useMemo(() => sampleDraft(suite, language), [suite, language]);
  const copy = useMemo(() => draftCopy(draft, language), [draft, language]);
  const beats = useMemo(
    () =>
      storyBeats({
        copy,
        functions: cardFunctions(storyFunctions(draft, locale), draft, language),
        replies: true,
        words: CARD_STORY_WORDS[language],
        family: storyFamily(draft, language),
        blessing: draftBlessing(draft),
      }),
    [copy, draft, language, locale],
  );
  const type = useMemo(() => pageType(draft.type, [language]), [draft.type, language]);

  return (
    <div className="flex min-h-dvh flex-col">
      <ReviewHeader label="Event pages sheet" />
      <main className="mx-auto flex w-full max-w-[110rem] flex-col gap-6 px-4 pt-24 pb-8 sm:px-6">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h1 className="font-display text-3xl">{suite}</h1>
          <p className="text-ink-muted">
            {language} · {SUITE_IDS.indexOf(suite) + 1} of {SUITE_IDS.length}
          </p>
        </div>
        <ul
          data-sheet
          className="grid justify-center gap-4"
          style={{ gridTemplateColumns: `repeat(auto-fill, ${width}px)` }}
        >
          {beats.map((beat) => (
            <li key={beat.id} className="flex flex-col items-center gap-2">
              <div
                lang={language}
                data-suite={suite}
                data-mood={pageLook(beat.scene).mood}
                className="[container-type:size] relative isolate overflow-hidden rounded-[1.6rem] border-[5px] border-night bg-night"
                style={
                  {
                    width,
                    height: Math.round((width * 844) / 390),
                    ...(miniature ? { "--type-floor": 0 } : {}),
                  } as CSSProperties
                }
              >
                <StoryPage
                  beat={beat}
                  copy={copy}
                  suite={suite}
                  textBox={textBox}
                  type={type}
                  still
                  reply={null}
                  labels={uiStrings.invitation.story}
                  onReply={noop}
                  inert
                  lang={language}
                />
              </div>
              <p className="text-sm text-ink-muted">{beat.id}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
