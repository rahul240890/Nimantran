import { z } from "zod";
import { LOCALES, type Locale } from "@/lib/categories/ids";

/*
 * The signed-in person, the same shape whichever sign-in service is behind it. The profile
 * (name and language) lives with the sign-in record until the database arrives in Step 8.
 */

export type AuthFailure =
  "unavailable" | "bad-code" | "too-many" | "sms-failed" | "provider-off" | "unknown";

export type SignInMethod = "phone" | "google";

export type Account = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  avatarUrl: string | null;
  language: Locale;
  method: SignInMethod;
};

export const PROFILE_RULES = { name: 60 } as const;

export const profileSchema = z.object({
  name: z.string().trim().min(1, { message: "required" }).max(PROFILE_RULES.name, {
    message: "too-long",
  }),
  language: z.enum(LOCALES, { message: "invalid" }),
});
export type Profile = z.infer<typeof profileSchema>;

/** Where to go after signing in: only paths on this site, never another origin. */
export function safeNext(value: unknown, fallback = "/invites"): string {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}

/** First name for greetings; the whole name when it has one word. */
export function firstName(account: Pick<Account, "name">): string {
  return account.name.trim().split(/\s+/)[0] ?? "";
}
