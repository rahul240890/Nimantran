"use client";

import { Hand, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { SuiteBackdrop } from "@/components/invitation/story/suite-backdrop";
import { cn } from "@/lib/cn";
import { usePaintingBlur } from "@/lib/paintings";
import { SUITES, type SuiteId } from "@/lib/suites/catalog";
import { useVisitSeed } from "@/lib/suites/section-dress";
import type { CardLanguage } from "@/lib/templates/card-languages";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/*
 * Save the date as a scratch card (prototype, 2026-11-11): a foil sticker over the wedding
 * day that the guest rubs away with a finger or the mouse. Each visit draws its own sticker:
 * a shape (round, arch, tile or ticket), a foil (gold, rose gold, silver or kumkum), a
 * pattern pressed into it, and the way the day arrives once it is scratched (petals,
 * sparkles or confetti). Until the first touch the foil glints and a hand shows how. Once
 * about half is gone the rest falls away by itself. A button under it shows the date at
 * once, for the keyboard, screen readers and anyone who would rather not scratch.
 * ?scratch=N fixes the draw, to review one sticker.
 */

/** The sticker's few words, in the card's language. Drafts for a native proofreader. */
const SCRATCH_WORDS: Record<CardLanguage, { scratch: string; show: string }> = {
  en: { scratch: "Scratch to reveal", show: "Show the date" },
  hi: { scratch: "खुरचकर देखें", show: "तारीख दिखाएँ" },
  mr: { scratch: "खरवडून पाहा", show: "तारीख दाखवा" },
  gu: { scratch: "ઘસીને જુઓ", show: "તારીખ બતાવો" },
  bn: { scratch: "ঘষে দেখুন", show: "তারিখ দেখান" },
  ta: { scratch: "சுரண்டிப் பாருங்கள்", show: "தேதியைக் காட்டு" },
};

const SHAPES = ["round", "arch", "tile", "ticket"] as const;
const FOILS = ["gold", "rose", "silver", "kumkum"] as const;
const PATTERNS = ["speckle", "stripes", "rings"] as const;
const BURSTS = ["petals", "sparkles", "confetti"] as const;
type Shape = (typeof SHAPES)[number];
type Foil = (typeof FOILS)[number];

/** Each shape's frame: its proportions and how its edge is cut, on the foil and the day alike. */
const SHAPE_CLASS: Record<Shape, string> = {
  round: "aspect-square w-[min(72vw,19rem)] rounded-full",
  arch: "aspect-[4/5] w-[min(66vw,17rem)] rounded-t-full rounded-b-3xl",
  tile: "aspect-square w-[min(70vw,18rem)] rotate-3 rounded-[2rem]",
  ticket: "scratch-ticket aspect-[5/4] w-[min(80vw,21rem)] rounded-2xl",
};

const noSubscribe = () => () => {};

/** Share of the foil that must be rubbed away before the rest falls by itself. */
const CLEARED = 0.45;

type ScratchDateProps = {
  suite: SuiteId;
  /** The day, YYYY-MM-DD. */
  date: string;
  /** "Save the date", in the card's language. */
  label: string;
  lang: CardLanguage;
};

export function ScratchDate({ suite: suiteId, date, label, lang }: ScratchDateProps) {
  const suite = SUITES[suiteId];
  const themed = suite.art !== "card";
  const image = suite.images.family ?? suite.images.cover;
  const blur = usePaintingBlur(image);
  const still = useReducedMotion();
  const words = SCRATCH_WORDS[lang];
  const look = useScratchLook();
  const [revealed, setRevealed] = useState(false);
  const [touched, setTouched] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const parts = dateParts(date, lang);

  // Lays the foil: its colours, a sheen, the pattern pressed into it and its words
  useEffect(() => {
    const node = canvas.current;
    if (!node || revealed) return;
    const paint = () => {
      const box = node.getBoundingClientRect();
      if (box.width === 0) return;
      const scale = window.devicePixelRatio || 1;
      node.width = Math.round(box.width * scale);
      node.height = Math.round(box.height * scale);
      const ctx = node.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      const { width: w, height: h } = box;
      const colours = foilColours(node, look.foil);
      ctx.globalCompositeOperation = "source-over";
      const base = ctx.createLinearGradient(0, 0, w, h);
      base.addColorStop(0, colours.light);
      base.addColorStop(0.45, colours.base);
      base.addColorStop(0.7, colours.light);
      base.addColorStop(1, colours.deep);
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = colours.mark;
      ctx.strokeStyle = colours.mark;
      if (look.pattern === "speckle") {
        for (let i = 0; i < 320; i++) {
          ctx.globalAlpha = 0.15 + ((i * 37) % 10) / 30;
          ctx.fillRect(((i * 97) % 997) * (w / 997), ((i * 61) % 991) * (h / 991), 1.6, 1.6);
        }
      } else if (look.pattern === "stripes") {
        ctx.globalAlpha = 0.18;
        ctx.lineWidth = 6;
        for (let x = -h; x < w + h; x += 18) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x + h, h);
          ctx.stroke();
        }
      } else {
        // Rings round the middle, like a rangoli pressed into the foil
        ctx.globalAlpha = 0.22;
        ctx.lineWidth = 1.5;
        for (let r = 14; r < Math.max(w, h); r += 14) {
          ctx.beginPath();
          ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = colours.ink;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const family = getComputedStyle(document.documentElement)
        .getPropertyValue("--font-card-label")
        .trim();
      ctx.font = `600 ${Math.round(Math.min(w, h) * 0.085)}px ${family || "serif"}`;
      ctx.fillText(words.scratch, w / 2, h * 0.42, w * 0.82);
    };
    paint();
    void document.fonts?.ready.then(paint);
  }, [revealed, words.scratch, look.foil, look.pattern]);

  // Rubbing: each stroke clears a soft round path; enough cleared and the foil falls away
  const drawing = useRef<{ x: number; y: number } | null>(null);
  const strokes = useRef(0);
  const rub = (x: number, y: number) => {
    const node = canvas.current;
    const ctx = node?.getContext("2d");
    if (!node || !ctx) return;
    if (!touched) setTouched(true);
    const box = node.getBoundingClientRect();
    const at = { x: x - box.left, y: y - box.top };
    const from = drawing.current ?? at;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(28, box.width * 0.13);
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(at.x, at.y);
    ctx.stroke();
    drawing.current = at;
    // Checking every pixel is slow on a phone, so only every few strokes
    strokes.current += 1;
    if (strokes.current % 6 === 0 && clearedShare(node, look.shape) >= CLEARED) setRevealed(true);
  };

  return (
    <section
      aria-labelledby="save-the-date"
      data-suite={suiteId}
      data-mood="day"
      className={cn(
        "story-scroll-page relative isolate flex h-svh justify-center overflow-hidden",
        "-mt-[9svh] [mask-image:linear-gradient(to_bottom,transparent,black_9svh)]",
        "pointer-events-none [&_:is(button,canvas)]:pointer-events-auto",
        themed ? "bg-suite-near" : "bg-card-back",
      )}
    >
      {/* On wide screens the painting, blurred, fills the sides, as the pages do */}
      {themed && (
        <div aria-hidden className="absolute inset-0 hidden md:block">
          <SuiteBackdrop
            suite={suite}
            image={image}
            placeholder={blur}
            className="absolute inset-0 scale-110 opacity-70 blur-2xl"
          />
          <div className="absolute inset-0 bg-scrim/40" />
        </div>
      )}
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden md:max-w-[min(100%,calc(100svh*768/1365))] md:shadow-overlay">
        {themed && (
          <div aria-hidden className="absolute inset-0">
            <SuiteBackdrop
              suite={suite}
              image={image}
              placeholder={blur}
              className="absolute inset-0 overflow-hidden"
            />
            <div className="absolute inset-0 bg-card-ivory/35" />
          </div>
        )}
        <div className="relative z-10 flex w-full max-w-md flex-col items-center justify-center gap-5 px-6 text-center">
          <h2
            id="save-the-date"
            lang={lang}
            className="font-card-label text-sm tracking-[0.3em] text-card-accent-text uppercase"
          >
            {label}
          </h2>
          <div
            data-shape={look.shape}
            className={cn(
              "relative",
              SHAPE_CLASS[look.shape],
              // Until the first touch the sticker breathes, asking to be scratched
              !touched && !revealed && !still && "scratch-breathe",
            )}
          >
            {/* The day under the foil */}
            <div
              lang={lang}
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center gap-1 overflow-hidden [border-radius:inherit] border-2 border-card-gold bg-card-ivory text-card-ink shadow-overlay",
                revealed && !still && "scratch-pop",
              )}
            >
              <span className="font-card-label text-sm tracking-[0.2em] text-card-ink-muted uppercase">
                {parts.weekday}
              </span>
              <span className="font-card-display text-[4.5rem] leading-none font-semibold">
                {parts.day}
              </span>
              <span className="font-card-display text-2xl leading-tight">{parts.monthYear}</span>
            </div>
            {!revealed && (
              <canvas
                ref={canvas}
                aria-hidden
                className="absolute inset-0 size-full cursor-grab touch-none [border-radius:inherit] shadow-overlay"
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  drawing.current = null;
                  rub(event.clientX, event.clientY);
                }}
                onPointerMove={(event) => {
                  // A mouse rubs only while pressed; a finger or pen whenever it moves on the foil
                  if (event.pointerType === "mouse" && event.buttons === 0) return;
                  rub(event.clientX, event.clientY);
                }}
                onPointerUp={() => {
                  drawing.current = null;
                  const node = canvas.current;
                  if (node && clearedShare(node, look.shape) >= CLEARED) setRevealed(true);
                }}
              />
            )}
            {/* A glint across the foil and a hand showing how, until the first touch */}
            {!touched && !revealed && !still && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 overflow-hidden [border-radius:inherit]"
              >
                <span className="scratch-glint absolute inset-y-0 -left-1/2 w-1/3" />
                <Hand className="scratch-hand absolute top-[62%] left-[38%] size-9 text-card-ivory drop-shadow-md" />
              </span>
            )}
            {revealed && !still && <Burst kind={look.burst} />}
          </div>
          {/* The date in words for screen readers, and the way to it without scratching */}
          <p className="sr-only" aria-live="polite">
            {revealed ? `${parts.weekday} ${parts.day} ${parts.monthYear}` : ""}
          </p>
          <button
            type="button"
            onClick={() => setRevealed(true)}
            disabled={revealed}
            className={cn(
              "inline-flex min-h-11 items-center gap-2 rounded-full bg-night/45 px-5 text-ui text-card-ivory backdrop-blur-sm transition-opacity hover:bg-night/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-still:transition-none",
              revealed && "pointer-events-none opacity-0",
            )}
          >
            <Sparkles aria-hidden className="size-4" />
            {words.show}
          </button>
        </div>
      </div>
    </section>
  );
}

