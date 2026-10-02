import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import { storyFunctions } from "@/lib/publish/story";
import { isSuiteId, type SuiteId } from "@/lib/suites/catalog";
import { SAMPLE_PHOTOS, SCENE_PHOTOS, sampleDraft, sceneDraft } from "../_sample";
import { FilmStrip } from "./_strip";

export const metadata: Metadata = {
  title: "Video frames preview",
  description: "Frames from the Status and Reels video for a sample invite in each theme.",
  robots: { index: false, follow: false },
};

/*
 * A review page for the Status and Reels video, not a product screen: frames from the video
 * of a made-up invite in ?suite=<theme> (?lang=hi for a Hindi card). ?format=scene makes a
 * Scene invite, with ?photos=0, 1 or 2 (default 2). ?from=<seconds>&step=<seconds> picks the moments.
 */
export default async function VideoPreviewPage({ searchParams }: PageProps<"/engine/video">) {
  const { suite: asked, lang, format, photos: count, from, step } = await searchParams;
  const suite: SuiteId = isSuiteId(asked) ? asked : "rajwada-bagh";
  const locale = await getLocale();
  const scene = format === "scene";
  const sceneCount = count === "0" ? 0 : count === "1" ? 1 : 2;
  const base = sampleDraft(suite, lang === "hi");
  const draft = scene ? sceneDraft(base, sceneCount) : base;
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <h1 className="font-display text-3xl">Video frames</h1>
      <FilmStrip
        draft={draft}
        functions={storyFunctions(draft, locale)}
        photos={scene ? SCENE_PHOTOS.slice(0, sceneCount) : SAMPLE_PHOTOS}
        from={Number(from) || 0.4}
        step={Number(step) || 1.5}
      />
    </main>
  );
}
