import "server-only";
import type { Account } from "@/lib/auth/account";
import { authMode } from "@/lib/auth/mode";
import { previewDb } from "@/lib/invites/preview-db";
import { findPublishedInvite } from "@/lib/invites/public";
import { inviteLimit } from "@/lib/plans/catalog";
import { getPricing } from "@/lib/plans/pricing";
import { supabaseService } from "@/lib/supabase/service";
import { editionsActive, invitePlan, publishedPlan } from "./editions";

/*
 * Invites by link (docs/PRICING.md): each package allows so many guests, counting the
 * guest list (each with a personal link) and everyone who replied from the open link.
 * The invitation itself always opens for everyone; only new guests stop at the limit.
 */

/** How many guests an invite has, or null when it can't be counted. */
async function guestCount(eventId: string): Promise<number | null> {
  if (authMode() === "preview") {
    return [...previewDb.guests.values()].filter((guest) => guest.eventId === eventId).length;
  }
  const service = supabaseService();
  if (!service) return null;
  const { count, error } = await service
    .from("guests")
    .select("id", { count: "exact", head: true })
    .eq("event_id", eventId);
  return error ? null : (count ?? 0);
}

/**
 * Whether a host can add this many more guests. Always yes until payments are on, and
 * when the invite can't be read (the database's own rules answer then).
 */
export async function hostHasRoom(
  account: Account,
  eventId: string,
  adding: number,
): Promise<boolean> {
  if (!(await editionsActive())) return true;
  const [edition, pricing, used] = await Promise.all([
    invitePlan(account, eventId),
    getPricing(),
    guestCount(eventId),
  ]);
  const limit = edition ? inviteLimit(edition.plan, pricing) : null;
  return limit === null || used === null || used + adding <= limit;
}

/** Whether a new guest can still reply from an invite's open link. */
export async function openLinkHasRoom(slug: string): Promise<boolean> {
  if (!(await editionsActive())) return true;
  const invite = await findPublishedInvite(slug);
  if (!invite) return true;
  const [plan, pricing, used] = await Promise.all([
    publishedPlan(slug, invite.id),
    getPricing(),
    guestCount(invite.id),
  ]);
  const limit = inviteLimit(plan, pricing);
  return limit === null || used === null || used < limit;
}
