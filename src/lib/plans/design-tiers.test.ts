import { describe, expect, it } from "vitest";
import { allDesigns } from "@/lib/gallery/catalog";
import { newDraft } from "@/lib/editor/draft";
import { planNeeded, planShortfalls, upgradePricePaise } from "./catalog";
import { allDesignIds, defaultTier, draftDesignId, resolvePricing } from "./design-defaults";
import { DEFAULT_PRICING, parsePricing, pricesInOrder, tierPricePaise } from "./design-tiers";
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
      designs: { premium: 59_900, royal: 79_900 },
      packages: { celebration: 60_000, grand: 2_00_000 },
      invites: { basic: 40, celebration: 400 },
      tiers: { "card-marigold": "royal" },
    });
    expect(resolvePricing(pricing).tiers["card-marigold"]).toBe("royal");
    expect(tierPricePaise(pricing, "royal")).toBe(79_900);
    expect(tierPricePaise(pricing, "free")).toBe(0);
  });

  it("fall back to the defaults when the stored value is broken", () => {
    expect(parsePricing(null)).toEqual(DEFAULT_PRICING);
    expect(parsePricing({ designs: { premium: 0 }, tiers: {} })).toEqual(DEFAULT_PRICING);
  });

  it("keep only the design tiers from settings saved before the packages", () => {
    const old = parsePricing({
      prices: { premium: 59_900, royal: 2_49_900, bundle: 3_49_900 },
      tiers: { "card-marigold": "royal" },
    });
    expect(old.designs).toEqual(DEFAULT_PRICING.designs);
    expect(old.tiers).toEqual({ "card-marigold": "royal" });
  });

  it("need Royal dearer than Premium, Grand above Celebration and more invites in Celebration", () => {
    expect(pricesInOrder(DEFAULT_PRICING)).toBe(true);
    expect(pricesInOrder({ ...DEFAULT_PRICING, designs: { premium: 99_900, royal: 49_900 } })).toBe(
      false,
    );
    expect(
      pricesInOrder({ ...DEFAULT_PRICING, packages: { celebration: 50_000, grand: 50_000 } }),
    ).toBe(false);
    expect(pricesInOrder({ ...DEFAULT_PRICING, invites: { basic: 500, celebration: 50 } })).toBe(
      false,
    );
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

  it("make a Premium design need a package to publish", () => {
    const draft = newDraft();
    expect(planShortfalls(draft, { plan: "free", tier: "free" }, "premium")).toContainEqual({
      limit: "design",
      used: 1,
    });
    expect(planShortfalls(draft, { plan: "basic", tier: "premium" }, "premium")).toEqual([]);
    expect(planNeeded(draft, "royal")).toBe("basic");
  });

  it("charge the admin's prices", () => {
    const pricing = {
      designs: { premium: 59_900, royal: 79_900 },
      packages: { celebration: 60_000, grand: 2_00_000 },
    };
    const free = { plan: "free", tier: "free" } as const;
    expect(upgradePricePaise(free, "basic", "premium", pricing)).toBe(59_900);
    expect(upgradePricePaise({ plan: "basic", tier: "premium" }, "grand", "royal", pricing)).toBe(
      2_20_000,
    );
    expect(priceFor(free, "celebration", "royal", [], null, new Date(), pricing)?.amountPaise).toBe(
      1_39_900,
    );
  });
});
