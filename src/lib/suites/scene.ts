/*
 * One Scene (pilot): the whole invitation on one painting. The couple's photos show
 * through the painting's frames, the names and a line sit under them, and one slot
 * lower down brings in each function in turn, each from its own side, while the
 * painting's light follows the day (a haldi morning, a sangeet night). It reuses the
 * couple photo paintings (photo-frames.ts), so a theme needs no new images to try it.
 * The Scene themes (catalog.ts SCENE_THEME_IDS) are painted for it instead: one painting
 * with one photo frame, and the theme's own card (a marble jharokha, a phulkari cloth, a
 * brass thali) cut out of a second copy, so the real card is what flies in.
 *
 * Boxes are percentages of the painting, like the frames: [x, y, width, height].
 */

import type { FunctionId } from "@/lib/events/functions";
import {
  ILLUSTRATED_IDS,
  isSceneTheme,
  pageLook,
  type IllustratedId,
  type Mood,
  type PageArt,
  type SceneThemeId,
  type SuiteId,
} from "./catalog";
import { photoPage, type FrameBox } from "./photo-frames";

/**
 * The slot's card: drawn in the theme's colours (a palace window, a kasavu-bordered
 * panel), the theme's own painted card, or no card at all: an illustrated card's words
 * print straight onto its painting's empty space.
 */
export type SlotStyle = "jharokha" | "kasavu" | "painted" | "bare";

/** A Scene theme's painted card: its picture, and where on it the words go (percent of the card). */
export type PaintedCard = {
  image: string;
  text: FrameBox;
  /** The writing area has art in it (a wax seal), so the words sit on a sheet laid over it. */
  plate: boolean;
};

type SceneLayout = {
  /** The names, printed on the painting. */
  names: FrameBox;
  /** The line under the names; null when the painting has no room, so it opens the slot. */
  line: FrameBox | null;
  slot: FrameBox;
};

type SceneEntry = {
  style: Exclude<SlotStyle, "painted" | "bare">;
  one: SceneLayout;
  two: SceneLayout;
};

const SCENES: Partial<Record<Exclude<SuiteId, SceneThemeId>, SceneEntry>> = {
  // The palace wall below the windows is plain down to the fountain
  "rajwada-bagh": {
    style: "jharokha",
    one: {
      names: [14, 49.5, 72, 6.5],
      line: [16, 56, 68, 5],
      slot: [17, 61.5, 66, 24.5],
    },
    two: {
      names: [12, 45, 76, 6.5],
      line: [14, 51.5, 72, 5],
      slot: [16, 57.5, 68, 26],
    },
  },
  // Below the houseboat the backwater is calm mist down to the lotuses
  kayal: {
    style: "kasavu",
    one: {
      names: [8, 58.5, 84, 6],
      line: [12, 64.5, 76, 4.8],
      slot: [13, 69.5, 74, 23],
    },
    // The carved panel runs down to 70%, so the line opens the slot instead
    two: {
      names: [6, 70, 88, 5.6],
      line: null,
      slot: [12, 76, 76, 21.5],
    },
  },
};

/**
 * A Scene theme's painting: its frame, or its two frames (the bride's on the left, the
 * groom's on the right), the names and line between the frames and the card, and the card
 * (its box on the painting, and the writing area on its face). With no room for the line,
 * the line opens the slot instead.
 */
type PaintedEntry = (
  { frame: FrameBox; pair?: never } | { pair: readonly [FrameBox, FrameBox]; frame?: never }
) & {
  names: FrameBox;
  line: FrameBox | null;
  card: FrameBox;
  text: FrameBox;
  /** The painting is dark behind the names, so they print light at every hour. */
  dark?: true;
  /** The card's middle is busy (a wax seal), so its words sit on a plain sheet over it. */
  plate?: true;
};

