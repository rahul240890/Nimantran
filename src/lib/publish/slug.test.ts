import { describe, expect, it } from "vitest";
import {
  cleanSlugInput,
  isSlug,
  slugAlternatives,
  slugify,
  slugYear,
  suggestSlug,
  SLUG_MAX,
} from "./slug";

describe("slugify", () => {
  it("keeps names readable in plain ASCII", () => {
    expect(slugify("Aarav")).toBe("aarav");
    expect(slugify("  Priyá  D'Souza ")).toBe("priya-dsouza");
    expect(slugify("Anne-Marie & Co.")).toBe("anne-marie-co");
  });

  it("writes names in Indian scripts in English letters", () => {
    expect(slugify("आरव")).toBe("aarav");
    expect(slugify("અમિત શાહ")).toBe("amit-shah");
  });

  it("gives nothing for scripts it can't read", () => {
    expect(slugify("李明")).toBe("");
  });
});

describe("suggestSlug", () => {
  it("reads like the occasion", () => {
    expect(suggestSlug({ first: "Aarav", second: "Meera", categoryId: "wedding" })).toBe(
      "aarav-weds-meera",
    );
    expect(suggestSlug({ first: "Aarav", second: "Meera", categoryId: "roka" })).toBe(
      "aarav-and-meera-roka",
    );
    expect(suggestSlug({ first: "Meera", second: "", categoryId: "haldi" })).toBe("meera-haldi");
    expect(suggestSlug({ first: "आरव", second: "मीरा", categoryId: "wedding" })).toBe(
      "aarav-weds-meera",
    );
    expect(suggestSlug({ first: "செந்தில்", second: "மீனா", categoryId: "wedding" })).toBe(
      "senthil-weds-meena",
    );
    expect(suggestSlug({ first: "李", second: "", categoryId: "wedding" })).toBe("wedding-invite");
  });

  it("is always a valid slug, however long the names", () => {
    const slug = suggestSlug({
      first: "Venkata Subrahmanya Lakshmi Narasimha",
      second: "Bhagyalakshmi Annapurna Devi",
      categoryId: "engagement",
    });
    expect(slug.length).toBeLessThanOrEqual(SLUG_MAX);
    expect(isSlug(slug)).toBe(true);
  });
});

describe("slugYear", () => {
  it("reads the year of a date, and nothing else", () => {
    expect(slugYear("2026-12-04")).toBe("2026");
    expect(slugYear("")).toBeUndefined();
    expect(slugYear(undefined)).toBeUndefined();
  });
});

describe("slugAlternatives", () => {
  it("offers the occasion's year first when it is known", () => {
    const options = slugAlternatives("aarav-weds-meera", () => 0.5, "2026");
    expect(options.slice(0, 2)).toEqual(["aarav-weds-meera-2026", "aarav-weds-meera-2"]);
    for (const option of slugAlternatives("a".repeat(SLUG_MAX), Math.random, "2026")) {
      expect(isSlug(option)).toBe(true);
    }
  });

  it("numbers first, then adds a random ending, all valid", () => {
    const options = slugAlternatives("aarav-weds-meera", () => 0.5);
    expect(options.slice(0, 2)).toEqual(["aarav-weds-meera-2", "aarav-weds-meera-3"]);
    expect(options).toHaveLength(9);
    for (const option of options) expect(isSlug(option)).toBe(true);
    for (const option of slugAlternatives("a".repeat(SLUG_MAX))) expect(isSlug(option)).toBe(true);
  });
});

describe("cleanSlugInput", () => {
  it("turns what a host types into link characters", () => {
    expect(cleanSlugInput("Aarav Weds ")).toBe("aarav-weds-");
    expect(cleanSlugInput("--a__b")).toBe("a-b");
    expect(cleanSlugInput("राहुल वेड्स प्रिया")).toBe("rahul-veds-priya");
  });
});
