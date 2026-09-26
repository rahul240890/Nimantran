import type { Metadata } from "next";
import { Editor } from "@/components/editor/editor";
import { PageTransition } from "@/components/motion/page-transition";
import { editor } from "@/content/editor";
import { isQualityChoice } from "@/content/engine-review";
import { isTemplateId } from "@/lib/templates/schema";

export const metadata: Metadata = {
  title: editor.metaTitle,
  description: editor.metaDescription,
  robots: { index: false, follow: false },
};

/*
 * The invite editor. Drafts live on this device until accounts arrive (Step 7).
 * ?template=<id> starts a fresh invite with that design; ?quality=high|medium|low|2d
 * forces the preview's level (handy for tests on machines without a GPU).
 */
export default async function CreatePage({ searchParams }: PageProps<"/create">) {
  const { template, quality } = await searchParams;
  return (
    <PageTransition>
      <Editor
        initialTemplate={isTemplateId(template) ? template : null}
        quality={isQualityChoice(quality) ? quality : "auto"}
      />
    </PageTransition>
  );
}
