import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseEnv } from "@/lib/auth/mode";

/**
 * A Supabase client acting as a guest, with no session, for the public invite pages.
 * It reaches only what the database exposes to everyone (published invites). Null until
 * the keys are set.
 */
export function supabasePublic() {
  const env = supabaseEnv();
  if (!env) return null;
  return createClient(env.url, env.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
