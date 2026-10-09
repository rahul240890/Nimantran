import { PAID_PLAN_IDS, upgradePricePaise, type Edition, type PaidPlanId } from "./catalog";
import type { DesignTier, Pricing } from "./design-tiers";

/*
 * Coupons and festival offers (Step 17). A coupon takes a percentage or a fixed amount off
 * one or more packages; a festival offer is a coupon that applies by itself between its
 * dates. The server prices every checkout with these, never the browser.
 */

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
};

export const COUPON_CODE = /^[A-Z0-9]{3,20}$/;

/** "diwali 25" → "DIWALI25". */
export const cleanCouponCode = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, "");

export type CouponProblem = "inactive" | "not-started" | "ended" | "used-up" | "wrong-plan";

/** Why a coupon can't be used for a package now, or null when it can. */
export function couponProblem(coupon: Coupon, planId: PaidPlanId, now: Date): CouponProblem | null {
  if (!coupon.active) return "inactive";
  if (coupon.startsAt && now < new Date(coupon.startsAt)) return "not-started";
  if (coupon.endsAt && now >= new Date(coupon.endsAt)) return "ended";
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) return "used-up";
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
): Price | null {
  const listPaise = upgradePricePaise(current, to, design, pricing);
  if (listPaise === null) return null;
  const usable = coupons.filter((coupon) => couponProblem(coupon, to, now) === null);
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
): Partial<Record<PaidPlanId, Price>> {
  const prices: Partial<Record<PaidPlanId, Price>> = {};
  for (const id of PAID_PLAN_IDS) {
    const price = priceFor(current, id, design, coupons, code, now, pricing);
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
): CouponProblem | "unknown" | null {
  const coupon = coupons.find((item) => item.code === code);
  if (!coupon) return "unknown";
  const problems = PAID_PLAN_IDS.filter(
    (id) => upgradePricePaise(current, id, design) !== null,
  ).map((id) => couponProblem(coupon, id, now));
  if (problems.includes(null)) return null;
  return problems.find((problem) => problem !== "wrong-plan") ?? problems[0] ?? "wrong-plan";
}
