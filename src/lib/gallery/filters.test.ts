import { describe, expect, it } from "vitest";
import {
  NO_FILTERS,
  catalogHref,
  designCatalog,
  filterCatalog,
  filtersFromParams,
  filtersToParams,
  hasFilters,
} from "./filters";

const entries = designCatalog();
const ids = (filters: Partial<typeof NO_FILTERS>) =>
  filterCatalog(entries, { ...NO_FILTERS, ...filters }, (design) => design.id).map(
    (entry) => entry.design.id,
  );

describe("design filters", () => {
  it("lists every design with nothing chosen", () => {
    expect(ids({})).toHaveLength(entries.length);
  });

  it("narrows by kind of invitation", () => {
    const scenes = filterCatalog(entries, { ...NO_FILTERS, format: "scene" }, () => "");
    expect(scenes.length).toBeGreaterThan(0);
    expect(scenes.every((entry) => entry.design.format === "scene")).toBe(true);
    const cards = filterCatalog(entries, { ...NO_FILTERS, format: "card" }, () => "");
    expect(cards.every((entry) => entry.design.suite === "classic")).toBe(true);
  });

  it("narrows by occasion: a birthday shows birthday designs, not wedding ones", () => {
    const birthday = ids({ occasion: "birthday" });
    expect(birthday).toContain("gubbara");
    expect(birthday).not.toContain("rajwada-bagh");
  });

  it("a wedding tradition shows only that tradition's designs", () => {
    const gujarati = ids({ kind: "gujarati" });
    expect(gujarati).toContain("kutch-toran");
    expect(gujarati).toContain("card-bandhani");
    expect(gujarati).not.toContain("kayal");
  });

  it("every word searched must match", () => {
    const hits = filterCatalog(entries, { ...NO_FILTERS, query: "kayal scene" }, (design) =>
      `${design.id} ${design.format ?? ""}`.toLowerCase(),
    );
    expect(hits.map((entry) => entry.design.id)).toEqual(["kayal-scene"]);
  });

  it("Use this design carries the chosen occasion and tradition", () => {
    const kutch = entries.find((entry) => entry.design.id === "kutch-toran")!;
    const href = catalogHref(kutch, { ...NO_FILTERS, kind: "gujarati" });
    expect(href).toContain("category=wedding");
    expect(href).toContain("tradition=gujarati");
    const gubbara = entries.find((entry) => entry.design.id === "gubbara")!;
    expect(catalogHref(gubbara, NO_FILTERS)).toContain("category=birthday");
  });

  it("round-trips through the address and ignores unknown values", () => {
    const filters = {
      query: "red",
      occasion: "haldi",
      kind: null,
      format: "story",
      photos: "none",
    } as const;
    expect(filtersFromParams(new URLSearchParams(filtersToParams(filters)))).toEqual(filters);
    expect(filtersFromParams(new URLSearchParams("occasion=moon&format=x"))).toEqual(NO_FILTERS);
  });
});

describe("photo filters", () => {
  it("no photo shows designs that need none, or take photos only if wanted", () => {
    const none = filterCatalog(entries, { ...NO_FILTERS, photos: "none" }, () => "");
    expect(none.length).toBeGreaterThan(0);
    expect(none.every((entry) => ["none", "optional"].includes(entry.photos))).toBe(true);
  });

  it("a design taking a couple photo or two separate is in both the one and two lists", () => {
    const either = entries.find((entry) => entry.photos === "either")!;
    for (const photos of ["one", "two"] as const) {
      const ids = filterCatalog(entries, { ...NO_FILTERS, photos }, () => "").map(
        (entry) => entry.design.id,
      );
      expect(ids).toContain(either.design.id);
    }
  });

  it("round-trips through the address", () => {
    const filters = { ...NO_FILTERS, photos: "two" } as const;
    expect(filtersToParams(filters)).toBe("?photos=two");
    expect(filtersFromParams(new URLSearchParams("photos=two"))).toEqual(filters);
    expect(filtersFromParams(new URLSearchParams("photos=nine"))).toEqual(NO_FILTERS);
    expect(hasFilters(NO_FILTERS)).toBe(false);
    expect(hasFilters(filters)).toBe(true);
    expect(hasFilters({ ...NO_FILTERS, query: "  " })).toBe(false);
  });
});
