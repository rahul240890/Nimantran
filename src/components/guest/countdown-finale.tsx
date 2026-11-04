"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { daysBetween, remaining, todayInIndia } from "@/lib/publish/countdown";
import type { SectionLayouts } from "@/lib/suites/section-layouts";
import type { CardLanguage } from "@/lib/templates/card-languages";
import { CARD_COUNTDOWN_WORDS, CARD_STORY_WORDS, daysAway } from "@/lib/templates/story-words";
import { useClock } from "@/lib/use-clock";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import "@/app/guest-countdown.css";

const noSubscribe = () => () => {};

export type CountdownStyle = SectionLayouts["countdown"];

type Cell = { value: number; unit: string; /** How full a ring is, 0 to 1. */ share: number };

/**
 * Save the date, counting down to the main event at the end of the guest page (owner,
 * 2026-11-04). Each theme draws it its own way (section-layouts.ts): arched frames hung on
 * a toran, lamps in their niches, lanterns on a wire, flowers in bloom, flip tiles, or
 * rings that fill. Drawn only in the browser, since the page is cached; gone once the day
 * has passed. Still mode drops the seconds and every movement.
 */
export function CountdownFinale({
  style,
  target,
  date,
  lang,
  className,
}: {
  style: CountdownStyle;
  /** When the main event starts, in milliseconds. */
  target: number;
  /** Its date, YYYY-MM-DD. */
  date: string;
  lang: CardLanguage;
  className?: string;
}) {
  const still = useReducedMotion();
  const now = useClock(still);
  const today = useSyncExternalStore(noSubscribe, todayInIndia, () => null);
  if (now === null || today === null) return null;
  const words = CARD_COUNTDOWN_WORDS[lang];
  const summary = daysAway(daysBetween(today, date), words);
  if (!summary) return null;
  const left = remaining(target, now * 1000);
  const cells: Cell[] = left
    ? [
        { value: left.days, unit: words.days, share: Math.min(1, left.days / 365) },
        { value: left.hours, unit: words.hours, share: left.hours / 24 },
        { value: left.minutes, unit: words.minutes, share: left.minutes / 60 },
        ...(still ? [] : [{ value: left.seconds, unit: words.seconds, share: left.seconds / 60 }]),
      ]
    : [];
  const [y, m, d] = date.split("-").map(Number);
  const longDate = new Intl.DateTimeFormat(`${lang}-IN`, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y!, m! - 1, d!)));

  return (
    <section
      aria-labelledby="guest-countdown"
      data-countdown={style}
      data-snap
      lang={lang}
      className={cn(
        "cd relative flex min-h-svh flex-col items-center justify-center gap-8 px-4 py-16 text-center sm:px-6",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <p className="font-label text-xs tracking-[0.3em] text-accent-text uppercase">
          {CARD_STORY_WORDS[lang].saveTheDate}
        </p>
        <h2
          id="guest-countdown"
          className="font-display text-[2rem] leading-tight text-balance break-words text-ink sm:text-[2.75rem]"
        >
          {words.countingDown}
        </h2>
      </div>
      {cells.length > 0 ? (
        <div
          role="timer"
          aria-label={summary}
          className={cn("cd-row relative grid w-full max-w-[36rem]", `cd-cols-${cells.length}`)}
        >
          {(style === "toran" || style === "lanterns") && <Wire style={style} />}
          {cells.map((cell) => (
            <div key={cell.unit} aria-hidden className="cd-cell flex min-w-0 flex-col items-center">
              <Piece style={style} cell={cell} />
              <span className="cd-unit mt-2 font-label text-[0.65rem] tracking-[0.18em] text-ink-muted uppercase sm:text-xs">
                {cell.unit}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="font-display text-4xl text-accent-text">{summary}</p>
      )}
      <p className="font-display text-xl text-balance text-ink sm:text-2xl">{longDate}</p>
    </section>
  );
}

/** The string the toran's frames and the lanterns hang from, across the whole row. */
function Wire({ style }: { style: "toran" | "lanterns" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 24"
      preserveAspectRatio="none"
      className="cd-wire pointer-events-none absolute inset-x-0 -top-3 h-6 w-full"
    >
      {style === "toran" ? (
        <>
          <path
            d="M0,4 Q50,22 100,4 Q150,22 200,4 Q250,22 300,4 Q350,22 400,4"
            className="cd-beads"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M0,4 Q50,22 100,4 Q150,22 200,4 Q250,22 300,4 Q350,22 400,4"
            className="cd-thread"
            vectorEffect="non-scaling-stroke"
          />
        </>
      ) : (
        <path d="M0,3 Q200,16 400,3" className="cd-thread" vectorEffect="non-scaling-stroke" />
      )}
    </svg>
  );
}

/** One unit of time, drawn in the theme's way. */
function Piece({ style, cell }: { style: CountdownStyle; cell: Cell }) {
  const number = String(cell.value).padStart(2, "0");
  if (style === "tiles") {
    return (
      <span className="cd-tile relative grid w-full place-items-center">
        {/* A new number flips down each time it changes */}
        <span key={number} className="cd-num cd-flip font-display tabular-nums">
          {number}
        </span>
      </span>
    );
  }
  const art: Record<Exclude<CountdownStyle, "tiles">, { box: string; draw: ReactNode }> = {
    toran: { box: "0 0 100 150", draw: <ToranFrame /> },
    diyas: { box: "0 0 100 150", draw: <DiyaNiche /> },
    lanterns: { box: "0 0 100 150", draw: <Lantern /> },
    bloom: { box: "0 0 100 100", draw: <Bloom /> },
    rings: { box: "0 0 100 100", draw: <Ring share={cell.share} /> },
  };
  const { box, draw } = art[style];
  return (
    <span className="cd-piece relative block w-full">
      <svg viewBox={box} className="cd-art block w-full overflow-visible">
        {draw}
      </svg>
      <span className="cd-num absolute inset-x-0 font-display leading-none tabular-nums">
        {number}
      </span>
    </span>
  );
}

/** An onion arch, cloth inside a gilt line and a jewel line, with a drop beneath. */
function ToranFrame() {
  const arch =
    "M10,132 V64 C10,44 24,32 37,28 C41,21 46,17 50,14 C54,17 59,21 63,28 C76,32 90,44 90,64 V132 Z";
  return (
    <g className="cd-sway">
      <line x1="50" y1="0" x2="50" y2="14" className="cd-gilt-line" />
      <circle cx="50" cy="7" r="2.6" className="cd-jewel" />
      <path d={arch} className="cd-cloth cd-gilt-edge" />
      <path
        d={arch}
        transform="translate(50 76) scale(0.84) translate(-50 -76)"
        className="cd-jewel-edge"
      />
      <line x1="50" y1="132" x2="50" y2="140" className="cd-gilt-line" />
      <circle cx="50" cy="143.5" r="3.5" className="cd-gilt" />
      <line x1="22" y1="132" x2="22" y2="137" className="cd-gilt-line" />
      <circle cx="22" cy="139" r="2" className="cd-jewel" />
      <line x1="78" y1="132" x2="78" y2="137" className="cd-gilt-line" />
      <circle cx="78" cy="139" r="2" className="cd-jewel" />
    </g>
  );
}

/** An arched niche in the wall, a lamp burning at its foot. */
function DiyaNiche() {
  return (
    <>
      <path
        d="M6,148 V52 C6,24 26,6 50,4 C74,6 94,24 94,52 V148 Z"
        className="cd-deep cd-gilt-edge"
      />
      <circle cx="50" cy="114" r="30" className="cd-glow" />
      <g className="cd-flame">
        <path d="M50,96 C43,107 43,120 50,125 C57,120 57,107 50,96 Z" className="cd-flame-outer" />
        <path d="M50,106 C47,112 47,120 50,123 C53,120 53,112 50,106 Z" className="cd-flame-core" />
      </g>
      <path d="M24,126 H76 C74,140 26,140 24,126 Z" className="cd-gilt" />
      <path d="M76,126 L86,121 L73,133 Z" className="cd-gilt" />
      <line x1="22" y1="126" x2="78" y2="126" className="cd-gilt-line" />
    </>
  );
}

/** A kandil lantern: gilt caps, a jewel body, and a glowing window for the number. */
function Lantern() {
  return (
    <g className="cd-sway">
      <line x1="50" y1="0" x2="50" y2="16" className="cd-gilt-line" />
      <path d="M36,16 H64 L74,28 H26 Z" className="cd-gilt" />
      <rect x="18" y="28" width="64" height="92" rx="18" className="cd-deep cd-gilt-edge" />
      <rect x="26" y="36" width="48" height="76" rx="12" className="cd-window" />
      <path d="M26,120 H74 L66,130 H34 Z" className="cd-gilt" />
      <line x1="50" y1="130" x2="50" y2="137" className="cd-gilt-line" />
      <path d="M46,137 H54 L57,149 H43 Z" className="cd-jewel" />
    </g>
  );
}

const PETALS = [0, 45, 90, 135, 180, 225, 270, 315];

/** Petals in two rings around a cloth disc. */
function Bloom() {
  return (
    <>
      <g className="cd-turn">
        {PETALS.map((angle) => (
          <ellipse
            key={`b${angle}`}
            cx="50"
            cy="20"
            rx="11"
            ry="19"
            transform={`rotate(${angle + 22.5} 50 50)`}
            className="cd-petal-back"
          />
        ))}
        {PETALS.map((angle) => (
          <ellipse
            key={`f${angle}`}
            cx="50"
            cy="18"
            rx="12"
            ry="17"
            transform={`rotate(${angle} 50 50)`}
            className="cd-petal cd-gilt-edge"
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="27" className="cd-cloth cd-gilt-edge" />
    </>
  );
}

/** A dial: a gilt track, the share filled in the jewel, twelve marks around. */
function Ring({ share }: { share: number }) {
  return (
    <>
      {Array.from({ length: 12 }, (_, i) => (
        <circle
          key={i}
          cx="50"
          cy="2.5"
          r="1.6"
          transform={`rotate(${i * 30} 50 50)`}
          className="cd-gilt"
        />
      ))}
      <circle cx="50" cy="50" r="41" className="cd-cloth" />
      <circle cx="50" cy="50" r="41" className="cd-track" />
      <circle
        cx="50"
        cy="50"
        r="41"
        pathLength={100}
        strokeDasharray={`${Math.max(0.5, share * 100)} 100`}
        transform="rotate(-90 50 50)"
        className="cd-fill"
      />
    </>
  );
}
