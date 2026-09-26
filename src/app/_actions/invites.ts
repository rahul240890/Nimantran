"use server";

import { z } from "zod";
import { getAccount } from "@/lib/auth/server";
import { parseDraft, type InviteDraft } from "@/lib/editor/draft";
import { inviteStore } from "@/lib/invites/store";

/*
 * Saving invites to the signed-in person's account. Every call checks who is signed in;
 * the database's row level security checks again that they host the invite.
 */

export type SyncResult =
  | { status: "saved"; id: string; savedAt: number }
  | { status: "signed-out" }
  | { status: "failed" };

export async function saveInvite(input: unknown): Promise<SyncResult> {
  const draft = parseDraft(input);
  const store = inviteStore();
  if (!draft || !store) return { status: "failed" };
  const account = await getAccount();
  if (!account) return { status: "signed-out" };
  const result = await store.save(account, draft);
  return result.ok
    ? { status: "saved", id: result.id, savedAt: result.updatedAt }
    : { status: "failed" };
}

const id = z.uuid();

export async function loadInvite(inviteId: string): Promise<InviteDraft | null> {
  const store = inviteStore();
  const account = await getAccount();
  if (!store || !account || !id.safeParse(inviteId).success) return null;
  return store.get(account, inviteId);
}

export async function deleteInvite(inviteId: string): Promise<boolean> {
  const store = inviteStore();
  const account = await getAccount();
  if (!store || !account || !id.safeParse(inviteId).success) return false;
  return store.remove(account, inviteId);
}
