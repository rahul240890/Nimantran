import type { DesignTier } from "@/lib/plans/design-tiers";
import type { CatalogEntry } from "./filters";
import { sectionOccasion, sectionSize, type HomeSectionId } from "./home-sections";

/*
 * What each home page section shows (owner, 2026-11-04). The admin's choices (Admin, Home
 * page, and Trending's pins) show as chosen. A section left to fill itself leads with Royal
 * and Signature designs and takes only a few of the others (Premium, or a free 3D card),
 * spread through it: two in most sections, four in the wedding's and the engagement's 24. No design shows twice anywhere on the page: a design the admin
 * chose stays where they put it, and the sections filling themselves step around it.
 */

/** The most Premium (or free) designs a section that fills itself shows. */
export const PREMIUM_AT_MOST = 2;

/** The wedding and the engagement show 24, so a few more of them (owner, 2026-11-04). */
const PREMIUM_IN: Partial<Record<HomeSectionId, number>> = { wedding: 4, engagement: 4 };

/** How many Premium (or free) designs a section that fills itself may show. */
export const premiumAtMost = (id: HomeSectionId): number => PREMIUM_IN[id] ?? PREMIUM_AT_MOST;

const isRich = (tier: DesignTier) => tier === "royal" || tier === "signature";

/**
 * Up to `size` of the candidates, in their order: Royal and Signature, with up to `others`
 * of the rest spread evenly among them, and more of the rest only when those run out.
 */
export function favourTiers(
  candidates: readonly string[],
  size: number,
  tierOf: (id: string) => DesignTier,
  others = PREMIUM_AT_MOST,
): string[] {
  if (size <= 0) return [];
  const rich = candidates.filter((id) => isRich(tierOf(id)));
  const rest = candidates.filter((id) => !isRich(tierOf(id)));
  const mixed = Math.min(Math.max(0, others), rest.length, size);
  const richTake = Math.min(rich.length, size - mixed);
  const restTake = Math.min(rest.length, size - richTake);
  const lead = rich.slice(0, richTake);
  const spread = rest.slice(0, Math.min(mixed, restTake));
  const out: string[] = [];
  let next = 0;
  lead.forEach((id, index) => {
    // The j-th other goes after about (j + 1) / (others + 1) of the Royal and Signature ones
    while (
      next < spread.length &&
      index === Math.round(((next + 1) * lead.length) / (spread.length + 1))
    ) {
      out.push(spread[next++]!);
    }
    out.push(id);
  });
  out.push(...spread.slice(next), ...rest.slice(spread.length, restTake));
  return out;
}

export type HomeFillInput = {
  /** The sections the page shows, in order. */
  sections: readonly HomeSectionId[];
  /** The designs the admin chose for a section, in order. */
  chosen: Partial<Record<HomeSectionId, readonly string[]>>;
  /** Trending's designs, the admin's pins first, and the pins themselves. */
  trending: readonly string[];
  pinned: readonly string[];
  bestsellers: readonly string[];
  newest: readonly string[];
  /** Every design, in the gallery's order. */
  entries: readonly CatalogEntry[];
  tierOf: (id: string) => DesignTier;
};

/** An occasion's designs, those painted for it first and the 3D cards every one shares after. */
function occasionIds(entries: readonly CatalogEntry[], occasion: string): string[] {
  const all = entries.filter((entry) => (entry.occasions as readonly string[]).includes(occasion));
  return [
    ...all.filter((entry) => entry.format !== "card"),
    ...all.filter((entry) => entry.format === "card"),
  ].map((entry) => entry.design.id);
}

/** How many designs Trending and Best sellers show that aren't for a wedding, at most. */
export const NOT_WEDDING_AT_MOST = 2;

/**
 * Wedding designs first (owner, 2026-11-07: the home page is mostly for weddings): the
 * list in its order, keeping only the first few that don't suit a wedding in their place
 * and moving the rest after every wedding design.
 */
export function weddingFirst(
  ids: readonly string[],
  forWedding: (id: string) => boolean,
  others = NOT_WEDDING_AT_MOST,
): string[] {
  const kept: string[] = [];
  const later: string[] = [];
  let left = others;
  for (const id of ids) {
    if (forWedding(id)) kept.push(id);
    else if (left > 0) {
      kept.push(id);
      left -= 1;
    } else later.push(id);
  }
  return [...kept, ...later];
}

/** Each shown section's designs, in order, none of them in two sections. */
export function fillHomeSections(input: HomeFillInput): Partial<Record<HomeSectionId, string[]>> {
  const { sections, chosen, entries, tierOf } = input;
  const everyId = entries.map((entry) => entry.design.id);
  const weddings = new Set(
    entries
      .filter((entry) => (entry.occasions as readonly string[]).includes("wedding"))
      .map((entry) => entry.design.id),
  );
  const forWedding = (design: string) => weddings.has(design);
  const pins = chosen.trending ? [] : [...input.pinned];
  // What the admin chose, anywhere on the page, is theirs: no section filling itself takes it
  const reserved = new Set<string>([
    ...sections.flatMap((id) => chosen[id] ?? []),
    ...(sections.includes("trending") ? pins : []),
  ]);
  const seen = new Set<string>();
  const out: Partial<Record<HomeSectionId, string[]>> = {};
  for (const id of sections) {
    const own = chosen[id];
    const size = sectionSize(id);
    let list: string[];
    if (own) {
      list = own.filter((design) => !seen.has(design)).slice(0, size);
    } else {
      const fixed =
        id === "trending" ? pins.filter((design) => !seen.has(design)).slice(0, size) : [];
      const occasion = sectionOccasion(id);
      const pool =
        id === "trending"
          ? weddingFirst([...new Set([...input.trending, ...everyId])], forWedding)
          : id === "bestsellers"
            ? weddingFirst([...new Set([...input.bestsellers, ...everyId])], forWedding)
            : id === "new"
              ? [...input.newest]
              : occasionIds(entries, occasion!);
      const candidates = [...new Set(pool)].filter(
        (design) => !seen.has(design) && !reserved.has(design) && !fixed.includes(design),
      );
      const pinnedOthers = fixed.filter((design) => !isRich(tierOf(design))).length;
      list = [
        ...fixed,
        ...favourTiers(candidates, size - fixed.length, tierOf, premiumAtMost(id) - pinnedOthers),
      ];
    }
    for (const design of list) seen.add(design);
    out[id] = list;
  }
  return out;
}
