import type { FontRole } from "@/lib/templates/schema";
import type { SymbolId } from "@/lib/traditions/schema";
import { circle, ellipse, ring, turn, type Shape } from "./decor";

/*
 * Sacred symbols for the top of the card (TRADITIONS.md, section 5). Each is drawn from
 * simple geometry, or set as a letter in a font, never traced from anyone's artwork. The
 * layout always places them top-centre, above every word, never cropped or covered.
 * Shapes are two units across, centred on (0, 0).
 */

export type SacredSymbol =
  | { kind: "art"; shapes: readonly Shape[] }
  | {
      kind: "glyph";
      text: string;
      font: FontRole;
      /** Size against a one-letter symbol such as ॐ, so a wider mark (786) fits the same space. */
      scale?: number;
    };

/** A glyph's size against a one-letter symbol. */
export const glyphScale = (symbol: SacredSymbol) =>
  symbol.kind === "glyph" ? (symbol.scale ?? 1) : 1;

const n = (value: number) => Number(value.toFixed(3));

/** A mango leaf `length` long, from (0, 0) toward -y, turned `deg` clockwise. */
function leaf(length: number, width: number, deg: number): string {
  const p = (x: number, y: number) => turn(x, y, deg).map(n).join(" ");
  const w = width / 2;
  return (
    `M${p(0, 0)}C${p(-w, -length * 0.3)} ${p(-w * 0.7, -length * 0.8)} ${p(0, -length)}` +
    `C${p(w * 0.7, -length * 0.8)} ${p(w, -length * 0.3)} ${p(0, 0)}Z`
  );
}

/** The mangal kalash: a brass pot with mango leaves and a coconut. */
const KALASH: Shape[] = [
  // Leaves fanned behind the coconut
  {
    d: [-56, -28, 0, 28, 56].map((deg) => leaf(0.62, 0.22, deg)).join(""),
    fill: "accent",
  },
  { d: ellipse(0, -0.5, 0.2, 0.27), fill: "gold" },
  // Rim and neck
  { d: "M-0.34 -0.2H0.34L0.3 -0.08H-0.3Z", fill: "gold" },
  // The pot
  {
    d: "M-0.22 -0.08C-0.62 0.06 -0.7 0.5 -0.44 0.72H0.44C0.7 0.5 0.62 0.06 0.22 -0.08Z",
    fill: "gold",
  },
  { d: "M-0.56 0.3H0.56", stroke: "paper", width: 0.05, finish: "paper" },
  { d: circle(0, 0.34, 0.1), fill: "accent" },
  // Foot
  { d: "M-0.3 0.72H0.3L0.36 0.86H-0.36Z", fill: "gold" },
];

/** The swastik of Hindu cards, arms turning clockwise, with a dot in each quarter. */
const SWASTIK: Shape[] = [
  {
    d: "M0 -0.72V0.72M-0.72 0H0.72" + "M0 -0.72H0.72M0.72 0V0.72M0 0.72H-0.72M-0.72 0V-0.72",
    stroke: "accent",
    width: 0.15,
  },
  {
    d: [
      [-0.38, -0.38],
      [0.38, -0.38],
      [0.38, 0.38],
      [-0.38, 0.38],
    ]
      .map(([x, y]) => circle(x!, y!, 0.09))
      .join(""),
    fill: "accent",
  },
];

/** A clay diya with its flame. */
const DIYA: Shape[] = [
  {
    d: "M0 -0.82C0.2 -0.5 0.24 -0.28 0 -0.08C-0.24 -0.28 -0.2 -0.5 0 -0.82Z",
    fill: "accent",
  },
  {
    d: "M0 -0.56C0.1 -0.4 0.1 -0.28 0 -0.18C-0.1 -0.28 -0.1 -0.4 0 -0.56Z",
    fill: "paper",
    finish: "paper",
    opacity: 0.8,
  },
  { d: "M-0.8 0.02C-0.6 0.56 0.6 0.56 0.8 0.02L0.4 0.1H-0.4Z", fill: "gold" },
  { d: "M-0.8 0.02L0.92 -0.06", stroke: "gold", width: 0.06 },
  { d: "M-0.22 0.44H0.22L0.3 0.62H-0.3Z", fill: "gold" },
];

/** Prajapati, the butterfly of Bengali cards: four wings, a body and two feelers. */
const PRAJAPATI: Shape[] = [
  {
    d:
      ellipse(-0.42, -0.26, 0.24, 0.44, -58) +
      ellipse(0.42, -0.26, 0.24, 0.44, 58) +
      ellipse(-0.3, 0.34, 0.16, 0.3, -140) +
      ellipse(0.3, 0.34, 0.16, 0.3, 140),
    fill: "accent",
  },
  {
    d:
      circle(-0.46, -0.3, 0.1) +
      circle(0.46, -0.3, 0.1) +
      circle(-0.3, 0.38, 0.06) +
      circle(0.3, 0.38, 0.06),
    fill: "paper",
    finish: "paper",
  },
  { d: ellipse(0, 0.04, 0.08, 0.46), fill: "gold" },
  {
    d: "M-0.03 -0.4C-0.1 -0.62 -0.2 -0.74 -0.34 -0.8M0.03 -0.4C0.1 -0.62 0.2 -0.74 0.34 -0.8",
    stroke: "gold",
    width: 0.05,
  },
  { d: circle(-0.34, -0.8, 0.05) + circle(0.34, -0.8, 0.05), fill: "gold" },
];

