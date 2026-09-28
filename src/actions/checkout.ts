"use server";

import { z } from "zod";
import { getAccount } from "@/lib/auth/server";
import {
  confirmCheckout,
  startCheckout,
  type ConfirmResult,
  type StartedCheckout,
} from "@/lib/payments/editions";
import { PAID_PLAN_IDS } from "@/lib/plans/catalog";

/*
 * Buying an edition for an invite (Step 16). The price comes from the server's catalogue
 * and the payment counts only once its signature checks out on the server.
 */

const startSchema = z.object({ inviteId: z.uuid(), planId: z.enum(PAID_PLAN_IDS) });

export async function beginCheckout(input: unknown): Promise<StartedCheckout> {
  const parsed = startSchema.safeParse(input);
  const account = await getAccount();
  if (!parsed.success || !account) return { ok: false, reason: "not-found" };
  return startCheckout(account, parsed.data.inviteId, parsed.data.planId).catch(
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
