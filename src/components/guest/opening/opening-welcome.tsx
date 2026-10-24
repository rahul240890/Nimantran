"use client";

import { Image } from "@/components/ui/image";
import { useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { keepDate } from "@/lib/suites/lettering";
import { darkWelcome, type WelcomeScene } from "@/lib/opening/catalog";
import type { CardLanguage } from "@/lib/templates/card-languages";
import type { CardCopy } from "@/lib/templates/content";
import { CARD_GREETING_WORDS } from "@/lib/templates/story-words";
import { Toran } from "./opening-art";
import {
  Fireflies,
  Garden,
  Ghat,
  Kites,
  Mandala,
  Peacock,
  Rangoli,
  SkyLanterns,
  Sunrise,
  Waves,
} from "./welcome-scenes";

/*
 * The moment between the opening and the invitation (Step 12y, redrawn): the words alone,
 * large and calm, with the opening's own feeling moving softly around them. No initials;
 * the names, the invitation's line and the day are the whole of it. Every piece is sized
 * in the stage's container units and coloured from the theme (--open-* in globals.css).
 * Still mode never shows it: the pages come straight after the opening.
 */

const range = (count: number) => Array.from({ length: count }, (_, i) => i);

/** Spread a few things evenly but not in rows: the same places on server and client. */
const spread = (i: number, a: number, b: number, span: number, from: number) =>
  ((i * a + b) % span) + from;

/** Marigold and rose petals drifting down across the whole screen. */
function Petals({ count = 14 }: { count?: number }) {
  return range(count).map((i) => (
    <span
      key={i}
      className="welcome-petal absolute top-0"
      style={{ left: `${spread(i, 37, 5, 92, 3)}%`, "--i": i } as CSSProperties}
    >
      <span
        className={cn(
          "block h-[3.4cqw] w-[2.4cqw] rounded-[60%_10%_60%_10%]",
          i % 3 === 0
            ? "bg-(--marigold)"
            : i % 3 === 1
              ? "bg-(--open-petal-fall)"
              : "bg-(--open-jewel)",
        )}
      />
    </span>
  ));
}

/** A palace's welcome: a toran sways in over sun rays that turn slowly behind the names. */
function Royal() {
  return (
    <>
      <span className="welcome-rays absolute top-[46%] left-1/2 aspect-square w-[190cqh]" />
      <Toran count={9} className="welcome-toran top-0" />
      <Petals />
    </>
  );
}

/** A lotus opens behind the names, ring by ring, and petals drift down. */
function Bloom() {
  const ring = (count: number, length: number, width: number, fill: string, ring: number) =>
    range(count).map((i) => (
      <g
        key={`${ring}-${i}`}
        className="welcome-lotus-petal"
        style={{ "--a": `${(360 / count) * i + ring * 15}deg`, "--r": ring } as CSSProperties}
      >
        <path
          d={`M0 0 C${-width} ${-length * 0.35} ${-width * 0.7} ${-length * 0.85} 0 ${-length} C${width * 0.7} ${-length * 0.85} ${width} ${-length * 0.35} 0 0Z`}
          fill={fill}
          stroke="var(--open-gilt)"
          strokeWidth="0.5"
        />
      </g>
    ));
  return (
    <>
      <svg
        aria-hidden
        viewBox="-100 -100 200 200"
        className="welcome-lotus absolute top-[46%] left-1/2 w-[min(118cqw,72cqh)] -translate-1/2"
      >
        {ring(12, 96, 26, "var(--open-petal)", 0)}
        {ring(10, 72, 22, "color-mix(in oklab, var(--open-petal) 70%, var(--open-jewel))", 1)}
        {ring(8, 46, 16, "color-mix(in oklab, var(--open-light) 60%, var(--open-plate))", 2)}
      </svg>
      <Petals count={10} />
    </>
  );
}

/** Lamps along the floor light one by one, and their glow rises into the dark. */
function Lamps() {
  return (
    <>
      <div className="absolute inset-x-[4cqw] bottom-[11cqh] flex justify-between">
        {range(7).map((i) => (
          <svg
            key={i}
            viewBox="0 0 40 40"
            className="welcome-diya w-[10cqw] max-w-16"
            style={{ "--i": i } as CSSProperties}
          >
            <g className="welcome-flame">
              <path d="M20 4 C25 12 25 18 20 22 C15 18 15 12 20 4Z" fill="var(--marigold)" />
              <path
                d="M20 9 C22 14 22 17 20 20 C18 17 18 14 20 9Z"
                fill="var(--open-gilt-bright)"
              />
            </g>
            <path d="M3 24 H37 C35 33 28 37 20 37 C12 37 5 33 3 24Z" fill="var(--open-gilt)" />
            <path d="M3 24 H37" stroke="var(--open-gilt-dark)" strokeWidth="1.5" />
          </svg>
        ))}
      </div>
      {range(12).map((i) => (
        <span
          key={i}
          className="welcome-mote absolute bottom-[12cqh] rounded-full"
          style={{ left: `${spread(i, 29, 7, 88, 5)}%`, "--i": i } as CSSProperties}
        />
      ))}
    </>
  );
}

/** A crescent moon rises over twinkling stars, and lanterns sway from the top. */
function Night() {
  return (
    <>
      {range(22).map((i) => (
        <span
          key={i}
          className="welcome-star absolute rounded-full"
          style={
            {
              left: `${spread(i, 41, 3, 94, 3)}%`,
              top: `${spread(i, 23, 11, 70, 2)}%`,
              "--i": i,
            } as CSSProperties
          }
        />
      ))}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className="welcome-moon absolute top-[6cqh] right-[9cqw] w-[24cqw] max-w-36"
      >
        <defs>
          <mask id="welcome-crescent">
            <rect width="100" height="100" fill="white" />
            <circle cx="66" cy="38" r="38" fill="black" />
          </mask>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="var(--open-gilt-bright)"
          mask="url(#welcome-crescent)"
        />
      </svg>
      {[12, 30, 76].map((left, i) => (
        <span
          key={left}
          className="welcome-fanoos absolute top-0 flex flex-col items-center"
          style={{ left: `${left}%`, "--i": i, "--drop": `${[9, 15, 7][i]}cqh` } as CSSProperties}
        >
          <span className="welcome-fanoos-string w-px" />
          <svg viewBox="0 0 20 32" className="w-[6.5cqw] max-w-10">
            <path d="M10 0 L14 5 H6Z" fill="var(--open-gilt)" />
            <path d="M5 6 H15 L17 22 C17 26 3 26 3 22Z" fill="var(--open-gilt)" />
            <path
              d="M7 9 H13 L14 21 C14 23 6 23 6 21Z"
              fill="var(--marigold)"
              className="welcome-flame"
            />
            <path d="M8 27 H12 L10 32Z" fill="var(--open-gilt)" />
          </svg>
        </span>
      ))}
    </>
  );
}

const CONFETTI = [
  "var(--marigold)",
  "var(--open-gilt-bright)",
  "var(--open-petal-fall)",
  "var(--open-light)",
];

/** Confetti bursts out from behind the names, two sparkling rings open, and streamers fall. */
function Party() {
  return (
    <>
      {[0, 1].map((i) => (
        <span
          key={i}
          className="welcome-burst absolute top-[44%] left-1/2 aspect-square w-[90cqw] rounded-full"
          style={{ "--i": i } as CSSProperties}
        />
      ))}
      {range(36).map((i) => {
        const angle = (i / 36) * Math.PI * 2;
        const reach = 30 + ((i * 17) % 22);
        return (
          <span
            key={i}
            className="welcome-confetti absolute top-[44%] left-1/2"
            style={
              {
                "--x": `${(Math.cos(angle) * reach).toFixed(1)}cqw`,
                "--y": `${(Math.sin(angle) * reach * 0.9).toFixed(1)}cqh`,
                "--spin": `${(i * 47) % 360}deg`,
                "--i": i,
                background: CONFETTI[i % CONFETTI.length],
              } as CSSProperties
            }
          />
        );
      })}
      {range(8).map((i) => (
        <span
          key={i}
          className="welcome-streamer absolute top-0 w-[1.2cqw]"
          style={
            {
              left: `${spread(i, 31, 4, 90, 4)}%`,
              "--i": i,
              background: CONFETTI[i % CONFETTI.length],
            } as CSSProperties
          }
        />
      ))}
    </>
  );
}

/** A letter unfolds from its crease with gilt corners, and a little gold dust settles. */
function Letter() {
  return (
    <div className="welcome-sheet absolute inset-x-[6cqw] inset-y-[9cqh]">
      {(
        [
          "top-[2cqw] left-[2cqw]",
          "top-[2cqw] right-[2cqw] -scale-x-100",
          "bottom-[2cqw] left-[2cqw] -scale-y-100",
          "bottom-[2cqw] right-[2cqw] -scale-100",
        ] as const
      ).map((place) => (
        <svg
          key={place}
          aria-hidden
          viewBox="0 0 40 40"
          className={cn("absolute w-[12cqw] max-w-20", place)}
        >
          <path
            className="welcome-corner"
            pathLength={1}
            d="M2 38 V10 C2 5 5 2 10 2 H38 M8 32 V14 C8 10 10 8 14 8 H32 M14 14 C20 14 20 20 14 20"
            fill="none"
            stroke="var(--open-gilt)"
            strokeWidth="1.4"
          />
        </svg>
      ))}
      {range(10).map((i) => (
        <span
          key={i}
          className="welcome-dust absolute rounded-full"
          style={
            {
              left: `${spread(i, 37, 9, 84, 8)}%`,
              top: `${spread(i, 53, 7, 80, 10)}%`,
              "--i": i,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

const ART: Record<WelcomeScene, () => ReactNode> = {
  royal: Royal,
  bloom: Bloom,
  lamps: Lamps,
  night: Night,
  party: Party,
  letter: Letter,
  mandala: Mandala,
  peacock: Peacock,
  sunrise: Sunrise,
  garden: Garden,
  rangoli: Rangoli,
  ghat: Ghat,
  fireflies: Fireflies,
  "sky-lanterns": SkyLanterns,
  kites: Kites,
  waves: Waves,
};

/** Scenes with a horizon low down lift the words above it. */
const LIFTED: readonly WelcomeScene[] = ["lamps", "sunrise", "ghat", "waves", "peacock"];

/**
 * A template's own painted centre (templates 26 on): its picture, and the empty field in
 * it for the words, [top, bottom, left, right] in % of the painting.
 */
export type WelcomeCentre = {
  src: string;
  field: readonly [number, number, number, number];
  dark?: boolean;
};

export function OpeningWelcome({
  scene,
  copy,
  lang,
  guest,
  names,
  script,
  skip,
  seconds,
  over = false,
  centre,
  onSkip,
}: {
  scene: WelcomeScene;
  copy: CardCopy;
  lang: CardLanguage;
  guest: string | null;
  names: CSSProperties;
  script: CSSProperties;
  skip: string;
  /** How long it stays before moving on, for the thin line that fills along the bottom. */
  seconds: number;
  /** Over a painting the guest should still see round the names (the fresh openings). */
  over?: boolean;
  /**
   * The template's painted centre, in place of the scene: the picture its opening revealed,
   * with the words in its empty field.
   */
  centre?: WelcomeCentre;
  onSkip: () => void;
}) {
  const words = CARD_GREETING_WORDS[lang];
  const joiner = !copy.second.trim() ? "" : !copy.joiner || copy.joiner === "&" ? "&" : copy.joiner;
  // Over a painting the words sit on a veil of card stock, so they are always ink
  const dark = centre ? Boolean(centre.dark) : darkWelcome(scene) && !over;
  const Art = ART[scene];
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => button.current?.focus({ preventScroll: true }), []);
  const rise = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
  const eyebrow = guest ? `${words.dear} ${guest}` : copy.blessing.trim();
  const line = guest ? words.invited : copy.line.trim();
  const venue = copy.venue.trim();
  return (
    <div
      lang={lang}
      data-testid="opening-welcome"
      data-welcome={centre ? "centre" : scene}
      data-over={over && !centre ? "art" : undefined}
      data-tone={dark ? "dark" : "light"}
      onClick={onSkip}
      className="opening-welcome absolute inset-0 z-40 overflow-hidden"
    >
      <div aria-hidden className="absolute inset-0">
        {centre ? (
          // Placed as the opening's own layers are, so the picture it revealed stays put
          <div className="welcome-centre absolute top-1/2 left-1/2">
            <Image
              src={centre.src}
              alt=""
              fill
              sizes="(min-width: 40rem) 32rem, 100vw"
              className="object-cover"
            />
          </div>
        ) : (
          <Art />
        )}
      </div>
      <Field centre={centre}>
        <div
          className={cn(
            "relative flex flex-col items-center justify-center gap-[2cqh] text-center",
            centre ? "w-full origin-center" : "h-full",
            centre ? "px-[5cqw]" : scene === "letter" ? "px-[14cqw]" : "px-[8cqw]",
            !centre && LIFTED.includes(scene) && "pb-[14cqh]",
            !centre && scene === "royal" && "pt-[8cqh]",
          )}
        >
          {eyebrow && (
            <p
              className="welcome-rise welcome-accent max-w-[34ch] text-[clamp(0.95rem,4.6cqw,1.45rem)] text-balance"
              style={{ ...script, ...rise(350) }}
            >
              {eyebrow}
            </p>
          )}
          <p className="welcome-names flex flex-col items-center break-words" style={names}>
            <span
              className="welcome-name text-[clamp(2.2rem,min(13cqw,8cqh),4.6rem)]"
              style={rise(550)}
            >
              {copy.first}
            </span>
            {joiner && (
              <>
                <span
                  className="welcome-joiner welcome-accent text-[clamp(1.2rem,min(7cqw,4.5cqh),2.4rem)]"
                  style={rise(900)}
                >
                  {joiner}
                </span>
                <span
                  className="welcome-name text-[clamp(2.2rem,min(13cqw,8cqh),4.6rem)]"
                  style={rise(1050)}
                >
                  {copy.second}
                </span>
              </>
            )}
          </p>
          <span aria-hidden className="welcome-rule" style={rise(1350)} />
          {line && (
            <p
              className="welcome-rise welcome-soft max-w-[32ch] text-[clamp(0.85rem,3.8cqw,1.15rem)] text-balance"
              style={rise(1550)}
            >
              {line}
            </p>
          )}
          {(copy.date || venue) && (
            <div className="welcome-rise flex flex-col items-center gap-1" style={rise(1800)}>
              {copy.date && (
                <p
                  className={cn(
                    "welcome-date rounded-2xl px-[4cqw] py-[0.8cqh] text-[clamp(0.75rem,3.2cqw,1rem)] text-balance [font-variant-numeric:lining-nums]",
                    lang === "en" && "font-label tracking-[0.18em] uppercase",
                  )}
                >
                  {keepDate(copy.date)}
                </p>
              )}
              {venue && (
                <p className="welcome-soft text-[clamp(0.8rem,3.4cqw,1.05rem)] text-balance">
                  {venue}
                </p>
              )}
            </div>
          )}
        </div>
      </Field>
      <span
        aria-hidden
        className="welcome-progress absolute inset-x-0 bottom-0 h-[3px] origin-left"
        style={{ "--welcome-ms": `${seconds * 1000}ms` } as CSSProperties}
      />
      <button
        ref={button}
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onSkip();
        }}
        className="welcome-soft absolute end-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] inline-flex min-h-11 items-center rounded-full px-4 font-label text-xs tracking-[0.2em] uppercase focus-visible:outline-2 focus-visible:outline-ring"
      >
        {skip}
      </button>
    </div>
  );
}

/**
 * The words' room: the whole screen, or a painted centre's empty field, measured on the
 * painting as it is placed on the screen and sized in its own container units.
 */
function Field({ centre, children }: { centre?: WelcomeCentre; children: ReactNode }) {
  if (!centre) return children;
  return <CentreField field={centre.field}>{children}</CentreField>;
}

/**
 * A painted centre's field. The words keep their sizes but shrink together, never past the
 * field, when a longer language or a short phone leaves too little room for them.
 */
function CentreField({
  field: [top, bottom, left, right],
  children,
}: {
  field: WelcomeCentre["field"];
  children: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const room = box.current;
    const words = room?.firstElementChild;
    if (!room || !(words instanceof HTMLElement)) return;
    const fit = () => {
      const height = words.offsetHeight;
      const scale = height > room.clientHeight ? room.clientHeight / height : 1;
      words.style.scale = scale < 1 ? String(Math.floor(scale * 1000) / 1000) : "";
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(room);
    observer.observe(words);
    document.fonts?.addEventListener("loadingdone", fit);
    return () => {
      observer.disconnect();
      document.fonts?.removeEventListener("loadingdone", fit);
    };
  }, []);
  return (
    <div className="welcome-centre pointer-events-none absolute top-1/2 left-1/2">
      <div
        ref={box}
        className="[container-type:size] absolute flex items-center justify-center"
        style={{ top: `${top}%`, bottom: `${bottom}%`, left: `${left}%`, right: `${right}%` }}
      >
        {children}
      </div>
    </div>
  );
}
