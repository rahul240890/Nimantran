import "server-only";
import { authMode } from "@/lib/auth/mode";
import { emailConfigured, sendEmail } from "@/lib/email/send";
import { errorAlertEmail, type ErrorAlertDetails } from "@/lib/email/templates";
import { site } from "@/lib/site";
import { supabaseService } from "@/lib/supabase/service";

/*
 * Emails the people who look after the site when a page breaks (docs/LAUNCH.md, step 6):
 * ALERT_EMAIL, or without it every admin's sign-in email. Each kind of error alerts at most
 * once a day, through Resend's idempotency key, so many servers hitting the same bug send
 * one email; each server also sends at most 10 an hour. What browsers report on their own
 * (a lost connection, an extension, an old page after a deploy) never alerts. Everything
 * is still written to the logs. Off until RESEND_API_KEY is set, and never in preview mode.
 */

export type ErrorAlert = Omit<ErrorAlertDetails, "at">;

/** Browser messages that are about the visitor's phone or connection, not our code. */
const NOISE = [
  /ResizeObserver loop/i,
  /^Script error\.?$/i,
  /Failed to fetch|Load failed|NetworkError|network (connection|error)|offline/i,
  /ChunkLoadError|Loading (CSS )?chunk|Failed to load chunk|dynamically imported module|Importing a module script failed/i,
  /AbortError|operation was aborted|signal is aborted/i,
  // A page change's animation that the browser cut short, as when the phone turned or its
  // address bar hid mid-change: the new page shows at once (React lets these pass too)
  /Transition was (aborted|skipped)|Skipping view transition|View transition was skipped/i,
  // describeError()'s name for a photo, music or script that didn't load
  /^(error|abort) event on /i,
  /Java object is gone|_AutofillCallbackHandler|instantSearchSDKJSBridge|zaloJSV2/i,
];

/** Server messages about a visitor leaving mid-request. */
const SERVER_NOISE = [/^aborted$/i, /ECONNRESET|EPIPE/];

export function isNoise(alert: ErrorAlert): boolean {
  if (alert.where === "server") return SERVER_NOISE.some((pattern) => pattern.test(alert.message));
  if (/(chrome|moz|safari(-web)?)-extension:\/\/|webkit-masked-url/.test(alert.stack ?? "")) {
    return true;
  }
  return NOISE.some((pattern) => pattern.test(alert.message));
}

/** One kind of error: where, which page and the message, with numbers and ids taken out. */
export async function fingerprint(alert: ErrorAlert): Promise<string> {
  const message = alert.message.replace(/[0-9a-f]{8,}|\d+/gi, "#").slice(0, 200);
  const bytes = new TextEncoder().encode(`${alert.where}|${alert.path}|${message}`);
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  return Array.from(digest.subarray(0, 12), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const PER_HOUR = 10;

/** This server's memory of what it sent, so a loop of errors costs no requests. */
const sent = new Map<string, number>();
let thisHour: number[] = [];
let admins: { emails: string[]; at: number } | null = null;

async function recipients(): Promise<string[]> {
  const listed = (process.env.ALERT_EMAIL ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
  if (listed.length) return listed;
  if (admins && Date.now() - admins.at < HOUR_MS) return admins.emails;
  const db = supabaseService();
  if (!db) return [];
  const { data } = await db.from("admins").select("user_id");
  const users = await Promise.all(
    (data ?? []).map((row: { user_id: string }) => db.auth.admin.getUserById(row.user_id)),
  );
  const emails = users.flatMap((result) =>
    result.data.user?.email ? [result.data.user.email] : [],
  );
  admins = { emails, at: Date.now() };
  return emails;
}

/** The IST day, so "once a day" turns over at midnight in India. */
const dayOf = (at: Date) => new Date(at.getTime() + 5.5 * HOUR_MS).toISOString().slice(0, 10);

/** Emails one alert, unless it's noise or this kind went out today. True when it was sent. */
export async function sendAlert(alert: ErrorAlert, now = new Date()): Promise<boolean> {
  if (authMode() === "preview" || !emailConfigured() || isNoise(alert)) return false;
  const kind = await fingerprint(alert);
  const at = now.getTime();
  if (at - (sent.get(kind) ?? -Infinity) < DAY_MS) return false;
  thisHour = thisHour.filter((time) => at - time < HOUR_MS);
  if (thisHour.length >= PER_HOUR) return false;
  const to = await recipients().catch(() => []);
  if (!to.length) return false;
  sent.set(kind, at);
  thisHour.push(at);
  if (sent.size > 500) sent.delete(sent.keys().next().value!);
  const email = errorAlertEmail(
    { name: site.name, siteUrl: site.url, contactEmail: null },
    { ...alert, at: now },
  );
  // Another server already sending this kind today gets Resend's refusal instead
  const result = await sendEmail(to, email, { idempotencyKey: `error-${kind}-${dayOf(now)}` });
  return result.ok;
}

/** For tests: forgets what this server sent. */
export function resetAlerts() {
  sent.clear();
  thisHour = [];
  admins = null;
}
