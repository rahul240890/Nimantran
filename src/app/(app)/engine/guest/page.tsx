import type { Metadata } from "next";
import { GuestView, type GuestFunction } from "@/components/guest/guest-view";
import type { RsvpFunction } from "@/components/guest/rsvp-form";
import { getLocale } from "@/i18n/server";
import { editorText } from "@/i18n/copy/editor";
import { includedFunctions, type InviteDraft } from "@/lib/editor/draft";
import { guestGuide } from "@/lib/publish/event-day";
import { storyFunctions } from "@/lib/publish/story";
import { isSuiteId, type SuiteId } from "@/lib/suites/catalog";
import {
  OPENING_GODS,
  OPENING_STYLES,
  type OpeningGod,
  type OpeningStyle,
} from "@/lib/opening/catalog";
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
 * ?opening=palace (or doors, temple, curtain, envelope, lotus, none) and ?god=ganesha choose the
 * first screen (Step 12x).
 * ?now=2026-11-19T20:00 (India time) shows the event-day banner as it would be then.
 */
export default async function GuestPreviewPage({ searchParams }: PageProps<"/engine/guest">) {
  const { suite: asked, lang, format, photos: count, now, opening, god } = await searchParams;
  const previewNow =
    typeof now === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(now)
      ? Date.parse(`${now}:00+05:30`)
      : undefined;
  const suite: SuiteId = isSuiteId(asked) ? asked : "rajwada-bagh";
  const locale = await getLocale();
  const scene = format === "scene";
  const sceneCount = count === "0" ? 0 : count === "1" ? 1 : 2;
  const base = sampleDraft(suite, lang === "hi");
  const draft: InviteDraft = {
    ...(scene ? sceneDraft(base, sceneCount) : base),
    opening: {
      style: OPENING_STYLES.includes(opening as OpeningStyle) ? (opening as OpeningStyle) : null,
      god: OPENING_GODS.includes(god as OpeningGod) ? (god as OpeningGod) : null,
    },
  };
  const { functionCopy } = editorText[locale];
  const functions: GuestFunction[] = storyFunctions(draft, locale).map((told) => {
    return {
      ...told,
      ...guestGuide(draft, told.kind),
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
      functions={functions}
      photos={scene ? SCENE_PHOTOS.slice(0, sceneCount) : SAMPLE_PHOTOS}
      allIcsUrl={null}
      rsvpFunctions={rsvpFunctions}
      questions={[]}
      previewNow={previewNow}
    />
  );
}
