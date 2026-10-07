"use client";

import { RadioGroup as RadioPrimitive } from "radix-ui";
import { useMemo } from "react";
import { useLocale, useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { cn } from "@/lib/cn";
import { couplePagePhotos, photoAspect } from "@/lib/editor/couple-photos";
import { cardLanguages, draftCopy, type InviteDraft } from "@/lib/editor/draft";
import { draftCouple } from "@/lib/publish/frames";
import { applyPages } from "@/lib/editor/pages";
import { PAGE_SECONDS, storyBeats, storyLength } from "@/lib/engine/story";
import { cardFunctions, draftBlessing, storyFamily, storyFunctions } from "@/lib/publish/story";
import { CARD_STORY_WORDS } from "@/lib/templates/story-words";
import { videoTimeline } from "@/lib/video/timeline";

const AUTO = "auto";

/**
 * How long each page stays (Step 12y): Auto times every page by its words, or the host fixes
 * one time for them all. The live music and the reel follow the pages, so the summary says
 * how long both will run with this many functions.
 */
export function PagePacing({
  draft,
  update,
}: {
  draft: InviteDraft;
  update: (change: (draft: InviteDraft) => InviteDraft) => void;
}) {
  const { extrasCopy } = useText(editorText);
  const words = extrasCopy.pacing;
  const locale = useLocale();
  const language = cardLanguages(draft)[0];
  const { pages, live, reel } = useMemo(() => {
    const copy = draftCopy(draft, language);
    // Only the number of pages matters here, so any address stands in for a photo's
    const written = storyBeats({
      copy,
      functions: cardFunctions(storyFunctions(draft, locale), draft, language),
      replies: true,
      words: CARD_STORY_WORDS[language],
      family: storyFamily(draft, language),
      couple: couplePagePhotos(
        draftCouple(draft),
        draft.photos.map((photo) => photo.id),
        () => "#",
        copy,
        (id) => photoAspect(draft.photos, id),
      ),
      blessing: draftBlessing(draft),
    });
    const beats = applyPages(written, draft.pages, language, draft.pageSeconds);
    const timeline = videoTimeline(beats, { fixed: draft.pageSeconds !== null });
    return {
      pages: beats.length,
      live: Math.round(storyLength(beats)),
      reel: Math.round(timeline.total),
    };
  }, [draft, language, locale]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3 id="pacing-heading" className="font-semibold text-ink">
          {words.heading}
        </h3>
        <p className="max-w-2xl text-sm text-ink-muted">{words.hint}</p>
      </div>
      <RadioPrimitive.Root
        aria-labelledby="pacing-heading"
        aria-describedby="pacing-summary"
        value={draft.pageSeconds === null ? AUTO : String(draft.pageSeconds)}
        onValueChange={(value) =>
          update((current) => ({
            ...current,
            pageSeconds: value === AUTO ? null : Number(value),
          }))
        }
        className="flex flex-wrap gap-2"
      >
        {[AUTO, ...PAGE_SECONDS.map(String)].map((id) => (
          <RadioPrimitive.Item
            key={id}
            value={id}
            className={cn(
              "inline-flex min-h-11 min-w-14 cursor-pointer items-center justify-center rounded-full border border-line-strong bg-surface px-4 text-sm text-ink tabular-nums shadow-raised",
              "data-[state=checked]:border-marigold data-[state=checked]:bg-[color-mix(in_srgb,var(--marigold)_12%,var(--surface))] data-[state=checked]:shadow-[0_0_0_1px_var(--marigold)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            )}
          >
            {id === AUTO ? words.auto : words.seconds(Number(id))}
          </RadioPrimitive.Item>
        ))}
      </RadioPrimitive.Root>
      <p id="pacing-summary" aria-live="polite" className="text-sm text-ink-muted">
        {words.summary(pages, live, reel)}
      </p>
    </div>
  );
}
