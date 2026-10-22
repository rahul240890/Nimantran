import { CATEGORIES } from "@/lib/categories/catalog";
import type { GalleryDesign } from "@/lib/gallery/catalog";
import { filterCatalog, type CatalogEntry, type DesignFilters } from "@/lib/gallery/filters";
import { draftDesignId } from "@/lib/plans/design-defaults";
import type { Pricing } from "@/lib/plans/design-tiers";
import { SUITES } from "@/lib/suites/catalog";
import { TRADITIONS } from "@/lib/traditions/catalog";
import type { InviteDraft } from "./draft";

/*
 * The editor's designs (owner, 2026-10-22: the old step listed every theme for the occasion
 * in one long column, then a hundred openings): the designs made for the invite's occasion,
 * narrowed by the Designs page's filters, the chosen one first and the tradition's own next.
 * Picking one changes only the design; the names, details, photos and words stay.
 */

type Picked = Pick<InviteDraft, "suite" | "tradition" | "templateId" | "categoryId" | "format">;

/** The designs a host can pick for this invite: its occasion's, and the one it has. */
export function occasionEntries(entries: readonly CatalogEntry[], draft: Picked): CatalogEntry[] {
  const chosen = draftDesignId(draft);
  return entries.filter(
    (entry) => entry.occasions.includes(draft.categoryId) || entry.design.id === chosen,
  );
}

/**
 * The cards in the order the invite suits them: its tradition's first, then its occasion's,
 * then any other, as the card list always offered them.
 */
function cardRank(draft: Picked): (template: string) => number {
  const tradition = draft.tradition.id ? TRADITIONS[draft.tradition.id].templates : [];
  const order: string[] = [
    ...new Set([...tradition, ...(CATEGORIES[draft.categoryId].templates as readonly string[])]),
  ];
  return (template) => {
    const at = order.indexOf(template);
    return at < 0 ? order.length : at;
  };
}

/**
 * The designs to show, best first: the matching designs in the gallery's order (or by
 * price), each 3D card in its slot ranked by the tradition and occasion, then the chosen
 * design and the tradition's own design moved to the front.
 */
export function pickerDesigns(
  entries: readonly CatalogEntry[],
  draft: Picked,
  filters: DesignFilters,
  words: (design: GalleryDesign) => string,
  pricing: Pick<Pricing, "tiers" | "designs">,
): CatalogEntry[] {
  const shown = filterCatalog(
    occasionEntries(entries, draft),
    { ...filters, occasion: null },
    words,
    pricing,
  );
  if (filters.sort !== "recommended") return shown;
  const rank = cardRank(draft);
  const cards = shown
    .filter((entry) => entry.format === "card")
    .sort((a, b) => rank(a.design.template) - rank(b.design.template));
  let next = 0;
  const mixed = shown.map((entry) => (entry.format === "card" ? cards[next++]! : entry));
  const lead = [draftDesignId(draft), draftDesignId({ ...draft, suite: null })];
  const leads = lead
    .map((id) => mixed.find((entry) => entry.design.id === id))
    .filter((entry): entry is CatalogEntry => Boolean(entry));
  return [...new Set([...leads, ...mixed])];
}

/** The draft in another design: its theme, Scene or pages, and card; nothing else changes. */
export function withDesign(draft: InviteDraft, design: GalleryDesign): InviteDraft {
  const card = design.suite === "classic";
  return {
    ...draft,
    suite: design.suite,
    // A theme brings its matching card with it; a 3D card is the card itself
    templateId: card ? design.template : (SUITES[design.suite].template ?? draft.templateId),
    format: design.format === "scene" ? "scene" : "story",
  };
}
