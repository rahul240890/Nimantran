import "server-only";
import type { User } from "@supabase/supabase-js";
import { after } from "next/server";
import { planCopy } from "@/content/editions";
import { authMode } from "@/lib/auth/mode";
import { getBusiness } from "@/lib/payments/business";
import { orderWithInvite } from "@/lib/payments/editions";
import { site } from "@/lib/site";
import { supabaseService } from "@/lib/supabase/service";
import { emailConfigured, sendEmail } from "./send";
import { stopUrl } from "./stop-link";
import {
  draftReminderEmail,
  receiptEmail,
  welcomeEmail,
  type Brand,
  type Email,
} from "./templates";

/*
 * When the site emails people: a welcome after their first sign-in, a receipt once a
 * payment is recorded, and one reminder for an invite left as a draft (see
 * src/app/(app)/api/cron/draft-reminders). Each email is claimed in email_log before it
 * goes, so a second webhook or a retried job never sends it twice. Off until
 * RESEND_API_KEY is set, and never in preview mode.
 */

type Kind = "welcome" | "receipt" | "draft_reminder";

const brand = (): Brand => ({
  name: site.name,
  siteUrl: site.url,
  contactEmail: site.contactEmail,
});

function service() {
  if (authMode() === "preview" || !emailConfigured()) return null;
  return supabaseService();
}

/** Runs after the response is sent, so a slow email never holds up the page. */
function later(task: () => Promise<unknown>) {
  const run = () => task().catch(() => undefined);
  try {
    after(run);
  } catch {
    // Outside a request (a script or test): just start it
    void run();
  }
}

/** Sends one email once: false when it was already sent or couldn't be. */
async function sendOnce(
  kind: Kind,
  ref: string,
  userId: string,
  to: string,
  email: Email,
  headers?: Record<string, string>,
): Promise<boolean> {
  const db = service();
  if (!db) return false;
  const { error } = await db.from("email_log").insert({ kind, ref, user_id: userId });
  // A unique violation means another call already sent it
  if (error) return false;
  const sent = await sendEmail(to, email, { idempotencyKey: `${kind}-${ref}`, headers });
  if (!sent.ok) {
    // Free the claim so the next trigger (a webhook retry, tomorrow's job) tries again
    await db.from("email_log").delete().eq("kind", kind).eq("ref", ref);
    return false;
  }
  if (sent.id)
    await db.from("email_log").update({ provider_id: sent.id }).eq("kind", kind).eq("ref", ref);
  return true;
}

function nameOf(user: User): string {
  const meta = user.user_metadata ?? {};
  const name = [meta.name, meta.full_name].find(
    (value): value is string => typeof value === "string" && Boolean(value.trim()),
  );
  return (name ?? "").trim().slice(0, 60);
}

async function userById(userId: string): Promise<User | null> {
  const db = service();
  if (!db) return null;
  const { data } = await db.auth.admin.getUserById(userId);
  return data.user ?? null;
}

/* ---------- Welcome ---------- */

/** Accounts made more than this long ago were here before welcome emails, so get none. */
const NEW_ACCOUNT_MS = 24 * 60 * 60 * 1000;

/** After a sign-in: welcomes a new account that has an email address (Google sign-ins). */
export function welcomeAfterSignIn(user: User) {
  if (!user.email || !emailConfigured()) return;
  const created = Date.parse(user.created_at);
  if (!Number.isFinite(created) || Date.now() - created > NEW_ACCOUNT_MS) return;
  const email = user.email;
  later(() => sendOnce("welcome", user.id, user.id, email, welcomeEmail(brand(), nameOf(user))));
}

/* ---------- Receipt ---------- */

/** After a payment is recorded: emails the buyer their receipt, once per order. */
export function receiptAfterPayment(orderId: string) {
  if (!emailConfigured()) return;
  later(() => sendReceipt(orderId));
}

async function sendReceipt(orderId: string): Promise<boolean> {
  const order = await orderWithInvite(orderId);
  if (!order?.userId || order.status !== "paid") return false;
  const [user, business] = await Promise.all([userById(order.userId), getBusiness()]);
  if (!user?.email) return false;
  const email = receiptEmail(brand(), {
    orderId: order.id,
    eventId: order.eventId,
    buyerName: nameOf(user),
    names: order.names,
    packageName: planCopy[order.planId].name,
    invoiceNo: order.invoiceNo,
    listPricePaise: order.listPricePaise,
    discountPaise: order.discountPaise,
    couponCode: order.couponCode,
    amountPaise: order.amountPaise,
    paymentId: order.providerPaymentId,
    paidAt: new Date(order.paidAt ?? order.createdAt),
    taxInvoice: Boolean(business.gstin),
  });
  return sendOnce("receipt", order.id, order.userId, user.email, email);
}

