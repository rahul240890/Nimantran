import { describe, expect, it } from "vitest";
import { PHOTO_CARD_IDS, SUITE_IDS } from "./catalog";
import { NAME_REVEALS, PHOTO_REVEALS, revealFor } from "./reveal";

describe("photo and name reveals", () => {
  it("gives every theme a photo and a name reveal", () => {
    for (const suite of SUITE_IDS) {
      const { photo, names } = revealFor(suite);
      expect(PHOTO_REVEALS).toContain(photo);
      expect(NAME_REVEALS).toContain(names);
    }
  });

  it("keeps neighbouring themes from sharing a pair", () => {
    for (let i = 1; i < SUITE_IDS.length; i++) {
      expect(revealFor(SUITE_IDS[i]!)).not.toEqual(revealFor(SUITE_IDS[i - 1]!));
    }
  });

  it("uses every style somewhere", () => {
    const photos = new Set(SUITE_IDS.map((suite) => revealFor(suite).photo));
    const names = new Set(SUITE_IDS.map((suite) => revealFor(suite).names));
    expect(photos.size).toBe(PHOTO_REVEALS.length);
    expect(names.size).toBe(NAME_REVEALS.length);
  });

  it("develops the Polaroid card's photos and flips the locket open", () => {
    expect(revealFor("polaroid-lights").photo).toBe("develop");
    expect(revealFor("locket-jodi").photo).toBe("flip");
    expect(PHOTO_CARD_IDS.every((suite) => revealFor(suite).names)).toBe(true);
  });
});
