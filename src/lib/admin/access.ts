import "server-only";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import type { Account } from "@/lib/auth/account";
import { PREVIEW_ADMIN_PHONE, authMode } from "@/lib/auth/mode";
import { getAccount } from "@/lib/auth/server";
import { supabaseServer } from "@/lib/supabase/server";

/*
 * Who may open the master admin (/admin). The database's admins table decides, through
 * is_admin(); nobody can add themselves from the app. In preview mode one test number is
 * the admin, so tests can reach it.
 */

export type Admin = { account: Account };

export const getAdmin = cache(async (): Promise<Admin | null> => {
  const account = await getAccount();
  if (!account) return null;
  if (authMode() === "preview") return account.phone === PREVIEW_ADMIN_PHONE ? { account } : null;
  const supabase = await supabaseServer();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("is_admin");
  return !error && data === true ? { account } : null;
});

/**
 * For admin pages: signed-out visitors go to sign in and come back; anyone signed in who
 * isn't an admin sees the ordinary "page not found", so the area gives nothing away.
 */
export async function requireAdmin(path: string): Promise<Admin> {
  const admin = await getAdmin();
  if (admin) return admin;
  if (!(await getAccount())) redirect(`/sign-in?next=${encodeURIComponent(path)}`);
  notFound();
}
