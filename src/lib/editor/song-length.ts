/*
 * How long the host's own song has to run. The guest hears it from the tap that opens the
 * invitation: through the opening and its welcome, every page (or the one Scene's cards),
 * then softly while the page below moves on by itself, section by section. The song never
 * repeats, so the part the host keeps must last at least as long as the invitation plays;
 * a little longer also covers the sections below.
 */

/**
 * The opening before the first page: a painted gate opening (4 seconds at the opening's
 * pace, opening.tsx) and the welcome with the names (4.4 seconds), rounded up for the
 * screen settling and the paintings arriving.
 */
export const OPENING_SECONDS = 10;
/** Each card of a One Scene stays this long (SCENE_HOLD_MS, suites/scene.ts). */
export const SCENE_CARD_SECONDS = 5.5;

export type SongLengths = {
  /** The opening and the pages: the least the song may run, in whole seconds. */
  need: number;
  /** The sections below too: as long as a song needs to play to the reply form. */
  full: number;
};

/**
 * The song's lengths for an invitation whose pages (or Scene) play for `play` seconds,
 * with the page below moving on for `below` seconds before the reply form.
 */
export function songLengths(play: number, below: number): SongLengths {
  const need = Math.ceil(OPENING_SECONDS + Math.max(0, play));
  return { need, full: need + Math.ceil(Math.max(0, below)) };
}

/** What the page below the pages shows, for how long it moves on by itself. */
export type BelowPage = {
  /** A painted theme's own guest page (themed-details.tsx), not the plain details. */
  themed: boolean;
  functions: number;
  photos: boolean;
  family: boolean;
  /** The main event has a date: a painted theme shows a save-the-date. */
  dated: boolean;
};

/**
 * About how long the page below takes to move on from its first section to the reply form,
 * each section its own time as marked on it (`data-tour`, seconds).
 */
export function belowSeconds({ themed, functions, photos, family, dated }: BelowPage): number {
  if (!themed) return (family ? 7 : 0) + 7 + (photos ? 7 : 0);
  return (
    8 + // the welcome
    (dated ? 8 : 0) +
    (functions > 1 ? 6 : 0) + // the functions' heading
    functions * 8 +
    (photos ? 9 : 0) +
    (family ? 9 : 0) +
    7 // the lamps
  );
}

/** How long a One Scene plays: a card for the line, one per function and the welcome. */
export function sceneSeconds(functions: number): number {
  return (Math.max(0, functions) + 2) * SCENE_CARD_SECONDS;
}

/** "1:05", for a song's times. */
export function songClock(seconds: number): string {
  const whole = Math.max(0, Math.round(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}
