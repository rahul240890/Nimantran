import { describe, expect, it } from "vitest";
import { englishInitial, initials, tintIndex } from "./initials";

describe("initials", () => {
  it("takes the first and last word", () => {
    expect(initials("Meera Iyer")).toBe("MI");
    expect(initials("  aarav  kumar sharma ")).toBe("AS");
    expect(initials("Kabir")).toBe("K");
    expect(initials("")).toBe("");
  });

  it("is always in English letters, whatever the name's script", () => {
    expect(initials("अनन्या राव")).toBe("AR");
    expect(initials("राहुल शर्मा")).toBe("RS");
  });
});

describe("englishInitial", () => {
  it("takes the first English letter of the name as it is said", () => {
    expect(englishInitial(" rahul")).toBe("R");
    expect(englishInitial("Nita")).toBe("N");
    expect(englishInitial("राहुल")).toBe("R");
    expect(englishInitial("नीता")).toBe("N");
    expect(englishInitial("आरव")).toBe("A");
    expect(englishInitial("ज्ञान")).toBe("G");
    expect(englishInitial("રાહુલ")).toBe("R");
    expect(englishInitial("নীতা")).toBe("N");
    expect(englishInitial("செந்தில்")).toBe("S");
    expect(englishInitial("ਹਰਜੀਤ")).toBe("H");
    expect(englishInitial("")).toBe("");
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
