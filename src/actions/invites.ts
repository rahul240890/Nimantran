"use server";

import { z } from "zod";
import { getAccount } from "@/lib/auth/server";
import { draftProblems, parseDraft, type InviteDraft } from "@/lib/editor/draft";
import { inviteStore } from "@/lib/invites/store";
import { isSlug, slugAlternatives } from "@/lib/publish/slug";

/*
 * Saving invites to the signed-in person's account. Every call checks who is signed in;
 * the database's row level security checks again that they host the invite.
 */

export type SyncResult =
  | { status: "saved"; id: string; savedAt: number; missingPhotos: string[] }
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
    ? {
        status: "saved",
        id: result.id,
        savedAt: result.updatedAt,
        missingPhotos: result.missingPhotos,
      }
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

/** Short-lived links to an invite's photos in the account, for devices that don't have them. */
export async function invitePhotoUrls(inviteId: string): Promise<Record<string, string>> {
  const store = inviteStore();
  const account = await getAccount();
  if (!store || !account || !id.safeParse(inviteId).success) return {};
  return store.photoUrls(account, inviteId);
}

export type SlugCheck = { available: boolean; suggestions: string[] };

async function freeAlternatives(slug: string): Promise<string[]> {
  const store = inviteStore();
  if (!store) return [];
  const free: string[] = [];
  for (const option of slugAlternatives(slug)) {
    if (await store.slugAvailable(option)) free.push(option);
    if (free.length === 2) break;
  }
  return free;
}

/** Whether a link is free, with two free ones to offer when it isn't. */
export async function checkSlug(slug: string): Promise<SlugCheck> {
  const store = inviteStore();
  const account = await getAccount();
  if (!store || !account || !isSlug(slug)) return { available: false, suggestions: [] };
  if (await store.slugAvailable(slug)) return { available: true, suggestions: [] };
  return { available: false, suggestions: await freeAlternatives(slug) };
}

export type PublishOutcome =
  | { status: "published"; slug: string }
  | { status: "taken"; suggestions: string[] }
  | { status: "not-ready" | "signed-out" | "failed" };

/** Puts an invite live at /i/<slug>. It must be saved and complete. */
export async function publishInvite(inviteId: string, slug: string): Promise<PublishOutcome> {
  const store = inviteStore();
  if (!store || !id.safeParse(inviteId).success || !isSlug(slug)) return { status: "failed" };
  const account = await getAccount();
  if (!account) return { status: "signed-out" };
  const draft = await store.get(account, inviteId);
  if (!draft) return { status: "failed" };
  if (draftProblems(draft).length > 0) return { status: "not-ready" };
  const result = await store.publish(account, inviteId, slug);
  if (result.ok) return { status: "published", slug: result.slug };
  if (result.reason === "taken")
    return { status: "taken", suggestions: await freeAlternatives(slug) };
  return { status: "failed" };
}

/** Takes an invite off its link. The link is kept for when it's published again. */
export async function unpublishInvite(inviteId: string): Promise<boolean> {
  const store = inviteStore();
  const account = await getAccount();
  if (!store || !account || !id.safeParse(inviteId).success) return false;
  return store.unpublish(account, inviteId);
}
