import type { Metadata } from "next";
import { AdminHeading } from "@/components/admin/admin-shell";
import { DesignPricingForm, type DesignRow } from "@/components/admin/design-pricing";
import { TemplateCover } from "@/components/brand/template-cover";
import { designWords } from "@/components/gallery/design-words";
import { requireAdmin } from "@/lib/admin/access";
import { cardDesign, paintedDesign, sceneDesign, type GalleryDesign } from "@/lib/gallery/catalog";
import { catalogEntry } from "@/lib/gallery/filters";
import { allDesignIds, defaultTier, designTier } from "@/lib/plans/design-defaults";
import { getPricing } from "@/lib/plans/pricing";
import { isSuiteId } from "@/lib/suites/catalog";
import { TEMPLATE_IDS, isTemplateId } from "@/lib/templates/ids";

export const metadata: Metadata = { title: "Designs and prices" };

/** A design id as the gallery shows it: a Scene, a Story of pages or a 3D card. */
function galleryDesign(id: string): GalleryDesign | null {
  if (id.startsWith("card-")) {
    const template = id.slice("card-".length);
    return isTemplateId(template) ? cardDesign(template) : null;
  }
  const scene = id.endsWith("-scene");
  const suite = scene ? id.slice(0, -"-scene".length) : id;
  if (!isSuiteId(suite)) return null;
  return scene ? sceneDesign(suite) : paintedDesign(suite);
}

/** Which designs are Free, Premium, Royal or Signature, and what each package costs. */
export default async function DesignsPage() {
  await requireAdmin("/admin/designs");
  const pricing = await getPricing();
  const rows: DesignRow[] = allDesignIds().flatMap((id) => {
    const design = galleryDesign(id);
    if (!design) return [];
    return [
      {
        ...catalogEntry(design),
        id,
        ...designWords(design, "en"),
        tier: designTier(pricing, id),
        defaultTier: defaultTier(id),
      },
    ];
  });

  return (
    <>
      <AdminHeading
        eyebrow="Payments"
        title="Designs and prices"
        intro="Every host can open and try every design. A Premium, Royal or Signature design shows its price on its tile, and publishing it asks for a package: Basic at the design's price, or Celebration and Grand on top. Prices include GST and apply once checkout is switched on."
      />
      <DesignPricingForm
        rows={rows}
        amounts={pricing}
        // The 3D cards' covers are drawn on the server (see DesignCard)
        covers={Object.fromEntries(
          TEMPLATE_IDS.map((id) => [
            id,
            <TemplateCover key={id} id={id} locale="en" className="max-w-[16rem]" />,
          ]),
        )}
      />
    </>
  );
}
