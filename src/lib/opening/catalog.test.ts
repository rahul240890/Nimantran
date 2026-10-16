import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { STORY_IDS, THEMED_IDS } from "@/lib/suites/catalog";
import {
  WELCOME_KINDS,
  WELCOME_POOLS,
  WELCOME_SCENES,
  darkWelcome,
  filmedWelcome,
  welcomeScene,
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

  it("opens each story theme at its own gate, which any card can also pick", () => {
    for (const story of STORY_IDS) {
      const gate = openingStyle(noOpening, story, false);
      expect(isPaintedGate(gate), story).toBe(true);
      expect(existsSync(join(process.cwd(), "public/openings/gates", gate, "hole.webp"))).toBe(
        true,
      );
    }
    expect(openingStyle(noOpening, "navrang", false)).toBe("navrang-dwar");
    expect(openingStyle({ style: "lotus", god: null }, "navrang", false)).toBe("lotus");
    expect(new Set(STORY_IDS.map((id) => openingStyle(noOpening, id, false))).size).toBe(
      STORY_IDS.length,
    );
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

describe("the welcome after the opening", () => {
  it("brings one of several scenes that suit the opening, a different one by the pick", () => {
    const seen = new Set([0, 0.3, 0.6, 0.9].map((pick) => welcomeScene(noOpening, "palace", pick)));
    expect([...seen]).toEqual(WELCOME_POOLS.royal);
    // A pick of 1 still lands in the pool
    expect(WELCOME_POOLS.royal).toContain(welcomeScene(noOpening, "palace", 1));
    // Every opening's pool is four scenes, its own feeling first, every scene in some pool
    for (const kind of WELCOME_KINDS) {
      expect(WELCOME_POOLS[kind]).toHaveLength(4);
      expect(WELCOME_POOLS[kind][0]).toBe(kind);
    }
    const pooled = new Set(Object.values(WELCOME_POOLS).flat());
    for (const scene of WELCOME_SCENES) expect(pooled.has(scene), scene).toBe(true);
  });

  it("keeps the host's own pick, and films each scene as one the video draws", () => {
    expect(welcomeScene({ welcome: "kites" }, "palace", 0.9)).toBe("kites");
    for (const scene of WELCOME_SCENES) expect(WELCOME_KINDS).toContain(filmedWelcome(scene));
    expect(darkWelcome("fireflies")).toBe(true);
    expect(darkWelcome("sunrise")).toBe(false);
  });
});
