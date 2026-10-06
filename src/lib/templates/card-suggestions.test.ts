import { describe, expect, it } from "vitest";
import { CATEGORY_IDS } from "@/lib/categories/catalog";
import { FUNCTION_IDS } from "@/lib/events/functions";
import { CARD_FUNCTION_NAMES } from "./card-function-names";
import { CARD_LANGUAGES } from "./card-languages";
import { cardSuggestions, SUGGESTED_SLOTS } from "./card-suggestions";
import { SLOT_RULES } from "./ids";

describe("wording ideas", () => {
  it("offer several lines for every occasion and language, each fitting its slot", () => {
    for (const category of CATEGORY_IDS) {
      for (const language of CARD_LANGUAGES) {
        for (const slot of SUGGESTED_SLOTS) {
          const ideas = cardSuggestions(category, language, slot);
          expect(ideas.length, `${category} ${language} ${slot}`).toBeGreaterThanOrEqual(2);
          expect(new Set(ideas).size).toBe(ideas.length);
          for (const idea of ideas) {
            expect(idea.length, idea).toBeLessThanOrEqual(SLOT_RULES[slot].maxLength);
          }
        }
      }
    }
  });

  it("are in the card's own language", () => {
    expect(cardSuggestions("wedding", "gu", "blessing")[0]).toMatch(/[઀-૿]/);
    expect(cardSuggestions("birthday", "ta", "line").every((line) => /[஀-௿]/.test(line))).toBe(
      true,
    );
    // An English card leads with the occasion's own sample
    expect(cardSuggestions("birthday", "en", "blessing")[0]).toBe("Happy birthday");
  });
});

describe("function names in each card language", () => {
  it("name every function", () => {
    for (const names of Object.values(CARD_FUNCTION_NAMES)) {
      for (const id of FUNCTION_IDS) expect(names[id]?.trim(), id).toBeTruthy();
    }
  });
});
