import type { CategoryId } from "@/lib/categories/catalog";
import { allDesigns, occasionDesigns } from "./catalog";
import { NEW_SUITES } from "./new-designs";

/*
 * The home page's sections of designs (owner, 2026-10-24): Trending and Best sellers first,
 * then a section for each main occasion, each a grid of a few designs that ends in View all,
 * so nobody has to scroll sideways. The master admin chooses which sections show, in what
 * order, and which designs each one shows (Admin, Home page); a section given no designs
 * fills itself, as it always has.
 */

export const HOME_SECTION_IDS = [
  "trending",
  "bestsellers",
  "new",
  "wedding",
  "engagement",
  "save-the-date",
  "sangeet",
  "birthday",
  "anniversary",
  "baby-shower",
  "naming-ceremony",
  "housewarming",
  "party",
] as const satisfies readonly (CategoryId | "trending" | "bestsellers" | "new")[];

export type HomeSectionId = (typeof HOME_SECTION_IDS)[number];

/** Sections that aren't one occasion's: their designs may be of any. */
const ANY_OCCASION = new Set<HomeSectionId>(["trending", "bestsellers", "new"]);

/** The occasion a section shows, or null for Trending, Best sellers and New designs. */
export function sectionOccasion(id: HomeSectionId): CategoryId | null {
  return ANY_OCCASION.has(id) ? null : (id as CategoryId);
}

/** On until the admin says otherwise: what sells, then the occasions most families plan. */
export const DEFAULT_SHOWN: readonly HomeSectionId[] = [
  "trending",
  "bestsellers",
  "wedding",
  "engagement",
  "birthday",
  "anniversary",
];

/** The most designs a section can be given. */
export const SECTION_PICKS = 12;

/** How many a section shows: 5 on a phone, 7 on a laptop and 9 on a wide screen, then View all. */
export const SECTION_SHOWN = 9;

export type HomeSections = {
  /** Every section, in the order the page shows them. */
  order: HomeSectionId[];
  /** Sections switched off. */
  hidden: HomeSectionId[];
  /** The designs the admin chose for a section, in order; none means it fills itself. */
  designs: Partial<Record<HomeSectionId, string[]>>;
};

export const DEFAULT_HOME_SECTIONS: HomeSections = {
  order: [...DEFAULT_SHOWN, ...HOME_SECTION_IDS.filter((id) => !DEFAULT_SHOWN.includes(id))],
  hidden: HOME_SECTION_IDS.filter((id) => !DEFAULT_SHOWN.includes(id)),
  designs: {},
};

const isSectionId = (value: unknown): value is HomeSectionId =>
  typeof value === "string" && (HOME_SECTION_IDS as readonly string[]).includes(value);

/** The designs a section may show: an occasion's own designs, or any for the others. */
export function sectionDesignIds(id: HomeSectionId): ReadonlySet<string> {
  const occasion = sectionOccasion(id);
  return new Set((occasion ? occasionDesigns(occasion) : allDesigns()).map((design) => design.id));
}

/**
 * Stored settings, read leniently: known sections only, each once; a section added to the
 * site later joins at the end, on only if it is one of the defaults; designs that no longer
 * exist, or don't suit the section's occasion, drop out.
 */
export function parseHomeSections(value: unknown): HomeSections {
  const saved = (value ?? {}) as { order?: unknown; hidden?: unknown; designs?: unknown };
  if (!Array.isArray(saved.order)) return DEFAULT_HOME_SECTIONS;
  const listed = [...new Set(saved.order.filter(isSectionId))];
  const added = HOME_SECTION_IDS.filter((id) => !listed.includes(id));
  const hidden = new Set(Array.isArray(saved.hidden) ? saved.hidden.filter(isSectionId) : []);
  for (const id of added) if (!DEFAULT_SHOWN.includes(id)) hidden.add(id);
  const designs: Partial<Record<HomeSectionId, string[]>> = {};
  const given = (saved.designs ?? {}) as Record<string, unknown>;
  for (const id of HOME_SECTION_IDS) {
    const list = given[id];
    if (!Array.isArray(list)) continue;
    const allowed = sectionDesignIds(id);
    const kept = [...new Set(list.filter((item): item is string => typeof item === "string"))]
      .filter((item) => allowed.has(item))
      .slice(0, SECTION_PICKS);
    if (kept.length) designs[id] = kept;
  }
  return {
    order: [...listed, ...added],
    hidden: HOME_SECTION_IDS.filter((id) => hidden.has(id)),
    designs,
  };
}

/** The sections the page shows, in order. */
export function shownSections(sections: HomeSections): HomeSectionId[] {
  return sections.order.filter((id) => !sections.hidden.includes(id));
}

/** The newest painted designs, for New designs until the admin chooses. */
export function newestDesigns(): string[] {
  const known = new Set(allDesigns().map((design) => design.id));
  return NEW_SUITES.filter((suite) => known.has(suite)).slice(0, SECTION_PICKS);
}
