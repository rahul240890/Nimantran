import { describe, expect, it } from "vitest";
import { storyBeats } from "@/lib/engine/story";
import { CARD_STORY_WORDS } from "@/lib/templates/story-words";
import { applyPages, editableLines, noPages, type DraftPages } from "./pages";

const beats = storyBeats({
  copy: {
    doors: ["", ""],
    blessing: "Shri Ganeshay Namah",
    families: "The Patel family",
    first: "Radha",
    joiner: "&",
    second: "Arjun",
    line: "invite you to their wedding",
    date: "",
    venue: "Ahmedabad",
  },
  functions: [],
  replies: true,
  words: CARD_STORY_WORDS.en,
});

describe("the host's own pages", () => {
  it("leaves the written pages alone when nothing was changed", () => {
    expect(applyPages(beats, noPages, "en")).toEqual(beats);
  });

  it("uses the host's lines, placement and box, in the language they were written for", () => {
    const pages: DraftPages = {
      layout: { cover: { hidden: false, place: "top", align: "start", box: "on" } },
      words: {
        en: {
          cover: [
            { text: "Radha weds Arjun", style: "display" },
            { text: "  ", style: "body" },
          ],
        },
      },
    };
    const cover = applyPages(beats, pages, "en")[0]!;
    // Empty lines print nothing
    expect(cover.lines).toEqual([{ text: "Radha weds Arjun", style: "display" }]);
    expect(cover.layout).toEqual({ place: "top", align: "start", box: true });
    // The Hindi side keeps its written words
    expect(applyPages(beats, pages, "hi")[0]!.lines).toEqual(beats[0]!.lines);
  });

  it("leaves out hidden pages, but never the cover or the reply", () => {
    const hide = { hidden: true, place: "middle", align: "center", box: "theme" } as const;
    const pages: DraftPages = { layout: { family: hide, cover: hide, reply: hide }, words: {} };
    expect(applyPages(beats, pages, "en").map((b) => b.id)).toEqual(["cover", "reply"]);
  });

  it("turns the joiner into a line kind the host can pick", () => {
    expect(editableLines(beats[0]!).map((line) => line.style)).toEqual([
      "script",
      "display",
      "script",
      "display",
    ]);
  });
});
