import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseEnv } from "@/lib/auth/mode";

/**
 * A Supabase client acting as the server itself, past row level security. Only for work no
 * signed-in person may do directly: recording a checked payment, erasing an account. Null
 * until SUPABASE_SERVICE_ROLE_KEY is set; never reaches the browser.
 */
export function supabaseService() {
  const env = supabaseEnv();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!env || !serviceKey) return null;
  return createClient(env.url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
