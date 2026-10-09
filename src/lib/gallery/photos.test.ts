import { describe, expect, it } from "vitest";
import { allDesigns, cardDesign, occasionDesigns, paintedDesign, sceneDesign } from "./catalog";
import { designPhotos, mixDesigns } from "./photos";

describe("design photos", () => {
  it("says what photos each kind of design takes", () => {
    expect(designPhotos(sceneDesign("mor-kamal"))).toBe("none");
    expect(designPhotos(sceneDesign("gulmohar"))).toBe("two");
    expect(designPhotos(sceneDesign("udaipur-lake"))).toBe("couple");
    expect(designPhotos(sceneDesign("kayal"))).toBe("either");
    expect(designPhotos(paintedDesign("rajwada-bagh"))).toBe("either");
    expect(designPhotos(cardDesign("marigold"))).toBe("optional");
  });

  it("asks one guest of honour for one photo, unless the painting has two frames", () => {
    expect(designPhotos(sceneDesign("kayal"), "birthday")).toBe("one");
    expect(designPhotos(sceneDesign("gulmohar"), "birthday")).toBe("two");
  });
});

describe("mixed gallery order", () => {
  it("keeps every design once, in the same order each time", () => {
    const designs = allDesigns();
    expect(new Set(designs.map((design) => design.id)).size).toBe(designs.length);
    expect(allDesigns().map((design) => design.id)).toEqual(designs.map((design) => design.id));
  });

  it("spreads each kind through the list instead of one long run", () => {
    const needs = occasionDesigns("wedding")
      .slice(0, 12)
      .map((design) => designPhotos(design));
    expect(new Set(needs).size).toBeGreaterThanOrEqual(3);
    // No-photo cards are the biggest group, yet never fill the first page
    expect(needs.filter((need) => need === "none").length).toBeLessThan(needs.length);
  });

  it("keeps each kind's own order", () => {
    const designs = [
      sceneDesign("mor-kamal"),
      sceneDesign("chibi-jodi"),
      sceneDesign("gulmohar"),
      cardDesign("marigold"),
    ];
    const ids = mixDesigns(designs).map((design) => design.id);
    expect(ids.indexOf("mor-kamal-scene")).toBeLessThan(ids.indexOf("chibi-jodi-scene"));
    expect(ids).toHaveLength(4);
  });
});
