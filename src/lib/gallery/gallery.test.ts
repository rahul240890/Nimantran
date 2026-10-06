import { describe, expect, it } from "vitest";
import { searchWords } from "@/components/gallery/design-words";
import { CATEGORIES, CATEGORY_IDS } from "@/lib/categories/catalog";
import { newDraft, withGalleryChoice } from "@/lib/editor/draft";
import { SUITES, suiteFor, suiteSuits, weddingFit } from "@/lib/suites/catalog";
import {
  OCCASIONS,
  WEDDING_KINDS,
  designHref,
  kindDesigns,
  occasionDesigns,
  paintedDesign,
  sceneDesign,
  suiteOccasion,
} from "./catalog";
import { normalize, searchGallery } from "./search";

describe("gallery catalog", () => {
  it("lists every ready occasion once, each with a painting", () => {
    const live = OCCASIONS.filter((occasion) => occasion.category);
    expect(live.map((occasion) => occasion.category).sort()).toEqual([...CATEGORY_IDS].sort());
    for (const occasion of live) {
      expect(SUITES[occasion.art!.suite].images[occasion.art!.page]).toBeTruthy();
    }
    expect(new Set(OCCASIONS.map((occasion) => occasion.id)).size).toBe(OCCASIONS.length);
  });

  it("gives each wedding kind only its own designs", () => {
    expect(kindDesigns("gujarati").map((design) => design.id)).toEqual([
      "kutch-bhunga-scene",
      "white-rann-scene",
      "mameru-bandhani-scene",
      "sindhi-ajrak-scene",
      "kutch-toran",
      "shahi-savari",
      "pichwai",
      "card-bandhani",
    ]);
    // The kind's painted theme opens with the kind's own card
    expect(kindDesigns("gujarati")[0]!.template).toBe("bandhani");
    for (const kind of WEDDING_KINDS) expect(kindDesigns(kind).length).toBeGreaterThan(0);
  });

  it("offers every painted theme for a ready occasion", () => {
    const ids = occasionDesigns("haldi").map((design) => design.id);
    expect(ids).toContain("kayal");
    expect(ids).toContain("card-marigold");
  });

  it("shows each occasion only the designs made for it", () => {
    for (const category of CATEGORY_IDS) {
      const wedding = CATEGORIES[category].group === "wedding-journey";
      for (const design of occasionDesigns(category)) {
        if (design.suite === "classic") {
          expect(CATEGORIES[category].templates).toContain(design.template);
          continue;
        }
        expect(suiteSuits(design.suite, category), `${design.id} for ${category}`).toBe(true);
        // A wedding's theme never shows for a party, a puja or a festival
        if (!wedding) expect(weddingFit(design.suite), `${design.id} for ${category}`).toEqual([]);
      }
      // Every occasion has at least one painted design of its own
      expect(occasionDesigns(category).some((design) => design.suite !== "classic")).toBe(true);
    }
    for (const kind of WEDDING_KINDS) {
      for (const design of kindDesigns(kind)) {
        if (design.suite !== "classic") expect(suiteSuits(design.suite, "wedding")).toBe(true);
      }
    }
  });

  it("keeps function themes to their own step of the wedding journey", () => {
    const ids = (category: Parameters<typeof occasionDesigns>[0]) =>
      occasionDesigns(category).map((design) => design.id);
    expect(ids("save-the-date")).toContain("love-letter-scene");
    expect(ids("wedding")).not.toContain("love-letter-scene");
    expect(ids("roka")).toContain("roka-shagun-scene");
    expect(ids("haldi")).not.toContain("roka-shagun-scene");
    expect(ids("haldi")).not.toContain("baraat-band-scene");
    expect(ids("haldi")).not.toContain("chapel");
    expect(ids("reception")).toContain("chapel");
    expect(ids("roka")).not.toContain("noor-bagh");
    expect(ids("mehendi")).toContain("noor-bagh");
    expect(suiteOccasion("love-letter")).toBe("save-the-date");
  });

  it("sends Use this design to the editor with everything chosen", () => {
    expect(designHref(paintedDesign("rajbari"), { category: "wedding", kind: "bengali" })).toBe(
      "/create?category=wedding&tradition=bengali&suite=rajbari&template=alpona",
    );
  });

  it("lists a theme's Scene first, and opens the editor on it", () => {
    const ids = occasionDesigns("haldi").map((design) => design.id);
    expect(ids.indexOf("kayal-scene")).toBeGreaterThanOrEqual(0);
    expect(ids.indexOf("kayal-scene")).toBeLessThan(ids.indexOf("kayal"));
    expect(new Set(ids).size).toBe(ids.length);
    expect(designHref(sceneDesign("kayal"), { category: "wedding" })).toContain("format=scene");
  });

  it("lists the Scene themes painted for an occasion there, and not for weddings", () => {
    const birthday = occasionDesigns("birthday").map((design) => design.id);
    expect(birthday).toContain("space-voyage-scene");
    expect(birthday).toContain("pool-party-scene");
    expect(occasionDesigns("party").map((design) => design.id)).toContain("pool-party-scene");
    expect(occasionDesigns("anniversary").map((design) => design.id)).toContain(
      "golden-jubilee-scene",
    );
    expect(occasionDesigns("baby-shower").map((design) => design.id)).toContain("oh-baby-scene");
    expect(occasionDesigns("wedding").map((design) => design.id)).not.toContain(
      "space-voyage-scene",
    );
    // It opens the editor on its occasion, while a new birthday still starts on Gubbara
    expect(suiteOccasion("space-voyage")).toBe("birthday");
    expect(
      suiteFor({ suite: null, tradition: null, templateId: "rose", category: "birthday" }),
    ).toBe("gubbara");
  });
});

