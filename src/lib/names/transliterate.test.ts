import { describe, expect, it, vi } from "vitest";
import {
  combineChoices,
  isLatinName,
  nameWords,
  parseChoices,
  transliterateName,
} from "./transliterate";

describe("names in the card's script", () => {
  it("only offers to spell names in English letters", () => {
    expect(isLatinName("Radha")).toBe(true);
    expect(isLatinName("Anil D'Souza")).toBe(true);
    expect(isLatinName("राधा")).toBe(false);
    expect(isLatinName("Radha राधा")).toBe(false);
    expect(isLatinName("1234")).toBe(false);
    expect(nameWords("  Priya  Sharma ")).toEqual(["Priya", "Sharma"]);
  });

  it("reads Google's answer and ignores anything else", () => {
    expect(parseChoices(["SUCCESS", [["radha", ["राधा", "रधा"], [], {}]]])).toEqual([
      "राधा",
      "रधा",
    ]);
    expect(parseChoices(["FAILED_TO_PROCESS", []])).toEqual([]);
    expect(parseChoices(null)).toEqual([]);
    expect(parseChoices(["SUCCESS", [["radha", "राधा"]]])).toEqual([]);
  });

  it("builds whole names, best spelling first, without repeats", () => {
    expect(combineChoices([["प्रिया", "प्रीया"], ["शर्मा"]])).toEqual([
      "प्रिया शर्मा",
      "प्रीया शर्मा",
    ]);
    expect(combineChoices([["राधा"], []])).toEqual([]);
    expect(combineChoices([])).toEqual([]);
  });

  it("asks once per word with the card language, and gives up quietly", async () => {
    const fetcher = vi.fn(async (url: URL | RequestInfo) => {
      const word = new URL(String(url)).searchParams.get("text");
      expect(new URL(String(url)).searchParams.get("itc")).toBe("gu-t-i0-und");
      return Response.json(["SUCCESS", [[word, [word === "priya" ? "પ્રિયા" : "પટેલ"]]]]);
    });
    await expect(transliterateName("Priya Patel", "gu", fetcher as typeof fetch)).resolves.toEqual([
      "પ્રિયા પટેલ",
    ]);
    expect(fetcher).toHaveBeenCalledTimes(2);

    const broken = vi.fn(async () => {
      throw new Error("offline");
    });
    await expect(transliterateName("Radha", "hi", broken as typeof fetch)).resolves.toEqual([]);
  });
});
