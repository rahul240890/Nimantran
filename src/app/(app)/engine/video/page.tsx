import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import { storyFunctions } from "@/lib/publish/story";
import { isSuiteId, type SuiteId } from "@/lib/suites/catalog";
import {
  OPENING_GODS,
  OPENING_STYLES,
  type OpeningGod,
  type OpeningStyle,
} from "@/lib/opening/catalog";
import { SAMPLE_PHOTOS, SCENE_PHOTOS, sampleDraft, sceneDraft } from "@/lib/sample/drafts";
import { FilmStrip } from "./_strip";

export const metadata: Metadata = {
  title: "Video frames preview",
  description: "Frames from the invitation video for a sample invite in each theme.",
  robots: { index: false, follow: false },
};

/*
 * A review page for the invitation video, not a product screen: frames from the video of a
 * made-up invite in ?suite=<theme> (?lang=hi for a Hindi card). ?format=scene makes a Scene
 * invite, with ?photos=0, 1 or 2 (default 2). ?opening=<style>&god=<god> picks the opening
 * it starts with. ?from=<seconds>&step=<seconds> picks the moments.
 */
export default async function VideoPreviewPage({ searchParams }: PageProps<"/engine/video">) {
  const {
    suite: asked,
    lang,
    format,
    photos: count,
    from,
    step,
    opening,
    god,
  } = await searchParams;
  const suite: SuiteId = isSuiteId(asked) ? asked : "rajwada-bagh";
  const locale = await getLocale();
  const scene = format === "scene";
  const sceneCount = count === "0" ? 0 : count === "1" ? 1 : 2;
  const base = sampleDraft(suite, lang === "hi");
  const sampled = scene ? sceneDraft(base, sceneCount) : base;
  const style = OPENING_STYLES.find((id) => id === opening) as OpeningStyle | undefined;
  const chosen = OPENING_GODS.find((id) => id === god) as OpeningGod | undefined;
  const draft = {
    ...sampled,
    opening: { style: style ?? sampled.opening.style, god: chosen ?? sampled.opening.god },
  };
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
