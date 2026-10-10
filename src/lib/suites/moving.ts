/*
 * Moving scenes (catalog.ts MOVING_IDS): a no-photo Scene painted in four layers that the
 * guest's phone moves like a short film (shubhdwar/moving-scene-prompts.md). The sky at
 * the back holds the words in its calm space; the place sits over the lower half; pieces
 * in front sway from where they hang or grow; and six small things (petals, lanterns,
 * birds) are copied and set floating. Where each layer sits comes from the cut images
 * (moving-layers.ts); what moves how is chosen here, theme by theme.
 *
 * Boxes are percentages of the painting, like every Scene's: [x, y, width, height].
 */

import type { CSSProperties } from "react";
import { MOVING_IDS, type MovingId, type SuiteId } from "./catalog";
import { MOVING_LAYOUTS } from "./moving-layers";
import type { FrameBox } from "./photo-frames";

/** How a piece in front moves: swings from its anchor, ripples like cloth, bobs, or stays. */
export type FrontMotion = "sway" | "flutter" | "bob" | "still";

export type FrontPiece = {
  box: FrameBox;
  /** The point it swings from, in percent of its own box. */
  origin: readonly [number, number];
  side: "top" | "bottom" | "left" | "right" | "free";
  motion: FrontMotion;
  /** How far it swings, in degrees. */
  amount: number;
};

/** Where a moving scene's layers sit, from its cut images. */
export type MovingLayout = {
  middle: FrameBox;
  front: readonly FrontPiece[];
  /** The six floating pieces' shapes (width over height), in reading order. */
  sprites: readonly ({ aspect: number } | null)[];
};

/**
 * How floating pieces move: fall (petals, snow), rise (lanterns, sparks, bubbles), glide
 * across (birds, butterflies, fish, clouds, boats), bob in one place (kites), or twinkle.
 */
export type FloatKind = "fall" | "rise" | "glide" | "bob" | "twinkle";

type Float = {
  /** Which of the six pieces, in reading order. */
  sprite: number;
  kind: FloatKind;
  count: number;
  /** Its width, in percent of the painting's. */
  size: number;
  /** The band it moves in, top to bottom, in percent; missing is the whole painting. */
  band?: readonly [number, number];
  /** Another piece shown in turn with it: the same bird with its wings the other way. */
  pair?: number;
  /** Slower or faster than its kind's usual pace. */
  pace?: number;
};

type MovingEntry = {
  /** The calm space in the sky the words go in. */
  open: FrameBox;
  /** That space is dark, so the words print light. */
  dark?: true;
  /** The water in the place, top to bottom in percent, which shimmers. */
  water?: readonly [number, number];
  floats: readonly Float[];
};

const fall = (sprite: number, count: number, size: number, more: Partial<Float> = {}): Float => ({
  sprite,
  kind: "fall",
  count,
  size,
  ...more,
});
const rise = (sprite: number, count: number, size: number, more: Partial<Float> = {}): Float => ({
  sprite,
  kind: "rise",
  count,
  size,
  ...more,
});
const glide = (sprite: number, count: number, size: number, more: Partial<Float> = {}): Float => ({
  sprite,
  kind: "glide",
  count,
  size,
  ...more,
});
const twinkle = (
  sprite: number,
  count: number,
  size: number,
  band: readonly [number, number],
): Float => ({ sprite, kind: "twinkle", count, size, band });

