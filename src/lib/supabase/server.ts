import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseEnv } from "@/lib/auth/mode";

/**
 * A Supabase client for server components, server actions and route handlers, acting as
 * the signed-in person (their session travels in cookies). Null until the keys are set.
 */
export async function supabaseServer() {
  const env = supabaseEnv();
  if (!env) return null;
  const store = await cookies();
  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(toSet) {
        try {
          for (const { name, value, options } of toSet) store.set(name, value, options);
        } catch {
          // Server components can't write cookies; the proxy refreshes the session instead
        }
      },
    },
  });
}
