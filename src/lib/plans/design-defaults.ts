import type { InviteDraft } from "@/lib/editor/draft";
import { allDesigns } from "@/lib/gallery/catalog";
import {
  SUITES,
  SUITE_IDS,
  hasBlessingPage,
  isSceneTheme,
  suiteFor,
  type SuiteId,
} from "@/lib/suites/catalog";
import { hasScene, isIllustrated } from "@/lib/suites/scene";
import { TEMPLATE_IDS } from "@/lib/templates/ids";
import { DEFAULT_PRICING, type DesignTier, type Pricing } from "./design-tiers";

/*
 * Free by default: every 3D card, every illustrated card (no photos needed), plus a few
 * Scenes and two-photo cards so each kind of celebration has a painted design at no cost. A prayer meet's
 * Scene is always free to start with.
 */
const FREE_SCENES: ReadonlySet<string> = new Set([
  "minimal-white",
  "love-letter",
  "glass-house",
  "temple-pond",
  "space-voyage",
  "rainbow-unicorn",
  "silver-jubilee",
  "oh-baby",
  "kitty-tea",
  "new-year-eve",
  "new-home-modern",
  "shraddhanjali",
  // Two-photo cards in folk art and modern looks; the jewelled and silk ones are Premium
  "phad-gatha",
  "mandana-lal",
  "pithora-ghoda",
  "sohrai-khovar",
  "aipan-kumaon",
  "pipli-chhata",
  "kasavu-sona",
  "urli-pookal",
  "patola-bandh",
  "moti-bharat",
  "polaroid-lights",
  "dak-tikat",
  "kadhai-hoop",
  "syahi-bamboo",
  "lace-ivory",
  "origami-saaras",
  "nimbu-amalfi",
  "rakhi-dor",
  "judwa-taare",
  "naya-mehmaan",
]);

/**
 * A design's tier before the admin changes it: 3D cards and illustrated cards are free, the grandest wedding
 * Stories (the ones that open with a painted god) are Royal, and the rest are Premium.
 */
export function defaultTier(designId: string): DesignTier {
  if (designId.startsWith("card-")) return "free";
  if (designId.endsWith("-scene")) {
    const suite = designId.slice(0, -"-scene".length);
    return FREE_SCENES.has(suite) || isIllustrated(suite as SuiteId) ? "free" : "premium";
  }
  const suite = designId as SuiteId;
  const wedding = suite in SUITES && !SUITES[suite].occasions?.length;
  return wedding && hasBlessingPage(suite) ? "royal" : "premium";
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
