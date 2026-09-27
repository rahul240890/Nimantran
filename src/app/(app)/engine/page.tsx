import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/page-transition";
import { isTemplateId } from "@/lib/templates/ids";
import { isQualityChoice } from "@/content/engine-review";
import { isTraditionId } from "@/lib/traditions/catalog";
import { isSuiteId } from "@/lib/suites/catalog";
import { EngineReview } from "./_review";

export const metadata: Metadata = {
  title: "Invitation engine",
  description: "Try the 3D invitation engine: designs, quality levels and the 2D fallback.",
  robots: { index: false, follow: false },
};

/*
 * A review page for the Step 4 engine, not a product screen. ?quality=high|medium|low|2d
 * ?template=<id>, ?opening=<tradition>, ?suite=<theme>, ?box=1 (the box behind the words) and ?photos=1|2 (the couple's photo page, with a sample picture) preselect the controls (handy for tests on machines without a GPU).
 */
export default async function EnginePage({ searchParams }: PageProps<"/engine">) {
  const { quality, template, opening, suite, box, photos } = await searchParams;
  return (
    <PageTransition>
      <EngineReview
        initialQuality={isQualityChoice(quality) ? quality : "auto"}
        initialTheme={isTemplateId(template) ? template : "marigold"}
        initialOpening={isTraditionId(opening) ? opening : null}
        initialSuite={isSuiteId(suite) ? suite : "rajwada-bagh"}
        initialTextBox={box === "1"}
        photos={photos === "2" ? 2 : photos === "1" ? 1 : 0}
      />
    </PageTransition>
  );
}