/** A petal `length` long, from (x, y) toward -y, turned `deg` clockwise. */
function petal(x: number, y: number, length: number, width: number, deg: number): string {
  const p = (px: number, py: number) => {
    const [tx, ty] = turn(px, py, deg);
    return `${n(tx + x)} ${n(ty + y)}`;
  };
  const w = width / 2;
  return (
    `M${p(0, 0)}C${p(-w, -length * 0.35)} ${p(-w * 0.55, -length * 0.85)} ${p(0, -length)}` +
    `C${p(w * 0.55, -length * 0.85)} ${p(w, -length * 0.35)} ${p(0, 0)}Z`
  );
}

/** The kamal, the lotus of Lakshmi and of Jain cards: seven petals over still water. */
const KAMAL: Shape[] = [
  { d: petal(0, 0.5, 0.82, 0.44, -68) + petal(0, 0.5, 0.82, 0.44, 68), fill: "gold" },
  { d: petal(0, 0.5, 1.02, 0.46, -36) + petal(0, 0.5, 1.02, 0.46, 36), fill: "accent" },
  { d: petal(0, 0.5, 1.22, 0.5, 0), fill: "accent" },
  {
    d: petal(0, 0.5, 0.72, 0.2, 0) + petal(0, 0.5, 0.6, 0.18, -36) + petal(0, 0.5, 0.6, 0.18, 36),
    fill: "paper",
    finish: "paper",
    opacity: 0.55,
  },
  { d: "M-0.8 0.6C-0.4 0.78 0.4 0.78 0.8 0.6", stroke: "gold", width: 0.07 },
];

/** The shankh, the conch blown at Bengali and Odia weddings: its spire, bands and mouth. */
const SHANKH: Shape[] = [
  {
    d:
      "M-0.82 -0.06C-0.6 -0.46 0.1 -0.62 0.56 -0.42C0.88 -0.26 0.92 0.16 0.7 0.36" +
      "C0.44 0.6 -0.12 0.56 -0.42 0.26C-0.58 0.12 -0.72 0.04 -0.82 -0.06Z",
    fill: "gold",
  },
  {
    d: "M-0.5 -0.27C-0.38 -0.08 -0.38 0.1 -0.46 0.2M-0.24 -0.4C-0.1 -0.14 -0.1 0.18 -0.2 0.38",
    stroke: "paper",
    width: 0.06,
    finish: "paper",
  },
  { d: ellipse(0.5, -0.02, 0.17, 0.31, 18), fill: "accent" },
  { d: circle(-0.84, -0.06, 0.07), fill: "accent" },
];

/** The Khanda of Sikh cards: the double-edged sword, the chakkar round it, two kirpans. */
const KHANDA: Shape[] = [
  // The two kirpans curving up either side, their hilts crossed below
  {
    d:
      "M-0.1 0.6C-0.66 0.52 -0.92 0.06 -0.78 -0.34C-0.7 0.02 -0.5 0.36 -0.06 0.48Z" +
      "M0.1 0.6C0.66 0.52 0.92 0.06 0.78 -0.34C0.7 0.02 0.5 0.36 0.06 0.48Z",
    fill: "accent",
  },
  { d: "M-0.06 0.54L0.24 0.88M0.06 0.54L-0.24 0.88", stroke: "accent", width: 0.08 },
  // The chakkar
  { d: circle(0, 0.1, 0.44), stroke: "gold", width: 0.11 },
  // The khanda: blade, guard, grip and pommel
  {
    d:
      "M0 -0.94L0.11 -0.72L0.085 0.4L0.17 0.44V0.53H0.045V0.66H-0.045V0.53H-0.17V0.44" +
      "L-0.085 0.4L-0.11 -0.72Z",
    fill: "gold",
  },
  { d: circle(0, 0.72, 0.065), fill: "gold" },
  { d: "M0 -0.7V0.36", stroke: "paper", width: 0.025, finish: "paper", opacity: 0.7 },
];

/** The crescent moon and star printed on many Muslim wedding cards. */
const CHAND_TARA: Shape[] = [
  { d: "M0.232 -0.696A0.78 0.78 0 1 0 0.487 0.49A0.64 0.64 0 1 1 0.232 -0.696Z", fill: "gold" },
  {
    d:
      "M0.5 -0.27L0.559 -0.101L0.738 -0.097L0.595 0.011L0.647 0.182L0.5 0.08L0.353 0.182" +
      "L0.405 0.011L0.262 -0.097L0.441 -0.101Z",
    fill: "accent",
  },
];

