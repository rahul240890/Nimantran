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
import { emailDesigns, emailOffers } from "./extras";
import {
  discoverEmail,
  draftReminderEmail,
  receiptEmail,
  welcomeEmail,
  type Brand,
  type Email,
} from "./templates";

/*
 * When the site emails people: a welcome after their first sign-in (with the offers they
 * can use), a receipt once a payment is recorded, one reminder for an invite left as a
 * draft, and once, a few days after joining, new designs picked for them with the offers
 * running (the last two from the daily job, src/app/(app)/api/cron/draft-reminders). Each email is claimed in email_log before it
 * goes, so a second webhook or a retried job never sends it twice. Off until
 * RESEND_API_KEY is set, and never in preview mode.
 */

type Kind = "welcome" | "receipt" | "draft_reminder" | "discover";

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
  later(async () =>
    sendOnce("welcome", user.id, user.id, email, await welcomeFor(user.id, nameOf(user))),
  );
}

/** The welcome with the offers a first booking can use and a few designs to start with. */
export async function welcomeFor(seed: string, name: string): Promise<Email> {
  const offers = await emailOffers(site.url, false).catch(() => []);
  return welcomeEmail(brand(), name, { offers, designs: emailDesigns(site.url, seed, 3) });
}

/** The new-designs email for one person; bought says whether they have paid for a package. */
export async function discoverFor(
  seed: string,
  name: string,
  bought: boolean | null,
  stopUrl: string,
): Promise<Email> {
  const offers = await emailOffers(site.url, bought).catch(() => []);
  return discoverEmail(brand(), {
    name,
    offers,
    designs: emailDesigns(site.url, seed, 6),
    stopUrl,
  });
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

/* ---------- New designs and offers ---------- */

/** Sent this long after someone joins… */
const DISCOVER_AFTER_MS = 3 * 24 * 60 * 60 * 1000;
/** …and not to accounts older than this, which joined before these emails began. */
const DISCOVER_MAX_AGE_MS = 21 * 24 * 60 * 60 * 1000;

/** The daily job: once per account, three days after joining, new designs and the offers. */
export async function sendDiscoverEmails(now = new Date()): Promise<ReminderRun> {
  const db = service();
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!db || !secret) return { skipped: "not-configured" };

  const users: User[] = [];
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) return { checked: 0, sent: 0 };
    users.push(...data.users);
    if (data.users.length < 1000) break;
  }
  const due = users.filter((user) => {
    const age = now.getTime() - Date.parse(user.created_at);
    return Boolean(user.email) && age >= DISCOVER_AFTER_MS && age <= DISCOVER_MAX_AGE_MS;
  });
  const ids = due.map((user) => user.id);
  if (!ids.length) return { checked: 0, sent: 0 };

  const [{ data: sentBefore }, { data: stopped }, { data: paid }] = await Promise.all([
    db.from("email_log").select("ref").eq("kind", "discover").in("ref", ids),
    db.from("email_opt_outs").select("user_id").in("user_id", ids),
    db.from("orders").select("user_id").in("user_id", ids).in("status", ["paid", "refunded"]),
  ]);
  const skip = new Set([
    ...(sentBefore ?? []).map((row) => row.ref as string),
    ...(stopped ?? []).map((row) => row.user_id as string),
  ]);
  const bought = new Set((paid ?? []).map((row) => row.user_id as string));

  let sent = 0;
  for (const user of due.filter((entry) => !skip.has(entry.id)).slice(0, BATCH)) {
    const stop = stopUrl(site.url, secret, user.id);
    const email = await discoverFor(user.id, nameOf(user), bought.has(user.id), stop);
    const oneClick = stop.replace("/emails/stop?", "/api/emails/stop?");
    const ok = await sendOnce("discover", user.id, user.id, user.email!, email, {
      "List-Unsubscribe": `<${oneClick}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    });
    if (ok) sent += 1;
  }
  return { checked: due.length, sent };
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
