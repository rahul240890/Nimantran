/*
 * Paints the gate-fold card's faces onto canvases for use as WebGL textures.
 * Each face is painted twice: once in colour, and once as a "finish" map where
 *   red   = relief (foil raised, paper level, ink pressed in),
 *   green = roughness,
 *   blue  = metalness,
 * so gold foil shines and letters feel letterpressed. Text goes through the browser's own
 * text engine, so every Indian script shapes correctly with the page's fonts.
 */

import type { GateCardCopy } from "@/components/brand/gate-card";
import type { ResolvedStock } from "@/lib/engine/themes";
import { seededRandom } from "@/lib/engine/particles";

export type Pass = "colour" | "finish";
type Paint = "paper" | "ink" | "foil";

/* Finish values: relief, roughness, metalness (0–255) */
const FINISH: Record<Paint, string> = {
  paper: "rgb(70 214 0)",
  ink: "rgb(20 170 0)",
  foil: "rgb(255 72 255)",
};

export const FONTS = {
  display: '"Rozha One", Georgia, serif',
  label: '"Tenor Sans", "Trebuchet MS", sans-serif',
  sans: '"Karla Variable", Karla, system-ui, sans-serif',
} as const;

/** Waits for the page fonts (including the scripts used in this card) before painting. */
export async function loadCardFonts(copy: GateCardCopy): Promise<void> {
  if (typeof document === "undefined" || !document.fonts) return;
  const text = Object.values(copy).flat().join(" ");
  await Promise.all([
    document.fonts.load(`64px ${FONTS.display}`, text),
    document.fonts.load(`32px ${FONTS.label}`, text),
    document.fonts.load(`italic 32px ${FONTS.sans}`, text),
  ]).catch(() => undefined);
}

type Painter = {
  ctx: CanvasRenderingContext2D;
  pass: Pass;
  w: number;
  h: number;
  /** Chooses the colour for this pass: the stock colour, or the finish for its material. */
  paint: (paint: Paint, colour: string) => string;
};

function painter(canvas: HTMLCanvasElement, pass: Pass): Painter {
  const ctx = canvas.getContext("2d")!;
  return {
    ctx,
    pass,
    w: canvas.width,
    h: canvas.height,
    paint: (paint, colour) => (pass === "colour" ? colour : FINISH[paint]),
  };
}

function canvasOf(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width);
  canvas.height = Math.round(height);
  return canvas;
}

/** Cotton paper: faint fibres and a soft falloff toward the edges. */
function paper(p: Painter, colour: string, ink: string, seed: number) {
  const { ctx, w, h } = p;
  ctx.fillStyle = p.paint("paper", colour);
  ctx.fillRect(0, 0, w, h);
  if (p.pass !== "colour") return;

  const random = seededRandom(seed);
  ctx.fillStyle = ink;
  const fibres = Math.round((w * h) / 900);
  for (let i = 0; i < fibres; i++) {
    ctx.globalAlpha = 0.025 + random() * 0.04;
    const x = random() * w;
    const y = random() * h;
    const length = 1 + random() * (w / 260);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(random() * Math.PI);
    ctx.fillRect(0, 0, length, Math.max(1, w / 1400));
    ctx.restore();
  }
  ctx.globalAlpha = 1;
  const falloff = ctx.createRadialGradient(
    w / 2,
    h / 2,
    Math.min(w, h) * 0.3,
    w / 2,
    h / 2,
    Math.hypot(w, h) * 0.6,
  );
  falloff.addColorStop(0, "rgb(0 0 0 / 0)");
  falloff.addColorStop(1, "rgb(60 30 10 / 0.12)");
  ctx.fillStyle = falloff;
  ctx.fillRect(0, 0, w, h);
}

/** The double foil border every face carries. `inset` is a fraction of the shorter side. */
function border(p: Painter, colour: string, inset: number) {
  const { ctx, w, h } = p;
  const unit = Math.min(w, h);
  ctx.strokeStyle = p.paint("foil", colour);
  const lines: [number, number][] = [
    [inset, 0.006],
    [inset + 0.018, 0.0028],
  ];
  for (const [offset, width] of lines) {
    const o = offset * unit;
    ctx.lineWidth = width * unit;
    ctx.strokeRect(o, o, w - o * 2, h - o * 2);
  }
}

