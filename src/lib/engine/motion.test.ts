import { describe, expect, it } from "vitest";
import { TRADITION_IDS } from "@/lib/traditions/schema";
import { SYMBOL_IDS } from "@/lib/traditions/schema";
import {
  MOTION,
  OPENING_SECONDS,
  motionFor,
  openingAt,
  openingLength,
  profileColours,
  resolveColour,
  TRACKS,
} from "./motion";
import { PATTERN_IDS, patternStrokes, revealStrokes, strokeLength, strokePath } from "./patterns";
import { daysBetween, diyaCountdown, todayInIndia } from "@/lib/publish/countdown";
import { TRADITIONS } from "@/lib/traditions/catalog";

describe("regional openings", () => {
  it("gives every tradition an opening that ends within six seconds", () => {
    for (const id of TRADITION_IDS) {
      const profile = MOTION[id];
      expect(profile.id).toBe(id);
      expect(openingLength(profile)).toBeGreaterThan(0);
      expect(openingLength(profile)).toBeLessThanOrEqual(OPENING_SECONDS);
      for (const window of Object.values(profile.tracks)) {
        expect(window.start).toBeGreaterThanOrEqual(0);
        expect(window.end).toBeGreaterThan(window.start);
      }
    }
  });

  it("asks fewer particles of weaker devices", () => {
    for (const profile of Object.values(MOTION)) {
      const sets = [...profile.ambient, ...(profile.burst ? [profile.burst] : [])];
      for (const set of sets) {
        expect(set.counts.high).toBeGreaterThanOrEqual(set.counts.medium);
        expect(set.counts.medium).toBeGreaterThanOrEqual(set.counts.low);
        expect(set.counts.low).toBeGreaterThan(0);
      }
    }
  });

  it("glows the sacred symbol only where the pack has one", () => {
    for (const id of TRADITION_IDS) {
      if (MOTION[id].symbolGlow) expect(TRADITIONS[id].symbols.default).not.toBeNull();
    }
    expect(SYMBOL_IDS).toContain(TRADITIONS.bengali.symbols.default);
  });

  it("follows the spec's sequence for each pack", () => {
    expect(MOTION.tamil.pattern?.id).toBe("kolam");
    expect(MOTION.tamil.lamps).toBe(true);
    expect(MOTION.tamil.garland).toBe("mango-leaf");
    expect(MOTION.bengali.pattern?.id).toBe("alpona");
    expect(MOTION.bengali.prajapati).toBe(true);
    expect(MOTION.marathi.pattern?.id).toBe("rangoli");
    expect(MOTION.marathi.burst).not.toBeNull();
    expect(MOTION.gujarati.ambient.map((set) => set.kind)).toContain("kites");
    expect(MOTION.rajasthani.ambient.map((set) => set.kind)).toContain("lanterns");
    expect(MOTION["north-hindu"].garland).toBe("marigold");
    expect(MOTION.modern.symbolGlow).toBe(false);
    expect(motionFor(null)).toBeNull();
  });

  it("runs each part over its own window, easing in and out", () => {
    const profile = MOTION.tamil;
    expect(openingAt(profile, 0).pattern).toBe(0);
    expect(openingAt(profile, 2).pattern).toBeGreaterThan(0.3);
    expect(openingAt(profile, 2).pattern).toBeLessThan(0.7);
    expect(openingAt(profile, 10).pattern).toBe(1);
    // Lamps light after the kolam has started
    expect(openingAt(profile, 1).lamps).toBe(0);
    // Parts a pack doesn't use read as done
    expect(openingAt(profile, 0).burst).toBe(1);
    for (const track of TRACKS) expect(openingAt(profile, OPENING_SECONDS)[track]).toBe(1);
  });

  it("reads colours from the card's stock or the page", () => {
    const stock = { gold: "#b8862f" };
    const read = (token: string) => `token:${token}`;
    expect(resolveColour("stock:gold", stock, read)).toBe("#b8862f");
    expect(resolveColour("marigold", stock, read)).toBe("token:marigold");
    expect(profileColours(MOTION.tamil)).toContain("motion-rice");
  });
});

describe("self-drawing patterns", () => {
  it.each(PATTERN_IDS)("%s stays inside its circle and has something to draw", (id) => {
    const strokes = patternStrokes(id);
    expect(strokes.length).toBeGreaterThan(3);
    for (const stroke of strokes) {
      expect(stroke.points.length % 2).toBe(0);
      expect(strokeLength(stroke.points)).toBeGreaterThan(0);
      for (const value of stroke.points) expect(Math.abs(value)).toBeLessThanOrEqual(1.06);
    }
  });

  it("draws strokes one after another at a steady speed", () => {
    const strokes = patternStrokes("kolam");
    const none = revealStrokes(strokes, 0);
    const half = revealStrokes(strokes, 0.5);
    const all = revealStrokes(strokes, 1);
    expect(none.every((f) => f === 0)).toBe(true);
    expect(all.every((f) => f === 1)).toBe(true);
    // Earlier strokes finish before later ones start
    const partial = half.findIndex((f) => f < 1);
    expect(half.slice(partial + 1).every((f) => f === 0)).toBe(true);
  });

  it("writes SVG paths with up as up", () => {
    expect(strokePath(Float32Array.from([0, 0.5, 1, 0]), false)).toBe(
      "M0.0000 -0.5000L1.0000 0.0000",
    );
    expect(strokePath(Float32Array.from([0, 0]), true)).toMatch(/Z$/);
  });
});

describe("diya countdown", () => {
  it("counts calendar days", () => {
    expect(daysBetween("2026-10-30", "2026-11-02")).toBe(3);
    expect(daysBetween("2026-12-31", "2027-01-01")).toBe(1);
  });

  it("lights one more lamp each day of the last week", () => {
    expect(diyaCountdown(["2026-11-20"], "2026-10-01")).toEqual({ daysLeft: 50, lit: 0, lamps: 7 });
    expect(diyaCountdown(["2026-11-20"], "2026-11-15")).toEqual({ daysLeft: 5, lit: 2, lamps: 7 });
    expect(diyaCountdown(["2026-11-20"], "2026-11-20")).toEqual({ daysLeft: 0, lit: 7, lamps: 7 });
  });

  it("counts to the first function still to come", () => {
    expect(diyaCountdown(["2026-11-22", "2026-11-18", ""], "2026-11-15")?.daysLeft).toBe(3);
    expect(diyaCountdown(["2026-11-10", "2026-11-18"], "2026-11-15")?.daysLeft).toBe(3);
    expect(diyaCountdown(["2026-11-10"], "2026-11-15")).toBeNull();
    expect(diyaCountdown([], "2026-11-15")).toBeNull();
  });

  it("uses India's date", () => {
    // 20:00 UTC on the 14th is already the 15th in India
    expect(todayInIndia(new Date("2026-11-14T20:00:00Z"))).toBe("2026-11-15");
  });
});
