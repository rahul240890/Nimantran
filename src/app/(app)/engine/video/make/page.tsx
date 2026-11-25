import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "@/i18n/server";
import { isUiLocale } from "@/i18n/locales";
import { isCategoryId } from "@/lib/categories/catalog";
import { designById } from "@/lib/gallery/catalog";
import { storyFunctions } from "@/lib/publish/story";
import { sampleInvite } from "@/lib/sample/invite";
import { FilmMaker } from "./_maker";

export const metadata: Metadata = {
  title: "Make a sample video",
  robots: { index: false, follow: false },
};

/*
 * A tool page, not a product screen: makes the whole video of a design's public sample
 * (?design=<id>, ?lang=<site language>, ?occasion=<category>), the same made-up invite the
 * sample page shows, for the public video pages (src/lib/videos). Run by
 * scripts/sample-videos.mjs, which turns the file into the MP4 the site serves.
 */
export default async function MakeSampleVideoPage({
  searchParams,
}: PageProps<"/engine/video/make">) {
  const { design: id, lang, occasion } = await searchParams;
  const design = typeof id === "string" ? designById(id) : null;
  if (!design) notFound();
  const locale = isUiLocale(lang) ? lang : await getLocale();
  const { draft, photos } = sampleInvite(
    design,
    locale,
    isCategoryId(occasion) ? occasion : undefined,
  );
  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-8">
      <h1 className="font-display text-3xl">Sample video: {design.id}</h1>
      <FilmMaker draft={draft} functions={storyFunctions(draft, locale)} photos={photos} />
    </main>
  );
}
