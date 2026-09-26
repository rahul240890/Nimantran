import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/page-transition";
import { isTemplateId } from "@/lib/templates/schema";
import { isQualityChoice } from "@/content/engine-review";
import { EngineReview } from "./_review";

export const metadata: Metadata = {
  title: "Invitation engine",
  description: "Try the 3D invitation engine: designs, quality levels and the 2D fallback.",
  robots: { index: false, follow: false },
};

/*
 * A review page for the Step 4 engine, not a product screen. ?quality=high|medium|low|2d
 * and ?template=<id> preselect the controls (handy for tests on machines without a GPU).
 */
export default async function EnginePage({ searchParams }: PageProps<"/engine">) {
  const { quality, template } = await searchParams;
  return (
    <PageTransition>
      <EngineReview
        initialQuality={isQualityChoice(quality) ? quality : "auto"}
        initialTheme={isTemplateId(template) ? template : "marigold"}
      />
    </PageTransition>
  );
}
