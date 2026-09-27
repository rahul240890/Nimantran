"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { CardLanguageToggle } from "@/components/invitation/card-language-toggle";
import { Invitation, type InvitationStory } from "@/components/invitation/invitation";
import type { QualityChoice } from "@/content/engine-review";
import { useLocale, useText } from "@/i18n/client";
import { uiText } from "@/i18n/copy/ui";
import { storyBeats } from "@/lib/engine/story";
import { draftSuite, storyFamily, storyFunctions } from "@/lib/publish/story";
import { editorText } from "@/i18n/copy/editor";
import {
  cardLanguages,
  draftCopy,
  draftTradition,
  templateWithRaga,
  type CardLanguage,
  type InviteDraft,
} from "@/lib/editor/draft";
import type { CardCopy } from "@/lib/templates/content";
import { cn } from "@/lib/cn";

type PreviewStageProps = {
  draft: InviteDraft;
  quality: QualityChoice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Switches the box behind the words from the pages, so the host can compare live. */
  onTextBox?: (on: boolean) => void;
  className?: string;
};

/**
 * The live invitation beside the form. Typing is never held up by the card: the words
 * reach it as a deferred value, and it only repaints when they actually change.
 */
export function PreviewStage({
  draft,
  quality,
  open,
  onOpenChange,
  onTextBox,
  className,
}: PreviewStageProps) {
  const { coupleCopy } = useText(editorText);
  const languages = cardLanguages(draft);
  const [chosen, setChosen] = useState<CardLanguage | null>(null);
  const language = chosen && languages.includes(chosen) ? chosen : languages[0];
  const key = JSON.stringify(draftCopy(draft, language));
  const copy = useMemo(() => JSON.parse(key) as CardCopy, [key]);
  const deferredCopy = useDeferredValue(copy);

  // The pages guests will see, without the reply button (there is no form here); here they
  // play only when asked, so they never cover the form while the host is typing
  const locale = useLocale();
  const { storyWords } = useText(uiText).uiStrings;
  const functionsKey = JSON.stringify(storyFunctions(draft, locale));
  const familyKey = JSON.stringify(storyFamily(draft));
  const suite = draftSuite(draft);
  const { textBox } = draft;
  const story = useMemo<InvitationStory>(() => {
    const functions = JSON.parse(functionsKey) as ReturnType<typeof storyFunctions>;
    const family = JSON.parse(familyKey) as ReturnType<typeof storyFamily>;
    return {
      beats: storyBeats({
        copy: deferredCopy,
        functions,
        replies: true,
        words: storyWords,
        family,
      }),
      suite,
      textBox,
      onTextBox,
    };
  }, [functionsKey, familyKey, deferredCopy, storyWords, suite, textBox, onTextBox]);

  const { templateId } = draft;
  const { raga } = draft.music;
  const template = useMemo(() => templateWithRaga(templateId, raga), [templateId, raga]);

  return (
    <div
      className={cn(
        "relative isolate flex min-h-0 flex-col overflow-hidden rounded-xl border border-line bg-surface-2 px-3 pt-3 pb-4 shadow-raised sm:px-5 sm:pb-5",
        className,
      )}
    >
      {/* Warm light behind the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[42%] left-1/2 -z-10 aspect-square w-[min(120%,46rem)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--marigold) 30%, transparent), color-mix(in srgb, var(--rose) 8%, transparent) 60%, transparent)",
        }}
      />
      {languages.length > 1 && (
        <div className="flex shrink-0 justify-center pb-3">
          <CardLanguageToggle
            label={coupleCopy.languagesHeading}
            languages={languages}
            value={language}
            onValueChange={setChosen}
          />
        </div>
      )}
      <Invitation
        copy={deferredCopy}
        lang={language}
        template={template}
        quality={quality}
        open={open}
        onOpenChange={onOpenChange}
        musicOnOpen={draft.music.playOnOpen}
        tradition={draftTradition(draft)?.id ?? null}
        story={story}
        autoStory={false}
      />
    </div>
  );
}
