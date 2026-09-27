/*
 * Regional openings (docs/MOTION.md, Step 12c): what each tradition pack does in the few
 * seconds after a guest opens the card, and what keeps moving gently afterwards. Data and
 * pure timing only, so the 3D scene, the 2D card and the tests all read the same thing.
 */

import { clamp } from "@/lib/hero-motion";
import type { RenderLevel } from "./quality";
import type { PatternId } from "./patterns";
import type { TraditionId } from "@/lib/traditions/schema";

/**
 * The parts of an opening, each running over its own window of seconds after the tap.
 * "flight" is whatever flies in: the Prajapati butterfly, or kites crossing the sky.
 */
export const TRACKS = [
  "pattern",
  "glow",
  "garland",
  "lamps",
  "burst",
  "flight",
  "ambient",
] as const;
export type TrackId = (typeof TRACKS)[number];

/** Seconds after the tap. The doors take about 1.5 s; everything is done by six. */
export type Window = { start: number; end: number };

/**
 * A colour: a design token name ("marigold"), or a part of the card's own stock
 * ("stock:gold"), so the motion takes on each design's colours.
 */
export type ColourRef = string;

export type AmbientKind = "petals" | "butterflies" | "kites" | "motes" | "lanterns";

/** Something that keeps moving once the card is open, with how many at each level. */
export type AmbientSet = {
  kind: AmbientKind;
  colours: readonly ColourRef[];
  counts: Record<RenderLevel, number>;
  /** Size relative to the usual one for its kind. */
  size?: number;
};

export type MotionProfile = {
  id: TraditionId;
  tracks: Partial<Record<TrackId, Window>>;
  /** A pattern that draws itself behind the card: kolam, rangoli, alpona or a gold line. */
  pattern: { id: PatternId; colours: readonly [ColourRef, ColourRef] } | null;
  /** Garlands that swing down across the top: marigold strings or a mango-leaf thoranam. */
  garland: "marigold" | "mango-leaf" | null;
  /** Clay lamps beside the card that light during the opening, then flicker. */
  lamps: boolean;
  /** The sacred symbol glows. Sacred art never spins or bounces: glow is all it does. */
  symbolGlow: boolean;
  /** A sprinkle that bursts from the card as it opens (haldi-kumkum, bandhani dots). */
  burst: { colours: readonly ColourRef[]; counts: Record<RenderLevel, number> } | null;
  /** A Prajapati butterfly that flies in and settles by the couple's names. */
  prajapati: boolean;
  ambient: readonly AmbientSet[];
};

/** The longest an opening may run (docs/MOTION.md, section 10). */
export const OPENING_SECONDS = 6;

const MARIGOLD_PETALS: AmbientSet = {
  kind: "petals",
  colours: ["marigold", "marigold-strong", "motion-turmeric", "marigold"],
  counts: { high: 110, medium: 60, low: 24 },
};

