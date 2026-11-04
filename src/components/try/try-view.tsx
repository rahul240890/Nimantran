"use client";

import { ArrowLeft, DoorOpen, Globe, Images, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { CardMaker } from "@/components/cards/card-maker";
import { usePhotoUrls, useClipUrl } from "@/components/editor/use-photo-urls";
import { GuestView, type GuestFunction } from "@/components/guest/guest-view";
import type { RsvpFunction } from "@/components/guest/rsvp-form";
import { HostPreview } from "@/components/publish/host-preview";
import { GuestPreviewLoading } from "@/components/publish/opening-screens";
import { VideoCard } from "@/components/publish/video-card";
import { Button } from "@/components/ui/button";
import { useLocale, useText } from "@/i18n/client";
import { cardsText } from "@/i18n/copy/cards";
import { editorText } from "@/i18n/copy/editor";
import { publishText } from "@/i18n/copy/publish";
import { designPageHref } from "@/lib/editor/design-page";
import { includedFunctions, type InviteDraft } from "@/lib/editor/draft";
import { inviteDraft } from "@/lib/editor/store";
import type { PublicPhoto } from "@/lib/invites/public";
import { inviteNames } from "@/lib/publish/describe";
import { guestGuide } from "@/lib/publish/event-day";
import { suggestSlug } from "@/lib/publish/slug";
import { storyFunctions } from "@/lib/publish/story";
import { pagePath } from "@/lib/seo/paths";
import { publishAfterSignIn, tryHref, type TryViewName } from "@/lib/try/views";

/** The invite in this browser keeps no account id of its own: its video and notes go under this. */
const TRY_ID = "try-invite";

const noSubscribe = () => () => {};

/**
 * The invite in this browser, tried before signing in: its website, video or cards, with
 * the mark (app/(app)/try/[view]/page.tsx).
 */
export function TryView({
  view,
  frame = false,
  phone = false,
  testCodecs,
}: {
  view: TryViewName;
  frame?: boolean;
  phone?: boolean;
  testCodecs?: boolean;
}) {
  const { draft } = useSyncExternalStore(
    inviteDraft.subscribe,
    inviteDraft.get,
    inviteDraft.getServer,
  );
  const hydrated = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );
  const locale = useLocale();
  const ids = useMemo(() => draft.photos.map((photo) => photo.id), [draft.photos]);
  const urls = usePhotoUrls(ids, draft.remoteId);
  const clipUrl = useClipUrl(draft);
  // Keyed by the links themselves, so a new list only comes when a photo's link does
  const shown = draft.photos.map((photo) => urls[photo.id] ?? "").join("|");
  const photos: PublicPhoto[] = useMemo(() => {
    const links = shown.split("|");
    return draft.photos.flatMap((photo, i) => {
      const url = links[i];
      return url ? [{ id: photo.id, url, width: photo.width, height: photo.height }] : [];
    });
  }, [draft.photos, shown]);
  const functions = useMemo(() => storyFunctions(draft, locale), [draft, locale]);

  if (!hydrated) return <TryLoading website={view === "website"} />;
  // Nothing started in this browser yet: a design comes first
  if (draft.updatedAt === 0) return <TryEmpty website={view === "website"} />;

  if (view === "website") {
    return (
      <TryWebsite
        draft={draft}
        functions={functions}
        photos={photos}
        clipUrl={clipUrl}
        frame={frame}
        phone={phone}
      />
    );
  }
  if (view === "video") {
    return <TryVideo draft={draft} photos={photos} clipUrl={clipUrl} testCodecs={testCodecs} />;
  }
  return <TryCards draft={draft} photos={photos} />;
}

function TryWebsite({
  draft,
  functions,
  photos,
  clipUrl,
  frame,
  phone,
}: {
  draft: InviteDraft;
  functions: ReturnType<typeof storyFunctions>;
  photos: PublicPhoto[];
  clipUrl: string | null;
  frame: boolean;
  phone: boolean;
}) {
  const { hostPreviewCopy, publishCopy } = useText(publishText);
  const { functionCopy } = useText(editorText);
  const guestFunctions: GuestFunction[] = useMemo(
    () =>
      functions.map((told) => ({
        ...told,
        ...guestGuide(draft, told.kind),
        googleCalendarUrl: null,
        icsUrl: null,
      })),
    [functions, draft],
  );
  const rsvpFunctions: RsvpFunction[] = includedFunctions(draft).map((kind) => ({
    id: `preview-${kind}`,
    kind,
    name: functionCopy[kind].name,
    date: draft.functions[kind].date,
  }));
  const slug = suggestSlug({
    first: draft.content.first ?? "",
    second: draft.content.second ?? "",
    categoryId: draft.categoryId,
  });

  return (
    <HostPreview
      frame={frame}
      phone={phone}
      frameSrc={`${tryHref("website")}?frame=1`}
      fullHref={tryHref("website")}
      back={{ href: designPageHref(draft), label: hostPreviewCopy.back }}
      next={{ href: publishAfterSignIn(draft), label: publishCopy.publish }}
      gateHref={`${designPageHref(draft)}#part-gate`}
      published={false}
      link={`/i/${slug}`}
      marked
      copy={hostPreviewCopy}
    >
      <GuestView
        slug="preview-try"
        draft={draft}
        functions={guestFunctions}
        photos={photos}
        clipUrl={clipUrl}
        allIcsUrl={null}
        rsvpFunctions={rsvpFunctions}
        watermark="tiled"
        preview
      />
    </HostPreview>
  );
}

