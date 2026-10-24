import { draftDesignId } from "@/lib/plans/design-defaults";
import type { InviteDraft } from "./draft";

/*
 * A design's own page is the whole editor (owner, 2026-10-24). See my invitation there
 * opens the editor's preview; its Back returns to the design's page, not to the steps.
 */

const KEY = "shubh-from-design-page";

/** The design's page for the draft as it is now, so a design changed since is the one shown. */
export function designPageHref(
  draft: Pick<InviteDraft, "suite" | "tradition" | "templateId" | "categoryId" | "format">,
): string {
  return `/create/${draftDesignId(draft)}?category=${draft.categoryId}`;
}

/** Remembers, for this tab, that the preview was opened from a design's page. */
export function markFromDesignPage() {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    // Storage blocked: Back goes through the steps instead
  }
}

export function cameFromDesignPage(): boolean {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}
