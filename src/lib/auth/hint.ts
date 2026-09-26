import type { Account } from "./account";

/*
 * A small cookie the browser can read, holding only the signed-in person's first name and
 * picture, so static pages (the landing page) can show "Sign in" or the account menu
 * without asking the server. It is a hint, never proof: account pages check the session.
 */

export const ACCOUNT_HINT_COOKIE = "nimantran-account";

export type AccountHint = { name: string; avatarUrl: string | null };

/** The cookie's value before encoding; Next.js percent-encodes it when setting the cookie. */
export function encodeAccountHint(account: Pick<Account, "name" | "avatarUrl">): string {
  return JSON.stringify({ name: account.name, avatarUrl: account.avatarUrl });
}

/** Reads the value as the browser sees it, percent-encoded. */
export function decodeAccountHint(value: string | undefined | null): AccountHint | null {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(value));
    if (
      parsed &&
      typeof parsed === "object" &&
      "name" in parsed &&
      typeof parsed.name === "string"
    ) {
      const avatarUrl =
        "avatarUrl" in parsed && typeof parsed.avatarUrl === "string" ? parsed.avatarUrl : null;
      return { name: parsed.name.slice(0, 60), avatarUrl };
    }
  } catch {
    // A damaged cookie reads as signed out
  }
  return null;
}
