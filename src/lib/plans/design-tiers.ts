import { z } from "zod";

/*
 * Which designs are free and which cost money, and what the three packages cost on top
 * (docs/PRICING.md). The admin decides all of it (Admin, Designs); until they change
 * something, the defaults below apply. Anyone can open and try every design: only
 * publishing asks for a package.
 *
 * This file stays light, for every page's badges; the defaults, which need the whole
 * design catalogue, live in design-defaults.ts and are worked out on the server.
 */

export const DESIGN_TIERS = ["free", "premium", "royal"] as const;
export type DesignTier = (typeof DESIGN_TIERS)[number];

export function isDesignTier(value: unknown): value is DesignTier {
  return typeof value === "string" && (DESIGN_TIERS as readonly string[]).includes(value);
}

export const tierRank = (tier: DesignTier) => DESIGN_TIERS.indexOf(tier);

/** The dearer of two tiers: what an invite has paid for never goes down. */
export const higherTier = (a: DesignTier, b: DesignTier): DesignTier =>
  tierRank(a) >= tierRank(b) ? a : b;

export type PaidTier = Exclude<DesignTier, "free">;

/** The two packages that cost more than the design itself. */
export type AddOnPackage = "celebration" | "grand";

/**
 * Prices in paise, GST included, and the invite counts each package allows. Stored,
 * `tiers` holds only the designs the admin has changed; handed to pages
 * (resolvePricing), it holds every design.
 */
export type Pricing = {
  /** What a paid design costs: its Basic package. Free designs cost nothing. */
  designs: Record<PaidTier, number>;
  /** What Celebration and Grand add on top of the design's price. */
  packages: Record<AddOnPackage, number>;
  /** Invites by link in Basic (and on a free design) and in Celebration; Grand has no limit. */
  invites: { basic: number; celebration: number };
  /** Gallery design ids ("kayal", "kayal-scene", "card-marigold") to their tier. */
  tiers: Record<string, DesignTier>;
};

export const DEFAULT_PRICING: Pricing = {
  designs: { premium: 49_900, royal: 59_900 },
  packages: { celebration: 50_000, grand: 1_50_000 },
  invites: { basic: 50, celebration: 500 },
  tiers: {},
};

/** Whole rupees from ₹1 to ₹1,00,000, so a typo can't price anything at nothing. */
const pricePaise = z
  .number()
  .int()
  .min(100)
  .max(1_00_000_00)
  .refine((paise) => paise % 100 === 0);

const inviteCount = z.number().int().min(1).max(1_00_000);

export const pricingSchema = z.object({
  designs: z.object({ premium: pricePaise, royal: pricePaise }),
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

/** Royal designs cost more than Premium ones, and Grand adds more than Celebration. */
export function pricesInOrder(pricing: Pick<Pricing, "designs" | "packages" | "invites">): boolean {
  return (
    pricing.designs.royal > pricing.designs.premium &&
    pricing.packages.grand > pricing.packages.celebration &&
    pricing.invites.celebration > pricing.invites.basic
  );
}

/** What a design of this tier costs on its own: nothing, or the admin's price. */
export function tierPricePaise(pricing: Pick<Pricing, "designs">, tier: DesignTier): number {
  return tier === "free" ? 0 : pricing.designs[tier];
}
