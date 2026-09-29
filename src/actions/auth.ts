"use server";

import { headers } from "next/headers";
import { profileSchema, safeNext, type Account, type AuthFailure } from "@/lib/auth/account";
import { isOtp, normalizePhone } from "@/lib/auth/phone";
import {
  getAccount,
  googleSignInUrl,
  sendPhoneCode,
  signOut as endSession,
  updateProfile,
  verifyPhoneCode,
} from "@/lib/auth/server";
import { deleteAccountData } from "@/lib/auth/delete-account";
import { setLocale } from "./locale";

/*
 * Sign-in and profile actions. Public by nature, so each one re-checks its input; the
 * sign-in service rate-limits codes on its side.
 */

export type SendCodeResult =
  | { status: "sent"; phone: string }
  | { status: "invalid"; error: "required" | "invalid" }
  | { status: "failed"; error: AuthFailure };

export async function sendCode(input: string): Promise<SendCodeResult> {
  const parsed = normalizePhone(String(input ?? ""));
  if ("error" in parsed) return { status: "invalid", error: parsed.error };
  const result = await sendPhoneCode(parsed.phone);
  return result.ok
    ? { status: "sent", phone: parsed.phone }
    : { status: "failed", error: result.error };
}

export type VerifyCodeResult =
  | { status: "signed-in"; name: string; language: Account["language"]; next: string }
  | { status: "invalid" }
  | { status: "failed"; error: AuthFailure };

export async function verifyCode(
  phoneInput: string,
  code: string,
  next: string,
): Promise<VerifyCodeResult> {
  const phone = normalizePhone(String(phoneInput ?? ""));
  if ("error" in phone || !isOtp(String(code ?? ""))) return { status: "invalid" };
  const result = await verifyPhoneCode(phone.phone, code);
  if (!result.ok) return { status: "failed", error: result.error };
  return {
    status: "signed-in",
    name: result.value.name,
    language: result.value.language,
    next: safeNext(next),
  };
}

/** The address to send the browser to for Google. */
export async function startGoogle(
  next: string,
): Promise<{ status: "redirect"; url: string } | { status: "failed"; error: AuthFailure }> {
  const list = await headers();
  const host = list.get("x-forwarded-host") ?? list.get("host");
  const protocol =
    list.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  if (!host) return { status: "failed", error: "unknown" };
  const result = await googleSignInUrl(`${protocol}://${host}`, safeNext(next));
  return result.ok
    ? { status: "redirect", url: result.value }
    : { status: "failed", error: result.error };
}

export type SaveProfileResult =
  | { status: "saved"; account: Account }
  | { status: "invalid"; errors: Partial<Record<"name" | "language", string>> }
  | { status: "failed"; error: AuthFailure };

export async function saveProfile(input: unknown): Promise<SaveProfileResult> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    const errors: Partial<Record<"name" | "language", string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "name" || key === "language") errors[key] ??= issue.message;
    }
    return { status: "invalid", errors };
  }
  const result = await updateProfile(parsed.data);
  // Hindi or English as the profile language also switches the site to it
  if (result.ok) await setLocale(result.value.language);
  return result.ok
    ? { status: "saved", account: result.value }
    : { status: "failed", error: result.error };
}

export async function signOut(): Promise<void> {
  await endSession();
}

/**
 * Deletes the signed-in person's account and every invite they own, then signs them out.
 * `confirmed` must be true: the page asks them to tick that they understand first.
 */
export async function deleteAccount(confirmed: unknown): Promise<"deleted" | "failed"> {
  if (confirmed !== true) return "failed";
  const account = await getAccount();
  if (!account) return "failed";
  if (!(await deleteAccountData(account))) return "failed";
  await endSession();
  return "deleted";
}
