import { describe, expect, it } from "vitest";
import {
  cleanCouponCode,
  codeProblem,
  couponDiscount,
  couponProblem,
  priceFor,
  pricesFor,
  type Coupon,
} from "./offers";

const now = new Date("2026-10-20T12:00:00+05:30");

const coupon = (over: Partial<Coupon> = {}): Coupon => ({
  id: "c1",
  code: "DIWALI25",
  label: "Diwali offer",
  percentOff: 25,
  amountOffPaise: null,
  planIds: [],
  autoApply: false,
  startsAt: null,
  endsAt: null,
  maxUses: null,
  usedCount: 0,
  active: true,
  ...over,
});

describe("coupons", () => {
  it("tidy what hosts type", () => {
    expect(cleanCouponCode(" diwali-25 ")).toBe("DIWALI25");
  });

  it("say why they don't apply", () => {
    expect(couponProblem(coupon({ active: false }), "royal", now)).toBe("inactive");
    expect(couponProblem(coupon({ startsAt: "2026-11-01T00:00:00+05:30" }), "royal", now)).toBe(
      "not-started",
    );
    expect(couponProblem(coupon({ endsAt: "2026-10-01T00:00:00+05:30" }), "royal", now)).toBe(
      "ended",
    );
    expect(couponProblem(coupon({ maxUses: 5, usedCount: 5 }), "royal", now)).toBe("used-up");
    expect(couponProblem(coupon({ planIds: ["premium"] }), "royal", now)).toBe("wrong-plan");
    expect(couponProblem(coupon(), "royal", now)).toBeNull();
  });

  it("always leave at least ₹1 to pay", () => {
    expect(couponDiscount(coupon(), 49_900)).toBe(12_500);
    expect(couponDiscount(coupon({ percentOff: null, amountOffPaise: 10_00_000 }), 49_900)).toBe(
      49_800,
    );
  });
});

describe("prices", () => {
  it("are the plain upgrade price without coupons", () => {
    expect(priceFor("free", "royal", [], null, now)).toEqual({
      listPaise: 1_99_900,
      discountPaise: 0,
      amountPaise: 1_99_900,
      coupon: null,
    });
    expect(priceFor("royal", "premium", [], null, now)).toBeNull();
  });

  it("use a typed code, but only when it's typed", () => {
    const coupons = [coupon()];
    expect(priceFor("free", "premium", coupons, null, now)!.discountPaise).toBe(0);
    const price = priceFor("free", "premium", coupons, "DIWALI25", now)!;
    expect(price.amountPaise).toBe(37_400);
    expect(price.coupon).toMatchObject({ code: "DIWALI25", auto: false });
  });

  it("apply the best festival offer by itself", () => {
    const coupons = [
      coupon({ id: "a", code: "SMALL", autoApply: true, percentOff: 10 }),
      coupon({ id: "b", code: "BIG", autoApply: true, percentOff: 20 }),
      coupon({ id: "c", code: "OLD", autoApply: true, percentOff: 50, endsAt: "2026-01-01" }),
    ];
    const price = priceFor("free", "royal", coupons, null, now)!;
    expect(price.coupon).toMatchObject({ code: "BIG", auto: true });
    expect(price.amountPaise).toBe(1_59_900);
  });

  it("cover every edition above the current one", () => {
    expect(Object.keys(pricesFor("premium", [], null, now))).toEqual(["royal", "bundle"]);
  });

  it("explain a code that does nothing", () => {
    expect(codeProblem("free", [coupon()], "NOPE", now)).toBe("unknown");
    expect(codeProblem("free", [coupon({ planIds: ["premium"] })], "DIWALI25", now)).toBeNull();
    expect(codeProblem("royal", [coupon({ planIds: ["premium"] })], "DIWALI25", now)).toBe(
      "wrong-plan",
    );
    expect(codeProblem("free", [coupon({ active: false })], "DIWALI25", now)).toBe("inactive");
  });
});
