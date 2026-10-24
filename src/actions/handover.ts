"use server";

import { z } from "zod";
import { getAdmin } from "@/lib/admin/access";
import { getAccount } from "@/lib/auth/server";
import {
  HANDOVER_TOKEN,
  handoverStore,
  type ClaimResult,
  type HandoverLink,
} from "@/lib/invites/handover";

/*
 * Hand-over links (update 5). Admins make and withdraw them for their own invites
 * (Admin, Hand over); the family takes one on /claim/<token> once signed in.
 */

const eventId = z.uuid();

/** A new link for one of the admin's own invites. */
export async function createHandover(id: string): Promise<HandoverLink | null> {
  const store = handoverStore();
  const admin = await getAdmin();
  if (!store || !admin || !eventId.safeParse(id).success) return null;
  return store.create(admin.account, id).catch(() => null);
}

/** Stops an invite's open link working. */
export async function withdrawHandover(id: string): Promise<boolean> {
  const store = handoverStore();
  const admin = await getAdmin();
  if (!store || !admin || !eventId.safeParse(id).success) return false;
  return store.withdraw(admin.account, id).catch(() => false);
}

/** Takes a link: the invite becomes the signed-in person's. */
export async function claimHandover(
  token: string,
): Promise<ClaimResult | { ok: false; reason: "signed-out" }> {
  const store = handoverStore();
  if (!store || !HANDOVER_TOKEN.test(token)) return { ok: false, reason: "failed" };
  const account = await getAccount();
  if (!account) return { ok: false, reason: "signed-out" };
  return store.claim(account, token).catch(() => ({ ok: false, reason: "failed" }) as const);
}
