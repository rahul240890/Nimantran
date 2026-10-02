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
  isSceneTheme,
  pageLook,
  type Mood,
  type PageArt,
  type SceneThemeId,
  type SuiteId,
} from "./catalog";
import { photoPage, type FrameBox } from "./photo-frames";

/**
 * The slot's card: drawn in the theme's colours (a palace window, a kasavu-bordered
 * panel), or the theme's own painted card.
 */
export type SlotStyle = "jharokha" | "kasavu" | "painted";

/** A Scene theme's painted card: its picture, and where on it the words go (percent of the card). */
export type PaintedCard = { image: string; text: FrameBox };

type SceneLayout = {
  /** The names, printed on the painting. */
  names: FrameBox;
  /** The line under the names; null when the painting has no room, so it opens the slot. */
  line: FrameBox | null;
  slot: FrameBox;
};

type SceneEntry = {
  style: Exclude<SlotStyle, "painted">;
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
 * A Scene theme's painting: its one frame, the names and line between the frame and the
 * card, and the card (its box on the painting, and the writing area on its face). With
 * no room for the line, the line opens the slot instead.
 */
type PaintedEntry = {
  frame: FrameBox;
  names: FrameBox;
  line: FrameBox | null;
  card: FrameBox;
  text: FrameBox;
  /** The painting is dark behind the names, so they print light at every hour. */
  dark?: true;
};

const PAINTED: Record<SceneThemeId, PaintedEntry> = {
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
  },
};

export type ScenePage = {
  image: string;
  style: SlotStyle;
  /** The theme's own card, when the slot is painted. */
  card: PaintedCard | null;
  /** Where each photo shows through: the couple, or the bride then the groom. */
  frames: readonly FrameBox[];
  /** The names and line print light whatever the hour, on a dark painting. */
  dark: boolean;
} & SceneLayout;

/** The painting and places for a theme's scene with this many photos, if it has one. */
export function scenePage(suite: SuiteId, photos: number): ScenePage | null {
  if (isSceneTheme(suite)) {
    // One frame: with two photos, the first (the couple, or the bride) shows
    const { frame, names, line, card, text, dark } = PAINTED[suite];
    return {
      image: `/suites/${suite}/scene.webp`,
      style: "painted",
      dark: Boolean(dark),
      card: { image: `/suites/${suite}/card.webp`, text },
      frames: [frame],
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
    ...layout,
  };
}

/** Whether a theme can be shown as one scene. */
export function hasScene(suite: SuiteId): boolean {
  return isSceneTheme(suite) || Boolean(SCENES[suite as keyof typeof SCENES]);
}

export const SCENE_SUITES = [...Object.keys(SCENES), ...Object.keys(PAINTED)] as SuiteId[];

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
