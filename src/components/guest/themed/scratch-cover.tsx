"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/*
 * A cover the guest rubs away with a finger to reveal what lies beneath, as the invitations
 * guests pass around do: turmeric over the haldi, henna over the mehendi, gold foil over the
 * date. What lies beneath is in the page all along, for screen readers and search; the cover
 * is drawn on a canvas over it, and a button reveals it in one tap for the keyboard or for a
 * guest who would rather not rub.
 */

export type CoverKind = "turmeric" | "henna" | "gold" | "petals";

/** How much of the cover must be rubbed away before the rest falls away by itself. */
const ENOUGH = 0.5;
/** The coverage grid: rubbing marks these cells, which is far cheaper than reading pixels. */
const COLUMNS = 24;

/** A small seeded random, so a cover looks the same at every visit and in every picture. */
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const COLOR_NAMES = [
  "reveal-turmeric",
  "reveal-turmeric-light",
  "reveal-turmeric-deep",
  "reveal-henna",
  "reveal-henna-light",
  "reveal-henna-deep",
  "reveal-gold",
  "reveal-gold-light",
  "reveal-gold-deep",
  "flower-rose",
  "flower-rose-deep",
  "flower-marigold",
  "flower-lotus",
  "flower-jasmine",
] as const;
type Colors = Record<(typeof COLOR_NAMES)[number], string>;

/** The cover's colours, from the tokens in globals.css. */
function readColors(element: HTMLElement): Colors {
  const style = getComputedStyle(element);
  return Object.fromEntries(
    COLOR_NAMES.map((name) => [name, style.getPropertyValue(`--${name}`).trim()]),
  ) as Colors;
}

