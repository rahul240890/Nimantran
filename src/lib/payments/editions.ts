import "server-only";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import type { Account } from "@/lib/auth/account";
import { authMode } from "@/lib/auth/mode";
import { previewDb, previewHosts } from "@/lib/invites/preview-db";
import {
  PLANS,
  isPaidPlanId,
  isPlanId,
  planRank,
  type PaidPlanId,
  type PlanId,
} from "@/lib/plans/catalog";
import { cleanCouponCode, priceFor } from "@/lib/plans/offers";
import { supabasePublic } from "@/lib/supabase/public";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseService } from "@/lib/supabase/service";
import { checkoutCoupons, countCouponUse } from "./coupons";
import { invoiceNumber } from "./invoice";
import {
  createRazorpayOrder,
  paymentSignatureValid,
  razorpayKeys,
  refundRazorpayPayment,
  type RazorpayMode,
} from "./razorpay";

/*
 * Editions (Steps 15 to 17): each invite is Free until its host buys Premium, Royal or the
 * Wedding bundle for it. The server records a payment only after checking Razorpay's
 * signature, and writes orders and editions as itself (the service role): no signed-in
 * connection can mark anything paid. Preview mode keeps the same flow in memory, with a
 * stand-in checkout, so tests can follow a purchase.
 */

export type OrderStatus = "created" | "paid" | "failed" | "refunded";

export type Order = {
  id: string;
  eventId: string | null;
  userId: string | null;
  planId: PaidPlanId;
  fromPlanId: PlanId;
  /** The upgrade's price before any coupon. */
  listPricePaise: number;
  discountPaise: number;
  couponId: string | null;
  couponCode: string | null;
  /** What was paid. */
  amountPaise: number;
  status: OrderStatus;
  providerOrderId: string;
  providerPaymentId: string | null;
  mode: RazorpayMode | "preview";
  createdAt: string;
  paidAt: string | null;
  invoiceNo: string | null;
  refundedAt: string | null;
};

/** An order as the admin's list shows it, with the invite it was for. */
export type AdminOrder = Order & { slug: string | null; names: string };

type PreviewPayments = {
  plans: Map<string, { planId: PaidPlanId; source: "purchase" | "admin"; orderId?: string }>;
  orders: Map<string, Order>;
  invoices?: number;
};

const holder = globalThis as unknown as { __shubhPreviewPayments?: PreviewPayments };
const preview: PreviewPayments = (holder.__shubhPreviewPayments ??= {
  plans: new Map(),
  orders: new Map(),
});

const isPreview = () => authMode() === "preview";

/* ---------- Settings ---------- */

/*
 * In preview mode the switch lives in a cookie on the browser that flipped it, so tests
 * running side by side each see their own setting.
 */
const PREVIEW_CHECKOUT_COOKIE = "shubh-preview-checkout";

/** Whether an admin has turned checkout on (Admin, Razorpay). Off until then. */
export async function checkoutSwitchedOn(): Promise<boolean> {
  if (isPreview()) return (await cookies()).get(PREVIEW_CHECKOUT_COOKIE)?.value === "on";
  const supabase = supabasePublic();
  if (!supabase) return false;
  const { data, error } = await supabase.rpc("checkout_enabled");
  return !error && data === true;
}

/** Only an admin's connection can write settings (row level security checks is_admin). */
export async function setCheckoutSwitch(on: boolean, admin: Account): Promise<boolean> {
  if (isPreview()) {
    const store = await cookies();
    if (on)
      store.set(PREVIEW_CHECKOUT_COOKIE, "on", { httpOnly: true, sameSite: "lax", path: "/" });
    else store.delete(PREVIEW_CHECKOUT_COOKIE);
    return true;
  }
  const supabase = await supabaseServer();
  if (!supabase) return false;
  const { error } = await supabase.from("app_settings").upsert({
    key: "payments",
    value: { checkoutEnabled: on },
    updated_at: new Date().toISOString(),
    updated_by: admin.id,
  });
  return !error;
}

export type CheckoutProvider = "razorpay" | "preview";

/** How hosts pay right now: through Razorpay, the preview stand-in, or not at all. */
export function checkoutProvider(): CheckoutProvider | null {
  if (razorpayKeys()) return "razorpay";
  return isPreview() ? "preview" : null;
}

