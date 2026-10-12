import { describe, expect, it } from "vitest";
import { allDesigns } from "./catalog";
import {
  DEFAULT_TRENDING,
  TRENDING_SIZE,
  inviteDesignId,
  parseTrendingSettings,
  trendingDesigns,
} from "./trending";

const known = new Set(allDesigns().map((design) => design.id));

describe("trending designs", () => {
  it("starts from a list of real designs", () => {
    expect(DEFAULT_TRENDING.filter((id) => !known.has(id))).toEqual([]);
    expect(trendingDesigns([], [])).toEqual(DEFAULT_TRENDING.slice(0, TRENDING_SIZE));
  });

  it("names the design an invitation was made with", () => {
    expect(inviteDesignId({ suite: "kayal" }, known)).toBe("kayal");
    expect(inviteDesignId({ suite: "kayal", format: "scene" }, known)).toBe("kayal-scene");
    expect(inviteDesignId({ suite: "jal-mahal" }, known)).toBe("jal-mahal-scene");
    expect(inviteDesignId({ suite: "classic", template: "rose" }, known)).toBe("card-rose");
    expect(inviteDesignId({ template: "nope" }, known)).toBeNull();
  });

  it("puts the admin's picks first, then the most used, then the starting list", () => {
    const invites = [
      ...Array.from({ length: 3 }, () => ({ suite: "sagar" })),
      ...Array.from({ length: 5 }, () => ({ suite: "classic", template: "rose" })),
      { suite: "kashi" },
    ];
    const list = trendingDesigns(["deco-noir"], invites);
    expect(list.slice(0, 3)).toEqual(["deco-noir", "card-rose", "sagar"]);
    // One invite alone doesn't make a design trend
    expect(list).not.toContain("kashi");
    expect(list).toHaveLength(TRENDING_SIZE);
  });

  it("keeps only known designs from stored settings", () => {
    expect(parseTrendingSettings({ pinned: ["kayal", "nope", "kayal", 4] })).toEqual({
      pinned: ["kayal"],
    });
    expect(parseTrendingSettings(null)).toEqual({ pinned: [] });
  });
});
