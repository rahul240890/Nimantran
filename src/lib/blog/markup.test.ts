import { describe, expect, it } from "vitest";
import { parseBody, parseFaq, slugify } from "./markup";

describe("blog markup", () => {
  it("turns headings, lists, messages, tips and paragraphs into blocks", () => {
    const blocks = parseBody(
      [
        "## How to word it",
        "Start with the **blessing**, then [the names](/blog).",
        "carried on.",
        "",
        "- one",
        "- two",
        "1. first",
        "> [Formal] With the blessings of the elders",
        "> हमारे घर खुशियों का अवसर आया है",
        "! Send it a month ahead.",
        "### Smaller",
        "## How to word it",
      ].join("\n"),
    );
    expect(blocks).toEqual([
      { h2: "How to word it", id: "how-to-word-it" },
      "Start with the **blessing**, then [the names](/blog). carried on.",
      { list: ["one", "two"] },
      { list: ["first"], ordered: true },
      {
        wording: [
          { label: "Formal", text: "With the blessings of the elders" },
          { text: "हमारे घर खुशियों का अवसर आया है", lang: "hi" },
        ],
      },
      { tip: "Send it a month ahead." },
      { h3: "Smaller" },
      { h2: "How to word it", id: "how-to-word-it-2" },
    ]);
  });

  it("reads questions and answers, including answers over several lines", () => {
    expect(
      parseFaq("Q: When?\nA: A month ahead\nof the day.\n\nQ: Unanswered\nQ: Why?\nA: Because."),
    ).toEqual([
      { q: "When?", a: "A month ahead of the day." },
      { q: "Why?", a: "Because." },
    ]);
  });

  it("makes addresses from titles", () => {
    expect(slugify("Griha Pravesh Invitation Message: 30 Ideas!")).toBe(
      "griha-pravesh-invitation-message-30-ideas",
    );
    expect(slugify("शादी कार्ड")).toBe("");
  });
});
