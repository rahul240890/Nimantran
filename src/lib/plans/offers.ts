import { PAID_PLAN_IDS, upgradePricePaise, type Edition, type PaidPlanId } from "./catalog";
import type { DesignTier, Pricing } from "./design-tiers";

/*
 * Coupons and festival offers (Step 17). A coupon takes a percentage or a fixed amount off
 * one or more packages; a festival offer is a coupon that applies by itself between its
 * dates. An offer can be kept to some designs, to a first booking or to people who have
 * booked before, and to a number of uses per account, and can show on the offers page and
 * the home page. The server prices every checkout with these, never the browser.
 */

export const AUDIENCES = ["everyone", "first-order", "returning"] as const;
export type Audience = (typeof AUDIENCES)[number];

/** Painted occasion tiles (public/occasions) an offer can show; the festival one by default. */
export const OFFER_ARTS = [
  "festival",
  "wedding",
  "engagement",
  "haldi",
  "mehendi",
  "sangeet",
  "anniversary",
  "birthday",
  "baby",
  "housewarming",
  "party",
  "business",
] as const;
export type OfferArt = (typeof OFFER_ARTS)[number];

export const isOfferArt = (value: unknown): value is OfferArt =>
  OFFER_ARTS.includes(value as OfferArt);

export const offerArtImage = (art: OfferArt) => `/occasions/${art}.webp`;

export type Coupon = {
  id: string;
  code: string;
  label: string;
  percentOff: number | null;
  amountOffPaise: number | null;
  /** Packages it applies to; empty means every package. */
  planIds: PaidPlanId[];
  autoApply: boolean;
  startsAt: string | null;
  endsAt: string | null;
  maxUses: number | null;
  usedCount: number;
  active: boolean;
  /** One line for the offers page. */
  description: string;
  terms: string;
  audience: Audience;
  /** Design tiers and named designs it covers; both empty means every design. */
  designTiers: DesignTier[];
  designIds: string[];
  /** Times one account may use it; null for no limit. */
  perUserLimit: number | null;
  /** Shown on the offers page, and on the home page too when featured. */
  showOnSite: boolean;
  featured: boolean;
  /** The painting it shows on the site. */
  art: OfferArt;
};

/** What checkout knows of the person paying: their bookings so far and coupons used. */
export type Buyer = {
  /** Packages they have bought, refunded ones included. */
  paidOrders: number;
  /** Times they have used each coupon, by its id. */
  uses: Record<string, number>;
};

/** Who is buying, and the design: what an offer kept to some people or designs needs. */
export type Fit = { buyer?: Buyer | null; designId?: string | null };

export const COUPON_CODE = /^[A-Z0-9]{3,20}$/;

/** "diwali 25" → "DIWALI25". */
export const cleanCouponCode = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, "");

export type CouponProblem =
  | "inactive"
  | "not-started"
  | "ended"
  | "used-up"
  | "first-order"
  | "returning"
  | "used-by-you"
  | "wrong-design"
  | "wrong-plan";

/** Whether an offer covers a design, by its tier or by name. */
export function coversDesign(coupon: Coupon, tier: DesignTier, designId: string | null): boolean {
  if (coupon.designTiers.length === 0 && coupon.designIds.length === 0) return true;
  return (
    coupon.designTiers.includes(tier) || (designId !== null && coupon.designIds.includes(designId))
  );
}

/**
 * Why a coupon can't be used for a package now, or null when it can: on a design, when the
 * tier is given, and by the person buying, when `fit` says who. An offer kept to a first
 * booking or to people who have booked before never applies when the buyer isn't known.
 */
export function couponProblem(
  coupon: Coupon,
  planId: PaidPlanId,
  now: Date,
  tier?: DesignTier,
  fit: Fit = {},
): CouponProblem | null {
  if (!coupon.active) return "inactive";
  if (coupon.startsAt && now < new Date(coupon.startsAt)) return "not-started";
  if (coupon.endsAt && now >= new Date(coupon.endsAt)) return "ended";
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) return "used-up";
  const { buyer = null, designId = null } = fit;
  if (coupon.audience === "first-order" && (!buyer || buyer.paidOrders > 0)) return "first-order";
  if (coupon.audience === "returning" && (!buyer || buyer.paidOrders === 0)) return "returning";
  if (coupon.perUserLimit !== null && (buyer?.uses[coupon.id] ?? 0) >= coupon.perUserLimit) {
    return "used-by-you";
  }
  if (tier && !coversDesign(coupon, tier, designId)) return "wrong-design";
  if (coupon.planIds.length > 0 && !coupon.planIds.includes(planId)) return "wrong-plan";
  return null;
}

