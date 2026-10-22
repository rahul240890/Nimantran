import { describe, expect, it } from "vitest";
import { designById } from "@/lib/gallery/catalog";
import { NO_FILTERS, designCatalog } from "@/lib/gallery/filters";
import { BUILT_PRICING, draftDesignId } from "@/lib/plans/design-defaults";
import { newDraft, withCategory, withTradition } from "./draft";
import { occasionEntries, pickerDesigns, withDesign } from "./design-picker";

const all = designCatalog();
const ids = (draft: ReturnType<typeof newDraft>, filters = NO_FILTERS) =>
  pickerDesigns(all, draft, filters, () => "", BUILT_PRICING).map((entry) => entry.design.id);

describe("the editor's designs", () => {
  it("offers the occasion's designs, and the one the invite has", () => {
    const roka = withCategory(newDraft(), "roka");
    const offered = occasionEntries(all, roka);
    expect(offered.every((entry) => entry.occasions.includes("roka"))).toBe(true);
    expect(offered.map((entry) => entry.design.id)).not.toContain("card-kasavu");
    // A design picked for another occasion stays in the list
    const elsewhere = withDesign(roka, designById("card-kasavu")!);
    expect(occasionEntries(all, elsewhere).map((entry) => entry.design.id)).toContain(
      "card-kasavu",
    );
  });

  it("puts the chosen design first, then the tradition's own", () => {
    const chosen = withDesign(newDraft(), designById("kayal-scene")!);
    expect(ids(chosen)[0]).toBe("kayal-scene");
    const tamil = withTradition(newDraft(), "tamil");
    expect(ids(tamil)[0]).toBe(draftDesignId(tamil));
  });

  it("orders the 3D cards by the tradition, then the occasion", () => {
    const cards = { ...NO_FILTERS, format: "card" as const };
    expect(ids(withTradition(newDraft(), "tamil"), cards)[0]).toBe("card-gopuram");
    expect(ids(withTradition(newDraft(), "gujarati"), cards)[0]).toBe("card-bandhani");
    expect(ids(withCategory(newDraft(), "roka"), cards)[0]).toBe("card-marigold");
  });

  it("narrows by the Designs page's filters", () => {
    const wedding = newDraft();
    const scenes = pickerDesigns(
      all,
      wedding,
      { ...NO_FILTERS, format: "scene" },
      () => "",
      BUILT_PRICING,
    );
    expect(scenes.length).toBeGreaterThan(10);
    expect(scenes.every((entry) => entry.format === "scene")).toBe(true);
    const free = pickerDesigns(
      all,
      wedding,
      { ...NO_FILTERS, price: "free" },
      () => "",
      BUILT_PRICING,
    );
    expect(free.every((entry) => BUILT_PRICING.tiers[entry.design.id] === "free")).toBe(true);
    expect(ids(wedding).length).toBeGreaterThan(scenes.length);
  });
});

describe("another design", () => {
  it("changes only the design, keeping every name, date, photo and word", () => {
    const filled = {
      ...newDraft(),
      content: { first: "Aarav", second: "Meera", blessing: "Shri Ganeshaya Namah" },
      pages: {
        layout: {},
        words: { en: { cover: [{ text: "Our day", style: "body" as const }] } },
      },
    };
    const scene = withDesign(filled, designById("kayal-scene")!);
    expect(scene).toMatchObject({ suite: "kayal", format: "scene" });
    expect(draftDesignId(scene)).toBe("kayal-scene");
    const card = withDesign(scene, designById("card-bandhani")!);
    expect(card).toMatchObject({ suite: "classic", templateId: "bandhani", format: "story" });
    for (const next of [scene, card]) {
      expect(next.content).toEqual(filled.content);
      expect(next.functions).toEqual(filled.functions);
      expect(next.photos).toEqual(filled.photos);
      expect(next.pages).toEqual(filled.pages);
      expect(next.family).toEqual(filled.family);
    }
  });
});
