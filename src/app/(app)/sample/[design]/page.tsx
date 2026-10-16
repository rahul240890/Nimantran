import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { designWords } from "@/components/gallery/design-words";
import { GuestView, type GuestFunction } from "@/components/guest/guest-view";
import type { RsvpFunction } from "@/components/guest/rsvp-form";
import { SampleBar } from "@/components/guest/sample-bar";
import { FunnelMark } from "@/components/shell/funnel-mark";
import { editorText } from "@/i18n/copy/editor";
import { galleryText } from "@/i18n/copy/gallery";
import { getLocale } from "@/i18n/server";
import { includedFunctions } from "@/lib/editor/draft";
import { designById, designHref } from "@/lib/gallery/catalog";
import { guestGuide } from "@/lib/publish/event-day";
import { storyFunctions } from "@/lib/publish/story";
import { sampleInvite } from "@/lib/sample/invite";
import { sampleWalk } from "@/lib/sample/browse";

/*
 * A design's public sample, one tap from the gallery and the home page: the invitation a
 * guest would get, opening, music and replies included, with made-up names. No sign-in,
 * nothing saved, and replies thank the visitor without going anywhere. Previous and Next
 * walk the home page's tour, or the designs of the listing it was opened from (browse.ts).
 */

export async function generateMetadata({
  params,
}: PageProps<"/sample/[design]">): Promise<Metadata> {
  const { design: id } = await params;
  const design = designById(id);
  const locale = await getLocale();
  const { galleryCopy } = galleryText[locale];
  if (!design) return { robots: { index: false, follow: false } };
  return {
    title: galleryCopy.sampleTitle(designWords(design, locale).name),
    description: galleryCopy.sampleDescription,
    // The design's own page is the one for search; this is its demonstration
    robots: { index: false, follow: true },
  };
}

export default async function SamplePage({ params, searchParams }: PageProps<"/sample/[design]">) {
  const { design: id } = await params;
  const design = designById(id);
  if (!design) notFound();
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    if (typeof value === "string") search.set(key, value);
  }
  const walk = sampleWalk(design, search);
  const locale = await getLocale();
  const { galleryCopy } = galleryText[locale];
  const { functionCopy } = editorText[locale];
  const { draft, photos, category } = sampleInvite(design, locale);

  const functions: GuestFunction[] = storyFunctions(draft, locale).map((told) => ({
    ...told,
    ...guestGuide(draft, told.kind),
    googleCalendarUrl: null,
    icsUrl: null,
  }));
  const rsvpFunctions: RsvpFunction[] = includedFunctions(draft).map((kind) => ({
    id: `sample-${kind}`,
    kind,
    name: functionCopy[kind].name,
    date: draft.functions[kind].date,
  }));

  return (
    <>
      <FunnelMark step="Sample opened" design={design.id} />
      <SampleBar
        label={`${galleryCopy.sampleLabel}: ${galleryCopy.sampleNote}`}
        action={galleryCopy.sampleChoose}
        href={walk.choose ?? designHref(design, { category })}
        nav={galleryCopy.sampleWalk}
        previous={
          walk.previous
            ? {
                href: walk.previous,
                label: galleryCopy.samplePrevious,
                short: galleryCopy.samplePreviousShort,
              }
            : null
        }
        next={
          walk.next
            ? { href: walk.next, label: galleryCopy.sampleNext, short: galleryCopy.sampleNextShort }
            : null
        }
      />
      {/* A new design starts from its own closed invitation, not the last one's open pages */}
      <GuestView
        key={design.id}
        slug="sample"
        draft={draft}
        functions={functions}
        photos={photos}
        allIcsUrl={null}
        rsvpFunctions={rsvpFunctions}
        questions={[]}
        sample
      />
    </>
  );
}
