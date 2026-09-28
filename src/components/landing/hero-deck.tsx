"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { landingText } from "@/i18n/copy/landing";
import { cn } from "@/lib/cn";
import { PAINTED_SUITES as ALL_PAINTED } from "@/lib/gallery/catalog";
import { textArea } from "@/lib/suites/areas";
import { SUITES } from "@/lib/suites/catalog";
import { useMediaQuery } from "@/lib/use-media-query";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const noSubscribe = () => () => {};

/** The deck prints a couple's names, so it deals only the wedding themes. */
const PAINTED_SUITES = ALL_PAINTED.filter((suite) => !SUITES[suite].occasions);

/** How long each theme leads the deck before the next comes forward. */
const TURN_MS = 4500;

/**
 * The first screen's picture: the painted themes fanned like a hand of cards, the one in
 * front printed with a couple's names the way guests see it. The deck turns by itself
 * (never in still mode, and it pauses while the pointer or focus is on it); the theme
 * names under it bring any one forward.
 */
export function HeroDeck() {
  const { hero, homeGallery } = useText(landingText);
  const { suiteCopy } = useText(editorText);
  const still = useReducedMotion();
  // Below the sm breakpoint the dots are too small to tap, so they leave the tab order
  const phone = useMediaQuery("(width < 40rem)");
  const [current, setCurrent] = useState(0);
  const [held, setHeld] = useState(false);
  const total = PAINTED_SUITES.length;
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

  const front = PAINTED_SUITES[current]!;
  const area = textArea(front, "cover");

  return (
    <div
      data-deck-live={live}
      className="flex flex-col items-center gap-6"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <div
        role="img"
        aria-label={`${homeGallery.deckLabel}: ${suiteCopy.names[front]}`}
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
        {PAINTED_SUITES.map((suite, index) => {
          // Where this card sits in the fan: 0 in front, then alternating to either side
          let offset = index - current;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;
          const away = Math.abs(offset);
          const shown = away <= 2;
          return (
            <div
              key={suite}
              data-suite={suite}
              data-mood="dusk"
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
                src={SUITES[suite].images.cover!}
                alt=""
                fill
                priority={away <= 1}
                sizes="(min-width: 64rem) 17rem, 55vw"
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
                    {hero.card.families}
                  </span>
                  <span className="font-display text-[1.9rem] leading-none sm:text-[2.2rem]">
                    {hero.card.first}
                  </span>
                  <span className="font-display text-lg leading-none text-card-accent-text">
                    {hero.card.joiner}
                  </span>
                  <span className="font-display text-[1.9rem] leading-none sm:text-[2.2rem]">
                    {hero.card.second}
                  </span>
                  <span className="mt-1 font-label text-[0.6rem] tracking-[0.2em] text-card-ink-muted uppercase sm:text-[0.68rem]">
                    {homeGallery.coverDate}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/*
        Eight 44px dots do not fit one row on a phone, so phones step through the themes
        with the arrows and the dots only show where you are; wider screens can tap a dot.
      */}
      <div className="flex items-center justify-center gap-1">
        <DeckArrow
          label={homeGallery.previousTheme}
          onClick={() => setCurrent((index) => (index - 1 + total) % total)}
        >
          <ChevronLeft aria-hidden className="size-5 rtl:rotate-180" />
        </DeckArrow>
        <ul aria-label={homeGallery.deckLabel} className="flex items-center sm:gap-0.5">
          {PAINTED_SUITES.map((suite, index) => (
            <li key={suite} className="flex">
              <button
                type="button"
                aria-pressed={index === current}
                aria-label={homeGallery.showTheme(suiteCopy.names[suite])}
                onClick={() => setCurrent(index)}
                className="group grid h-11 w-4 cursor-pointer place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-ring max-sm:pointer-events-none max-sm:w-auto max-sm:px-[3px] sm:w-11"
                tabIndex={phone ? -1 : undefined}
              >
                <span
                  aria-hidden
                  className={cn(
                    "block h-2 rounded-full transition-[width,background-color] duration-300 sm:h-2.5 motion-still:transition-none",
                    index === current
                      ? "w-5 bg-marigold sm:w-7"
                      : "w-2 bg-line-strong group-hover:bg-ink-faint sm:w-2.5",
                  )}
                />
              </button>
            </li>
          ))}
        </ul>
        <DeckArrow
          label={homeGallery.nextTheme}
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
