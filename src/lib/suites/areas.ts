/*
 * Where the words sit on each painting (Step 12f). Every painting has a calm part, a wall,
 * a sky, still water or the inside of an arch, and the words go there so they never cover
 * the art. Found from each painting's least detailed band, then checked by eye.
 * Values are percentages of the page: [top, bottom, left, right].
 */

import type { PageArt, SuiteId } from "./catalog";

export type TextArea = { top: number; bottom: number; left: number; right: number };

type Inset = readonly [top: number, bottom: number, left?: number, right?: number];

/** Pages without a painting, and paintings not listed, keep the words in the middle. */
export const DEFAULT_AREA: TextArea = { top: 12, bottom: 5, left: 5, right: 5 };

const AREAS: Partial<Record<SuiteId, Partial<Record<PageArt, Inset>>>> = {
  "rajwada-bagh": {
    cover: [16, 40],
    family: [24, 22],
    haldi: [18, 28],
    mehendi: [16, 26],
    sangeet: [14, 42],
    baraat: [12, 52],
    wedding: [28, 36],
    reception: [18, 40],
    reply: [30, 25],
  },
  "shahi-savari": {
    cover: [24, 28],
    family: [38, 18],
    haldi: [20, 36],
    mehendi: [24, 30],
    sangeet: [46, 28],
    baraat: [12, 46],
    wedding: [42, 24],
    reception: [28, 34],
    reply: [14, 42],
  },
  kayal: {
    cover: [20, 28],
    family: [16, 40, 4, 30],
    haldi: [34, 30, 4, 26],
    mehendi: [26, 32, 32, 3],
    sangeet: [52, 16],
    baraat: [14, 36],
    wedding: [40, 24, 16, 16],
    reception: [26, 34],
    reply: [26, 30],
  },
  "noor-bagh": {
    cover: [14, 46],
    family: [28, 26],
    haldi: [20, 38],
    mehendi: [18, 28],
    sangeet: [12, 44],
    baraat: [12, 50],
    wedding: [30, 36],
    reception: [18, 46],
    reply: [36, 20],
  },
  "phulkari-haveli": {
    cover: [20, 38],
    family: [26, 34],
    haldi: [26, 32],
    mehendi: [18, 32, 18, 20],
    sangeet: [14, 44],
    baraat: [12, 44],
    wedding: [20, 32],
    reception: [16, 42],
    reply: [16, 43],
  },
  rajbari: {
    cover: [12, 47],
    family: [16, 36],
    haldi: [18, 36],
    mehendi: [22, 32],
    sangeet: [12, 44],
    baraat: [12, 44],
    wedding: [38, 22],
    reception: [14, 42],
    reply: [32, 26],
  },
  "peshwai-wada": {
    cover: [18, 32],
    family: [22, 32],
    haldi: [16, 34],
    mehendi: [16, 34],
    sangeet: [14, 42],
    baraat: [12, 45],
    wedding: [38, 30],
    reception: [14, 44],
    reply: [30, 22, 30, 4],
  },
};

/** The calm part of a theme's painting for a page, where its words go. */
export function textArea(suite: SuiteId, art: PageArt): TextArea {
  const inset = AREAS[suite]?.[art];
  if (!inset) return DEFAULT_AREA;
  const [top, bottom, left = 6, right = 6] = inset;
  return { top, bottom, left, right };
}
