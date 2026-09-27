import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/page-transition";
import { isQualityChoice } from "@/content/engine-review";
import { templatesReview } from "@/content/templates-review";
import { isTemplateId } from "@/lib/templates/ids";
import { TemplatesReview } from "./_review";

export const metadata: Metadata = {
  title: templatesReview.metaTitle,
  description: templatesReview.metaDescription,
  robots: { index: false, follow: false },
};

/*
 * A review page for Step 5, not a product screen. ?template=<id> preselects a design and
 * ?quality=high|medium|low|2d forces a level (handy for tests on machines without a GPU).
 */
export default async function TemplatesPage({ searchParams }: PageProps<"/templates">) {
  const { template, quality } = await searchParams;
  return (
    <PageTransition>
      <TemplatesReview
        initialTemplate={isTemplateId(template) ? template : "marigold"}
        quality={isQualityChoice(quality) ? quality : "auto"}
      />
    </PageTransition>
  );
}
