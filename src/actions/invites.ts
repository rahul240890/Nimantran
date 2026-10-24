"use server";

import { z } from "zod";
import { getAccount } from "@/lib/auth/server";
import { type InviteDraft } from "@/lib/editor/draft";
import { draftProblems, parseDraft } from "@/lib/editor/draft-checks";
import { inviteStore } from "@/lib/invites/store";
import { editionsActive, invitePlan, liveEdition } from "@/lib/payments/editions";
import {
  FREE_EDITION,
  editionFor,
  planNeeded,
  planShortfalls,
  type Edition,
  type PlanId,
  type PlanNeed,
} from "@/lib/plans/catalog";
import { designTier, draftDesignId } from "@/lib/plans/design-defaults";
import { getPricing } from "@/lib/plans/pricing";
import { isSlug, slugAlternatives } from "@/lib/publish/slug";

/*
 * Saving invites to the signed-in person's account. Every call checks who is signed in;
 * the database's row level security checks again that they host the invite.
 */

export type SyncResult =
  | { status: "saved"; id: string; savedAt: number; missingPhotos: string[]; missingClip: boolean }
  /**
   * The invite is live and this change needs a package it doesn't have, such as another
   * design than the one paid for: nothing was saved, and guests keep what they see.
   */
  | { status: "needs-plan"; plan: PlanId; shortfalls: PlanNeed[]; paidDesign: string | null }
  | { status: "signed-out" }
  | { status: "failed" };

const id = z.uuid();

/** What a draft needs beyond its package while payments are on; empty when it's covered. */
async function shortfallsFor(draft: InviteDraft, edition: Edition) {
  const pricing = await getPricing();
  const designId = draftDesignId(draft);
  // A paid design asks for at least Basic at its price; a package for another design covers
  // nothing on this one (one payment, one design)
  const design = designTier(pricing, designId);
  const shortfalls = planShortfalls(draft, editionFor(edition, designId), design);
  return { shortfalls, plan: planNeeded(draft, design) };
}

/**
 * Whether a change to a live invite adds something its package doesn't cover: another
 * design it wasn't bought for, or more card languages than the live copy has. Words and
 * dates always save, so an invite published before payments began can still be corrected.
 */
async function addsShortfall(draft: InviteDraft, live: InviteDraft, edition: Edition) {
  const [now, was] = await Promise.all([
    shortfallsFor(draft, edition),
    shortfallsFor(live, edition),
  ]);
  const newDesign = draftDesignId(draft) !== draftDesignId(live);
  return now.shortfalls.some((need) => {
    if (need.limit === "design") return newDesign;
    const had = was.shortfalls.find((old) => old.limit === need.limit);
    return !had || need.used > had.used;
  });
}

export async function saveInvite(input: unknown): Promise<SyncResult> {
  const draft = parseDraft(input);
  const store = inviteStore();
  if (!draft || !store) return { status: "failed" };
  const account = await getAccount();
  if (!account) return { status: "signed-out" };
  // Guests see a live invite's saved copy: a change can't add what its package doesn't cover
  if (draft.remoteId && id.safeParse(draft.remoteId).success && (await editionsActive())) {
    const live = await liveEdition(account, draft.remoteId);
    if (live?.live) {
      const { shortfalls, plan } = await shortfallsFor(draft, live.edition);
      const before = shortfalls.length > 0 ? await store.get(account, draft.remoteId) : null;
      if (before && (await addsShortfall(draft, before, live.edition))) {
        return { status: "needs-plan", plan, shortfalls, paidDesign: live.edition.design };
      }
    }
  }
  const result = await store.save(account, draft);
  return result.ok
    ? {
        status: "saved",
        id: result.id,
        savedAt: result.updatedAt,
        missingPhotos: result.missingPhotos,
        missingClip: result.missingClip,
      }
    : { status: "failed" };
}

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

/**
 * Short-lived links to an invite's photos in the account, for devices that don't have them;
 * null when the account couldn't say, so no photo is taken for lost.
 */
export async function invitePhotoUrls(inviteId: string): Promise<Record<string, string> | null> {
  const store = inviteStore();
  const account = await getAccount();
  if (!store || !account || !id.safeParse(inviteId).success) return null;
  return store.photoUrls(account, inviteId).catch(() => null);
}

export type SlugCheck = { available: boolean; suggestions: string[] };

const yearSchema = z
  .string()
  .regex(/^\d{4}$/)
  .optional();

async function freeAlternatives(slug: string, year?: string): Promise<string[]> {
  const store = inviteStore();
  if (!store) return [];
  const free: string[] = [];
  for (const option of slugAlternatives(slug, Math.random, year)) {
    if (await store.slugAvailable(option)) free.push(option);
    if (free.length === 2) break;
  }
  return free;
}

/**
 * Whether a link is free, with two free ones to offer when it isn't, the first ending in
 * the occasion's year when it is given.
 */
export async function checkSlug(slug: string, occasionYear?: string): Promise<SlugCheck> {
  const store = inviteStore();
  const account = await getAccount();
  const ending = yearSchema.safeParse(occasionYear);
  if (!store || !account || !isSlug(slug) || !ending.success) {
    return { available: false, suggestions: [] };
  }
  if (await store.slugAvailable(slug)) return { available: true, suggestions: [] };
  return { available: false, suggestions: await freeAlternatives(slug, ending.data) };
}

export type PublishOutcome =
  | { status: "published"; slug: string }
  | { status: "taken"; suggestions: string[] }
  /** Payments are on and the invite uses more than its package covers (Step 17). */
  | { status: "needs-plan"; plan: PlanId; shortfalls: PlanNeed[] }
  | { status: "not-ready" | "signed-out" | "failed" };

/** Puts an invite live at /i/<slug>. It must be saved and complete. */
export async function publishInvite(
  inviteId: string,
  slug: string,
  occasionYear?: string,
): Promise<PublishOutcome> {
  const store = inviteStore();
  if (!store || !id.safeParse(inviteId).success || !isSlug(slug)) return { status: "failed" };
  const account = await getAccount();
  if (!account) return { status: "signed-out" };
  const draft = await store.get(account, inviteId);
  if (!draft) return { status: "failed" };
  if (draftProblems(draft).length > 0) return { status: "not-ready" };
  if (await editionsActive()) {
    const edition = (await invitePlan(account, inviteId)) ?? FREE_EDITION;
    const { shortfalls, plan } = await shortfallsFor(draft, edition);
    if (shortfalls.length > 0) return { status: "needs-plan", plan, shortfalls };
  }
  const result = await store.publish(account, inviteId, slug);
  if (result.ok) return { status: "published", slug: result.slug };
  if (result.reason === "taken") {
    const ending = yearSchema.safeParse(occasionYear);
    return { status: "taken", suggestions: await freeAlternatives(slug, ending.data) };
  }
  return { status: "failed" };
}

/** Takes an invite off its link. The link is kept for when it's published again. */
export async function unpublishInvite(inviteId: string): Promise<boolean> {
  const store = inviteStore();
  const account = await getAccount();
  if (!store || !account || !id.safeParse(inviteId).success) return false;
  return store.unpublish(account, inviteId);
}
