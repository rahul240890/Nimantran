"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useText } from "@/i18n/client";
import { galleryText } from "@/i18n/copy/gallery";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * A list that scrolls sideways the way large shops show a catalogue: no scrollbar, the next
 * item peeking in at the edge to be swiped on a phone, and round arrows over the row's edges
 * on a wider screen, each shown only while there is more that way.
 */
export function ScrollRow({
  className,
  children,
  label,
}: {
  /** The list's own classes: its flex or grid, gaps, and where it stops scrolling. */
  className?: string;
  children: ReactNode;
  /** Names the list for screen readers when the heading above does not. */
  label?: string;
}) {
  const { shelfCopy } = useText(galleryText);
  const list = useRef<HTMLUListElement>(null);
  const still = useReducedMotion();
  const [more, setMore] = useState({ back: false, next: false });

  const measure = useCallback(() => {
    const row = list.current;
    if (!row) return;
    // In a right-to-left page scrollLeft runs from 0 down to minus the overflow
    const done = Math.abs(row.scrollLeft);
    const overflow = row.scrollWidth - row.clientWidth;
    const back = done > 4;
    const next = overflow - done > 4;
    setMore((was) => (was.back === back && was.next === next ? was : { back, next }));
  }, []);

  useEffect(() => {
    const row = list.current;
    if (!row) return;
    measure();
    row.addEventListener("scroll", measure, { passive: true });
    const resize = new ResizeObserver(measure);
    resize.observe(row);
    return () => {
      row.removeEventListener("scroll", measure);
      resize.disconnect();
    };
  }, [measure]);

  const scroll = (way: 1 | -1) => {
    const row = list.current;
    if (!row) return;
    const rtl = getComputedStyle(row).direction === "rtl" ? -1 : 1;
    row.scrollBy({ left: way * rtl * row.clientWidth * 0.85, behavior: still ? "auto" : "smooth" });
  };

  const arrow =
    "absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface text-ink shadow-float transition-colors hover:border-line-strong hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:grid";

  return (
    <div className="relative">
      <ul ref={list} aria-label={label} className={cn("scrollbar-none", className)}>
        {children}
      </ul>
      {more.back && (
        <button
          type="button"
          aria-label={shelfCopy.back}
          onClick={() => scroll(-1)}
          className={cn(arrow, "start-2")}
        >
          <ChevronLeft aria-hidden className="size-5 rtl:rotate-180" />
        </button>
      )}
      {more.next && (
        <button
          type="button"
          aria-label={shelfCopy.next}
          onClick={() => scroll(1)}
          className={cn(arrow, "end-2")}
        >
          <ChevronRight aria-hidden className="size-5 rtl:rotate-180" />
        </button>
      )}
    </div>
  );
}
