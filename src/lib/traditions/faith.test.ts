import { describe, expect, it } from "vitest";
import { FAITH_SYMBOLS, cardFaith, defaultFaith, faithChoosable } from "./faith";
import { SYMBOL_IDS } from "./schema";

describe("the family's faith", () => {
  it("comes from the occasion where it belongs to one", () => {
    expect(defaultFaith("eid", null)).toBe("muslim");
    expect(defaultFaith("christmas", null)).toBe("christian");
    expect(defaultFaith("baisakhi", null)).toBe("sikh");
    // And the host can't change it there
    expect(cardFaith("eid", null, "hindu")).toBe("muslim");
  });

  it("is Hindu for a religious occasion until the host chooses, none for a party", () => {
    expect(defaultFaith("wedding", null)).toBe("hindu");
    expect(defaultFaith("wedding", "modern")).toBe("none");
    expect(defaultFaith("birthday", null)).toBe("none");
    expect(defaultFaith("shop-opening", null)).toBe("hindu");
    expect(cardFaith("wedding", "gujarati", "jain")).toBe("jain");
  });

  it("is asked for where the wording depends on it", () => {
    expect(faithChoosable("wedding")).toBe(true);
    expect(faithChoosable("housewarming")).toBe(true);
    expect(faithChoosable("prayer-meet")).toBe(true);
    expect(faithChoosable("shop-opening")).toBe(true);
    expect(faithChoosable("birthday")).toBe(false);
    expect(faithChoosable("diwali")).toBe(false);
    expect(faithChoosable("christening")).toBe(false);
  });
});

describe("each faith's symbols", () => {
  it("cover every symbol, with no Hindu mark on another faith's card", () => {
    const offered = new Set(Object.values(FAITH_SYMBOLS).flat());
    for (const id of SYMBOL_IDS) expect(offered.has(id), id).toBe(true);
    for (const faith of ["sikh", "muslim", "christian"] as const) {
      for (const hindu of ["om", "swastik", "kalash", "shri"] as const) {
        expect(FAITH_SYMBOLS[faith]).not.toContain(hindu);
      }
    }
    expect(FAITH_SYMBOLS.none).toEqual([]);
  });
});
