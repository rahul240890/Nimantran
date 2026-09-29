import { describe, expect, it } from "vitest";
import { storyBeats } from "@/lib/engine/story";
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
});
