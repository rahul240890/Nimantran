"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAdmin } from "@/lib/admin/access";
import { businessSchema, saveBusiness } from "@/lib/payments/business";
import { createCoupon, setCouponActive } from "@/lib/payments/coupons";
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
import { COUPON_CODE, cleanCouponCode } from "@/lib/plans/offers";
import { isSlug } from "@/lib/publish/slug";

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
    label: z.string().trim().max(60),
    kind: z.enum(["percent", "amount"]),
    value: z.coerce.number().positive(),
    planIds: z.array(z.enum(PAID_PLAN_IDS)).max(3),
    autoApply: z.boolean(),
    // Dates as the admin picks them, in India's time
    startsOn: z.union([z.literal(""), z.iso.date()]),
    endsOn: z.union([z.literal(""), z.iso.date()]),
    maxUses: z.union([z.literal(""), z.coerce.number().int().positive().max(1_000_000)]),
  })
  .refine((input) => input.kind !== "percent" || (input.value >= 1 && input.value <= 90), {
    path: ["value"],
  })
  .refine((input) => input.kind !== "amount" || rupees.safeParse(input.value).success, {
    path: ["value"],
  })
  .refine((input) => !input.startsOn || !input.endsOn || input.endsOn >= input.startsOn, {
    path: ["endsOn"],
  });

export type CouponInput = z.input<typeof couponSchema>;
export type AddCouponResult =
  { ok: true } | { ok: false; reason: "invalid" | "taken" | "failed"; field?: string };

/** India's midnight at the start of a day, or the end of it. */
const istDay = (day: string, end: boolean) =>
  new Date(`${day}T${end ? "23:59:59.999" : "00:00:00"}+05:30`).toISOString();

export async function addCoupon(input: unknown): Promise<AddCouponResult | null> {
  const admin = await getAdmin();
  if (!admin) return null;
  const parsed = couponSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, reason: "invalid", field: String(parsed.error.issues[0]?.path[0] ?? "") };
  }
  const data = parsed.data;
  const result = await createCoupon(
    {
      code: data.code,
      label: data.label,
      percentOff: data.kind === "percent" ? Math.round(data.value) : null,
      amountOffPaise: data.kind === "amount" ? Math.round(data.value * 100) : null,
      planIds: data.planIds,
      autoApply: data.autoApply,
      startsAt: data.startsOn ? istDay(data.startsOn, false) : null,
      endsAt: data.endsOn ? istDay(data.endsOn, true) : null,
      maxUses: data.maxUses === "" ? null : data.maxUses,
    },
    admin.account,
  );
  if (result.ok) revalidatePath("/admin/coupons");
  return result;
}

export async function switchCoupon(id: unknown, active: unknown): Promise<boolean> {
  if (!(await getAdmin())) return false;
  const parsedId = z.uuid().safeParse(id);
  if (!parsedId.success || typeof active !== "boolean") return false;
  const done = await setCouponActive(parsedId.data, active);
  if (done) revalidatePath("/admin/coupons");
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
  if (saved) revalidatePath("/admin/business");
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
