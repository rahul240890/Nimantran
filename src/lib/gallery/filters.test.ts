import { describe, expect, it } from "vitest";
import {
  NO_FILTERS,
  catalogHref,
  designCatalog,
  filterCatalog,
  filtersFromParams,
  filtersToParams,
  hasFilters,
  tierOf,
} from "./filters";
import { BUILT_PRICING } from "@/lib/plans/design-defaults";

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
      collection: "garden",
      price: "royal",
      sort: "price-high",
    } as const;
    expect(filtersFromParams(new URLSearchParams(filtersToParams(filters)))).toEqual(filters);
    expect(
      filtersFromParams(
        new URLSearchParams("occasion=moon&format=x&collection=moon&price=gold&sort=cheap"),
      ),
    ).toEqual(NO_FILTERS);
  });
});

describe("price filter and sorting", () => {
  const pricing = {
    ...BUILT_PRICING,
    designs: { premium: 49_900, royal: 79_900, signature: 99_900 },
  };
  const tiers = (filters: Partial<typeof NO_FILTERS>) =>
    filterCatalog(entries, { ...NO_FILTERS, ...filters }, () => "", pricing).map((entry) =>
      tierOf(pricing, entry.design.id),
    );

  it("a price shows only designs of that tier, and counts as a filter", () => {
    expect(new Set(tiers({ price: "free" }))).toEqual(new Set(["free"]));
    expect(tiers({ price: "free" }).length).toBeGreaterThan(0);
    expect(hasFilters({ ...NO_FILTERS, price: "royal" })).toBe(true);
    // Ordering alone is not a filter: the page keeps its rows
    expect(hasFilters({ ...NO_FILTERS, sort: "price-low" })).toBe(false);
  });

  it("sorts by what each design costs, either way, keeping the mix within a price", () => {
    const cost = (tier: string) => ["free", "premium", "royal", "signature"].indexOf(tier);
    const low = tiers({ sort: "price-low" }).map(cost);
    expect(low).toEqual([...low].sort((a, b) => a - b));
    const high = tiers({ sort: "price-high" }).map(cost);
    expect(high).toEqual([...high].sort((a, b) => b - a));
    const free = (sort: "recommended" | "price-low") =>
      filterCatalog(entries, { ...NO_FILTERS, sort, price: "free" }, () => "", pricing).map(
        (entry) => entry.design.id,
      );
    expect(free("price-low")).toEqual(free("recommended"));
  });

  it("follows the admin's tiers", () => {
    const moved = {
      ...pricing,
      tiers: { ...pricing.tiers, "card-marigold": "signature" as const },
    };
    const signature = filterCatalog(
      entries,
      { ...NO_FILTERS, price: "signature" },
      () => "",
      moved,
    );
    expect(signature.map((entry) => entry.design.id)).toContain("card-marigold");
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

  it("a collection lists its own themes, its best first", () => {
    const royal = filterCatalog(entries, { ...NO_FILTERS, collection: "royal-wedding" }, () => "");
    expect(royal.every((entry) => entry.collection === "royal-wedding")).toBe(true);
    expect(royal[0]!.design.suite).toBe("jal-mahal");
    const cards = filterCatalog(entries, { ...NO_FILTERS, collection: "cards-3d" }, () => "");
    expect(cards.every((entry) => entry.format === "card")).toBe(true);
    expect(hasFilters({ ...NO_FILTERS, collection: "baby" })).toBe(true);
  });
});
