import "server-only";
import { createHash } from "node:crypto";
import { sendEmail } from "@/lib/email/send";
import { signInCodeEmail } from "@/lib/email/templates";
import { site } from "@/lib/site";
import { supabaseService } from "@/lib/supabase/service";

/*
 * Sign-in codes by email (owner, 2026-10-25). Supabase makes the code (generateLink, which
 * also makes the account the first time) without sending anything, and the site sends it
 * from its own address through Resend, so no Supabase mail settings are needed. Codes are
 * checked by Supabase as usual (verifyOtp in server.ts).
 *
 * Supabase doesn't limit codes made this way, so each one is claimed in email_log first:
 * one per address every 30 seconds, five an hour, and 300 an hour across the site. The
 * address is kept only as part of a hash.
 */

const KIND = "sign_in_code";
const PER_ADDRESS_HOUR = 5;
const ALL_HOUR = 300;
const SLOT_MS = 30_000;
const HOUR_MS = 60 * 60 * 1000;
/** Supabase's default life for an email code. */
export const EMAIL_CODE_MINUTES = 60;

export type EmailCodeFailure = "unavailable" | "too-many" | "email-failed" | "unknown";

export async function sendSignInCode(
  email: string,
): Promise<{ ok: true; length: number } | { ok: false; error: EmailCodeFailure }> {
  const db = supabaseService();
  if (!db) return { ok: false, error: "unavailable" };
  const key = createHash("sha256").update(email).digest("hex").slice(0, 32);
  const now = Date.now();
  const since = new Date(now - HOUR_MS).toISOString();
  const recent = (forAddress: boolean) => {
    const query = db
      .from("email_log")
      .select("id", { count: "exact", head: true })
      .eq("kind", KIND)
      .gte("created_at", since);
    return forAddress ? query.like("ref", `${key}:%`) : query;
  };
  const [mine, all] = await Promise.all([recent(true), recent(false)]);
  if (mine.error || all.error) return { ok: false, error: "unavailable" };
  if ((mine.count ?? 0) >= PER_ADDRESS_HOUR || (all.count ?? 0) >= ALL_HOUR) {
    return { ok: false, error: "too-many" };
  }

  // The unique (kind, ref) refuses a second code in the same half minute
  const ref = `${key}:${Math.floor(now / SLOT_MS)}`;
  const claim = await db.from("email_log").insert({ kind: KIND, ref });
  if (claim.error) {
    return { ok: false, error: claim.error.code === "23505" ? "too-many" : "unavailable" };
  }
  const release = () => db.from("email_log").delete().eq("kind", KIND).eq("ref", ref);

  const { data, error } = await db.auth.admin.generateLink({ type: "magiclink", email });
  const code = data?.properties?.email_otp;
  if (error || !code) {
    await release();
    return { ok: false, error: error?.status === 429 ? "too-many" : "unknown" };
  }
  const sent = await sendEmail(
    email,
    signInCodeEmail(
      { name: site.name, siteUrl: site.url, contactEmail: site.contactEmail },
      code,
      EMAIL_CODE_MINUTES,
    ),
    { idempotencyKey: `${KIND}-${ref}` },
  );
  if (!sent.ok) {
    await release();
    return { ok: false, error: "email-failed" };
  }
  // Old claims only count against the hour, so a day's are plenty to keep
  await db
    .from("email_log")
    .delete()
    .eq("kind", KIND)
    .lt("created_at", new Date(now - 24 * HOUR_MS).toISOString());
  return { ok: true, length: code.length };
}