/**
 * Whether editions apply: checkout switched on and a way to pay. Until then every invite
 * publishes with everything and no watermark, as before payments existed.
 */
export async function editionsActive(): Promise<boolean> {
  return Boolean(checkoutProvider()) && (await checkoutSwitchedOn());
}

/* ---------- Editions ---------- */

/**
 * Whether this person created the invite. Only they pay for it: co-hosts help run it,
 * but the receipt, the GST invoice and any refund belong to the owner.
 */
export async function ownsInvite(account: Account, eventId: string): Promise<boolean> {
  if (isPreview()) return previewDb.invites.get(eventId)?.owner === account.id;
  const supabase = await supabaseServer();
  if (!supabase) return false;
  const { data } = await supabase.from("events").select("owner_id").eq("id", eventId).maybeSingle();
  return data?.owner_id === account.id;
}

/** The edition a host's invite has; null when this person can't see the invite. */
export async function invitePlan(account: Account, eventId: string): Promise<PlanId | null> {
  if (isPreview()) {
    const stored = previewDb.invites.get(eventId);
    if (!stored || !previewHosts(stored, account.id)) return null;
    return preview.plans.get(eventId)?.planId ?? "free";
  }
  const supabase = await supabaseServer();
  if (!supabase) return null;
  const { data: event } = await supabase
    .from("events")
    .select("id")
    .eq("id", eventId)
    .maybeSingle();
  if (!event) return null;
  const { data } = await supabase
    .from("event_plans")
    .select("plan_id")
    .eq("event_id", eventId)
    .maybeSingle();
  return isPlanId(data?.plan_id) ? data.plan_id : "free";
}

/** A published invite's edition, for its guest page. */
export async function publishedPlan(slug: string, eventId: string): Promise<PlanId> {
  if (isPreview()) return preview.plans.get(eventId)?.planId ?? "free";
  const supabase = supabasePublic();
  if (!supabase) return "free";
  const { data, error } = await supabase.rpc("published_invite_plan", { p_slug: slug });
  return !error && isPlanId(data) ? data : "free";
}

/** Whether the guest page carries "Made with Shubh". */
export async function showsWatermark(slug: string, eventId: string): Promise<boolean> {
  if (!(await editionsActive())) return false;
  return PLANS[await publishedPlan(slug, eventId)].watermark;
}

/* ---------- Checkout ---------- */

export type StartedCheckout =
  | {
      ok: true;
      provider: CheckoutProvider;
      /** Razorpay's order id; the checkout pays this order. */
      orderId: string;
      amountPaise: number;
      keyId: string | null;
    }
  | { ok: false; reason: "off" | "not-found" | "already" | "failed" };

/**
 * Opens an order for the difference between the invite's edition and the one chosen, less
 * the coupon the host typed or the festival offer running.
 */
export async function startCheckout(
  account: Account,
  eventId: string,
  planId: PaidPlanId,
  code: string | null = null,
): Promise<StartedCheckout> {
  const provider = checkoutProvider();
  if (!provider || !(await checkoutSwitchedOn())) return { ok: false, reason: "off" };
  const [current, owner] = await Promise.all([
    invitePlan(account, eventId),
    ownsInvite(account, eventId),
  ]);
  if (!current || !owner) return { ok: false, reason: "not-found" };
  const price = priceFor(
    current,
    planId,
    await checkoutCoupons(),
    code ? cleanCouponCode(code) : null,
    new Date(),
  );
  if (!price) return { ok: false, reason: "already" };
  const { amountPaise } = price;
  const base = {
    eventId,
    userId: account.id,
    planId,
    fromPlanId: current,
    listPricePaise: price.listPaise,
    discountPaise: price.discountPaise,
    couponId: price.coupon?.id ?? null,
    couponCode: price.coupon?.code ?? null,
    amountPaise,
    status: "created" as const,
    providerPaymentId: null,
    createdAt: new Date().toISOString(),
    paidAt: null,
    invoiceNo: null,
    refundedAt: null,
  };

  if (provider === "preview") {
    const orderId = `order_preview_${randomUUID().replace(/-/g, "").slice(0, 14)}`;
    preview.orders.set(orderId, {
      ...base,
      id: randomUUID(),
      providerOrderId: orderId,
      mode: "preview",
    });
    return { ok: true, provider, orderId, amountPaise, keyId: null };
  }

  const keys = razorpayKeys();
  const service = supabaseService();
  if (!keys || !service) return { ok: false, reason: "failed" };
  const order = await createRazorpayOrder(keys, {
    amountPaise,
    receipt: `inv_${eventId.slice(0, 8)}_${Date.now().toString(36)}`,
    notes: {
      event_id: eventId,
      plan_id: planId,
      from_plan_id: current,
      coupon: price.coupon?.code ?? "",
    },
  });
  if (!order || order.amount !== amountPaise) return { ok: false, reason: "failed" };
  const { error } = await service.from("orders").insert({
    event_id: eventId,
    user_id: account.id,
    plan_id: planId,
    from_plan_id: current,
    list_price_paise: price.listPaise,
    discount_paise: price.discountPaise,
    coupon_id: price.coupon?.id ?? null,
    amount_paise: amountPaise,
    provider_order_id: order.id,
    mode: keys.mode,
  });
  if (error) return { ok: false, reason: "failed" };
  return { ok: true, provider, orderId: order.id, amountPaise, keyId: keys.keyId };
}