const PAINTED: Record<Exclude<SceneThemeId, IllustratedId>, PaintedEntry> = {
  // A white marble jharokha panel on Lake Pichola at dusk
  "udaipur-lake": {
    frame: [31.6, 11.4, 36.9, 28.2],
    names: [8, 43.6, 84, 6.4],
    line: null,
    card: [6.16, 51.08, 87.67, 30.8],
    text: [13.5, 25.7, 73, 61.7],
  },
  // A pink sandstone tablet on the haveli wall, between the carved brackets
  "pink-haveli": {
    frame: [23, 5.7, 54.2, 38.9],
    names: [16, 46.5, 68, 6],
    line: [18, 53, 64, 4.5],
    card: [12.75, 59.81, 74.5, 21.59],
    text: [5.7, 10.1, 88.5, 80.1],
  },
  // A pietra-dura marble plaque over the garden's long pool
  "char-bagh": {
    frame: [27.8, 9.5, 44.3, 31.9],
    names: [8, 46, 84, 6],
    line: [12, 52.5, 76, 4.5],
    card: [10.41, 59.27, 79.17, 24.88],
    text: [6.9, 14.6, 86.6, 67.1],
  },
  // A brass thali with a rim of petals, on the river at dawn
  "kashi-ghat": {
    frame: [22.3, 7.8, 55.4, 30],
    names: [8, 46, 84, 6.5],
    line: [12, 53, 76, 5],
    card: [8.4, 60.94, 83.1, 24.52],
    text: [17, 17, 66, 64],
  },
  // A palm leaf between kasavu gold bands, on the temple pond
  "temple-pond": {
    frame: [25.5, 8, 48.9, 35],
    names: [8, 49.5, 84, 6.5],
    line: null,
    card: [9.88, 58.49, 80.02, 22.61],
    text: [4, 17, 92, 66],
  },
  // A brass plate edged with kolam dots, on the corridor's stone floor
  "kovil-corridor": {
    frame: [27.9, 11.8, 44, 24.8],
    names: [8, 49.3, 84, 5.5],
    line: [12, 54.9, 76, 3.6],
    card: [11.8, 58.79, 76.83, 20.22],
    text: [5.5, 10.9, 88.5, 79.1],
  },
  // A turmeric cloth hung from a rod with a mango-leaf toran
  "arati-mandap": {
    frame: [21.7, 8.3, 56.7, 31],
    names: [8, 45.2, 84, 5.4],
    line: [12, 50.8, 76, 3.8],
    card: [7.01, 54.78, 85.87, 29.61],
    text: [11.6, 19.3, 75.7, 69.2],
  },
  // A white shola-pith plaque with a lace edge, on the red courtyard wall
  "zamindar-bari": {
    frame: [30.1, 8.7, 39.6, 32.4],
    names: [8, 47.5, 84, 6.5],
    line: null,
    card: [11.48, 56.1, 77.05, 24.28],
    text: [6.5, 10.7, 86.8, 77.8],
  },
  // A lippan mud-and-mirror panel on the bhunga's white wall
  "kutch-bhunga": {
    frame: [25.9, 11.2, 47.6, 26.3],
    names: [8, 44.6, 84, 5.6],
    line: [12, 50.4, 76, 3.6],
    card: [9.14, 54.31, 81.72, 26.08],
    text: [7.7, 12.2, 83.9, 75.5],
  },
  // A phulkari cloth over the mustard fields
  "punjab-haveli": {
    frame: [30.6, 5.7, 38.8, 35.9],
    names: [8, 46, 84, 6.2],
    line: [12, 52.6, 76, 4.4],
    card: [9.14, 60.71, 82.36, 27.15],
    text: [12.1, 17.3, 75.5, 64.1],
  },
  // A Paithani silk panel with a peacock border, on the wada's yellow wall
  "pune-wada": {
    frame: [37.6, 5.3, 37.4, 31.7],
    names: [10, 46.6, 80, 6.4],
    line: null,
    card: [9.56, 56.58, 80.87, 26.97],
    text: [13.8, 13.4, 73, 71.9],
  },
  // A carved walnut panel floating on Dal Lake
  "chinar-dal": {
    frame: [29.5, 4.5, 40.9, 30.4],
    names: [8, 42.5, 84, 5.6],
    line: [12, 48.3, 76, 4],
    card: [12.11, 52.87, 75.98, 26.02],
    text: [7.1, 13.9, 85.4, 72.6],
  },
  // A brass starship plaque among the planets
  "space-voyage": {
    frame: [21.4, 8, 57, 31],
    names: [10, 43.8, 80, 5.9],
    line: [12, 50, 76, 4],
    card: [5.28, 55.21, 89.81, 22.14],
    text: [9.2, 19.4, 81.8, 70],
    dark: true,
  },
  // A cloud card under a rainbow
  "rainbow-unicorn": {
    frame: [24, 8.9, 52.2, 29.5],
    names: [10, 45.5, 80, 6.5],
    line: null,
    card: [7.78, 54.37, 84.54, 25.78],
    text: [8.5, 27.6, 82.8, 62.1],
  },
  // A wooden sign wrapped in jungle vines
  "dino-jungle": {
    frame: [22.2, 11.3, 55.5, 31.1],
    names: [10, 47.3, 80, 6.1],
    line: [12, 53.6, 76, 4],
    card: [4.81, 58.85, 89.35, 21.25],
    text: [11.4, 21.9, 78.3, 68.2],
  },
  // A shell-and-pearl frame under the sea
  "ocean-pearl": {
    frame: [22.3, 9.4, 55.3, 29.9],
    names: [10, 45.8, 80, 5.9],
    line: [12, 52, 76, 4],
    card: [8.24, 57.24, 83.43, 26.35],
    text: [8.1, 18.1, 83.9, 64.5],
  },
  // A linen card in a thin oak frame
  "boho-onederland": {
    frame: [26, 5.1, 52.1, 29.1],
    names: [22, 41.9, 56, 6.5],
    line: [24, 48.7, 52, 4.5],
    card: [12.78, 58.02, 76.3, 24.53],
    text: [5.5, 10.1, 89.1, 81.5],
  },
  // A gilded scroll tied with pink ribbon
  "fairytale-castle": {
    frame: [29.4, 8, 41, 31.3],
    names: [10, 45.1, 80, 6.5],
    line: null,
    card: [5.74, 53.18, 88.89, 25.1],
    text: [9.3, 17.2, 81, 67.7],
  },
  // A checkered banner between two brass posts
  "little-racer": {
    frame: [23.9, 8.7, 52.2, 29.2],
    names: [10, 43.8, 80, 6.3],
    line: [12, 50.4, 76, 4],
    card: [9.63, 55.57, 81.11, 24.9],
    text: [9.1, 23.8, 82, 58.2],
  },
  // An art deco card with gold fans
  "gold-gala": {
    frame: [29, 12.3, 42, 32.2],
    names: [10, 49.9, 80, 6.5],
    line: null,
    card: [10.09, 58.65, 80.28, 25.78],
    text: [9.9, 14.9, 79.7, 69.8],
    dark: true,
  },
  // A gold-bordered silk panel between brass lamps
  "amrit-utsav": {
    frame: [25.6, 10.7, 48.6, 27.3],
    names: [12, 44.4, 76, 6.5],
    line: [14, 51.2, 72, 4.5],
    card: [13.52, 59.01, 74.72, 25.26],
    text: [10.7, 15, 78.3, 67.3],
  },
  // A silver-edged card with pearl corners
  "silver-jubilee": {
    frame: [28.1, 6.5, 43.6, 33.9],
    names: [18, 46.8, 64, 6],
    line: [20, 53.1, 60, 4],
    card: [10, 58.28, 79.26, 26.2],
    text: [7.6, 12.3, 85.2, 76.3],
    dark: true,
  },
  // A gold frame with a leaf crest
  "golden-jubilee": {
    frame: [27.9, 8.6, 44, 32.8],
    names: [18, 45.4, 64, 6.5],
    line: [20, 52.2, 60, 4.5],
    card: [13.43, 57.92, 73.52, 25.94],
    text: [14.4, 19.6, 78.9, 69.4],
  },
  // A banner hung from a hot air balloon
  "oh-baby": {
    frame: [24.3, 9.4, 51.5, 29.3],
    names: [10, 43.7, 80, 6.5],
    line: null,
    card: [16.57, 51.72, 66.67, 27.92],
    text: [14.1, 44, 72, 48.7],
  },
  // A gold-starred card on the rooftop
  "new-year-eve": {
    frame: [21.2, 5.6, 57.4, 31.9],
    names: [10, 43.6, 80, 6.5],
    line: [12, 50.4, 76, 4.5],
    card: [7.41, 57.92, 85, 22.45],
    text: [7.8, 13.7, 84.7, 73.5],
    dark: true,
  },
  // A scalloped pink card tied with a bow
  "kitty-tea": {
    frame: [18.9, 7.3, 62.2, 34.2],
    names: [12, 49.8, 76, 4.9],
    line: null,
    card: [13.8, 55.94, 72.87, 28.12],
    text: [8.5, 30.4, 82.3, 56.9],
  },
  // A driftwood board edged with rope
  "pool-party": {
    frame: [25.4, 10.7, 50.1, 28],
    names: [10, 48.5, 80, 6.5],
    line: null,
    card: [11.11, 57.81, 76.67, 26.15],
    text: [11.6, 29.4, 80.9, 51.6],
  }, // A silk banner hung between two brass poles
  "baraat-band": {
    frame: [23.3, 6, 53.3, 28.9],
    names: [28, 49.4, 44, 6.5],
    line: null,
    card: [12.11, 57.66, 77.68, 28.83],
    text: [15.3, 20.3, 70.8, 43.4],
  },
  // A gold-edged card on a red wall
  "roka-shagun": {
    frame: [21.8, 6.4, 56.3, 31.4],
    names: [10, 45.3, 80, 3.8],
    line: null,
    card: [9.99, 50.3, 81.3, 27.99],
    text: [11.1, 13.2, 77.5, 73.2],
    dark: true,
  },
  // A card edged with chooda bangles
  "chooda-ceremony": {
    frame: [24, 7.2, 52, 28.6],
    names: [26, 43.6, 48, 6.5],
    line: null,
    card: [9.99, 52.15, 77.05, 27.15],
    text: [14.3, 14.2, 75.3, 71.8],
  },
  // A cotton canopy framed in marigolds by the river
  "rishikesh-ganga": {
    frame: [22.7, 8, 54.5, 29.5],
    names: [28, 45.1, 44, 3.6],
    line: null,
    card: [5.74, 49.88, 88.42, 34.27],
    text: [12.7, 19.3, 75.8, 65.7],
  },
  // A sandstone-gold card in the dunes
  "jaisalmer-dunes": {
    frame: [26.9, 4, 46.2, 32.5],
    names: [10, 43.3, 80, 5.3],
    line: null,
    card: [5.63, 49.76, 88.84, 30.92],
    text: [11.7, 12.1, 76.5, 77.6],
  },
  // A jewelled card under the lit fort
  "fort-night": {
    frame: [23.2, 10.3, 53.6, 34.4],
    names: [10, 47.5, 80, 6.5],
    line: null,
    card: [14.24, 56.7, 71.31, 25.48],
    text: [9.5, 13, 82, 74.6],
    dark: true,
  },
  // A mirror-work card in the hall of mirrors
  "sheesh-mahal": {
    frame: [24, 7.3, 52, 38.3],
    names: [15, 46.8, 70, 5.5],
    line: null,
    card: [10.31, 53.47, 80.98, 30.2],
    text: [10.7, 15, 77.8, 71.2],
  },
  // A mirror-work card on the white salt
  "white-rann": {
    frame: [20.7, 9.7, 58.6, 32.8],
    names: [10, 48, 80, 6.5],
    line: null,
    card: [11.05, 55.86, 77.9, 24.1],
    text: [8.9, 15.1, 82.2, 72.6],
  },
  // A bandhani-bordered card over the mameru gifts
  "mameru-bandhani": {
    frame: [23.9, 7.6, 52.1, 28.3],
    names: [15, 42.5, 70, 6.5],
    line: null,
    card: [9.99, 51.08, 79.81, 27.21],
    text: [9.4, 16.3, 82.1, 69.8],
  },
  // An ajrak-bordered card on indigo
  "sindhi-ajrak": {
    frame: [25.3, 11.1, 49.1, 26.4],
    names: [10, 47.3, 80, 3.8],
    line: null,
    card: [9.99, 52.27, 80.13, 32.83],
    text: [11.2, 15.9, 77.4, 67],
    dark: true,
  },
  // A stone-framed card on the temple steps
  "hampi-ruins": {
    frame: [29.5, 8, 40.9, 33],
    names: [22, 42.7, 56, 6.5],
    line: [24, 49.5, 52, 4.5],
    card: [10.73, 56.1, 78.53, 26.26],
    text: [9.9, 18.7, 80.2, 66.7],
  },
  // A carved wooden card among coffee leaves
  "coorg-estate": {
    frame: [22.8, 7.8, 52.7, 29.4],
    names: [10, 48.3, 80, 6.5],
    line: null,
    card: [10.73, 57, 78.96, 25.48],
    text: [11.7, 15.7, 77.3, 68.7],
  },
  // A carved wooden card with frangipani
  "bali-garden": {
    frame: [30.6, 9.9, 38.6, 34.4],
    names: [15, 48.5, 70, 6.5],
    line: null,
    card: [9.46, 56.88, 80.66, 27.87],
    text: [13.1, 14.8, 74.4, 68.2],
  },
  // A blue-tiled card by the sea
  "santorini-white": {
    frame: [24, 6.3, 51.9, 34.6],
    names: [20, 42.3, 60, 6.5],
    line: [22, 49.1, 56, 4.5],
    card: [14.15, 55.26, 71.81, 25.84],
    text: [9.5, 16.4, 80.8, 67.7],
    dark: true,
  },
  // A pale card trailed with eucalyptus
  "glass-house": {
    frame: [20.7, 8.5, 58, 31.8],
    names: [22, 48.8, 56, 5.9],
    line: null,
    card: [9.78, 55.86, 78.43, 27.03],
    text: [15.6, 22.7, 74, 55.5],
  },
  // A deckled white card with fern corners
  "minimal-white": {
    frame: [19.5, 8.5, 60.5, 34.4],
    names: [10, 47.9, 80, 6.5],
    line: null,
    card: [12.34, 55.8, 76.28, 25.78],
    text: [10, 16.3, 78.7, 65.9],
  },
  // A wooden card edged with vines
  "fairy-forest": {
    frame: [21.5, 8, 56.3, 31],
    names: [12, 45.8, 76, 6.5],
    line: null,
    card: [10.73, 55.26, 78.96, 28.83],
    text: [9.2, 13, 81.1, 72.8],
  },
  // An envelope closed with a wax seal; the letter is laid over the seal, so the words read
  "love-letter": {
    frame: [27.7, 8.9, 45.1, 34.3],
    names: [20, 47.3, 60, 6.5],
    line: null,
    card: [14.24, 55.98, 72.37, 23.62],
    text: [7, 8, 86, 84],
    plate: true,
  },
  // A lace-edged card with rose sprigs
  "parsi-chalk": {
    frame: [29.8, 7, 40.4, 29.4],
    names: [10, 44.8, 80, 4.7],
    line: null,
    card: [15.09, 50.66, 69.61, 28.71],
    text: [8.5, 13.4, 83.3, 73.1],
  },
  // An art deco card with brass fans
  "jazz-lounge": {
    frame: [20.5, 6.9, 59, 33.1],
    names: [20, 49, 60, 6.5],
    line: null,
    card: [10.31, 57.18, 79.6, 20.93],
    text: [7.2, 20.7, 85.4, 62.1],
    dark: true,
  },
  // A scalloped blush card
  "bride-squad": {
    frame: [22.7, 7.5, 54.7, 30.1],
    names: [10, 46.8, 80, 6.1],
    line: null,
    card: [11.69, 54.07, 77.26, 26.5],
    text: [12.1, 22.4, 75.1, 62.3],
  },
  // A green-and-pink card hung with flowers
  "teej-jhoola": {
    frame: [27, 6.8, 45.9, 24.8],
    names: [22, 45.2, 56, 6.5],
    line: null,
    card: [9.99, 53.47, 80.13, 27.45],
    text: [9.4, 5.6, 81.7, 76.5],
  },
  // A scoreboard card on the pitch
  "cricket-stadium": {
    frame: [19, 7.3, 61.5, 35],
    names: [10, 45.4, 80, 6.5],
    line: null,
    card: [6.38, 53.47, 87.25, 22.61],
    text: [9.9, 15.6, 80.2, 68.6],
  },
  // A neon-lit card in the arcade
  "neon-arcade": {
    frame: [20.9, 5.2, 58.1, 32.2],
    names: [10, 42.1, 80, 5.9],
    line: null,
    card: [8.08, 49.16, 85.23, 33.43],
    text: [8.1, 11.5, 83.3, 77.8],
    dark: true,
  },
  // A marquee card under the red curtain
  "retro-bollywood": {
    frame: [21, 8.2, 58, 31.5],
    names: [10, 46.1, 80, 4.2],
    line: null,
    card: [9.99, 51.5, 80.66, 26.67],
    text: [9.9, 16.9, 79.3, 73.1],
    dark: true,
  },
  // A cream card on a banana-leaf platter
  annaprashan: {
    frame: [23, 4.1, 54.5, 31.6],
    names: [18, 42.1, 70, 6.5],
    line: [20, 48.9, 66, 4.5],
    card: [11.3, 55.42, 81.94, 24.11],
    text: [10.6, 16.9, 73.2, 68.4],
  },
  // A white card crowned with lilies
  "christening-lilies": {
    frame: [21.8, 8.2, 55.3, 31.3],
    names: [12, 46.1, 76, 6.5],
    line: null,
    card: [11.69, 53.83, 76.51, 29.25],
    text: [9.6, 21.1, 81, 65],
  },
  // A clean card on the new home's wall
  "new-home-modern": {
    frame: [30.6, 6, 39, 34.7],
    names: [12, 49.8, 74, 6.5],
    line: null,
    card: [13.8, 59.11, 72.5, 23.23],
    text: [8.6, 12.4, 80, 77.5],
  },
  // A temple-gold card between the kalash
  satyanarayan: {
    frame: [29.6, 4.8, 40.9, 31.5],
    names: [10, 46.8, 80, 5.9],
    line: null,
    card: [7.78, 53.91, 85.46, 28.96],
    text: [13.1, 19.3, 72.5, 57],
  },
  // A red-and-gold chunri card
  "mata-ki-chowki": {
    frame: [23.3, 8.2, 53.4, 30.1],
    names: [18, 44.7, 64, 6.5],
    line: null,
    card: [10.74, 53.59, 78.52, 31.15],
    text: [9.2, 12.5, 81.5, 75.5],
    dark: true,
  },
  // A stone-carved card with jasmine
  upanayana: {
    frame: [24.2, 9.3, 51.2, 27.9],
    names: [12, 43.5, 76, 6.5],
    line: null,
    card: [5.65, 52.92, 88.8, 21.72],
    text: [8.5, 18.5, 83, 62],
  },
  // A quiet white card edged with tuberoses
  shraddhanjali: {
    frame: [29.2, 6.5, 41.6, 31.1],
    names: [15, 47.1, 70, 6.5],
    line: null,
    card: [13.71, 55.38, 72.48, 25.9],
    text: [8.7, 23.6, 82.8, 63.7],
  },
  // A carved wood card in the garden
  "retirement-garden": {
    frame: [28.4, 8.1, 44, 31],
    names: [20, 50.1, 70, 6.5],
    line: [22, 56.9, 66, 4.5],
    card: [14.63, 64.9, 71.67, 18.44],
    text: [8.9, 14.1, 82.3, 73.2],
  },
  // A gold card strung with fairy lights
  "farewell-night": {
    frame: [19, 8.5, 61.4, 34],
    names: [10, 45.8, 80, 6.5],
    line: [12, 52.6, 76, 4.5],
    card: [4.81, 58.8, 91.85, 24.27],
    text: [17.6, 17.3, 63.1, 53.6],
    dark: true,
  },
  // A carved board under the ribbon
  "grand-opening": {
    frame: [22.7, 9.2, 54.6, 36.7],
    names: [20, 47.6, 60, 6.4],
    line: null,
    card: [13.33, 55.16, 73.43, 20.99],
    text: [9.1, 34, 81.7, 62.9],
  },
  // A gold-lined card on the stage
  "launch-stage": {
    frame: [27.5, 5.4, 45, 43.4],
    names: [15, 50.8, 70, 6.5],
    line: null,
    card: [8.98, 58.49, 82.31, 21.25],
    text: [13.4, 14.2, 72.9, 80],
    dark: true,
  },
  // A gold card under marigold garlands
  "ganesh-utsav": {
    frame: [23.8, 8.9, 52.5, 28.9],
    names: [15, 46.7, 70, 6.5],
    line: null,
    card: [10.93, 54.95, 78.06, 26.2],
    text: [9.7, 15.5, 80.7, 70.6],
  },
  // A shola-white card on red silk
  "durga-pujo": {
    frame: [23.6, 8.3, 52.3, 28.9],
    names: [10, 44.6, 80, 6.5],
    line: null,
    card: [11.3, 52.4, 77.96, 31.46],
    text: [9.9, 16.2, 79.5, 66.8],
    dark: true,
  },
  // A peacock-feather card at midnight
  janmashtami: {
    frame: [26.9, 12.9, 43.1, 23.5],
    names: [10, 45.5, 80, 6.5],
    line: null,
    card: [10.74, 54.37, 78.24, 30],
    text: [11.8, 13.7, 78.6, 73.3],
    dark: true,
  },
  // A kasavu-gold card over the pookalam
  "onam-pookalam": {
    frame: [25.1, 9.1, 49.4, 27],
    names: [10, 43.9, 80, 6.5],
    line: null,
    card: [10, 52.66, 87.13, 31.41],
    text: [11.5, 15.4, 71.2, 62.1],
  },
  // A cream card above the kolam
  "pongal-kolam": {
    frame: [23.9, 4.8, 52.6, 30.3],
    names: [10, 39.8, 78, 6.5],
    line: null,
    card: [10.37, 49.01, 78.89, 27.45],
    text: [10.9, 14.5, 78.6, 71],
  },
  // A kite-shaped card over the rooftops
  "uttarayan-kites": {
    frame: [24, 5.2, 52.1, 27.3],
    names: [20, 37.2, 60, 6.5],
    line: [22, 44, 56, 4.3],
    card: [12.78, 49.48, 74.44, 45],
    text: [19.5, 23.5, 61, 29.5],
  },
  // A phulkari-edged card by the bonfire
  "lohri-bonfire": {
    frame: [22.6, 6.7, 54.8, 30.2],
    names: [10, 41.5, 78, 6.5],
    line: [12, 48.3, 74, 4.5],
    card: [8.7, 54.27, 82.59, 26.09],
    text: [15.5, 18.1, 69.6, 69],
    dark: true,
  },
  // A lantern-lit card under the jali
  "iftar-dawat": {
    frame: [25.5, 6, 49, 36.9],
    names: [12, 46.6, 76, 5.6],
    line: null,
    card: [19.23, 53.36, 61.53, 32],
    text: [9.4, 30.1, 82.1, 57.8],
  },
  // Radha Krishna above two kadamba frames by the Yamuna
  "kadamb-krishna": {
    pair: [
      [13.3, 19.6, 26.2, 22.7],
      [60.4, 19.6, 26.2, 22.7],
    ],
    names: [10, 46.6, 80, 6.2],
    line: null,
    card: [4.14, 54.01, 91.82, 34.03],
    text: [7.6, 10.7, 84.8, 76.6],
  },
  // Ganesha above two marigold arches
  "ganesh-genda": {
    pair: [
      [15.2, 18, 28.6, 25.8],
      [55.8, 18, 28.7, 25.7],
    ],
    names: [10, 45.1, 80, 4.5],
    line: null,
    card: [5.31, 50.36, 89.37, 34.45],
    text: [7.1, 9.6, 85.8, 79.1],
  },
  // Sita and Ram above two jaimala frames
  "siya-ram-mala": {
    pair: [
      [14.9, 16.3, 26.8, 23.4],
      [58.6, 16.3, 26.9, 23.4],
    ],
    names: [6, 44.3, 88, 3.3],
    line: null,
    card: [4.78, 48.09, 90.65, 38.94],
    text: [6.8, 8.1, 86.5, 82],
  },
  // Shiva and Parvati above two Brahma Kamal frames
  "kailash-kamal": {
    pair: [
      [13.9, 16.8, 27.9, 23.2],
      [58.1, 16.9, 27.8, 23.1],
    ],
    names: [10, 44.3, 80, 5.6],
    line: null,
    card: [5.42, 51.08, 89.27, 36.42],
    text: [8, 10.4, 83.9, 77.5],
  },
  // Two lotus frames over the pond
  "kamal-sarovar": {
    pair: [
      [11.6, 9.3, 30.8, 25.8],
      [57.6, 9.3, 30.8, 25.8],
    ],
    names: [10, 39.4, 80, 6.1],
    line: null,
    card: [4.57, 46.71, 90.86, 39.71],
    text: [6.6, 7.9, 86.8, 82.6],
  },
  // Two gulmohar frames under the blue sky
  gulmohar: {
    pair: [
      [11.5, 10.4, 31.5, 26.4],
      [57.2, 10.4, 31.3, 26.3],
    ],
    names: [10, 41.3, 80, 6.5],
    line: null,
    card: [5.42, 49.28, 89.05, 36.9],
    text: [5.9, 7.3, 88.2, 83.6],
  },
  // Two banyan-root frames hung from the branches
  "vat-vriksha": {
    pair: [
      [12.6, 11.8, 28.2, 23.6],
      [59.3, 11.8, 28.1, 23.6],
    ],
    names: [10, 40.2, 80, 6.5],
    line: [12, 47, 76, 4.5],
    card: [5.1, 53.23, 89.8, 35.89],
    text: [6, 7.7, 88, 82.8],
  },
  // Two jasmine frames in the moonlight
  "mogra-raat": {
    pair: [
      [14.5, 10.2, 26.9, 25.5],
      [58.9, 10.2, 26.8, 25.5],
    ],
    names: [10, 41.6, 80, 6.5],
    line: null,
    card: [9.03, 50.9, 82.04, 38.58],
    text: [7.6, 8.4, 84.8, 81.5],
    dark: true,
  },
  // Two tulip frames below the snow peaks
  "tulip-kashmir": {
    pair: [
      [11.3, 9.6, 28.4, 26],
      [60.4, 9.6, 28.3, 26],
    ],
    names: [10, 40.1, 80, 6.5],
    line: null,
    card: [6.38, 47.97, 87.25, 39.65],
    text: [7.4, 8.4, 85.2, 81.4],
  },
  // Two wisteria arches in the tunnel
  "wisteria-tunnel": {
    pair: [
      [13.8, 10.1, 27.5, 27.3],
      [58.7, 10.1, 27.5, 27.3],
    ],
    names: [10, 42.8, 80, 6.5],
    line: null,
    card: [7.23, 51.56, 85.97, 37.2],
    text: [6, 7.1, 88, 84.1],
  },
  // Two blossom frames hung from the tree of love
  "prem-vriksh": {
    pair: [
      [14, 16, 29.8, 24.9],
      [56.5, 16, 29.8, 24.8],
    ],
    names: [10, 45.4, 80, 6.5],
    line: null,
    card: [5.1, 53.23, 89.69, 33.13],
    text: [6.8, 9.6, 86.5, 78.8],
  },
  // Two amaltas arches, one higher than the other
  amaltas: {
    pair: [
      [19.6, 18.9, 23.6, 23.3],
      [58.1, 10, 23.4, 23.3],
    ],
    names: [10, 46.6, 80, 6.5],
    line: null,
    card: [5.84, 54.43, 88.84, 31.94],
    text: [6.3, 9, 87.4, 79.9],
  },
  // Two palash frames in the forest
  "palash-van": {
    pair: [
      [11.4, 8.3, 29.9, 27.5],
      [57.6, 8.3, 30, 27.5],
    ],
    names: [10, 40.4, 80, 6.5],
    line: [12, 47.2, 76, 4.5],
    card: [5.43, 53.11, 89.26, 32.78],
    text: [7.4, 10.6, 85.1, 76.8],
  },
  // Two parijat frames, one higher than the other
  "parijat-angan": {
    pair: [
      [18.4, 9.6, 25.6, 21.5],
      [56.7, 18.6, 24.5, 20.9],
    ],
    names: [10, 43.8, 80, 5.3],
    line: null,
    card: [6.8, 49.88, 86.08, 37.38],
    text: [6.9, 8.2, 86.4, 81.9],
  },
  // Two mango-leaf frames in the orchard
  "aam-bagiya": {
    pair: [
      [13, 14.2, 27.7, 25],
      [58.8, 9.3, 27.1, 25.2],
    ],
    names: [10, 45.1, 80, 6.5],
    line: null,
    card: [6.48, 54.43, 87.04, 31.94],
    text: [6.2, 8.6, 87.7, 80.7],
  },
  // Two banana-leaf arches strung with jasmine
  "vazhai-mandap": {
    pair: [
      [14.1, 11.1, 26.6, 25.7],
      [57.5, 17.3, 27.8, 24.8],
    ],
    names: [10, 45.7, 80, 3.4],
    line: null,
    card: [5.74, 49.94, 88.42, 36.24],
    text: [6.2, 7.8, 87.7, 82.6],
  },
  // Two peacock-feather frames, one higher than the other
  "mor-bagh": {
    pair: [
      [14.6, 8.6, 28.9, 23.4],
      [57.8, 14.9, 28.8, 23.1],
    ],
    names: [10, 42.3, 80, 6.3],
    line: null,
    card: [10.31, 49.76, 79.28, 34.87],
    text: [8.4, 10, 83.2, 78.2],
  },
  // Two orchid frames by the waterfall
  "orchid-meghalaya": {
    pair: [
      [14.9, 9.9, 24.8, 20.5],
      [60.8, 17.1, 25.6, 20.5],
    ],
    names: [10, 43.2, 80, 6.5],
    line: null,
    card: [5.21, 52.15, 89.48, 32.12],
    text: [6.2, 9, 87.5, 80],
  },
  // Two rhododendron frames, one higher than the other
  "rhododendron-himalaya": {
    pair: [
      [17.5, 17.3, 25.1, 21.8],
      [59.3, 9, 25.7, 21.8],
    ],
    names: [10, 43.4, 80, 6.2],
    line: null,
    card: [7.44, 50.78, 84.91, 36.42],
    text: [7.4, 9, 85.2, 80.3],
  },
  // Two sunflower frames over the field
  "sunflower-haldi": {
    pair: [
      [13.1, 14.2, 27.2, 22.6],
      [60.7, 8, 26.9, 23],
    ],
    names: [10, 41.9, 80, 6.5],
    line: null,
    card: [7.01, 50.48, 85.97, 35.47],
    text: [6.7, 8.4, 86.5, 81.3],
  },
  // Two lavender frames tied with a ribbon
  "lavender-field": {
    pair: [
      [13.1, 11.8, 30.4, 25.3],
      [59.4, 16, 29.6, 24.6],
    ],
    names: [10, 44.9, 80, 5.1],
    line: null,
    card: [4.78, 51.2, 90.44, 33.01],
    text: [6.9, 9.8, 86.2, 78.4],
  },
  // Two hydrangea frames by the lake
  "hydrangea-blue": {
    pair: [
      [15.4, 16.6, 27.3, 23.7],
      [58.4, 8, 27.2, 24.3],
    ],
    names: [10, 44.9, 80, 4.8],
    line: null,
    card: [7.86, 50.54, 85.44, 36.24],
    text: [6, 7.8, 86.7, 82.6],
  },
  // Two peony frames in the garden
  "peony-blush": {
    pair: [
      [14.9, 13.2, 27.5, 21.2],
      [58.6, 16.2, 28.4, 21.1],
    ],
    names: [10, 41.6, 80, 5.9],
    line: null,
    card: [8.93, 48.74, 82.15, 38.04],
    text: [5.1, 5.5, 89.8, 87.4],
  },
  // Two magnolia frames under the moon
  "magnolia-moon": {
    pair: [
      [13.3, 9.8, 29.8, 24],
      [57.3, 17.9, 28.9, 23.2],
    ],
    names: [10, 46.3, 80, 4.9],
    line: null,
    card: [8.71, 52.03, 82.89, 38.46],
    text: [7.1, 8, 85.8, 82.4],
    dark: true,
  },
  // Two orchid frames under the floral chandelier
  "phool-chandelier": {
    pair: [
      [14.3, 18.7, 24.9, 21.2],
      [61.8, 11, 25.6, 22.1],
    ],
    names: [10, 44.8, 80, 6.5],
    line: null,
    card: [12.01, 53.05, 75.56, 34.63],
    text: [7.1, 8, 86.5, 82.2],
  },
};