/** The Nimantran mandala, as in src/components/brand/mandala.tsx, drawn in foil. */
export function mandala(
  p: Painter,
  cx: number,
  cy: number,
  size: number,
  gold: string,
  fill: string,
) {
  const { ctx } = p;
  const s = size / 200;
  const alpha = ctx.globalAlpha;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s, s);
  ctx.strokeStyle = p.paint("foil", gold);
  const ring = (r: number, width: number) => {
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
  };
  ring(96, 2.5);
  ring(88, 1.2);
  ring(52, 2);
  ring(20, 2);

  const petal = (deg: number, cyOffset: number, rx: number, ry: number) => {
    ctx.save();
    ctx.rotate((deg * Math.PI) / 180);
    ctx.beginPath();
    ctx.ellipse(0, cyOffset, rx, ry, 0, 0, Math.PI * 2);
    ctx.restore();
  };
  for (let i = 0; i < 16; i++) {
    petal(i * 22.5, -70, 8.5, 16);
    // A tint of colour inside each outer petal: ink on paper, not foil
    ctx.fillStyle = p.paint("paper", fill);
    ctx.globalAlpha = alpha * (p.pass === "colour" ? 0.22 : 1);
    ctx.fill();
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  ctx.fillStyle = p.paint("foil", fill);
  for (let i = 0; i < 12; i++) {
    petal(i * 30 + 15, -36, 6, 12);
    ctx.fill();
  }
  ctx.fillStyle = p.paint("foil", gold);
  for (let i = 0; i < 32; i++) {
    const a = ((i * 11.25 - 90) * Math.PI) / 180;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * 92, Math.sin(a) * 92, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = p.paint("foil", fill);
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

type TextStyle = {
  font: string;
  /** Size as a fraction of the face width. */
  size: number;
  colour: string;
  paint: Paint;
  italic?: boolean;
  tracking?: number;
  /** Widest the text may run, as a fraction of the face width. */
  maxWidth?: number;
  /** Allow wrapping onto a second line before shrinking. */
  lines?: 1 | 2;
};

function fontString(style: TextStyle, px: number) {
  return `${style.italic ? "italic " : ""}${Math.round(px)}px ${style.font}`;
}

/**
 * Writes one centred line (or two) at `y` and returns the y below it. Long names shrink
 * to fit rather than overflow; long lines wrap once, then shrink.
 */
function text(p: Painter, value: string, y: number, style: TextStyle): number {
  const { ctx, w } = p;
  const maxWidth = (style.maxWidth ?? 0.82) * w;
  let px = style.size * w;
  ctx.fillStyle = p.paint(style.paint, style.colour);
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const setFont = () => {
    ctx.font = fontString(style, px);
    ctx.letterSpacing = `${((style.tracking ?? 0) * px).toFixed(2)}px`;
  };
  setFont();

  let rows = [value];
  if (style.lines === 2 && ctx.measureText(value).width > maxWidth) {
    const words = value.split(" ");
    let best = rows;
    let bestWidth = Infinity;
    for (let i = 1; i < words.length; i++) {
      const candidate = [words.slice(0, i).join(" "), words.slice(i).join(" ")];
      const width = Math.max(...candidate.map((row) => ctx.measureText(row).width));
      if (width < bestWidth) {
        bestWidth = width;
        best = candidate;
      }
    }
    rows = best;
  }
  const widest = () => Math.max(...rows.map((row) => ctx.measureText(row).width));
  while (widest() > maxWidth && px > 8) {
    px *= 0.94;
    setFont();
  }

  const lineHeight = px * 1.18;
  rows.forEach((row, i) => ctx.fillText(row, w / 2, y + i * lineHeight));
  ctx.letterSpacing = "0px";
  return y + (rows.length - 1) * lineHeight;
}

/** A small foil flourish: a line either side of a diamond. */
function divider(p: Painter, y: number, colour: string) {
  const { ctx, w } = p;
  const unit = w / 100;
  ctx.strokeStyle = p.paint("foil", colour);
  ctx.fillStyle = p.paint("foil", colour);
  ctx.lineWidth = unit * 0.28;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(w / 2 + side * unit * 2.4, y);
    ctx.lineTo(w / 2 + side * unit * 13, y);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(w / 2, y - unit * 1.3);
  ctx.lineTo(w / 2 + unit * 1.3, y);
  ctx.lineTo(w / 2, y + unit * 1.3);
  ctx.lineTo(w / 2 - unit * 1.3, y);
  ctx.closePath();
  ctx.fill();
}

export type Face = { colour: HTMLCanvasElement; finish: HTMLCanvasElement | null };

function face(width: number, height: number, foil: boolean, draw: (p: Painter) => void): Face {
  const colour = canvasOf(width, height);
  draw(painter(colour, "colour"));
  let finish: HTMLCanvasElement | null = null;
  if (foil) {
    // The finish map is sampled more softly than the colour, so half size is plenty
    finish = canvasOf(width / 2, height / 2);
    const p = painter(finish, "finish");
    p.ctx.scale(0.5, 0.5);
    draw({ ...p, w: width, h: height });
  }
  return { colour, finish };
}

/** The inside of the card: families, the couple, the line, the date and the venue. */
export function paintInside(
  copy: GateCardCopy,
  stock: ResolvedStock,
  width: number,
  foil: boolean,
): Face {
  const height = width * 0.8;
  return face(width, height, foil, (p) => {
    const { w, h } = p;
    paper(p, stock.paper, stock.ink, 17);
    border(p, stock.gold, 0.025);

    // Quarter mandalas tucked into the corners
    const corner = h * 0.36;
    p.ctx.save();
    p.ctx.beginPath();
    p.ctx.rect(h * 0.05, h * 0.05, w - h * 0.1, h - h * 0.1);
    p.ctx.clip();
    for (const [x, y] of [
      [0, 0],
      [w, 0],
      [0, h],
      [w, h],
    ] as const) {
      p.ctx.globalAlpha = 0.55;
      mandala(p, x, y, corner, stock.gold, stock.accent);
    }
    p.ctx.globalAlpha = 1;
    p.ctx.restore();

    let y = h * 0.2;
    y = text(p, copy.families, y, {
      font: FONTS.label,
      size: 0.029,
      colour: stock.goldText,
      paint: "foil",
      tracking: 0.3,
      maxWidth: 0.7,
    });
    y = text(p, copy.first, y + w * 0.1, {
      font: FONTS.display,
      size: 0.085,
      colour: stock.ink,
      paint: "ink",
      maxWidth: 0.7,
    });
    y = text(p, "&", y + w * 0.06, {
      font: FONTS.display,
      size: 0.05,
      colour: stock.accentText,
      paint: "foil",
    });
    y = text(p, copy.second, y + w * 0.085, {
      font: FONTS.display,
      size: 0.085,
      colour: stock.ink,
      paint: "ink",
      maxWidth: 0.7,
    });
    y = text(p, copy.line, y + w * 0.052, {
      font: FONTS.sans,
      size: 0.034,
      colour: stock.inkMuted,
      paint: "ink",
      italic: true,
      maxWidth: 0.66,
      lines: 2,
    });
    divider(p, y + w * 0.032, stock.gold);
    y = text(p, copy.date, y + w * 0.074, {
      font: FONTS.label,
      size: 0.033,
      colour: stock.ink,
      paint: "ink",
      tracking: 0.12,
      maxWidth: 0.72,
    });
    text(p, copy.venue, y + w * 0.055, {
      font: FONTS.display,
      size: 0.041,
      colour: stock.accentText,
      paint: "foil",
      maxWidth: 0.7,
      lines: 2,
    });
  });
}

/** The front of one door: its word, a half mandala on the seam and an initial. */
export function paintDoorFront(
  side: "left" | "right",
  label: string,
  initial: string,
  stock: ResolvedStock,
  width: number,
  foil: boolean,
): Face {
  const doorWidth = width / 2;
  const height = width * 0.8;
  return face(doorWidth, height, foil, (p) => {
    const { ctx, w, h } = p;
    paper(p, stock.paper, stock.ink, side === "left" ? 23 : 29);

    // Border on the three outer edges only, so the two doors read as one design when shut
    const unit = h;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.clip();
    ctx.translate(side === "left" ? 0 : -w, 0);
    const full = { ...p, w: w * 2 };
    border(full, stock.gold, 0.035);
    ctx.restore();

    // Half of the mandala on each door, meeting at the seam
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.clip();
    mandala(p, side === "left" ? w : 0, h / 2, unit * 0.72, stock.gold, stock.accent);
    ctx.restore();

    text(p, label, h * 0.15, {
      font: FONTS.label,
      size: 0.052,
      colour: stock.goldText,
      paint: "foil",
      tracking: 0.35,
      maxWidth: 0.8,
    });
    text(p, initial, h * 0.9, {
      font: FONTS.display,
      size: 0.16,
      colour: stock.accentText,
      paint: "foil",
    });

    // The seam edge darkens a little, as paper does where it folds
    if (p.pass === "colour") {
      const shade = ctx.createLinearGradient(
        side === "left" ? w : 0,
        0,
        side === "left" ? w * 0.9 : w * 0.1,
        0,
      );
      shade.addColorStop(0, "rgb(40 20 10 / 0.16)");
      shade.addColorStop(1, "rgb(40 20 10 / 0)");
      ctx.fillStyle = shade;
      ctx.fillRect(0, 0, w, h);
    }
  });
}

/** The inside of a door: the deep lining with a grid of foil dots. */
export function paintDoorBack(stock: ResolvedStock, width: number, foil: boolean): Face {
  const doorWidth = width / 2;
  const height = width * 0.8;
  return face(doorWidth, height, foil, (p) => {
    const { ctx, w, h } = p;
    ctx.fillStyle = p.paint("paper", stock.back);
    ctx.fillRect(0, 0, w, h);
    const gap = w / 18;
    ctx.fillStyle = p.paint("foil", stock.gold);
    for (let y = gap / 2; y < h; y += gap) {
      for (let x = gap / 2; x < w; x += gap) {
        ctx.beginPath();
        ctx.arc(x, y, gap * 0.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const inset = Math.min(w, h) * 0.05;
    ctx.strokeStyle = p.paint("foil", stock.gold);
    ctx.lineWidth = Math.min(w, h) * 0.006;
    ctx.strokeRect(inset, inset, w - inset * 2, h - inset * 2);
  });
}

/** The back of the card: plain stock with a small centred mandala. */
export function paintCardBack(stock: ResolvedStock, width: number, foil: boolean): Face {
  const height = width * 0.8;
  return face(width / 2, height / 2, foil, (p) => {
    paper(p, stock.paper, stock.ink, 41);
    mandala(p, p.w / 2, p.h / 2, p.h * 0.28, stock.gold, stock.accent);
  });
}

/** A soft radial glow, used for the seam light and the lanterns' halos. */
export function paintGlow(colour: string, size = 128): HTMLCanvasElement {
  const canvas = canvasOf(size, size);
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, colour);
  gradient.addColorStop(0.25, colour);
  gradient.addColorStop(1, "rgb(0 0 0 / 0)");
  ctx.globalAlpha = 1;
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  // Fade the colour stops out by alpha so additive blending stays soft
  ctx.globalCompositeOperation = "destination-in";
  const mask = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  mask.addColorStop(0, "rgb(0 0 0 / 1)");
  mask.addColorStop(1, "rgb(0 0 0 / 0)");
  ctx.fillStyle = mask;
  ctx.fillRect(0, 0, size, size);
  return canvas;
}

/** The soft shadow the card casts on the table below it. */
export function paintShadow(size = 128): HTMLCanvasElement {
  const canvas = canvasOf(size, size);
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgb(20 8 12 / 0.55)");
  gradient.addColorStop(0.5, "rgb(20 8 12 / 0.22)");
  gradient.addColorStop(1, "rgb(20 8 12 / 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return canvas;
}
