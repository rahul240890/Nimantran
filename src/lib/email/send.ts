import "server-only";
import type { Email } from "./templates";

/*
 * Sends email through Resend (resend.com), from the shubhinvitations.com domain verified
 * there. Nothing is sent until RESEND_API_KEY is set in Vercel, so the site works the same
 * without it. EMAIL_FROM overrides the sender, EMAIL_REPLY_TO adds a reply-to address.
 */

export const DEFAULT_FROM = "Shubh Invitation <hello@shubhinvitations.com>";

export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY?.trim());

export type SendResult = { ok: true; id: string | null } | { ok: false; reason: string };

export async function sendEmail(
  to: string,
  email: Email,
  options: { idempotencyKey: string; headers?: Record<string, string> },
): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return { ok: false, reason: "not-configured" };
  const replyTo = process.env.EMAIL_REPLY_TO?.trim();
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        // Resend drops a second send with the same key for a day, so a retry never doubles up
        "Idempotency-Key": options.idempotencyKey,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM?.trim() || DEFAULT_FROM,
        to: [to],
        subject: email.subject,
        html: email.html,
        text: email.text,
        ...(replyTo ? { reply_to: replyTo } : {}),
        ...(options.headers ? { headers: options.headers } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return { ok: false, reason: `http-${response.status}` };
    const data = (await response.json().catch(() => null)) as { id?: unknown } | null;
    return { ok: true, id: typeof data?.id === "string" ? data.id : null };
  } catch {
    return { ok: false, reason: "network" };
  }
}
