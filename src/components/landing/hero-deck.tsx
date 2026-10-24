"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import type { TextArea } from "@/lib/suites/areas";
import type { SuiteId } from "@/lib/suites/catalog";
import { useMediaQuery } from "@/lib/use-media-query";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const noSubscribe = () => () => {};

/** At most this many dots show, a window that slides along with the deck. */
const MAX_DOTS = 7;

/** How long each theme leads the deck before the next comes forward. */
const TURN_MS = 4500;

/** One theme in the deck, looked up on the server so the themes' catalogue stays off the page's scripts. */
export type DeckCard = {
  suite: SuiteId;
  /** The theme's name in the page's language. */
  name: string;
  cover: string;
  /** Where the names print on the cover. */
  area: TextArea;
  /** Its dot's name: "Show Rajwada Bagh". */
  show: string;
};

/** The deck's words, from the landing copy on the server. */
export type DeckCopy = {
  /** The couple's names and the date printed on the front card. */
  card: { families: string; first: string; joiner: string; second: string; date: string };
  deckLabel: string;
  previousTheme: string;
  nextTheme: string;
};

/**
 * The first screen's picture: the painted themes fanned like a hand of cards, the one in
 * front printed with a couple's names the way guests see it. The deck turns by itself
 * (never in still mode, and it pauses while the pointer or focus is on it); the theme
 * names under it bring any one forward.
 */
