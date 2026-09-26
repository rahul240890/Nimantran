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

/** The code that signs anyone in, in preview mode only. */
export const PREVIEW_CODE = "123456";
