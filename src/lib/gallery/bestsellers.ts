import { SECTION_PICKS } from "./home-sections";
import { inviteDesignId, type InviteDesign } from "./trending";

/*
 * Best sellers (owner, 2026-10-24): the designs families paid for most in the last three
 * months, then the designs most invitations went live with, then this starting list, so the
 * section is never empty before there are sales to count.
 */

/** How far back sales and live invitations are counted. */
export const BESTSELLER_DAYS = 90;

/** Until there are sales to count: the designs families have picked most so far. */
export const DEFAULT_BESTSELLERS: readonly string[] = [
  "rajwada-bagh",
  "noor-bagh",
  "kayal",
  "shahi-savari",
  "jal-mahal-scene",
  "phulkari-haveli",
  "rajbari",
  "peshwai-wada",
  "kutch-toran",
  "genda-barsaat-scene",
  "chaand-kalayein",
  "baithak-bagh-scene",
];

/** Ids most often first; a tie keeps the order they were first met in. */
function byCount(ids: readonly (string | null)[]): string[] {
  const counts = new Map<string, number>();
  for (const id of ids) if (id) counts.set(id, (counts.get(id) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id);
}

/**
 * The best sellers, in order: by paid orders, then by live invitations, then the starting
 * list, each design once and only designs the site still has.
 */
export function bestsellerDesigns(
  paidDesigns: readonly (string | null)[],
  liveInvites: readonly InviteDesign[],
  known: ReadonlySet<string>,
): string[] {
  const live = liveInvites.map((invite) => inviteDesignId(invite, known));
  return [...new Set([...byCount(paidDesigns), ...byCount(live), ...DEFAULT_BESTSELLERS])]
    .filter((id) => known.has(id))
    .slice(0, SECTION_PICKS);
}