/* ---------- Unfinished drafts ---------- */

/** A draft gets its reminder once it has sat this long untouched… */
const DRAFT_QUIET_MS = 24 * 60 * 60 * 1000;
/** …and not once it's older than this: a host who walked away weeks ago isn't nudged. */
const DRAFT_MAX_AGE_MS = 10 * 24 * 60 * 60 * 1000;
/** A host gets at most one reminder in this long, however many drafts they have. */
const HOST_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
/** Kept well inside one function run. */
const BATCH = 50;

export type ReminderRun = { checked: number; sent: number } | { skipped: "not-configured" };

/** The daily job: one reminder for each unpaid draft left untouched for a day. */
export async function sendDraftReminders(now = new Date()): Promise<ReminderRun> {
  const db = service();
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!db || !secret) return { skipped: "not-configured" };

  const { data: drafts, error } = await db
    .from("events")
    .select("id, owner_id, content, updated_at, event_plans(event_id)")
    .eq("status", "draft")
    .lte("updated_at", new Date(now.getTime() - DRAFT_QUIET_MS).toISOString())
    .gte("created_at", new Date(now.getTime() - DRAFT_MAX_AGE_MS).toISOString())
    .order("updated_at", { ascending: false })
    .limit(200);
  if (error || !drafts?.length) return { checked: 0, sent: 0 };

  type Draft = {
    id: string;
    owner_id: string;
    content: Record<string, string> | null;
    event_plans: unknown;
  };
  const hasPlan = (row: Draft) =>
    Array.isArray(row.event_plans) ? row.event_plans.length > 0 : Boolean(row.event_plans);
  const unpaid = (drafts as Draft[]).filter((row) => !hasPlan(row));
  const eventIds = unpaid.map((row) => row.id);
  const owners = [...new Set(unpaid.map((row) => row.owner_id))];
  if (!owners.length) return { checked: 0, sent: 0 };

  const [{ data: reminded }, { data: recent }, { data: stopped }] = await Promise.all([
    db.from("email_log").select("ref").eq("kind", "draft_reminder").in("ref", eventIds),
    db
      .from("email_log")
      .select("user_id")
      .eq("kind", "draft_reminder")
      .in("user_id", owners)
      .gte("created_at", new Date(now.getTime() - HOST_COOLDOWN_MS).toISOString()),
    db.from("email_opt_outs").select("user_id").in("user_id", owners),
  ]);
  const skipEvent = new Set((reminded ?? []).map((row) => row.ref as string));
  const skipOwner = new Set([
    ...(recent ?? []).map((row) => row.user_id as string),
    ...(stopped ?? []).map((row) => row.user_id as string),
  ]);

  // The most recently touched draft of each host who can hear from us
  const picked = new Map<string, Draft>();
  for (const row of unpaid) {
    if (skipEvent.has(row.id) || skipOwner.has(row.owner_id) || picked.has(row.owner_id)) continue;
    picked.set(row.owner_id, row);
    if (picked.size >= BATCH) break;
  }

  let sent = 0;
  for (const draft of picked.values()) {
    const user = await userById(draft.owner_id);
    if (!user?.email) continue;
    const names = [draft.content?.first, draft.content?.second]
      .map((name) => (typeof name === "string" ? name.trim() : ""))
      .filter(Boolean)
      .join(" & ");
    const stop = stopUrl(site.url, secret, user.id);
    const email = draftReminderEmail(brand(), {
      eventId: draft.id,
      hostName: nameOf(user),
      names,
      stopUrl: stop,
    });
    // Mail apps' own "Unsubscribe" button posts here without opening a page
    const oneClick = stop.replace("/emails/stop?", "/api/emails/stop?");
    const ok = await sendOnce("draft_reminder", draft.id, user.id, user.email, email, {
      "List-Unsubscribe": `<${oneClick}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    });
    if (ok) sent += 1;
  }
  return { checked: unpaid.length, sent };
}

/* ---------- Stopping reminders ---------- */

/** Records that this person wants no more reminders. */
export async function stopReminders(userId: string): Promise<boolean> {
  const db = supabaseService();
  if (!db) return false;
  const { error } = await db
    .from("email_opt_outs")
    .upsert({ user_id: userId }, { onConflict: "user_id", ignoreDuplicates: true });
  return !error;
}
