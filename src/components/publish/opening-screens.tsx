"use client";

import { ArrowLeft, Clapperboard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { publishText } from "@/i18n/copy/publish";
import { useText } from "@/i18n/client";

/*
 * What shows the moment the host taps to see the invite as a guest, or to watch it as a
 * video, while the server reads the invite and its photo links. They come with the page's
 * code ahead of the tap, so the tap answers at once rather than holding the button busy.
 */

/** The guest page's loading screen: the dark stage the opening plays on. */
export function GuestPreviewLoading() {
  const { hostPreviewCopy } = useText(publishText);
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-night px-6 text-card-ivory">
      <Spinner className="size-8" />
      <p role="status" className="font-label text-xs tracking-[0.2em] uppercase">
        {hostPreviewCopy.opening}
      </p>
    </div>
  );
}

/** The video page's loading screen: its frame and card, with the poster still to come. */
export function VideoPageLoading() {
  const { videoCopy } = useText(publishText);
  return (
    <div className="flex min-h-dvh flex-col">
      <div aria-hidden className="h-16 border-b border-line bg-paper/85" />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14">
        <span className="-ms-2 inline-flex min-h-11 items-center gap-1.5 self-start px-2 text-sm font-semibold text-ink-muted">
          <ArrowLeft aria-hidden className="size-4 rtl:rotate-180" />
          {videoCopy.back}
        </span>
        <Card className="gap-4 p-5 sm:p-6">
          <div className="flex flex-col gap-1">
            <h2 className="flex items-center gap-2 font-semibold">
              <Clapperboard aria-hidden className="size-5 shrink-0 text-accent-text" />
              {videoCopy.heading}
            </h2>
            <p className="text-sm text-ink-muted">{videoCopy.body}</p>
          </div>
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
            <div className="flex aspect-[9/16] w-40 shrink-0 items-center justify-center rounded-lg border border-line bg-night text-card-ivory shadow-raised">
              <Spinner className="size-7" label={videoCopy.loading} />
            </div>
            <div className="flex w-full flex-col gap-3">
              <Skeleton className="h-11 w-full sm:w-48" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/** The share page's loading screen: its heading, with the link, code and video to come. */
export function SharePageLoading() {
  const { shareCopy } = useText(publishText);
  return (
    <div aria-busy className="flex min-h-dvh flex-col">
      <div aria-hidden className="h-16 border-b border-line bg-paper/85" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="flex flex-col gap-2">
          <span className="-ms-2 inline-flex min-h-11 items-center gap-1.5 self-start px-2 text-sm font-semibold text-ink-muted">
            <ArrowLeft aria-hidden className="size-4 rtl:rotate-180" />
            {shareCopy.back}
          </span>
          <p className="font-label text-xs tracking-[0.28em] text-accent-text uppercase">
            {shareCopy.eyebrow}
          </p>
          <h1 className="font-display text-[2rem] leading-[1.08] break-words sm:text-[2.6rem]">
            {shareCopy.title}
          </h1>
          <p className="max-w-2xl text-ink-muted">{shareCopy.intro}</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
