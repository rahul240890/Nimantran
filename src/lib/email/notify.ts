import "server-only";
import type { User } from "@supabase/supabase-js";
import { after } from "next/server";
import { planCopy } from "@/content/editions";
import { offersCopy } from "@/content/pages";
import { authMode } from "@/lib/auth/mode";
import { getBusiness } from "@/lib/payments/business";
import { orderWithInvite } from "@/lib/payments/editions";
import { PAID_PLAN_IDS, planRank, upgradePricePaise, type PaidPlanId } from "@/lib/plans/catalog";
import { getPricing } from "@/lib/plans/pricing";
import { supportWhatsAppUrl } from "@/lib/publish/links";
import { instagramHandle, site } from "@/lib/site";
import { isSuiteId, type SuiteId } from "@/lib/suites/catalog";
import { supabaseService } from "@/lib/supabase/service";
import { emailConfigured, sendEmail } from "./send";
import { stopUrl } from "./stop-link";
import { emailDesign, emailDesigns, emailOffers } from "./extras";
import {
  discoverEmail,
  receiptEmail,
  reminderEmail,
  welcomeEmail,
  type Brand,
  type Email,
  type EmailDesign,
  type EmailUpgrade,
} from "./templates";

/*
 * When the site emails people: a plain welcome after their first sign-in (what one
 * invitation gives, as in the first-visit popup), a receipt once a payment is recorded
 * (with help, Instagram and the bigger packages), one reminder the day after signing in
 * to anyone who hasn't bought (the designs they tried), and once, a few days after
 * joining, new designs picked for them with the offers running (the last two from the
 * daily job, src/app/(app)/api/cron/draft-reminders). Each email is claimed in email_log before it
 * goes, so a second webhook or a retried job never sends it twice. Off until
 * RESEND_API_KEY is set, and never in preview mode.
 */

type Kind = "welcome" | "receipt" | "draft_reminder" | "discover";

const brand = (): Brand => ({
  name: site.name,
  siteUrl: site.url,
  contactEmail: site.contactEmail,
});

/** Who signs the welcome, so it reads as a note from a person. */
const SIGNED_BY = `${site.founder.split(" ")[0]}`;
const WELCOME_FROM = `${SIGNED_BY} from ${site.name}`;

/** The brand with every way to get help: the WhatsApp number from Admin, Business first. */
async function brandWithHelp(): Promise<Brand> {
  const business = await getBusiness().catch(() => null);
  const phone = business?.phone || site.supportPhone;
  const digits = phone.replace(/\D/g, "").replace(/^0+/, "").slice(-10);
  return {
    ...brand(),
    help: {
      whatsappUrl: supportWhatsAppUrl(phone, `Hello ${site.name}, I need help with my invitation.`),
      whatsappLabel: digits.length === 10 ? `+91 ${digits.slice(0, 5)} ${digits.slice(5)}` : null,
      instagramUrl: site.social.instagram,
      instagramHandle: instagramHandle(),
    },
  };
}

/** The six things one invitation gives, from the first-visit popup. */
const welcomeFeatures = () => offersCopy.welcome.features;

/** The same six, a few words each, for the reminder. */
const SHORT_FEATURES = [
  "Invitation website with every function, map and replies",
  "Videos for WhatsApp Status and Reels",
  "Painted cards to share or print",
  "Your music and your language",
  "See it all free before you pay",
] as const;

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
  options: { headers?: Record<string, string>; fromName?: string } = {},
): Promise<boolean> {
  const db = service();
  if (!db) return false;
  const { error } = await db.from("email_log").insert({ kind, ref, user_id: userId });
  // A unique violation means another call already sent it
  if (error) return false;
  const sent = await sendEmail(to, email, { idempotencyKey: `${kind}-${ref}`, ...options });
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
    sendOnce("welcome", user.id, user.id, email, await welcomeFor(user.id, nameOf(user)), {
      fromName: WELCOME_FROM,
    }),
  );
}

/** The welcome: a plain note with what one invitation gives, signed by a person. */
export async function welcomeFor(_seed: string, name: string): Promise<Email> {
  return welcomeEmail(brand(), name, { features: welcomeFeatures(), signedBy: SIGNED_BY });
}

