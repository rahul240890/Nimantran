"use server";

import { z } from "zod";
import { normalizePhone } from "@/lib/auth/phone";
import { getAccount } from "@/lib/auth/server";
import { GUEST_RULES } from "@/lib/guests/list";
import { hostStore, type AcceptResult, type NewGuest } from "@/lib/invites/hosts";

/*
 * The host dashboard's changes (Step 11). Every call checks who is signed in; the
 * database's row level security checks again that they host the invite.
 */

const id = z.uuid();
const guestIdSchema = z.string().min(1).max(64);
const hostToken = z.string().regex(/^[0-9a-f]{16,64}$/);

const guestSchema = z.object({
  name: z.string().trim().min(1).max(GUEST_RULES.name),
  phone: z
    .string()
    .trim()
    .max(24)
    .transform((value, ctx) => {
      if (!value) return null;
      const parsed = normalizePhone(value);
      if ("phone" in parsed) return parsed.phone;
      ctx.addIssue({ code: "custom", message: "phone" });
      return z.NEVER;
    }),
  group: z.string().trim().max(GUEST_RULES.group),
  partySize: z.number().int().min(1).max(GUEST_RULES.partySize),
  functionIds: z.array(z.string().min(1).max(80)).max(20),
});

export type GuestInput = z.input<typeof guestSchema>;

async function context(inviteId: string) {
  const store = hostStore();
  if (!store || !id.safeParse(inviteId).success) return null;
  const account = await getAccount();
  return account ? { store, account } : null;
}

export async function addGuests(inviteId: string, input: unknown): Promise<boolean> {
  const parsed = z.array(guestSchema).min(1).max(GUEST_RULES.paste).safeParse(input);
  const ctx = await context(inviteId);
  if (!ctx || !parsed.success) return false;
  return ctx.store.addGuests(ctx.account, inviteId, parsed.data as NewGuest[]).catch(() => false);
}

export async function updateGuest(
  inviteId: string,
  guestId: string,
  input: unknown,
): Promise<boolean> {
  const parsed = guestSchema.safeParse(input);
  const ctx = await context(inviteId);
  if (!ctx || !parsed.success || !guestIdSchema.safeParse(guestId).success) return false;
  return ctx.store
    .updateGuest(ctx.account, inviteId, guestId, parsed.data as NewGuest)
    .catch(() => false);
}

const guestIds = z.array(guestIdSchema).min(1).max(1000);

export async function removeGuests(inviteId: string, ids: unknown): Promise<boolean> {
  const parsed = guestIds.safeParse(ids);
  const ctx = await context(inviteId);
  if (!ctx || !parsed.success) return false;
  return ctx.store.removeGuests(ctx.account, inviteId, parsed.data).catch(() => false);
}

/** Records that reminders went out, after the host sends them from their own WhatsApp. */
export async function markReminded(inviteId: string, ids: unknown): Promise<boolean> {
  const parsed = guestIds.safeParse(ids);
  const ctx = await context(inviteId);
  if (!ctx || !parsed.success) return false;
  return ctx.store.markReminded(ctx.account, inviteId, parsed.data).catch(() => false);
}

/** A private link that makes whoever opens it (and signs in) a co-host. */
export async function createHostInvite(inviteId: string, label: unknown): Promise<string | null> {
  const parsed = z.string().trim().max(40).safeParse(label);
  const ctx = await context(inviteId);
  if (!ctx || !parsed.success) return null;
  return ctx.store.createHostInvite(ctx.account, inviteId, parsed.data).catch(() => null);
}

export async function withdrawHostInvite(inviteId: string, linkId: string): Promise<boolean> {
  const ctx = await context(inviteId);
  if (!ctx || !id.safeParse(linkId).success) return false;
  return ctx.store.withdrawHostInvite(ctx.account, inviteId, linkId).catch(() => false);
}

/** Removes a co-host; a co-host passing their own id leaves the invite. */
export async function removeHost(inviteId: string, userId: string): Promise<boolean> {
  const ctx = await context(inviteId);
  if (!ctx || !z.string().min(1).max(80).safeParse(userId).success) return false;
  return ctx.store.removeHost(ctx.account, inviteId, userId).catch(() => false);
}

export async function acceptHostInvite(
  token: string,
): Promise<AcceptResult | { ok: false; reason: "signed-out" }> {
  const store = hostStore();
  if (!store || !hostToken.safeParse(token).success) return { ok: false, reason: "failed" };
  const account = await getAccount();
  if (!account) return { ok: false, reason: "signed-out" };
  return store
    .acceptHostInvite(account, token)
    .catch(() => ({ ok: false, reason: "failed" }) as const);
}
