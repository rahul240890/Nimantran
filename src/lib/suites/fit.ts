/*
 * Fitting a page's words to its painting's calm area. The page tries its words at one size
 * after another and keeps the largest that fits: long names and three lines of
 * grandparents shrink, and a short page grows to fill its calm space so guests can read it.
 */

import { ROLES, type TypeRole } from "./lettering";

/** Words never shrink below this share of their designed size, so they stay readable. */
export const FIT_MIN = 0.6;
/** Nor grow past this: a short page fills its calm space a little, keeping the theme's proportions. */
export const FIT_MAX = 1.25;
/**
 * The most a page of reading words may grow: a family page of parents' names, a memory or
 * a tahuko fills its calm space until its largest line is about as large as a heading.
 */
export const FIT_GROW = 2.2;
/** The names under a couple's photos may grow this far into the plain wall below the frames. */
export const FIT_PHOTO = 1.6;
/** Words grown past FIT_MAX fill at most this share of the calm space's height. */
export const FIT_ROOM = 0.9;

/**
 * How far a page's words may grow, from the largest kind of line on it. A page of names or
 * a function's title keeps the theme's proportions (FIT_MAX); a page set only in reading
 * words grows until its largest line would stand as large as a page's heading, so the
 * parents' names on a family page don't sit small in an empty arch.
 */
export function fitGrowth(roles: readonly TypeRole[]): number {
  const largest = Math.max(0, ...roles.map((role) => ROLES[role].fluid));
  if (largest === 0) return FIT_MAX;
  const heading = ROLES.display.fluid / largest;
  return Math.round(Math.min(FIT_GROW, Math.max(FIT_MAX, heading)) * 100) / 100;
}

/**
 * A person's name stays on one line unless that would shrink the page's words below this:
 * then, in a narrow column beside the art, it may break after its first three words.
 */
export const FIT_KEEP_NAMES = 0.75;
/**
 * On a page of reading words, a name kept whole that holds the page below this share of how
 * far it may grow may break too, when breaking lets the words grow by FIT_HELD_GAIN or more.
 */
export const FIT_HELD = 0.8;
export const FIT_HELD_GAIN = 1.1;

/**
 * The largest scale between `min` and `max` at which `fits` holds, to within a few
 * hundredths. `overflow` is true when even `min` doesn't fit, so the page has too many words.
 */
export function fitScale(
  fits: (scale: number) => boolean,
  { min = FIT_MIN, max = FIT_MAX, steps = 7 } = {},
): { scale: number; overflow: boolean } {
  if (fits(max)) return { scale: max, overflow: false };
  if (!fits(min)) return { scale: min, overflow: true };
  let low = min;
  let high = max;
  for (let i = 0; i < steps; i++) {
    const mid = (low + high) / 2;
    if (fits(mid)) low = mid;
    else high = mid;
  }
  // Rounded down, never up: a hair larger than the largest size that fits can wrap a line
  return { scale: Math.floor(low * 1000) / 1000, overflow: false };
}
