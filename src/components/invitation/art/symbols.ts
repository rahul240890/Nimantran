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
  { kind: "art"; shapes: readonly Shape[] } | { kind: "glyph"; text: string; font: FontRole };

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

export const SYMBOLS: Record<SymbolId, SacredSymbol> = {
  om: { kind: "glyph", text: "ॐ", font: "display" },
  kalash: { kind: "art", shapes: KALASH },
  swastik: { kind: "art", shapes: SWASTIK },
  diya: { kind: "art", shapes: DIYA },
  prajapati: { kind: "art", shapes: PRAJAPATI },
  // The Pillaiyar suzhi of Tamil cards
  suzhi: { kind: "glyph", text: "உ", font: "sans" },
};

/** A small ring of dots, for the symbol picker's empty choice. */
export const NO_SYMBOL: Shape[] = [
  { d: ring(8, 0, (deg) => circle(...turn(0, -0.6, deg), 0.07)), fill: "gold" },
];
