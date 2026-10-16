import { CATEGORIES, type CategoryId } from "@/lib/categories/catalog";
import { TRADITIONS } from "./catalog";
import type { TraditionId } from "./schema";

/*
 * The family's faith, for the religious wording a card is offered: Shri Ganeshaya Namah
 * for a Hindu card, Ik Onkar for a Sikh one, Bismillah for a Muslim one, a verse for a
 * Christian one, the Navkar for a Jain one, or none at all. It never comes from a design's
 * painting (Hindu couples choose Mughal gardens too): only from the occasion, the kind of
 * wedding the host picked in the gallery, a Hindu tradition pack, or the host's own choice.
 * Wording for every faith is a draft for community reviewers (docs/TRADITIONS.md, 10).
 */

export const FAITHS = ["hindu", "sikh", "muslim", "christian", "jain", "none"] as const;
export type Faith = (typeof FAITHS)[number];

export function isFaith(value: unknown): value is Faith {
  return typeof value === "string" && (FAITHS as readonly string[]).includes(value);
}

/** Occasions that belong to one faith, whatever else the card says. */
const OCCASION_FAITH: Partial<Record<CategoryId, Faith>> = {
  eid: "muslim",
  christening: "christian",
  christmas: "christian",
  baisakhi: "sikh",
};

/** Occasions with no religious wording: parties, work and school. */
const SECULAR_GROUPS: readonly string[] = ["birthdays", "parties", "business", "education"];

/** A shop opening often starts with a puja, so it keeps its religious wording. */
const RELIGIOUS_EXCEPTIONS: readonly CategoryId[] = ["shop-opening"];

/** Whether the occasion's wording depends on the family's faith, so the editor asks for it. */
export function faithChoosable(categoryId: CategoryId): boolean {
  if (OCCASION_FAITH[categoryId]) return false;
  const group = CATEGORIES[categoryId].group;
  if (group === "festivals") return false;
  return !SECULAR_GROUPS.includes(group) || RELIGIOUS_EXCEPTIONS.includes(categoryId);
}

/**
 * The faith a card's wording follows until the host chooses: the occasion's own, then
 * the one the gallery's kind of wedding gave, then the tradition pack's, else Hindu for
 * a religious occasion and none for a party.
 */
export function defaultFaith(categoryId: CategoryId, traditionId: TraditionId | null): Faith {
  const own = OCCASION_FAITH[categoryId];
  if (own) return own;
  const group = CATEGORIES[categoryId].group;
  if (SECULAR_GROUPS.includes(group) && !RELIGIOUS_EXCEPTIONS.includes(categoryId)) return "none";
  if (traditionId) return TRADITIONS[traditionId].community === "modern" ? "none" : "hindu";
  return "hindu";
}

/** The faith a card follows: the host's choice where the occasion allows one, else its default. */
export function cardFaith(
  categoryId: CategoryId,
  traditionId: TraditionId | null,
  chosen: Faith | null,
): Faith {
  return chosen && faithChoosable(categoryId) ? chosen : defaultFaith(categoryId, traditionId);
}
