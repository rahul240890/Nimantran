import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { AccountShell } from "@/components/account/account-shell";
import { PageTransition } from "@/components/motion/page-transition";
import { VideoCard } from "@/components/publish/video-card";
import { publishText } from "@/i18n/copy/publish";
import { getLocale, getText } from "@/i18n/server";
import { authMode } from "@/lib/auth/mode";
import { getAccount } from "@/lib/auth/server";
import type { PublicPhoto } from "@/lib/invites/public";
import { inviteStore } from "@/lib/invites/store";
import { editionsActive, invitePlan } from "@/lib/payments/editions";
import { PLANS } from "@/lib/plans/catalog";
import { inviteNames } from "@/lib/publish/describe";
import { storyFunctions } from "@/lib/publish/story";
import { requestOrigin } from "@/lib/request-origin";

export async function generateMetadata(): Promise<Metadata> {
  const { videoCopy } = await getText(publishText);
  return { title: videoCopy.metaTitle, robots: { index: false, follow: false } };
}

/*
 * The invitation video before publishing (owner, 2026-10-14): any host makes it and watches
 * it here, free, with the mark across it when the package doesn't include the video. It
 * downloads once the invite is live, from the share page, since its last card carries the
 * link. A live invite goes straight to the share page.
 */
export default async function InviteVideoPage({ params }: PageProps<"/invites/[id]/video">) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const account = await getAccount();
  if (!account) redirect(`/sign-in?next=${encodeURIComponent(`/invites/${id}/video`)}`);
  const store = inviteStore();
  const draft = await store?.get(account, id);
  if (!store || !draft) notFound();
  if (draft.slug) redirect(`/invites/${id}/share`);

  const [urls, active, edition, locale, origin, { videoCopy }] = await Promise.all([
    store.photoUrls(account, id).catch(() => ({}) as Record<string, string>),
    editionsActive(),
    invitePlan(account, id),
    getLocale(),
    requestOrigin(),
    getText(publishText),
  ]);
  const photos: PublicPhoto[] = draft.photos.flatMap((photo) => {
    const url = urls[photo.id];
    return url ? [{ id: photo.id, url, width: photo.width, height: photo.height }] : [];
  });
  const clip = draft.music.clip;
  const plan = PLANS[edition?.plan ?? "free"];
  const video = active ? plan.video : "every";
  // As the preview page: a free invite chooses its package before publishing
  const publishHref =
    active && plan.watermark
      ? `/invites/${id}/edition?publish=1`
      : `/create?invite=${id}&publish=1`;

  return (
    <PageTransition>
      <AccountShell>
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14">
          <Link
            href={`/create?invite=${id}`}
            className="-ms-2 inline-flex min-h-11 items-center gap-1.5 self-start rounded-md px-2 text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft aria-hidden className="size-4 rtl:rotate-180" />
            {videoCopy.back}
          </Link>
          <VideoCard
            draft={draft}
            functions={storyFunctions(draft, locale)}
            photos={photos}
            clipUrl={clip ? (urls[clip.id] ?? null) : null}
            // Not live yet: the last card names the site until the invite has its own link
            url={origin}
            slug={`draft-${id.slice(0, 8)}`}
            names={inviteNames(draft)}
            allowed={video !== "none"}
            published={false}
            publishHref={publishHref}
            upgradeHref={`/invites/${id}/edition?plan=celebration`}
            testCodecs={authMode() === "preview"}
          />
        </div>
      </AccountShell>
    </PageTransition>
  );
}