export function HeroDeck({ cards, copy }: { cards: readonly DeckCard[]; copy: DeckCopy }) {
  const still = useReducedMotion();
  // Below the sm breakpoint the dots are too small to tap, so they leave the tab order
  const phone = useMediaQuery("(width < 40rem)");
  const [current, setCurrent] = useState(0);
  const [held, setHeld] = useState(false);
  const total = cards.length;
  // Marks when the deck answers taps, for tests that wait for the page to come alive
  const live = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (still || held) return;
    const timer = setInterval(() => setCurrent((index) => (index + 1) % total), TURN_MS);
    return () => clearInterval(timer);
  }, [still, held, total]);

  const front = cards[current]!;
  // The dots' window keeps the front theme near its middle
  const dots = Math.min(MAX_DOTS, total);
  const first = Math.min(Math.max(current - Math.floor(dots / 2), 0), total - dots);
  const windowed = cards.slice(first, first + dots);
  const { area } = front;

  return (
    <div
      data-deck-live={live}
      className="flex w-full min-w-0 flex-col items-center gap-6"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <div
        role="img"
        aria-label={`${copy.deckLabel}: ${front.name}`}
        // Painted invitation cards: their lettering, not the site's (globals.css)
        data-invitation
        className="relative isolate aspect-[4/5] w-full max-w-[26rem] sm:max-w-[30rem]"
      >
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 -z-10 aspect-square w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in srgb, var(--marigold) 34%, transparent), color-mix(in srgb, var(--rose) 10%, transparent) 60%, transparent)",
          }}
        />
        {cards.map(({ suite, cover }, index) => {
          // Where this card sits in the fan: 0 in front, then alternating to either side
          let offset = index - current;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;
          const away = Math.abs(offset);
          const shown = away <= 2;
          // Only the fan and the next card either side are drawn: the hundreds of themes behind
          // them would fill the page with pictures nobody sees. The next card waits unseen, so
          // it still slides in as the deck turns
          if (away > 3) return null;
          return (
            <div
              key={suite}
              data-suite={suite}
              data-mood="dusk"
              data-front={offset === 0 || undefined}
              className={cn(
                "absolute top-[4%] left-1/2 aspect-[9/16] h-[92%] overflow-hidden rounded-[1.4rem] border border-card-ivory/40 bg-night shadow-overlay",
                "transition-[transform,opacity] duration-700 ease-out-expo motion-still:transition-none",
              )}
              style={{
                transform: `translateX(calc(-50% + ${offset * 24}%)) rotate(${offset * 7}deg) scale(${1 - away * 0.09})`,
                zIndex: 10 - away,
                opacity: shown ? 1 - away * 0.12 : 0,
              }}
            >
              <Image
                src={cover}
                alt=""
                fill
                // The card in front is fetched at once; the ones fanned behind it in turn
                loading={away === 0 ? "eager" : "lazy"}
                // A card is about 0.65 of the deck's width: 60vw on a phone, 19.5rem from sm up
                sizes="(min-width: 40rem) 19.5rem, 60vw"
                className="object-cover"
              />
              {offset === 0 && (
                <div
                  className="story-print absolute flex animate-fade-in flex-col items-center justify-center gap-1 text-center text-card-ink"
                  data-tone="light"
                  style={{
                    top: `${area.top}%`,
                    bottom: `${area.bottom}%`,
                    left: `${area.left + 6}%`,
                    right: `${area.right + 6}%`,
                  }}
                >
                  <span className="font-label text-[0.55rem] tracking-[0.3em] text-card-gold-text uppercase sm:text-[0.62rem]">
                    {copy.card.families}
                  </span>
                  <span className="font-display text-[1.9rem] leading-none sm:text-[2.2rem]">
                    {copy.card.first}
                  </span>
                  <span className="font-display text-lg leading-none text-card-accent-text">
                    {copy.card.joiner}
                  </span>
                  <span className="font-display text-[1.9rem] leading-none sm:text-[2.2rem]">
                    {copy.card.second}
                  </span>
                  <span className="mt-1 font-label text-[0.6rem] tracking-[0.2em] text-card-ink-muted uppercase sm:text-[0.68rem]">
                    {copy.card.date}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/*
        Seven 44px dots do not fit one row on a phone, so phones step through the themes
        with the arrows and the dots only show where you are; wider screens can tap a dot.
        Phone dots stay 24px wide so they pass the target-size check even before the page
        hydrates and takes them out of the tab order.
        With more themes than dots, the row slides and the end dots shrink to say so.
      */}
      <div className="flex max-w-full items-center justify-center gap-1">
        <DeckArrow
          label={copy.previousTheme}
          onClick={() => setCurrent((index) => (index - 1 + total) % total)}
        >
          <ChevronLeft aria-hidden className="size-5 rtl:rotate-180" />
        </DeckArrow>
        <ul aria-label={copy.deckLabel} className="flex items-center sm:gap-0.5">
          {windowed.map(({ suite, show }, slot) => {
            const index = first + slot;
            // An end dot with more themes beyond it
            const edge = (slot === 0 && first > 0) || (slot === dots - 1 && first + dots < total);
            return (
              <li key={suite} className="flex">
                <button
                  type="button"
                  aria-pressed={index === current}
                  aria-label={show}
                  onClick={() => setCurrent(index)}
                  className="group grid h-11 w-4 cursor-pointer place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-ring max-sm:pointer-events-none max-sm:w-6 sm:w-11"
                  tabIndex={phone ? -1 : undefined}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "block rounded-full transition-[width,height,background-color] duration-300 motion-still:transition-none",
                      index === current
                        ? "h-2 w-5 bg-marigold sm:h-2.5 sm:w-7"
                        : edge
                          ? "size-1.5 bg-line-strong group-hover:bg-ink-faint"
                          : "size-2 bg-line-strong group-hover:bg-ink-faint sm:size-2.5",
                    )}
                  />
                </button>
              </li>
            );
          })}
        </ul>
        <DeckArrow
          label={copy.nextTheme}
          onClick={() => setCurrent((index) => (index + 1) % total)}
        >
          <ChevronRight aria-hidden className="size-5 rtl:rotate-180" />
        </DeckArrow>
      </div>
    </div>
  );
}

/** A round 44px button beside the dots that steps the deck back or forward. */
function DeckArrow({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-ring"
    >
      {children}
    </button>
  );
}
