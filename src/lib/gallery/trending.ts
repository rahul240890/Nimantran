import { allDesigns } from "./catalog";

/*
 * Trending designs (owner, 2026-10-12): a row on the home page and the Designs page, and a
 * Trending badge on those designs wherever they show. The admin's picks come first (Admin,
 * Designs), then the designs hosts started the most invitations with in the last month,
 * then this starting list, so the row is never empty before there is usage to count.
 */

/** How many designs trend at once. */
export const TRENDING_SIZE = 12;

/** How far back invitations are counted. */
export const TRENDING_DAYS = 30;

/** An invite counts towards trending only once its design has a few, so one host can't. */
export const TRENDING_MIN_INVITES = 2;

/** Until there is usage to count: the newest moving scenes, stories and favourites. */
export const DEFAULT_TRENDING: readonly string[] = [
  "jal-mahal-scene",
  "chaand-kalayein",
  "genda-barsaat-scene",
  "kutch-toran",
  "baithak-bagh-scene",
  "ritu-chakra",
  "rajwada-bagh",
  "malli-mazhai-scene",
  "noor-bagh",
  "gubbara",
  "jaali-vriksh-scene",
  "akash-kandil-scene",
];

export type TrendingSettings = { pinned: string[] };

export const NO_TRENDING_SETTINGS: TrendingSettings = { pinned: [] };

/** Stored settings, read leniently: only known design ids, each once, in order. */
export function parseTrendingSettings(value: unknown): TrendingSettings {
  const pinned = (value as { pinned?: unknown } | null)?.pinned;
  if (!Array.isArray(pinned)) return NO_TRENDING_SETTINGS;
  const known = new Set(allDesigns().map((design) => design.id));
  return {
    pinned: [...new Set(pinned.filter((id): id is string => typeof id === "string"))]
      .filter((id) => known.has(id))
      .slice(0, TRENDING_SIZE),
  };
}

/** One invitation as the events table stores its design. */
export type InviteDesign = {
  suite?: string | null;
  format?: string | null;
  template?: string | null;
};

/** The gallery design an invitation was made with ("kayal", "kayal-scene", "card-rose"). */
export function inviteDesignId(invite: InviteDesign, known: ReadonlySet<string>): string | null {
  const { suite, format, template } = invite;
  if (suite && suite !== "classic") {
    const scene = `${suite}-scene`;
    // A Scene theme has no pages, so it is only ever its Scene
    if (format === "scene" || !known.has(suite)) return known.has(scene) ? scene : null;
    return suite;
  }
  const card = `card-${template}`;
  return template && known.has(card) ? card : null;
}

/** The trending designs: the admin's picks, the most used, then the starting list. */
export function trendingDesigns(
  pinned: readonly string[],
  invites: readonly InviteDesign[],
): string[] {
  const known = new Set(allDesigns().map((design) => design.id));
  const counts = new Map<string, number>();
  for (const invite of invites) {
    const id = inviteDesignId(invite, known);
    if (id) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  const used = [...counts]
    .filter(([, count]) => count >= TRENDING_MIN_INVITES)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);
  return [...new Set([...pinned, ...used, ...DEFAULT_TRENDING])]
    .filter((id) => known.has(id))
    .slice(0, TRENDING_SIZE);
}