const MOVING: Record<MovingId, MovingEntry> = {
  // The lake palace at dusk: petals fall, lamps on leaf boats drift on the lake
  "jal-mahal": {
    open: [10, 20, 80, 27],
    water: [70, 97],
    floats: [
      fall(0, 3, 4),
      fall(1, 2, 4),
      fall(2, 1, 5),
      fall(5, 1, 5),
      glide(3, 1, 9, { band: [80, 92], pace: 1.6 }),
      glide(4, 1, 8, { band: [86, 96], pace: 1.6 }),
    ],
  },
  // Gulmohar blossoms fall all along the avenue, and a sparrow crosses
  "gulmohar-rasta": {
    open: [8, 18, 84, 27],
    floats: [
      fall(0, 2, 5),
      fall(1, 3, 3.5),
      fall(2, 2, 3.5),
      fall(3, 1, 6),
      fall(5, 1, 5),
      glide(4, 1, 7, { band: [6, 40] }),
    ],
  },
  // A marigold shower for the haldi
  "genda-barsaat": {
    open: [14, 13, 72, 35],
    floats: [fall(0, 5, 4), fall(1, 4, 4), fall(2, 1, 6), fall(3, 1, 6), fall(4, 1, 5)],
  },
  // Sky lanterns rise over the town, sparkles burst and stars twinkle
  "akash-kandil": {
    open: [10, 16, 80, 25],
    dark: true,
    floats: [
      rise(0, 3, 7, { band: [5, 82] }),
      rise(1, 2, 5, { band: [5, 82] }),
      twinkle(2, 2, 9, [4, 44]),
      twinkle(5, 4, 3, [3, 46]),
      fall(4, 1, 4),
    ],
  },
  // Stars twinkle over the courtyard, jasmine falls and small lanterns rise far off
  "chand-raat": {
    open: [14, 19, 72, 25],
    dark: true,
    water: [62, 88],
    floats: [
      twinkle(0, 3, 4, [3, 42]),
      twinkle(1, 3, 3, [3, 42]),
      fall(2, 2, 4),
      fall(3, 2, 4),
      rise(4, 2, 5, { band: [10, 60] }),
    ],
  },
  // Butterflies flutter through the garden, bubbles float up, seeds drift
  "titli-bagh": {
    open: [8, 17, 84, 23],
    floats: [
      glide(0, 2, 7, { pair: 1, band: [15, 85] }),
      glide(2, 2, 7, { pair: 3, band: [15, 85] }),
      rise(4, 3, 5),
      glide(5, 2, 3, { band: [20, 70], pace: 1.3 }),
    ],
  },
  // Jasmine rains on the temple tank and leaf lamps drift on the water
  "malli-mazhai": {
    open: [22, 13, 56, 32],
    dark: true,
    water: [70, 98],
    floats: [
      fall(0, 4, 2.5),
      fall(1, 3, 3.5),
      fall(2, 2, 3.5),
      fall(3, 2, 3.5),
      fall(4, 1, 4),
      glide(5, 2, 7, { band: [80, 95], pace: 1.6 }),
    ],
  },
  // Night jasmine drops at dawn, a kash plume blows past, a kingfisher crosses
  "shiuli-bhor": {
    open: [28, 13, 60, 27],
    water: [82, 100],
    floats: [
      fall(0, 3, 3.5),
      fall(1, 2, 3.5),
      fall(2, 2, 3.5),
      fall(5, 1, 3),
      glide(3, 1, 7, { band: [30, 70] }),
      glide(4, 1, 7, { band: [8, 34] }),
    ],
  },
  // Kites bob over the mustard, petals blow and a parrot flies past
  "sarson-khet": {
    open: [34, 6, 60, 38],
    floats: [
      { sprite: 0, kind: "bob", count: 1, size: 7, band: [8, 30] },
      { sprite: 1, kind: "bob", count: 1, size: 6, band: [8, 30] },
      fall(2, 1, 3),
      fall(3, 1, 3),
      fall(5, 3, 2.5),
      glide(4, 1, 7, { band: [10, 40] }),
    ],
  },
  // Sparks drift up from the tent and stars twinkle over it
  "shamiana-raat": {
    open: [10, 17, 80, 27],
    dark: true,
    floats: [
      rise(0, 5, 2.5, { band: [40, 96] }),
      rise(1, 3, 5, { band: [40, 96] }),
      fall(2, 1, 4),
      fall(3, 3, 3),
      twinkle(5, 5, 3, [3, 45]),
    ],
  },
  // Fireflies wander over the backwater by moonlight, and a heron crosses
  "kettuvallam-raat": {
    open: [10, 22, 80, 24],
    dark: true,
    water: [62, 100],
    floats: [
      twinkle(0, 4, 3, [44, 96]),
      twinkle(1, 3, 3, [44, 96]),
      twinkle(5, 2, 5, [44, 96]),
      glide(2, 1, 6, { band: [85, 96], pace: 1.6 }),
      fall(3, 2, 3),
      glide(4, 1, 9, { band: [6, 30] }),
    ],
  },
  // Lamps on leaf boats float down the river and marigold petals fall
  "diya-dhara": {
    open: [19, 6, 62, 32],
    dark: true,
    water: [60, 100],
    floats: [
      glide(0, 1, 8, { band: [70, 90], pace: 1.6 }),
      glide(1, 1, 7, { band: [66, 84], pace: 1.6 }),
      glide(2, 1, 7, { band: [76, 94], pace: 1.6 }),
      fall(3, 1, 4),
      fall(4, 3, 3),
    ],
  },
  // White doves glide past the chapel, petals drift down
  "wedding-bells": {
    open: [18, 22, 64, 22],
    floats: [
      glide(0, 2, 9, { pair: 1, band: [6, 44] }),
      fall(2, 3, 3),
      fall(3, 3, 3),
      fall(4, 1, 4),
      fall(5, 1, 4),
    ],
  },
  // Monsoon rain on the mehendi courtyard
  "saawan-bundein": {
    open: [8, 15, 56, 21],
    water: [88, 100],
    floats: [
      fall(0, 10, 1.6, { pace: 0.25 }),
      fall(1, 3, 1.5, { pace: 0.35 }),
      fall(3, 1, 4),
      fall(4, 1, 4),
    ],
  },
  // Willow leaves drift down over the swans, soft lights float up from the lake
  "hans-jheel": {
    open: [10, 18, 80, 27],
    water: [60, 100],
    floats: [
      fall(0, 3, 3),
      fall(1, 2, 3),
      fall(2, 1, 4),
      fall(3, 1, 3),
      rise(4, 3, 5, { band: [55, 95] }),
      glide(5, 1, 4, { band: [20, 60] }),
    ],
  },
  // Sparks spiral up around the garbo pots, mirrors spin as they fall
  "navratri-garbi": {
    open: [10, 15, 80, 26],
    dark: true,
    floats: [
      rise(1, 4, 3, { band: [36, 96] }),
      rise(2, 4, 3, { band: [36, 96] }),
      rise(5, 3, 5, { band: [36, 96] }),
      fall(0, 2, 4),
      fall(3, 1, 4),
    ],
  },
  // Snow swirls down over the village and lights twinkle
  "snow-globe": {
    open: [8, 20, 84, 25],
    dark: true,
    floats: [
      fall(0, 5, 2.5),
      fall(1, 4, 2.5),
      fall(2, 2, 4),
      fall(3, 6, 1.2),
      twinkle(5, 4, 3, [3, 45]),
    ],
  },
  // Fish swim across, bubbles rise and a jellyfish pulses up
  "sea-bubbles": {
    open: [5, 7, 90, 33],
    floats: [
      glide(0, 1, 10, { band: [40, 70] }),
      glide(1, 1, 9, { band: [35, 65] }),
      glide(2, 1, 8, { band: [50, 80] }),
      rise(3, 3, 5),
      rise(4, 4, 2.5),
      rise(5, 1, 7, { pace: 1.5 }),
    ],
  },
  // Clouds drift past the cradle, a balloon floats up, stars twinkle
  "badal-sapne": {
    open: [10, 21, 80, 28],
    floats: [
      glide(0, 2, 18, { band: [8, 48], pace: 1.5 }),
      glide(1, 2, 22, { band: [8, 48], pace: 1.5 }),
      rise(4, 1, 8, { pace: 1.4 }),
      twinkle(2, 3, 4, [4, 50]),
      twinkle(3, 3, 3, [4, 50]),
    ],
  },
  // A sparrow flies in the morning courtyard, leaves and petals drift, dust glints
  "aangan-subah": {
    open: [9, 12.5, 64, 26],
    floats: [
      glide(1, 1, 8, { band: [8, 40] }),
      fall(2, 1, 4),
      fall(3, 2, 4),
      fall(4, 1, 4),
      twinkle(5, 3, 6, [10, 60]),
    ],
  },
  // Pigeons circle the blue city, kites bob high up, petals fall and lamps glow below
  "neeli-nagri": {
    open: [18, 12, 70, 26],
    floats: [
      glide(0, 2, 7, { pair: 1, band: [6, 40] }),
      { sprite: 2, kind: "bob", count: 1, size: 5, band: [3, 11] },
      { sprite: 3, kind: "bob", count: 1, size: 5, band: [4, 12] },
      fall(4, 4, 3),
      twinkle(5, 3, 5, [42, 80]),
    ],
  },
  // Chinar leaves spin down over the saffron, mist drifts on the lake, a sparrow crosses
  "kesar-kyari": {
    open: [10, 14, 70, 22],
    water: [60, 74],
    floats: [
      fall(0, 2, 4),
      fall(1, 2, 4),
      fall(2, 2, 4),
      fall(3, 1, 3),
      glide(4, 2, 22, { band: [58, 70], pace: 1.8 }),
      glide(5, 1, 5, { band: [8, 40] }),
    ],
  },
  // Seagulls glide over the Konkan coast, foam slides in, flowers fall
  "konkan-kinara": {
    open: [8, 13, 54, 28],
    water: [50, 88],
    floats: [
      glide(0, 2, 8, { pair: 1, band: [6, 44] }),
      fall(2, 2, 4),
      glide(4, 2, 14, { band: [70, 86], pace: 1.6 }),
      twinkle(5, 3, 5, [46, 70]),
    ],
  },
  // Mist rolls past the waterfall, orchids and ferns fall, a butterfly flits
  "megh-jharna": {
    open: [12, 12, 76, 24],
    water: [84, 96],
    floats: [
      glide(0, 1, 30, { band: [36, 62], pace: 1.8 }),
      glide(1, 1, 40, { band: [44, 72], pace: 1.8 }),
      fall(2, 2, 4),
      fall(3, 2, 4),
      glide(4, 2, 6, { pair: 5, band: [20, 80] }),
    ],
  },
  // Droplets rise from the fountains by moonlight, rose petals fall, fireflies glow
  "fawwara-bagh": {
    open: [32, 6, 54, 26],
    dark: true,
    water: [70, 100],
    floats: [
      rise(1, 4, 1.5, { band: [62, 96] }),
      fall(2, 3, 3),
      fall(3, 2, 3),
      twinkle(4, 4, 3, [50, 95]),
      twinkle(5, 4, 3, [3, 36]),
    ],
  },
  // Clouds drift through the valley, chimney smoke rises, an eagle circles
  "deodar-sanjh": {
    open: [12, 14, 76, 24],
    floats: [
      glide(0, 1, 40, { band: [42, 60], pace: 1.8 }),
      glide(1, 1, 26, { band: [38, 56], pace: 1.8 }),
      rise(2, 1, 6, { band: [44, 64], pace: 1.3 }),
      fall(3, 2, 4),
      glide(4, 1, 10, { band: [6, 30], pace: 1.4 }),
      fall(5, 1, 3),
    ],
  },
  // Rose petals drift down the chandelier hall, crystals and sequins glitter
  "jhoomar-mahal": {
    open: [18, 14, 64, 28],
    dark: true,
    floats: [
      fall(0, 3, 3),
      fall(1, 3, 3),
      twinkle(2, 3, 3, [2, 40]),
      twinkle(3, 5, 4, [2, 40]),
      twinkle(4, 2, 8, [44, 70]),
      fall(5, 4, 1.5),
    ],
  },
  // Champa flowers spin down to the temple pool and float, a parrot flies past
  "champa-baag": {
    open: [12, 11, 64, 24],
    water: [64, 100],
    floats: [
      fall(0, 2, 5),
      fall(1, 2, 5),
      fall(2, 2, 3),
      glide(3, 2, 7, { band: [72, 95], pace: 1.6 }),
      glide(4, 1, 8, { band: [6, 36] }),
      fall(5, 1, 3),
    ],
  },
  // Parrots fly between the mango branches, petals and leaves fall
  "tota-bagh": {
    open: [10, 13, 80, 24],
    floats: [
      glide(0, 2, 8, { pair: 1, band: [8, 50] }),
      fall(2, 2, 3),
      fall(3, 1, 4),
      fall(4, 2, 3),
      fall(5, 2, 3),
    ],
  },
  // Fireworks bloom above the fort, sparks fall and the lake shimmers
  aatishbaazi: {
    open: [8, 12, 84, 28],
    dark: true,
    water: [62, 80],
    floats: [
      twinkle(0, 2, 24, [0, 12]),
      twinkle(1, 2, 20, [0, 12]),
      twinkle(2, 1, 16, [38, 48]),
      fall(3, 2, 3),
      twinkle(4, 5, 2, [2, 60]),
    ],
  },
  // Shooting stars streak across, stars twinkle and fireflies wander in the grass
  "toota-taara": {
    open: [12, 13, 76, 26],
    dark: true,
    floats: [
      glide(0, 1, 22, { band: [2, 30], pace: 0.3 }),
      glide(1, 1, 14, { band: [4, 34], pace: 0.35 }),
      twinkle(2, 4, 4, [2, 40]),
      twinkle(3, 6, 1.5, [2, 40]),
      twinkle(4, 5, 3, [60, 95]),
    ],
  },
  // Clouds of gulal drift and petals shower down on the Holi of flowers
  "phoolon-ki-holi": {
    open: [12, 13, 74, 24],
    floats: [
      glide(0, 1, 20, { band: [42, 74], pace: 1.8 }),
      glide(1, 1, 18, { band: [42, 74], pace: 1.8 }),
      glide(2, 1, 18, { band: [42, 74], pace: 1.8 }),
      fall(3, 4, 3),
      fall(4, 4, 3),
      twinkle(5, 1, 16, [46, 70]),
    ],
  },
  // Peacock feathers float down the lane, marigolds fall and glows drift up
  "dahi-handi": {
    open: [8, 13, 52, 27],
    dark: true,
    floats: [
      fall(0, 2, 5),
      fall(1, 2, 4),
      fall(2, 3, 3.5),
      fall(4, 1, 4),
      rise(5, 3, 4, { band: [50, 95] }),
    ],
  },
  // Petals fall over the snake boats, water splashes and an egret crosses
  "vallam-kali": {
    open: [12, 13, 76, 26],
    water: [60, 80],
    floats: [
      fall(0, 3, 3),
      fall(1, 2, 4),
      fall(2, 2, 3),
      twinkle(3, 3, 6, [64, 80]),
      fall(4, 1, 4),
      glide(5, 1, 9, { band: [6, 34] }),
    ],
  },
  // Steam rises from the pongal pot, sparks fly up and kites bob in the sky
  "pongal-paanai": {
    open: [8, 14, 84, 24],
    floats: [
      rise(0, 1, 10, { band: [50, 72], pace: 0.8 }),
      rise(1, 1, 8, { band: [50, 72], pace: 0.8 }),
      { sprite: 2, kind: "bob", count: 1, size: 6, band: [3, 11] },
      { sprite: 3, kind: "bob", count: 1, size: 6, band: [4, 12] },
      fall(4, 1, 4),
      rise(5, 4, 1.5, { band: [60, 85] }),
    ],
  },
  // Seagulls fly over treasure island and gold coins sparkle on the sand
  "khazana-dweep": {
    open: [16, 13, 72, 20],
    water: [55, 90],
    floats: [
      glide(3, 2, 8, { pair: 4, band: [8, 45] }),
      twinkle(0, 2, 4, [70, 95]),
      twinkle(1, 2, 3, [70, 95]),
      twinkle(2, 1, 3, [70, 95]),
      twinkle(5, 4, 4, [55, 95]),
    ],
  },
  // Paper boats sail down the stream in soft rain, rings open on the water
  "kaagaz-ki-kashti": {
    open: [10, 13, 80, 24],
    water: [82, 100],
    floats: [
      glide(0, 1, 10, { band: [86, 94], pace: 1.8 }),
      glide(1, 1, 9, { band: [88, 96], pace: 1.8 }),
      fall(2, 10, 1.2, { pace: 0.25 }),
      fall(3, 3, 1.5, { pace: 0.35 }),
      twinkle(4, 3, 6, [84, 98]),
      fall(5, 1, 4),
    ],
  },
  // Snow falls under the northern lights and a penguin waddles past the igloo
  "aurora-igloo": {
    open: [10, 15, 80, 28],
    dark: true,
    water: [66, 82],
    floats: [
      glide(0, 1, 5, { pair: 1, band: [60, 64], pace: 2 }),
      fall(2, 5, 2.5),
      fall(3, 4, 3),
      twinkle(5, 4, 2, [2, 40]),
    ],
  },
  // Balloons float up from the teddy bears' picnic, bubbles drift and a kite bobs
  "teddy-picnic": {
    open: [8, 15, 84, 24],
    floats: [
      rise(0, 1, 7, { pace: 1.4 }),
      rise(1, 1, 7, { pace: 1.4 }),
      rise(2, 1, 7, { pace: 1.4 }),
      rise(3, 4, 4),
      { sprite: 5, kind: "bob", count: 1, size: 7, band: [3, 13] },
    ],
  },
  // Confetti and marigold petals fall on the new shop, balloons float up
  "dukaan-mahurat": {
    open: [10, 15, 80, 22],
    floats: [
      fall(0, 4, 2),
      fall(1, 4, 2),
      fall(2, 3, 3),
      fall(3, 1, 4),
      rise(4, 2, 7, { pace: 1.4 }),
      twinkle(5, 4, 3, [3, 60]),
    ],
  },
  // The clean moving cards (shubhdwar/clean-moving-card-prompts.md): soft paper with a wide
  // calm space for the words, and the art and its movement kept to the edges
  // Lanterns and flower chandeliers swing over the garden lounge, petals drift and lights float up
  "baithak-bagh": {
    open: [10.0, 19.0, 80.0, 35.0],
    floats: [
      fall(0, 3, 4),
      fall(1, 2, 4),
      fall(2, 1, 5),
      fall(3, 1, 4),
      rise(4, 3, 2.5, { band: [10.0, 70.0] }),
      fall(5, 1, 4),
    ],
  },
  // Roses rock in two corners, petals drift and gold flecks twinkle
  "do-kone": {
    open: [11.1, 27.1, 77.6, 46.3],
    floats: [
      fall(0, 2, 3.5),
      fall(1, 2, 3.5),
      fall(2, 1, 3),
      twinkle(3, 4, 2, [3.0, 97.0]),
      fall(4, 1, 4),
      fall(5, 1, 3),
    ],
  },
  // The jasmine wreath turns slowly, buds and petals fall and a butterfly circles
  "gajra-ghera": {
    open: [27.5, 33.0, 45.0, 30.0],
    floats: [
      fall(0, 3, 2.5),
      fall(1, 2, 3.5),
      fall(2, 2, 3.5),
      fall(3, 1, 3.5),
      glide(4, 1, 6, { pair: 5, band: [10.0, 90.0] }),
    ],
  },
  // Folk birds on deep green: gold leaves drift, blossoms twinkle and a bird crosses
  "bulbul-jaal": {
    open: [17.3, 15.4, 65.1, 64.5],
    dark: true,
    floats: [
      fall(0, 2, 3.5),
      fall(1, 2, 3.5),
      fall(2, 1, 3.5),
      twinkle(3, 3, 3, [5.0, 95.0]),
      glide(4, 1, 7, { pair: 5, band: [3.0, 18.0] }),
    ],
  },
  // Bougainvillea sways over the white arch, bracts flutter down and a sparrow hops on the steps
  baganbilas: {
    open: [24.6, 16.6, 51.6, 59.8],
    floats: [
      fall(0, 3, 4),
      fall(1, 2, 4),
      fall(2, 1, 6),
      fall(3, 1, 3.5),
      fall(4, 1, 3),
      { sprite: 5, kind: "bob", count: 1, size: 7, band: [84.0, 90.0] },
    ],
  },
  // Pearl strands swing and sparkle, orchid petals drift and pearls drop
  "moti-lari": {
    open: [7.9, 26.0, 83.8, 47.5],
    floats: [
      fall(0, 2, 2),
      fall(1, 2, 2),
      fall(2, 1, 4),
      fall(3, 2, 3),
      twinkle(4, 4, 3, [2.0, 24.0]),
      fall(5, 1, 3),
    ],
  },
  // Eucalyptus sprigs sway down both sides and round leaves spin as they fall
  "safeda-patti": {
    open: [22.5, 11.3, 58.8, 69.7],
    floats: [
      fall(0, 2, 3.5),
      fall(1, 2, 3),
      fall(2, 1, 3),
      fall(3, 1, 3),
      fall(4, 1, 3),
      twinkle(5, 3, 2, [3.0, 97.0]),
    ],
  },
  // Rose and jasmine strings swing from the brass rod and petals fall
  "phool-ladi": {
    open: [13.2, 23.6, 73.4, 50.4],
    floats: [fall(0, 3, 3.5), fall(1, 2, 3.5), fall(2, 2, 2.5), fall(3, 1, 5), fall(5, 1, 3.5)],
  },
  // Lanterns swing over the pomegranate garden, blossoms drift and gold stars twinkle
  "anar-bagh": {
    open: [21.5, 23.6, 56.8, 58.6],
    water: [88.0, 97.0],
    floats: [
      fall(0, 1, 4),
      fall(1, 2, 3),
      fall(2, 2, 3),
      twinkle(3, 3, 3, [3.0, 30.0]),
      fall(4, 1, 3),
      fall(5, 1, 3),
    ],
  },
  // The olive swag sways, white petals fall and a dove glides across
  "zaitoon-mala": {
    open: [14.2, 13.7, 71.3, 64.5],
    floats: [
      fall(0, 3, 3.5),
      fall(1, 2, 3.5),
      fall(2, 2, 3),
      glide(3, 1, 9, { pair: 4, band: [3.0, 20.0] }),
      fall(5, 1, 4),
    ],
  },
  // Jacaranda branches sway and lilac flowers tumble down
  neelgulmohar: {
    open: [22.5, 19.5, 66.1, 56.3],
    floats: [
      fall(0, 3, 3),
      fall(1, 2, 3),
      fall(2, 1, 5),
      fall(3, 3, 2.5),
      fall(4, 1, 3),
      glide(5, 1, 4, { band: [10.0, 80.0] }),
    ],
  },
  // Blue pottery bells swing on their cords and small blue flowers drift
  "neeli-pottery": {
    open: [8.0, 18.0, 80.0, 39.0],
    floats: [fall(0, 2, 3), fall(1, 2, 3), fall(2, 1, 4), fall(4, 1, 3), fall(5, 2, 3)],
  },
  // Chrysanthemum garlands swing, yellow petals shower and turmeric dust rises
  "shevanti-haldi": {
    open: [19.4, 14.2, 60.9, 56.3],
    floats: [
      fall(0, 4, 3),
      fall(1, 2, 4.5),
      fall(2, 3, 3),
      fall(3, 1, 5),
      fall(4, 1, 4),
      rise(5, 3, 1.5, { band: [60.0, 100.0] }),
    ],
  },
  // Bangle strings swing and sparkle, henna leaves and petals drift down
  "choodi-jhalar": {
    open: [15.2, 28.3, 71.3, 44.5],
    floats: [fall(2, 3, 3), fall(3, 1, 4), fall(4, 3, 3), twinkle(5, 4, 3, [2.0, 26.0])],
  },
  // Ghungroo strings swing, bulbs twinkle and golden sparkles rise
  "ghungroo-raat": {
    open: [10.0, 22.5, 79.7, 46.9],
    dark: true,
    floats: [
      rise(4, 4, 3, { band: [20.0, 96.0] }),
      rise(5, 2, 6, { band: [20.0, 96.0] }),
      fall(2, 3, 3),
      twinkle(3, 3, 2.5, [2.0, 24.0]),
      fall(0, 1, 3),
    ],
  },
  // Hanging lamps swing and flicker, sparks rise and marigold petals fall
  "deep-lari": {
    open: [17.3, 30.1, 66.1, 50.4],
    floats: [
      rise(0, 4, 2, { band: [5.0, 60.0] }),
      rise(1, 2, 3, { band: [5.0, 60.0] }),
      fall(2, 3, 3),
      fall(3, 1, 4),
      fall(4, 1, 4),
    ],
  },
  // The full moon glows, jasmine petals drift and fireflies blink
  "sharad-poonam": {
    open: [20.0, 24.0, 62.0, 47.0],
    floats: [
      fall(0, 2, 3),
      fall(1, 2, 3),
      twinkle(2, 3, 3, [60.0, 98.0]),
      twinkle(3, 3, 2, [30.0, 98.0]),
      fall(4, 1, 3),
      fall(5, 1, 3),
    ],
  },
  // Baubles swing on their ribbons, snow falls and stars twinkle
  "holly-ribbon": {
    open: [18.4, 23.0, 64.1, 52.2],
    floats: [
      fall(0, 4, 2.5),
      fall(1, 5, 1.6),
      twinkle(3, 3, 3, [2.0, 26.0]),
      fall(2, 1, 4),
      fall(4, 1, 3),
    ],
  },
  // The bunting sways, feathers drift and a little bird flutters across
  "chidiya-ghonsla": {
    open: [22.0, 15.0, 70.0, 58.0],
    floats: [
      fall(0, 2, 4),
      fall(1, 1, 4),
      fall(2, 2, 3),
      fall(3, 1, 3.5),
      glide(4, 1, 6, { pair: 5, band: [4.0, 22.0] }),
    ],
  },
  // The awning sways, balloons bob, and sprinkles and sweets float down
  "kulfi-thela": {
    open: [19.4, 11.9, 62.0, 53.3],
    floats: [
      fall(3, 3, 3),
      fall(2, 2, 3),
      fall(5, 1, 3),
      rise(4, 1, 5),
      fall(0, 1, 4, { pace: 1.4 }),
      fall(1, 1, 4, { pace: 1.4 }),
    ],
  },
  // Paper fans sway, candles flicker, macarons and sprinkles float down
  "meetha-bakery": {
    open: [14.2, 18.9, 71.3, 50.4],
    floats: [
      fall(3, 3, 3),
      fall(4, 2, 2.5),
      fall(0, 1, 4, { pace: 1.4 }),
      fall(1, 1, 4, { pace: 1.4 }),
      fall(5, 1, 3),
    ],
  },
  // Wildflowers sway, dandelion seeds float up and a butterfly flutters
  "khargosh-bagicha": {
    open: [20.4, 13.1, 58.8, 61.0],
    floats: [
      rise(0, 3, 2.5),
      fall(1, 1, 3),
      glide(2, 1, 5, { pair: 3, band: [20.0, 70.0] }),
      fall(5, 2, 2.5),
    ],
  },
  // The bulbs sway and glow, the rose vine sways and petals blow past
  "cycle-basket": {
    open: [6.9, 19.5, 77.6, 45.7],
    floats: [
      fall(0, 3, 3),
      fall(1, 1, 3),
      fall(2, 1, 3),
      fall(3, 1, 3),
      fall(4, 1, 4),
      twinkle(5, 3, 3, [2.0, 20.0]),
    ],
  },
  // The toran sways with its bells, geraniums nod and leaves drift down
  "khidki-gamla": {
    open: [24.6, 15.4, 51.6, 61.5],
    floats: [fall(0, 1, 4), fall(1, 3, 3), fall(2, 1, 4), fall(3, 2, 3), fall(4, 1, 2.5)],
  },
  // Kachnar branches sway, petals spin down and a sunbird darts past
  kachnar: {
    open: [6.9, 20.1, 74.5, 53.9],
    floats: [
      fall(0, 3, 3.5),
      fall(1, 2, 3.5),
      fall(2, 1, 5),
      fall(3, 1, 3.5),
      glide(4, 1, 5, { pair: 5, band: [4.0, 26.0] }),
    ],
  },
};