export type ConfirmResult =
  { ok: true; planId: PaidPlanId } | { ok: false; reason: "invalid" | "failed" };

/** The checkout's answer: checked against the key secret, then the edition unlocks. */
export async function confirmCheckout(
  account: Account,
  input: { orderId: string; paymentId: string; signature: string },
): Promise<ConfirmResult> {
  if (checkoutProvider() === "preview") {
    const order = preview.orders.get(input.orderId);
    if (!order || order.userId !== account.id || input.signature !== "preview") {
      return { ok: false, reason: "invalid" };
    }
    const paid = await fulfilOrder(input.orderId, input.paymentId);
    return paid ? { ok: true, planId: paid } : { ok: false, reason: "failed" };
  }
  const keys = razorpayKeys();
  const service = supabaseService();
  if (!keys || !service) return { ok: false, reason: "failed" };
  if (!paymentSignatureValid(keys.keySecret, input.orderId, input.paymentId, input.signature)) {
    return { ok: false, reason: "invalid" };
  }
  const { data: order } = await service
    .from("orders")
    .select("user_id")
    .eq("provider_order_id", input.orderId)
    .maybeSingle();
  if (!order || order.user_id !== account.id) return { ok: false, reason: "invalid" };
  const paid = await fulfilOrder(input.orderId, input.paymentId);
  return paid ? { ok: true, planId: paid } : { ok: false, reason: "failed" };
}

/**
 * Marks an order paid and gives its invite the edition. Safe to call twice (the checkout
 * and the webhook both do): the second call finds the order paid and changes nothing.
 * Returns the edition, or null for an unknown order.
 */
export async function fulfilOrder(
  providerOrderId: string,
  paymentId: string,
): Promise<PaidPlanId | null> {
  const now = new Date().toISOString();
  if (isPreview()) {
    const order = preview.orders.get(providerOrderId);
    if (!order) return null;
    if (order.status === "created" || order.status === "failed") {
      preview.invoices = (preview.invoices ?? 0) + 1;
      Object.assign(order, {
        status: "paid",
        providerPaymentId: paymentId,
        paidAt: now,
        invoiceNo: invoiceNumber(new Date(now), preview.invoices),
      });
      if (order.couponId) await countCouponUse(order.couponId);
      if (order.eventId) raisePreviewPlan(order.eventId, order.planId, "purchase", order.id);
    }
    return order.planId;
  }
  const service = supabaseService();
  if (!service) return null;
  const { data: order } = await service
    .from("orders")
    .select("id, event_id, plan_id, status, coupon_id")
    .eq("provider_order_id", providerOrderId)
    .maybeSingle();
  if (!order || !isPaidPlanId(order.plan_id)) return null;
  // A refunded order stays refunded, whatever arrives late
  if (order.status === "refunded") return order.plan_id;
  // A failed attempt can still be paid: Razorpay's checkout lets the host try again
  if (order.status === "created" || order.status === "failed") {
    const { data: changed, error } = await service
      .from("orders")
      .update({ status: "paid", provider_payment_id: paymentId, paid_at: now })
      .eq("id", order.id)
      .in("status", ["created", "failed"])
      .select("id");
    if (error) return null;
    // Only the call that marked it paid counts the coupon
    if (changed?.length && order.coupon_id) await countCouponUse(order.coupon_id);
  }
  // Numbered once; a second call returns the same number
  await service.rpc("assign_invoice_no", { p_order: order.id });
  if (order.event_id) {
    const raised = await raisePlan(order.event_id, order.plan_id, "purchase", order.id);
    if (!raised) return null;
  }
  return order.plan_id;
}

