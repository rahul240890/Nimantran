import type { UiLocale } from "@/i18n/locales";
import { draftDesignId } from "@/lib/plans/design-defaults";
import { pagePath } from "@/lib/seo/paths";
import type { EditorStep, InviteDraft } from "./draft";

/*
 * A design's own page is the whole editor (owner, 2026-10-24: "the old editor we don't
 * need, use this for all"). An invite is written and changed there, and only previewed and
 * published at /create, so every other way into the editor lands on the design's page, or
 * on the gallery while no design is chosen yet.
 */

/** The steps where nothing is chosen yet: the gallery is where a design is picked. */
const PICKING = new Set<EditorStep>(["occasion", "tradition", "design"]);

/**
 * The design's page for the draft as it is now. An invite in the account names itself
 * (?invite=), so the page opens that invite, and another design picked from it changes
 * that invite rather than starting a new one.
 */
export function designPageHref(
  draft: Pick<
    InviteDraft,
    "suite" | "tradition" | "templateId" | "categoryId" | "format" | "remoteId"
  >,
): string {
  const params = new URLSearchParams({ category: draft.categoryId });
  if (draft.tradition.id) params.set("tradition", draft.tradition.id);
  if (draft.remoteId) params.set("invite", draft.remoteId);
  return `/create/${draftDesignId(draft)}?${params.toString()}`;
}

/** Where each part of the invite is on its design's page, for the preview's Edit buttons. */
const PARTS: Partial<Record<EditorStep, string>> = {
  couple: "part-names",
  functions: "part-when",
  family: "part-family",
  photos: "part-photos",
  words: "part-words",
  music: "part-music",
};

/** The preview's Edit for one part: that part on the design's page, or the occasions. */
export function partHref(draft: InviteDraft, part: EditorStep, locale: UiLocale): string {
  if (part === "occasion") return pagePath({ kind: "gallery" }, locale);
  const anchor = PARTS[part];
  return anchor ? `${designPageHref(draft)}#${anchor}` : designPageHref(draft);
}

/** Where the editor sends a draft that isn't on its preview: its design, or the gallery. */
export function editingHref(draft: InviteDraft, locale: UiLocale): string {
  if (!PICKING.has(draft.step)) return designPageHref(draft);
  return draft.updatedAt === 0
    ? pagePath({ kind: "gallery" }, locale)
    : pagePath({ kind: "occasion", id: draft.categoryId }, locale);
}
