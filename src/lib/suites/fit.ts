/*
 * Fitting a page's words to its painting's calm area. The page tries its words at one size
 * after another and keeps the largest that fits: long names and three lines of
 * grandparents shrink, a short page grows a little so it doesn't look lost.
 */

/** Words never shrink below this share of their designed size, so they stay readable. */
export const FIT_MIN = 0.6;
/** Nor grow past this, so a short page keeps the theme's proportions. */
export const FIT_MAX = 1.1;

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
  return { scale: Number(low.toFixed(3)), overflow: false };
}