/** Records a failed payment, so the admin's list shows it. */
export async function markOrderFailed(providerOrderId: string): Promise<void> {
  if (isPreview()) {
    const order = preview.orders.get(providerOrderId);
    if (order?.status === "created") order.status = "failed";
    return;
  }
  await supabaseService()
    ?.from("orders")
    .update({ status: "failed" })
    .eq("provider_order_id", providerOrderId)
    .eq("status", "created");
}

function raisePreviewPlan(
  eventId: string,
  planId: PaidPlanId,
  source: "purchase" | "admin",
  orderId?: string,
) {
  const current = preview.plans.get(eventId)?.planId ?? "free";
  if (planRank(planId) > planRank(current)) preview.plans.set(eventId, { planId, source, orderId });
}

/** Gives an invite an edition, never lowering one it already has. */
async function raisePlan(
  eventId: string,
  planId: PaidPlanId,
  source: "purchase" | "admin",
  orderId: string | null,
): Promise<boolean> {
  const service = supabaseService();
  if (!service) return false;
  const { data: existing } = await service
    .from("event_plans")
    .select("plan_id")
    .eq("event_id", eventId)
    .maybeSingle();
  if (isPlanId(existing?.plan_id) && planRank(existing.plan_id) >= planRank(planId)) return true;
  const { error } = await service.from("event_plans").upsert({
    event_id: eventId,
    plan_id: planId,
    source,
    order_id: orderId,
    updated_at: new Date().toISOString(),
  });
  return !error;
}

/* ---------- Orders ---------- */

type OrderRow = {
  id: string;
  event_id: string | null;
  user_id: string | null;
  plan_id: string;
  from_plan_id: string;
  list_price_paise: number | null;
  discount_paise: number;
  coupon_id: string | null;
  amount_paise: number;
  status: OrderStatus;
  provider_order_id: string;
  provider_payment_id: string | null;
  mode: RazorpayMode;
  created_at: string;
  paid_at: string | null;
  invoice_no: string | null;
  refunded_at: string | null;
  coupons?: { code: string } | null;
  events?: { slug: string | null; content: Record<string, string> | null } | null;
};

const ORDER_COLUMNS =
  "id, event_id, user_id, plan_id, from_plan_id, list_price_paise, discount_paise, coupon_id, amount_paise, status, provider_order_id, provider_payment_id, mode, created_at, paid_at, invoice_no, refunded_at, coupons(code)";

function orderFromRow(row: OrderRow): Order {
  return {
    id: row.id,
    eventId: row.event_id,
    userId: row.user_id,
    planId: isPaidPlanId(row.plan_id) ? row.plan_id : "premium",
    fromPlanId: isPlanId(row.from_plan_id) ? row.from_plan_id : "free",
    listPricePaise: row.list_price_paise ?? row.amount_paise + row.discount_paise,
    discountPaise: row.discount_paise,
    couponId: row.coupon_id,
    couponCode: row.coupons?.code ?? null,
    amountPaise: row.amount_paise,
    status: row.status,
    providerOrderId: row.provider_order_id,
    providerPaymentId: row.provider_payment_id,
    mode: row.mode,
    createdAt: row.created_at,
    paidAt: row.paid_at,
    invoiceNo: row.invoice_no,
    refundedAt: row.refunded_at,
  };
}

function namesOf(content: Record<string, string> | null | undefined): string {
  const first = content?.first?.trim() ?? "";
  const second = content?.second?.trim() ?? "";
  return [first, second].filter(Boolean).join(" & ");
}

