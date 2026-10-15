"use client";

import { saveInvite, type SyncResult } from "@/actions/invites";
import { MAX_PHOTOS, newDraft, type InviteDraft } from "@/lib/editor/draft";
import { shelvePhotos, shelvedPhotos } from "@/lib/editor/photo-refs";
import { inviteDraft } from "@/lib/editor/store";
import { uploadClip, uploadPhotos } from "./photo-upload";

/*
 * Keeps the draft open in the editor saved to the signed-in person's account, photos
 * included. The device copy (lib/editor/store.ts) is saved first, always; this follows a
 * moment later. Saves run one at a time, so a burst of edits never creates the same
 * invite twice.
 */

export type SyncState = "idle" | "syncing" | "synced" | "offline" | "signed-out" | "needs-plan";

/** Why the account refused the last save of a live invite: what its package doesn't cover. */
export type HeldBack = Extract<SyncResult, { status: "needs-plan" }>;

/** The draft version last saved to the account, so a revisit doesn't save it again. */
const SYNCED_KEY = "nimantran-invite-synced";
const RETRY_MS = 15_000;

let state: SyncState = "idle";
const listeners = new Set<() => void>();
let queue: Promise<unknown> = Promise.resolve();
let retry: ReturnType<typeof setTimeout> | null = null;
let held: HeldBack | null = null;

function set(next: SyncState) {
  if (state === next) return;
  state = next;
  listeners.forEach((listener) => listener());
}

const marker = (draft: InviteDraft) => `${draft.remoteId}:${draft.updatedAt}`;

function isSynced(draft: InviteDraft) {
  try {
    return draft.remoteId !== null && localStorage.getItem(SYNCED_KEY) === marker(draft);
  } catch {
    return false;
  }
}

function markSynced(draft: InviteDraft) {
  try {
    localStorage.setItem(SYNCED_KEY, marker(draft));
  } catch {
    // Storage blocked: the next visit saves once more, harmlessly
  }
}

async function push(): Promise<SyncState> {
  if (retry) clearTimeout(retry);
  retry = null;
  const draft = inviteDraft.get().draft;
  if (draft.updatedAt === 0) return state;
  if (isSynced(draft)) {
    set("synced");
    return state;
  }
  set("syncing");
  const result = await saveInvite(draft).catch(() => ({ status: "failed" }) as const);
  held = result.status === "needs-plan" ? result : null;
  if (result.status === "signed-out") {
    set("signed-out");
  } else if (result.status === "needs-plan") {
    // No retry: the next edit, or a package bought for it, saves it
    set("needs-plan");
  } else if (result.status === "failed") {
    set("offline");
    retry = setTimeout(() => void syncDraft(), RETRY_MS);
  } else {
    // Record where it lives, keeping any edits made while it was saving
    inviteDraft.update((current) => ({ ...current, remoteId: result.id }), { touch: false });
    // Photos and the music clip go up together. Until the clip is there guests hear the
    // raga, so its upload never decides whether the save went through
    const [uploaded] = await Promise.all([
      result.missingPhotos.length
        ? uploadPhotos(result.id, draft.photos, result.missingPhotos)
        : true,
      result.missingClip && draft.music.clip ? uploadClip(result.id, draft.music.clip) : null,
    ]);
    if (uploaded) {
      markSynced({ ...draft, remoteId: result.id });
      set("synced");
    } else {
      set("offline");
      retry = setTimeout(() => void syncDraft(), RETRY_MS);
    }
  }
  return state;
}

/** Saves the open draft to the account, after any save already running. */
export function syncDraft(): Promise<SyncState> {
  const next = queue.then(push, push);
  queue = next;
  return next;
}

export const syncStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  get: () => state,
  getServer: (): SyncState => "idle",
  /** What the last refused save of a live invite needed, while it stays refused. */
  heldBack: (): HeldBack | null => (state === "needs-plan" ? held : null),
};

/**
 * Opens an invite from the account, or a new one when target is null. The draft open now
 * is saved to the account first so nothing is lost; its photos wait on this device until
 * it's opened again. False when the open draft couldn't be saved, and stays open.
 */
export async function switchDraft(
  target: InviteDraft | null,
  { signedIn, fresh = newDraft }: { signedIn: boolean; fresh?: () => InviteDraft },
): Promise<boolean> {
  let current = inviteDraft.get().draft;
  if (target && target.remoteId && current.remoteId === target.remoteId) {
    // The same invite: keep whichever copy is newer, with photos from both
    if (target.updatedAt > current.updatedAt) {
      inviteDraft.replace({ ...target, photos: mergePhotos(target.photos, current.photos) });
      markSynced(target);
    } else if (target.slug !== current.slug) {
      inviteDraft.update((draft) => ({ ...draft, slug: target.slug }), { touch: false });
    }
    return true;
  }
  if (current.updatedAt !== 0) {
    if (!signedIn) return false;
    if ((await syncDraft()) !== "synced") return false;
    current = inviteDraft.get().draft;
  }
  if (current.remoteId) shelvePhotos(current.remoteId, current.photos);
  if (target?.remoteId) {
    inviteDraft.replace({
      ...target,
      photos: mergePhotos(target.photos, shelvedPhotos(target.remoteId)),
    });
    markSynced(target);
    set("synced");
  } else {
    inviteDraft.replace(fresh());
    set("idle");
  }
  return true;
}

/** The account's photos, then any on this device that haven't been uploaded yet. */
function mergePhotos(account: InviteDraft["photos"], device: InviteDraft["photos"]) {
  const known = new Set(account.map((photo) => photo.id));
  return [...account, ...device.filter((photo) => !known.has(photo.id))].slice(0, MAX_PHOTOS);
}
