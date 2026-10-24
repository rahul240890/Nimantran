import { switchDraft } from "@/lib/invites/sync";
import { newDraft, withGalleryChoice, type CardLanguage } from "./draft";
import { inviteDraft } from "./store";

/** A design chosen in the gallery: its occasion, tradition, page theme, card and form. */
export type GalleryChoice = Parameters<typeof withGalleryChoice>[1];

/**
 * Applies a design chosen in the gallery to the invite under way, every name, date, photo
 * and word kept (owner, 2026-10-22: hosts had to fill everything in again). Only an invite
 * already live, or one for another occasion, stays as it is in My invites while a new one
 * starts with the design; that needs the account, so a signed-out host's draft takes the
 * design in place.
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
  const keepsWork =
    current.slug === null && (!choice.category || choice.category === current.categoryId);
  const switched =
    signedIn && current.updatedAt !== 0 && !keepsWork
      ? await switchDraft(null, {
          signedIn,
          fresh: () => withGalleryChoice(newDraft(), choice, site),
        })
      : false;
  if (!switched) inviteDraft.update((draft) => withGalleryChoice(draft, choice, site));
}
