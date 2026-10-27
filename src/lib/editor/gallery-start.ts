import { invitePhotoUrls } from "@/actions/invites";
import { splitOffDraft, switchDraft, syncStore } from "@/lib/invites/sync";
import { newDraft, withGalleryChoice, type CardLanguage, type InviteDraft } from "./draft";
import type { MusicClip } from "./music-clip";
import { loadPhoto, savePhoto } from "./photos";
import { inviteDraft } from "./store";

/** A design chosen in the gallery: its occasion, tradition, page theme, card and form. */
export type GalleryChoice = Parameters<typeof withGalleryChoice>[1];

/**
 * A new invite written from another: every name, date, place, family line, photo and word
 * carried over, so nothing is typed again (owner, 2026-10-24). It has no link and isn't in
 * the account until it saves.
 */
export function carriedOver(
  draft: InviteDraft,
  clip: MusicClip | null = draft.music.clip,
): InviteDraft {
  return {
    ...draft,
    music: { ...draft.music, clip },
    remoteId: null,
    slug: null,
    updatedAt: Date.now(),
  };
}

function newId(): string {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

/**
 * The host's song for a new invite written from another, as a file of its own. Sharing the
 * old invite's file took it away from that invite in the account, so one of the two played
 * the raga while still naming the song (owner, 2026-10-27). The song comes from this device,
 * else from the account; when neither has it the invite keeps naming the old file.
 */
export async function copiedClip(draft: InviteDraft): Promise<MusicClip | null> {
  const clip = draft.music.clip;
  if (!clip) return null;
  try {
    let blob = await loadPhoto(clip.id).catch(() => null);
    if (!blob && draft.remoteId) {
      const url = (await invitePhotoUrls(draft.remoteId))?.[clip.id];
      const response = url ? await fetch(url).catch(() => null) : null;
      blob = response?.ok ? await response.blob() : null;
    }
    if (!blob) return clip;
    const id = newId();
    await savePhoto(id, blob);
    return { ...clip, id };
  } catch {
    return clip;
  }
}

/**
 * Applies a design chosen in the gallery to the invite under way, every name, date, photo
 * and word kept (owner, 2026-10-22: hosts had to fill everything in again). An invite
 * already live stays as it is in My invites, and a new one starts with the design and all
 * of its details (owner, 2026-10-24); one for another occasion is another event, so the new
 * one starts empty. That needs the account, so a signed-out host's draft takes the design
 * in place.
 */
export async function startWithDesign(
  choice: GalleryChoice,
  {
    signedIn,
    site,
  }: {
    /** May put the open invite away in My invites and start another. */
    signedIn: boolean;
    site: CardLanguage;
  },
): Promise<void> {
  const current = inviteDraft.get().draft;
  const sameOccasion = !choice.category || choice.category === current.categoryId;
  // A live invite holding a change its package refused can't save, so it can't be put
  // away: the open copy, change and all, becomes the new invite, and the live one stays
  // as guests have it
  if (signedIn && current.slug !== null && sameOccasion && syncStore.get() === "needs-plan") {
    splitOffDraft();
    inviteDraft.update((draft) => withGalleryChoice(draft, choice, site));
    return;
  }
  const keepsWork = current.slug === null && sameOccasion;
  const startsAnother = signedIn && current.updatedAt !== 0 && !keepsWork;
  const clip = startsAnother && sameOccasion ? await copiedClip(current) : null;
  const switched = startsAnother
    ? await switchDraft(null, {
        signedIn,
        fresh: () =>
          withGalleryChoice(sameOccasion ? carriedOver(current, clip) : newDraft(), choice, site),
      })
    : false;
  if (!switched) inviteDraft.update((draft) => withGalleryChoice(draft, choice, site));
}

/**
 * Applies a design to the invite open on its own page (?invite=): the same invite, its link
 * and guests, in the new design. A live invite's design its package doesn't cover waits off
 * the live copy until it's bought, as any other change.
 */
export function changeDesign(choice: GalleryChoice, site: CardLanguage) {
  inviteDraft.update((draft) => withGalleryChoice(draft, choice, site));
}