describe("gallery search", () => {
  const words = searchWords();

  it("needs every word to match", () => {
    const hits = searchGallery("gujarati wedding", words);
    expect(hits[0]).toEqual({ type: "kind", id: "gujarati" });
    expect(hits.some((hit) => hit.type === "occasion" && hit.id === "wedding")).toBe(false);
  });

  it("finds occasions by the words families use, in any script", () => {
    expect(searchGallery("sagai", words)[0]).toEqual({ type: "occasion", id: "engagement" });
    expect(searchGallery("गृह प्रवेश", words)[0]).toEqual({
      type: "occasion",
      id: "housewarming",
    });
    expect(searchGallery("  ", words)).toEqual([]);
  });

  it("finds designs by the kind of wedding they suit", () => {
    const designs = searchGallery("bengali", words).flatMap((hit) =>
      hit.type === "design" ? [hit.design.id] : [],
    );
    expect(designs).toEqual(expect.arrayContaining(["rajbari", "card-alpona"]));
  });

  it("ignores case, accents and punctuation", () => {
    expect(normalize("  Mehndi, Haldí! ")).toBe("mehndi haldi");
  });
});

describe("a design chosen in the gallery", () => {
  it("sets the occasion, tradition, theme and card, in the tradition's language", () => {
    const draft = {
      ...newDraft(),
      content: { first: "Aarav" },
    };
    const next = withGalleryChoice(draft, {
      category: "wedding",
      tradition: "gujarati",
      suite: "shahi-savari",
      template: "bandhani",
    });
    // The card's language is asked next, set to the tradition's own
    expect(next).toMatchObject({
      step: "language",
      suite: "shahi-savari",
      templateId: "bandhani",
      languages: ["gu"],
      content: { first: "Aarav" },
    });
    expect(next.tradition.id).toBe("gujarati");
  });

  it("keeps the chosen languages for another design of the same tradition", () => {
    const first = withGalleryChoice(newDraft(), {
      category: "wedding",
      tradition: "gujarati",
      suite: "shahi-savari",
      template: "bandhani",
    });
    const chosen = { ...first, languages: ["hi" as const, "gu" as const], updatedAt: 1 };
    const next = withGalleryChoice(chosen, {
      category: "wedding",
      tradition: "gujarati",
      suite: "kutch-toran",
      template: "bandhani",
    });
    expect(next.languages).toEqual(["hi", "gu"]);
    const other = withGalleryChoice(chosen, {
      category: "wedding",
      tradition: "bengali",
      suite: "rajbari",
      template: null,
    });
    expect(other.languages).toEqual(["bn"]);
  });

  it("clears the tradition for a kind without a pack", () => {
    const start = withGalleryChoice(newDraft(), {
      category: "wedding",
      tradition: "north-hindu",
      suite: "rajwada-bagh",
      template: null,
    });
    const next = withGalleryChoice(start, {
      category: "wedding",
      tradition: null,
      suite: "noor-bagh",
      template: "emerald",
    });
    expect(next.tradition.id).toBeNull();
    expect(next.languages).toEqual(["en"]);
  });
});
