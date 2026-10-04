import { describe, expect, it } from "vitest";
import { allDesigns } from "@/lib/gallery/catalog";
import { newDraft } from "@/lib/editor/draft";
import { planNeeded, planShortfalls, upgradePricePaise } from "./catalog";
import { allDesignIds, defaultTier, draftDesignId, resolvePricing } from "./design-defaults";
import {
  DEFAULT_PRICING,
  parsePricing,
  pricesInOrder,
  tierPlan,
  tierPricePaise,
} from "./design-tiers";
import { priceFor } from "./offers";

describe("design tiers", () => {
  it("start with free cards, free starter Scenes and a few Royal wedding Stories", () => {
    expect(defaultTier("card-marigold")).toBe("free");
    expect(defaultTier("minimal-white-scene")).toBe("free");
    expect(defaultTier("space-voyage-scene")).toBe("free");
    expect(defaultTier("kayal-scene")).toBe("premium");
    expect(defaultTier("pichwai")).toBe("royal");
    expect(defaultTier("rajwada-bagh")).toBe("premium");
    // Diwali's Story has a god page too, but a festival invite stays Premium
    expect(defaultTier("deepotsav")).toBe("premium");
  });

  it("include some designs of each tier", () => {
    const tiers = allDesigns().map((design) => defaultTier(design.id));
    for (const tier of ["free", "premium", "royal"] as const) expect(tiers).toContain(tier);
  });

  it("list every gallery design for the admin", () => {
    const ids = new Set(allDesignIds());
    for (const design of allDesigns()) expect(ids.has(design.id), design.id).toBe(true);
    expect(Object.keys(resolvePricing(DEFAULT_PRICING).tiers).length).toBe(ids.size);
  });

  it("keep the admin's choice over the default", () => {
    const pricing = parsePricing({
      prices: { premium: 59_900, royal: 2_49_900, bundle: 3_49_900 },
      tiers: { "card-marigold": "royal" },
    });
    expect(resolvePricing(pricing).tiers["card-marigold"]).toBe("royal");
    expect(tierPricePaise(pricing, "royal")).toBe(2_49_900);
    expect(tierPricePaise(pricing, "free")).toBe(0);
  });

  it("fall back to the defaults when the stored value is broken", () => {
    expect(parsePricing(null)).toEqual(DEFAULT_PRICING);
    expect(parsePricing({ prices: { premium: 0 }, tiers: {} })).toEqual(DEFAULT_PRICING);
  });

  it("need each edition to cost more than the one before", () => {
    expect(pricesInOrder(DEFAULT_PRICING.prices)).toBe(true);
    expect(pricesInOrder({ premium: 99_900, royal: 49_900, bundle: 2_99_900 })).toBe(false);
  });

  it("name the design an invite is made with", () => {
    const draft = newDraft();
    expect(draftDesignId({ ...draft, suite: "classic", templateId: "marigold" })).toBe(
      "card-marigold",
    );
    expect(draftDesignId({ ...draft, suite: "kayal", format: "story" })).toBe("kayal");
    expect(draftDesignId({ ...draft, suite: "kayal", format: "scene" })).toBe("kayal-scene");
    expect(draftDesignId({ ...draft, suite: "space-voyage", format: "story" })).toBe(
      "space-voyage-scene",
    );
  });

  it("make a Premium design need Premium to publish", () => {
    const draft = newDraft();
    expect(planShortfalls(draft, "free", tierPlan("premium"))).toContainEqual({
      limit: "design",
      used: 1,
    });
    expect(planShortfalls(draft, "premium", tierPlan("premium"))).toEqual([]);
    expect(planNeeded(draft, tierPlan("royal"))).toBe("royal");
  });

  it("charge the admin's prices", () => {
    const prices = { premium: 59_900, royal: 2_49_900, bundle: 3_49_900 };
    expect(upgradePricePaise("free", "premium", prices)).toBe(59_900);
    expect(upgradePricePaise("premium", "royal", prices)).toBe(1_90_000);
    expect(priceFor("free", "royal", [], null, new Date(), prices)?.amountPaise).toBe(2_49_900);
  });
});
