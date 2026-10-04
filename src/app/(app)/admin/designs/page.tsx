import type { Metadata } from "next";
import { AdminHeading } from "@/components/admin/admin-shell";
import { DesignPricingForm, type DesignRow } from "@/components/admin/design-pricing";
import { editorText } from "@/i18n/copy/editor";
import { requireAdmin } from "@/lib/admin/access";
import { allDesignIds, defaultTier, designTier } from "@/lib/plans/design-defaults";
import { getPricing } from "@/lib/plans/pricing";
import { SUITES, isSuiteId } from "@/lib/suites/catalog";
import { scenePage } from "@/lib/suites/scene";
import { isTemplateId } from "@/lib/templates/ids";

export const metadata: Metadata = { title: "Designs and prices" };

/** A design id as the admin reads it: its name, its kind and a small picture. */
function describe(id: string): Omit<DesignRow, "tier" | "defaultTier"> | null {
  const { designCopy, suiteCopy } = editorText.en;
  if (id.startsWith("card-")) {
    const template = id.slice("card-".length);
    if (!isTemplateId(template)) return null;
    return { id, name: designCopy[template].name, kind: "card", image: null };
  }
  const scene = id.endsWith("-scene");
  const suite = scene ? id.slice(0, -"-scene".length) : id;
  if (!isSuiteId(suite)) return null;
  const page = scene ? scenePage(suite, 1) : null;
  return {
    id,
    name: suiteCopy.names[suite],
    kind: scene ? "scene" : "story",
    image: scene
      ? (page?.card && SUITES[suite].images.cover) || page?.image || null
      : (SUITES[suite].images.cover ?? null),
  };
}

/** Which designs are Free, Premium or Royal, and what each edition costs. */
export default async function DesignsPage() {
  await requireAdmin("/admin/designs");
  const pricing = await getPricing();
  const rows: DesignRow[] = allDesignIds().flatMap((id) => {
    const row = describe(id);
    return row ? [{ ...row, tier: designTier(pricing, id), defaultTier: defaultTier(id) }] : [];
  });

  return (
    <>
      <AdminHeading
        eyebrow="Payments"
        title="Designs and prices"
        intro="Every host can open and try every design. A Premium or Royal design asks for that edition before it is sent without the watermark, and its tile shows the price. Prices include GST and apply once checkout is switched on."
      />
      <DesignPricingForm rows={rows} prices={pricing.prices} />
    </>
  );
}
