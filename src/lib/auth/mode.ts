/*
 * Which sign-in service runs. "supabase" once the project's keys are set. "preview" is a
 * stand-in for tests and local work without Supabase: any number signs in with the code
 * 123456. It can never run on the live site. "off" shows that accounts open soon.
 */

export type AuthMode = "supabase" | "preview" | "off";

export function supabaseEnv(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && anonKey ? { url, anonKey } : null;
}

export function authMode(): AuthMode {
  if (supabaseEnv()) return "supabase";
  if (process.env.SHUBHDWAR_AUTH_PREVIEW === "1" && process.env.VERCEL_ENV !== "production") {
    return "preview";
  }
  return "off";
}

/**
 * Whether hosts can sign in with a mobile number. Real SMS codes in India need DLT
 * registration (docs/LAUNCH.md, step 8), so the live site offers Google alone until
 * PHONE_SIGN_IN=on is set in Vercel (owner, 2026-10-16). Preview mode keeps it: the tests
 * sign in with a number.
 */
export function phoneSignIn(): boolean {
  const mode = authMode();
  if (mode === "preview") return true;
  return mode === "supabase" && process.env.PHONE_SIGN_IN?.trim() === "on";
}

/** The code that signs anyone in, in preview mode only. */
export const PREVIEW_CODE = "123456";

/** In preview mode only, the number that signs in as an admin of /admin. */
export const PREVIEW_ADMIN_PHONE = "+919999900000";

/**
 * Whether hosts can sign in with a code sent to their email (owner, 2026-10-25: Google alone
 * lost every visitor who reached sign-in). The site makes the code itself and sends it
 * through Resend, so it needs the Supabase secret key and RESEND_API_KEY, both already set
 * for the other emails. EMAIL_SIGN_IN=off hides it again. Preview mode keeps it, with the
 * code 123456.
 */
export function emailSignIn(): boolean {
  const mode = authMode();
  if (mode === "preview") return true;
  return (
    mode === "supabase" &&
    process.env.EMAIL_SIGN_IN?.trim() !== "off" &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) &&
    Boolean(process.env.RESEND_API_KEY?.trim())
  );
}

/** The ways in the sign-in form offers, for forms outside /sign-in; null while sign-in is off. */
export function signInOptions(): { phone: boolean; email: boolean; preview: boolean } | null {
  const mode = authMode();
  if (mode === "off") return null;
  return { phone: phoneSignIn(), email: emailSignIn(), preview: mode === "preview" };
}
