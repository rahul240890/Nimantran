import { describe, expect, it } from "vitest";
import { newDraft, type InviteDraft } from "@/lib/editor/draft";
import { PLANS, formatRupees, planNeeded, planShortfalls, upgradePricePaise } from "./catalog";

const photo = (id: string) => ({ id, width: 10, height: 10 }) as InviteDraft["photos"][number];

function wedding(functions: number, photos = 0): InviteDraft {
  const draft = newDraft();
  const kinds = Object.keys(draft.functions) as (keyof InviteDraft["functions"])[];
  kinds.forEach((kind, index) => {
    draft.functions[kind] = { ...draft.functions[kind], included: index < functions };
  });
  draft.photos = Array.from({ length: photos }, (_, i) => photo(`p${i}`));
  return draft;
}

describe("plans", () => {
  it("charge the prices in docs/PRICING.md, GST included", () => {
    expect(formatRupees(PLANS.premium.pricePaise)).toBe("₹499");
    expect(formatRupees(PLANS.royal.pricePaise)).toBe("₹1,999");
    expect(formatRupees(PLANS.bundle.pricePaise)).toBe("₹2,999");
    expect(PLANS.free.watermark).toBe(true);
    expect(PLANS.premium.watermark).toBe(false);
  });

  it("charge only the difference on an upgrade, and never a downgrade", () => {
    expect(upgradePricePaise("free", "royal")).toBe(1_99_900);
    expect(upgradePricePaise("premium", "royal")).toBe(1_50_000);
    expect(upgradePricePaise("royal", "bundle")).toBe(1_00_000);
    expect(upgradePricePaise("royal", "premium")).toBeNull();
    expect(upgradePricePaise("bundle", "bundle")).toBeNull();
  });

  it("find the smallest edition an invite fits in", () => {
    expect(planNeeded(wedding(1))).toBe("free");
    expect(planNeeded(wedding(3))).toBe("premium");
    expect(planNeeded(wedding(5))).toBe("royal");
    expect(planNeeded(wedding(1, 4))).toBe("premium");
  });

  it("say what an invite uses beyond its edition", () => {
    expect(planShortfalls(wedding(3, 5), "free")).toEqual([
      { limit: "functions", used: 3 },
      { limit: "photos", used: 5 },
    ]);
    expect(planShortfalls(wedding(3, 5), "premium")).toEqual([]);
  });

  it("put two couple photos in Royal", () => {
    const draft = wedding(1, 2);
    draft.couplePhotos = { layout: "two", ids: [] };
    expect(planShortfalls(draft, "premium")).toEqual([{ limit: "couplePhotos", used: 2 }]);
    expect(planNeeded(draft)).toBe("royal");
  });
});
