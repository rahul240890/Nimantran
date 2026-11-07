import { describe, expect, it } from "vitest";
import { STYLE_MOTIFS, WELCOME_LAYOUTS, sectionDress } from "./section-dress";

describe("a visit's dress for the guest page", () => {
  it("is the same for the same seed, so the server and a review link agree", () => {
    expect(sectionDress("kayal", "garden", 7)).toEqual(sectionDress("kayal", "garden", 7));
  });

  it("changes from visit to visit", () => {
    const pages = new Set(
      Array.from({ length: 40 }, (_, seed) =>
        JSON.stringify(sectionDress("kayal", "garden", seed)),
      ),
    );
    expect(pages.size).toBeGreaterThan(30);
  });

  it("uses every welcome, and only motifs that suit the theme's style", () => {
    const welcomes = new Set<string>();
    for (let seed = 0; seed < 60; seed++) {
      const dress = sectionDress("jungle-party", "party", seed);
      welcomes.add(dress.welcome);
      expect(STYLE_MOTIFS.party).toContain(dress.motif);
      // A ticket's stub is printed for the morning's light
      if (dress.layouts.date === "ticket") expect(dress.deepDate).toBe(false);
    }
    expect([...welcomes].sort()).toEqual([...WELCOME_LAYOUTS].sort());
  });
});
