import { describe, expect, it } from "vitest";
import { designById } from "@/lib/gallery/catalog";
import { defaultTier } from "@/lib/plans/design-defaults";
import {
  LIVE_DEMOS,
  isTourSeed,
  newTourSeed,
  samplePath,
  tourOrder,
  tourPath,
  tourStart,
} from "./paths";

describe("the live demos", () => {
  it("are more than 50 real, paid designs, each once", () => {
    expect(LIVE_DEMOS.length).toBeGreaterThan(50);
    expect(new Set(LIVE_DEMOS).size).toBe(LIVE_DEMOS.length);
    for (const id of LIVE_DEMOS) {
      expect(designById(id), id).not.toBeNull();
      expect(defaultTier(id), id).not.toBe("free");
    }
    expect(LIVE_DEMOS.some((id) => id.endsWith("-scene"))).toBe(true);
  });

  it("tour in an order of their own for each seed, the same every time for one", () => {
    const one = tourOrder("abc123");
    expect(one).toEqual(tourOrder("abc123"));
    expect([...one].sort()).toEqual([...LIVE_DEMOS].sort());
    expect(tourOrder("zz9")).not.toEqual(one);
    // Over many tours, each demo leads some of them
    const firsts = new Set(Array.from({ length: 2000 }, (_, i) => tourOrder(i.toString(36))[0]));
    expect(firsts.size).toBeGreaterThan(LIVE_DEMOS.length * 0.9);
  });

  it("never begin with the demo the last tour began with", () => {
    for (let i = 0; i < 200; i++) {
      const seed = i.toString(36);
      const [first] = tourOrder(seed);
      expect(tourStart(seed, first!)).not.toBe(first);
      expect(tourStart(seed, null)).toBe(first);
    }
  });

  it("name their tour in a short seed, and nothing else passes for one", () => {
    for (let i = 0; i < 50; i++) expect(isTourSeed(newTourSeed(() => i / 50))).toBe(true);
    expect(isTourSeed(newTourSeed(() => 0.999999))).toBe(true);
    expect(isTourSeed("")).toBe(false);
    expect(isTourSeed("../x")).toBe(false);
    expect(isTourSeed("A1")).toBe(false);
    expect(tourPath("kayal", "k3x")).toBe("/sample/kayal?tour=k3x");
  });
});

describe("a sample's address", () => {
  it("names the listing it was opened from", () => {
    expect(samplePath("kayal")).toBe("/sample/kayal");
    expect(samplePath("kayal", { occasion: "wedding" })).toBe("/sample/kayal?occasion=wedding");
    // A tradition is a wedding's, so the occasion goes without saying
    expect(samplePath("kutch-toran", { occasion: "wedding", kind: "gujarati" })).toBe(
      "/sample/kutch-toran?tradition=gujarati",
    );
    expect(samplePath("kayal", { collection: "royal-wedding", format: "story" })).toBe(
      "/sample/kayal?collection=royal-wedding&format=story",
    );
  });
});
