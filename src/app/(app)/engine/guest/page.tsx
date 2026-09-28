import type { Metadata } from "next";
import { GuestView, type GuestFunction } from "@/components/guest/guest-view";
import type { RsvpFunction } from "@/components/guest/rsvp-form";
import { getLocale } from "@/i18n/server";
import { editorText } from "@/i18n/copy/editor";
import { includedFunctions, newDraft, type InviteDraft } from "@/lib/editor/draft";
import { inviteNames, occasionName } from "@/lib/publish/describe";
import { mapsUrl } from "@/lib/publish/links";
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

function sampleDraft(suite: SuiteId): InviteDraft {
  const draft = newDraft(SUITES[suite].template ?? "marigold");
  const at = (date: string, time: string, venue: string, address = "") => ({
    included: true,
    date,
    time,
    endTime: "",
    venue,
    address,
    dressCode: "",
  });
  return {
    ...draft,
    suite,
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
  };
}

/*
 * A review page for the themed guest page (Step 12q), not a product screen: the guest page
 * for ?suite=<theme> with made-up names, dates and pictures, and nothing saved.
 */
export default async function GuestPreviewPage({ searchParams }: PageProps<"/engine/guest">) {
  const { suite: asked } = await searchParams;
  const suite: SuiteId = isSuiteId(asked) ? asked : "rajwada-bagh";
  const locale = await getLocale();
  const draft = sampleDraft(suite);
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
      photos={SAMPLE_PHOTOS}
      allIcsUrl={null}
      rsvpFunctions={rsvpFunctions}
      questions={[]}
    />
  );
}
