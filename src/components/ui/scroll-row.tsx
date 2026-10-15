"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useText } from "@/i18n/client";
import { galleryText } from "@/i18n/copy/gallery";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type RowState = {
  /** There is more to scroll back to, or on to. */
  back: boolean;
  next: boolean;
  /** How far along the row is, and how much of it shows, each from 0 to 1. */
  at: number;
  shown: number;
};

export type ScrollRowHandle = {
  /** Attaches the handle to its list, as the list's ref. */
  attach: (list: HTMLUListElement | null) => void;
  state: RowState;
  scroll: (way: 1 | -1) => void;
};

/**
 * Follows a sideways list: whether there is more either way, and how far along it is, so
 * arrows, a progress line and soft edges can follow it. Pass the handle to ScrollRow, and
 * to RowArrows when the arrows sit in the row's heading instead of over its edges.
 */
export function useScrollRow(): ScrollRowHandle {
  const [row, setRow] = useState<HTMLUListElement | null>(null);
  const still = useReducedMotion();
  const [state, setState] = useState<RowState>({ back: false, next: false, at: 0, shown: 1 });

  const measure = useCallback(() => {
    if (!row) return;
    // In a right-to-left page scrollLeft runs from 0 down to minus the overflow
    const done = Math.abs(row.scrollLeft);
    const overflow = row.scrollWidth - row.clientWidth;
    const next = {
      back: done > 4,
      next: overflow - done > 4,
      at: overflow > 0 ? Math.min(1, done / overflow) : 0,
      shown: row.scrollWidth > 0 ? Math.min(1, row.clientWidth / row.scrollWidth) : 1,
    };
    setState((was) =>
      was.back === next.back &&
      was.next === next.next &&
      Math.abs(was.at - next.at) < 0.005 &&
      Math.abs(was.shown - next.shown) < 0.005
        ? was
        : next,
    );
  }, [row]);

  useEffect(() => {
    if (!row) return;
    // The observer measures once as it starts, then on every change of size
    row.addEventListener("scroll", measure, { passive: true });
    const resize = new ResizeObserver(measure);
    resize.observe(row);
    return () => {
      row.removeEventListener("scroll", measure);
      resize.disconnect();
    };
  }, [row, measure]);

  const scroll = useCallback(
    (way: 1 | -1) => {
      if (!row) return;
      const rtl = getComputedStyle(row).direction === "rtl" ? -1 : 1;
      row.scrollBy({
        left: way * rtl * row.clientWidth * 0.85,
        behavior: still ? "auto" : "smooth",
      });
    },
    [row, still],
  );

  return { attach: setRow, state, scroll };
}

/**
 * Back and on for a row, as one pill of two round buttons: for a row's heading on a wider
 * screen, where a phone swipes instead. Each dims when there is nothing more that way, and
 * the pair goes when everything already shows.
 */
export function RowArrows({ row, className }: { row: ScrollRowHandle; className?: string }) {
  const { shelfCopy } = useText(galleryText);
  const { back, next } = row.state;
  if (!back && !next) return null;
  const button =
    "grid size-11 cursor-pointer place-items-center rounded-full text-ink transition-[background-color,color,transform] duration-200 hover:bg-surface-2 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-default disabled:text-ink-faint disabled:opacity-60 disabled:hover:bg-transparent disabled:active:scale-100 motion-still:transition-none";
  return (
    <div
      className={cn(
        "hidden items-center gap-0.5 rounded-full border border-line bg-surface p-0.5 shadow-raised md:inline-flex",
        className,
      )}
    >
      <button
        type="button"
        aria-label={shelfCopy.back}
        disabled={!back}
        onClick={() => row.scroll(-1)}
        className={button}
      >
        <ChevronLeft aria-hidden className="size-5 rtl:rotate-180" />
      </button>
      <span aria-hidden className="h-5 w-px bg-line" />
      <button
        type="button"
        aria-label={shelfCopy.next}
        disabled={!next}
        onClick={() => row.scroll(1)}
        className={button}
      >
        <ChevronRight aria-hidden className="size-5 rtl:rotate-180" />
      </button>
    </div>
  );
}

/**
 * A list that scrolls sideways the way large shops show a catalogue: no scrollbar, the next
 * item peeking in at the edge to be swiped on a phone. On a wider screen the edges fade
 * while there is more that way, with round arrows over them, or in the row's heading when
 * a handle is passed (see RowArrows). A thin gold line under the row shows how far along it is.
 */
export function ScrollRow({
  className,
  children,
  label,
  row: given,
  track = false,
}: {
  /** The list's own classes: its flex or grid, gaps, and where it stops scrolling. */
  className?: string;
  children: ReactNode;
  /** Names the list for screen readers when the heading above does not. */
  label?: string;
  /** The row's handle, when its arrows sit in the heading; the arrows then stay off its edges. */
  row?: ScrollRowHandle;
  /** Shows the progress line under the row while it scrolls. */
  track?: boolean;
}) {
  const { shelfCopy } = useText(galleryText);
  const own = useScrollRow();
  const { attach, state, scroll } = given ?? own;
  const { back, next, at, shown } = state;

  const arrow =
    "absolute top-1/2 z-10 hidden size-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-line bg-surface/90 text-ink shadow-float backdrop-blur-md transition-[background-color,border-color,transform] duration-200 hover:scale-105 hover:border-line-strong hover:bg-surface active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:grid motion-still:transition-none motion-still:hover:scale-100";

  return (
    <div className="relative">
      <ul
        ref={attach}
        aria-label={label}
        data-more-back={back || undefined}
        data-more-next={next || undefined}
        className={cn("scrollbar-none row-fade", className)}
      >
        {children}
      </ul>
      {!given && back && (
        <button
          type="button"
          aria-label={shelfCopy.back}
          onClick={() => scroll(-1)}
          className={cn(arrow, "start-2")}
        >
          <ChevronLeft aria-hidden className="size-5 rtl:rotate-180" />
        </button>
      )}
      {!given && next && (
        <button
          type="button"
          aria-label={shelfCopy.next}
          onClick={() => scroll(1)}
          className={cn(arrow, "end-2")}
        >
          <ChevronRight aria-hidden className="size-5 rtl:rotate-180" />
        </button>
      )}
      {track && (back || next) && (
        <div
          aria-hidden
          className="relative mx-auto mt-3 h-0.5 w-24 overflow-hidden rounded-full bg-line sm:w-32"
        >
          <span
            className="absolute inset-y-0 start-0 rounded-full bg-marigold transition-[inset-inline-start] duration-150 ease-out motion-still:transition-none"
            style={
              {
                width: `${shown * 100}%`,
                insetInlineStart: `${at * (1 - shown) * 100}%`,
              } as CSSProperties
            }
          />
        </div>
      )}
    </div>
  );
}
