import { describe, expect, it } from "vitest";
import {
  OPENING_GROUPS,
  OPENING_STYLES,
  PAINTED_GATES,
  isPaintedGate,
  noOpening,
  offersGods,
  openingGod,
  openingStyle,
  openingStyles,
} from "./catalog";

describe("openings", () => {
  it("follows the design until the host picks one", () => {
    // A painted theme splits its cover; the colour card and a Scene open at a painted gate
    expect(openingStyle(noOpening, "rajwada-bagh", false)).toBe("doors");
    expect(openingStyle(noOpening, "classic", false)).toBe("rajwada-pol");
    expect(openingStyle(noOpening, "rajwada-bagh", true)).toBe("rajwada-pol");
    expect(openingStyle({ style: "lotus", god: null }, "classic", false)).toBe("lotus");
  });

  it("offers the cover's doors only with a cover, and going straight in only for a Scene", () => {
    expect(openingStyles("classic", false)).not.toContain("doors");
    expect(openingStyles("rajwada-bagh", false)).not.toContain("none");
    expect(openingStyles("rajwada-bagh", true)).toContain("none");
    // A choice the theme can't show falls back to the design's own
    expect(openingStyle({ style: "doors", god: null }, "classic", false)).toBe("rajwada-pol");
    expect(openingStyle({ style: "none", god: null }, "kayal", false)).toBe("doors");
  });

  it("gives each occasion its own opening when there is no cover to split", () => {
    expect(openingStyle(noOpening, "classic", false, "birthday")).toBe("mela-tamboo");
    expect(openingStyle(noOpening, "classic", false, "diwali")).toBe("diyas");
    expect(openingStyle(noOpening, "classic", false, "eid")).toBe("noor-darwaza");
    expect(openingStyle(noOpening, "classic", false, "wedding")).toBe("rajwada-pol");
    // A painted Story still opens on its own cover
    expect(openingStyle(noOpening, "rajwada-bagh", false, "birthday")).toBe("doors");
  });

  it("lists every style in exactly one editor group", () => {
    const grouped = OPENING_GROUPS.flatMap((group) => group.styles);
    expect([...grouped].sort()).toEqual([...OPENING_STYLES].sort());
  });

  it("offers every painted gate on any theme, for pages and Scenes alike", () => {
    for (const gate of Object.keys(PAINTED_GATES)) {
      expect(openingStyles("classic", false)).toContain(gate);
      expect(openingStyles("rajwada-bagh", true)).toContain(gate);
      expect(isPaintedGate(gate)).toBe(true);
    }
    expect(isPaintedGate("palace")).toBe(false);
  });

  it("keeps gods off party occasions", () => {
    expect(offersGods("wedding")).toBe(true);
    expect(offersGods("party")).toBe(false);
    expect(openingGod({ style: null, god: "ganesha" }, "wedding")).toBe("ganesha");
    expect(openingGod({ style: null, god: "ganesha" }, "farewell-party")).toBeNull();
  });
});
