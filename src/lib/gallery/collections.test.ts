import { describe, expect, it } from "vitest";
import { galleryText } from "@/i18n/copy/gallery";
import { UI_LOCALES } from "@/i18n/locales";
import { SUITES, SUITE_IDS } from "@/lib/suites/catalog";
import { COLLECTIONS, COLLECTION_IDS, collectionOf } from "./collections";
import { designCatalog } from "./filters";

describe("collections", () => {
  it("place every theme in exactly one collection", () => {
    const placed = COLLECTION_IDS.flatMap((id) => COLLECTIONS[id].suites);
    expect(placed.filter((suite, index) => placed.indexOf(suite) !== index)).toEqual([]);
    expect(SUITE_IDS.filter((suite) => !placed.includes(suite))).toEqual([]);
    for (const suite of SUITE_IDS) expect(collectionOf(suite)).toBeTruthy();
  });

  it("every collection has designs, a painted cover and words in each site language", () => {
    const entries = designCatalog();
    for (const id of COLLECTION_IDS) {
      const collection = COLLECTIONS[id];
      expect(collection.id).toBe(id);
      expect(
        entries.some((entry) => entry.collection === id),
        id,
      ).toBe(true);
      if ("suite" in collection.cover)
        expect(SUITES[collection.cover.suite].images.cover).toBeTruthy();
      for (const locale of UI_LOCALES) {
        const words = galleryText[locale].collectionCopy.names[id];
        expect(words.name, `${locale} ${id}`).not.toBe("");
        expect(words.intro, `${locale} ${id}`).not.toBe("");
      }
    }
  });
});