/**
 * An illustrated card's painting: the empty space its words go in (the names at its top,
 * the line under them and each celebration below), and whether that space is dark.
 */
type IllustratedEntry = {
  open: FrameBox;
  /** Where the names go when the painting sets them apart (between two symbols). */
  names?: FrameBox;
  dark?: true;
};

const ILLUSTRATED: Record<IllustratedId, IllustratedEntry> = {
  // Blush watercolour above the couple, the peacock and the lotus
  "mor-kamal": { open: [8, 13, 84, 38] },
  // Cream paper under the toran, above the elephants
  "rajwada-haathi": { open: [10, 15, 78, 39] },
  // Handmade paper between the bamboo, under the sun
  "madhubani-machhli": { open: [26, 19, 48, 50] },
  // Indigo night under the kadamba branch and the moon
  "pichwai-gaay": { open: [22, 10, 62, 27], dark: true },
  // Plaster under the bells, above the elephant and the lamp
  "kerala-mural": { open: [14, 14, 80, 38] },
  // The wall inside the temple arch, between the banana plants
  "kalyana-vazhai": { open: [26, 17, 48, 38] },
  // Ivory under the mango leaves, above the shola crowns
  "alpana-topor": { open: [8, 10, 84, 34] },
  // The mirror-work panel below the dancers
  "kutch-rang": { open: [7, 51, 86, 35] },
  // The night sky between the cypresses, under the lanterns
  "mughal-bagh": { open: [15, 16, 70, 34], dark: true },
  // Cream between the phulkari strips
  "phulkari-lavan": { open: [12, 10, 76, 37] },
  // Ivory between the roses and the doves
  "safed-gulaab": { open: [18, 24, 64, 30] },
  // Cream above the gold line drawing
  "line-art-gold": { open: [10, 18, 80, 33] },
  // The sunset sky between the palms
  "samudra-sanjh": { open: [16, 7, 68, 37] },
  // The paper night sky above the moon
  "kaagaz-chaand": { open: [10, 6, 80, 35], dark: true },
  // Beige sky above the village and the doli
  "doli-vidaai": { open: [16, 8, 76, 37] },
  // Cream under the marigold strings
  "haldi-genda": { open: [8, 21, 84, 22] },
  // Mint under the mango branch, above the swing
  "mehendi-jhoola": { open: [8, 20, 84, 24] },
  // Plum night under the lights
  "sangeet-dhol": { open: [8, 15, 84, 30], dark: true },
  // Pale sky between the balloons
  "pehla-janamdin": { open: [17, 15, 65, 38] },
  // Cream under the garland, above the cradle and the swans
  "godh-bharai": { open: [10, 15, 80, 31] },
  // The wall under the toran, above the doorway
  "griha-kalash": { open: [8, 16, 84, 26] },
  // The evening sky beside the neem tree
  "sona-saath": { open: [6, 6, 54, 44] },
  // Cream under the lamps, the names between the two swastiks
  "bagh-reception": { open: [14, 15, 72, 35], names: [14, 19, 72, 7.5] },
};