/** The sender name the welcome goes out under. */
export const welcomeFromName = WELCOME_FROM;

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
  const [user, business, withHelp] = await Promise.all([
    userById(order.userId),
    getBusiness(),
    brandWithHelp(),
  ]);
  if (!user?.email) return false;
  const upgrades = order.eventId
    ? await upgradesAfter(order.eventId, {
        plan: order.planId,
        tier: order.designTier,
        design: order.designId,
      }).catch(() => [])
    : [];
  const email = receiptEmail(withHelp, {
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
    upgrades,
  });
  return sendOnce("receipt", order.id, order.userId, user.email, email);
}

/**
 * The packages above the one just bought, with what each adds and the difference to pay
 * today: Celebration and Grand after Basic, Grand after Celebration, none after Grand.
 */
export async function upgradesAfter(
  eventId: string,
  current: {
    plan: PaidPlanId;
    tier: Parameters<typeof upgradePricePaise>[2];
    design: string | null;
  },
): Promise<EmailUpgrade[]> {
  const pricing = await getPricing();
  const have = planCopy[current.plan].name;
  return PAID_PLAN_IDS.filter((id) => planRank(id) > planRank(current.plan)).flatMap((id) => {
    const price = upgradePricePaise(current, id, current.tier, pricing);
    if (price === null) return [];
    return [
      {
        name: planCopy[id].name,
        // What they have already isn't news: drop "Everything in Basic" after Basic
        adds: planCopy[id].highlights.filter((line) => line !== `Everything in ${have}`),
        pricePaise: price,
        href: `${site.url.replace(/\/$/, "")}/invites/${encodeURIComponent(eventId)}/edition?plan=${id}`,
      },
    ];
  });
}

/* ---------- Not bought yet ---------- */

/** The reminder goes once they've been signed up this long… */
const REMINDER_AFTER_MS = 24 * 60 * 60 * 1000;
/** …and not while they're still working: nothing edited in this long. */
const QUIET_MS = 12 * 60 * 60 * 1000;
/** Kept well inside one function run. */
const BATCH = 50;

export type ReminderRun = { checked: number; sent: number } | { skipped: "not-configured" };

type EventSummary = {
  id: string;
  owner_id: string;
  content: Record<string, string> | null;
  religious: { suite?: unknown } | null;
  updated_at: string;
  functions: { date: string | null }[] | null;
};

const namesOf = (content: EventSummary["content"]) =>
  [content?.first, content?.second]
    .map((name) => (typeof name === "string" ? name.trim() : ""))
    .filter(Boolean)
    .join(" & ");

/** The next function's date still to come, or null. */
function nextDate(event: EventSummary | undefined, now: Date): Date | null {
  const today = now.toISOString().slice(0, 10);
  const dates = (event?.functions ?? [])
    .map((fn) => fn.date)
    .filter((date): date is string => Boolean(date) && date! >= today)
    .sort();
  return dates[0] ? new Date(`${dates[0]}T12:00:00+05:30`) : null;
}

/** The designs someone tried, newest first, each opening their own invite. */
function triedDesigns(events: EventSummary[], limit = 3): EmailDesign[] {
  const seen = new Set<SuiteId>();
  const designs: EmailDesign[] = [];
  for (const event of events) {
    const suite = event.religious?.suite;
    if (!isSuiteId(suite) || seen.has(suite)) continue;
    seen.add(suite);
    const resume = `${site.url.replace(/\/$/, "")}/create?invite=${encodeURIComponent(event.id)}`;
    const design = emailDesign(site.url, suite, resume);
    if (design) designs.push(design);
    if (designs.length >= limit) break;
  }
  return designs;
}

/** The reminder for one person, from their invites (newest first). */
export async function reminderFor(
  user: { id: string; name: string },
  events: EventSummary[],
  stop: string,
  now = new Date(),
): Promise<Email> {
  const latest = events[0];
  const resumeUrl = latest
    ? `${site.url.replace(/\/$/, "")}/create?invite=${encodeURIComponent(latest.id)}`
    : `${site.url.replace(/\/$/, "")}/invitations`;
  return reminderEmail(await brandWithHelp(), {
    hostName: user.name,
    names: namesOf(latest?.content ?? null),
    date: nextDate(latest, now),
    tried: triedDesigns(events),
    suggested: emailDesigns(site.url, user.id, 3),
    resumeUrl,
    features: SHORT_FEATURES,
    stopUrl: stop,
  });
}

