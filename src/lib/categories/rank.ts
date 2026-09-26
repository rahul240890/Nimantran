import { REGION_CODES, type Category, type RegionCode } from "./schema";

/*
 * Seasonal and regional ordering for the home screen. A category scores its base priority,
 * plus points when it is in season, plus points where it is celebrated, plus a bonus when
 * a short-lived occasion is in its own place and time: Onam in Kerala in August, Durga
 * Puja in Bengal in October. Ties keep the catalogue's order, so the result is stable.
 */

export type RankContext = {
  /** 1 to 12. */
  month?: number | null;
  region?: RegionCode | null;
};

export const RANK_POINTS = { season: 25, region: 25, moment: 50 } as const;

/** Occasions whose season is this short are dated moments, like festivals. */
const MOMENT_MONTHS = 3;

export function inSeason(category: Category, month: number | null | undefined): boolean {
  return month != null && category.season.includes(month);
}

/** Celebrated in this region in particular; nationwide categories never count as local. */
export function isLocal(category: Category, region: RegionCode | null | undefined): boolean {
  return region != null && category.regions.includes(region);
}

export function scoreCategory(category: Category, { month, region }: RankContext): number {
  const season = inSeason(category, month);
  const local = isLocal(category, region);
  return (
    category.priority +
    (season ? RANK_POINTS.season : 0) +
    (local ? RANK_POINTS.region : 0) +
    (season && local && category.season.length <= MOMENT_MONTHS ? RANK_POINTS.moment : 0)
  );
}

export function rankCategories<T extends Category>(
  categories: readonly T[],
  context: RankContext,
): T[] {
  return categories
    .map((category, index) => ({ category, index, score: scoreCategory(category, context) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.category);
}

/** Reads a region code from a header or cookie value such as "KL" or "IN-KL". */
export function parseRegion(value: string | null | undefined): RegionCode | null {
  if (!value) return null;
  const code = value.trim().toUpperCase().replace(/^IN-/, "");
  return (REGION_CODES as readonly string[]).includes(code) ? (code as RegionCode) : null;
}

export function parseMonth(value: string | null | undefined): number | null {
  if (!value || !/^\d{1,2}$/.test(value)) return null;
  const month = Number(value);
  return month >= 1 && month <= 12 ? month : null;
}
