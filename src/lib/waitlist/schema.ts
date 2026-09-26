import { z } from "zod";
import { waitlist } from "@/content/landing";
import type { Translation } from "@/i18n/text";

type Messages = Translation<
  Pick<typeof waitlist.errors, "name" | "nameLong" | "email" | "phone" | "occasion">
>;

export const occasions = ["wedding", "engagement", "family", "business"] as const;
export type Occasion = (typeof occasions)[number];

/** Digits only, so "+91 98765-43210" and "9876543210" compare the same. */
export function phoneDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * One schema for the browser and the server: the form shows these messages inline,
 * and the server action runs the same checks before anything is stored. The messages
 * come in the page's language; English unless given.
 */
export const waitlistSchemaIn = (e: Messages) =>
  z.object({
    name: z.string().trim().min(1, e.name).max(80, e.nameLong),
    email: z.string().trim().toLowerCase().max(254, e.email).pipe(z.email(e.email)),
    phone: z
      .string()
      .trim()
      .refine((value) => value === "" || /^[+\d\s()-]+$/.test(value), e.phone)
      .refine((value) => {
        if (value === "") return true;
        const digits = phoneDigits(value).length;
        return digits >= 10 && digits <= 15;
      }, e.phone),
    occasion: z.enum(occasions, e.occasion),
  });

export const waitlistSchema = waitlistSchemaIn(waitlist.errors);

export type WaitlistEntry = z.output<typeof waitlistSchema>;
export type WaitlistField = keyof WaitlistEntry;
/** What the form holds while someone types: every field is plain text. */
export type WaitlistDraft = Record<WaitlistField, string>;
export type WaitlistErrors = Partial<Record<WaitlistField, string>>;

export const emptyWaitlist: WaitlistDraft = { name: "", email: "", phone: "", occasion: "" };

/** The first message for each field, ready to show under it. */
export function fieldErrors(error: z.ZodError): WaitlistErrors {
  const out: WaitlistErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as WaitlistField | undefined;
    if (field && !out[field]) out[field] = issue.message;
  }
  return out;
}

export function validateWaitlist(
  input: unknown,
  messages: Messages = waitlist.errors,
): { ok: true; data: WaitlistEntry } | { ok: false; errors: WaitlistErrors } {
  const schema = messages === waitlist.errors ? waitlistSchema : waitlistSchemaIn(messages);
  const result = schema.safeParse(input);
  return result.success
    ? { ok: true, data: result.data }
    : { ok: false, errors: fieldErrors(result.error) };
}
