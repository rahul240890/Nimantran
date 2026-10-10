import { describe, expect, it } from "vitest";
import { WEDDING_KINDS } from "./catalog";
import { designCatalog, filtersFromParams } from "./filters";
import {
  SHELF_SIZE,
  SHELVES,
  shelfEntries,
  shelfFilters,
  shelfHref,
  traditionShelf,
} from "./shelves";

const entries = designCatalog();

describe("designs page rows", () => {
  it("has a row for each photo need and kind of invitation", () => {
    const ids = SHELVES.map((shelf) => shelf.id);
    expect(ids.slice(0, 3)).toEqual(["photos-none", "photos-one", "photos-two"]);
    expect(ids).toContain("format-card");
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every row and tradition has designs, shows a few and counts them all", () => {
    for (const shelf of [...SHELVES, ...WEDDING_KINDS.map(traditionShelf)]) {
      const { shown, total } = shelfEntries(entries, shelf);
      expect(shown.length, shelf.id).toBeGreaterThan(0);
      expect(shown.length).toBeLessThanOrEqual(SHELF_SIZE);
      expect(total).toBeGreaterThanOrEqual(shown.length);
    }
  });

  it("an occasion's row leads with its own painted designs before the shared 3D cards", () => {
    for (const shelf of SHELVES.filter((item) => item.kind === "occasion")) {
      const formats = shelfEntries(entries, shelf).shown.map((entry) => entry.format);
      const firstCard = formats.indexOf("card");
      if (firstCard >= 0) expect(formats.slice(firstCard).every((f) => f === "card")).toBe(true);
      expect(formats[0], shelf.id).not.toBe("card");
    }
  });

  it("View all opens the same page with the row's filter chosen", () => {
    const gujarati = traditionShelf("gujarati");
    const href = shelfHref(gujarati, "/designs");
    expect(href).toBe("/designs?tradition=gujarati");
    expect(filtersFromParams(new URL(href, "https://x.test").searchParams)).toEqual(
      shelfFilters(gujarati),
    );
  });
});
