import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { GuestView, type GuestFunction } from "@/components/guest/guest-view";
import type { RsvpFunction } from "@/components/guest/rsvp-form";
import { HostPreview } from "@/components/publish/host-preview";
import { guestViewport } from "@/components/root-html";
import { editorText } from "@/i18n/copy/editor";
import { publishText } from "@/i18n/copy/publish";
import { getLocale, getText } from "@/i18n/server";
import { getAccount } from "@/lib/auth/server";
import { designPageHref } from "@/lib/editor/design-page";
import { draftQuestions, includedFunctions } from "@/lib/editor/draft";
import type { PublicPhoto } from "@/lib/invites/public";
import { inviteStore } from "@/lib/invites/store";
import { editionsActive, invitePlan } from "@/lib/payments/editions";
import { FREE_EDITION, PLANS, editionFor } from "@/lib/plans/catalog";
import { draftDesignId } from "@/lib/plans/design-defaults";
import { guestGuide } from "@/lib/publish/event-day";
import { suggestSlug } from "@/lib/publish/slug";
import { storyFunctions } from "@/lib/publish/story";

// The browser's bars take the invitation's night, as on the guests' own link
export const viewport = guestViewport;

export async function generateMetadata(): Promise<Metadata> {
  const { hostPreviewCopy } = await getText(publishText);
  return { title: hostPreviewCopy.metaTitle, robots: { index: false, follow: false } };
}

/*
 * The host's look at an invite, before or after publishing: the whole guest page as guests
 * will see it (the opening, the music, every page and the reply form), with the corner mark
 * a free invite carries, edge to edge on every screen. ?phone=1 plays it inside a phone on
 * a wide screen (?frame=1 is that inner page). Replies aren't sent from here.
 */
export default async function InvitePreviewPage({
  params,
  searchParams,
}: PageProps<"/invites/[id]/preview">) {
  const { id } = await params;
  const { frame, phone } = await searchParams;
  if (!z.uuid().safeParse(id).success) notFound();
  const account = await getAccount();
  if (!account) redirect(`/sign-in?next=${encodeURIComponent(`/invites/${id}/preview`)}`);
  const store = inviteStore();
  const draft = await store?.get(account, id);
  if (!store || !draft) notFound();

  const [urls, active, edition, locale, { hostPreviewCopy }] = await Promise.all([
    store.photoUrls(account, id, draft.music.clip).catch(() => ({}) as Record<string, string>),
    editionsActive(),
    invitePlan(account, id),
    getLocale(),
    getText(publishText),
  ]);
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
  // A package bought for another design leaves this one to choose its own
  const free =
    active && PLANS[editionFor(edition ?? FREE_EDITION, draftDesignId(draft)).plan].watermark;
  // A free invite chooses its package before publishing; a paid one goes straight back
  const next = draft.slug
    ? { href: `/invites/${id}/share`, label: hostPreviewCopy.share }
    : {
        href: free ? `/invites/${id}/edition?publish=1` : `${designPageHref(draft)}&publish=1`,
        label: hostPreviewCopy.next,
      };

  return (
    <HostPreview
      frame={frame === "1"}
      phone={phone === "1"}
      frameSrc={`/invites/${id}/preview?frame=1`}
      fullHref={`/invites/${id}/preview`}
      // The design's page is the whole editor: the way back and the gate lead there
      back={{ href: designPageHref(draft), label: hostPreviewCopy.back }}
      next={next}
      gateHref={`${designPageHref(draft)}#part-gate`}
      published={Boolean(draft.slug)}
      // The web address guests get: the live one, or the one made from the names to publish
      link={`/i/${
        draft.slug ??
        suggestSlug({
          first: draft.content.first ?? "",
          second: draft.content.second ?? "",
          categoryId: draft.categoryId,
        })
      }`}
      copy={hostPreviewCopy}
    >
      <GuestView
        slug={`preview-${id.slice(0, 8)}`}
        draft={draft}
        functions={functions}
        photos={photos}
        clipUrl={clip ? (urls[clip.id] ?? null) : null}
        allIcsUrl={null}
        rsvpFunctions={rsvpFunctions}
        questions={draftQuestions(draft)}
        watermark={free}
        // The host sees it as guests will, with no "Preview" written over it (owner, 2026-10-27)
        preview
      />
    </HostPreview>
  );
}
