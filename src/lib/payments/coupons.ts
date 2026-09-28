import "server-only";
import { randomUUID } from "node:crypto";
import type { Account } from "@/lib/auth/account";
import { authMode } from "@/lib/auth/mode";
import { isPaidPlanId, type PaidPlanId } from "@/lib/plans/catalog";
import type { Coupon } from "@/lib/plans/offers";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseService } from "@/lib/supabase/service";

/*
 * Coupons and festival offers. Admins make and switch them off on Admin, Coupons (row
 * level security checks is_admin); checkout reads them as the server.
 */

type CouponRow = {
  id: string;
  code: string;
  label: string;
  percent_off: number | null;
  amount_off_paise: number | null;
  plan_ids: string[];
  auto_apply: boolean;
  starts_at: string | null;
  ends_at: string | null;
  max_uses: number | null;
  used_count: number;
  active: boolean;
};

const COLUMNS =
  "id, code, label, percent_off, amount_off_paise, plan_ids, auto_apply, starts_at, ends_at, max_uses, used_count, active";

function fromRow(row: CouponRow): Coupon {
  return {
    id: row.id,
    code: row.code,
    label: row.label,
    percentOff: row.percent_off,
    amountOffPaise: row.amount_off_paise,
    planIds: row.plan_ids.filter(isPaidPlanId),
    autoApply: row.auto_apply,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    maxUses: row.max_uses,
    usedCount: row.used_count,
    active: row.active,
  };
}

const holder = globalThis as unknown as { __shubhPreviewCoupons?: Map<string, Coupon> };
const previewCoupons = (holder.__shubhPreviewCoupons ??= new Map());
const isPreview = () => authMode() === "preview";

/** Coupons checkout may use: switched on, whatever their dates (pricing checks those). */
export async function checkoutCoupons(): Promise<Coupon[]> {
  if (isPreview()) return [...previewCoupons.values()].filter((coupon) => coupon.active);
  const service = supabaseService();
  if (!service) return [];
  const { data } = await service.from("coupons").select(COLUMNS).eq("active", true);
  return ((data ?? []) as CouponRow[]).map(fromRow);
}

/** Every coupon, newest first, for the admin. */
export async function allCoupons(): Promise<Coupon[]> {
  if (isPreview()) return [...previewCoupons.values()].reverse();
  const supabase = await supabaseServer();
  if (!supabase) return [];
  const { data } = await supabase
    .from("coupons")
    .select(COLUMNS)
    .order("created_at", { ascending: false });
  return ((data ?? []) as CouponRow[]).map(fromRow);
}

export type NewCoupon = {
  code: string;
  label: string;
  percentOff: number | null;
  amountOffPaise: number | null;
  planIds: PaidPlanId[];
  autoApply: boolean;
  startsAt: string | null;
  endsAt: string | null;
  maxUses: number | null;
};

export type CouponSaveResult = { ok: true } | { ok: false; reason: "taken" | "failed" };

export async function createCoupon(input: NewCoupon, admin: Account): Promise<CouponSaveResult> {
  if (isPreview()) {
    if ([...previewCoupons.values()].some((coupon) => coupon.code === input.code)) {
      return { ok: false, reason: "taken" };
    }
    const id = randomUUID();
    previewCoupons.set(id, { ...input, id, usedCount: 0, active: true });
    return { ok: true };
  }
  const supabase = await supabaseServer();
  if (!supabase) return { ok: false, reason: "failed" };
  const { error } = await supabase.from("coupons").insert({
    code: input.code,
    label: input.label,
    percent_off: input.percentOff,
    amount_off_paise: input.amountOffPaise,
    plan_ids: input.planIds,
    auto_apply: input.autoApply,
    starts_at: input.startsAt,
    ends_at: input.endsAt,
    max_uses: input.maxUses,
    created_by: admin.id,
  });
  if (error) return { ok: false, reason: error.code === "23505" ? "taken" : "failed" };
  return { ok: true };
}

export async function setCouponActive(id: string, active: boolean): Promise<boolean> {
  if (isPreview()) {
    const coupon = previewCoupons.get(id);
    if (coupon) coupon.active = active;
    return Boolean(coupon);
  }
  const supabase = await supabaseServer();
  if (!supabase) return false;
  const { data, error } = await supabase
    .from("coupons")
    .update({ active })
    .eq("id", id)
    .select("id");
  return !error && (data?.length ?? 0) > 0;
}

/** Counts a use once the order it was on is paid. */
export async function countCouponUse(id: string): Promise<void> {
  if (isPreview()) {
    const coupon = previewCoupons.get(id);
    if (coupon) coupon.usedCount += 1;
    return;
  }
  await supabaseService()?.rpc("use_coupon", { p_coupon: id });
}