/** This visit's sticker: from the visit's own seed, or ?scratch=N to review one. */
function useScratchLook() {
  const seed = useVisitSeed();
  // Read only once hydrated, so the first paint matches the server's
  const asked = useSyncExternalStore(
    noSubscribe,
    () => Number(new URLSearchParams(window.location.search).get("scratch") ?? NaN),
    () => NaN,
  );
  const n = Number.isInteger(asked) && asked >= 0 ? asked : seed;
  return {
    shape: SHAPES[n % SHAPES.length]!,
    foil: FOILS[Math.floor(n / SHAPES.length) % FOILS.length]!,
    pattern: PATTERNS[Math.floor(n / 7) % PATTERNS.length]!,
    burst: BURSTS[Math.floor(n / 5) % BURSTS.length]!,
  };
}

/** The foil's colours, from the card's own tokens, mixed by the page for the canvas. */
function foilColours(node: HTMLElement, foil: Foil) {
  const style = getComputedStyle(node);
  const token = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;
  const gold = token("--card-gold", "goldenrod");
  const accent = token("--card-accent", "firebrick");
  const ink = token("--card-ink", "black");
  const ivory = token("--card-ivory", "white");
  const rose = token("--rose", "palevioletred");
  const kumkum = token("--card-back", "maroon");
  const mix = (a: string, share: number, b: string) => `color-mix(in oklab, ${a} ${share}%, ${b})`;
  const set: Record<
    Foil,
    { base: string; light: string; deep: string; mark: string; ink: string }
  > = {
    gold: {
      base: gold,
      light: mix(gold, 55, ivory),
      deep: mix(gold, 70, ink),
      mark: ivory,
      ink,
    },
    rose: {
      base: mix(gold, 45, rose),
      light: mix(rose, 35, ivory),
      deep: mix(rose, 75, ink),
      mark: ivory,
      ink,
    },
    silver: {
      base: mix(ivory, 70, ink),
      light: ivory,
      deep: mix(ivory, 45, ink),
      mark: ivory,
      ink,
    },
    kumkum: {
      base: kumkum,
      light: mix(kumkum, 70, accent),
      deep: mix(kumkum, 70, ink),
      mark: gold,
      ink: ivory,
    },
  };
  // A canvas may not read every CSS colour (color-mix), so the page resolves each first
  const probe = document.createElement("span");
  node.parentElement?.append(probe);
  const resolve = (colour: string) => {
    probe.style.color = colour;
    return getComputedStyle(probe).color;
  };
  const chosen = set[foil];
  const out = {
    base: resolve(chosen.base),
    light: resolve(chosen.light),
    deep: resolve(chosen.deep),
    mark: resolve(chosen.mark),
    ink: resolve(chosen.ink),
  };
  probe.remove();
  return out;
}

