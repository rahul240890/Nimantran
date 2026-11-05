import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CATEGORY_IDS } from "@/lib/categories/catalog";
import {
  CELEBRATION_FAMILIES,
  CELEBRATION_LOOKS,
  celebrationBlessing,
  celebrationFamily,
  celebrationImage,
  nextSuggestion,
  packagePerks,
} from "./celebrate";

const publicFile = (path: string) => join(process.cwd(), "public", path);

describe("celebration families", () => {
  it.each(CATEGORY_IDS)("%s has a family with a painting", (id) => {
    const family = celebrationFamily(id);
    expect(CELEBRATION_FAMILIES).toContain(family);
    expect(existsSync(publicFile(celebrationImage(family)))).toBe(true);
  });

  it("keeps a prayer meeting quiet", () => {
    expect(celebrationFamily("prayer-meet")).toBe("prayer");
    expect(CELEBRATION_LOOKS.prayer.particles).toBe("none");
    expect(celebrationBlessing("prayer", "hindu")).toBeNull();
  });

  it("gives Eid and Christmas the flower arch, not diyas", () => {
    for (const id of ["eid", "christmas", "holi"] as const) {
      expect(CELEBRATION_LOOKS[celebrationFamily(id)].image).not.toBe("festival");
    }
    expect(CELEBRATION_LOOKS[celebrationFamily("diwali")].image).toBe("festival");
  });

  it("has every falling piece it draws", () => {
    for (const name of ["petal-11", "confetti-15", "balloon-5", "toran"]) {
      expect(existsSync(publicFile(`celebrate/${name}.webp`))).toBe(true);
    }
  });

  it("blesses in the family's own faith, and not at parties", () => {
    expect(celebrationBlessing("wedding", "muslim")).toBe("muslim");
    expect(celebrationBlessing("wedding", "none")).toBeNull();
    expect(celebrationBlessing("birthday", "hindu")).toBeNull();
  });
});

describe("package perks", () => {
  const included = (plan: Parameters<typeof packagePerks>[0]) =>
    packagePerks(plan)
      .filter((perk) => perk.included)
      .map((perk) => perk.id);

  it("leaves Free with the mark and Basic without", () => {
    expect(included("free")).not.toContain("noMark");
    expect(included("basic")).toContain("noMark");
  });

  it("names the lowest package that has each missing perk", () => {
    const basic = packagePerks("basic");
    expect(basic.find((perk) => perk.id === "video")).toMatchObject({
      included: false,
      from: "celebration",
    });
    expect(basic.find((perk) => perk.id === "cards")).toMatchObject({
      included: false,
      from: "grand",
    });
  });

  it("gives Grand everything", () => {
    expect(packagePerks("grand").every((perk) => perk.included)).toBe(true);
  });
});

describe("next suggestion", () => {
  it("suggests the video after Basic and nothing after Grand", () => {
    expect(nextSuggestion("free", 1)).toEqual({ plan: "basic", reason: "noMark" });
    expect(nextSuggestion("basic", 1)).toEqual({ plan: "celebration", reason: "video" });
    expect(nextSuggestion("grand", 3)).toBeNull();
  });

  it("offers a video per function to a multi-function Celebration", () => {
    expect(nextSuggestion("celebration", 3)).toEqual({ plan: "grand", reason: "everyVideo" });
    expect(nextSuggestion("celebration", 1)).toEqual({ plan: "grand", reason: "cards" });
  });
});