export function isMoving(suite: SuiteId): suite is MovingId {
  return (MOVING_IDS as readonly SuiteId[]).includes(suite);
}

/** A moving scene's text space, and whether it is dark. */
export function movingOpen(suite: MovingId): { open: FrameBox; dark?: true } {
  const { open, dark } = MOVING[suite];
  return { open, dark };
}

/** Everything the phone needs to play a moving scene. */
export type MovingScene = {
  id: MovingId;
  layers: { sky: string; middleImage: string; middle: FrameBox };
  front: (FrontPiece & { src: string })[];
  water: readonly [number, number] | null;
  floats: readonly Float[];
  sprites: MovingLayout["sprites"];
};

export function movingScene(suite: MovingId): MovingScene {
  const dir = `/suites/${suite}`;
  const layout = MOVING_LAYOUTS[suite];
  const entry = MOVING[suite];
  return {
    id: suite,
    layers: { sky: `${dir}/sky.webp`, middleImage: `${dir}/middle.webp`, middle: layout.middle },
    front: layout.front.map((piece, i) => ({ ...piece, src: `${dir}/front-${i}.webp` })),
    water: entry.water ?? null,
    floats: entry.floats,
    sprites: layout.sprites,
  };
}

/** Every image a moving scene loads, for checks and preloading. */
export function movingImages(suite: MovingId): string[] {
  const scene = movingScene(suite);
  return [
    scene.layers.sky,
    scene.layers.middleImage,
    ...scene.front.map((piece) => piece.src),
    ...scene.sprites.flatMap((sprite, i) => (sprite ? [`/suites/${suite}/float-${i}.webp`] : [])),
  ];
}

