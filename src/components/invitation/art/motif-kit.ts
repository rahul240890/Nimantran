import { circle, ellipse, rect, type Layer, type Placement, type Shape } from "./decor";

/*
 * What every ornament set shares: the Motif shape, door helpers, the ogee arch and the
 * brass lamp, used by the launch designs (motifs.ts) and the Rang designs (rang-motifs.ts).
 */

export type DoorSide = "left" | "right";

export type Motif = {
  inside: readonly Layer[];
  /** Where the words may sit on the inside: top and bottom edges and widest line. */
  textBox: { top: number; bottom: number; width: number };
  /** Drawn between the invitation line and the date, centred on (0, 0). */
  divider: Placement | null;
  /** "monogram" sets the couple's initials large above their names on one line. */
  layout: "stacked" | "monogram";
  door: (side: DoorSide) => readonly Layer[];
  /** Centre lines of the door word and the initial; no door word when label is null. */
  doorText: {
    label: number | null;
    initial: { y: number; size: number; ink?: "ink" | "accentText" };
  };
  /** The inside of each door, drawn over the back colour. */
  lining: readonly Layer[];
  /** The back of the card. */
  back: readonly Layer[];
  /**
   * A portrait preview for design pickers, 80 × 100, with the words centred between
   * cover.textBox's top and bottom. Designs without one have a hand-drawn cover.
   */
  cover?: { layers: readonly Layer[]; textBox: { top: number; bottom: number } };
};

/** Where a door's seam is, in that door's own units. */
export const seamX = (side: DoorSide) => (side === "left" ? 50 : 0);
/** Shifts art drawn in whole-card units onto one door. */
export const onDoor = (side: DoorSide, children: Placement[]): Placement => ({
  at: [side === "left" ? 0 : -50, 0],
  children,
});

export const DOOR_TEXT = { label: 11, initial: { y: 69.2, size: 8 } };

const n = (value: number) => Number(value.toFixed(2));

/**
 * A Mughal ogee arch centred on `cx`, rising from `base` to its springing line and on up
 * to a point at `apex`. Open at the bottom unless `closed`.
 */
export function arch(
  cx: number,
  base: number,
  half: number,
  spring: number,
  apex: number,
  closed = false,
): string {
  const rise = spring - apex;
  const left = (u: number, v: number) => `${n(cx - half + u * half)} ${n(spring - v * rise)}`;
  const right = (u: number, v: number) => `${n(cx + half - u * half)} ${n(spring - v * rise)}`;
  return (
    `M${n(cx - half)} ${n(base)}V${n(spring)}` +
    `C${left(0, 0.4)} ${left(0.375, 0.6)} ${left(0.6875, 0.7)}` +
    `C${left(0.875, 0.7667)} ${left(0.96875, 0.8667)} ${left(1, 1)}` +
    `C${right(0.96875, 0.8667)} ${right(0.875, 0.7667)} ${right(0.6875, 0.7)}` +
    `C${right(0.375, 0.6)} ${right(0, 0.4)} ${right(0, 0)}V${n(base)}` +
    (closed ? "Z" : "")
  );
}

/** A brass nilavilakku, about 28 units tall, standing on (0, 0) with its wicks lit. */
export const LAMP: Shape[] = [
  {
    d: circle(-4.2, -21.6, 2.2) + circle(4.2, -21.6, 2.2),
    fill: "accent",
    opacity: 0.16,
    finish: "paper",
  },
  { d: "M-5 0H5C5-1.2 3-1.8 1.2-2.2H-1.2C-3-1.8-5-1.2-5 0Z", fill: "gold" },
  { d: rect(-0.7, -16, 1.4, 13.8), fill: "gold" },
  {
    d: ellipse(0, -5, 0.7, 1.6, 90) + ellipse(0, -9, 0.7, 1.6, 90) + ellipse(0, -13, 0.7, 1.6, 90),
    fill: "gold",
  },
  { d: "M-6-16H6C5-19 3-20 0-20-3-20-5-19-6-16Z", fill: "gold" },
  { d: rect(-0.5, -24, 1, 4.2), fill: "gold" },
  { d: "M-1.1-24C-1.1-25.6-.2-26.8 0-27.8.2-26.8 1.1-25.6 1.1-24Z", fill: "gold" },
  {
    d: "M-4.2-20C-5.2-21.2-5-22.6-4.2-24-3.4-22.6-3.2-21.2-4.2-20ZM4.2-20C3.2-21.2 3.4-22.6 4.2-24 5-22.6 5.2-21.2 4.2-20Z",
    fill: "accent",
    finish: "paper",
  },
];

export const lamp = (x: number, y: number, scale: number): Placement => ({
  at: [x, y],
  scale,
  shapes: LAMP,
});
