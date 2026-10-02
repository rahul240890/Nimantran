import type { Metadata } from "next";
import { GuestView, type GuestFunction } from "@/components/guest/guest-view";
import type { RsvpFunction } from "@/components/guest/rsvp-form";
import { getLocale } from "@/i18n/server";
import { editorText } from "@/i18n/copy/editor";
import { includedFunctions, newDraft, type InviteDraft } from "@/lib/editor/draft";
import { inviteNames, occasionName } from "@/lib/publish/describe";
import { guestGuide } from "@/lib/publish/event-day";
import { storyFunctions } from "@/lib/publish/story";
import { SUITES, isSuiteId, type SuiteId } from "@/lib/suites/catalog";

export const metadata: Metadata = {
  title: "Guest page preview",
  description: "A sample guest page in each theme, with made-up names and dates.",
  robots: { index: false, follow: false },
};

/** Pictures standing in for the family's photos: any picture shows how the frames crop. */
const SAMPLE_PHOTOS = [
  "/suites/kayal/haldi.webp",
  "/suites/rajbari/mehendi.webp",
  "/suites/noor-bagh/wedding.webp",
  "/suites/rajwada-bagh/sangeet.webp",
].map((url, index) => ({ id: `sample-${index}`, url, width: 768, height: 1365 }));

/** Stand-ins for the couple's own photos in One Scene's frames. */
const SCENE_PHOTOS = ["/occasions/engagement.webp", "/occasions/mehendi.webp"].map(
  (url, index) => ({ id: `scene-${index}`, url, width: 1024, height: 1024 }),
);

const at = (date: string, time: string, venue: string, address = "") => ({
  included: true,
  date,
  time,
  endTime: "",
  venue,
  address,
  dressCode: "",
});

function sampleDraft(suite: SuiteId, hindi: boolean): InviteDraft {
  const draft = newDraft(SUITES[suite].template ?? "marigold");
  return {
    ...draft,
    suite,
    languages: hindi ? ["hi"] : draft.languages,
    tradition: {
      ...draft.tradition,
      id: SUITES[suite].traditions[0] ?? null,
      wording: {
        blessingsFrom: "Smt. Kamla Devi and Shri Mohan Lal Gupta",
        requesters: "Shri and Smt. Gupta, Shri and Smt. Sharma",
      },
    },
    content: {
      first: "Arjun",
      second: "Sia",
      blessing: "With the blessings of Lord Ganesha",
      families: "Together with their families",
      line: "request the pleasure of your company as they begin their journey together",
      date: "Friday, 20 November 2026",
      venue: "Umaid Bhawan, Jodhpur",
    },
    functions: {
      ...draft.functions,
      haldi: at("2026-11-18", "10:00", "Family home", "Sardarpura, Jodhpur"),
      sangeet: {
        ...at("2026-11-19", "19:30", "Rooftop lawns, Umaid Bhawan"),
        dressCode: "Festive",
      },
      wedding: at("2026-11-20", "18:30", "Umaid Bhawan, Jodhpur", "Circuit House Road"),
    },
    guide: {
      sangeet: { pin: "", parking: "Valet at the palace gate" },
      wedding: { pin: "", parking: "Free parking behind the main lawn" },
    },
  };
}

/*
 * A review page for the themed guest page (Step 12q), not a product screen: the guest page
 * for ?suite=<theme> (and ?lang=hi for a Hindi card) with made-up names, dates and pictures, and nothing saved.
 * ?format=scene shows One Scene instead of the pages, with ?photos=0, 1 or 2 (default 2).
 * ?now=2026-11-19T20:00 (India time) shows the event-day banner as it would be then.
 */
export default async function GuestPreviewPage({ searchParams }: PageProps<"/engine/guest">) {
  const { suite: asked, lang, format, photos: count, now } = await searchParams;
  const previewNow =
    typeof now === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(now)
      ? Date.parse(`${now}:00+05:30`)
      : undefined;
  const suite: SuiteId = isSuiteId(asked) ? asked : "rajwada-bagh";
  const locale = await getLocale();
  const scene = format === "scene";
  const sceneCount = count === "0" ? 0 : count === "1" ? 1 : 2;
  const base = sampleDraft(suite, lang === "hi");
  const draft: InviteDraft = scene
    ? {
        ...base,
        format: "scene",
        // Five celebrations, so the slot shows every side they come in from
        functions: {
          ...base.functions,
          mehendi: at("2026-11-18", "16:00", "The courtyard, Ajit Bhawan"),
          reception: at("2026-11-21", "20:00", "Mehrangarh Fort lawns"),
        },
        couplePhotos: { layout: sceneCount === 1 ? "one" : "two", ids: [] },
      }
    : base;
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
      quality="2d"
      names={inviteNames(draft)}
      occasion={occasionName(draft, locale)}
      functions={functions}
      photos={scene ? SCENE_PHOTOS.slice(0, sceneCount) : SAMPLE_PHOTOS}
      allIcsUrl={null}
      rsvpFunctions={rsvpFunctions}
      questions={[]}
      previewNow={previewNow}
    />
  );
}
