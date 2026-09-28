import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/*
 * Razorpay, the payment gateway for India (UPI, cards, netbanking). The keys live only in
 * the server's environment variables (Vercel), never in the database or the browser;
 * the browser gets the key id, which Razorpay makes public by design.
 *
 *   RAZORPAY_KEY_ID          rzp_test_… or rzp_live_…
 *   RAZORPAY_KEY_SECRET      pairs with the key id
 *   RAZORPAY_WEBHOOK_SECRET  chosen when adding the webhook in Razorpay
 */

const API = "https://api.razorpay.com/v1";

export type RazorpayMode = "test" | "live";

export type RazorpayKeys = { keyId: string; keySecret: string; mode: RazorpayMode };

/** test or live from the key id's prefix; null for something that isn't a Razorpay key id. */
export function keyMode(keyId: string): RazorpayMode | null {
  if (/^rzp_test_[A-Za-z0-9]+$/.test(keyId)) return "test";
  if (/^rzp_live_[A-Za-z0-9]+$/.test(keyId)) return "live";
  return null;
}

/** Shows only the end of a secret, enough to tell which one is set. */
export function maskSecret(value: string): string {
  return value.length <= 4 ? "••••" : `••••${value.slice(-4)}`;
}

const env = (name: string) => process.env[name]?.trim() || "";

export function razorpayKeys(): RazorpayKeys | null {
  const keyId = env("RAZORPAY_KEY_ID");
  const keySecret = env("RAZORPAY_KEY_SECRET");
  const mode = keyMode(keyId);
  return mode && keySecret ? { keyId, keySecret, mode } : null;
}

/** What the admin page shows: which settings are there, never the secrets themselves. */
export type RazorpayStatus = {
  keyId: string | null;
  keyIdValid: boolean;
  mode: RazorpayMode | null;
  keySecret: string | null;
  webhookSecret: string | null;
  ready: boolean;
};

export function razorpayStatus(): RazorpayStatus {
  const keyId = env("RAZORPAY_KEY_ID");
  const keySecret = env("RAZORPAY_KEY_SECRET");
  const webhookSecret = env("RAZORPAY_WEBHOOK_SECRET");
  const mode = keyMode(keyId);
  return {
    keyId: keyId || null,
    keyIdValid: Boolean(mode),
    mode,
    keySecret: keySecret ? maskSecret(keySecret) : null,
    webhookSecret: webhookSecret ? maskSecret(webhookSecret) : null,
    ready: Boolean(mode && keySecret),
  };
}

function authHeader(keys: RazorpayKeys) {
  return `Basic ${Buffer.from(`${keys.keyId}:${keys.keySecret}`).toString("base64")}`;
}

export type ConnectionCheck =
  { ok: true; mode: RazorpayMode } | { ok: false; reason: "missing" | "rejected" | "unreachable" };

/** Asks Razorpay for one order with the keys: proves they are real and belong together. */
export async function checkConnection(): Promise<ConnectionCheck> {
  const keys = razorpayKeys();
  if (!keys) return { ok: false, reason: "missing" };
  try {
    const response = await fetch(`${API}/orders?count=1`, {
      headers: { Authorization: authHeader(keys) },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (response.ok) return { ok: true, mode: keys.mode };
    return { ok: false, reason: response.status === 401 ? "rejected" : "unreachable" };
  } catch {
    return { ok: false, reason: "unreachable" };
  }
}

export type RazorpayOrder = { id: string; amount: number; currency: string };

/** A Razorpay order for the amount; the checkout pays exactly this and nothing else. */
export async function createRazorpayOrder(
  keys: RazorpayKeys,
  input: { amountPaise: number; receipt: string; notes: Record<string, string> },
): Promise<RazorpayOrder | null> {
  try {
    const response = await fetch(`${API}/orders`, {
      method: "POST",
      headers: { Authorization: authHeader(keys), "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: input.amountPaise,
        currency: "INR",
        receipt: input.receipt.slice(0, 40),
        notes: input.notes,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) return null;
    const order = (await response.json()) as RazorpayOrder;
    return typeof order.id === "string" ? order : null;
  } catch {
    return null;
  }
}

function hmacMatches(secret: string, payload: string, signature: string): boolean {
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  const given = Buffer.from(signature, "utf8");
  const wanted = Buffer.from(expected, "utf8");
  return given.length === wanted.length && timingSafeEqual(given, wanted);
}

/** The checkout's proof of payment: HMAC of "order_id|payment_id" with the key secret. */
export function paymentSignatureValid(
  keySecret: string,
  orderId: string,
  paymentId: string,
  signature: string,
): boolean {
  return hmacMatches(keySecret, `${orderId}|${paymentId}`, signature);
}

/** A webhook's proof it came from Razorpay: HMAC of the raw body with the webhook secret. */
export function webhookSignatureValid(secret: string, body: string, signature: string): boolean {
  return hmacMatches(secret, body, signature);
}
