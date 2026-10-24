"use client";

import { Sparkles } from "lucide-react";
import { useQuiet } from "@/components/ui/quiet";
import { cn } from "@/lib/cn";
import type { CardLanguage } from "@/lib/editor/draft";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";

/**
 * Ready wording for one of the card's lines, in the card's language: tapping an idea puts
 * it in the field, and the one in use shows as chosen. On a design's page they take one
 * line under the field, scrolling sideways on a phone, so the form stays short.
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
  const quiet = useQuiet();
  if (ideas.length === 0) return null;
  return (
    <div
      role="group"
      aria-label={coupleCopy.ideasLabel(field)}
      className={quiet ? "flex items-center gap-2" : "flex flex-col gap-2"}
    >
      <span
        aria-hidden
        className="flex shrink-0 items-center gap-1.5 font-label text-xs tracking-[0.2em] text-ink-muted uppercase"
      >
        <Sparkles className="size-3.5 text-accent-text" />
        {!quiet && coupleCopy.ideas}
      </span>
      <ul
        className={cn(
          "flex gap-2",
          quiet
            ? // Room for the focus ring inside the scrolling row, whose ideas never widen the form
              "-m-1 min-w-0 flex-1 [scrollbar-width:none] overflow-x-auto p-1 contain-inline-size max-sm:flex-nowrap sm:flex-wrap"
            : "flex-wrap",
        )}
      >
        {ideas.map((idea) => {
          const chosen = value.trim() === idea;
          return (
            <li
              key={idea}
              className={cn("max-w-full", quiet && "max-sm:max-w-none max-sm:shrink-0")}
            >
              <button
                type="button"
                lang={language}
                aria-pressed={chosen}
                aria-label={coupleCopy.useIdea(idea)}
                onClick={() => onPick(idea)}
                className={cn(
                  quiet && "max-sm:max-w-none max-sm:whitespace-nowrap",
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
