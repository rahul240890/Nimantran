import type { InviteDraft } from "@/lib/editor/draft";
import { draftDesignId } from "@/lib/plans/design-defaults";
import { designById, designHref } from "./catalog";

/**
 * Marks where a visit came from on Admin, Visitors: a guest's "Make an invitation like
 * this", or the same on a family preview link.
 */
export type LikeThisSource = "guest" | "family";

/**
 * Where a guest goes from a live invitation to make one like it (owner, 2026-10-24: every
 * invitation is seen by hundreds of guests, many with a celebration of their own): the
 * same design's own page, or the home page for a design the gallery doesn't show. The visit
 * counts as coming from a guest.
 */
export function makeLikeThisHref(
  draft: Pick<InviteDraft, "suite" | "tradition" | "templateId" | "categoryId" | "format">,
  source: LikeThisSource = "guest",
): string {
  const design = designById(draftDesignId(draft));
  const href = design ? designHref(design, { category: draft.categoryId }) : "/";
  return `${href}${href.includes("?") ? "&" : "?"}utm_source=${source}`;
}
