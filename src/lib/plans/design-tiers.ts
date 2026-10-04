import { z } from "zod";
import { PAID_PLAN_IDS, PLANS, type EditionPrices, type PlanId } from "./catalog";

/*
 * Which designs are free and which need a paid edition, and what each edition costs. The
 * admin decides both (Admin, Designs); until they change one, the defaults below apply.
 * A design's tier is the lowest edition that sends it without the watermark: anyone can
 * open and try every design, and only publishing asks for the tier's edition.
 *
 * This file stays light, for every page's badges; the defaults, which need the whole
 * design catalogue, live in design-defaults.ts and are worked out on the server.
 */

export const DESIGN_TIERS = ["free", "premium", "royal"] as const;
export type DesignTier = (typeof DESIGN_TIERS)[number];

export function isDesignTier(value: unknown): value is DesignTier {
  return typeof value === "string" && (DESIGN_TIERS as readonly string[]).includes(value);
}

/** The edition a tier asks for; the tiers share the editions' names. */
export const tierPlan = (tier: DesignTier): PlanId => tier;

/** Prices in paise, GST included, for each paid edition. */
export type PlanPrices = EditionPrices;

export const DEFAULT_PRICES: PlanPrices = {
  premium: PLANS.premium.pricePaise,
  royal: PLANS.royal.pricePaise,
  bundle: PLANS.bundle.pricePaise,
};

/**
 * Edition prices and design tiers. Stored, `tiers` holds only the designs the admin has
 * changed; handed to pages (resolvePricing), it holds every design.
 */
export type Pricing = {
  prices: PlanPrices;
  /** Gallery design ids ("kayal", "kayal-scene", "card-marigold") to their tier. */
  tiers: Record<string, DesignTier>;
};

export const DEFAULT_PRICING: Pricing = { prices: DEFAULT_PRICES, tiers: {} };

/** Whole rupees from ₹1 to ₹1,00,000, so a typo can't price an edition at nothing. */
const pricePaise = z
  .number()
  .int()
  .min(100)
  .max(1_00_000_00)
  .refine((paise) => paise % 100 === 0);

export const pricingSchema = z.object({
  prices: z.object({ premium: pricePaise, royal: pricePaise, bundle: pricePaise }),
  tiers: z.record(z.string().regex(/^[a-z0-9-]{1,60}$/), z.enum(DESIGN_TIERS)),
});

/** Stored settings, read leniently: anything missing or broken falls back to the defaults. */
export function parsePricing(value: unknown): Pricing {
  const parsed = pricingSchema.safeParse(value);
  if (!parsed.success) return DEFAULT_PRICING;
  return { prices: { ...DEFAULT_PRICES, ...parsed.data.prices }, tiers: parsed.data.tiers };
}

/** Every paid edition costs more than the one below it, so upgrades always cost something. */
export function pricesInOrder(prices: PlanPrices): boolean {
  return PAID_PLAN_IDS.every((id, i) => i === 0 || prices[id] > prices[PAID_PLAN_IDS[i - 1]!]);
}

/** What a tier costs on its own: nothing, or its edition's price. */
export function tierPricePaise(pricing: Pricing, tier: DesignTier): number {
  return tier === "free" ? 0 : pricing.prices[tier];
}