export function isIllustrated(suite: SuiteId): suite is IllustratedId {
  return (ILLUSTRATED_IDS as readonly SuiteId[]).includes(suite);
}

/**
 * The names at the top of the empty space, the line under them where it is tall enough,
 * and each celebration in the rest.
 */
function openLayout({ open, names: placed }: IllustratedEntry): SceneLayout {
  const [x, y, w, h] = open;
  const names: FrameBox = placed ?? [x, y, w, Math.min(8.5, Math.max(6, h * 0.22))];
  const top = names[1] + names[3];
  const end = y + h;
  const line: FrameBox | null = end - top >= 22 ? [x + 3, top, w - 6, 4.5] : null;
  const from = line ? top + line[3] + 1 : top + 0.5;
  return { names, line, slot: [x, from, w, end - from] };
}

/**
 * How an illustrated card opens: its empty space first, then the art above it drops in,
 * the art at its sides slides in and the art below it rises, so the painting comes
 * together from every side. The pieces cover the whole painting between them.
 */
function openPieces([x, y, w, h]: FrameBox): Piece[] {
  const right = x + w;
  const bottom = y + h;
  const pieces: Piece[] = [
    { box: [x, y, w, h], from: "fade", order: 0 },
    { box: [0, 0, 100, y], from: "top", order: 1 },
    { box: [0, y, x, h], from: "left", order: 2 },
    { box: [right, y, 100 - right, h], from: "right", order: 2 },
    { box: [0, bottom, 100, 100 - bottom], from: "bottom", order: 3 },
  ];
  return pieces.filter(({ box }) => box[2] > 0.5 && box[3] > 0.5);
}