/** The cross of Christian cards, with a fine line down its arms. */
const CROSS: Shape[] = [
  { d: circle(0, -0.3, 0.42), fill: "gold", opacity: 0.18 },
  {
    d: "M-0.11 -0.86H0.11V-0.44H0.52V-0.2H0.11V0.86H-0.11V-0.2H-0.52V-0.44H-0.11Z",
    fill: "gold",
  },
  { d: "M0 -0.78V0.78M-0.44 -0.32H0.44", stroke: "paper", width: 0.03, finish: "paper" },
];

/** A dove in flight with an olive sprig, for Christian weddings and christenings. */
const DOVE: Shape[] = [
  // Body, head and tail
  {
    d:
      "M-0.78 0.12C-0.4 -0.02 0.1 0.02 0.44 -0.16C0.6 -0.24 0.72 -0.22 0.78 -0.13L0.94 -0.08" +
      "L0.78 -0.02C0.6 0.2 0.2 0.36 -0.3 0.31L-0.86 0.46L-0.62 0.24L-0.96 0.2Z",
    fill: "gold",
  },
  // The raised wing
  {
    d: "M-0.18 0.04C-0.26 -0.46 0.04 -0.8 0.36 -0.88C0.24 -0.56 0.3 -0.3 0.22 -0.02Z",
    fill: "gold",
  },
  {
    d: "M-0.06 -0.08C-0.04 -0.38 0.1 -0.6 0.26 -0.72M0.06 -0.04C0.1 -0.28 0.18 -0.44 0.28 -0.54",
    stroke: "paper",
    width: 0.035,
    finish: "paper",
  },
  { d: circle(0.68, -0.13, 0.03), fill: "paper", finish: "paper" },
  // The olive sprig from its beak
  { d: "M0.88 -0.05C0.84 0.14 0.74 0.3 0.58 0.44", stroke: "accent", width: 0.035 },
  {
    d:
      ellipse(0.84, 0.12, 0.05, 0.1, -30) +
      ellipse(0.74, 0.27, 0.05, 0.1, 40) +
      ellipse(0.64, 0.4, 0.05, 0.1, -20),
    fill: "accent",
  },
];

/** The swastika, arms turning clockwise, `size` across and centred on (x, y). */
function swastika(x: number, y: number, size: number): string {
  const h = size / 2;
  const at = (px: number, py: number) => `${n(x + px * h)} ${n(y + py * h)}`;
  return (
    `M${at(0, -1)}L${at(0, 1)}M${at(-1, 0)}L${at(1, 0)}` +
    `M${at(0, -1)}L${at(1, -1)}M${at(1, 0)}L${at(1, 1)}` +
    `M${at(0, 1)}L${at(-1, 1)}M${at(-1, 0)}L${at(-1, -1)}`
  );
}

/**
 * The Jain emblem's crown: the swastika for the four states of birth, three dots for the
 * three jewels, the crescent of the Siddhashila and the dot of the liberated soul above.
 */
const JAIN: Shape[] = [
  { d: swastika(0, 0.42, 0.86), stroke: "accent", width: 0.11 },
  {
    d: circle(-0.28, -0.18, 0.075) + circle(0, -0.18, 0.075) + circle(0.28, -0.18, 0.075),
    fill: "gold",
  },
  {
    d: "M-0.36 -0.52C-0.22 -0.32 0.22 -0.32 0.36 -0.52C0.2 -0.42 -0.2 -0.42 -0.36 -0.52Z",
    fill: "gold",
  },
  { d: circle(0, -0.74, 0.08), fill: "accent" },
];

export const SYMBOLS: Record<SymbolId, SacredSymbol> = {
  om: { kind: "glyph", text: "ॐ", font: "display" },
  kalash: { kind: "art", shapes: KALASH },
  swastik: { kind: "art", shapes: SWASTIK },
  diya: { kind: "art", shapes: DIYA },
  prajapati: { kind: "art", shapes: PRAJAPATI },
  // The Pillaiyar suzhi of Tamil cards
  suzhi: { kind: "glyph", text: "உ", font: "sans" },
  // Shri, at the head of North Indian, Marwari and Gujarati cards
  shri: { kind: "glyph", text: "श्री", font: "display", scale: 0.72 },
  shankh: { kind: "art", shapes: SHANKH },
  kamal: { kind: "art", shapes: KAMAL },
  // Ik Onkar, set in the phone's own Gurmukhi letters
  "ik-onkar": { kind: "glyph", text: "ੴ", font: "sans", scale: 0.72 },
  khanda: { kind: "art", shapes: KHANDA },
  "chand-tara": { kind: "art", shapes: CHAND_TARA },
  // 786, the number many Indian Muslim cards print for the Bismillah
  "786": { kind: "glyph", text: "786", font: "display", scale: 0.52 },
  bismillah: { kind: "glyph", text: "بسم الله", font: "sans", scale: 0.42 },
  cross: { kind: "art", shapes: CROSS },
  dove: { kind: "art", shapes: DOVE },
  jain: { kind: "art", shapes: JAIN },
};

/** A small ring of dots, for the symbol picker's empty choice. */
export const NO_SYMBOL: Shape[] = [
  { d: ring(8, 0, (deg) => circle(...turn(0, -0.6, deg), 0.07)), fill: "gold" },
];
