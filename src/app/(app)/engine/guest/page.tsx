import type { Metadata } from "next";
import { GuestView, type GuestFunction } from "@/components/guest/guest-view";
import type { RsvpFunction } from "@/components/guest/rsvp-form";
import { getLocale } from "@/i18n/server";
import { editorText } from "@/i18n/copy/editor";
import { includedFunctions, type InviteDraft } from "@/lib/editor/draft";
import { inviteNames, occasionName } from "@/lib/publish/describe";
import { mapsUrl } from "@/lib/publish/links";
import { storyFunctions } from "@/lib/publish/story";
import { isSuiteId, type SuiteId } from "@/lib/suites/catalog";
import { SAMPLE_PHOTOS, SCENE_PHOTOS, sampleDraft, sceneDraft } from "../_sample";

export const metadata: Metadata = {
  title: "Guest page preview",
  description: "A sample guest page in each theme, with made-up names and dates.",
  robots: { index: false, follow: false },
};

/*
 * A review page for the themed guest page (Step 12q), not a product screen: the guest page
 * for ?suite=<theme> (and ?lang=hi for a Hindi card) with made-up names, dates and pictures, and nothing saved.
 * ?format=scene shows One Scene instead of the pages, with ?photos=0, 1 or 2 (default 2).
 */
export default async function GuestPreviewPage({ searchParams }: PageProps<"/engine/guest">) {
  const { suite: asked, lang, format, photos: count } = await searchParams;
  const suite: SuiteId = isSuiteId(asked) ? asked : "rajwada-bagh";
  const locale = await getLocale();
  const scene = format === "scene";
  const sceneCount = count === "0" ? 0 : count === "1" ? 1 : 2;
  const base = sampleDraft(suite, lang === "hi");
  const draft: InviteDraft = scene ? sceneDraft(base, sceneCount) : base;
  const { functionCopy } = editorText[locale];
  const functions: GuestFunction[] = storyFunctions(draft, locale).map((told) => {
    const fn = draft.functions[told.kind];
    return {
      ...told,
      address: fn.address,
      dressCode: fn.dressCode,
      mapsUrl: mapsUrl(fn.venue, fn.address),
      googleCalendarUrl: null,
      icsUrl: null,
    };
  });
  const rsvpFunctions: RsvpFunction[] = includedFunctions(draft).map((kind) => ({
    id: `sample-${kind}`,
    kind,
    name: functionCopy[kind].name,
    date: draft.functions[kind].date,
  }));
  return (
    <GuestView
      slug="sample"
      draft={draft}
      quality="2d"
      names={inviteNames(draft)}
      occasion={occasionName(draft, locale)}
      functions={functions}
      photos={scene ? SCENE_PHOTOS.slice(0, sceneCount) : SAMPLE_PHOTOS}
      allIcsUrl={null}
      rsvpFunctions={rsvpFunctions}
      questions={[]}
    />
  );
}
