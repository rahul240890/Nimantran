import { describe, expect, it } from "vitest";
import { CARD_LANGUAGES } from "@/lib/templates/card-languages";
import type { CardCopy } from "@/lib/templates/content";
import { CARD_STORY_WORDS } from "@/lib/templates/story-words";
import {
  CARD_NOTE_WORDS,
  NOTE_MAX,
  cardBeat,
  cardSceneItem,
  defaultNote,
  isCardKind,
  signedNames,
} from "./words";

const copy: CardCopy = {
  doors: ["", ""],
  blessing: "Shri Ganeshaya Namah",
  families: "",
  first: "Aarav",
  joiner: "weds",
  second: "Meera",
  line: "request the pleasure of your company",
  date: "Saturday, 14 February 2027",
  venue: "Leela Palace, Udaipur",
  symbol: "om",
};
const story = CARD_STORY_WORDS.en;
const words = CARD_NOTE_WORDS.en;

describe("save-the-date and thank-you cards", () => {
  it("have their words in every card language, short enough to fit a note", () => {
    for (const language of CARD_LANGUAGES) {
      const set = CARD_NOTE_WORDS[language];
      for (const word of Object.values(set)) {
        expect(word.trim().length).toBeGreaterThan(0);
        expect(word.length).toBeLessThanOrEqual(NOTE_MAX);
      }
    }
    expect(defaultNote("save-the-date", words)).toBe("Invitation to follow");
    expect(isCardKind("thank-you")).toBe(true);
    expect(isCardKind("birthday")).toBe(false);
  });

  it("set the save the date as the cover: the day, the place and the note under the names", () => {
    const beat = cardBeat("save-the-date", copy, story, words, "Invitation to follow");
    expect(beat.scene).toBe("cover");
    expect(beat.symbol).toBe(true);
    expect(beat.lines.map((line) => [line.style, line.text])).toEqual([
      ["label", "Save the date"],
      ["display", "Aarav"],
      ["joiner", "weds"],
      ["display", "Meera"],
      ["date", "Saturday, 14 February 2027"],
      ["venue", "Leela Palace, Udaipur"],
      ["small", "Invitation to follow"],
    ]);
    // The invitation's own line and blessing wait for the invitation
    expect(beat.lines.some((line) => line.text === copy.line)).toBe(false);
  });

  it("set the thank-you on the closing page, signed with the names", () => {
    const beat = cardBeat("thank-you", copy, story, words, "  For coming all the way  ");
    expect(beat.scene).toBe("reply");
    expect(beat.lines.map((line) => [line.style, line.text])).toEqual([
      ["display", "Thank you"],
      ["body", "For coming all the way"],
      // "weds" belongs on the invitation; afterwards the couple sign with "and"
      ["script", "Aarav and Meera"],
    ]);
    expect(signedNames({ ...copy, joiner: "&" }, story)).toBe("Aarav & Meera");
  });

  it("leave out an empty note, and a second name a birthday doesn't have", () => {
    const birthday = { ...copy, second: "", joiner: "" };
    const beat = cardBeat("save-the-date", birthday, story, words, " ");
    expect(beat.lines.map((line) => line.style)).toEqual(["label", "display", "date", "venue"]);
    expect(signedNames(birthday, story)).toBe("Aarav");
    expect(signedNames({ ...copy, joiner: "संग" }, CARD_STORY_WORDS.hi)).toBe(
      `Aarav ${CARD_STORY_WORDS.hi.and} Meera`,
    );
  });

  it("fly in on a Scene design as a celebration's card, or as its opening card", () => {
    const date = cardSceneItem("save-the-date", copy, story, words, "To follow", "wedding");
    expect(date).toEqual({
      kind: "function",
      fn: {
        kind: "wedding",
        name: "Save the date",
        localName: null,
        date: copy.date,
        time: "To follow",
        muhurat: null,
        venue: copy.venue,
      },
    });
    expect(cardSceneItem("thank-you", copy, story, words, "With love", "wedding")).toEqual({
      kind: "line",
      blessing: "Thank you",
      text: "With love",
    });
  });
});
