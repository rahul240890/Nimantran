import { describe, expect, it } from "vitest";
import { newDraft, type InviteDraft } from "@/lib/editor/draft";
import { CARD_STORY_WORDS } from "@/lib/templates/story-words";
import { cardFunctions, storyFunctions } from "./story";

/* The event pages speak only the card's language (Step 12g). */

function gujaratiWedding(): InviteDraft {
  const draft = newDraft();
  return {
    ...draft,
    tradition: { ...draft.tradition, id: "gujarati" },
    languages: ["gu", "en"],
    functions: {
      ...draft.functions,
      wedding: { ...draft.functions.wedding, included: true, date: "2026-12-12", time: "10:30" },
    },
  };
}

describe("pages in the card's language", () => {
  it("heads a Gujarati card's pages with Gujarati names and Gujarati dates", () => {
    const draft = gujaratiWedding();
    const [wedding] = cardFunctions(storyFunctions(draft, "en"), draft, "gu");
    expect(wedding).toMatchObject({ name: "હસ્તમેળાપ", localName: null });
    expect(wedding!.date).toContain("ડિસેમ્બર");
  });

  it("writes the English side in English letters only, whatever the site's language", () => {
    const draft = gujaratiWedding();
    const [wedding] = cardFunctions(storyFunctions(draft, "hi"), draft, "en");
    expect(wedding).toMatchObject({ name: "Hast Melap", localName: null });
    expect(wedding!.date).toBe("Saturday, 12 December 2026");
  });

  it("names a ceremony the tradition has no word for in the card's language", () => {
    const base = newDraft();
    const draft: InviteDraft = {
      ...base,
      tradition: { ...base.tradition, id: "tamil" },
      languages: ["ta"],
      functions: {
        ...base.functions,
        sangeet: { ...base.functions.sangeet, included: true, date: "2026-12-11" },
      },
    };
    const sangeet = cardFunctions(storyFunctions(draft, "en"), draft, "ta").find(
      (fn) => fn.kind === "sangeet",
    );
    expect(sangeet?.name).toBe("சங்கீத்");
  });

  it("has the pages' own words in every card language", () => {
    expect(CARD_STORY_WORDS.gu.saveTheDate).toBe("તારીખ યાદ રાખજો");
    for (const words of Object.values(CARD_STORY_WORDS)) {
      expect(Object.values(words).every((word) => word.trim().length > 0)).toBe(true);
    }
  });
});
