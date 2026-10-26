import { describe, expect, it } from "vitest";
import { blessings } from "./blessings";
import { SUITE_IDS, SUITES } from "./catalog";
import { EVENT_BOXES, eventBox } from "./event-boxes";
import { guestLook } from "./guest-look";
import { DEFAULT_ORDER, FAMILIES, REQUIRED_SECTIONS, guestRecipe, recipeSchema } from "./recipe";
import { sectionLayouts } from "./section-layouts";

/** Every theme with a themed guest page, and its look. */
const THEMED = SUITE_IDS.flatMap((suite) => {
  const look = guestLook(suite);
  return look ? [{ suite, look }] : [];
});

describe("each theme's guest page recipe", () => {
  it("is valid wherever a theme writes one", () => {
    for (const suite of SUITE_IDS) {
      const recipe = SUITES[suite].recipe;
      if (recipe) expect(recipeSchema.safeParse(recipe).success, suite).toBe(true);
    }
  });

  it("keeps the page every theme showed before recipes, until the theme writes its own", () => {
    for (const { suite, look } of THEMED) {
      if (SUITES[suite].recipe) continue;
      const recipe = guestRecipe(suite, look);
      const dealt = blessings(suite);
      expect(recipe.sections, suite).toEqual(DEFAULT_ORDER);
      expect(recipe.layouts, suite).toEqual(sectionLayouts(suite));
      expect(recipe.box, suite).toBe(eventBox(suite, look.style));
      expect(recipe.flowers, suite).toBe(dealt.flowers);
      expect(recipe.lamp, suite).toBe(dealt.lamp);
    }
  });

  it("always has the welcome, the celebrations and the reply, the reply last", () => {
    for (const { suite, look } of THEMED) {
      const { sections } = guestRecipe(suite, look);
      for (const section of REQUIRED_SECTIONS) expect(sections, suite).toContain(section);
      expect(sections.at(-1), suite).toBe("night");
    }
  });

  it("hangs every theme's celebrations in a box of its own page style", () => {
    for (const { suite, look } of THEMED) {
      const ownBoxes: readonly string[] = EVENT_BOXES[look.style];
      expect(ownBoxes, suite).toContain(guestRecipe(suite, look).box);
    }
  });

  it("puts the themes in every family but the 3D card, whose page is still the plain one", () => {
    const families = new Set(THEMED.map(({ suite, look }) => guestRecipe(suite, look).family));
    for (const family of FAMILIES.filter((family) => family !== "card"))
      expect(families, family).toContain(family);
  });

  it("refuses a recipe that leaves out the reply or lists a section twice", () => {
    expect(recipeSchema.safeParse({ sections: ["welcome", "events"] }).success).toBe(false);
    expect(
      recipeSchema.safeParse({ sections: ["welcome", "events", "events", "night"] }).success,
    ).toBe(false);
    expect(recipeSchema.safeParse({ sections: ["night", "welcome", "events"] }).success).toBe(
      false,
    );
    expect(
      recipeSchema.safeParse({ family: "floral", sections: ["welcome", "events", "night"] })
        .success,
    ).toBe(true);
  });
});
