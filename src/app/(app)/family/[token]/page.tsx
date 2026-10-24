import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { GuestView, type GuestFunction } from "@/components/guest/guest-view";
import type { RsvpFunction } from "@/components/guest/rsvp-form";
import { editorText } from "@/i18n/copy/editor";
import { publishText } from "@/i18n/copy/publish";
import { getLocale, getText } from "@/i18n/server";
import { draftQuestions, includedFunctions } from "@/lib/editor/draft";
import { makeLikeThisHref } from "@/lib/gallery/make-like-this";
import { readFamilyToken } from "@/lib/invites/family-link";
import type { PublicPhoto } from "@/lib/invites/public";
import { readInviteAsServer } from "@/lib/invites/store";
import { guestGuide } from "@/lib/publish/event-day";
import { inviteNames } from "@/lib/publish/describe";
import { storyFunctions } from "@/lib/publish/story";

/*
 * A family preview link (lib/invites/family-link.ts): the invitation as guests will see it,
 * before the host pays and sends it. Always marked as a preview, with replies and the photo
 * wall switched off. Once the invite is live, the link opens the live invitation instead.
 */

async function load(token: string) {
  const id = readFamilyToken(token);
  return id ? readInviteAsServer(id).catch(() => null) : null;
}

export async function generateMetadata({
  params,
}: PageProps<"/family/[token]">): Promise<Metadata> {
  const { familyCopy } = await getText(publishText);
  const found = await load((await params).token);
  return {
    title: { absolute: familyCopy.metaTitle(found ? inviteNames(found.draft) : "") },
    robots: { index: false, follow: false },
  };
}

export default async function FamilyPreviewPage({ params }: PageProps<"/family/[token]">) {
  const { token } = await params;
  const found = await load(token);
  if (!found) notFound();
  const { draft, urls } = found;
  if (draft.slug) redirect(`/i/${draft.slug}`);

  const [locale, { familyCopy }] = await Promise.all([getLocale(), getText(publishText)]);
  const { functionCopy } = editorText[locale];
  const photos: PublicPhoto[] = draft.photos.flatMap((photo) => {
    const url = urls[photo.id];
    return url ? [{ id: photo.id, url, width: photo.width, height: photo.height }] : [];
  });
  const clip = draft.music.clip;
  const functions: GuestFunction[] = storyFunctions(draft, locale).map((told) => ({
    ...told,
    ...guestGuide(draft, told.kind),
    googleCalendarUrl: null,
    icsUrl: null,
  }));
  const rsvpFunctions: RsvpFunction[] = includedFunctions(draft).map((kind) => ({
    id: `preview-${kind}`,
    kind,
    name: functionCopy[kind].name,
    date: draft.functions[kind].date,
  }));

  return (
    <>
      <GuestView
        slug={`family-${token.slice(0, 8)}`}
        draft={draft}
        functions={functions}
        photos={photos}
        clipUrl={clip ? (urls[clip.id] ?? null) : null}
        allIcsUrl={null}
        rsvpFunctions={rsvpFunctions}
        questions={draftQuestions(draft)}
        watermark
        preview
        makeHref={makeLikeThisHref(draft, "family")}
      />
      {/* Never taken for the real thing: it says it hasn't gone to guests yet */}
      <p
        data-family-preview
        className="pointer-events-none fixed top-[calc(max(0.75rem,env(safe-area-inset-top))+0.75rem)] left-1/2 z-[80] max-w-[calc(100vw-7rem)] -translate-x-1/2 rounded-full bg-night/70 px-3.5 py-1.5 text-center text-xs font-semibold text-card-ivory shadow-raised backdrop-blur-sm print:hidden"
      >
        {familyCopy.badge}
      </p>
    </>
  );
}
