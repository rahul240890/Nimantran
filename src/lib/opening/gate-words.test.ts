import { describe, expect, it } from "vitest";
import { CATEGORY_IDS } from "@/lib/categories/catalog";
import { CARD_LANGUAGES } from "@/lib/templates/card-languages";
import { FAITHS } from "@/lib/traditions/faith";
import { PAINTED_GATES, TIED_GATES, type OpeningStyle } from "./catalog";
import { GATE_WORD_LOOKS, gateScatter, gateWordLook, gateWords } from "./gate-words";

describe("gateWords", () => {
  it("says Shubh Vivah for a Hindu wedding, in the card's language", () => {
    expect(gateWords("wedding", "hindu", "en")).toBe("Shubh Vivah");
    expect(gateWords("wedding", "hindu", "hi")).toBe("शुभ विवाह");
    expect(gateWords("wedding", "jain", "gu")).toBe("શુભ લગ્ન");
  });

  it("follows the family's faith for a wedding", () => {
    expect(gateWords("wedding", "sikh", "en")).toBe("Anand Karaj");
    expect(gateWords("wedding", "muslim", "hi")).toBe("शादी मुबारक");
    expect(gateWords("wedding", "christian", "en")).toBe("Holy Matrimony");
  });

  it("has words for every occasion, faith and language", () => {
    for (const category of CATEGORY_IDS)
      for (const faith of FAITHS)
        for (const lang of CARD_LANGUAGES) {
          expect(
            gateWords(category, faith, lang).trim().length,
            `${category} ${lang}`,
          ).toBeGreaterThan(1);
        }
  });
});

describe("gateWordLook", () => {
  it("gives every painted and tied gate a look, and nothing else", () => {
    const gates = [...Object.keys(PAINTED_GATES), ...Object.keys(TIED_GATES)] as OpeningStyle[];
    const seen = new Set(gates.map((gate) => gateWordLook(gate, "flowers")));
    expect([...seen].sort()).toEqual([...GATE_WORD_LOOKS].sort());
    expect(gateWordLook("envelope", "flowers")).toBeNull();
  });

  it("keeps a prayer meeting quiet, and a party in confetti", () => {
    expect(gateScatter("prayer-meet")).toBe("quiet");
    expect(gateScatter("birthday")).toBe("confetti");
    expect(gateScatter("wedding")).toBe("flowers");
    expect(gateWordLook("rajwada-pol", "quiet")).toBe("petal-rain");
  });
});
