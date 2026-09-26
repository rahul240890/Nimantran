import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import QRCode from "qrcode";
import { z } from "zod";
import { AccountShell } from "@/components/account/account-shell";
import { PageTransition } from "@/components/motion/page-transition";
import { RepliesCard } from "@/components/publish/replies-card";
import { SharePanel } from "@/components/publish/share-panel";
import { getAccount } from "@/lib/auth/server";
import { hostReplies } from "@/lib/invites/rsvp";
import { inviteStore } from "@/lib/invites/store";
import { inviteNames, inviteWhen, occasionName } from "@/lib/publish/describe";
import { inviteUrl } from "@/lib/publish/links";
import { requestOrigin } from "@/lib/request-origin";
import { getLocale, getText } from "@/i18n/server";
import { publishText } from "@/i18n/copy";

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
  const { shareCopy } = await getText(publishText);
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const account = await getAccount();
  if (!account) redirect(`/sign-in?next=${encodeURIComponent(`/invites/${id}/share`)}`);
  const draft = await inviteStore()?.get(account, id);
  if (!draft) notFound();
  if (!draft.slug) redirect(`/create?invite=${id}`);

  const url = inviteUrl(await requestOrigin(), draft.slug);
  const names = inviteNames(draft);
  const occasion = occasionName(draft, await getLocale());

  return (
    <PageTransition>
      <AccountShell>
        <SharePanel
          inviteId={id}
          slug={draft.slug}
          url={url}
          names={names}
          occasion={occasion}
          when={inviteWhen(draft, await getLocale())}
          message={shareCopy.message(names, occasion, inviteWhen(draft, await getLocale()))}
          qr={await qrSvg(url)}
          replies={<RepliesCard inviteId={id} summary={await hostReplies(account, id)} />}
        />
      </AccountShell>
    </PageTransition>
  );
}
