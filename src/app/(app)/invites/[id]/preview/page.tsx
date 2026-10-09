import { ArrowLeft, Globe, Send } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { GuestView, type GuestFunction } from "@/components/guest/guest-view";
import type { RsvpFunction } from "@/components/guest/rsvp-form";
import { Button } from "@/components/ui/button";
import { editorText } from "@/i18n/copy/editor";
import { publishText } from "@/i18n/copy/publish";
import { getLocale, getText } from "@/i18n/server";
import { getAccount } from "@/lib/auth/server";
import { draftQuestions, includedFunctions } from "@/lib/editor/draft";
import type { PublicPhoto } from "@/lib/invites/public";
import { inviteStore } from "@/lib/invites/store";
import { editionsActive, invitePlan } from "@/lib/payments/editions";
import { PLANS } from "@/lib/plans/catalog";
import { guestGuide } from "@/lib/publish/event-day";
import { storyFunctions } from "@/lib/publish/story";

export async function generateMetadata(): Promise<Metadata> {
  const { hostPreviewCopy } = await getText(publishText);
  return { title: hostPreviewCopy.metaTitle, robots: { index: false, follow: false } };
}

/*
 * The host's look at an invite before publishing: the whole guest page as guests will
 * see it (the opening, the music, every page and the reply form), with the corner mark a
 * free invite carries. Replies aren't sent from here.
 */
export default async function InvitePreviewPage({ params }: PageProps<"/invites/[id]/preview">) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const account = await getAccount();
  if (!account) redirect(`/sign-in?next=${encodeURIComponent(`/invites/${id}/preview`)}`);
  const store = inviteStore();
  const draft = await store?.get(account, id);
  if (!store || !draft) notFound();

  const [urls, active, edition, locale, { hostPreviewCopy }] = await Promise.all([
    store.photoUrls(account, id),
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
  const free = active && PLANS[edition?.plan ?? "free"].watermark;
  // A free invite chooses its package before publishing; a paid one goes straight back
  const next = draft.slug
    ? { href: `/invites/${id}/share`, label: hostPreviewCopy.share, icon: Send }
    : {
        href: free ? `/invites/${id}/edition?publish=1` : `/create?invite=${id}&publish=1`,
        label: hostPreviewCopy.next,
        icon: Globe,
      };

  return (
    <>
      <div className="border-b border-line bg-surface">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <p className="font-label text-xs tracking-[0.2em] text-accent-text uppercase">
            {hostPreviewCopy.label}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="secondary">
              <Link href={`/create?invite=${id}`}>
                <ArrowLeft aria-hidden className="rtl:rotate-180" />
                {hostPreviewCopy.back}
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href={next.href}>
                <next.icon aria-hidden className="rtl:-scale-x-100" />
                {next.label}
              </Link>
            </Button>
          </div>
        </div>
      </div>
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
        preview
      />
    </>
  );
}
