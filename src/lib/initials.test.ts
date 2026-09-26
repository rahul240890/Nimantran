import { describe, expect, it } from "vitest";
import { initials, tintIndex } from "./initials";

describe("initials", () => {
  it("takes the first and last word", () => {
    expect(initials("Meera Iyer")).toBe("MI");
    expect(initials("  aarav  kumar sharma ")).toBe("AS");
    expect(initials("Kabir")).toBe("K");
    expect(initials("")).toBe("");
  });

  it("keeps Indic letters whole", () => {
    // "रा" is ra plus a vowel sign; splitting it would show a broken glyph
    expect(initials("अनन्या राव")).toBe("अरा");
  });
});

describe("tintIndex", () => {
  it("is stable and in range", () => {
    expect(tintIndex("Meera Iyer", 5)).toBe(tintIndex("Meera Iyer", 5));
    for (const name of ["a", "Kabir Singh", "अनन्या"]) {
      const index = tintIndex(name, 5);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(5);
    }
  });
});
