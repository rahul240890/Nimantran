import type { InviteDraft } from "@/lib/editor/draft";
import { allDesigns } from "@/lib/gallery/catalog";
import { SUITES, SUITE_IDS, isSceneTheme, isSuiteId, suiteFor } from "@/lib/suites/catalog";
import { hasScene } from "@/lib/suites/scene";
import { TEMPLATE_IDS } from "@/lib/templates/ids";
import { DEFAULT_PRICING, type DesignTier, type Pricing } from "./design-tiers";

/**
 * A design's tier before the admin changes it (owner, 2026-10-12): 3D cards are free, every
 * Scene and moving scene is Premium (₹499) and every Story is Royal (₹799). The templates
 * with a painted centre and an opening of their own (26 on) are Signature, ₹1,099 (owner,
 * 2026-10-20).
 */
export function defaultTier(designId: string): DesignTier {
  if (designId.startsWith("card-")) return "free";
  if (isSuiteId(designId) && SUITES[designId].centre) return "signature";
  return designId.endsWith("-scene") ? "premium" : "royal";
}

export function designTier(pricing: Pricing, designId: string): DesignTier {
  return pricing.tiers[designId] ?? defaultTier(designId);
}

/** The gallery design an invite is made with, as Admin, Designs names it. */
export function draftDesignId(
  draft: Pick<InviteDraft, "suite" | "tradition" | "templateId" | "categoryId" | "format">,
): string {
  const suite = suiteFor({
    suite: draft.suite,
    tradition: draft.tradition.id,
    templateId: draft.templateId,
    category: draft.categoryId,
  });
  if (suite === "classic") return `card-${draft.templateId}`;
  const scene = (draft.format === "scene" || isSceneTheme(suite)) && hasScene(suite);
  return scene ? `${suite}-scene` : suite;
}

/** Every design a host can choose: the gallery's, and any theme the editor offers besides. */
export function allDesignIds(): string[] {
  const ids = new Set(allDesigns().map((design) => design.id));
  for (const suite of SUITE_IDS) {
    if (suite === "classic") continue;
    if (!isSceneTheme(suite)) ids.add(suite);
    if (hasScene(suite)) ids.add(`${suite}-scene`);
  }
  for (const template of TEMPLATE_IDS) ids.add(`card-${template}`);
  return [...ids];
}

/** Every design's tier, the admin's where set: what pages and the editor read. */
export function resolvePricing(stored: Pricing): Pricing {
  const tiers: Record<string, DesignTier> = {};
  for (const id of allDesignIds()) tiers[id] = designTier(stored, id);
  return { ...stored, tiers };
}

/**
 * Every design at its default tier and the default prices: what pages are built with. The
 * admin's changes arrive in the browser (PricingProvider, /api/pricing).
 */
export const BUILT_PRICING: Pricing = resolvePricing(DEFAULT_PRICING);
