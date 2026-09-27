/*
 * Couple photo pages (Step 12l). Each painted theme has two paintings with frames of its
 * own shape: one frame for the couple together, and two for the bride and the groom. The
 * frame openings are cut out of the painting (transparent in the WebP), so the photo sits
 * under the painting and shows through exactly the frame's shape, whatever the shape is:
 * a jharokha, a mirror-work medallion, an oval, a Mughal arch, a diamond, a scalloped
 * gilt frame or a paisley. Boxes are percentages of the painting: [x, y, width, height].
 * Themes without these paintings show the photos in plain arch frames instead.
 */

import type { SuiteId } from "./catalog";
import type { TextArea } from "./areas";

export type FrameBox = readonly [x: number, y: number, width: number, height: number];

export type PhotoPage = {
  image: string;
  /** Where each photo shows through, in order: the couple, or the bride then the groom. */
  frames: readonly FrameBox[];
  /** The plain part of the painting under the frames, where the names go. */
  area: TextArea;
};

/** The paintings' own size, so photos line up with the frames however the page is cropped. */
export const PAINTING_ASPECT = 768 / 1365;

type Entry = { one: readonly [FrameBox]; two: readonly [FrameBox, FrameBox]; words: Inset };
/** Where the names go on the one-photo and two-photo paintings: [top, bottom] insets. */
type Inset = readonly [one: readonly [number, number], two: readonly [number, number]];

const FRAMES: Partial<Record<SuiteId, Entry>> = {
  "rajwada-bagh": {
    one: [[23.8, 15.1, 52.2, 31.9]],
    two: [
      [12.2, 12.0, 31.0, 26.2],
      [56.8, 12.1, 31.0, 26.1],
    ],
    words: [
      [52, 18],
      [44, 20],
    ],
  },
  "shahi-savari": {
    one: [[20.6, 10.0, 58.9, 32.6]],
    two: [
      [11.3, 10.8, 34.8, 19.9],
      [55.5, 37.0, 34.2, 19.5],
    ],
    words: [
      [50, 18],
      [60, 18],
    ],
  },
  kayal: {
    one: [[30.3, 11.7, 39.8, 32.8]],
    two: [
      [31.0, 7.2, 38.0, 21.2],
      [31.2, 38.0, 37.5, 21.0],
    ],
    words: [
      [66, 14],
      [74, 10],
    ],
  },
  "noor-bagh": {
    one: [[27.6, 7.9, 44.9, 39.6]],
    two: [
      [7.3, 11.4, 26.2, 28.2],
      [66.8, 11.4, 26.2, 28.1],
    ],
    words: [
      [54, 20],
      [46, 22],
    ],
  },
  "phulkari-haveli": {
    one: [[19.5, 14.0, 60.8, 33.7]],
    two: [
      [16.3, 17.5, 25.8, 32.1],
      [58.3, 17.5, 25.5, 32.0],
    ],
    words: [
      [54, 20],
      [56, 22],
    ],
  },
  rajbari: {
    one: [[27.9, 11.5, 44.5, 34.1]],
    two: [
      [18.2, 22.1, 31.0, 25.8],
      [60.8, 31.4, 22.7, 17.7],
    ],
    words: [
      [52, 20],
      [54, 20],
    ],
  },
  "peshwai-wada": {
    one: [[27.5, 10.3, 44.8, 37.3]],
    two: [
      [17.1, 11.1, 28.5, 27.5],
      [55.2, 11.0, 28.6, 27.6],
    ],
    words: [
      [54, 18],
      [46, 20],
    ],
  },
};

/** The painting and frames for a theme's photo page with this many photos, if it has one. */
export function photoPage(suite: SuiteId, count: number): PhotoPage | null {
  const entry = FRAMES[suite];
  if (!entry || count < 1) return null;
  const two = count >= 2;
  const [top, bottom] = entry.words[two ? 1 : 0];
  return {
    image: `/suites/${suite}/${two ? "couple-two" : "couple"}.webp`,
    frames: two ? entry.two : entry.one,
    area: { top, bottom, left: 6, right: 6 },
  };
}

/** The themes that have their own photo paintings. */
export const PHOTO_PAGE_SUITES = Object.keys(FRAMES) as SuiteId[];
