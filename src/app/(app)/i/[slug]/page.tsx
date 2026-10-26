import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuestView, type GuestFunction } from "@/components/guest/guest-view";
import type { RsvpFunction } from "@/components/guest/rsvp-form";
import { editorText } from "@/i18n/copy/editor";
import { publishText } from "@/i18n/copy/publish";
import { getLocale } from "@/i18n/server";
import { includedFunctions } from "@/lib/editor/draft";
import { makeLikeThisHref } from "@/lib/gallery/make-like-this";
import { findPublishedInvite } from "@/lib/invites/public";
import { COVER_ALT, COVER_SIZE, coverPath } from "@/lib/og/cover";
import { showsWatermark } from "@/lib/payments/editions";
import { googleCalendarUrl } from "@/lib/publish/calendar";
import {
  calendarEntries,
  inviteNames,
  inviteWhen,
  inviteWhere,
  occasionName,
} from "@/lib/publish/describe";
import { guestGuide } from "@/lib/publish/event-day";
import { inviteUrl } from "@/lib/publish/links";
import { requestOrigin } from "@/lib/request-origin";
import { site } from "@/lib/site";
import { storyFunctions } from "@/lib/publish/story";

/*
 * A guest's invitation: the doorway (or the 3D card), each function with directions and calendar, then the
 * reply form.
 */

export async function generateMetadata({ params }: PageProps<"/i/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const invite = await findPublishedInvite(slug);
  // Families' names, dates and addresses never go into search results
  const robots = { index: false, follow: false };
  const locale = await getLocale();
  const { guestCopy } = publishText[locale];
  if (!invite) return { title: guestCopy.notFoundTitle, robots };
  const { draft } = invite;
  const title = guestCopy.metaTitle(inviteNames(draft), occasionName(draft, locale));
  const description = guestCopy.metaDescription(inviteWhen(draft, locale), inviteWhere(draft));
  // The cover at a versioned address the CDN keeps, so WhatsApp gets it at once
  const image = {
    url: coverPath(invite.slug, invite.updatedAt),
    ...COVER_SIZE,
    type: "image/jpeg",
    alt: COVER_ALT,
  };
  return {
    title: { absolute: title },
    description,
    robots,
    // The preview picture's address on the very host WhatsApp fetched this page from. The site's
    // own address can redirect (shubhinvitations.com to www), and WhatsApp drops a picture
    // behind a redirect, sending the message with no preview.
    metadataBase: new URL(await requestOrigin()),
    openGraph: {
      type: "website",
      siteName: site.name,
      title,
      description,
      url: `/i/${invite.slug}`,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function InvitePage({ params }: PageProps<"/i/[slug]">) {
  const { slug } = await params;
  const invite = await findPublishedInvite(slug);
  if (!invite) notFound();
  const { draft } = invite;
  const locale = await getLocale();
  const { functionCopy } = editorText[locale];
  const url = inviteUrl(await requestOrigin(), invite.slug);
  const entries = calendarEntries(draft, { id: invite.id, url }, locale);
  const watermark = await showsWatermark(invite.slug, invite.id);

  const functions: GuestFunction[] = storyFunctions(draft, locale).map((told) => {
    const { kind } = told;
    const entry = entries.find((item) => item.uid.startsWith(`${invite.id}-${kind}@`));
    return {
      ...told,
      ...guestGuide(draft, kind),
      googleCalendarUrl: entry ? googleCalendarUrl(entry) : null,
      icsUrl: entry ? `/i/${invite.slug}/calendar?function=${kind}` : null,
    };
  });

  const rsvpFunctions: RsvpFunction[] = includedFunctions(draft).flatMap((kind) => {
    const id = invite.functionIds[kind];
    return id
      ? [{ id, kind, name: functionCopy[kind].name, date: draft.functions[kind].date }]
      : [];
  });

  return (
    <GuestView
      slug={invite.slug}
      draft={draft}
      functions={functions}
      photos={invite.photos}
      clipUrl={invite.clipUrl}
      allIcsUrl={entries.length > 1 ? `/i/${invite.slug}/calendar` : null}
      rsvpFunctions={rsvpFunctions}
      watermark={watermark}
      makeHref={makeLikeThisHref(draft)}
    />
  );
}
