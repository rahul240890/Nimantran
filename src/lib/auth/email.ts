import { z } from "zod";

/*
 * Email addresses for sign-in by code. Kept lower case, so one person is one account
 * however they type it.
 */

export type EmailError = "email-required" | "email-invalid";

const address = z.email();

export function normalizeEmail(input: string): { email: string } | { error: EmailError } {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return { error: "email-required" };
  if (trimmed.length > 254 || !address.safeParse(trimmed).success) {
    return { error: "email-invalid" };
  }
  return { email: trimmed };
}

/** "pr•••@gmail.com": enough to recognise, not enough to read off a shoulder. */
export function maskEmail(email: string): string {
  const at = email.lastIndexOf("@");
  if (at < 1) return email;
  const name = email.slice(0, at);
  const shown = name.slice(0, Math.min(2, name.length - 1)) || name.slice(0, 1);
  return `${shown}${"•".repeat(Math.max(3, name.length - shown.length))}${email.slice(at)}`;
}

/** Email codes are 6 digits unless the sign-in service is set to longer ones. */
export function isEmailCode(value: string): boolean {
  return /^\d{6,10}$/.test(value);
}