export const MOTION: Record<TraditionId, MotionProfile> = {
  "north-hindu": {
    id: "north-hindu",
    tracks: {
      glow: { start: 0.6, end: 2.6 },
      garland: { start: 1, end: 3.2 },
      lamps: { start: 2, end: 3.4 },
      ambient: { start: 1.2, end: 3 },
    },
    pattern: null,
    garland: "marigold",
    lamps: true,
    symbolGlow: true,
    burst: null,
    prajapati: false,
    ambient: [MARIGOLD_PETALS],
  },
  rajasthani: {
    id: "rajasthani",
    tracks: {
      glow: { start: 0.6, end: 2.4 },
      garland: { start: 0.9, end: 3 },
      ambient: { start: 1.2, end: 3.4 },
    },
    pattern: null,
    garland: "marigold",
    lamps: false,
    symbolGlow: true,
    burst: null,
    prajapati: false,
    ambient: [
      MARIGOLD_PETALS,
      {
        kind: "lanterns",
        colours: ["motion-flame", "stock:accent"],
        counts: { high: 12, medium: 7, low: 3 },
      },
    ],
  },
  marathi: {
    id: "marathi",
    tracks: {
      pattern: { start: 0.3, end: 4 },
      burst: { start: 0.9, end: 2.6 },
      glow: { start: 1.6, end: 3.4 },
      ambient: { start: 2.2, end: 4.4 },
    },
    pattern: { id: "rangoli", colours: ["stock:gold", "motion-kumkum"] },
    garland: null,
    lamps: false,
    symbolGlow: true,
    burst: {
      colours: ["motion-turmeric", "motion-kumkum", "motion-turmeric"],
      counts: { high: 160, medium: 90, low: 36 },
    },
    prajapati: false,
    ambient: [
      {
        kind: "motes",
        colours: ["motion-turmeric", "marigold"],
        counts: { high: 70, medium: 40, low: 16 },
      },
      { ...MARIGOLD_PETALS, counts: { high: 60, medium: 34, low: 14 } },
    ],
  },
  gujarati: {
    id: "gujarati",
    tracks: {
      flight: { start: 0.2, end: 3.2 },
      burst: { start: 0.8, end: 2.8 },
      glow: { start: 1.4, end: 3.2 },
      ambient: { start: 2.4, end: 4.6 },
    },
    pattern: null,
    garland: null,
    lamps: false,
    symbolGlow: true,
    // Bandhani dots bloom into colour as the doors part
    burst: {
      colours: ["tpl-bandhani-ornament", "marigold", "motion-kumkum", "motion-kite-green"],
      counts: { high: 150, medium: 80, low: 32 },
    },
    prajapati: false,
    ambient: [
      {
        kind: "kites",
        colours: [
          "motion-kite-pink",
          "motion-kite-blue",
          "motion-kite-yellow",
          "motion-kite-green",
        ],
        counts: { high: 7, medium: 5, low: 3 },
      },
      {
        kind: "motes",
        colours: ["tpl-bandhani-ornament", "marigold", "motion-kite-green"],
        counts: { high: 50, medium: 28, low: 12 },
        size: 1.3,
      },
    ],
  },
  bengali: {
    id: "bengali",
    tracks: {
      pattern: { start: 0.3, end: 4.2 },
      flight: { start: 1.2, end: 4.6 },
      glow: { start: 1, end: 3 },
      ambient: { start: 2.6, end: 4.8 },
    },
    pattern: { id: "alpona", colours: ["motion-rice", "motion-kumkum"] },
    garland: null,
    lamps: false,
    symbolGlow: true,
    burst: null,
    prajapati: true,
    ambient: [
      {
        kind: "butterflies",
        colours: ["motion-kumkum", "marigold", "motion-rice"],
        counts: { high: 6, medium: 4, low: 2 },
      },
      {
        kind: "petals",
        colours: ["motion-kumkum", "petal-jasmine", "motion-kumkum"],
        counts: { high: 80, medium: 44, low: 18 },
        size: 0.9,
      },
    ],
  },
  tamil: {
    id: "tamil",
    tracks: {
      pattern: { start: 0.2, end: 3.8 },
      lamps: { start: 1.4, end: 3 },
      garland: { start: 2, end: 4.2 },
      glow: { start: 1.8, end: 3.6 },
      ambient: { start: 2.8, end: 5 },
    },
    pattern: { id: "kolam", colours: ["motion-rice", "stock:gold"] },
    garland: "mango-leaf",
    lamps: true,
    symbolGlow: true,
    burst: null,
    prajapati: false,
    ambient: [
      {
        kind: "petals",
        colours: ["petal-jasmine", "petal-jasmine", "marigold"],
        counts: { high: 90, medium: 50, low: 20 },
        size: 0.7,
      },
    ],
  },
  modern: {
    id: "modern",
    tracks: {
      pattern: { start: 0.4, end: 3 },
      ambient: { start: 1.6, end: 3.6 },
    },
    pattern: { id: "frame", colours: ["stock:gold", "stock:gold"] },
    garland: null,
    lamps: false,
    symbolGlow: false,
    burst: null,
    prajapati: false,
    ambient: [
      {
        kind: "motes",
        colours: ["gold-glint", "stock:gold"],
        counts: { high: 36, medium: 20, low: 8 },
        size: 0.8,
      },
    ],
  },
};

/** The profile for a card's tradition; cards without one keep their design's own scene. */
export function motionFor(tradition: TraditionId | null | undefined): MotionProfile | null {
  return tradition ? MOTION[tradition] : null;
}

/** When the last part of an opening finishes. */
export function openingLength(profile: MotionProfile): number {
  return Math.max(0, ...Object.values(profile.tracks).map((window) => window.end));
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * How far along each part of the opening is, 0 to 1, `seconds` after the tap. A part
 * the profile doesn't use reads 1, so the scene can multiply by it freely.
 */
export function openingAt(profile: MotionProfile, seconds: number): Record<TrackId, number> {
  const out = {} as Record<TrackId, number>;
  for (const track of TRACKS) {
    const window = profile.tracks[track];
    out[track] = window
      ? easeInOut(clamp((seconds - window.start) / Math.max(window.end - window.start, 0.001)))
      : 1;
  }
  return out;
}

/** The colours a profile uses, for the scene to read once. */
export function profileColours(profile: MotionProfile): ColourRef[] {
  const all = [
    ...(profile.pattern?.colours ?? []),
    ...(profile.burst?.colours ?? []),
    ...profile.ambient.flatMap((set) => set.colours),
  ];
  return [...new Set(all)];
}

/** Turns a colour reference into a colour, from the card's stock or the page's tokens. */
export function resolveColour(
  ref: ColourRef,
  stock: Record<string, string>,
  readToken: (token: string) => string,
): string {
  return ref.startsWith("stock:") ? (stock[ref.slice(6)] ?? "") : readToken(ref);
}
