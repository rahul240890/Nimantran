"use client";

import { createContext, useContext, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/*
 * A quiet page leaves out the helper words under headings and fields (owner, 2026-10-24:
 * the one-page editor on a design's page is clean and short, so a family goes through it
 * quickly). Labels, errors and anything that reports what just happened always show.
 */

const QuietContext = createContext(false);

/** Its parts sit closer together and its headings are smaller (globals.css, [data-quiet]). */
export function Quiet({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <QuietContext.Provider value>
      <div data-quiet className={className}>
        {children}
      </div>
    </QuietContext.Provider>
  );
}

/** True inside a quiet page. */
export function useQuiet(): boolean {
  return useContext(QuietContext);
}

/** Helper words under a heading: left out on a quiet page. */
export function Hint({
  className,
  children,
  id,
}: {
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  if (useQuiet()) return null;
  return (
    <p id={id} className={cn("text-sm text-ink-muted", className)}>
      {children}
    </p>
  );
}
