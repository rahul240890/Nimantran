"use client";

import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useQuiet } from "@/components/ui/quiet";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/use-reduced-motion";

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
  className?: string;
  children: ReactNode;
}) {
  // Opens already filled in, so a returning host sees their words; then it's theirs to fold
  const [startOpen] = useState(open ?? filled);
  const quiet = useQuiet();
  const still = useReducedMotion();
  return (
    <details
      id={id}
      name={group}
      open={startOpen || undefined}
      data-page-target={pageTarget}
      // Opening one of a group closes the one above, which can carry this one off the top
      onToggle={(event) => {
        const fold = event.currentTarget;
        if (!group || !fold.open || fold.getBoundingClientRect().top >= HEADER) return;
        fold.scrollIntoView({ block: "start", behavior: still ? "auto" : "smooth" });
      }}
      className={cn("group scroll-mt-20 border-t border-line", quiet ? "pt-3" : "pt-6", className)}
    >
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
        <span className="flex min-w-0 flex-col gap-1">
          <span className={cn("font-display", quiet ? "text-lg" : "text-xl")}>{title}</span>
          {note && (
            <span className="truncate text-sm text-ink-muted group-open:hidden">{note}</span>
          )}
          {intro && !quiet && <span className="text-sm text-ink-muted">{intro}</span>}
        </span>
        <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-accent-text">
          {action && <span className="sr-only sm:not-sr-only">{action}</span>}
          <ChevronDown
            aria-hidden
            className="size-5 transition-transform group-open:rotate-180 motion-reduce:transition-none"
          />
        </span>
      </summary>
      <div className={cn("flex flex-col", quiet ? "mt-3 gap-4" : "mt-6 gap-6")}>{children}</div>
    </details>
  );
}
