import { describe, expect, it } from "vitest";
import { familySplit, keepPeople, storyBeats } from "@/lib/engine/story";
import { CARD_STORY_WORDS } from "@/lib/templates/story-words";
import { TRADITIONS } from "@/lib/traditions/catalog";
import { familyBlocks, noFamily, type DraftFamily } from "./family";

const family: DraftFamily = {
  first: { relation: "son", parents: "Smt. Sunita & Shri Ramesh Patel", town: "Ahmedabad" },
  second: { relation: "daughter", parents: "Smt. Asha & Shri Vijay Shah", town: "" },
  memory: "Late Shri Mohanlal Patel",
  contacts: [
    { name: "Ramesh", phone: "98765 43210" },
    { name: "", phone: "" },
  ],
};

describe("the family page", () => {
  it("names each side's parents under the name, in the page's language", () => {
    const blocks = familyBlocks({
      family,
      wording: { blessingsFrom: "Smt. Kamla & Shri Ramprasad" },
      names: ["Aarav", "Diya"],
      pack: null,
      language: "en",
    });
    expect(blocks.map((b) => b.id)).toEqual([
      "blessingsFrom",
      "first",
      "second",
      "memory",
      "contacts",
    ]);
    expect(blocks[1]).toMatchObject({
      title: "Aarav",
      text: "Son of Smt. Sunita & Shri Ramesh Patel, Ahmedabad",
    });
    expect(blocks[2]!.text).toBe("Daughter of Smt. Asha & Shri Vijay Shah");
    // An empty contact row prints nothing
    expect(blocks[4]!.text).toBe("Ramesh · 98765 43210");
  });

  it("uses the tradition's own headings on a card in its language, and its order of words", () => {
    const gujarati = familyBlocks({
      family: noFamily,
      wording: { children: "મારા મામાના લગ્નમાં જરૂર આવજો" },
      names: ["રાધા", "અર્જુન"],
      pack: TRADITIONS.gujarati,
      language: "gu",
    });
    expect(gujarati).toEqual([
      { id: "children", title: "ટહુકો", text: "મારા મામાના લગ્નમાં જરૂર આવજો", lang: "gu" },
    ]);
    const tamil = familyBlocks({
      family,
      wording: {},
      names: ["அர்ஜுன்", ""],
      pack: TRADITIONS.tamil,
      language: "ta",
    });
    // Tamil puts "son of" after the parents; a card with one name has one side
    expect(tamil.find((b) => b.id === "first")!.text).toMatch(/அவர்களின் அன்பு மகன்$/);
    expect(tamil.some((b) => b.id === "second")).toBe(false);
  });

  it("spills more than three blocks onto a second family page", () => {
    const blocks = familyBlocks({
      family,
      wording: {},
      names: ["Aarav", "Diya"],
      pack: null,
      language: "en",
    });
    const beats = storyBeats({
      copy: {
        doors: ["", ""],
        blessing: "",
        families: "",
        first: "Aarav",
        joiner: "&",
        second: "Diya",
        line: "invite you to their wedding",
        date: "",
        venue: "",
      },
      functions: [],
      replies: true,
      words: CARD_STORY_WORDS.en,
      family: blocks,
    });
    expect(beats.map((b) => b.id)).toEqual(["cover", "family", "family-more", "invite", "reply"]);
  });

  it("sets the parents apart from the words round them", () => {
    const english = familyBlocks({
      family,
      wording: {},
      names: ["Aarav", "Diya"],
      pack: null,
      language: "en",
    });
    expect(english[0]!.parts).toEqual({
      lead: "Son of",
      names: "Smt. Sunita & Shri Ramesh Patel",
      tail: "",
      place: "Ahmedabad",
    });
    // Bengali joins its words to the last name, so they stay with the names
    const bengali = familyBlocks({
      family,
      wording: {},
      names: ["Aarav", "Diya"],
      pack: null,
      language: "bn",
    });
    expect(bengali[0]!.parts).toMatchObject({ lead: "", tail: "" });
    expect(bengali[0]!.parts!.names).toMatch(/^Smt\. Sunita & Shri Ramesh Patel-এর/);
    expect(bengali[0]!.text).toBe("Smt. Sunita & Shri Ramesh Patel, Ahmedabad-এর পুত্র");
  });

  it("prints a side's parents on their own line on the page", () => {
    const blocks = familyBlocks({
      family,
      wording: {},
      names: ["Aarav", "Diya"],
      pack: null,
      language: "en",
    });
    const [, page] = storyBeats({
      copy: {
        doors: ["", ""],
        blessing: "",
        families: "",
        first: "Aarav",
        joiner: "&",
        second: "Diya",
        line: "",
        date: "",
        venue: "",
      },
      functions: [],
      replies: true,
      words: CARD_STORY_WORDS.en,
      family: blocks.slice(0, 1),
    });
    expect(page!.lines).toEqual([
      { text: "Aarav", style: "label", lang: "en" },
      { text: "Son of", style: "small", lang: "en" },
      // Each parent stays whole on a line; the page breaks between them
      { text: "Smt.\u00a0Sunita &\u00a0Shri\u00a0Ramesh\u00a0Patel", style: "body", lang: "en" },
      { text: "Ahmedabad", style: "small", lang: "en" },
    ]);
  });

  it("splits a long family where the two pages hold the most even share", () => {
    expect(familySplit([2, 4])).toBe(2);
    expect(familySplit([2, 4, 4, 2, 2])).toBe(2);
    expect(familySplit([4, 4, 2])).toBe(1);
  });

  it("keeps both sides' parents on one page, with the hosts after them", () => {
    // Blessings, the son's side, the daughter's side, the hosts
    const sides = [false, true, true, false];
    expect(familySplit([2, 4, 4, 2], sides)).toBe(3);
    // Long blessings go on their own page, and the sides still read together
    expect(familySplit([5, 4, 4, 2], sides)).toBe(1);
    // Both sides alone stay on one page however long
    expect(familySplit([5, 5], [true, true])).toBe(2);
  });

  it("keeps each parent's name whole, breaking before the &", () => {
    expect(keepPeople("Smt. Asha & Shri Vijay Shah")).toBe(
      "Smt.\u00a0Asha &\u00a0Shri\u00a0Vijay\u00a0Shah",
    );
    // A very long name keeps only its title with the first word
    expect(keepPeople("Smt. Asha & Shri Rajendra Prasad Venkataraman Sharma")).toBe(
      "Smt.\u00a0Asha &\u00a0Shri\u00a0Rajendra Prasad Venkataraman Sharma",
    );
  });
});
