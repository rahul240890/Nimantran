"use server";

import { landingText } from "@/i18n/copy";
import { isUiLocale } from "@/i18n/locales";
import { validateWaitlist, type WaitlistErrors } from "@/lib/waitlist/schema";
import { storeWaitlistEntry } from "@/lib/waitlist/store";

export type JoinWaitlistResult =
  | { status: "joined"; name: string }
  | { status: "invalid"; errors: WaitlistErrors }
  | { status: "error" };

/**
 * Adds someone to the waitlist. Public and unauthenticated by design, so it re-validates
 * everything and quietly accepts bot submissions (the hidden "website" field) without storing them.
 */
export async function joinWaitlist(
  input: unknown,
  honeypot: string,
  locale?: unknown,
): Promise<JoinWaitlistResult> {
  const words = landingText[isUiLocale(locale) ? locale : "en"].waitlist.errors;
  const result = validateWaitlist(input, words);
  if (!result.ok) return { status: "invalid", errors: result.errors };

  if (honeypot.trim() !== "") return { status: "joined", name: result.data.name };

  const stored = await storeWaitlistEntry(result.data);
  return stored === "stored" ? { status: "joined", name: result.data.name } : { status: "error" };
}
