import { SUITE_IDS, SUITES, type SuiteId } from "./catalog";
import { hash } from "./section-layouts";

/*
 * The two blessings a guest gives on the themed guest page (themed-details.tsx): flowers
 * for the family after the welcome, and a light at night before the reply. Each has many
 * ways of being given, each with its own drawing and its own movement (flower-blessing.tsx,
 * lamp-blessing.tsx, guest-blessings.css), and every theme gets one of each. The themes are
 * dealt the ways in turn, flowers one step and lights another, so neighbouring themes in
 * the catalogue never give their guests the same pair.
 */

export const FLOWER_BLESSINGS = [
  /** Petals heaped on a brass plate, lifted into a shower over the whole screen. */
  "shower",
  /** A woven basket tipped, petals thrown out in an arc. */
  "basket",
  /** A brass urli of water: each flower dropped in floats with a ripple. */
  "urli",
  /** A garland threaded flower by flower, then swaying. */
  "garland",
  /** A lotus bud on the water opening petal by petal. */
  "lotus",
  /** A wrapped bouquet whose blooms open one after another. */
  "bouquet",
  /** A flowering branch: buds open along it and petals fall. */
  "branch",
  /** Petals flying in to lay a pookalam of rings. */
  "rangoli",
  /** Leaf boats of flowers sent down a stream. */
  "boat",
  /** A party popper bursting with petals. */
  "popper",
  /** A gift box whose lid lifts and blooms rise out. */
  "gift",
  /** Butterflies each carrying a petal up and away. */
  "butterflies",
  /** Petals gathering into a heart that beats. */
  "heart",
  /** A canopy of flowers on four poles, shaken so petals fall under it. */
  "chadar",
  /** Petals caught in a whirl round one flower, then let go. */
  "whirl",
] as const;

export const LAMP_BLESSINGS = [
  /** Clay diyas on a step. */
  "diyas",
  /** Paper lanterns at different heights. */
  "lanterns",
  /** A tall brass nilavilakku over floating diyas. */
  "nilavilakku",
  /** A strand of coloured bulbs. */
  "fairy",
  /** Diyas drifting down a river. */
  "river",
  /** Sky lanterns rising into the night. */
  "sky",
  /** Diyas in a lotus of rings, lit from the middle out. */
  "spiral",
  /** A deepstambh, its tiers lit from the foot to the top. */
  "stambh",
  /** A star-shaped akash kandil turning on its string. */
  "akash",
  /** Candles of different heights on a tray. */
  "candles",
  /** A glass jar of fireflies let out into the dark. */
  "fireflies",
  /** A pierced brass lantern throwing stars of light round it. */
  "jaali",
  /** Phuljhadi sparklers throwing sparks. */
  "sparklers",
  /** A chandelier with its candles and crystal drops. */
  "chandelier",
] as const;

export type FlowerBlessing = (typeof FLOWER_BLESSINGS)[number];
export type LampBlessing = (typeof LAMP_BLESSINGS)[number];
export type Blessings = { flowers: FlowerBlessing; lamp: LampBlessing };

/** The themes with a themed guest page, in catalogue order. */
let order: Map<string, number> | null = null;
function place(suite: SuiteId): number {
  if (!order) {
    const themed = SUITE_IDS.filter((id) => SUITES[id].art !== "card" && SUITES[id].images.cover);
    order = new Map(themed.map((id, i) => [id, i]));
  }
  return order.get(suite) ?? hash(`${suite}:blessings`);
}

/**
 * This theme's two blessings: the same every time, on server and client. Flowers step one
 * way along their list and lights another (5 is prime to 14), so the pairs keep changing.
 */
export function blessings(suite: SuiteId): Blessings {
  const n = place(suite);
  return {
    flowers: FLOWER_BLESSINGS[n % FLOWER_BLESSINGS.length]!,
    lamp: LAMP_BLESSINGS[(n * 5 + 3) % LAMP_BLESSINGS.length]!,
  };
}

export const isFlowerBlessing = (value: unknown): value is FlowerBlessing =>
  FLOWER_BLESSINGS.includes(value as FlowerBlessing);
export const isLampBlessing = (value: unknown): value is LampBlessing =>
  LAMP_BLESSINGS.includes(value as LampBlessing);
