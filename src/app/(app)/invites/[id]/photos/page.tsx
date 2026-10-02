import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { AccountShell } from "@/components/account/account-shell";
import { PhotoAlbum } from "@/components/dashboard/photo-album";
import { PageTransition } from "@/components/motion/page-transition";
import { getAccount } from "@/lib/auth/server";
import { hostWall, inviteWallWindow } from "@/lib/invites/photo-wall";
import { findPublishedInvite } from "@/lib/invites/public";
import { formatWallDate } from "@/lib/photo-wall/rules";
import { inviteStore } from "@/lib/invites/store";
import { inviteNames } from "@/lib/publish/describe";
import { inviteUrl } from "@/lib/publish/links";
import { requestOrigin } from "@/lib/request-origin";
import { getLocale, getText } from "@/i18n/server";
import { photoWallText } from "@/i18n/copy/photo-wall";

export async function generateMetadata(): Promise<Metadata> {
  const { albumCopy } = await getText(photoWallText);
  return { title: albumCopy.metaTitle, robots: { index: false, follow: false } };
}

/** The host's album of everything guests shared (Step 24): see, hide and download. */
export default async function PhotoWallPage({ params }: PageProps<"/invites/[id]/photos">) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const account = await getAccount();
  if (!account) redirect(`/sign-in?next=${encodeURIComponent(`/invites/${id}/photos`)}`);
  const [draft, photos] = await Promise.all([
    inviteStore()?.get(account, id),
    hostWall(account, id),
  ]);
  if (!draft || !photos) notFound();

  const { albumCopy } = await getText(photoWallText);
  const locale = await getLocale();
  const invite = draft.slug ? await findPublishedInvite(draft.slug) : null;
  const window = invite ? await inviteWallWindow(invite) : null;
  const status = !invite
    ? albumCopy.window.notLive
    : window?.state === "open"
      ? albumCopy.window.open(window.closesOn ? formatWallDate(window.closesOn, locale) : null)
      : window?.state === "soon"
        ? albumCopy.window.soon(formatWallDate(window.opensOn, locale))
        : window?.state === "closed"
          ? albumCopy.window.closed
          : albumCopy.window.off;

  return (
    <PageTransition>
      <AccountShell>
        <PhotoAlbum
          inviteId={id}
          names={inviteNames(draft)}
          status={status}
          wallUrl={invite ? `${inviteUrl(await requestOrigin(), invite.slug)}#photo-wall` : null}
          photos={photos}
        />
      </AccountShell>
    </PageTransition>
  );
}
