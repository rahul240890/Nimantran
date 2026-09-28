"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAdmin } from "@/lib/admin/access";
import {
  grantPlan,
  setCheckoutSwitch,
  checkoutProvider,
  type GrantResult,
} from "@/lib/payments/editions";
import { checkConnection, type ConnectionCheck } from "@/lib/payments/razorpay";
import { PAID_PLAN_IDS } from "@/lib/plans/catalog";
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