/** The way back to the design's page, and to its gate, above the video and the cards. */
function TryNav({ draft, gate }: { draft: InviteDraft; gate?: string }) {
  const { tryCopy } = useText(publishText);
  return (
    <div className="-ms-2 flex flex-wrap items-center gap-x-4">
      <Link
        href={designPageHref(draft)}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-sm font-semibold text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <ArrowLeft aria-hidden className="size-4 rtl:rotate-180" />
        {tryCopy.back}
      </Link>
      {gate && (
        <Link
          href={`${designPageHref(draft)}#part-gate`}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-sm font-semibold text-accent-text transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <DoorOpen aria-hidden className="size-4" />
          {gate}
        </Link>
      )}
    </div>
  );
}

/** Publish, after signing in: the step after trying it. */
function TryPublish({ draft }: { draft: InviteDraft }) {
  const { publishCopy } = useText(publishText);
  return (
    <Button asChild size="lg" className="self-start max-sm:w-full">
      <Link href={publishAfterSignIn(draft)}>
        <Globe aria-hidden />
        {publishCopy.publish}
      </Link>
    </Button>
  );
}

function TryVideo({
  draft,
  photos,
  clipUrl,
  testCodecs,
}: {
  draft: InviteDraft;
  photos: PublicPhoto[];
  clipUrl: string | null;
  testCodecs?: boolean;
}) {
  const { tryCopy, videoCopy } = useText(publishText);
  const locale = useLocale();
  const origin = useSyncExternalStore(
    noSubscribe,
    () => window.location.origin,
    () => "",
  );
  const functions = useMemo(() => storyFunctions(draft, locale), [draft, locale]);
  return (
    <>
      <TryNav draft={draft} gate={videoCopy.changeGate} />
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl text-balance sm:text-4xl">{tryCopy.videoTitle}</h1>
        <p className="max-w-prose text-ink-muted">{tryCopy.videoIntro}</p>
      </div>
      {origin && (
        <VideoCard
          inviteId={TRY_ID}
          draft={draft}
          functions={functions}
          photos={photos}
          clipUrl={clipUrl}
          url={origin}
          slug={`draft-${TRY_ID.slice(0, 8)}`}
          names={inviteNames(draft)}
          // With the mark until it is published: the clean one comes with the account
          allowed={false}
          published={false}
          publishHref={publishAfterSignIn(draft)}
          upgradeHref={publishAfterSignIn(draft)}
          testCodecs={testCodecs}
        />
      )}
      <TryPublish draft={draft} />
    </>
  );
}

function TryCards({ draft, photos }: { draft: InviteDraft; photos: PublicPhoto[] }) {
  const { cardsCopy } = useText(cardsText);
  const { tryCopy } = useText(publishText);
  return (
    <>
      <TryNav draft={draft} />
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl text-balance sm:text-4xl">{cardsCopy.heading}</h1>
        <p className="max-w-prose text-ink-muted">{tryCopy.cardsIntro}</p>
      </div>
      <CardMaker
        inviteId={TRY_ID}
        draft={draft}
        photos={photos}
        names={inviteNames(draft)}
        allowed={false}
        upgradeHref={publishAfterSignIn(draft)}
      />
      <TryPublish draft={draft} />
    </>
  );
}

function TryLoading({ website }: { website: boolean }) {
  // The website's loading screen is the opening's dark stage, never an empty page
  if (website) return <GuestPreviewLoading />;
  return (
    <div role="status" className="flex justify-center py-16 text-ink-muted">
      <LoaderCircle aria-hidden className="size-6 animate-spin motion-still:animate-none" />
    </div>
  );
}

function TryEmpty({ website }: { website: boolean }) {
  const { tryCopy } = useText(publishText);
  const locale = useLocale();
  const body = (
    <div className="flex flex-col items-start gap-4">
      <h1 className="font-display text-3xl text-balance">{tryCopy.emptyTitle}</h1>
      <p className="max-w-prose text-ink-muted">{tryCopy.emptyBody}</p>
      <Button asChild>
        <Link href={pagePath({ kind: "designs" }, locale)}>
          <Images aria-hidden />
          {tryCopy.emptyAction}
        </Link>
      </Button>
    </div>
  );
  if (!website) return body;
  return (
    <main
      id="main"
      className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center bg-paper px-4 sm:px-6"
    >
      {body}
    </main>
  );
}
