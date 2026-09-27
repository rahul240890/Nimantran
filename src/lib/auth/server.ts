import "server-only";
import type { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { LOCALES, type Locale } from "@/lib/categories/ids";
import { supabaseServer } from "@/lib/supabase/server";
import type { Account, AuthFailure, Profile } from "./account";
import { ACCOUNT_HINT_COOKIE, encodeAccountHint } from "./hint";
import { PREVIEW_CODE, authMode } from "./mode";
import { PREVIEW_COOKIE, openPreviewSession, sealPreviewSession } from "./preview-session";

/*
 * Sign-in on the server, the same calls whichever service runs (see mode.ts). Pages and
 * server actions use these; nothing else talks to the sign-in service directly.
 */

type Result<T = void> = { ok: true; value: T } | { ok: false; error: AuthFailure };

const ok = <T>(value: T): Result<T> => ({ ok: true, value });
const fail = (error: AuthFailure): Result<never> => ({ ok: false, error });

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function accountFromUser(user: User): Account {
  const meta = user.user_metadata ?? {};
  const phone = user.phone ? `+${user.phone.replace(/^\+/, "")}` : null;
  // A phone sign-in has no name until the host adds one on the profile
  const name = [meta.name, meta.full_name].find(
    (value): value is string => typeof value === "string" && Boolean(value.trim()),
  );
  return {
    id: user.id,
    name: (name ?? "").trim().slice(0, 60),
    phone,
    email: user.email || null,
    avatarUrl: typeof meta.avatar_url === "string" ? meta.avatar_url : null,
    language: isLocale(meta.language) ? meta.language : "en",
    method: user.app_metadata?.provider === "google" ? "google" : "phone",
  };
}

/** Maps the sign-in service's errors to messages the UI knows. */
export function authFailure(error: {
  code?: string;
  status?: number;
  message?: string;
}): AuthFailure {
  switch (error.code) {
    // Supabase answers a wrong code and an old code the same way
    case "otp_expired":
    case "invalid_credentials":
      return "bad-code";
    case "over_sms_send_rate_limit":
    case "over_request_rate_limit":
      return "too-many";
    case "sms_send_failed":
      return "sms-failed";
    case "otp_disabled":
    case "phone_provider_disabled":
    case "provider_disabled":
      return "provider-off";
  }
  return error.status === 429 ? "too-many" : "unknown";
}

/** Tells the header who is signed in, without a request (see hint.ts). */
async function writeHint(account: Account | null) {
  const store = await cookies();
  if (account) {
    store.set(ACCOUNT_HINT_COOKIE, encodeAccountHint(account), {
      ...cookieOptions,
      httpOnly: false,
    });
  } else {
    store.delete(ACCOUNT_HINT_COOKIE);
  }
}

export async function getAccount(): Promise<Account | null> {
  // Reading cookies first makes every page that asks render per request, never at build
  const store = await cookies();
  const mode = authMode();
  if (mode === "preview") return openPreviewSession(store.get(PREVIEW_COOKIE)?.value);
  const supabase = await supabaseServer();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ? accountFromUser(data.user) : null;
}

export async function sendPhoneCode(phone: string): Promise<Result> {
  const mode = authMode();
  if (mode === "preview") return ok(undefined);
  const supabase = await supabaseServer();
  if (!supabase) return fail("unavailable");
  const { error } = await supabase.auth.signInWithOtp({ phone, options: { channel: "sms" } });
  return error ? fail(authFailure(error)) : ok(undefined);
}

export async function verifyPhoneCode(phone: string, code: string): Promise<Result<Account>> {
  const mode = authMode();
  if (mode === "preview") {
    if (code !== PREVIEW_CODE) return fail("bad-code");
    const existing = await openPreviewSession((await cookies()).get(PREVIEW_COOKIE)?.value);
    const account: Account =
      existing?.phone === phone
        ? existing
        : {
            id: `preview-${phone.replace(/\D/g, "")}`,
            name: "",
            phone,
            email: null,
            avatarUrl: null,
            language: "en",
            method: "phone",
          };
    await startPreviewSession(account);
    return ok(account);
  }
  const supabase = await supabaseServer();
  if (!supabase) return fail("unavailable");
  const { data, error } = await supabase.auth.verifyOtp({ phone, token: code, type: "sms" });
  if (error || !data.user) return fail(error ? authFailure(error) : "unknown");
  const account = accountFromUser(data.user);
  await writeHint(account);
  return ok(account);
}

/** Where to send the browser to sign in with Google. */
export async function googleSignInUrl(origin: string, next: string): Promise<Result<string>> {
  const callback = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
  const mode = authMode();
  if (mode === "preview") return ok(`${callback}&preview=google`);
  const supabase = await supabaseServer();
  if (!supabase) return fail("unavailable");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callback, queryParams: { prompt: "select_account" } },
  });
  if (error || !data.url) return fail(error ? authFailure(error) : "unknown");
  return ok(data.url);
}

/** Finishes a Google sign-in on the way back from Google. */
export async function finishGoogleSignIn(params: URLSearchParams): Promise<Result<Account>> {
  const mode = authMode();
  if (mode === "preview" && params.get("preview") === "google") {
    const account: Account = {
      id: "preview-google-meera",
      name: "Meera Iyer",
      phone: null,
      email: "meera@example.com",
      avatarUrl: null,
      language: "en",
      method: "google",
    };
    await startPreviewSession(account);
    return ok(account);
  }
  const code = params.get("code");
  const supabase = await supabaseServer();
  if (!supabase || !code) return fail(supabase ? "unknown" : "unavailable");
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) return fail(error ? authFailure(error) : "unknown");
  const account = accountFromUser(data.user);
  await writeHint(account);
  return ok(account);
}

export async function updateProfile(profile: Profile): Promise<Result<Account>> {
  const account = await getAccount();
  if (!account) return fail("unavailable");
  if (authMode() === "preview") {
    const next = { ...account, ...profile };
    await startPreviewSession(next);
    return ok(next);
  }
  const supabase = await supabaseServer();
  if (!supabase) return fail("unavailable");
  const { data, error } = await supabase.auth.updateUser({
    data: { name: profile.name, language: profile.language },
  });
  if (error || !data.user) return fail(error ? authFailure(error) : "unknown");
  const next = accountFromUser(data.user);
  await writeHint(next);
  return ok(next);
}

export async function signOut(): Promise<void> {
  if (authMode() === "preview") {
    (await cookies()).delete(PREVIEW_COOKIE);
  } else {
    const supabase = await supabaseServer();
    await supabase?.auth.signOut();
  }
  await writeHint(null);
}

async function startPreviewSession(account: Account) {
  (await cookies()).set(PREVIEW_COOKIE, await sealPreviewSession(account), cookieOptions);
  await writeHint(account);
}
