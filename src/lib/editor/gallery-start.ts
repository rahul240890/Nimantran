import { switchDraft } from "@/lib/invites/sync";
import { newDraft, withGalleryChoice, type CardLanguage, type InviteDraft } from "./draft";
import { inviteDraft } from "./store";

/** A design chosen in the gallery: its occasion, tradition, page theme, card and form. */
export type GalleryChoice = Parameters<typeof withGalleryChoice>[1];

/**
 * A new invite written from another: every name, date, place, family line, photo and word
 * carried over, so nothing is typed again (owner, 2026-10-24). It has no link and isn't in
 * the account until it saves.
 */
export function carriedOver(draft: InviteDraft): InviteDraft {
  return { ...draft, remoteId: null, slug: null, updatedAt: Date.now() };
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
  const keepsWork = current.slug === null && sameOccasion;
  const switched =
    signedIn && current.updatedAt !== 0 && !keepsWork
      ? await switchDraft(null, {
          signedIn,
          fresh: () =>
            withGalleryChoice(sameOccasion ? carriedOver(current) : newDraft(), choice, site),
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
