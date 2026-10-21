import { describe, expect, it } from "vitest";
import {
  cleanCouponCode,
  codeProblem,
  couponDiscount,
  couponProblem,
  offersFor,
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
  description: "",
  terms: "",
  audience: "everyone",
  designTiers: [],
  designIds: [],
  perUserLimit: null,
  showOnSite: false,
  featured: false,
  art: "festival",
  ...over,
});

describe("coupons", () => {
  it("tidy what hosts type", () => {
    expect(cleanCouponCode(" diwali-25 ")).toBe("DIWALI25");
  });

  it("say why they don't apply", () => {
    expect(couponProblem(coupon({ active: false }), "grand", now)).toBe("inactive");
    expect(couponProblem(coupon({ startsAt: "2026-11-01T00:00:00+05:30" }), "grand", now)).toBe(
      "not-started",
    );
    expect(couponProblem(coupon({ endsAt: "2026-10-01T00:00:00+05:30" }), "grand", now)).toBe(
      "ended",
    );
    expect(couponProblem(coupon({ maxUses: 5, usedCount: 5 }), "grand", now)).toBe("used-up");
    expect(couponProblem(coupon({ planIds: ["celebration"] }), "grand", now)).toBe("wrong-plan");
    expect(couponProblem(coupon(), "grand", now)).toBeNull();
  });

  it("keep to the people and designs they're for", () => {
    const first = { paidOrders: 0, uses: {} };
    const returning = { paidOrders: 2, uses: { c1: 1 } };
    const forFirst = coupon({ audience: "first-order" });
    expect(couponProblem(forFirst, "grand", now, "royal", { buyer: first })).toBeNull();
    expect(couponProblem(forFirst, "grand", now, "royal", { buyer: returning })).toBe(
      "first-order",
    );
    // Nobody known, no offer kept to some people
    expect(couponProblem(forFirst, "grand", now, "royal")).toBe("first-order");
    expect(
      couponProblem(coupon({ audience: "returning" }), "grand", now, "royal", { buyer: first }),
    ).toBe("returning");
    expect(
      couponProblem(coupon({ perUserLimit: 1 }), "grand", now, "royal", { buyer: returning }),
    ).toBe("used-by-you");
    expect(
      couponProblem(coupon({ perUserLimit: 2 }), "grand", now, "royal", { buyer: returning }),
    ).toBeNull();

    const royal = coupon({ designTiers: ["royal"], designIds: ["kayal-scene"] });
    expect(couponProblem(royal, "grand", now, "royal")).toBeNull();
    expect(couponProblem(royal, "grand", now, "premium")).toBe("wrong-design");
    expect(couponProblem(royal, "grand", now, "premium", { designId: "kayal-scene" })).toBeNull();
  });

  it("always leave at least ₹1 to pay", () => {
    expect(couponDiscount(coupon(), 49_900)).toBe(12_500);
    expect(couponDiscount(coupon({ percentOff: null, amountOffPaise: 10_00_000 }), 49_900)).toBe(
      49_800,
    );
  });
});

const FREE = { plan: "free", tier: "free", design: null } as const;

describe("prices", () => {
  it("are the plain package price without coupons", () => {
    expect(priceFor(FREE, "grand", "premium", [], null, now)).toEqual({
      listPaise: 1_09_900,
      discountPaise: 0,
      amountPaise: 1_09_900,
      coupon: null,
    });
    expect(
      priceFor(
        { plan: "grand", tier: "royal", design: null },
        "celebration",
        "premium",
        [],
        null,
        now,
      ),
    ).toBeNull();
  });

  it("use a typed code, but only when it's typed", () => {
    const coupons = [coupon()];
    expect(priceFor(FREE, "basic", "premium", coupons, null, now)!.discountPaise).toBe(0);
    const price = priceFor(FREE, "basic", "premium", coupons, "DIWALI25", now)!;
    expect(price.amountPaise).toBe(37_400);
    expect(price.coupon).toMatchObject({ code: "DIWALI25", auto: false });
  });

  it("apply the best festival offer by itself", () => {
    const coupons = [
      coupon({ id: "a", code: "SMALL", autoApply: true, percentOff: 10 }),
      coupon({ id: "b", code: "BIG", autoApply: true, percentOff: 20 }),
      coupon({ id: "c", code: "OLD", autoApply: true, percentOff: 50, endsAt: "2026-01-01" }),
    ];
    const price = priceFor(FREE, "grand", "premium", coupons, null, now)!;
    expect(price.coupon).toMatchObject({ code: "BIG", auto: true });
    expect(price.amountPaise).toBe(87_900);
  });

  it("cover every package above the current one", () => {
    const basic = { plan: "basic", tier: "premium", design: null } as const;
    expect(Object.keys(pricesFor(basic, "premium", [], null, now))).toEqual([
      "celebration",
      "grand",
    ]);
    expect(Object.keys(pricesFor(FREE, "free", [], null, now))).toEqual(["celebration", "grand"]);
  });

  it("list the codes on the offers page a host can use", () => {
    const fit = { buyer: { paidOrders: 1, uses: {} }, designId: "kayal" };
    const coupons = [
      coupon({ id: "a", code: "SHOWN", showOnSite: true }),
      coupon({ id: "b", code: "HIDDEN" }),
      coupon({ id: "c", code: "AUTO", showOnSite: true, autoApply: true }),
      coupon({ id: "d", code: "FIRST", showOnSite: true, audience: "first-order" }),
    ];
    expect(offersFor(FREE, "premium", coupons, now, fit).map((item) => item.code)).toEqual([
      "SHOWN",
    ]);
  });

  it("explain a code that does nothing", () => {
    expect(codeProblem(FREE, "premium", [coupon()], "NOPE", now)).toBe("unknown");
    expect(
      codeProblem(FREE, "premium", [coupon({ planIds: ["basic"] })], "DIWALI25", now),
    ).toBeNull();
    expect(
      codeProblem(
        { plan: "grand", tier: "royal", design: null },
        "premium",
        [coupon({ planIds: ["basic"] })],
        "DIWALI25",
        now,
      ),
    ).toBe("wrong-plan");
    expect(codeProblem(FREE, "premium", [coupon({ active: false })], "DIWALI25", now)).toBe(
      "inactive",
    );
  });
});
