/*
 * One Scene (pilot): the whole invitation on one painting. The couple's photos show
 * through the painting's frames, the names and a line sit under them, and one slot
 * lower down brings in each function in turn, each from its own side, while the
 * painting's light follows the day (a haldi morning, a sangeet night). It reuses the
 * couple photo paintings (photo-frames.ts), so a theme needs no new images to try it.
 *
 * Boxes are percentages of the painting, like the frames: [x, y, width, height].
 */

import type { FunctionId } from "@/lib/events/functions";
import { pageLook, type Mood, type PageArt, type SuiteId } from "./catalog";
import { photoPage, type FrameBox } from "./photo-frames";

/** The slot's shape, drawn in the theme's colours: a palace window, a kasavu-bordered panel. */
export type SlotStyle = "jharokha" | "kasavu";

type SceneLayout = {
  /** The names, printed on the painting. */
  names: FrameBox;
  /** The line under the names; null when the painting has no room, so it opens the slot. */
  line: FrameBox | null;
  slot: FrameBox;
};

type SceneEntry = {
  style: SlotStyle;
  one: SceneLayout;
  two: SceneLayout;
};

const SCENES: Partial<Record<SuiteId, SceneEntry>> = {
  // The palace wall below the windows is plain down to the fountain
  "rajwada-bagh": {
    style: "jharokha",
    one: {
      names: [14, 49.5, 72, 6.5],
      line: [18, 56, 64, 5],
      slot: [22, 62, 56, 19],
    },
    two: {
      names: [12, 45, 76, 6.5],
      line: [16, 51.5, 68, 5],
      slot: [18, 58, 64, 21],
    },
  },
  // Below the houseboat the backwater is calm mist down to the lotuses
  kayal: {
    style: "kasavu",
    one: {
      names: [8, 58.5, 84, 6],
      line: [12, 64.5, 76, 4.8],
      slot: [16, 70, 68, 17],
    },
    // The carved panel runs down to 70%, so the line opens the slot instead
    two: {
      names: [6, 70.5, 88, 5.5],
      line: null,
      slot: [14, 76.5, 72, 14],
    },
  },
};

export type ScenePage = {
  image: string;
  style: SlotStyle;
  /** Where each photo shows through: the couple, or the bride then the groom. */
  frames: readonly FrameBox[];
} & SceneLayout;

/** The painting and places for a theme's scene with this many photos, if it has one. */
export function scenePage(suite: SuiteId, photos: number): ScenePage | null {
  const entry = SCENES[suite];
  // With no photos the one-frame painting still shows the names' initials in its frame
  const page = entry ? photoPage(suite, Math.max(1, photos)) : null;
  if (!entry || !page) return null;
  const layout = page.frames.length > 1 ? entry.two : entry.one;
  return { image: page.image, style: entry.style, frames: page.frames, ...layout };
}

/** Whether a theme can be shown as one scene. */
export function hasScene(suite: SuiteId): boolean {
  return Boolean(SCENES[suite]);
}

export const SCENE_SUITES = Object.keys(SCENES) as SuiteId[];

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
