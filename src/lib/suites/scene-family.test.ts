import { describe, expect, it } from "vitest";
import type { StoryBeat, StoryLine } from "@/lib/engine/story";
import { sceneFamilyCards, slotLines } from "./scene-family";

const beat = (id: string, scene: string, lines: StoryLine[]): StoryBeat =>
  ({ id, scene, lines, symbol: false, seconds: 5 }) as StoryBeat;

const side = (title: string, names: string): StoryLine[] => [
  { text: title, style: "label" },
  { text: "Son of", style: "small" },
  { text: names, style: "body" },
  { text: "Jaipur", style: "small" },
];

describe("the family in One Scene", () => {
  const beats = [
    beat("cover", "cover", [{ text: "Asha", style: "display" }]),
    beat("family", "family", [
      { text: "With the blessings of our families", style: "small" },
      { text: "Blessings", style: "label" },
      { text: "Late Smt. Kamla Devi", style: "body" },
      ...side("Groom's family", "Smt. Meenakshi & Shri Rajendra Prasad Sharma"),
      ...side("Bride's family", "Smt. Usha & Shri Mohan Lal Gupta"),
    ]),
    beat("invite", "family", [
      { text: "request the pleasure of your company", style: "body" },
      { text: "Save the date", style: "label" },
      { text: "12 December 2026", style: "date" },
    ]),
    beat("fn-wedding", "wedding", [{ text: "Wedding", style: "display" }]),
  ];

  it("shows every family line and the day, but not the line printed under the names", () => {
    const cards = sceneFamilyCards(beats, 8, "request the pleasure of your company");
    const texts = cards.flat().map((line) => line.text);
    expect(texts).toContain("Smt. Meenakshi & Shri Rajendra Prasad Sharma");
    expect(texts).toContain("Smt. Usha & Shri Mohan Lal Gupta");
    expect(texts).toContain("12 December 2026");
    expect(texts).not.toContain("request the pleasure of your company");
    expect(texts).not.toContain("Asha");
    expect(texts).not.toContain("Wedding");
  });

  it("splits a small slot into more cards, never inside a side's block", () => {
    const roomy = sceneFamilyCards(beats, 8);
    const small = sceneFamilyCards(beats, 4);
    expect(small.length).toBeGreaterThan(roomy.length);
    for (const card of small) {
      const at = card.findIndex((line) => line.text === "Son of");
      if (at >= 0) expect(card[at - 1]?.style).toBe("label");
    }
  });

  it("gives a painted card's smaller writing area fewer lines", () => {
    expect(slotLines({ slot: [10, 60, 80, 32], card: null })).toBe(8);
    expect(
      slotLines({
        slot: [10, 60, 80, 22],
        card: { image: "", text: [5, 10, 90, 80], plate: false },
      }),
    ).toBe(4);
  });
});
