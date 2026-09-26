import { format, parseISO } from "date-fns";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuestView, type GuestFunction } from "@/components/guest/guest-view";
import type { RsvpFunction } from "@/components/guest/rsvp-form";
import { isQualityChoice } from "@/content/engine-review";
import { dateLocale } from "@/i18n/dates";
import { editorText, publishText } from "@/i18n/copy";
import { getLocale } from "@/i18n/server";
import {
  ceremonyName,
  draftQuestions,
  draftTradition,
  includedFunctions,
  needsTime,
} from "@/lib/editor/draft";
import { findPublishedInvite } from "@/lib/invites/public";
import { googleCalendarUrl } from "@/lib/publish/calendar";
import {
  calendarEntries,
  inviteNames,
  inviteWhen,
  inviteWhere,
  occasionName,
} from "@/lib/publish/describe";
import { inviteUrl, mapsUrl } from "@/lib/publish/links";
import { requestOrigin } from "@/lib/request-origin";
import { formatTime } from "@/lib/time";

/*
 * A guest's invitation: the 3D card, each function with directions and calendar, then the
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
  return {
    title: { absolute: title },
    description,
    robots,
    openGraph: { type: "website", title, description, url: `/i/${invite.slug}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** ?quality=2d (or a level) forces the card's drawing, for tests without a GPU. */
export default async function InvitePage({ params, searchParams }: PageProps<"/i/[slug]">) {
  const { slug } = await params;
  const { quality } = await searchParams;
  const invite = await findPublishedInvite(slug);
  if (!invite) notFound();
  const { draft } = invite;
  const locale = await getLocale();
  const { functionCopy } = editorText[locale];
  const words = dateLocale[locale];
  const url = inviteUrl(await requestOrigin(), invite.slug);
  const entries = calendarEntries(draft, { id: invite.id, url }, locale);
  const timed = needsTime(draft);

  const functions: GuestFunction[] = includedFunctions(draft).map((kind) => {
    const fn = draft.functions[kind];
    const entry = entries.find((item) => item.uid.startsWith(`${invite.id}-${kind}@`));
    const local = ceremonyName(draft, kind);
    return {
      kind,
      name: functionCopy[kind].name,
      localName: local ? { text: local.native, lang: draftTradition(draft)!.language } : null,
      date: fn.date ? format(parseISO(fn.date), "EEEE, d MMMM yyyy", { locale: words }) : "",
      time: timed && fn.time ? formatTime(fn.time, words) : "",
      venue: fn.venue.trim(),
      address: fn.address.trim(),
      dressCode: fn.dressCode.trim(),
      mapsUrl: fn.venue.trim() || fn.address.trim() ? mapsUrl(fn.venue, fn.address) : null,
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
      quality={isQualityChoice(quality) ? quality : "auto"}
      names={inviteNames(draft)}
      occasion={occasionName(draft, locale)}
      functions={functions}
      photos={invite.photos}
      allIcsUrl={entries.length > 1 ? `/i/${invite.slug}/calendar` : null}
      rsvpFunctions={rsvpFunctions}
      questions={draftQuestions(draft)}
    />
  );
}
