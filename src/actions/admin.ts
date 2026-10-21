"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { getAdmin } from "@/lib/admin/access";
import { businessSchema, saveBusiness } from "@/lib/payments/business";
import { UI_LOCALES } from "@/i18n/locales";
import { pagePath } from "@/lib/seo/paths";
import {
  OFFERS_TAG,
  createCoupon,
  setCouponActive,
  updateCoupon,
  type NewCoupon,
} from "@/lib/payments/coupons";
import {
  checkoutProvider,
  grantPlan,
  refundOrder,
  setCheckoutSwitch,
  type GrantResult,
  type RefundResult,
} from "@/lib/payments/editions";
import { checkConnection, type ConnectionCheck } from "@/lib/payments/razorpay";
import { PAID_PLAN_IDS } from "@/lib/plans/catalog";
import { allDesignIds, defaultTier } from "@/lib/plans/design-defaults";
import { DESIGN_TIERS, pricesInOrder } from "@/lib/plans/design-tiers";
import { pricingSchema } from "@/lib/plans/pricing-schema";
import { AUDIENCES, COUPON_CODE, OFFER_ARTS, cleanCouponCode } from "@/lib/plans/offers";
import { PRICING_TAG, getPricing, savePricing } from "@/lib/plans/pricing";
import { isSlug } from "@/lib/publish/slug";
import { TRENDING_TAG, saveTrendingPins } from "@/lib/gallery/trending-store";

/*
 * The master admin's changes. Every call checks the admin again on the server; the
 * database checks once more for settings (row level security on app_settings).
 */

export async function testRazorpay(): Promise<ConnectionCheck | null> {
  if (!(await getAdmin())) return null;
  return checkConnection();
}

export type SwitchResult = { ok: true } | { ok: false; reason: "no-keys" | "failed" };

export async function switchCheckout(on: unknown): Promise<SwitchResult | null> {
  const admin = await getAdmin();
  if (!admin || typeof on !== "boolean") return null;
  // Checkout can't be switched on with nothing to pay through
  if (on && !checkoutProvider()) return { ok: false, reason: "no-keys" };
  const saved = await setCheckoutSwitch(on, admin.account);
  if (!saved) return { ok: false, reason: "failed" };
  revalidatePath("/admin", "layout");
  return { ok: true };
}

const grantSchema = z.object({
  slug: z.string().trim().toLowerCase().refine(isSlug),
  planId: z.enum(PAID_PLAN_IDS),
});

export async function giveEdition(input: unknown): Promise<GrantResult | null> {
  const parsed = grantSchema.safeParse(input);
  if (!(await getAdmin())) return null;
  if (!parsed.success) return { ok: false, reason: "not-found" };
  const result = await grantPlan(parsed.data.slug, parsed.data.planId);
  if (result.ok) revalidatePath("/admin/orders");
  return result;
}

const rupees = z.coerce.number().positive().max(100_000);

const couponSchema = z
  .object({
    code: z.string().transform(cleanCouponCode).pipe(z.string().regex(COUPON_CODE)),
    label: z.string().trim().max(80),
    description: z.string().trim().max(200),
    terms: z.string().trim().max(2000),
    kind: z.enum(["percent", "amount"]),
    value: z.coerce.number().positive(),
    planIds: z.array(z.enum(PAID_PLAN_IDS)).max(3),
    designTiers: z.array(z.enum(DESIGN_TIERS)).max(DESIGN_TIERS.length),
    designIds: z
      .array(z.string())
      .max(300)
      .refine((ids) => ids.every((id) => allDesignIds().includes(id))),
    audience: z.enum(AUDIENCES),
    autoApply: z.boolean(),
    showOnSite: z.boolean(),
    featured: z.boolean(),
    art: z.enum(OFFER_ARTS),
    // Dates as the admin picks them, in India's time
    startsOn: z.union([z.literal(""), z.iso.date()]),
    endsOn: z.union([z.literal(""), z.iso.date()]),
    maxUses: z.union([z.literal(""), z.coerce.number().int().positive().max(1_000_000)]),
    perUserLimit: z.union([z.literal(""), z.coerce.number().int().positive().max(1_000)]),
  })
  .refine((input) => input.kind !== "percent" || (input.value >= 1 && input.value <= 90), {
    path: ["value"],
  })
  .refine((input) => input.kind !== "amount" || rupees.safeParse(input.value).success, {
    path: ["value"],
  })
  .refine((input) => !input.startsOn || !input.endsOn || input.endsOn >= input.startsOn, {
    path: ["endsOn"],
  })
  // The offers page needs a title to show
  .refine((input) => !input.showOnSite || input.label.length > 0, { path: ["label"] });

export type CouponInput = z.input<typeof couponSchema>;
export type AddCouponResult =
  | { ok: true }
  | { ok: false; reason: "invalid" | "taken" | "failed" | "not-migrated"; field?: string };

/** India's midnight at the start of a day, or the end of it. */
const istDay = (day: string, end: boolean) =>
  new Date(`${day}T${end ? "23:59:59.999" : "00:00:00"}+05:30`).toISOString();

