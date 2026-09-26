/*
 * Paints the gate-fold card's faces onto canvases for use as WebGL textures, from the same
 * ornament data (art/motifs.ts) and word layout (art/layout.ts) as the 2D card.
 * Each face is painted twice: once in colour, and once as a "finish" map where
 *   red   = relief (foil raised, paper level, ink pressed in),
 *   green = roughness,
 *   blue  = metalness,
 * so gold foil shines and letters feel letterpressed. Text goes through the browser's own
 * text engine, so every Indian script shapes correctly with the page's fonts.
 */

import { seededRandom } from "@/lib/engine/particles";
import type { CardCopy } from "@/lib/templates/content";
import type { StockRole, Template } from "@/lib/templates/schema";
import type { ResolvedStock } from "@/lib/templates/stock";
import { FACE, finishOf, type Finish, type Layer, type Placement } from "../art/decor";
import { layoutDoor, layoutInside, symbolLayers, type TextRun } from "../art/layout";
import { MOTIFS, type DoorSide } from "../art/motifs";

export type Pass = "colour" | "finish";
type Paint = Finish;

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
export async function loadCardFonts(copy: CardCopy): Promise<void> {
  if (typeof document === "undefined" || !document.fonts) return;
  const text = Object.values(copy).flat().join(" ");
  await Promise.all([
    document.fonts.load(`64px ${FONTS.display}`, text),
    document.fonts.load(`italic 64px ${FONTS.display}`, text),
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

const paths = new Map<string, Path2D>();
/** Path2D objects are reused: patterns draw the same shapes hundreds of times. */
function pathOf(d: string): Path2D {
  let path = paths.get(d);
  if (!path) {
    path = new Path2D(d);
    if (paths.size > 400) paths.clear();
    paths.set(d, path);
  }
  return path;
}

function drawPlacement(p: Painter, stock: ResolvedStock, placement: Placement, alpha: number) {
  const { ctx } = p;
  ctx.save();
  if (placement.at) ctx.translate(placement.at[0], placement.at[1]);
  if (placement.rotate) ctx.rotate((placement.rotate * Math.PI) / 180);
  const s = placement.scale ?? 1;
  if (s !== 1 || placement.flipX || placement.flipY) {
    ctx.scale(placement.flipX ? -s : s, placement.flipY ? -s : s);
  }
  const colour = (role: StockRole, finish: Finish | undefined) =>
    p.paint(finish ?? finishOf(role), stock[role]);
  for (const shape of placement.shapes ?? []) {
    const path = pathOf(shape.d);
    ctx.globalAlpha = alpha * (shape.opacity ?? 1);
    if (shape.fill) {
      ctx.fillStyle = colour(shape.fill, shape.finish);
      ctx.fill(path);
    }
    if (shape.stroke) {
      ctx.strokeStyle = colour(shape.stroke, shape.finish);
      ctx.lineWidth = shape.width ?? 0.3;
      ctx.stroke(path);
    }
  }
  for (const child of placement.children ?? []) drawPlacement(p, stock, child, alpha);
  ctx.restore();
}

/** Draws ornament layers on a face `units` wide (see art/decor.ts). */
function drawLayers(p: Painter, stock: ResolvedStock, layers: readonly Layer[], units: number) {
  const { ctx } = p;
  const unit = p.w / units;
  const height = p.h / unit;
  for (const layer of layers) {
    ctx.save();
    ctx.scale(unit, unit);
    if (layer.clip) ctx.clip(pathOf(layer.clip), layer.clipEvenOdd ? "evenodd" : "nonzero");
    const alpha = layer.opacity ?? 1;
    if (layer.pattern) {
      const [tw, th] = layer.pattern.tile;
      for (let y = 0; y < height; y += th) {
        for (let x = 0; x < units; x += tw) {
          for (const item of layer.pattern.items) {
            drawPlacement(p, stock, { at: [x, y], children: [item] }, alpha);
          }
        }
      }
    }
    for (const item of layer.items ?? []) drawPlacement(p, stock, item, alpha);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

function fontString(run: TextRun, px: number) {
  return `${run.italic ? "italic " : ""}${Math.round(px)}px ${FONTS[run.font]}`;
}

/** Writes a laid-out run of words, shrinking it if the real text runs wider than planned. */
function drawRun(p: Painter, stock: ResolvedStock, run: TextRun, units: number) {
  const { ctx } = p;
  const unit = p.w / units;
  let px = run.size * unit;
  const setFont = () => {
    ctx.font = fontString(run, px);
    ctx.letterSpacing = `${(run.tracking * px).toFixed(2)}px`;
  };
  setFont();
  const widest = () => Math.max(...run.rows.map((row) => ctx.measureText(row).width));
  const limit = run.maxWidth * unit;
  while (widest() > limit && px > 6) {
    px *= 0.95;
    setFont();
  }
  ctx.fillStyle = p.paint(run.foil ? "foil" : "ink", stock[run.ink]);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  run.rows.forEach((row, i) => {
    ctx.fillText(row, run.x * unit, (run.top + run.lineHeight * (i + 0.5)) * unit);
  });
  ctx.letterSpacing = "0px";
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

/** The inside of the card: the template's ornaments and every line of the invitation. */
export function paintInside(
  copy: CardCopy,
  template: Template,
  stock: ResolvedStock,
  width: number,
  foil: boolean,
): Face {
  const motif = MOTIFS[template.scene.motif];
  const units = FACE.inside.width;
  return face(width, width * 0.8, foil, (p) => {
    const { ctx } = p;
    paper(p, stock.paper, stock.ink, 17);
    drawLayers(p, stock, motif.inside, units);

    const layout = layoutInside(copy, template, motif);
    const symbol = symbolLayers(copy, layout);
    if (symbol) drawLayers(p, stock, symbol, units);
    if (motif.divider && layout.divider !== null) {
      drawLayers(
        p,
        stock,
        [{ items: [{ at: [50, layout.divider], children: [motif.divider] }] }],
        units,
      );
    }
    if (layout.monogram) {
      // The couple's initials, large, either side of a fine rule
      const unit = p.w / units;
      const { top, size, initials, x } = layout.monogram;
      const px = size * unit;
      ctx.font = `${Math.round(px)}px ${FONTS.display}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const [a, b] = initials.map((letter) => ctx.measureText(letter).width) as [number, number];
      const gap = px * 0.24;
      const start = x * unit - (a + gap + b) / 2;
      const middle = (top + size / 2) * unit;
      ctx.fillStyle = p.paint("ink", stock.ink);
      ctx.fillText(initials[0], start + a / 2, middle);
      ctx.fillText(initials[1], start + a + gap + b / 2, middle);
      ctx.strokeStyle = p.paint("foil", stock.gold);
      ctx.lineWidth = Math.max(1, unit * 0.12);
      ctx.beginPath();
      ctx.moveTo(start + a + gap / 2, (top + size * 0.08) * unit);
      ctx.lineTo(start + a + gap / 2, (top + size * 0.92) * unit);
      ctx.stroke();
    }
    for (const run of layout.runs) drawRun(p, stock, run, units);
  });
}

/** The front of one door: the template's door art, its word and an initial. */
export function paintDoorFront(
  side: DoorSide,
  copy: CardCopy,
  template: Template,
  stock: ResolvedStock,
  width: number,
  foil: boolean,
): Face {
  const motif = MOTIFS[template.scene.motif];
  return face(width / 2, width * 0.8, foil, (p) => {
    const { ctx, w } = p;
    paper(p, stock.paper, stock.ink, side === "left" ? 23 : 29);
    drawLayers(p, stock, motif.door(side), FACE.door.width);
    const { label, initial } = layoutDoor(copy, template, motif, side);
    if (label) drawRun(p, stock, label, FACE.door.width);
    drawRun(p, stock, initial, FACE.door.width);

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
      ctx.fillRect(0, 0, w, p.h);
    }
  });
}

/** The inside of a door: the deep lining with the template's pattern in foil. */
export function paintDoorBack(
  template: Template,
  stock: ResolvedStock,
  width: number,
  foil: boolean,
): Face {
  const motif = MOTIFS[template.scene.motif];
  return face(width / 2, width * 0.8, foil, (p) => {
    p.ctx.fillStyle = p.paint("paper", stock.back);
    p.ctx.fillRect(0, 0, p.w, p.h);
    drawLayers(p, stock, motif.lining, FACE.door.width);
  });
}

/** The back of the card: plain stock with a small centred ornament. */
export function paintCardBack(
  template: Template,
  stock: ResolvedStock,
  width: number,
  foil: boolean,
): Face {
  const motif = MOTIFS[template.scene.motif];
  return face(width / 2, (width * 0.8) / 2, foil, (p) => {
    paper(p, stock.paper, stock.ink, 41);
    drawLayers(p, stock, motif.back, FACE.inside.width);
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
