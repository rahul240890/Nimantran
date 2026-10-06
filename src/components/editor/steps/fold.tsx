"use client";

import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A part of a step the host rarely needs, folded under its heading so the step stays short.
 * It opens by itself when something in it is already filled in, so nothing typed hides.
 */
export function Fold({
  title,
  intro,
  action,
  filled = false,
  pageTarget,
  className,
  children,
}: {
  title: string;
  intro?: string;
  /** What opening it does, beside the chevron on wider screens ("Add family details"). */
  action?: string;
  filled?: boolean;
  /** The page the live preview turns to while it's being filled in. */
  pageTarget?: string;
  className?: string;
  children: ReactNode;
}) {
  // Opens already filled in, so a returning host sees their words; then it's theirs to fold
  const [startOpen] = useState(filled);
  return (
    <details
      open={startOpen || undefined}
      data-page-target={pageTarget}
      className={cn("group border-t border-line pt-6", className)}
    >
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
        <span className="flex flex-col gap-1">
          <span className="font-display text-xl">{title}</span>
          {intro && <span className="text-sm text-ink-muted">{intro}</span>}
        </span>
        <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-accent-text">
          {action && <span className="sr-only sm:not-sr-only">{action}</span>}
          <ChevronDown
            aria-hidden
            className="size-5 transition-transform group-open:rotate-180 motion-reduce:transition-none"
          />
        </span>
      </summary>
      <div className="mt-6 flex flex-col gap-6">{children}</div>
    </details>
  );
}
