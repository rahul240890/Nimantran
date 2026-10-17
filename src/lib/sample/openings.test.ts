import { describe, expect, it } from "vitest";
import { CATEGORY_IDS } from "@/lib/categories/catalog";
import { draftFaith, draftOpeningStyle } from "@/lib/editor/draft";
import { designById, type GalleryDesign } from "@/lib/gallery/catalog";
import { COLLECTION_IDS } from "@/lib/gallery/collections";
import {
  DESIGN_FORMATS,
  NO_FILTERS,
  PHOTO_GROUPS,
  designCatalog,
  filterCatalog,
  type DesignFilters,
} from "@/lib/gallery/filters";
import { WEDDING_KINDS } from "@/lib/gallery/ids";
import {
  OPENING_STYLES,
  isThemedOpening,
  openingSuits,
  type OpeningStyle,
} from "@/lib/opening/catalog";
import { DESIGN_OPENINGS } from "@/lib/opening/design-openings";
import { draftShowsScene, draftSuite } from "@/lib/publish/story";
import { isStoryId } from "@/lib/suites/catalog";
import { sampleInvite, sampleOccasion } from "./invite";
import { LIVE_DEMOS } from "./paths";

/*
 * Walking from one sample to the next, each design opens its own way (owner, 2026-10-17):
 * no gate twice in a row in any listing, none twice on the home page's tour.
 */

const catalog = designCatalog();
const designs = catalog.map((item) => item.design);

/** The opening a design's sample, and so a guest of a host who keeps it, sees. */
const opening = (design: GalleryDesign): OpeningStyle => {
  const { draft } = sampleInvite(design, "en");
  return draftOpeningStyle(draft, draftSuite(draft), draftShowsScene(draft));
};
const openings = new Map(designs.map((design) => [design.id, opening(design)]));

/** Every listing a sample's Previous and Next can walk (browse.ts). */
function listings(): DesignFilters[] {
  const all: DesignFilters[] = [NO_FILTERS];
  const add = (filters: Partial<DesignFilters>) => all.push({ ...NO_FILTERS, ...filters });
  for (const occasion of CATEGORY_IDS) {
    add({ occasion });
    for (const format of DESIGN_FORMATS) add({ occasion, format });
    for (const photos of PHOTO_GROUPS) add({ occasion, photos });
  }
  for (const kind of WEDDING_KINDS) {
    add({ kind });
    for (const format of DESIGN_FORMATS) add({ kind, format });
    for (const photos of PHOTO_GROUPS) add({ kind, photos });
  }
  for (const collection of COLLECTION_IDS) add({ collection });
  for (const format of DESIGN_FORMATS) add({ format });
  for (const photos of PHOTO_GROUPS) add({ photos });
  return all;
}

describe("each design's own opening", () => {
  it("is given to every design not painted with one, and names only real designs", () => {
    const own = (design: GalleryDesign) => isThemedOpening(design.suite) || isStoryId(design.suite);
    for (const design of designs) {
      expect(Boolean(DESIGN_OPENINGS[design.id]), design.id).toBe(!own(design));
    }
    for (const id of Object.keys(DESIGN_OPENINGS)) expect(designById(id), id).toBeTruthy();
  });

  it("suits the design's occasion and faith, and is what its sample opens with", () => {
    for (const design of designs) {
      const given = DESIGN_OPENINGS[design.id];
      if (!given) continue;
      const { draft } = sampleInvite(design, "en");
      expect(openingSuits(given, sampleOccasion(design), draftFaith(draft)), design.id).toBe(true);
      expect(openings.get(design.id), design.id).toBe(given);
    }
  });

  it("uses every gate and opening we have", () => {
    const used = new Set(openings.values());
    for (const style of OPENING_STYLES) {
      if (style === "doors" || style === "none") continue;
      expect(used.has(style), style).toBe(true);
    }
  });

  it("never opens two designs side by side in a listing the same way", () => {
    for (const filters of listings()) {
      const ids = filterCatalog(catalog, filters, () => "").map((item) => item.design.id);
      if (ids.length < 2) continue;
      ids.forEach((id, at) => {
        // Previous and Next wrap round from the last design to the first
        const next = ids[(at + 1) % ids.length]!;
        if (next === id) return;
        expect(openings.get(next), `${JSON.stringify(filters)}: ${id}, ${next}`).not.toBe(
          openings.get(id),
        );
      });
    }
  });

  it("opens every stop on the home page's tour its own way", () => {
    const tour = LIVE_DEMOS.map((id) => openings.get(id));
    expect(new Set(tour).size).toBe(LIVE_DEMOS.length);
  });
});
