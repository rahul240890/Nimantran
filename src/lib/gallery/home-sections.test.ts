import { describe, expect, it } from "vitest";
import { BESTSELLER_DAYS, DEFAULT_BESTSELLERS, bestsellerDesigns } from "./bestsellers";
import { allDesigns, occasionDesigns } from "./catalog";
import {
  DEFAULT_HOME_SECTIONS,
  DEFAULT_SHOWN,
  HOME_SECTION_IDS,
  SECTION_PICKS,
  newestDesigns,
  parseHomeSections,
  sectionOccasion,
  shownSections,
} from "./home-sections";

const known = new Set(allDesigns().map((design) => design.id));

describe("home page sections", () => {
  it("start with Trending and Best sellers, before the wedding and the engagement", () => {
    expect(shownSections(DEFAULT_HOME_SECTIONS)).toEqual([...DEFAULT_SHOWN]);
    expect(DEFAULT_SHOWN.slice(0, 4)).toEqual(["trending", "bestsellers", "wedding", "engagement"]);
    // Every other section is there for the admin to switch on
    expect([...DEFAULT_HOME_SECTIONS.order].sort()).toEqual([...HOME_SECTION_IDS].sort());
  });

  it("read the admin's settings leniently", () => {
    const wedding = occasionDesigns("wedding").map((design) => design.id);
    const birthday = occasionDesigns("birthday").map((design) => design.id);
    const parsed = parseHomeSections({
      order: ["wedding", "trending", "nonsense", "wedding"],
      hidden: ["trending", "nonsense"],
      designs: {
        wedding: [
          wedding[2],
          "no-such-design",
          wedding[2],
          birthday.find((id) => !wedding.includes(id)),
        ],
        trending: Array.from({ length: 20 }, (_, i) => [...known][i]),
      },
    });
    // Known sections once each, in the saved order; the rest join after, on only if a default
    expect(parsed.order.slice(0, 2)).toEqual(["wedding", "trending"]);
    expect(parsed.order).toHaveLength(HOME_SECTION_IDS.length);
    expect(shownSections(parsed)).toEqual([
      "wedding",
      ...DEFAULT_SHOWN.filter((id) => id !== "wedding" && id !== "trending"),
    ]);
    // A wedding section keeps only real wedding designs, each once
    expect(parsed.designs.wedding).toEqual([wedding[2]]);
    expect(parsed.designs.trending).toHaveLength(SECTION_PICKS);
    expect(parseHomeSections(null)).toEqual(DEFAULT_HOME_SECTIONS);
    expect(parseHomeSections({ order: "x" })).toEqual(DEFAULT_HOME_SECTIONS);
  });

  it("know which are an occasion's", () => {
    expect(sectionOccasion("trending")).toBeNull();
    expect(sectionOccasion("new")).toBeNull();
    expect(sectionOccasion("birthday")).toBe("birthday");
  });

  it("show the newest painted designs as New designs", () => {
    const newest = newestDesigns();
    expect(newest.length).toBeGreaterThan(0);
    for (const id of newest) expect(known.has(id)).toBe(true);
  });
});

describe("best sellers", () => {
  it("rank by paid orders, then live invitations, then the starting list", () => {
    const list = bestsellerDesigns(
      ["kayal", "noor-bagh", "noor-bagh", null, "gone-design"],
      [
        { suite: "rajbari", format: "story" },
        { suite: "rajbari", format: "story" },
      ],
      known,
    );
    expect(list.slice(0, 3)).toEqual(["noor-bagh", "kayal", "rajbari"]);
    expect(list).not.toContain("gone-design");
    expect(new Set(list).size).toBe(list.length);
    expect(list).toHaveLength(SECTION_PICKS);
  });

  it("are never empty before there are sales", () => {
    const list = bestsellerDesigns([], [], known);
    expect(list.length).toBeGreaterThan(5);
    expect(list[0]).toBe(DEFAULT_BESTSELLERS.find((id) => known.has(id)));
    expect(BESTSELLER_DAYS).toBe(90);
  });
});
