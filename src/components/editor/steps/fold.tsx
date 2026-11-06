"use client";

import { ChevronDown } from "lucide-react";
import { useState, type ReactNode, type SyntheticEvent } from "react";
import { useQuiet } from "@/components/ui/quiet";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { FlowerRule, LotusSprig, StepFlower } from "./part-ornaments";

/** Below the sticky header: a fold that opens above the screen's top is brought down to it. */
const HEADER = 80;

/**
 * A part of a step the host rarely needs, folded under its heading so the step stays short.
 * It opens by itself when something in it is already filled in, so nothing typed hides.
 * Folds sharing a group open one at a time (owner, 2026-10-24: only the part being worked
 * on open), the browser closing the others.
 */
export function Fold({
  id,
  group,
  title,
  note,
  intro,
  action,
  filled = false,
  open,
  pageTarget,
  step,
  className,
  children,
}: {
  /** Lets a link open it (the preview's Edit for that part). */
  id?: string;
  /** Folds of one group open one at a time. */
  group?: string;
  title: string;
  /** What's in it, shown beside the title while it's folded ("Kabir & Meera"). */
  note?: string;
  intro?: string;
  /** What opening it does, beside the chevron on wider screens ("Add family details"). */
  action?: string;
  filled?: boolean;
  /** Whether it starts open; otherwise it does once something in it is filled in. */
  open?: boolean;
  /** The page the live preview turns to while it's being filled in. */
  pageTarget?: string;
  /**
   * One of the page's numbered parts: a section of its own, bordered, its number in a
   * flower and a lotus in its heading (owner, 2026-11-06), rather than a fold inside one.
   */
  step?: number;
  className?: string;
  children: ReactNode;
}) {
  // Opens already filled in, so a returning host sees their words; then it's theirs to fold
  const [startOpen] = useState(open ?? filled);
  const quiet = useQuiet();
  const still = useReducedMotion();
  const toggle = (event: SyntheticEvent<HTMLDetailsElement>) => {
    // Opening one of a group closes the one above, which can carry this one off the top
    const fold = event.currentTarget;
    if (!group || !fold.open || fold.getBoundingClientRect().top >= HEADER) return;
    fold.scrollIntoView({ block: "start", behavior: still ? "auto" : "smooth" });
  };
  const chevron = (
    <ChevronDown
      aria-hidden
      className="size-5 transition-transform motion-reduce:transition-none"
    />
  );

  if (step !== undefined) {
    return (
      <details
        id={id}
        name={group}
        open={startOpen || undefined}
        data-page-target={pageTarget}
        data-part
        onToggle={toggle}
        className={cn(
          "group/part relative scroll-mt-20 rounded-xl border border-line bg-surface shadow-xs transition-[border-color,box-shadow] motion-reduce:transition-none",
          "open:border-marigold/60 open:shadow-md hover:border-line-strong open:hover:border-marigold/70",
          className,
        )}
      >
        {/* The marigold edge down the start of the part being worked on */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-5 start-0 w-1 rounded-e-full bg-marigold opacity-0 transition-opacity group-open/part:opacity-100 motion-reduce:transition-none"
        />
        <summary className="relative flex min-h-16 cursor-pointer list-none items-center gap-3 overflow-hidden rounded-xl bg-linear-to-r from-surface-2/80 via-surface to-surface px-3 py-2.5 group-open/part:rounded-b-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:gap-4 sm:px-4 [&::-webkit-details-marker]:hidden">
          <StepFlower step={step} />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="font-display text-lg leading-snug text-ink">{title}</span>
            {note && (
              <span className="truncate text-sm text-ink-muted group-open/part:hidden">{note}</span>
            )}
            {intro && !quiet && <span className="text-sm text-ink-muted">{intro}</span>}
          </span>
          <LotusSprig className="pointer-events-none hidden h-8 w-13 shrink-0 text-accent-text opacity-60 sm:block" />
          <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-accent-text">
            {action && <span className="sr-only sm:not-sr-only">{action}</span>}
            <span className="grid size-9 place-items-center rounded-full border border-line bg-paper transition-colors group-open/part:border-marigold/60 group-open/part:bg-marigold/15 group-hover/part:border-line-strong group-open/part:[&>svg]:rotate-180">
              {chevron}
            </span>
          </span>
        </summary>
        <div className="flex flex-col gap-4 border-t border-line px-3 pt-3 pb-4 sm:px-5 sm:pb-5">
          <FlowerRule className="-mb-1" />
          {children}
        </div>
      </details>
    );
  }

  return (
    <details
      id={id}
      name={group}
      open={startOpen || undefined}
      data-page-target={pageTarget}
      onToggle={toggle}
      className={cn(
        "group/fold scroll-mt-20 border-t border-line",
        quiet ? "pt-3" : "pt-6",
        className,
      )}
    >
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
        <span className="flex min-w-0 flex-col gap-1">
          <span className={cn("font-display", quiet ? "text-lg" : "text-xl")}>{title}</span>
          {note && (
            <span className="truncate text-sm text-ink-muted group-open/fold:hidden">{note}</span>
          )}
          {intro && !quiet && <span className="text-sm text-ink-muted">{intro}</span>}
        </span>
        <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-accent-text group-open/fold:[&>svg]:rotate-180">
          {action && <span className="sr-only sm:not-sr-only">{action}</span>}
          {chevron}
        </span>
      </summary>
      <div className={cn("flex flex-col", quiet ? "mt-3 gap-4" : "mt-6 gap-6")}>{children}</div>
    </details>
  );
}
