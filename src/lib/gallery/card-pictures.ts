import type { CSSProperties } from "react";
import SHEET from "./card-sheet.json";

/*
 * A design card's picture without the image resizer (owner, 2026-10-24: on the occasion
 * pages most cards' paintings never came in). The free plan's resizer stops making new
 * sizes once its month's allowance is spent, so a card now shows a thumbnail cut ahead to
 * just what the card shows, from the site's own files, and while that is on its way, its
 * tile from one small blurred sheet that every card on the page shares. Both come from
 * scripts/card-pictures.ts, which writes card-sheet.json.
 */

const TILES = new Map(SHEET.pictures.map((key, index) => [key, index]));
const [TILE_WIDTH, TILE_HEIGHT] = SHEET.tile as [number, number];
const CELL_WIDTH = TILE_WIDTH + SHEET.gutter * 2;
const CELL_HEIGHT = TILE_HEIGHT + SHEET.gutter * 2;
const SHEET_WIDTH = SHEET.columns * CELL_WIDTH;
const SHEET_HEIGHT = SHEET.rows * CELL_HEIGHT;

/** A theme's painting by its address, as the sheet names it: "kayal/cover". */
function pictureKey(src: string): string | null {
  return /^\/suites\/([^/]+\/[^/]+)\.webp$/.exec(src)?.[1] ?? null;
}

/** The blurred sheet every card's tile is in. */
export const CARD_SHEET = SHEET.sheet;

export type CardPictureFiles = {
  /** The thumbnail of what the card shows. */
  thumb: string;
  /** The painting's tile in the shared blurred sheet, drawn to fill its box. */
  blur: CSSProperties;
};

/** A card picture's thumbnail and blurred tile; none for a painting no card shows. */
export function cardPictureFiles(src: string): CardPictureFiles | null {
  const key = pictureKey(src);
  const index = key === null ? undefined : TILES.get(key);
  if (index === undefined) return null;
  const left = (index % SHEET.columns) * CELL_WIDTH + SHEET.gutter;
  const top = Math.floor(index / SHEET.columns) * CELL_HEIGHT + SHEET.gutter;
  // The sheet drawn so one tile fills the box: a percentage places that point of the sheet
  // on the same point of the box
  const percent = (value: number) => `${+(value * 100).toFixed(4)}%`;
  return {
    thumb: `/cards/${key}.webp`,
    blur: {
      backgroundImage: `url(${SHEET.sheet})`,
      backgroundSize: `${percent(SHEET_WIDTH / TILE_WIDTH)} ${percent(SHEET_HEIGHT / TILE_HEIGHT)}`,
      backgroundPosition: `${percent(left / (SHEET_WIDTH - TILE_WIDTH))} ${percent(top / (SHEET_HEIGHT - TILE_HEIGHT))}`,
    },
  };
}
