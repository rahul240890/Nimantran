import type { CSSProperties } from "react";
import SHEET from "./gate-posters.json";
import type { OpeningStyle } from "./catalog";

/*
 * A painted gate's tile in the editor's gate picker, as one small picture made ahead
 * (owner, 2026-10-24: the picker drew every gate live, each with its full-size paintings,
 * and was slow to open). While the picture comes in, the gate's tile from one small blurred
 * sheet that every tile shares shows at once. Both come from scripts/gate-posters.ts, which
 * writes gate-posters.json.
 */

const TILES = new Map<string, number>(SHEET.gates.map((gate, index) => [gate, index]));
const [TILE_WIDTH, TILE_HEIGHT] = SHEET.tile as [number, number];
const CELL_WIDTH = TILE_WIDTH + SHEET.gutter * 2;
const CELL_HEIGHT = TILE_HEIGHT + SHEET.gutter * 2;
const SHEET_WIDTH = SHEET.columns * CELL_WIDTH;
const SHEET_HEIGHT = SHEET.rows * CELL_HEIGHT;

/** The blurred sheet every painted gate's tile is in. */
export const GATE_SHEET = SHEET.sheet;

export type GatePoster = {
  /** The gate's small picture, closed. */
  src: string;
  /** Its tile in the shared blurred sheet, drawn to fill its box. */
  blur: CSSProperties;
};

/** A painted gate's picture and blurred tile; none for a gate drawn on the page. */
export function gatePoster(style: OpeningStyle): GatePoster | null {
  const index = TILES.get(style);
  if (index === undefined) return null;
  const left = (index % SHEET.columns) * CELL_WIDTH + SHEET.gutter;
  const top = Math.floor(index / SHEET.columns) * CELL_HEIGHT + SHEET.gutter;
  // The sheet drawn so one tile fills the box: a percentage places that point of the sheet
  // on the same point of the box
  const percent = (value: number) => `${+(value * 100).toFixed(4)}%`;
  return {
    src: `/openings/posters/${style}.webp`,
    blur: {
      backgroundImage: `url(${SHEET.sheet})`,
      backgroundSize: `${percent(SHEET_WIDTH / TILE_WIDTH)} ${percent(SHEET_HEIGHT / TILE_HEIGHT)}`,
      backgroundPosition: `${percent(left / (SHEET_WIDTH - TILE_WIDTH))} ${percent(top / (SHEET_HEIGHT - TILE_HEIGHT))}`,
    },
  };
}
