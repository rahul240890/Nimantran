import { describe, expect, it } from "vitest";
import { cleanWording, wordingPrompt, type WordingPage } from "./prompt";

const pages: WordingPage[] = [
  {
    id: "cover",
    scene: "cover",
    lines: [
      { text: "Radha", style: "display" },
      { text: "&", style: "script" },
      { text: "Arjun", style: "display" },
    ],
  },
  {
    id: "fn-haldi",
    scene: "haldi",
    lines: [{ text: "Saturday, 12 December 2026", style: "display" }],
  },
];

describe("AI wording", () => {
  it("asks in the card's language and script, with the pages as they are", () => {
    const prompt = wordingPrompt({
      language: "gu",
      tone: "traditional",
      mode: "write",
      occasion: "wedding",
      tradition: "gujarati",
      pages,
    });
    expect(prompt).toContain("Gujarati (Gujarati script)");
    expect(prompt).toContain("Tradition: gujarati.");
    expect(prompt).toContain('"id": "fn-haldi"');
    expect(prompt).toContain("Saturday, 12 December 2026");
    expect(
      wordingPrompt({
        language: "en",
        tone: "fun",
        mode: "shorten",
        occasion: "birthday",
        tradition: null,
        pages,
      }),
    ).toContain("Shorten these pages");
  });

  it("keeps only the pages asked for, known line kinds and the editor's limits", () => {
    const clean = cleanWording(
      {
        pages: [
          {
            id: "cover",
            lines: [
              { style: "display", text: "  Radha  weds\\nArjun " },
              { style: "poster", text: "Shubh" },
              { style: "body", text: "   " },
            ],
          },
          { id: "cover", lines: [{ style: "body", text: "a second cover" }] },
          { id: "invented", lines: [{ style: "body", text: "not asked for" }] },
          { id: "fn-haldi", lines: [] },
        ],
      },
      pages,
    );
    expect(clean).toEqual({
      cover: [
        { style: "display", text: "Radha weds\\nArjun" },
        { style: "body", text: "Shubh" },
      ],
    });
  });
});
