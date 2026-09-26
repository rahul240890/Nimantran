"use server";

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
export async function joinWaitlist(input: unknown, honeypot: string): Promise<JoinWaitlistResult> {
  const result = validateWaitlist(input);
  if (!result.ok) return { status: "invalid", errors: result.errors };

  if (honeypot.trim() !== "") return { status: "joined", name: result.data.name };

  const stored = await storeWaitlistEntry(result.data);
  return stored === "stored" ? { status: "joined", name: result.data.name } : { status: "error" };
}
