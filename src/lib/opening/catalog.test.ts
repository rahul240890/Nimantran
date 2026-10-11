import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { THEMED_IDS } from "@/lib/suites/catalog";
import {
  FRESH_OPENINGS,
  OPENING_GROUPS,
  OPENING_STYLES,
  PAINTED_GATES,
  isFreshOpening,
  THEMED_OPENINGS,
  isPaintedGate,
  noOpening,
  offersGods,
  openingGod,
  openingStyle,
  openingStyles,
  welcomeKind,
} from "./catalog";

describe("openings", () => {
  it("follows the design until the host picks one", () => {
    // A painted theme splits its cover; the colour card and a Scene open at a painted gate
    expect(openingStyle(noOpening, "rajwada-bagh", false)).toBe("doors");
    expect(openingStyle(noOpening, "classic", false)).toBe("rajwada-pol");
    expect(openingStyle(noOpening, "rajwada-bagh", true)).toBe("rajwada-pol");
    expect(openingStyle({ style: "lotus", god: null }, "classic", false)).toBe("lotus");
  });

  it("opens each themed design with its own painting, which any card can also pick", () => {
    for (const suite of THEMED_IDS) {
      expect(openingStyle(noOpening, suite, true)).toBe(suite);
      expect(openingStyle(noOpening, suite, false)).toBe(suite);
      expect(openingStyle({ style: "lotus", god: null }, suite, true)).toBe("lotus");
      expect(openingStyle({ style: suite, god: null }, "classic", false)).toBe(suite);
      expect(THEMED_OPENINGS[suite]).toBeTruthy();
      const art = join(process.cwd(), "public", "openings", "themed", `${suite}.webp`);
      expect(existsSync(art), art).toBe(true);
    }
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

  it("offers every fresh opening on any theme, for pages and Scenes alike", () => {
    expect(FRESH_OPENINGS).toHaveLength(25);
    for (const id of FRESH_OPENINGS) {
      expect(openingStyles("classic", false)).toContain(id);
      expect(openingStyles("rajwada-bagh", true)).toContain(id);
      expect(isFreshOpening(id)).toBe(true);
      expect(isPaintedGate(id)).toBe(false);
    }
    expect(isFreshOpening("rajwada-pol")).toBe(false);
  });

  it("opens some occasions on a fresh opening of their own", () => {
    expect(openingStyle(noOpening, "classic", false, "holi")).toBe("gulaal-bindu");
    expect(openingStyle(noOpening, "classic", false, "mehendi")).toBe("choodi-chakra");
    expect(openingStyle(noOpening, "classic", false, "christmas")).toBe("kaanch-ka-gola");
  });

  it("keeps gods off party occasions", () => {
    expect(offersGods("wedding")).toBe(true);
    expect(offersGods("party")).toBe(false);
    expect(openingGod({ style: null, god: "ganesha" }, "wedding")).toBe("ganesha");
    expect(openingGod({ style: null, god: "ganesha" }, "farewell-party")).toBeNull();
  });

  it("gives every opening a welcome of its own feeling", () => {
    expect(welcomeKind("rajwada-pol")).toBe("royal");
    expect(welcomeKind("lotus")).toBe("bloom");
    expect(welcomeKind("diyas")).toBe("lamps");
    expect(welcomeKind("moonlit")).toBe("night");
    expect(welcomeKind("balloons")).toBe("party");
    expect(welcomeKind("envelope")).toBe("letter");
    for (const style of OPENING_STYLES) expect(welcomeKind(style)).toBeTruthy();
  });
});
