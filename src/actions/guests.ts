"use server";

import { z } from "zod";
import { normalizePhone } from "@/lib/auth/phone";
import { getAccount } from "@/lib/auth/server";
import { GUEST_RULES } from "@/lib/guests/list";
import { istToIso, SEND_PURPOSES } from "@/lib/guests/schedule";
import { HOST_ACCESS, hostStore, type AcceptResult, type NewGuest } from "@/lib/invites/hosts";
import { editionsActive, invitePlan } from "@/lib/payments/editions";
import { cohostLimit } from "@/lib/plans/catalog";

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

const sendSchema = z.object({
  purpose: z.enum(SEND_PURPOSES),
  functionId: z.string().min(1).max(80).nullable(),
  date: z.string().max(10),
  time: z.string().max(5),
});

export type ScheduleResult = { ok: true; id: string } | { ok: false; reason: "past" | "failed" };

/**
 * Plans an invitation or reminder for a date and time in India. At that time the host sends
 * it from their own WhatsApp; nothing goes out by itself until a text-message route exists.
 */
export async function scheduleSend(inviteId: string, input: unknown): Promise<ScheduleResult> {
  const parsed = sendSchema.safeParse(input);
  const ctx = await context(inviteId);
  if (!ctx || !parsed.success) return { ok: false, reason: "failed" };
  const sendAt = istToIso(parsed.data.date, parsed.data.time);
  if (!sendAt) return { ok: false, reason: "failed" };
  const at = new Date(sendAt).getTime();
  // A minute's grace for slow typing; no further out than two years
  if (at < Date.now() - 60_000) return { ok: false, reason: "past" };
  if (at > Date.now() + 2 * 366 * 86_400_000) return { ok: false, reason: "failed" };
  const id = await ctx.store
    .scheduleSend(ctx.account, inviteId, {
      purpose: parsed.data.purpose,
      functionId: parsed.data.functionId,
      sendAt,
    })
    .catch(() => null);
  return id ? { ok: true, id } : { ok: false, reason: "failed" };
}

/** Marks a planned send as sent (the host went through the list) or cancels it. */
export async function closeSend(
  inviteId: string,
  sendId: string,
  status: unknown,
): Promise<boolean> {
  const parsed = z.enum(["sent", "cancelled"]).safeParse(status);
  const ctx = await context(inviteId);
  if (!ctx || !parsed.success || !id.safeParse(sendId).success) return false;
  return ctx.store.closeSend(ctx.account, inviteId, sendId, parsed.data).catch(() => false);
}

const hostInviteSchema = z.object({
  label: z.string().trim().max(40),
  access: z.enum(HOST_ACCESS),
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
});

export type HostInviteInput = z.input<typeof hostInviteSchema>;

export type HostInviteResult =
  | { ok: true; token: string }
  /** full: the edition's co-hosts are all taken or invited; phone: the number isn't valid. */
  | { ok: false; reason: "full" | "phone" | "failed" };

/**
 * A private link that makes whoever opens it (and signs in) a co-host, with the access
 * the owner chose. While editions apply, links stop at the co-hosts the edition includes,
 * counting links not used yet; the database checks again when one is accepted.
 */
export async function createHostInvite(
  inviteId: string,
  input: unknown,
): Promise<HostInviteResult> {
  const parsed = hostInviteSchema.safeParse(input);
  const ctx = await context(inviteId);
  if (!ctx) return { ok: false, reason: "failed" };
  if (!parsed.success) {
    const phone = parsed.error.issues.some((issue) => issue.path[0] === "phone");
    return { ok: false, reason: phone ? "phone" : "failed" };
  }
  if (await editionsActive()) {
    const [plan, dashboard] = await Promise.all([
      invitePlan(ctx.account, inviteId),
      ctx.store.dashboard(ctx.account, inviteId),
    ]);
    const room = plan ? cohostLimit(plan) : null;
    const taken = dashboard
      ? dashboard.hosts.filter((host) => host.role === "cohost").length +
        dashboard.hostInvites.length
      : 0;
    if (room !== null && taken >= room) return { ok: false, reason: "full" };
  }
  const token = await ctx.store
    .createHostInvite(ctx.account, inviteId, parsed.data)
    .catch(() => null);
  return token ? { ok: true, token } : { ok: false, reason: "failed" };
}

/** The owner lets a co-host edit the invite, or keeps them to the guests and replies. */
export async function setHostAccess(
  inviteId: string,
  userId: string,
  access: unknown,
): Promise<boolean> {
  const ctx = await context(inviteId);
  const parsed = z.enum(HOST_ACCESS).safeParse(access);
  if (!ctx || !parsed.success || !z.string().min(1).max(80).safeParse(userId).success) return false;
  return ctx.store.setHostAccess(ctx.account, inviteId, userId, parsed.data).catch(() => false);
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