/** How much a coupon takes off a price, in whole rupees. At least ₹1 is always left to pay. */
export function couponDiscount(coupon: Coupon, pricePaise: number): number {
  const off =
    coupon.percentOff !== null
      ? // Whole rupees, so prices stay tidy: 20% off ₹499 is ₹100
        Math.round((pricePaise * coupon.percentOff) / 100 / 100) * 100
      : (coupon.amountOffPaise ?? 0);
  return Math.max(0, Math.min(off, pricePaise - 100));
}

export type Price = {
  /** The upgrade's price before any coupon. */
  listPaise: number;
  discountPaise: number;
  /** What the host pays. */
  amountPaise: number;
  coupon: { id: string; code: string; label: string; auto: boolean } | null;
};

/**
 * What buying a package costs this invite now: the code the host typed when it works for
 * this package, else the best festival offer running, else the plain price.
 */
export function priceFor(
  current: Edition,
  to: PaidPlanId,
  design: DesignTier,
  coupons: readonly Coupon[],
  code: string | null,
  now: Date,
  pricing?: Pick<Pricing, "designs" | "packages">,
  fit: Fit = {},
): Price | null {
  const listPaise = upgradePricePaise(current, to, design, pricing);
  if (listPaise === null) return null;
  const usable = coupons.filter((coupon) => couponProblem(coupon, to, now, design, fit) === null);
  const typed = code ? usable.find((coupon) => coupon.code === code) : undefined;
  const candidates = typed ? [typed] : usable.filter((coupon) => coupon.autoApply);
  let best: Coupon | null = null;
  let bestOff = 0;
  for (const coupon of candidates) {
    const off = couponDiscount(coupon, listPaise);
    if (off > bestOff) [best, bestOff] = [coupon, off];
  }
  return {
    listPaise,
    discountPaise: bestOff,
    amountPaise: listPaise - bestOff,
    coupon: best
      ? { id: best.id, code: best.code, label: best.label, auto: best.autoApply && !typed }
      : null,
  };
}

/** Prices for every package this invite can buy, as the package cards show them. */
export function pricesFor(
  current: Edition,
  design: DesignTier,
  coupons: readonly Coupon[],
  code: string | null,
  now: Date,
  pricing?: Pick<Pricing, "designs" | "packages">,
  fit: Fit = {},
): Partial<Record<PaidPlanId, Price>> {
  const prices: Partial<Record<PaidPlanId, Price>> = {};
  for (const id of PAID_PLAN_IDS) {
    const price = priceFor(current, id, design, coupons, code, now, pricing, fit);
    if (price) prices[id] = price;
  }
  return prices;
}

/** Whether a typed code does anything for any package this invite can buy. */
export function codeProblem(
  current: Edition,
  design: DesignTier,
  coupons: readonly Coupon[],
  code: string,
  now: Date,
  fit: Fit = {},
): CouponProblem | "unknown" | null {
  const coupon = coupons.find((item) => item.code === code);
  if (!coupon) return "unknown";
  const problems = PAID_PLAN_IDS.filter(
    (id) => upgradePricePaise(current, id, design) !== null,
  ).map((id) => couponProblem(coupon, id, now, design, fit));
  if (problems.includes(null)) return null;
  return problems.find((problem) => problem !== "wrong-plan") ?? problems[0] ?? "wrong-plan";
}

/**
 * The codes on the offers page this buyer could type for this invite now, for the
 * checkout's "Offers for you". Festival offers aren't listed: they apply by themselves.
 */
export function offersFor(
  current: Edition,
  design: DesignTier,
  coupons: readonly Coupon[],
  now: Date,
  fit: Fit,
): Coupon[] {
  return coupons.filter(
    (coupon) =>
      coupon.showOnSite &&
      !coupon.autoApply &&
      codeProblem(current, design, [coupon], coupon.code, now, fit) === null,
  );
}
