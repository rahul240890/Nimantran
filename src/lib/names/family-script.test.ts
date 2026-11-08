import { describe, expect, it } from "vitest";
import { familyChoices, familyPieces, hasLatin, joinPieces } from "./family-script";

/** Made-up spellings, as the input tools would answer for each name. */
const GU: Record<string, string[]> = {
  Sunita: ["સુનીતા", "સુનિતા"],
  Ramesh: ["રમેશ"],
  Patel: ["પટેલ"],
  Sharma: ["શર્મા"],
  Mohanlal: ["મોહનલાલ"],
  Ahmedabad: ["અમદાવાદ"],
};
const spell = (word: string) => GU[word] ?? [];

describe("family lines in a card's script", () => {
  it("writes the titles and the & in Gujarati and spells the names", () => {
    const pieces = familyPieces("Smt. Sunita & Shri Ramesh Patel", "gu");
    expect(familyChoices(pieces, spell)).toEqual([
      "શ્રીમતી સુનીતા તથા શ્રી રમેશ પટેલ",
      "શ્રીમતી સુનિતા તથા શ્રી રમેશ પટેલ",
    ]);
  });

  it("drops The and writes family in the card's words", () => {
    expect(familyChoices(familyPieces("The Sharma family", "gu"), spell)).toEqual(["શર્મા પરિવાર"]);
    expect(familyChoices(familyPieces("Late Shri Mohanlal Patel", "gu"), spell)).toEqual([
      "સ્વ. શ્રી મોહનલાલ પટેલ",
    ]);
  });

  it("follows each language's own titles", () => {
    const hi = familyPieces("Smt. Sunita & Shri Ramesh", "hi").map((p) => p.text);
    expect(joinPieces(hi)).toBe("श्रीमती Sunita एवं श्री Ramesh");
    const mr = familyPieces("Late Shri Ramesh", "mr").map((p) => p.text);
    expect(joinPieces(mr)).toBe("कै. श्री. Ramesh");
  });

  it("keeps what is already in the script and offers nothing half in English", () => {
    expect(familyChoices(familyPieces("શ્રી Ramesh", "gu"), spell)).toEqual(["શ્રી રમેશ"]);
    expect(familyChoices(familyPieces("Shri Unknown Patel", "gu"), spell)).toEqual([]);
    expect(hasLatin("શ્રી રમેશ પટેલ")).toBe(false);
    expect(hasLatin("Ahmedabad")).toBe(true);
  });
});
