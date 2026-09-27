import "server-only";
import { createClient } from "@supabase/supabase-js";
import { previewDb } from "@/lib/invites/preview-db";
import { inviteStore } from "@/lib/invites/store";
import { supabaseServer } from "@/lib/supabase/server";
import type { Account } from "./account";
import { authMode, supabaseEnv } from "./mode";

/*
 * Erasing an account, as the privacy policy promises (DPDP Act 2023): every invite the
 * person owns, with its photos, functions, guest list and replies, then the sign-in
 * itself. Invites they only co-host stay with their owners; the person's place as a
 * co-host goes with the account.
 */

export async function deleteAccountData(account: Account): Promise<boolean> {
  const store = inviteStore();
  if (!store) return false;

  if (authMode() === "preview") {
    for (const [id, stored] of previewDb.invites) {
      if (stored.owner === account.id) {
        await store.remove(account, id);
        for (const [token, guest] of previewDb.guests) {
          if (guest.eventId === id) previewDb.guests.delete(token);
        }
      } else if (stored.hosts) {
        stored.hosts = stored.hosts.filter((host) => host.userId !== account.id);
      }
    }
    return true;
  }

  const env = supabaseEnv();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = await supabaseServer();
  if (!env || !serviceKey || !supabase) return false;

  // Each owned invite through the store, so its photo files go too (the database
  // deletes rows when the account goes, but not files)
  const { data: owned, error } = await supabase
    .from("events")
    .select("id")
    .eq("owner_id", account.id);
  if (error) return false;
  for (const { id } of owned ?? []) {
    if (!(await store.remove(account, id as string))) return false;
  }

  // Deleting the sign-in removes the profile, and with it everything that still points at it
  const admin = createClient(env.url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error: deleteError } = await admin.auth.admin.deleteUser(account.id);
  return !deleteError;
}
