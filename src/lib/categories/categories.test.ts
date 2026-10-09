import { describe, expect, it } from "vitest";
import { TEMPLATES } from "@/lib/templates/catalog";
import { CATEGORIES, CATEGORY_IDS, isCategoryId } from "./catalog";
import { parseMonth, parseRegion, rankCategories, scoreCategory } from "./rank";
import { regionLanguage } from "./regions";
import { LOCALES, categorySchema, type Category } from "./schema";

const all = CATEGORY_IDS.map((id) => CATEGORIES[id]);

/** Festivals arrive as data in Step 23; these stand in for them. */
function festival(id: string, season: number[], regions: Category["regions"]): Category {
  return {
    id,
    group: "festivals",
    names: Object.fromEntries(LOCALES.map((code) => [code, id])) as Category["names"],
    icon: "diya",
    priority: 20,
    season,
    regions,
    functions: { planned: ["wedding"], suggested: ["wedding"], primary: "wedding" },
    schedule: "full",
    rsvpQuestions: [],
    templates: ["kasavu"],
    wording: {},
  };
}
const onam = festival("onam", [8, 9], ["KL"]);
const durgaPuja = festival("durga-puja", [9, 10], ["WB"]);
const withFestivals = [...all, onam, durgaPuja];

describe("category catalogue", () => {
  it("launches with the wedding journey, then family, festival, party and business occasions", () => {
    expect(CATEGORY_IDS).toEqual([
      "wedding",
      "engagement",
      "save-the-date",
      "roka",
      "haldi",
      "mehendi",
      "sangeet",
      "reception",
      "birthday",
      "anniversary",
      "party",
      "baby-shower",
      "diwali",
      "housewarming",
      "puja",
      "thread-ceremony",
      "ganesh-chaturthi",
      "navratri",
      "annaprashan",
      "eid",
      "naming-ceremony",
      "retirement",
      "janmashtami",
      "sankranti",
      "farewell-party",
      "shop-opening",
      "onam",
      "lohri",
      "holi",
      "launch",
      "christmas",
      "reunion",
      "graduation",
      "gudi-padwa",
      "baisakhi",
      "bihu",
      "raksha-bandhan",
      "karva-chauth",
      "christening",
      "prayer-meet",
    ]);
  });

  it.each(CATEGORY_IDS)("%s matches the schema", (id) => {
    const result = categorySchema.safeParse(CATEGORIES[id]);
    expect(result.error?.issues ?? []).toEqual([]);
    expect(CATEGORIES[id].id).toBe(id);
  });

  it.each(CATEGORY_IDS)("%s is named in every launch language", (id) => {
    for (const locale of LOCALES) expect(CATEGORIES[id].names[locale].trim()).not.toBe("");
  });

  it("puts every design in at least one occasion, and some in many", () => {
    for (const templateId of Object.keys(TEMPLATES)) {
      const count = all.filter((category) =>
        (category.templates as string[]).includes(templateId),
      ).length;
      expect(count, templateId).toBeGreaterThanOrEqual(2);
    }
  });

  it("rejects a category whose card function isn't planned", () => {
    const broken = {
      ...CATEGORIES.roka,
      functions: { ...CATEGORIES.roka.functions, primary: "wedding" },
    };
    expect(categorySchema.safeParse(broken).success).toBe(false);
  });

  it("rejects wording too long for its slot", () => {
    const broken = { ...CATEGORIES.roka, wording: { doorLeft: "Far too long for a door" } };
    expect(categorySchema.safeParse(broken).success).toBe(false);
  });

  it("recognises its ids", () => {
    expect(isCategoryId("roka")).toBe(true);
    expect(isCategoryId("toString")).toBe(false);
    expect(isCategoryId(3)).toBe(false);
  });
});

describe("seasonal and regional ordering", () => {
  const order = (context: Parameters<typeof rankCategories>[1]) =>
    rankCategories(withFestivals, context).map((category) => category.id);

  it("puts Onam first in Kerala in August", () => {
    expect(order({ month: 8, region: "KL" })[0]).toBe("onam");
  });

  it("puts Durga Puja first in Bengal in October", () => {
    // Navratri is Durga Puja in Bengal, so the real occasion leads ahead of the sample one
    expect(order({ month: 10, region: "WB" }).slice(0, 2)).toEqual(["navratri", "durga-puja"]);
  });

  it("keeps regional festivals out of the lead elsewhere or out of season", () => {
    expect(order({ month: 10, region: "DL" })[0]).toBe("wedding");
    expect(order({ month: 3, region: "KL" })[0]).toBe("wedding");
  });

  it("brings the roka forward in Punjab before the wedding season", () => {
    const ids = rankCategories(all, { month: 8, region: "PB" }).map((category) => category.id);
    expect(ids[0]).toBe("roka");
    expect(ids.indexOf("roka")).toBeLessThan(ids.indexOf("engagement"));
  });

  it("uses the catalogue order when nothing is known, and is stable on ties", () => {
    expect(rankCategories(all, {}).map((category) => category.id)).toEqual(CATEGORY_IDS);
    expect(scoreCategory(CATEGORIES.haldi, {})).toBe(scoreCategory(CATEGORIES.mehendi, {}));
    const ids = rankCategories(all, { month: 11 }).map((category) => category.id);
    expect(ids.indexOf("haldi")).toBeLessThan(ids.indexOf("mehendi"));
  });

  it("puts wedding invites first in the season", () => {
    expect(rankCategories(all, { month: 11 })[0]?.id).toBe("wedding");
  });
});

describe("visitor context", () => {
  it("reads region codes with or without the country", () => {
    expect(parseRegion("KL")).toBe("KL");
    expect(parseRegion("in-wb")).toBe("WB");
    expect(parseRegion("CA")).toBeNull();
    expect(parseRegion("")).toBeNull();
    expect(parseRegion(null)).toBeNull();
  });

  it("reads months from 1 to 12 only", () => {
    expect(parseMonth("8")).toBe(8);
    expect(parseMonth("12")).toBe(12);
    expect(parseMonth("0")).toBeNull();
    expect(parseMonth("13")).toBeNull();
    expect(parseMonth("8.5")).toBeNull();
  });

  it("shows names in the local script, Hindi when unknown", () => {
    expect(regionLanguage("KL")).toBe("ml");
    expect(regionLanguage("TN")).toBe("ta");
    expect(regionLanguage("UP")).toBe("hi");
    expect(regionLanguage(null)).toBe("hi");
  });
});
