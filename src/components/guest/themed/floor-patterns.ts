import { patternStrokes, type Stroke } from "@/lib/engine/patterns";
import type { GuestPattern } from "@/lib/suites/guest-look";

/*
 * The guest page's own floor patterns, beside the card patterns in lib/engine/patterns.ts:
 * a Mughal jaali star for garden-palace themes of any faith, and a burst of rays for
 * parties. Strokes in drawing order in a unit circle, like the card patterns.
 */

const TAU = Math.PI * 2;

const line = (xy: number[], colour: 0 | 1 = 0, width = 1, closed = false): Stroke => ({
  points: Float32Array.from(xy),
  colour,
  width,
  closed,
});

const ring = (radius: number, samples = 96) =>
  Array.from({ length: samples + 1 }, (_, i) => {
    const a = (i / samples) * TAU;
    return [Math.cos(a) * radius, Math.sin(a) * radius];
  }).flat();

/** A star of `points` points between an outer and inner radius, drawn as one loop. */
const star = (points: number, outer: number, inner: number, turn = 0) =>
  Array.from({ length: points * 2 + 1 }, (_, i) => {
    const a = (i / (points * 2)) * TAU + turn;
    const r = i % 2 ? inner : outer;
    return [Math.cos(a) * r, Math.sin(a) * r];
  }).flat();

/** Two squares turned into an eight-point star, rings, and a lattice of small stars. */
function jaali(): Stroke[] {
  const square = (r: number, turn: number) =>
    [0, 1, 2, 3, 4].flatMap((i) => {
      const a = (i / 4) * TAU + turn;
      return [Math.cos(a) * r, Math.sin(a) * r];
    });
  const small = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * TAU + TAU / 16;
    const cx = Math.cos(a) * 0.8;
    const cy = Math.sin(a) * 0.8;
    const pts = star(8, 0.1, 0.055).map((v, k) => v + (k % 2 ? cy : cx));
    return line(pts, 1, 0.8, true);
  });
  return [
    line(ring(0.98, 128), 0, 1.1, true),
    line(square(0.94, 0), 0, 1, true),
    line(square(0.94, TAU / 8), 0, 1, true),
    line(ring(0.66), 1, 0.9, true),
    line(star(8, 0.64, 0.5, TAU / 16), 1, 0.9, true),
    ...small,
    line(ring(0.93, 128), 0, 0.5, true),
  ];
}

/** Rays from the centre in alternating lengths, with a ring of dots, for a party. */
function burst(): Stroke[] {
  const rays = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * TAU;
    const r0 = 0.52;
    const r1 = i % 2 ? 0.82 : 1;
    return line(
      [Math.cos(a) * r0, Math.sin(a) * r0, Math.cos(a) * r1, Math.sin(a) * r1],
      i % 2 ? 1 : 0,
      i % 2 ? 0.9 : 1.3,
    );
  });
  const dots = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * TAU + TAU / 24;
    const cx = Math.cos(a) * 0.9;
    const cy = Math.sin(a) * 0.9;
    return line(
      ring(0.03, 16).map((v, k) => v + (k % 2 ? cy : cx)),
      1,
      1.4,
      true,
    );
  });
  return [line(ring(0.5), 0, 1.2, true), ...rays, ...dots];
}

const OWN = { jaali, burst } as const;

/** The strokes of any floor pattern the guest page draws (not the flower pookalam). */
export function floorStrokes(pattern: Exclude<GuestPattern, "pookalam">): Stroke[] {
  return pattern === "jaali" || pattern === "burst" ? OWN[pattern]() : patternStrokes(pattern);
}
