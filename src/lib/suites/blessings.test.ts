import { describe, expect, it } from "vitest";
import { guestText } from "@/i18n/copy/guest";
import { CARD_LANGUAGES } from "@/lib/templates/card-languages";
import { FLOWER_BLESSINGS, LAMP_BLESSINGS, blessings } from "./blessings";
import { SUITE_IDS } from "./catalog";
import { guestLook } from "./guest-look";

const themed = SUITE_IDS.filter((suite) => guestLook(suite));

describe("guest blessings", () => {
  it("gives every theme the same pair every time", () => {
    for (const suite of themed) expect(blessings(suite)).toEqual(blessings(suite));
  });

  it("uses every way of giving flowers and light", () => {
    const flowers = new Set(themed.map((suite) => blessings(suite).flowers));
    const lamps = new Set(themed.map((suite) => blessings(suite).lamp));
    expect(flowers.size).toBe(FLOWER_BLESSINGS.length);
    expect(lamps.size).toBe(LAMP_BLESSINGS.length);
  });

  it("never gives neighbouring themes the same flowers or the same light", () => {
    for (let i = 1; i < themed.length; i++) {
      const was = blessings(themed[i - 1]!);
      const now = blessings(themed[i]!);
      expect(now.flowers).not.toBe(was.flowers);
      expect(now.lamp).not.toBe(was.lamp);
    }
  });

  it("has words for every way in every card language", () => {
    for (const lang of CARD_LANGUAGES) {
      const words = guestText[lang].guestCopy.themed;
      for (const way of FLOWER_BLESSINGS) {
        expect(words.flowers[way].give.trim()).not.toBe("");
        expect(words.flowers[way].given.trim()).not.toBe("");
      }
      for (const way of LAMP_BLESSINGS) {
        expect(words.lights[way].give.trim()).not.toBe("");
        expect(words.lights[way].given.trim()).not.toBe("");
      }
    }
  });
});
