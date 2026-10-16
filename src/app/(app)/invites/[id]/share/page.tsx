import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import QRCode from "qrcode";
import { z } from "zod";
import { AccountShell } from "@/components/account/account-shell";
import { PageTransition } from "@/components/motion/page-transition";
import { RepliesCard } from "@/components/publish/replies-card";
import { SharePanel } from "@/components/publish/share-panel";
import { VideoCard } from "@/components/publish/video-card";
import { authMode } from "@/lib/auth/mode";
import { getAccount } from "@/lib/auth/server";
import { findPublishedInvite } from "@/lib/invites/public";
import { coverPath } from "@/lib/og/cover";
import { hostReplies } from "@/lib/invites/rsvp";
import { editionsActive, invitePlan } from "@/lib/payments/editions";
import { FREE_EDITION, PLANS, editionFor } from "@/lib/plans/catalog";
import { draftDesignId } from "@/lib/plans/design-defaults";
import { inviteStore } from "@/lib/invites/store";
import { inviteNames, inviteWhen, inviteWhere, occasionName } from "@/lib/publish/describe";
import { inviteUrl } from "@/lib/publish/links";
import { storyFunctions } from "@/lib/publish/story";
import { requestOrigin } from "@/lib/request-origin";
import { getLocale, getText } from "@/i18n/server";
import { publishText } from "@/i18n/copy/publish";

export async function generateMetadata(): Promise<Metadata> {
  const { shareCopy } = await getText(publishText);
  return {
    title: shareCopy.metaTitle,
    robots: { index: false, follow: false },
  };
}

/** The QR code as SVG in the text colour, so it sits on any card stock. */
async function qrSvg(url: string): Promise<string> {
  const svg = await QRCode.toString(url, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#000000", light: "#0000" },
  });
  return svg
    .replace(/#000000/g, "currentColor")
    .replace("<svg ", '<svg aria-hidden="true" focusable="false" ');
}

export default async function SharePage({ params }: PageProps<"/invites/[id]/share">) {
  const { shareCopy, guestCopy } = await getText(publishText);
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const account = await getAccount();
  if (!account) redirect(`/sign-in?next=${encodeURIComponent(`/invites/${id}/share`)}`);
  const draft = await inviteStore()?.get(account, id);
  if (!draft) notFound();
  if (!draft.slug) redirect(`/create?invite=${id}`);

  const url = inviteUrl(await requestOrigin(), draft.slug);
  const locale = await getLocale();
  // The video comes with Celebration and Grand once payments are on (Step 17c)
  const [active, plan, published] = await Promise.all([
    editionsActive(),
    invitePlan(account, id),
    findPublishedInvite(draft.slug),
  ]);
  // What guests get is the published invite, which is what WhatsApp's preview reads too
  const live = published?.draft ?? draft;
  // The package as it stands on the live design: one bought for another design gives no video
  const covered = editionFor(plan ?? FREE_EDITION, draftDesignId(live));
  const video = active ? PLANS[covered.plan].video : "every";
  const names = inviteNames(live);
  const occasion = occasionName(live, locale);
  const when = inviteWhen(live, locale);
  const where = inviteWhere(live);

  return (
    <PageTransition>
      <AccountShell>
        <SharePanel
          inviteId={id}
          slug={draft.slug}
          url={url}
          names={names}
          // The same title and line the guest page gives WhatsApp (src/app/(app)/i/[slug]/page.tsx)
          coverUrl={
            published ? coverPath(published.slug, published.updatedAt) : `/i/${draft.slug}/cover`
          }
          previewTitle={guestCopy.metaTitle(names, occasion)}
          previewDescription={guestCopy.metaDescription(when, where)}
          message={shareCopy.message({ names, occasion, when, where })}
          qr={await qrSvg(url)}
          replies={<RepliesCard inviteId={id} summary={await hostReplies(account, id)} />}
          video={
            <VideoCard
              draft={live}
              functions={storyFunctions(live, locale)}
              photos={published?.photos ?? []}
              clipUrl={published?.clipUrl ?? null}
              url={url}
              slug={draft.slug}
              names={names}
              allowed={video !== "none"}
              perFunction={video === "every"}
              upgradeHref={`/invites/${id}/edition?plan=celebration`}
              testCodecs={authMode() === "preview"}
            />
          }
        />
      </AccountShell>
    </PageTransition>
  );
}
