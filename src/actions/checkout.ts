"use server";

import { z } from "zod";
import { getAccount } from "@/lib/auth/server";
import { checkoutCoupons } from "@/lib/payments/coupons";
import {
  confirmCheckout,
  editionsActive,
  inviteDesign,
  invitePlan,
  startCheckout,
  type ConfirmResult,
  type StartedCheckout,
} from "@/lib/payments/editions";
import { PAID_PLAN_IDS, editionFor, type Edition, type PaidPlanId } from "@/lib/plans/catalog";
import { getPricing } from "@/lib/plans/pricing";
import {
  cleanCouponCode,
  codeProblem,
  pricesFor,
  type CouponProblem,
  type Price,
} from "@/lib/plans/offers";

/*
 * Buying a package for an invite (Step 16). The price comes from the server's catalogue
 * and the payment counts only once its signature checks out on the server.
 */

const code = z.string().trim().max(30).nullable().optional();
/** The design the host is buying for; the server checks it's a real one and prices it. */
const designField = z
  .string()
  .max(80)
  .regex(/^[a-z0-9-]+$/)
  .nullable()
  .optional();
const startSchema = z.object({
  inviteId: z.uuid(),
  planId: z.enum(PAID_PLAN_IDS),
  code,
  design: designField,
});

export async function beginCheckout(input: unknown): Promise<StartedCheckout> {
  const parsed = startSchema.safeParse(input);
  const account = await getAccount();
  if (!parsed.success || !account) return { ok: false, reason: "not-found" };
  const { inviteId, planId } = parsed.data;
  return startCheckout(
    account,
    inviteId,
    planId,
    parsed.data.code || null,
    parsed.data.design ?? null,
  ).catch(() => ({ ok: false, reason: "failed" }) as const);
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
  const parsed = z
    .object({ inviteId: z.uuid(), code: z.string().max(30), design: designField })
    .safeParse(input);
  const account = await getAccount();
  if (!parsed.success || !account) return { ok: false, reason: "unknown" };
  const { inviteId } = parsed.data;
  const [had, chosen] = await Promise.all([
    invitePlan(account, inviteId).catch(() => null),
    inviteDesign(account, inviteId, parsed.data.design ?? null).catch(() => null),
  ]);
  const typed = cleanCouponCode(parsed.data.code);
  if (!had || !chosen || !typed) return { ok: false, reason: "unknown" };
  const current = editionFor(had, chosen.id);
  const design = chosen.tier;
  const coupons = await checkoutCoupons().catch(() => []);
  const now = new Date();
  const problem = codeProblem(current, design, coupons, typed, now);
  if (problem) return { ok: false, reason: problem };
  const pricing = await getPricing();
  return {
    ok: true,
    code: typed,
    prices: pricesFor(current, design, coupons, typed, now, pricing),
  };
}

export type InviteEdition = {
  edition: Edition;
  /** The package paid for and the design it's for, whichever design the editor shows. */
  paid: Edition;
  prices: Partial<Record<PaidPlanId, Price>>;
} | null;

/**
 * An invite's package as it stands on the design the editor shows, and the prices of the
 * others while payments are on, for the editor's notice: a package bought for another
 * design counts for nothing on this one.
 */
export async function inviteEdition(
  inviteId: unknown,
  designId: unknown = null,
): Promise<InviteEdition> {
  const id = z.uuid().safeParse(inviteId);
  const wanted = designField.safeParse(designId);
  const account = await getAccount();
  if (!id.success || !account || !(await editionsActive())) return null;
  const [had, chosen] = await Promise.all([
    invitePlan(account, id.data),
    inviteDesign(account, id.data, wanted.success ? (wanted.data ?? null) : null),
  ]);
  if (!had || !chosen) return null;
  const edition = editionFor(had, chosen.id);
  const [coupons, pricing] = await Promise.all([checkoutCoupons(), getPricing()]);
  return {
    edition,
    paid: had,
    prices: pricesFor(edition, chosen.tier, coupons, null, new Date(), pricing),
  };
}

/**
 * Whether publishing should pass through the packages first: always, until the invite has
 * a package for the design it's made with, whether or not payments are switched on yet.
 * The packages page says which.
 */
export async function needsPackage(inviteId: unknown): Promise<boolean> {
  const id = z.uuid().safeParse(inviteId);
  const account = await getAccount();
  if (!id.success || !account) return false;
  const [edition, chosen] = await Promise.all([
    invitePlan(account, id.data),
    inviteDesign(account, id.data),
  ]);
  if (!edition || !chosen) return false;
  return editionFor(edition, chosen.id).plan === "free";
}
