import { describe, expect, it } from "vitest";
import { CATEGORY_IDS } from "@/lib/categories/catalog";
import { FUNCTION_IDS } from "@/lib/events/functions";
import { CARD_FUNCTION_NAMES } from "./card-function-names";
import { CARD_LANGUAGES } from "./card-languages";
import { FAITHS } from "@/lib/traditions/faith";
import { WORDING_IDS, WORDING_MAX } from "@/lib/traditions/schema";
import { cardSuggestions, doorIdeas, SUGGESTED_SLOTS, wordingIdeas } from "./card-suggestions";
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

describe("wording for each faith", () => {
  // The Hindu invocations and gods, in every card script
  const HINDU = /Ganesh|Prajapat|गणेश|ગણેશ|গণেশ|প্রজাপত|பிள்ளையார்|விநாயக|सिवमयम|சிவமயம்|शुभ लाभ/;

  it("offers several fitting lines for every faith, occasion, language and line", () => {
    for (const faith of FAITHS) {
      for (const category of CATEGORY_IDS) {
        for (const language of CARD_LANGUAGES) {
          for (const slot of SUGGESTED_SLOTS) {
            const ideas = cardSuggestions(category, language, slot, faith);
            const label = `${faith} ${category} ${language} ${slot}`;
            expect(ideas.length, label).toBeGreaterThanOrEqual(2);
            expect(new Set(ideas).size, label).toBe(ideas.length);
            for (const idea of ideas) {
              expect(idea.length, idea).toBeLessThanOrEqual(SLOT_RULES[slot].maxLength);
            }
          }
        }
      }
    }
  });

  it("never offers a Hindu blessing to a Sikh, Muslim, Christian, Jain or non-religious card", () => {
    for (const faith of FAITHS.filter((id) => id !== "hindu")) {
      for (const category of [
        "wedding",
        "housewarming",
        "naming-ceremony",
        "prayer-meet",
      ] as const) {
        for (const language of CARD_LANGUAGES) {
          for (const idea of cardSuggestions(category, language, "blessing", faith)) {
            expect(idea, `${faith} ${category} ${language}`).not.toMatch(HINDU);
          }
        }
      }
    }
  });

  it("leads each faith's wedding with its own invocation", () => {
    expect(cardSuggestions("wedding", "hi", "blessing", "hindu")[0]).toBe("॥ श्री गणेशाय नमः ॥");
    expect(cardSuggestions("wedding", "hi", "blessing", "sikh")[0]).toBe("ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ");
    expect(cardSuggestions("wedding", "en", "blessing", "muslim")[0]).toBe(
      "Bismillah ir-Rahman ir-Rahim",
    );
    expect(cardSuggestions("wedding", "gu", "blessing", "jain")[0]).toBe("॥ ણમો અરિહંતાણં ॥");
    expect(cardSuggestions("wedding", "en", "line", "christian")).toContain(
      "request the honour of your presence at their Holy Matrimony",
    );
    expect(cardSuggestions("wedding", "ta", "blessing", "hindu")).toContain("உ");
  });

  it("greets a festival in its own words, and keeps Christmas Christian", () => {
    expect(cardSuggestions("janmashtami", "hi", "blessing")[0]).toBe("जय श्री कृष्ण");
    expect(cardSuggestions("navratri", "gu", "blessing")[0]).toBe("જય માતાજી");
    for (const language of CARD_LANGUAGES) {
      for (const idea of cardSuggestions("christmas", language, "blessing")) {
        expect(idea).not.toMatch(HINDU);
      }
    }
  });

  it("suggests the family's blocks and a wedding's gate words that fit", () => {
    for (const language of CARD_LANGUAGES) {
      for (const id of WORDING_IDS) {
        const ideas = wordingIdeas("wedding", language, id);
        expect(ideas.length, `${language} ${id}`).toBeGreaterThanOrEqual(2);
        for (const idea of ideas) expect(idea.length).toBeLessThanOrEqual(WORDING_MAX);
      }
      for (const faith of FAITHS) {
        const pairs = doorIdeas("wedding", language, faith);
        expect(pairs.length, `${faith} ${language}`).toBeGreaterThanOrEqual(1);
        for (const [left, right] of pairs) {
          expect(left.length).toBeLessThanOrEqual(SLOT_RULES.doorLeft.maxLength);
          expect(right.length).toBeLessThanOrEqual(SLOT_RULES.doorRight.maxLength);
        }
      }
    }
    // A birthday has no children's wedding line and no gates
    expect(wordingIdeas("birthday", "hi", "children")).toEqual([]);
    expect(doorIdeas("birthday", "hi", "hindu")).toEqual([]);
  });
});

describe("function names in each card language", () => {
  it("name every function", () => {
    for (const names of Object.values(CARD_FUNCTION_NAMES)) {
      for (const id of FUNCTION_IDS) expect(names[id]?.trim(), id).toBeTruthy();
    }
  });
});
