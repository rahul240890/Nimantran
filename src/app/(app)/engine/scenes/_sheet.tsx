"use client";

import { useMemo } from "react";
import { OneScene } from "@/components/invitation/scene/one-scene";
import { ReviewHeader } from "@/components/shell/review-header";
import { useLocale } from "@/i18n/client";
import { draftCopy, type InviteDraft } from "@/lib/editor/draft";
import { pageType } from "@/lib/editor/type";
import { cardFunctions, storyFunctions } from "@/lib/publish/story";
import { SCENE_SUITES, scenePage } from "@/lib/suites/scene";
import type { SuiteId } from "@/lib/suites/catalog";
import type { CardLanguage } from "@/lib/templates/card-languages";
import { sampleDraft } from "../_language-samples";

const PHOTOS = [
  { src: "/occasions/engagement.webp", alt: "" },
  { src: "/occasions/mehendi.webp", alt: "" },
];

/** One theme's scene with the sample family, its reception running past midnight. */
function SceneCell({
  suite,
  language,
  width,
  miniature,
}: {
  suite: SuiteId;
  language: CardLanguage;
  width: number;
  miniature: boolean;
}) {
  const locale = useLocale();
  const draft = useMemo<InviteDraft>(() => {
    const base = sampleDraft(suite, language);
    const reception = base.functions.reception;
    return {
      ...base,
      functions: reception.included
        ? { ...base.functions, reception: { ...reception, time: "19:45", endTime: "00:15" } }
        : base.functions,
    };
  }, [suite, language]);
  const copy = useMemo(() => draftCopy(draft, language), [draft, language]);
  const functions = useMemo(
    () => cardFunctions(storyFunctions(draft, locale), draft, language),
    [draft, locale, language],
  );
  const type = useMemo(() => pageType(draft.type, [language]), [draft.type, language]);
  const page = scenePage(suite, PHOTOS.length);
  if (!page) return null;
  return (
    <li data-scene-cell={suite} className="flex flex-col items-center gap-2">
      <div
        lang={language}
        className="relative isolate overflow-hidden rounded-[1.6rem] border-[5px] border-night bg-night"
        style={{ width, height: Math.round((width * 19) / 9) }}
      >
        <OneScene
          suite={suite}
          page={page}
          copy={copy}
          lang={language}
          functions={functions}
          photos={PHOTOS}
          reply={null}
          type={type}
          framed
          miniature={miniature}
        />
      </div>
      <p className="text-sm text-ink-muted">{suite}</p>
    </li>
  );
}

/** Every Scene theme in phones, side by side, for checking how the words sit. */
export function SceneSheet({
  language,
  width,
  only,
  miniature,
}: {
  language: CardLanguage;
  width: number;
  only: readonly string[] | null;
  miniature: boolean;
}) {
  const suites = only ? SCENE_SUITES.filter((suite) => only.includes(suite)) : SCENE_SUITES;
  return (
    <div className="flex min-h-dvh flex-col">
      <ReviewHeader label="Scenes sheet" />
      <main className="mx-auto flex w-full max-w-[110rem] flex-col gap-6 px-4 pt-24 pb-8 sm:px-6">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h1 className="font-display text-3xl">Scenes</h1>
          <p className="text-ink-muted">
            {language} · {width}px · {suites.length} themes
          </p>
        </div>
        <ul
          className="grid justify-center gap-4"
          style={{ gridTemplateColumns: `repeat(auto-fill, ${width + 10}px)` }}
        >
          {suites.map((suite) => (
            <SceneCell
              key={suite}
              suite={suite}
              language={language}
              width={width}
              miniature={miniature}
            />
          ))}
        </ul>
      </main>
    </div>
  );
}
