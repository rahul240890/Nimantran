import type { StockRole } from "@/lib/templates/schema";

/*
 * Card ornaments as plain vector data, so the 2D card (SVG) and the 3D card (canvas
 * textures) draw exactly the same art from one source. Coordinates are in face units:
 * the inside and the back of the card are 100 × 80, each door is 50 × 80.
 */

/** How a paint behaves in 3D: foil shines and stands proud, ink presses in. */
export type Finish = "paper" | "ink" | "foil";

export type Shape = {
  /** SVG path data. */
  d: string;
  fill?: StockRole;
  stroke?: StockRole;
  /** Stroke width in the shape's own units. */
  width?: number;
  opacity?: number;
  /** Overrides the finish the colour would normally have. */
  finish?: Finish;
};

/** Shapes placed with a transform; children nest, so a spray of roses moves as one. */
export type Placement = {
  at?: readonly [number, number];
  scale?: number;
  /** Degrees, clockwise. */
  rotate?: number;
  flipX?: boolean;
  flipY?: boolean;
  shapes?: readonly Shape[];
  children?: readonly Placement[];
};

/** A group of placements, or a repeating pattern, optionally clipped and faded. */
export type Layer = {
  /** A clip region as SVG path data, in face units. */
  clip?: string;
  /** Use even-odd filling for the clip, to cut a hole (an arch) out of a rectangle. */
  clipEvenOdd?: boolean;
  opacity?: number;
  items?: readonly Placement[];
  /** Repeats placements (drawn within one tile) across the clip region or the face. */
  pattern?: { tile: readonly [number, number]; items: readonly Placement[] };
};

export const FACE = {
  inside: { width: 100, height: 80 },
  door: { width: 50, height: 80 },
} as const;

/** The finish each stock colour has unless a shape says otherwise. */
export function finishOf(role: StockRole): Finish {
  switch (role) {
    case "gold":
    case "goldText":
    case "accent":
    case "accentText":
      return "foil";
    case "ink":
    case "inkMuted":
      return "ink";
    default:
      return "paper";
  }
}

/* Path helpers. Numbers are rounded so the SVG stays small. */

const n = (value: number) => Number(value.toFixed(2));

export function circle(cx: number, cy: number, r: number): string {
  return `M${n(cx - r)} ${n(cy)}a${n(r)} ${n(r)} 0 1 0 ${n(2 * r)} 0a${n(r)} ${n(r)} 0 1 0 ${n(-2 * r)} 0Z`;
}

/** An ellipse whose vertical axis is turned `deg` clockwise. */
export function ellipse(cx: number, cy: number, rx: number, ry: number, deg = 0): string {
  const t = (deg * Math.PI) / 180;
  const dx = ry * Math.sin(t);
  const dy = -ry * Math.cos(t);
  const a = `A${n(rx)} ${n(ry)} ${n(deg)} 1 0`;
  return `M${n(cx + dx)} ${n(cy + dy)}${a} ${n(cx - dx)} ${n(cy - dy)}${a} ${n(cx + dx)} ${n(cy + dy)}Z`;
}

export function rect(x: number, y: number, w: number, h: number): string {
  return `M${n(x)} ${n(y)}h${n(w)}v${n(h)}h${n(-w)}Z`;
}

/** A point turned `deg` clockwise about the origin. */
export function turn(x: number, y: number, deg: number): [number, number] {
  const t = (deg * Math.PI) / 180;
  return [x * Math.cos(t) - y * Math.sin(t), x * Math.sin(t) + y * Math.cos(t)];
}

/** Several copies of a shape spun evenly about the origin, as one path. */
export function ring(count: number, offset: number, make: (deg: number) => string): string {
  return Array.from({ length: count }, (_, i) => make(offset + (i * 360) / count)).join("");
}

/** A double rule inset from the edges of a width × height face. */
export function doubleBorder(
  width: number,
  height: number,
  inset: number,
  role: StockRole = "gold",
) {
  return [
    { d: rect(inset, inset, width - inset * 2, height - inset * 2), stroke: role, width: 0.48 },
    {
      d: rect(inset + 1.44, inset + 1.44, width - (inset + 1.44) * 2, height - (inset + 1.44) * 2),
      stroke: role,
      width: 0.22,
    },
  ] satisfies Shape[];
}