/** A small seeded random, so a theme's pieces float the same way on every phone. */
function random(seed: string): () => number {
  let h = 2166136261;
  for (const char of seed) h = Math.imul(h ^ char.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

/** How long each kind takes to cross, in seconds, before its pace. */
const TIME: Record<FloatKind, readonly [number, number]> = {
  fall: [9, 15],
  rise: [13, 20],
  glide: [16, 26],
  bob: [5, 8],
  twinkle: [2.6, 5],
};

export type FloatInstance = {
  key: string;
  kind: FloatKind;
  src: string;
  pair: string | null;
  style: CSSProperties;
};

/**
 * Each floating piece's copies, spread through the painting and through time: where it
 * starts and ends, how long it takes, how far it sways and spins on the way. All start
 * part-way through their journey, so the scene is already alive when it opens.
 */
export function floatInstances(scene: MovingScene): FloatInstance[] {
  const next = random(scene.id);
  const out: FloatInstance[] = [];
  scene.floats.forEach((float, f) => {
    const sprite = scene.sprites[float.sprite];
    if (!sprite) return;
    const [top, bottom] = float.band ?? [0, 100];
    const [short, long] = TIME[float.kind];
    for (let n = 0; n < float.count; n++) {
      const time = (short + next() * (long - short)) * (float.pace ?? 1);
      const x = 4 + next() * 88;
      const y = top + next() * (bottom - top);
      // Glides go both ways; a piece going left is turned to face its way
      const left = float.kind === "glide" && next() < 0.5;
      const lane = float.size / sprite.aspect;
      const from: [number, number] =
        float.kind === "fall"
          ? [x, top - lane - 2]
          : float.kind === "rise"
            ? [x, bottom]
            : float.kind === "glide"
              ? [left ? 102 : -float.size - 2, y]
              : [x, y];
      const to: [number, number] =
        float.kind === "fall"
          ? [x + (next() - 0.5) * 24, bottom + 2]
          : float.kind === "rise"
            ? [x + (next() - 0.5) * 16, top - lane - 2]
            : float.kind === "glide"
              ? [left ? -float.size - 2 : 102, y + (next() - 0.5) * 8]
              : [x, y];
      out.push({
        key: `${f}-${n}`,
        kind: float.kind,
        src: `/suites/${scene.id}/float-${float.sprite}.webp`,
        pair: float.pair === undefined ? null : `/suites/${scene.id}/float-${float.pair}.webp`,
        style: {
          width: `${float.size * (0.8 + next() * 0.4)}%`,
          "--x0": `${from[0]}cqw`,
          "--y0": `${from[1]}cqh`,
          "--x1": `${to[0]}cqw`,
          "--y1": `${to[1]}cqh`,
          "--time": `${time.toFixed(2)}s`,
          // Already part-way along when the scene opens
          "--delay": `${(-next() * time).toFixed(2)}s`,
          "--wobble": `${(1 + next() * 2.5).toFixed(2)}cqw`,
          "--wobble-time": `${(2.4 + next() * 2.2).toFixed(2)}s`,
          "--spin": `${float.kind === "fall" ? Math.round(15 + next() * 45) : Math.round(next() * 8)}deg`,
          "--face": left ? -1 : 1,
        } as CSSProperties,
      });
    }
  });
  return out;
}