/** Paints the cover: a paste, a pattern, a foil or a heap of petals. */
function paint(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  kind: CoverKind,
  colors: Colors,
) {
  const random = seeded(width * 31 + height);
  const area = width * height;
  context.globalCompositeOperation = "source-over";
  context.clearRect(0, 0, width, height);

  if (kind === "turmeric") {
    // A thick paste, smeared by hand: blotches lighter and deeper, and the marks of fingers
    context.fillStyle = colors["reveal-turmeric"];
    context.fillRect(0, 0, width, height);
    for (let i = 0; i < area / 260; i++) {
      const x = random() * width;
      const y = random() * height;
      const r = (0.008 + random() * 0.03) * width;
      const blot = context.createRadialGradient(x, y, 0, x, y, r);
      const tone =
        random() < 0.5 ? colors["reveal-turmeric-light"] : colors["reveal-turmeric-deep"];
      blot.addColorStop(0, tone);
      blot.addColorStop(1, "transparent");
      context.globalAlpha = 0.35;
      context.fillStyle = blot;
      context.fillRect(x - r, y - r, r * 2, r * 2);
    }
    context.globalAlpha = 0.18;
    context.strokeStyle = colors["reveal-turmeric-deep"];
    context.lineCap = "round";
    for (let i = 0; i < 40; i++) {
      context.lineWidth = (0.01 + random() * 0.02) * width;
      context.beginPath();
      const x = random() * width;
      const y = random() * height;
      context.moveTo(x, y);
      context.quadraticCurveTo(
        x + (random() - 0.5) * width * 0.6,
        y + (random() - 0.5) * height * 0.2,
        x + (random() - 0.5) * width * 0.8,
        y + (random() - 0.5) * height * 0.3,
      );
      context.stroke();
    }
  } else if (kind === "henna") {
    // Dried henna: a deep stain drawn over with dots, petals and paisley curls
    const ground = context.createLinearGradient(0, 0, width, height);
    ground.addColorStop(0, colors["reveal-henna"]);
    ground.addColorStop(1, colors["reveal-henna-deep"]);
    context.fillStyle = ground;
    context.fillRect(0, 0, width, height);
    context.strokeStyle = colors["reveal-henna-light"];
    context.fillStyle = colors["reveal-henna-light"];
    context.globalAlpha = 0.55;
    const step = Math.max(56, width / 5);
    for (let y = step / 2; y < height + step; y += step) {
      for (let x = (y / step) % 2 ? 0 : step / 2; x < width + step; x += step) {
        // A small mandala: a ring of petals around a dot
        context.lineWidth = 1.4;
        context.beginPath();
        context.arc(x, y, step * 0.08, 0, Math.PI * 2);
        context.fill();
        for (let p = 0; p < 8; p++) {
          const angle = (p / 8) * Math.PI * 2;
          context.beginPath();
          context.ellipse(
            x + Math.cos(angle) * step * 0.2,
            y + Math.sin(angle) * step * 0.2,
            step * 0.1,
            step * 0.045,
            angle,
            0,
            Math.PI * 2,
          );
          context.stroke();
        }
        context.beginPath();
        context.arc(x, y, step * 0.36, 0, Math.PI * 2);
        context.setLineDash([2, 5]);
        context.stroke();
        context.setLineDash([]);
      }
    }
  } else if (kind === "gold") {
    // Gold foil: a sheen across it, fine brushed lines and a few glints
    const foil = context.createLinearGradient(0, 0, width, height);
    foil.addColorStop(0, colors["reveal-gold-deep"]);
    foil.addColorStop(0.3, colors["reveal-gold"]);
    foil.addColorStop(0.5, colors["reveal-gold-light"]);
    foil.addColorStop(0.7, colors["reveal-gold"]);
    foil.addColorStop(1, colors["reveal-gold-deep"]);
    context.fillStyle = foil;
    context.fillRect(0, 0, width, height);
    context.globalAlpha = 0.12;
    context.strokeStyle = colors["reveal-gold-deep"];
    context.lineWidth = 1;
    for (let x = -height; x < width; x += 4) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x + height, height);
      context.stroke();
    }
    context.globalAlpha = 0.9;
    for (let i = 0; i < area / 9000; i++) {
      const x = random() * width;
      const y = random() * height;
      const r = 0.6 + random() * 1.6;
      context.fillStyle = colors["reveal-gold-light"];
      context.beginPath();
      context.arc(x, y, r, 0, Math.PI * 2);
      context.fill();
    }
  } else {
    // A heap of petals, roses and marigolds laid edge to edge
    context.fillStyle = colors["flower-rose-deep"];
    context.fillRect(0, 0, width, height);
    const tones = [
      colors["flower-rose"],
      colors["flower-rose-deep"],
      colors["flower-marigold"],
      colors["flower-lotus"],
      colors["flower-jasmine"],
    ];
    const size = Math.max(14, width / 14);
    for (let i = 0; i < (area / (size * size)) * 3.2; i++) {
      const x = random() * width;
      const y = random() * height;
      context.save();
      context.translate(x, y);
      context.rotate(random() * Math.PI * 2);
      context.globalAlpha = 0.92;
      context.fillStyle = tones[Math.floor(random() * tones.length)] ?? colors["flower-rose"];
      context.beginPath();
      context.ellipse(0, 0, size * (0.55 + random() * 0.3), size * 0.32, 0, 0, Math.PI * 2);
      context.fill();
      context.globalAlpha = 0.25;
      context.strokeStyle = colors["flower-rose-deep"];
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(-size * 0.4, 0);
      context.lineTo(size * 0.4, 0);
      context.stroke();
      context.restore();
    }
  }
  context.globalAlpha = 1;
}