/** A part of an illustrated card's painting and the side it comes in from as the card opens. */
export type Piece = { box: FrameBox; from: Entrance | "fade"; order: number };

export type ScenePage = {
  image: string;
  style: SlotStyle;
  /** The theme's own card, when the slot is painted. */
  card: PaintedCard | null;
  /** Where each photo shows through: the couple, or the bride then the groom. */
  frames: readonly FrameBox[];
  /** The names and line print light whatever the hour, on a dark painting. */
  dark: boolean;
  /** An illustrated card's painting in parts, as it comes together; empty for every other. */
  pieces: readonly Piece[];
} & SceneLayout;

/** The painting and places for a theme's scene with this many photos, if it has one. */
export function scenePage(suite: SuiteId, photos: number): ScenePage | null {
  if (isIllustrated(suite)) {
    const entry = ILLUSTRATED[suite];
    return {
      image: `/suites/${suite}/scene.webp`,
      style: "bare",
      dark: Boolean(entry.dark),
      card: null,
      frames: [],
      pieces: openPieces(entry.open),
      ...openLayout(entry),
    };
  }
  if (isSceneTheme(suite)) {
    // One frame: with two photos, the first (the couple, or the bride) shows
    const { frame, pair, names, line, card, text, dark, plate } = PAINTED[suite];
    return {
      image: `/suites/${suite}/scene.webp`,
      style: "painted",
      dark: Boolean(dark),
      card: { image: `/suites/${suite}/card.webp`, text, plate: Boolean(plate) },
      frames: pair ?? [frame],
      pieces: [],
      names,
      line,
      slot: card,
    };
  }
  const entry = SCENES[suite];
  // With no photos the one-frame painting still shows the names' initials in its frame
  const page = entry ? photoPage(suite, Math.max(1, photos)) : null;
  if (!entry || !page) return null;
  const layout = page.frames.length > 1 ? entry.two : entry.one;
  return {
    image: page.image,
    style: entry.style,
    card: null,
    frames: page.frames,
    dark: false,
    pieces: [],
    ...layout,
  };
}

