/*
 * Which designs are free and which cost money, and what the three packages cost on top
 * (docs/PRICING.md). The admin decides all of it (Admin, Designs); until they change
 * something, the defaults below apply. Anyone can open and try every design: only
 * publishing asks for a package.
 *
 * This file stays light, for every page's badges; the defaults, which need the whole
 * design catalogue, live in design-defaults.ts and are worked out on the server, and the
 * checks on saved settings in pricing-schema.ts.
 */

/**
 * Signature began as the moving scenes' tier (owner, 2026-10-09). Since 2026-10-12 the
 * scenes start as Premium (₹499) and the Stories as Royal (₹799); Signature stays for the
 * admin to give any design, no cheaper than Royal. Since 2026-10-20 it is ₹1,099, the
 * templates with a painted centre (26 on) start there.
 */
export const DESIGN_TIERS = ["free", "premium", "royal", "signature"] as const;
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
  designs: { premium: 49_900, royal: 79_900, signature: 109_900 },
  packages: { celebration: 40_000, grand: 60_000 },
  invites: { basic: 100, celebration: 500 },
  tiers: {},
};

/** Whole rupees from ₹1 to ₹1,00,000, so a typo can't price anything at nothing. */
/**
 * Whether what /api/pricing sent is a pricing, which the server has already read with
 * parsePricing (pricing-schema.ts): the browser only checks its shape, without Zod.
 */
export function isPricing(value: unknown): value is Pricing {
  if (!value || typeof value !== "object") return false;
  const pricing = value as Record<keyof Pricing, unknown>;
  return (["designs", "packages", "invites", "tiers"] as const).every(
    (key) => typeof pricing[key] === "object" && pricing[key] !== null,
  );
}

/**
 * Royal designs cost more than Premium ones, Signature no less than Royal, and Grand adds
 * more than Celebration.
 */
export function pricesInOrder(pricing: Pick<Pricing, "designs" | "packages" | "invites">): boolean {
  return (
    pricing.designs.royal > pricing.designs.premium &&
    pricing.designs.signature >= pricing.designs.royal &&
    pricing.packages.grand > pricing.packages.celebration &&
    pricing.invites.celebration > pricing.invites.basic
  );
}

/** What a design of this tier costs on its own: nothing, or the admin's price. */
export function tierPricePaise(pricing: Pick<Pricing, "designs">, tier: DesignTier): number {
  return tier === "free" ? 0 : pricing.designs[tier];
}