/** The day arriving: petals, sparkles or confetti flying out from the sticker. */
function Burst({ kind }: { kind: (typeof BURSTS)[number] }) {
  const pieces = Array.from({ length: kind === "sparkles" ? 14 : 22 }, (_, i) => i);
  return (
    <span aria-hidden data-burst-wrap className="pointer-events-none absolute inset-0 z-20">
      {pieces.map((i) => {
        const angle = (i / pieces.length) * Math.PI * 2 + (i % 3) * 0.2;
        const far = 55 + ((i * 29) % 45);
        return (
          <span
            key={i}
            data-burst={kind}
            className="scratch-piece absolute top-1/2 left-1/2"
            style={
              {
                "--bx": `${(Math.cos(angle) * far) / 7}rem`,
                "--by": `${(Math.sin(angle) * far) / 7}rem`,
                "--br": `${(i * 47) % 360}deg`,
                "--bd": `${(i % 5) * 40}ms`,
              } as CSSProperties
            }
          />
        );
      })}
    </span>
  );
}

/** How much of the foil has been rubbed away, sampling a grid inside its shape. */
function clearedShare(node: HTMLCanvasElement, shape: Shape): number {
  const ctx = node.getContext("2d");
  const { width: w, height: h } = node;
  if (!ctx || w === 0) return 0;
  const { data } = ctx.getImageData(0, 0, w, h);
  const r = Math.min(w, h) / 2;
  const step = Math.max(4, Math.round(Math.min(w, h) / 80));
  let clear = 0;
  let seen = 0;
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (shape === "round" && (x - w / 2) ** 2 + (y - h / 2) ** 2 > r * r) continue;
      seen += 1;
      if (data[(y * w + x) * 4 + 3]! < 32) clear += 1;
    }
  }
  return seen ? clear / seen : 0;
}

/** The day in the card's language: weekday, day number, month and year. */
function dateParts(iso: string, lang: CardLanguage) {
  const at = new Date(`${iso}T12:00:00`);
  const locale = `${lang}-IN`;
  const fmt = (options: Intl.DateTimeFormatOptions) =>
    Number.isNaN(at.getTime()) ? "" : new Intl.DateTimeFormat(locale, options).format(at);
  return {
    weekday: fmt({ weekday: "long" }),
    day: fmt({ day: "numeric" }),
    monthYear: fmt({ month: "long", year: "numeric" }),
  };
}
