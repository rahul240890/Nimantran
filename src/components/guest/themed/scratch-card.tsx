"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** How much of the foil must be scratched away before the rest falls away by itself. */
const CLEARED = 0.55;
/** The fingertip's width, in CSS pixels. */
const TIP = 34;

/* A few dots that look scattered but stay the same on every render */
const scatter = (i: number, salt: number) => {
  const v = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return v - Math.floor(v);
};

/**
 * A card of the theme's gold foil over something to find (owner, 2026-10-27, after a reel
 * where guests scratch to reveal the date): the guest rubs it away with a finger or the
 * mouse, and once enough is gone the rest falls away and `onReveal` is called. The foil is
 * drawn on a canvas in the theme's own gilt and cloth, read from the page's tokens. A
 * keyboard reveals it with Enter or Space, and a screen reader reads what is underneath all
 * along.
 */
export function ScratchCard({
  hint,
  label,
  onReveal,
  children,
  className,
}: {
  /** The words on the foil, such as "Scratch to reveal the date". */
  hint: string;
  /** The foil's name for a keyboard, such as "Show the date". */
  label: string;
  onReveal: () => void;
  /** What lies under the foil. */
  children: ReactNode;
  className?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const strokes = useRef(0);
  const [state, setState] = useState<"foil" | "scratching" | "falling" | "gone">("foil");

  // Paints the foil: the theme's gilt, a sheen of its cloth and a scatter of glints
  useEffect(() => {
    const area = canvas.current;
    const context = area?.getContext("2d");
    if (!area || !context) return;
    const paint = () => {
      const scale = window.devicePixelRatio || 1;
      const { width, height } = area.getBoundingClientRect();
      area.width = Math.round(width * scale);
      area.height = Math.round(height * scale);
      const colours = getComputedStyle(area);
      const gilt = colours.color;
      // Nothing to read once the card has left the page
      if (!area.isConnected || !gilt) return;
      const cloth = colours.outlineColor || gilt;
      const shade = colours.borderTopColor || gilt;
      context.globalCompositeOperation = "source-over";
      context.fillStyle = gilt;
      context.fillRect(0, 0, area.width, area.height);
      // A sheen across, light at the top, deeper at the bottom
      const sheen = context.createLinearGradient(0, 0, area.width, area.height);
      sheen.addColorStop(0, cloth);
      sheen.addColorStop(0.45, gilt);
      sheen.addColorStop(1, shade);
      context.globalAlpha = 0.45;
      context.fillStyle = sheen;
      context.fillRect(0, 0, area.width, area.height);
      context.fillStyle = cloth;
      for (let i = 0; i < 70; i++) {
        context.globalAlpha = 0.25 + scatter(i, 3) * 0.5;
        context.beginPath();
        context.arc(
          scatter(i, 1) * area.width,
          scatter(i, 2) * area.height,
          (0.6 + scatter(i, 4) * 1.4) * scale,
          0,
          Math.PI * 2,
        );
        context.fill();
      }
      context.globalAlpha = 1;
    };
    paint();
    // Painted again if the card changes size before it is scratched
    const watch = new ResizeObserver(() => {
      if (strokes.current === 0) paint();
    });
    watch.observe(area);
    return () => watch.disconnect();
  }, []);

  const reveal = () => {
    if (state === "falling" || state === "gone") return;
    setState("falling");
    onReveal();
  };

  // How much of the foil is gone, from every eighth pixel
  const cleared = (area: HTMLCanvasElement) => {
    const context = area.getContext("2d");
    if (!context || area.width === 0) return 0;
    const { data } = context.getImageData(0, 0, area.width, area.height);
    let clear = 0;
    let all = 0;
    for (let i = 3; i < data.length; i += 32) {
      all++;
      if (data[i] === 0) clear++;
    }
    return clear / all;
  };

  const scratch = (x: number, y: number) => {
    const area = canvas.current;
    const context = area?.getContext("2d");
    if (!area || !context) return;
    const box = area.getBoundingClientRect();
    const scale = area.width / box.width;
    const point = { x: (x - box.left) * scale, y: (y - box.top) * scale };
    context.globalCompositeOperation = "destination-out";
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = TIP * scale;
    context.beginPath();
    const from = last.current ?? point;
    context.moveTo(from.x, from.y);
    context.lineTo(point.x + 0.01, point.y);
    context.stroke();
    last.current = point;
    strokes.current++;
    if (state === "foil") setState("scratching");
    if (strokes.current % 12 === 0 && cleared(area) > CLEARED) reveal();
  };

  return (
    <div className={cn("guest-scratch relative isolate overflow-hidden select-none", className)}>
      {children}
      {state !== "gone" && (
        <div
          role="button"
          tabIndex={0}
          aria-label={label}
          data-state={state}
          className="guest-scratch-foil absolute inset-0 cursor-grab touch-none select-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
          onPointerDown={(event) => {
            // Rubbing never selects the words underneath
            event.preventDefault();
            event.currentTarget.setPointerCapture(event.pointerId);
            last.current = null;
            scratch(event.clientX, event.clientY);
          }}
          onPointerMove={(event) => {
            if (event.buttons === 0 && event.pointerType === "mouse") return;
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
            scratch(event.clientX, event.clientY);
          }}
          onPointerUp={() => {
            last.current = null;
            if (canvas.current && cleared(canvas.current) > CLEARED) reveal();
          }}
          // A screen reader's own "click" carries no pointer, so it reveals at once
          onClick={(event) => {
            if (event.detail === 0) reveal();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              reveal();
            }
          }}
          onTransitionEnd={() => {
            if (state === "falling") setState("gone");
          }}
        >
          <canvas ref={canvas} aria-hidden className="guest-scratch-canvas size-full" />
          <span
            aria-hidden
            className="guest-scratch-hint pointer-events-none absolute inset-0 flex items-center justify-center gap-2 px-4 text-center font-label text-xs tracking-[0.22em] uppercase"
          >
            <Sparkles aria-hidden className="size-4 shrink-0" />
            {hint}
          </span>
        </div>
      )}
    </div>
  );
}
