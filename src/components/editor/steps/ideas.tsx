"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import type { CardLanguage } from "@/lib/editor/draft";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";

/**
 * Ready wording for one of the card's lines, in the card's language: tapping an idea puts
 * it in the field, and the one in use shows as chosen.
 */
export function Ideas({
  field,
  ideas,
  value,
  language,
  onPick,
}: {
  /** The field's label, naming the group for screen readers. */
  field: string;
  ideas: readonly string[];
  value: string;
  language: CardLanguage;
  onPick: (idea: string) => void;
}) {
  const { coupleCopy } = useText(editorText);
  if (ideas.length === 0) return null;
  return (
    <div role="group" aria-label={coupleCopy.ideasLabel(field)} className="flex flex-col gap-2">
      <span
        aria-hidden
        className="flex items-center gap-1.5 font-label text-xs tracking-[0.2em] text-ink-muted uppercase"
      >
        <Sparkles className="size-3.5 text-accent-text" />
        {coupleCopy.ideas}
      </span>
      <ul className="flex flex-wrap gap-2">
        {ideas.map((idea) => {
          const chosen = value.trim() === idea;
          return (
            <li key={idea} className="max-w-full">
              <button
                type="button"
                lang={language}
                aria-pressed={chosen}
                aria-label={coupleCopy.useIdea(idea)}
                onClick={() => onPick(idea)}
                className={cn(
                  "min-h-11 max-w-full cursor-pointer rounded-full border px-4 py-2 text-start text-sm leading-snug transition-[background-color,border-color,color,transform] duration-150 motion-safe:active:scale-95",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  chosen
                    ? "border-marigold bg-marigold/15 font-semibold text-accent-text"
                    : "border-line-strong bg-surface text-ink-muted hover:border-line-control hover:text-ink",
                )}
              >
                {idea}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
