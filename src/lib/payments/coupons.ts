import "server-only";
import { randomUUID } from "node:crypto";
import { unstable_cache } from "next/cache";
import type { Account } from "@/lib/auth/account";
import { authMode } from "@/lib/auth/mode";
import { isPaidPlanId, type PaidPlanId } from "@/lib/plans/catalog";
import { isDesignTier, type DesignTier } from "@/lib/plans/design-tiers";
import {
  AUDIENCES,
  isOfferArt,
  type Audience,
  type Coupon,
  type OfferArt,
} from "@/lib/plans/offers";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseService } from "@/lib/supabase/service";

/*
 * Coupons, festival offers and the offers page. Admins make, change and switch them off on
 * Admin, Offers (row level security checks is_admin); checkout and the offers page read
 * them as the server.
 */

/** Cleared whenever the admin saves an offer, so the offers page and home page update. */
export const OFFERS_TAG = "offers";

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
  description?: string | null;
  terms?: string | null;
  audience?: string | null;
  design_tiers?: string[] | null;
  design_ids?: string[] | null;
  per_user_limit?: number | null;
  show_on_site?: boolean | null;
  featured?: boolean | null;
  art?: string | null;
};

const BASE_COLUMNS =
  "id, code, label, percent_off, amount_off_paise, plan_ids, auto_apply, starts_at, ends_at, max_uses, used_count, active";
const OFFER_COLUMNS = `${BASE_COLUMNS}, description, terms, audience, design_tiers, design_ids, per_user_limit, show_on_site, featured`;
const COLUMNS = `${OFFER_COLUMNS}, art`;

/** Postgres's "no such column": the offers migration hasn't run yet. */
const missingColumn = (error: { code?: string } | null) => error?.code === "42703";

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
    description: row.description ?? "",
    terms: row.terms ?? "",
    audience: AUDIENCES.includes(row.audience as Audience)
      ? (row.audience as Audience)
      : "everyone",
    designTiers: (row.design_tiers ?? []).filter(isDesignTier),
    designIds: row.design_ids ?? [],
    perUserLimit: row.per_user_limit ?? null,
    showOnSite: row.show_on_site ?? false,
    featured: row.featured ?? false,
    art: isOfferArt(row.art) ? row.art : "festival",
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
  const read = (columns: string) => service.from("coupons").select(columns).eq("active", true);
  let { data, error } = await read(COLUMNS);
  if (missingColumn(error)) ({ data, error } = await read(OFFER_COLUMNS));
  if (missingColumn(error)) ({ data, error } = await read(BASE_COLUMNS));
  return ((data ?? []) as unknown as CouponRow[]).map(fromRow);
}

/** Every coupon, newest first, for the admin. */
export async function allCoupons(): Promise<Coupon[]> {
  if (isPreview()) return [...previewCoupons.values()].reverse();
  const supabase = await supabaseServer();
  if (!supabase) return [];
  const read = (columns: string) =>
    supabase.from("coupons").select(columns).order("created_at", { ascending: false });
  let { data, error } = await read(COLUMNS);
  if (missingColumn(error)) ({ data, error } = await read(OFFER_COLUMNS));
  if (missingColumn(error)) ({ data, error } = await read(BASE_COLUMNS));
  return ((data ?? []) as unknown as CouponRow[]).map(fromRow);
}

/** What the offers page and the home page show of an offer. */
export type SiteOffer = Pick<
  Coupon,
  | "id"
  | "code"
  | "label"
  | "description"
  | "terms"
  | "percentOff"
  | "amountOffPaise"
  | "planIds"
  | "designTiers"
  | "designIds"
  | "audience"
  | "autoApply"
  | "startsAt"
  | "endsAt"
  | "perUserLimit"
  | "featured"
  | "art"
>;

const toSiteOffer = (coupon: Coupon): SiteOffer => ({
  id: coupon.id,
  code: coupon.code,
  label: coupon.label,
  description: coupon.description,
  terms: coupon.terms,
  percentOff: coupon.percentOff,
  amountOffPaise: coupon.amountOffPaise,
  planIds: coupon.planIds,
  designTiers: coupon.designTiers,
  designIds: coupon.designIds,
  audience: coupon.audience,
  autoApply: coupon.autoApply,
  startsAt: coupon.startsAt,
  endsAt: coupon.endsAt,
  perUserLimit: coupon.perUserLimit,
  featured: coupon.featured,
  art: coupon.art,
});

const shownOffers = unstable_cache(
  async (): Promise<SiteOffer[]> => {
    const coupons = await checkoutCoupons();
    return coupons
      .filter((coupon) => coupon.showOnSite)
      .filter((coupon) => coupon.maxUses === null || coupon.usedCount < coupon.maxUses)
      .map(toSiteOffer);
  },
  ["offers", "2026-10-21"],
  // An offer that starts or ends shows or goes within a few minutes
  { tags: [OFFERS_TAG], revalidate: 300 },
);

/**
 * The offers running now that the admin shows on the site, ending soonest first. Festival
 * offers and codes alike; the home page shows the featured ones.
 */
export async function siteOffers(now = new Date()): Promise<SiteOffer[]> {
  const offers = await shownOffers().catch(() => []);
  return offers
    .filter(
      (offer) =>
        (!offer.startsAt || now >= new Date(offer.startsAt)) &&
        (!offer.endsAt || now < new Date(offer.endsAt)),
    )
    .sort((a, b) => (a.endsAt ?? "~").localeCompare(b.endsAt ?? "~"));
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
  description: string;
  terms: string;
  audience: Audience;
  designTiers: DesignTier[];
  designIds: string[];
  perUserLimit: number | null;
  showOnSite: boolean;
  featured: boolean;
  art: OfferArt;
};

const toRow = (input: NewCoupon) => ({
  label: input.label,
  percent_off: input.percentOff,
  amount_off_paise: input.amountOffPaise,
  plan_ids: input.planIds,
  auto_apply: input.autoApply,
  starts_at: input.startsAt,
  ends_at: input.endsAt,
  max_uses: input.maxUses,
  description: input.description,
  terms: input.terms,
  audience: input.audience,
  design_tiers: input.designTiers,
  design_ids: input.designIds,
  per_user_limit: input.perUserLimit,
  show_on_site: input.showOnSite,
  featured: input.featured,
  art: input.art,
});

export type CouponSaveResult =
  { ok: true } | { ok: false; reason: "taken" | "failed" | "not-migrated" };

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
  const { error } = await supabase
    .from("coupons")
    .insert({ code: input.code, ...toRow(input), created_by: admin.id });
  if (missingColumn(error)) return { ok: false, reason: "not-migrated" };
  if (error) return { ok: false, reason: error.code === "23505" ? "taken" : "failed" };
  return { ok: true };
}

/** Changes everything about an offer but its code, which hosts may already have. */
export async function updateCoupon(id: string, input: NewCoupon): Promise<CouponSaveResult> {
  if (isPreview()) {
    const coupon = previewCoupons.get(id);
    if (!coupon) return { ok: false, reason: "failed" };
    previewCoupons.set(id, { ...coupon, ...input, code: coupon.code });
    return { ok: true };
  }
  const supabase = await supabaseServer();
  if (!supabase) return { ok: false, reason: "failed" };
  const { data, error } = await supabase
    .from("coupons")
    .update({ ...toRow(input), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id");
  if (missingColumn(error)) return { ok: false, reason: "not-migrated" };
  if (error || !data?.length) return { ok: false, reason: "failed" };
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