/** An invite's paid and refunded orders, newest first, for the host's receipts. */
export async function inviteReceipts(account: Account, eventId: string): Promise<Order[]> {
  if (isPreview()) {
    return [...preview.orders.values()]
      .filter(
        (o) =>
          o.eventId === eventId &&
          o.userId === account.id &&
          (o.status === "paid" || o.status === "refunded"),
      )
      .reverse();
  }
  const supabase = await supabaseServer();
  if (!supabase) return [];
  const { data } = await supabase
    .from("orders")
    .select(ORDER_COLUMNS)
    .eq("event_id", eventId)
    .in("status", ["paid", "refunded"])
    .order("created_at", { ascending: false });
  return ((data ?? []) as unknown as OrderRow[]).map(orderFromRow);
}

/** Every order, newest first, for the admin (the page checks the admin first). */
export async function adminOrders(limit = 100): Promise<AdminOrder[]> {
  if (isPreview()) {
    return [...preview.orders.values()]
      .reverse()
      .slice(0, limit)
      .map((order) => {
        const event = order.eventId ? previewDb.invites.get(order.eventId)?.event : undefined;
        return { ...order, slug: event?.slug ?? null, names: namesOf(event?.content) };
      });
  }
  const service = supabaseService();
  if (!service) return [];
  const { data } = await service
    .from("orders")
    .select(`${ORDER_COLUMNS}, events(slug, content)`)
    .order("created_at", { ascending: false })
    .limit(limit);
  return ((data ?? []) as unknown as OrderRow[]).map((row) => ({
    ...orderFromRow(row),
    slug: row.events?.slug ?? null,
    names: namesOf(row.events?.content),
  }));
}

export type GrantResult =
  { ok: true; names: string } | { ok: false; reason: "not-found" | "failed" };

/** An admin gives an invite an edition without payment (pilot families, support). */
export async function grantPlan(slug: string, planId: PaidPlanId): Promise<GrantResult> {
  if (isPreview()) {
    const stored = [...previewDb.invites.values()].find((invite) => invite.event.slug === slug);
    if (!stored) return { ok: false, reason: "not-found" };
    raisePreviewPlan(stored.event.id, planId, "admin");
    return { ok: true, names: namesOf(stored.event.content) };
  }
  const service = supabaseService();
  if (!service) return { ok: false, reason: "failed" };
  const { data: event } = await service
    .from("events")
    .select("id, content")
    .eq("slug", slug)
    .maybeSingle();
  if (!event) return { ok: false, reason: "not-found" };
  const raised = await raisePlan(event.id as string, planId, "admin", null);
  return raised
    ? { ok: true, names: namesOf(event.content as Record<string, string>) }
    : { ok: false, reason: "failed" };
}

/** What the admin overview counts. */
export async function orderTotals(): Promise<{ paid: number; revenuePaise: number }> {
  const orders = (await adminOrders(1000)).filter((order) => order.status === "paid");
  return {
    paid: orders.length,
    revenuePaise: orders.reduce((sum, order) => sum + order.amountPaise, 0),
  };
}

/** One order with its invite, for its invoice; the page checks who may see it. */
export async function orderWithInvite(orderId: string): Promise<AdminOrder | null> {
  if (isPreview()) {
    const order = [...preview.orders.values()].find((item) => item.id === orderId);
    if (!order) return null;
    const event = order.eventId ? previewDb.invites.get(order.eventId)?.event : undefined;
    return { ...order, slug: event?.slug ?? null, names: namesOf(event?.content) };
  }
  const service = supabaseService();
  if (!service) return null;
  const { data } = await service
    .from("orders")
    .select(`${ORDER_COLUMNS}, events(slug, content)`)
    .eq("id", orderId)
    .maybeSingle();
  if (!data) return null;
  const row = data as unknown as OrderRow;
  return {
    ...orderFromRow(row),
    slug: row.events?.slug ?? null,
    names: namesOf(row.events?.content),
  };
}

export type RefundResult =
  { ok: true } | { ok: false; reason: "not-found" | "not-paid" | "provider" | "failed" };

/**
 * Refunds a paid order in full through Razorpay (Admin, Orders) and takes the invite back
 * to the edition it had before, when this order is what gave it its edition.
 */
