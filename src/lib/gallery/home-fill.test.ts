import { describe, expect, it } from "vitest";
import { BUILT_PRICING } from "@/lib/plans/design-defaults";
import type { DesignTier } from "@/lib/plans/design-tiers";
import { DEFAULT_TRENDING } from "./trending";
import { DEFAULT_BESTSELLERS } from "./bestsellers";
import { designCatalog, tierOf } from "./filters";
import { favourTiers, premiumAtMost, fillHomeSections, type HomeFillInput } from "./home-fill";
import { DEFAULT_SHOWN, newestDesigns, sectionSize, type HomeSectionId } from "./home-sections";

const tier = (id: string) => tierOf(BUILT_PRICING, id);
const rich = (id: string) => ["royal", "signature"].includes(tier(id));
const base: HomeFillInput = {
  sections: DEFAULT_SHOWN,
  chosen: {},
  trending: [...DEFAULT_TRENDING],
  pinned: [],
  bestsellers: [...DEFAULT_BESTSELLERS],
  newest: newestDesigns(),
  entries: designCatalog(),
  tierOf: tier,
};

describe("home page sections' designs", () => {
  it("show 10 in Trending and Best sellers, 24 in the wedding and the engagement", () => {
    const filled = fillHomeSections(base);
    expect(filled.trending).toHaveLength(10);
    expect(filled.bestsellers).toHaveLength(10);
    expect(filled.wedding).toHaveLength(24);
    expect(filled.engagement).toHaveLength(24);
    expect(filled.birthday!.length).toBeLessThanOrEqual(sectionSize("birthday"));
  });

  it("never show a design twice on the page", () => {
    const all = Object.values(fillHomeSections(base)).flat();
    expect(new Set(all).size).toBe(all.length);
  });

  it("lead with Royal and Signature, and take only a few others", () => {
    for (const [id, list] of Object.entries(fillHomeSections(base))) {
      expect(list.filter((design) => !rich(design)).length, id).toBeLessThanOrEqual(
        premiumAtMost(id as HomeSectionId),
      );
    }
  });

  it("keep the admin's choices, which the other sections step around", () => {
    const wedding = fillHomeSections(base).wedding!;
    const chosen = { engagement: [wedding[0]!, wedding[1]!] };
    const filled = fillHomeSections({ ...base, chosen });
    expect(filled.engagement).toEqual(chosen.engagement);
    expect(filled.wedding).not.toContain(wedding[0]);
    expect(filled.wedding).toHaveLength(24);
    // Trending's pins lead, whatever their tier
    const premium = base.entries.map((entry) => entry.design.id).find((id) => !rich(id))!;
    const pinned = fillHomeSections({ ...base, pinned: [premium], trending: [premium] });
    expect(pinned.trending![0]).toBe(premium);
  });

  it("spread the others among the Royal and Signature designs", () => {
    const ids = ["p1", "p2", "p3", "r1", "r2", "r3", "r4", "r5", "r6"];
    const of = (id: string): DesignTier => (id.startsWith("p") ? "premium" : "royal");
    const list = favourTiers(ids, 8, of);
    expect(list).toHaveLength(8);
    expect(list.filter((id) => id.startsWith("p"))).toEqual(["p1", "p2"]);
    expect(list[0]).toBe("r1");
    // Too few Royal and Signature: the others fill the rest
    expect(favourTiers(["p1", "p2", "p3", "r1"], 4, of)).toHaveLength(4);
  });
});
