import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/page-transition";
import { isEngineThemeId } from "@/lib/engine/themes";
import { isQualityChoice } from "@/content/engine-review";
import { EngineReview } from "./_review";

export const metadata: Metadata = {
  title: "Invitation engine",
  description: "Try the 3D invitation engine: designs, quality levels and the 2D fallback.",
  robots: { index: false, follow: false },
};

/*
 * A review page for the Step 4 engine, not a product screen. ?quality=high|medium|low|2d
 * and ?theme=<design> preselect the controls (handy for tests on machines without a GPU).
 */
export default async function EnginePage({ searchParams }: PageProps<"/engine">) {
  const { quality, theme } = await searchParams;
  return (
    <PageTransition>
      <EngineReview
        initialQuality={isQualityChoice(quality) ? quality : "auto"}
        initialTheme={isEngineThemeId(theme) ? theme : "marigold"}
      />
    </PageTransition>
  );
}