function couponFrom(data: z.output<typeof couponSchema>): NewCoupon {
  return {
    code: data.code,
    label: data.label,
    description: data.description,
    terms: data.terms,
    percentOff: data.kind === "percent" ? Math.round(data.value) : null,
    amountOffPaise: data.kind === "amount" ? Math.round(data.value * 100) : null,
    planIds: data.planIds,
    designTiers: data.designTiers,
    designIds: [...new Set(data.designIds)],
    audience: data.audience,
    autoApply: data.autoApply,
    showOnSite: data.showOnSite,
    featured: data.showOnSite && data.featured,
    art: data.art,
    startsAt: data.startsOn ? istDay(data.startsOn, false) : null,
    endsAt: data.endsOn ? istDay(data.endsOn, true) : null,
    maxUses: data.maxUses === "" ? null : data.maxUses,
    perUserLimit: data.perUserLimit === "" ? null : data.perUserLimit,
  };
}

/** The offers page and the home page show offers, so a change clears them too. */
function offersChanged() {
  revalidatePath("/admin/coupons");
  revalidateTag(OFFERS_TAG, { expire: 0 });
}

export async function addCoupon(input: unknown): Promise<AddCouponResult | null> {
  const admin = await getAdmin();
  if (!admin) return null;
  const parsed = couponSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, reason: "invalid", field: String(parsed.error.issues[0]?.path[0] ?? "") };
  }
  const result = await createCoupon(couponFrom(parsed.data), admin.account);
  if (result.ok) offersChanged();
  return result;
}

/** Saves changes to an offer; its code stays as it was. */
export async function editCoupon(id: unknown, input: unknown): Promise<AddCouponResult | null> {
  if (!(await getAdmin())) return null;
  const parsedId = z.uuid().safeParse(id);
  const parsed = couponSchema.safeParse(input);
  if (!parsedId.success) return { ok: false, reason: "failed" };
  if (!parsed.success) {
    return { ok: false, reason: "invalid", field: String(parsed.error.issues[0]?.path[0] ?? "") };
  }
  const result = await updateCoupon(parsedId.data, couponFrom(parsed.data));
  if (result.ok) offersChanged();
  return result;
}

export async function switchCoupon(id: unknown, active: unknown): Promise<boolean> {
  if (!(await getAdmin())) return false;
  const parsedId = z.uuid().safeParse(id);
  if (!parsedId.success || typeof active !== "boolean") return false;
  const done = await setCouponActive(parsedId.data, active);
  if (done) offersChanged();
  return done;
}

export async function saveBusinessDetails(
  input: unknown,
): Promise<"saved" | "invalid" | "failed" | null> {
  const admin = await getAdmin();
  if (!admin) return null;
  const parsed = businessSchema.safeParse(input);
  if (!parsed.success) return "invalid";
  const saved = await saveBusiness(parsed.data, admin.account);
  if (saved) {
    revalidatePath("/admin/business");
    // The contact and policy pages print the business name, address and email
    for (const locale of UI_LOCALES) {
      for (const kind of ["contact", "terms", "refunds", "privacy"] as const) {
        revalidatePath(pagePath({ kind }, locale));
      }
    }
  }
  return saved ? "saved" : "failed";
}

export async function refundPayment(orderId: unknown): Promise<RefundResult | null> {
  if (!(await getAdmin())) return null;
  const parsed = z.uuid().safeParse(orderId);
  if (!parsed.success) return { ok: false, reason: "not-found" };
  const result = await refundOrder(parsed.data);
  if (result.ok) revalidatePath("/admin/orders");
  return result;
}

export type PricingSaveResult = "saved" | "invalid" | "out-of-order" | "failed";

/**
 * Package prices, invite counts and the designs whose tier the admin changed (Admin, Designs), laid over
 * what is saved, so two admins changing different designs don't undo each other. Only
 * tiers that differ from the default are kept, so a design added later starts at its
 * default until changed.
 */
export async function saveDesignPricing(input: unknown): Promise<PricingSaveResult | null> {
  const admin = await getAdmin();
  if (!admin) return null;
  const parsed = pricingSchema.safeParse(input);
  if (!parsed.success) return "invalid";
  if (!pricesInOrder(parsed.data)) return "out-of-order";
  const known = new Set(allDesignIds());
  const saved = (await getPricing()).tiers;
  const tiers = Object.fromEntries(
    Object.entries({ ...saved, ...parsed.data.tiers }).filter(
      ([id, tier]) => known.has(id) && tier !== defaultTier(id),
    ),
  );
  const { designs, packages, invites } = parsed.data;
  if (!(await savePricing({ designs, packages, invites, tiers }, admin.account))) return "failed";
  // Badges and prices show on nearly every page, and checkout charges by them: every page
  // that read them carries the tag, so this refreshes them all
  revalidateTag(PRICING_TAG, { expire: 0 });
  revalidatePath("/admin/designs");
  return "saved";
}

/** The designs the admin pins to the head of the Trending row (Admin, Designs). */
export async function saveTrending(input: unknown): Promise<boolean | null> {
  const admin = await getAdmin();
  if (!admin) return null;
  const parsed = z.array(z.string().max(80)).max(40).safeParse(input);
  if (!parsed.success) return false;
  if (!(await saveTrendingPins(parsed.data, admin.account))) return false;
  revalidateTag(TRENDING_TAG, { expire: 0 });
  revalidatePath("/admin/designs");
  return true;
}