/**
 * How many photos a Scene theme's painting has frames for: one, the bride's and the
 * groom's, or none on an illustrated card.
 */
export function sceneFrames(suite: SuiteId): 0 | 1 | 2 {
  if (isIllustrated(suite)) return 0;
  return isSceneTheme(suite) && PAINTED[suite].pair ? 2 : 1;
}

/** Whether a theme can be shown as one scene. */
export function hasScene(suite: SuiteId): boolean {
  return isSceneTheme(suite) || Boolean(SCENES[suite as keyof typeof SCENES]);
}

export const SCENE_SUITES = [
  ...Object.keys(SCENES),
  ...Object.keys(PAINTED),
  ...ILLUSTRATED_IDS,
] as SuiteId[];

/** The sides a function can come in from; each one leaves the way the next comes in. */
export const ENTRANCES = ["right", "left", "bottom", "top"] as const;
export type Entrance = (typeof ENTRANCES)[number];

/** Each function in turn comes from a different side, so no two in a row look the same. */
export function entranceFor(index: number): Entrance {
  return ENTRANCES[index % ENTRANCES.length]!;
}

/** How long each function stays in the slot before the next comes in. */
export const SCENE_HOLD_MS = 4200;
/** How long one function takes to leave and the next to arrive. */
export const SCENE_SWAP_MS = 900;

/** The light the painting takes while a function is in the slot, and its movement. */
export function sceneLight(kind: FunctionId | "line"): { mood: Mood; art: PageArt } {
  if (kind === "line") return { mood: "day", art: "family" };
  return pageLook(kind);
}
