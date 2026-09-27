"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { CardLanguageToggle } from "@/components/invitation/card-language-toggle";
import { Invitation } from "@/components/invitation/invitation";
import type { QualityChoice } from "@/content/engine-review";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy";
import {
  cardLanguages,
  draftCopy,
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
  className?: string;
};

/**
 * The live invitation beside the form. Typing is never held up by the card: the words
 * reach it as a deferred value, and it only repaints when they actually change.
 */
export function PreviewStage({ draft, quality, open, onOpenChange, className }: PreviewStageProps) {
  const { coupleCopy } = useText(editorText);
  const languages = cardLanguages(draft);
  const [chosen, setChosen] = useState<CardLanguage | null>(null);
  const language = chosen && languages.includes(chosen) ? chosen : languages[0];
  const key = JSON.stringify(draftCopy(draft, language));
  const copy = useMemo(() => JSON.parse(key) as CardCopy, [key]);
  const deferredCopy = useDeferredValue(copy);

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
      />
    </div>
  );
}