export function ScratchCover({
  kind,
  hint,
  reveal,
  className,
  children,
}: {
  kind: CoverKind;
  /** What to do, printed on the cover: "Rub off the turmeric". */
  hint: string;
  /** The button that reveals it in one tap. */
  reveal: string;
  className?: string;
  children: ReactNode;
}) {
  const still = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const cells = useRef<Set<number>>(new Set());
  const last = useRef<{ x: number; y: number } | null>(null);
  const [state, setState] = useState<"covered" | "rubbing" | "falling" | "open">("covered");

  // Paint the cover to the box's size, again when it changes size before the guest rubs
  useEffect(() => {
    const element = box.current;
    const sheet = canvas.current;
    if (!element || !sheet || state === "open") return;
    const draw = () => {
      if (cells.current.size > 0) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = element.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      sheet.width = Math.round(width * ratio);
      sheet.height = Math.round(height * ratio);
      const context = sheet.getContext("2d");
      if (!context) return;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      paint(context, width, height, kind, readColors(element));
    };
    draw();
    const watch = new ResizeObserver(draw);
    watch.observe(element);
    return () => watch.disconnect();
  }, [kind, state]);

  const open = () => {
    if (state === "falling" || state === "open") return;
    setState(still ? "open" : "falling");
  };

  // The cover falls away, and is gone even where the fade never runs
  useEffect(() => {
    if (state !== "falling") return;
    const gone = window.setTimeout(() => setState("open"), 900);
    return () => window.clearTimeout(gone);
  }, [state]);

  const rub = (event: PointerEvent<HTMLCanvasElement>) => {
    const sheet = canvas.current;
    const context = sheet?.getContext("2d");
    if (!sheet || !context) return;
    const bounds = sheet.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const brush = Math.max(22, bounds.width * 0.09);
    context.globalCompositeOperation = "destination-out";
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = brush * 2;
    context.beginPath();
    const from = last.current ?? { x, y };
    context.moveTo(from.x, from.y);
    context.lineTo(x + 0.01, y);
    context.stroke();
    last.current = { x, y };

    // Mark the cells the brush passed over, along the stroke
    const cell = bounds.width / COLUMNS;
    const rows = Math.ceil(bounds.height / cell);
    const steps = Math.max(1, Math.ceil(Math.hypot(x - from.x, y - from.y) / (brush / 2)));
    for (let s = 0; s <= steps; s++) {
      const px = from.x + ((x - from.x) * s) / steps;
      const py = from.y + ((y - from.y) * s) / steps;
      const reach = Math.ceil(brush / cell);
      const cx = Math.floor(px / cell);
      const cy = Math.floor(py / cell);
      for (let dx = -reach; dx <= reach; dx++) {
        for (let dy = -reach; dy <= reach; dy++) {
          const gx = cx + dx;
          const gy = cy + dy;
          if (gx < 0 || gy < 0 || gx >= COLUMNS || gy >= rows) continue;
          if (Math.hypot((gx + 0.5) * cell - px, (gy + 0.5) * cell - py) <= brush) {
            cells.current.add(gy * COLUMNS + gx);
          }
        }
      }
    }
    if (state === "covered") setState("rubbing");
    if (cells.current.size / (COLUMNS * rows) >= ENOUGH) open();
  };

  return (
    <div
      ref={box}
      tabIndex={-1}
      data-cover={kind}
      data-state={state}
      className={cn("relative outline-none", className)}
    >
      {children}
      {state !== "open" && (
        <>
          <canvas
            ref={canvas}
            aria-hidden
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              last.current = null;
              rub(event);
            }}
            onPointerMove={(event) => {
              if (event.buttons === 0 && event.pointerType === "mouse") return;
              if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
              rub(event);
            }}
            onPointerUp={() => {
              last.current = null;
            }}
            onTransitionEnd={() => setState("open")}
            className="scratch-sheet absolute inset-0 size-full cursor-grab touch-none rounded-[inherit] active:cursor-grabbing"
          />
          <p
            aria-hidden
            className="scratch-hint pointer-events-none absolute inset-x-6 top-1/2 -translate-y-1/2 text-center font-label text-base leading-relaxed font-semibold tracking-[0.22em] text-balance uppercase"
          >
            {hint}
          </p>
          <button
            type="button"
            onClick={() => {
              open();
              // The button leaves with the cover: keep the guest's place on what it revealed
              box.current?.focus({ preventScroll: true });
            }}
            className="scratch-button absolute bottom-4 left-1/2 inline-flex min-h-11 -translate-x-1/2 cursor-pointer items-center gap-2 rounded-full px-5 font-label text-xs tracking-[0.2em] uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Sparkles aria-hidden className="size-4" />
            {reveal}
          </button>
        </>
      )}
    </div>
  );
}
