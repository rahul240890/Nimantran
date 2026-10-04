"use server";

import { z } from "zod";
import { getAccount } from "@/lib/auth/server";
import { checkoutCoupons } from "@/lib/payments/coupons";
import {
  confirmCheckout,
  editionsActive,
  invitePlan,
  startCheckout,
  type ConfirmResult,
  type StartedCheckout,
} from "@/lib/payments/editions";
import { PAID_PLAN_IDS, type PaidPlanId, type PlanId } from "@/lib/plans/catalog";
import { getPricing } from "@/lib/plans/pricing";
import {
  cleanCouponCode,
  codeProblem,
  pricesFor,
  type CouponProblem,
  type Price,
} from "@/lib/plans/offers";

/*
 * Buying an edition for an invite (Step 16). The price comes from the server's catalogue
 * and the payment counts only once its signature checks out on the server.
 */

const code = z.string().trim().max(30).nullable().optional();
const startSchema = z.object({
  inviteId: z.uuid(),
  planId: z.enum(PAID_PLAN_IDS),
  code,
});

export async function beginCheckout(input: unknown): Promise<StartedCheckout> {
  const parsed = startSchema.safeParse(input);
  const account = await getAccount();
  if (!parsed.success || !account) return { ok: false, reason: "not-found" };
  const { inviteId, planId } = parsed.data;
  return startCheckout(account, inviteId, planId, parsed.data.code || null).catch(
    () => ({ ok: false, reason: "failed" }) as const,
  );
}

const token = z
  .string()
  .trim()
  .min(1)
  .max(100)
  .regex(/^[A-Za-z0-9_]+$/);
const confirmSchema = z.object({ orderId: token, paymentId: token, signature: token });

export async function finishCheckout(input: unknown): Promise<ConfirmResult> {
  const parsed = confirmSchema.safeParse(input);
  const account = await getAccount();
  if (!parsed.success || !account) return { ok: false, reason: "invalid" };
  return confirmCheckout(account, parsed.data).catch(
    () => ({ ok: false, reason: "failed" }) as const,
  );
}

export type CouponCheck =
  | { ok: true; code: string; prices: Partial<Record<PaidPlanId, Price>> }
  | { ok: false; reason: CouponProblem | "unknown" };

/** Tries a coupon code on an invite: the new prices, or why it doesn't apply. */
export async function tryCoupon(input: unknown): Promise<CouponCheck> {
  const parsed = z.object({ inviteId: z.uuid(), code: z.string().max(30) }).safeParse(input);
  const account = await getAccount();
  if (!parsed.success || !account) return { ok: false, reason: "unknown" };
  const current = await invitePlan(account, parsed.data.inviteId).catch(() => null);
  const typed = cleanCouponCode(parsed.data.code);
  if (!current || !typed) return { ok: false, reason: "unknown" };
  const coupons = await checkoutCoupons().catch(() => []);
  const now = new Date();
  const problem = codeProblem(current, coupons, typed, now);
  if (problem) return { ok: false, reason: problem };
  const { prices } = await getPricing();
  return { ok: true, code: typed, prices: pricesFor(current, coupons, typed, now, prices) };
}

export type InviteEdition = { plan: PlanId; prices: Partial<Record<PaidPlanId, Price>> } | null;

/** An invite's edition and prices while payments are on, for the editor's notice. */
export async function inviteEdition(inviteId: unknown): Promise<InviteEdition> {
  const id = z.uuid().safeParse(inviteId);
  const account = await getAccount();
  if (!id.success || !account || !(await editionsActive())) return null;
  const plan = await invitePlan(account, id.data);
  if (!plan) return null;
  const [coupons, pricing] = await Promise.all([checkoutCoupons(), getPricing()]);
  return { plan, prices: pricesFor(plan, coupons, null, new Date(), pricing.prices) };
}
