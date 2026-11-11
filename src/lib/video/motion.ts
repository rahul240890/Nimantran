/*
 * The video's own moves, beyond the live pages' fade (owner, 2026-10-25: make the video
 * move like the ones families buy): how one page gives way to the next (doors parting, a
 * light sweeping across, petals blowing through, a circle of light opening), the names
 * writing themselves in with a glow once they land, and photos drifting slowly closer in
 * their frames. Timing is pure; the drawing is Browser only.
 */

import { seededRandom } from "@/lib/engine/particles";
import { clamp01, easeInOut, lerp } from "./ease";

/** How one page gives way to the next. */
export type Turn = "fade" | "doors" | "sweep" | "petals" | "iris";

/** Pages after the first take these in turn, so no two in a row change the same way. */
export const TURNS: readonly Turn[] = ["sweep", "doors", "petals", "iris"];

/** The way into the page at `index`: the first fades in, as it does from the opening. */
export function turnFor(index: number): Turn {
  return index <= 0 ? "fade" : TURNS[(index - 1) % TURNS.length]!;
}

/** Colours a change draws its light and petals in. */
export type TurnColours = { gold: string; glow: string; accent: string };

/**
 * Limits drawing to the part of the page the new page has reached, `p` (0 to 1, eased)
 * through the change. A fade or petals show the whole page, fading in.
 */
export function clipTurn(
  ctx: CanvasRenderingContext2D,
  turn: Turn,
  p: number,
  width: number,
  height: number,
) {
  if (turn === "fade" || turn === "petals") return;
  ctx.beginPath();
  if (turn === "doors") {
    const half = (p * width) / 2;
    ctx.rect(width / 2 - half, 0, half * 2, height);
  } else if (turn === "iris") {
    ctx.arc(width / 2, height * 0.45, p * Math.hypot(width, height) * 0.62, 0, Math.PI * 2);
  } else {
    const { top, bottom } = sweepEdge(p, width, height);
    ctx.moveTo(0, 0);
    ctx.lineTo(top, 0);
    ctx.lineTo(bottom, height);
    ctx.lineTo(0, height);
    ctx.closePath();
  }
  ctx.clip();
}

/** Where the sweep's slanted edge crosses the top and the bottom of the page. */
function sweepEdge(p: number, width: number, height: number) {
  const tilt = height * 0.18;
  const x = lerp(-tilt, width + tilt, p);
  return { top: x + tilt, bottom: x - tilt };
}

/** How much a change shows the page coming in: a fade or petals fade; the others reveal. */
export function turnAlpha(turn: Turn, p: number): number {
  return turn === "fade" || turn === "petals" ? p : 1;
}

/** The light at the change's edge: gold lines on the doors, a ring, a glowing band, petals. */
export function drawTurnEdge(
  ctx: CanvasRenderingContext2D,
  turn: Turn,
  p: number,
  width: number,
  height: number,
  colours: TurnColours,
) {
  if (turn === "fade" || p <= 0 || p >= 1) return;
  // The light swells through the middle of the change and is gone as it ends
  const strength = Math.sin(Math.PI * p);
  ctx.save();
  if (turn === "doors") {
    const half = (p * width) / 2;
    ctx.strokeStyle = colours.gold;
    ctx.shadowColor = colours.glow;
    ctx.shadowBlur = 14;
    ctx.lineWidth = 1.4;
    ctx.globalAlpha *= strength;
    for (const x of [width / 2 - half, width / 2 + half]) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
  } else if (turn === "iris") {
    ctx.strokeStyle = colours.gold;
    ctx.shadowColor = colours.glow;
    ctx.shadowBlur = 18;
    ctx.lineWidth = 2;
    ctx.globalAlpha *= strength;
    ctx.beginPath();
    ctx.arc(width / 2, height * 0.45, p * Math.hypot(width, height) * 0.62, 0, Math.PI * 2);
    ctx.stroke();
  } else if (turn === "sweep") {
    const { top, bottom } = sweepEdge(p, width, height);
    const middle = (top + bottom) / 2;
    const band = width * 0.22;
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha *= strength * 0.9;
    // Turned to lie along the slanted edge
    ctx.translate(middle, height / 2);
    ctx.rotate(Math.atan2(top - bottom, height));
    const light = ctx.createLinearGradient(-band, 0, band, 0);
    light.addColorStop(0, "rgb(0 0 0 / 0)");
    light.addColorStop(0.5, colours.glow);
    light.addColorStop(1, "rgb(0 0 0 / 0)");
    ctx.fillStyle = light;
    ctx.fillRect(-band, -height * 0.75, band * 2, height * 1.5);
  } else {
    drawPetals(ctx, p, width, height, colours, strength);
  }
  ctx.restore();
}

/** A gust of petals blowing across the page, from the upper left to the lower right. */
function drawPetals(
  ctx: CanvasRenderingContext2D,
  p: number,
  width: number,
  height: number,
  colours: TurnColours,
  strength: number,
) {
  const random = seededRandom(31);
  const tints = [colours.accent, colours.gold, colours.glow];
  for (let i = 0; i < 48; i++) {
    const lane = random();
    const lag = random() * 0.35;
    const size = 6 + random() * 7;
    const spin = (random() - 0.5) * 8;
    const tint = tints[i % tints.length]!;
    const t = clamp01((p - lag) / 0.65);
    if (t <= 0 || t >= 1) continue;
    // Each petal crosses on its own slant, curving a little as it goes
    const x = lerp(-0.25, 1.25, t) * width + (lane - 0.5) * width * 0.6;
    const y =
      lerp(-0.1, 1.1, lane) * height + Math.sin(t * Math.PI * 2 + i) * 18 - t * height * 0.15;
    ctx.save();
    ctx.globalAlpha = strength * (0.55 + 0.45 * Math.sin(Math.PI * t));
    ctx.translate(x, y);
    ctx.rotate(spin * t + i);
    ctx.fillStyle = tint;
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.48, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/** How long the names take to write themselves in, all their lines together. */
export const NAME_WRITE = 1.6;
/** The glow that swells round the names once written, then settles. */
export const NAME_GLOW = 1.4;

/** How far line `line` of `count` has been written, `p` (0 to 1) through the names. */
export function writtenFor(p: number, line: number, count: number): number {
  return clamp01(p * count - line);
}

/** 0 until the names are written, swelling to 1 and settling back over NAME_GLOW. */
export function glowAfter(seconds: number): number {
  if (seconds <= 0 || seconds >= NAME_GLOW) return 0;
  return Math.sin(Math.PI * (seconds / NAME_GLOW));
}

/**
 * Moves a photo's drawing so it drifts slowly closer and across its frame, `t` (0 to 1)
 * through its time on screen. Frames take turns drifting left and right. Call it inside
 * a clip to the frame.
 */
export function photoDrift(
  ctx: CanvasRenderingContext2D,
  box: { x: number; y: number; w: number; h: number },
  t: number,
  index: number,
) {
  const eased = easeInOut(clamp01(t));
  const zoom = lerp(1.04, 1.1, eased);
  const way = index % 2 === 0 ? 1 : -1;
  const cx = box.x + box.w / 2 + (eased - 0.5) * box.w * 0.03 * way;
  const cy = box.y + box.h / 2 + (0.5 - eased) * box.h * 0.02;
  ctx.translate(cx, cy);
  ctx.scale(zoom, zoom);
  ctx.translate(-(box.x + box.w / 2), -(box.y + box.h / 2));
}
