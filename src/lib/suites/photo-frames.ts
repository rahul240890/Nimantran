/*
 * Couple photo pages (Step 12l). Each painted theme has two paintings with frames of its
 * own shape: one frame for the couple together, and two for the bride and the groom. The
 * frame openings are cut out of the painting (transparent in the WebP), so the photo sits
 * under the painting and shows through exactly the frame's shape, whatever the shape is:
 * a jharokha, a mirror-work medallion, an oval, a Mughal arch, a diamond, a scalloped
 * gilt frame or a paisley. A birthday theme has one frame, for the guest of honour. Boxes are percentages of the painting: [x, y, width, height].
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

type Entry = {
  one: readonly [FrameBox];
  /** Missing on a theme for one person (a birthday): two photos share the one frame. */
  two?: readonly [FrameBox, FrameBox];
  words: Inset;
  /** The painting's file name when it isn't "couple" (a birthday's is "photo"). */
  image?: string;
};
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
  "ivory-arch": {
    one: [[23.0, 7.2, 53.9, 39.7]],
    two: [
      [15.1, 5.6, 33.6, 40.9],
      [57.3, 20.3, 29.8, 26.2],
    ],
    words: [
      [50, 12],
      [50, 12],
    ],
  },
  gulaab: {
    one: [[19.4, 14.6, 61.1, 34.4]],
    two: [
      [12.6, 11.9, 38.9, 22.1],
      [50.0, 24.3, 37.8, 21.7],
    ],
    words: [
      [52, 12],
      [49, 12],
    ],
  },
  "deco-noir": {
    one: [[21.4, 9.5, 57.4, 35.8]],
    two: [
      [12.2, 11.4, 32.3, 40.4],
      [55.5, 11.4, 32.3, 40.4],
    ],
    words: [
      [48, 16],
      [55, 14],
    ],
  },
  taara: {
    one: [[22.5, 7.3, 59.5, 33.7]],
    two: [
      [10.2, 7.8, 35.8, 20.2],
      [56.1, 25.3, 35.7, 20.2],
    ],
    words: [
      [44, 14],
      [48, 14],
    ],
  },
  kaagaz: {
    one: [[15.9, 9.7, 68.2, 32.1]],
    two: [
      [10.5, 21.5, 33.7, 28.9],
      [55.9, 21.6, 33.6, 28.7],
    ],
    words: [
      [45, 20],
      [53, 16],
    ],
  },
  mitti: {
    one: [[22.4, 12.4, 54.7, 30.5]],
    two: [
      [22.5, 13.3, 25.3, 35.2],
      [58.7, 23.3, 22.7, 25.3],
    ],
    words: [
      [46, 18],
      [52, 18],
    ],
  },
  neel: {
    one: [[22.9, 13.9, 53.9, 30.0]],
    two: [
      [12.1, 25.6, 31.5, 34.8],
      [56.4, 25.6, 31.5, 34.7],
    ],
    words: [
      [47, 22],
      [63, 12],
    ],
  },
  pichwai: {
    one: [[24.3, 15.2, 51.3, 28.6]],
    two: [
      [10.7, 18.0, 30.5, 17.3],
      [58.9, 18.0, 30.6, 17.3],
    ],
    words: [
      [47, 18],
      [38, 20],
    ],
  },
  tanjore: {
    one: [[26.7, 13.6, 46.7, 31.2]],
    two: [
      [11.8, 25.3, 31.1, 26.7],
      [57.0, 25.3, 31.1, 26.6],
    ],
    words: [
      [48, 16],
      [55, 14],
    ],
  },
  kashi: {
    one: [[22.3, 9.8, 54.9, 30.7]],
    two: [
      [14.3, 28.1, 27.1, 15.2],
      [59.5, 28.8, 27.0, 15.1],
    ],
    words: [
      [44, 20],
      [47, 14],
    ],
  },
  sagar: {
    one: [[23.7, 12.3, 52.7, 29.7]],
    two: [
      [7.9, 22.7, 39.5, 19.6],
      [52.7, 22.7, 39.3, 19.6],
    ],
    words: [
      [45, 18],
      [45, 18],
    ],
  },
  mysuru: {
    one: [[21.2, 19.8, 57.7, 31.9]],
    two: [
      [12.6, 25.8, 31.8, 17.6],
      [55.6, 25.8, 31.8, 17.6],
    ],
    words: [
      [56, 14],
      [50, 14],
    ],
  },
  kalamkari: {
    one: [[23.7, 14.3, 52.9, 32.6]],
    two: [
      [9.8, 24.2, 29.9, 16.4],
      [60.5, 24.2, 29.8, 16.4],
    ],
    words: [
      [68, 8],
      [64, 14],
    ],
  },
  pattachitra: {
    one: [[22.0, 15.3, 56.0, 31.3]],
    two: [
      [12.0, 30.2, 28.0, 14.9],
      [60.0, 30.1, 28.1, 15.0],
    ],
    words: [
      [52, 14],
      [50, 14],
    ],
  },
  chinar: {
    one: [[11.5, 16.3, 77.2, 36.7]],
    two: [
      [12.1, 32.2, 33.1, 23.2],
      [54.2, 32.1, 33.2, 23.3],
    ],
    words: [
      [58, 14],
      [60, 14],
    ],
  },
  "chai-bagan": {
    one: [[20.1, 22.1, 59.8, 33.8]],
    two: [
      [15.2, 22.1, 29.0, 16.5],
      [56.1, 22.0, 29.2, 16.5],
    ],
    words: [
      [60, 16],
      [44, 20],
    ],
  },
  "sufi-raat": {
    one: [[20.2, 17.7, 59.8, 33.3]],
    two: [
      [13.0, 22.0, 28.3, 25.3],
      [58.7, 22.0, 28.3, 25.3],
    ],
    words: [
      [56, 16],
      [52, 18],
    ],
  },
  chapel: {
    one: [[20.6, 18.5, 59.0, 36.3]],
    two: [
      [12.4, 23.1, 32.3, 17.9],
      [55.1, 23.1, 32.3, 17.9],
    ],
    words: [
      [59, 12],
      [46, 14],
    ],
  },
  sakura: {
    one: [[18.2, 12.8, 61.7, 34.9]],
    two: [
      [14.5, 11.0, 31.4, 17.0],
      [50.4, 25.0, 30.9, 16.6],
    ],
    words: [
      [52, 12],
      [48, 12],
    ],
  },
  vigna: {
    one: [[14.5, 20.0, 70.7, 30.3]],
    two: [
      [19.4, 27.5, 25.3, 24.3],
      [56.9, 27.5, 25.3, 24.3],
    ],
    words: [
      [56, 14],
      [58, 12],
    ],
  },
  himani: {
    one: [[22.1, 18.5, 55.7, 31.2]],
    two: [
      [11.2, 25.1, 32.3, 24.0],
      [56.4, 25.1, 32.4, 24.0],
    ],
    words: [
      [55, 14],
      [56, 14],
    ],
  },
  van: {
    one: [[27.1, 12.7, 43.4, 36.8]],
    two: [
      [17.1, 14.9, 31.6, 18.2],
      [55.7, 27.6, 31.8, 18.3],
    ],
    words: [
      [55, 12],
      [52, 12],
    ],
  },
  riad: {
    one: [[25.8, 13.1, 48.7, 33.9]],
    two: [
      [17.1, 20.8, 27.7, 27.1],
      [55.1, 20.8, 27.7, 27.1],
    ],
    words: [
      [52, 14],
      [53, 14],
    ],
  },
  palna: {
    one: [[18.8, 14.9, 62.0, 35.0]],
    words: [
      [55, 12],
      [55, 12],
    ],
    image: "photo",
  },
  deepotsav: {
    one: [[21.1, 14.2, 57.7, 31.9]],
    words: [
      [51, 10],
      [51, 10],
    ],
    image: "photo",
  },
  // A birthday has one guest of honour, so one frame
  "jungle-party": {
    one: [[20.4, 10.3, 58.6, 31.9]],
    words: [
      [45, 14],
      [45, 14],
    ],
    image: "photo",
  },
};

/** The painting and frames for a theme's photo page with this many photos, if it has one. */
export function photoPage(suite: SuiteId, count: number): PhotoPage | null {
  const entry = FRAMES[suite];
  if (!entry || count < 1) return null;
  const two = count >= 2 && entry.two ? entry.two : null;
  const [top, bottom] = entry.words[two ? 1 : 0];
  return {
    image: `/suites/${suite}/${two ? "couple-two" : (entry.image ?? "couple")}.webp`,
    frames: two ?? entry.one,
    area: { top, bottom, left: 6, right: 6 },
  };
}

/** The themes that have their own photo paintings. */
export const PHOTO_PAGE_SUITES = Object.keys(FRAMES) as SuiteId[];
