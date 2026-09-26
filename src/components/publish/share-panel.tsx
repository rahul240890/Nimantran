"use client";

import {
  ArrowLeft,
  Copy,
  Download,
  ExternalLink,
  Link2Off,
  MessageCircle,
  Pencil,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore, useTransition, type ReactNode } from "react";
import { unpublishInvite } from "@/app/_actions/invites";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { shareCopy } from "@/content/publish";
import { inviteDraft } from "@/lib/editor/store";
import { whatsappShareUrl } from "@/lib/publish/links";

type SharePanelProps = {
  inviteId: string;
  slug: string;
  url: string;
  names: string;
  occasion: string;
  when: string;
  message: string;
  /** The QR code as an SVG string, drawn in currentColor. */
  qr: string;
  /** Guests' replies so far, drawn on the server. */
  replies?: ReactNode;
};

const noSubscribe = () => () => {};
const canShare = () => typeof navigator !== "undefined" && typeof navigator.share === "function";

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function SharePanel({
  inviteId,
  slug,
  url,
  names,
  occasion,
  when,
  message: initialMessage,
  qr,
  replies,
}: SharePanelProps) {
  const [message, setMessage] = useState(initialMessage);
  const nativeShare = useSyncExternalStore(noSubscribe, canShare, () => false);
  const full = `${message.trim()}\n${url}`;

  const copy = async () => {
    const done = await copyText(url);
    toast(
      done
        ? { title: shareCopy.copied, tone: "success" }
        : { title: shareCopy.copyFailed, tone: "error" },
    );
  };

  const share = async () => {
    try {
      await navigator.share({ title: names, text: message.trim(), url });
    } catch {
      // Closed without sharing
    }
  };

  const downloadQr = async () => {
    const QRCode = (await import("qrcode")).default;
    const data = await QRCode.toDataURL(url, { width: 1200, margin: 2, errorCorrectionLevel: "M" });
    const link = document.createElement("a");
    link.href = data;
    link.download = `${slug}-qr.png`;
    link.click();
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="flex flex-col gap-2">
        <Link
          href="/invites"
          className="-ms-2 inline-flex min-h-11 items-center gap-1.5 self-start rounded-md px-2 text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft aria-hidden className="size-4 rtl:rotate-180" />
          {shareCopy.back}
        </Link>
        <p className="font-label text-xs tracking-[0.28em] text-accent-text uppercase">
          {shareCopy.eyebrow}
        </p>
        <h1 className="font-display text-[2rem] leading-[1.08] break-words sm:text-[2.6rem]">
          {shareCopy.title}
        </h1>
        <p className="max-w-2xl text-ink-muted">{shareCopy.intro}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          <Card className="gap-5 p-5 sm:p-6">
            <div className="flex flex-col gap-2">
              <h2 className="font-semibold">{shareCopy.linkLabel}</h2>
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
                <p
                  data-testid="invite-link"
                  className="min-w-0 flex-1 rounded-md border border-line bg-surface-2/60 px-3.5 py-3 font-medium break-all select-all"
                >
                  {url}
                </p>
                <Button variant="secondary" leadingIcon={<Copy aria-hidden />} onClick={copy}>
                  {shareCopy.copy}
                </Button>
              </div>
            </div>

            <Field label={shareCopy.messageLabel} hint={shareCopy.messageHint}>
              <Textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={4}
                maxLength={600}
              />
            </Field>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg">
                <a href={whatsappShareUrl(full)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle aria-hidden />
                  {shareCopy.whatsapp}
                </a>
              </Button>
              {nativeShare && (
                <Button
                  variant="secondary"
                  size="lg"
                  leadingIcon={<Share2 aria-hidden />}
                  onClick={() => void share()}
                >
                  {shareCopy.moreWays}
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-x-2 gap-y-1 border-t border-line pt-4">
              <Button asChild variant="ghost" size="sm">
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink aria-hidden />
                  {shareCopy.open}
                </a>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/create?invite=${inviteId}`}>
                  <Pencil aria-hidden />
                  {shareCopy.edit}
                </Link>
              </Button>
            </div>
          </Card>
          {replies}
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <section aria-labelledby="share-preview" className="flex flex-col gap-3">
            <h2 id="share-preview" className="font-semibold">
              {shareCopy.previewHeading}
            </h2>
            {/* A message bubble with the link preview WhatsApp builds from the page */}
            <div className="rounded-lg border border-line bg-surface-2/60 p-3 sm:p-4">
              <div className="ms-auto max-w-sm overflow-hidden rounded-lg rounded-se-sm border border-success/25 bg-success/10 shadow-raised">
                {/* eslint-disable-next-line @next/next/no-img-element -- the generated preview image */}
                <img
                  src={`/i/${slug}/opengraph-image`}
                  alt=""
                  width={1200}
                  height={630}
                  className="aspect-[1200/630] w-full bg-surface-2 object-cover"
                />
                <div className="flex flex-col gap-0.5 bg-surface/70 px-3 py-2">
                  <p className="text-sm font-semibold break-words">
                    {names} · {occasion}
                  </p>
                  {when && <p className="text-xs text-ink-muted">{when}</p>}
                  <p className="truncate text-xs text-ink-muted">{new URL(url).host}</p>
                </div>
                <p className="px-3 py-2 text-sm break-words whitespace-pre-line">{full}</p>
              </div>
            </div>
            <p className="text-sm text-ink-muted">{shareCopy.previewNote}</p>
          </section>

          <Card className="gap-4 p-5 sm:p-6">
            <div className="flex flex-col gap-1">
              <h2 className="font-semibold">{shareCopy.qrHeading}</h2>
              <p className="text-sm text-ink-muted">{shareCopy.qrBody}</p>
            </div>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
              <figure
                role="img"
                aria-label={shareCopy.qrAlt(url)}
                className="w-44 shrink-0 rounded-md border-2 border-card-gold bg-card-ivory p-4 text-card-ink shadow-raised [&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
                dangerouslySetInnerHTML={{ __html: qr }}
              />
              <Button
                variant="secondary"
                leadingIcon={<Download aria-hidden />}
                onClick={() => void downloadQr()}
              >
                {shareCopy.downloadQr}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <StopSharing inviteId={inviteId} />
    </div>
  );
}

function StopSharing({ inviteId }: { inviteId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  const stop = () =>
    start(async () => {
      const done = await unpublishInvite(inviteId).catch(() => false);
      if (!done) {
        toast({ title: shareCopy.stopFailed, tone: "error" });
        return;
      }
      const draft = inviteDraft.get().draft;
      if (draft.remoteId === inviteId) {
        inviteDraft.update((current) => ({ ...current, slug: null }), { touch: false });
      }
      setOpen(false);
      toast({ title: shareCopy.stopped, tone: "success" });
      router.push("/invites");
      router.refresh();
    });

  return (
    <section
      aria-labelledby="stop-sharing"
      className="flex flex-col gap-3 rounded-lg border border-line p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-1">
        <h2 id="stop-sharing" className="font-semibold">
          {shareCopy.stopHeading}
        </h2>
        <p className="text-sm text-ink-muted">{shareCopy.stopBody}</p>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" leadingIcon={<Link2Off aria-hidden />} className="shrink-0">
            {shareCopy.stop}
          </Button>
        </DialogTrigger>
        <DialogContent
          title={shareCopy.stopConfirmTitle}
          description={shareCopy.stopBody}
          closeLabel={shareCopy.close}
          footer={
            <>
              <DialogClose asChild>
                <Button variant="secondary" disabled={pending}>
                  {shareCopy.keepSharing}
                </Button>
              </DialogClose>
              <Button variant="danger" loading={pending} onClick={stop}>
                {shareCopy.stopConfirm}
              </Button>
            </>
          }
        />
      </Dialog>
    </section>
  );
}
