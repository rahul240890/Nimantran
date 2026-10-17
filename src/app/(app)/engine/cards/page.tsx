import type { Metadata } from "next";
import { CardMaker } from "@/components/cards/card-maker";
import { isCardKind } from "@/lib/cards/words";
import { isSuiteId, type SuiteId } from "@/lib/suites/catalog";
import { SAMPLE_PHOTOS, SCENE_PHOTOS, sampleDraft, sceneDraft } from "@/lib/sample/drafts";

export const metadata: Metadata = {
  title: "Cards preview",
  description: "The save-the-date and thank-you cards for a sample invite in each theme.",
  robots: { index: false, follow: false },
};

/*
 * A review page for the save-the-date and thank-you cards, not a product screen: a
 * made-up invite in ?suite=<theme> (?lang=hi for a Hindi card), ?format=scene for a Scene
 * invite with ?photos=0, 1 or 2 (default 2), and ?card=thank-you to open on the thank-you.
 */
export default async function CardsPreviewPage({ searchParams }: PageProps<"/engine/cards">) {
  const { suite: asked, lang, format, photos: count, card } = await searchParams;
  const suite: SuiteId = isSuiteId(asked) ? asked : "rajwada-bagh";
  const scene = format === "scene";
  const sceneCount = count === "0" ? 0 : count === "1" ? 1 : 2;
  const base = sampleDraft(suite, lang === "hi");
  const draft = scene ? sceneDraft(base, sceneCount) : base;
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
      <h1 className="font-display text-3xl">Cards</h1>
      <CardMaker
        inviteId="engine"
        draft={draft}
        photos={scene ? SCENE_PHOTOS.slice(0, sceneCount) : SAMPLE_PHOTOS}
        names="the sample couple"
        allowed
        upgradeHref="/pricing"
        initial={isCardKind(card) ? card : undefined}
      />
    </main>
  );
}
