import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";
import { supabaseEnv } from "@/lib/auth/mode";

/**
 * Refreshes the Supabase session on the way in, writing new cookies to both the request
 * (for the page about to render) and the response (for the browser). Returns whether
 * someone is signed in.
 */
export async function refreshSupabaseSession(
  request: NextRequest,
  response: () => NextResponse,
): Promise<{ response: NextResponse; signedIn: boolean }> {
  const env = supabaseEnv();
  let current = response();
  if (!env) return { response: current, signedIn: false };
  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(toSet, headers) {
        for (const { name, value } of toSet) request.cookies.set(name, value);
        current = response();
        for (const { name, value, options } of toSet) current.cookies.set(name, value, options);
        for (const [key, value] of Object.entries(headers ?? {})) current.headers.set(key, value);
      },
    },
  });
  const { data } = await supabase.auth.getClaims();
  return { response: current, signedIn: Boolean(data?.claims?.sub) };
}
