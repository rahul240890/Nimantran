import { z } from "zod";
import { DEFAULT_PRICING, DESIGN_TIERS, type Pricing } from "./design-tiers";

/* The checks on the pricing the admin saves, on the server only (Zod is heavy for a phone). */

const pricePaise = z
  .number()
  .int()
  .min(100)
  .max(1_00_000_00)
  .refine((paise) => paise % 100 === 0);

const inviteCount = z.number().int().min(1).max(1_00_000);

export const pricingSchema = z.object({
  // Settings saved before Signature existed keep their prices, with Signature at its default
  designs: z.object({
    premium: pricePaise,
    royal: pricePaise,
    signature: pricePaise.default(DEFAULT_PRICING.designs.signature),
  }),
  packages: z.object({ celebration: pricePaise, grand: pricePaise }),
  invites: z.object({ basic: inviteCount, celebration: inviteCount }),
  tiers: z.record(z.string().regex(/^[a-z0-9-]{1,60}$/), z.enum(DESIGN_TIERS)),
});

const tiersSchema = z.object({
  tiers: z.record(z.string().regex(/^[a-z0-9-]{1,60}$/), z.enum(DESIGN_TIERS)),
});

/**
 * Stored settings, read leniently: anything missing or broken falls back to the defaults.
 * Settings saved before the packages (one price per edition) keep only their design tiers.
 */
export function parsePricing(value: unknown): Pricing {
  const parsed = pricingSchema.safeParse(value);
  if (parsed.success) return parsed.data;
  const tiers = tiersSchema.safeParse(value);
  return tiers.success ? { ...DEFAULT_PRICING, tiers: tiers.data.tiers } : DEFAULT_PRICING;
}
