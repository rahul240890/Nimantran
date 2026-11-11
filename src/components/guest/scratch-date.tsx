"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SuiteBackdrop } from "@/components/invitation/story/suite-backdrop";
import { cn } from "@/lib/cn";
import { usePaintingBlur } from "@/lib/paintings";
import { SUITES, type SuiteId } from "@/lib/suites/catalog";
import type { CardLanguage } from "@/lib/templates/card-languages";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/*
 * Save the date as a scratch card (prototype, 2026-11-11): a gold foil sticker over the
 * wedding day that the guest rubs away with a finger or the mouse. Once about half is gone
 * the rest falls away by itself. A button under it shows the date at once, for the
 * keyboard, screen readers and anyone who would rather not scratch.
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
  const [revealed, setRevealed] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const parts = dateParts(date, lang);

  // Lays the foil: the theme's gold, a soft sheen and its words
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
      ctx.scale(scale, scale);
      const style = getComputedStyle(node);
      const gold = style.getPropertyValue("--card-gold").trim() || "goldenrod";
      const ink = style.getPropertyValue("--card-ink").trim() || "black";
      const ivory = style.getPropertyValue("--card-ivory").trim() || "white";
      const { width: w, height: h } = box;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = gold;
      ctx.fillRect(0, 0, w, h);
      // A sheen across the foil, light to dark, so it reads as metal rather than paint
      const sheen = ctx.createLinearGradient(0, 0, w, h);
      sheen.addColorStop(0, "rgba(255,255,255,0.55)");
      sheen.addColorStop(0.35, "rgba(255,255,255,0)");
      sheen.addColorStop(0.6, "rgba(255,255,255,0.35)");
      sheen.addColorStop(1, "rgba(0,0,0,0.18)");
      ctx.fillStyle = sheen;
      ctx.fillRect(0, 0, w, h);
      // Fine speckle, like a lottery card's foil
      ctx.fillStyle = ivory;
      for (let i = 0; i < 260; i++) {
        ctx.globalAlpha = 0.12 + ((i * 37) % 10) / 40;
        ctx.fillRect(((i * 97) % 997) * (w / 997), ((i * 61) % 991) * (h / 991), 1.5, 1.5);
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = ink;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const family = getComputedStyle(document.documentElement)
        .getPropertyValue("--font-card-label")
        .trim();
      ctx.font = `600 ${Math.round(Math.min(w, h) * 0.085)}px ${family || "serif"}`;
      ctx.fillText(words.scratch, w / 2, h / 2, w * 0.86);
    };
    paint();
    void document.fonts?.ready.then(paint);
  }, [revealed, words.scratch]);

  // Rubbing: each stroke clears a soft round path; enough cleared and the foil falls away
  const drawing = useRef<{ x: number; y: number } | null>(null);
  const strokes = useRef(0);
  const rub = (x: number, y: number) => {
    const node = canvas.current;
    const ctx = node?.getContext("2d");
    if (!node || !ctx) return;
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
    if (strokes.current % 6 === 0 && clearedShare(node) >= CLEARED) setRevealed(true);
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
      {themed && (
        <div aria-hidden className="absolute inset-0">
          <SuiteBackdrop
            suite={suite}
            image={image}
            placeholder={blur}
            lazy
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
        <div className="relative aspect-square w-[min(72vw,19rem)]">
          {/* The day under the foil */}
          <div
            lang={lang}
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-full border-2 border-card-gold bg-card-ivory/95 text-card-ink shadow-overlay",
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
              className="absolute inset-0 size-full cursor-grab touch-none rounded-full shadow-overlay"
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
                if (node && clearedShare(node) >= CLEARED) setRevealed(true);
              }}
            />
          )}
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
    </section>
  );
}

/** How much of the round foil has been rubbed away, sampling a grid inside the circle. */
function clearedShare(node: HTMLCanvasElement): number {
  const ctx = node.getContext("2d");
  const { width: w, height: h } = node;
  if (!ctx || w === 0) return 0;
  const { data } = ctx.getImageData(0, 0, w, h);
  const r = Math.min(w, h) / 2;
  const step = Math.max(4, Math.round(r / 40));
  let clear = 0;
  let seen = 0;
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if ((x - w / 2) ** 2 + (y - h / 2) ** 2 > r * r) continue;
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
