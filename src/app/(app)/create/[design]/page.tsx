import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { designWords } from "@/components/gallery/design-words";
import { PageTransition } from "@/components/motion/page-transition";
import { QuickStart } from "@/components/editor/quick/quick-start";
import { SuggestedDesigns } from "@/components/editor/quick/suggested-designs";
import { editorText } from "@/i18n/copy/editor";
import { getLocale } from "@/i18n/server";
import { getAccount } from "@/lib/auth/server";
import { isCategoryId } from "@/lib/categories/catalog";
import { WEDDING_KINDS, designById, suiteOccasion, type WeddingKind } from "@/lib/gallery/catalog";
import { samplePath } from "@/lib/sample/paths";
import { pagePath } from "@/lib/seo/paths";
import { isTraditionId } from "@/lib/traditions/catalog";
import { isFaith } from "@/lib/traditions/faith";

export async function generateMetadata({
  params,
}: PageProps<"/create/[design]">): Promise<Metadata> {
  const { design: id } = await params;
  const design = designById(id);
  const locale = await getLocale();
  return {
    title: design
      ? editorText[locale].quickCopy.metaTitle(designWords(design, locale).name)
      : undefined,
    robots: { index: false, follow: false },
  };
}

/*
 * A design's own page (update 4): every Use this design and every design picture lands
 * here (designHref), with the occasion, tradition and faith it was chosen for
 * (?category=wedding&tradition=gujarati&faith=muslim, as the gallery knows them). The page
 * itself works on the editor's draft in the browser (quick-start.tsx).
 */
export default async function DesignStartPage({
  params,
  searchParams,
}: PageProps<"/create/[design]">) {
  const { design: id } = await params;
  const design = designById(id);
  if (!design) notFound();
  const { category, tradition, faith, kind } = await searchParams;
  const locale = await getLocale();
  const occasion = isCategoryId(category) ? category : suiteOccasion(design.suite);
  const weddingKind = (WEDDING_KINDS as readonly string[]).includes(String(kind))
    ? (kind as WeddingKind)
    : null;
  const account = await getAccount();
  return (
    <PageTransition>
      <QuickStart
        designId={design.id}
        name={designWords(design, locale).name}
        choice={{
          category: occasion,
          tradition: isTraditionId(tradition) ? tradition : null,
          suite: design.suite,
          template: design.template,
          format: design.format ?? undefined,
          faith: isFaith(faith) ? faith : null,
        }}
        signedIn={Boolean(account)}
        backHref={
          weddingKind
            ? pagePath({ kind: "wedding-kind", id: weddingKind }, locale)
            : pagePath({ kind: "occasion", id: occasion }, locale)
        }
        sampleHref={samplePath(design.id, { occasion, kind: weddingKind })}
        more={
          <SuggestedDesigns
            current={design.id}
            occasion={occasion}
            kind={weddingKind}
            locale={locale}
          />
        }
      />
    </PageTransition>
  );
}