export async function refundOrder(orderId: string): Promise<RefundResult> {
  const now = new Date().toISOString();
  if (isPreview()) {
    const order = [...preview.orders.values()].find((item) => item.id === orderId);
    if (!order) return { ok: false, reason: "not-found" };
    if (order.status !== "paid") return { ok: false, reason: "not-paid" };
    Object.assign(order, { status: "refunded", refundedAt: now });
    const plan = order.eventId ? preview.plans.get(order.eventId) : undefined;
    if (order.eventId && plan?.orderId === order.providerOrderId) {
      if (order.fromPlanId === "free") preview.plans.delete(order.eventId);
      else preview.plans.set(order.eventId, { planId: order.fromPlanId, source: "purchase" });
    }
    return { ok: true };
  }
  const service = supabaseService();
  if (!service) return { ok: false, reason: "failed" };
  const { data: order } = await service
    .from("orders")
    .select("id, event_id, from_plan_id, amount_paise, status, provider_payment_id, mode")
    .eq("id", orderId)
    .maybeSingle();
  if (!order) return { ok: false, reason: "not-found" };
  if (order.status !== "paid" || !order.provider_payment_id) {
    return { ok: false, reason: "not-paid" };
  }
  const keys = razorpayKeys();
  // Test-mode payments refund only with test keys, live with live
  if (!keys || keys.mode !== order.mode) return { ok: false, reason: "provider" };
  const refund = await refundRazorpayPayment(
    keys,
    order.provider_payment_id as string,
    order.amount_paise as number,
  );
  if (!refund) return { ok: false, reason: "provider" };
  const { error } = await service
    .from("orders")
    .update({ status: "refunded", refund_id: refund.id, refunded_at: now })
    .eq("id", order.id);
  if (error) return { ok: false, reason: "failed" };
  if (order.event_id) {
    const { data: plan } = await service
      .from("event_plans")
      .select("order_id")
      .eq("event_id", order.event_id)
      .maybeSingle();
    if (plan?.order_id === order.id) {
      if (isPaidPlanId(order.from_plan_id)) {
        await service
          .from("event_plans")
          .update({ plan_id: order.from_plan_id, order_id: null, updated_at: now })
          .eq("event_id", order.event_id);
      } else {
        await service.from("event_plans").delete().eq("event_id", order.event_id);
      }
    }
  }
  return { ok: true };
}

/* ---------- Invites, for the admin ---------- */

export type AdminInvite = {
  id: string;
  names: string;
  categoryId: string;
  status: string;
  slug: string | null;
  plan: PlanId;
  createdAt: string;
  owner: string;
};

/** The newest invites and how many accounts there are, for Admin, Invites. */
export async function adminInvites(
  limit = 100,
): Promise<{ invites: AdminInvite[]; accounts: number | null; total: number | null }> {
  if (isPreview()) {
    const all = [...previewDb.invites.values()].reverse();
    return {
      invites: all.slice(0, limit).map((stored) => ({
        id: stored.event.id,
        names: namesOf(stored.event.content),
        categoryId: stored.event.category_id,
        status: stored.event.status,
        slug: stored.event.slug,
        plan: preview.plans.get(stored.event.id)?.planId ?? "free",
        createdAt: stored.publishedAt ?? stored.event.updated_at,
        owner: stored.owner.replace(/^preview-/, ""),
      })),
      accounts: new Set(all.map((stored) => stored.owner)).size,
      total: all.length,
    };
  }
  const service = supabaseService();
  if (!service) return { invites: [], accounts: null, total: null };
  const [{ data, count }, { count: accounts }] = await Promise.all([
    service
      .from("events")
      .select(
        "id, category_id, status, slug, content, created_at, profiles(name), event_plans(plan_id)",
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .limit(limit),
    service.from("profiles").select("id", { count: "exact", head: true }),
  ]);
  type Row = {
    id: string;
    category_id: string;
    status: string;
    slug: string | null;
    content: Record<string, string> | null;
    created_at: string;
    profiles: { name: string | null } | null;
    event_plans: { plan_id: string } | { plan_id: string }[] | null;
  };
  return {
    invites: ((data ?? []) as unknown as Row[]).map((row) => {
      const plan = Array.isArray(row.event_plans) ? row.event_plans[0] : row.event_plans;
      return {
        id: row.id,
        names: namesOf(row.content),
        categoryId: row.category_id,
        status: row.status,
        slug: row.slug,
        plan: isPlanId(plan?.plan_id) ? plan.plan_id : "free",
        createdAt: row.created_at,
        owner: row.profiles?.name || "No name yet",
      };
    }),
    accounts: accounts ?? null,
    total: count ?? null,
  };
}