/**
 * The daily job: once per person, ever, the day after they sign in, to anyone with an email
 * address who hasn't bought a package. Skips people who said stop, and anyone who edited
 * an invite in the last few hours.
 */
export async function sendReminders(now = new Date()): Promise<ReminderRun> {
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
  const due = users.filter(
    (user) =>
      Boolean(user.email) && now.getTime() - Date.parse(user.created_at) >= REMINDER_AFTER_MS,
  );
  const ids = due.map((user) => user.id);
  if (!ids.length) return { checked: 0, sent: 0 };

  const [{ data: sentBefore }, { data: stopped }, { data: paid }] = await Promise.all([
    // Any reminder before, of either kind: one email to each person, ever
    db.from("email_log").select("user_id").eq("kind", "draft_reminder").in("user_id", ids),
    db.from("email_opt_outs").select("user_id").in("user_id", ids),
    db.from("orders").select("user_id").in("user_id", ids).in("status", ["paid", "refunded"]),
  ]);
  const skip = new Set([
    ...(sentBefore ?? []).map((row) => row.user_id as string),
    ...(stopped ?? []).map((row) => row.user_id as string),
    ...(paid ?? []).map((row) => row.user_id as string),
  ]);
  const picked = due.filter((user) => !skip.has(user.id)).slice(0, BATCH);
  if (!picked.length) return { checked: due.length, sent: 0 };

  const { data: rows } = await db
    .from("events")
    .select("id, owner_id, content, religious, updated_at, functions(date)")
    .in(
      "owner_id",
      picked.map((user) => user.id),
    )
    .order("updated_at", { ascending: false });
  const byOwner = new Map<string, EventSummary[]>();
  for (const row of (rows ?? []) as EventSummary[]) {
    byOwner.set(row.owner_id, [...(byOwner.get(row.owner_id) ?? []), row]);
  }

  let sent = 0;
  for (const user of picked) {
    const events = byOwner.get(user.id) ?? [];
    const lastEdit = events[0] ? Date.parse(events[0].updated_at) : 0;
    if (now.getTime() - lastEdit < QUIET_MS) continue;
    const stop = stopUrl(site.url, secret, user.id);
    const email = await reminderFor({ id: user.id, name: nameOf(user) }, events, stop, now);
    // Mail apps' own "Unsubscribe" button posts here without opening a page
    const oneClick = stop.replace("/emails/stop?", "/api/emails/stop?");
    // The account is the ref, so it can only ever go once
    const ok = await sendOnce("draft_reminder", user.id, user.id, user.email!, email, {
      headers: {
        "List-Unsubscribe": `<${oneClick}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });
    if (ok) sent += 1;
  }
  return { checked: due.length, sent };
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
      headers: {
        "List-Unsubscribe": `<${oneClick}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
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

/* ---------- Samples for Admin, Emails ---------- */

/** A receipt as a Basic buyer gets it, with the bigger packages, for the preview and test. */
export async function sampleReceiptFor(name: string): Promise<Email> {
  const upgrades = await upgradesAfter("sample", {
    plan: "basic",
    tier: "premium",
    design: null,
  }).catch(() => []);
  return receiptEmail(await brandWithHelp(), {
    orderId: "sample",
    eventId: null,
    buyerName: name,
    names: "Aarav & Meera",
    packageName: planCopy.basic.name,
    invoiceNo: "SHUBH/2026-27/00001",
    listPricePaise: 49_900,
    discountPaise: 0,
    couponCode: null,
    amountPaise: 49_900,
    paymentId: "pay_sample",
    paidAt: new Date(),
    taxInvoice: false,
    upgrades,
  });
}

/** The reminder this account would get, from its own invites. */
export async function sampleReminderFor(userId: string, name: string, stop: string) {
  const db = supabaseService();
  const { data } = db
    ? await db
        .from("events")
        .select("id, owner_id, content, religious, updated_at, functions(date)")
        .eq("owner_id", userId)
        .order("updated_at", { ascending: false })
        .limit(10)
    : { data: null };
  return reminderFor({ id: userId, name }, (data ?? []) as EventSummary[], stop);
}
