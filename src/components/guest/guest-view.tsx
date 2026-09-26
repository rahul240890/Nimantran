"use client";

import { CalendarPlus, Clock, MailCheck, MapPin, Navigation, Shirt } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BrandMark } from "@/components/brand/brand-mark";
import { Invitation } from "@/components/invitation/invitation";
import { RsvpForm, type RsvpFunction } from "@/components/guest/rsvp-form";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeMenu } from "@/components/ui/theme-toggle";
import type { QualityChoice } from "@/content/engine-review";
import { draftCopy, templateWithRaga, type InviteDraft } from "@/lib/editor/draft";
import type { RsvpQuestionId } from "@/lib/categories/schema";
import type { FunctionId } from "@/lib/events/functions";
import type { PublicPhoto } from "@/lib/invites/public";
import { useText } from "@/i18n/client";
import { publishText, uiText } from "@/i18n/copy";

export type GuestFunction = {
  kind: FunctionId;
  name: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  dressCode: string;
  mapsUrl: string | null;
  googleCalendarUrl: string | null;
  icsUrl: string | null;
};

type GuestViewProps = {
  slug: string;
  draft: InviteDraft;
  quality: QualityChoice;
  names: string;
  occasion: string;
  functions: GuestFunction[];
  photos: PublicPhoto[];
  allIcsUrl: string | null;
  rsvpFunctions: RsvpFunction[];
  questions: RsvpQuestionId[];
};

export function GuestView({
  slug,
  draft,
  quality,
  names,
  occasion,
  functions,
  photos,
  allIcsUrl,
  rsvpFunctions,
  questions,
}: GuestViewProps) {
  const { guestCopy, rsvpCopy } = useText(publishText);
  const { uiStrings } = useText(uiText);
  const copy = useMemo(() => draftCopy(draft), [draft]);
  const template = useMemo(
    () => templateWithRaga(draft.templateId, draft.music.raga),
    [draft.templateId, draft.music.raga],
  );
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="absolute end-3 top-[max(0.75rem,env(safe-area-inset-top))] z-30">
        <ThemeMenu labels={uiStrings.theme} />
      </div>

      <main id="main" className="flex flex-1 flex-col">
        {/* The card, first and large, in a warm pool of light */}
        <section
          aria-labelledby="guest-names"
          className="relative isolate flex flex-col items-center gap-4 overflow-hidden px-4 pt-[max(3.5rem,calc(env(safe-area-inset-top)+3rem))] pb-10 sm:px-6"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute top-[45%] left-1/2 -z-10 aspect-square w-[min(140%,64rem)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in srgb, var(--marigold) 26%, transparent), color-mix(in srgb, var(--rose) 8%, transparent) 60%, transparent)",
            }}
          />
          <p className="font-label text-xs tracking-[0.32em] text-accent-text uppercase">
            {guestCopy.invited}
          </p>
          <h1
            id="guest-names"
            className="max-w-3xl text-center font-display text-[2.1rem] leading-[1.08] break-words sm:text-[3rem]"
          >
            {names}
          </h1>
          <p className="text-ink-muted">{occasion}</p>
          <div className="flex h-[min(72svh,44rem)] min-h-[26rem] w-full max-w-4xl flex-col">
            <Invitation
              copy={copy}
              template={template}
              quality={quality}
              open={open}
              onOpenChange={setOpen}
              musicOnOpen={draft.music.playOnOpen}
            />
          </div>
          <div className="flex flex-col items-center gap-3">
            {!open && <p className="text-sm text-ink-muted">{guestCopy.openHint}</p>}
            {rsvpFunctions.length > 0 && (
              <Button asChild size="lg">
                <a href="#rsvp">
                  <MailCheck aria-hidden />
                  {guestCopy.reply}
                </a>
              </Button>
            )}
          </div>
        </section>

        <section
          aria-labelledby="guest-functions"
          className="border-t border-line bg-surface-2/50 px-4 py-12 sm:px-6 sm:py-16"
        >
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2
                id="guest-functions"
                className="font-display text-[1.75rem] leading-tight sm:text-[2.2rem]"
              >
                {guestCopy.functions}
              </h2>
              {allIcsUrl && (
                <Button asChild variant="secondary">
                  <a href={allIcsUrl} download>
                    <CalendarPlus aria-hidden />
                    {guestCopy.addAll}
                  </a>
                </Button>
              )}
            </div>
            <ol className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
              {functions.map((fn) => (
                <li key={fn.kind}>
                  <FunctionCard fn={fn} />
                </li>
              ))}
            </ol>
          </div>
        </section>

        {photos.length > 0 && (
          <section aria-labelledby="guest-photos" className="px-4 py-12 sm:px-6 sm:py-16">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
              <h2
                id="guest-photos"
                className="font-display text-[1.75rem] leading-tight sm:text-[2.2rem]"
              >
                {guestCopy.photos}
              </h2>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                {photos.map((photo, index) => (
                  <li
                    key={photo.id}
                    className="overflow-hidden rounded-lg border border-line bg-surface-2 shadow-raised"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- short-lived signed links */}
                    <img
                      src={photo.url}
                      alt={guestCopy.photoAlt(index + 1)}
                      width={photo.width}
                      height={photo.height}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/5] h-full w-full object-cover"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
        {rsvpFunctions.length > 0 && (
          <section
            id="rsvp"
            aria-labelledby="guest-rsvp"
            className="scroll-mt-4 border-t border-line px-4 py-12 sm:px-6 sm:py-16"
          >
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h2
                  id="guest-rsvp"
                  className="font-display text-[1.75rem] leading-tight sm:text-[2.2rem]"
                >
                  {rsvpCopy.heading}
                </h2>
                <p className="text-ink-muted">{rsvpCopy.intro}</p>
              </div>
              <RsvpForm slug={slug} functions={rsvpFunctions} questions={questions} />
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-line px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-start">
          <p className="flex items-center gap-2 text-sm text-ink-muted">
            <BrandMark className="h-6 w-5 text-accent-text" />
            {guestCopy.madeWith}
          </p>
          <Button asChild variant="ghost" size="sm">
            <Link href="/">{guestCopy.createYours}</Link>
          </Button>
        </div>
      </footer>
    </div>
  );
}

function FunctionCard({ fn }: { fn: GuestFunction }) {
  const { guestCopy } = useText(publishText);
  const headingId = `fn-${fn.kind}`;
  return (
    <article
      aria-labelledby={headingId}
      className="flex h-full flex-col gap-4 rounded-lg border border-line bg-surface p-5 shadow-raised sm:p-6"
    >
      <h3 id={headingId} className="font-display text-2xl leading-tight">
        {fn.name}
      </h3>
      <dl className="flex flex-col gap-3">
        {fn.date && (
          <div className="flex items-start gap-3">
            <dt className="mt-0.5 shrink-0">
              <Clock aria-hidden className="size-5 text-accent-text" />
              <span className="sr-only">{guestCopy.when}</span>
            </dt>
            <dd>
              {fn.date}
              {fn.time && <span className="text-ink-muted"> · {fn.time}</span>}
            </dd>
          </div>
        )}
        {(fn.venue || fn.address) && (
          <div className="flex items-start gap-3">
            <dt className="mt-0.5 shrink-0">
              <MapPin aria-hidden className="size-5 text-accent-text" />
              <span className="sr-only">{guestCopy.where}</span>
            </dt>
            <dd className="min-w-0 break-words">
              {fn.venue && <span className="block font-semibold">{fn.venue}</span>}
              {fn.address && <span className="block text-ink-muted">{fn.address}</span>}
            </dd>
          </div>
        )}
        {fn.dressCode && (
          <div className="flex items-start gap-3">
            <dt className="mt-0.5 shrink-0">
              <Shirt aria-hidden className="size-5 text-accent-text" />
              <span className="sr-only">{guestCopy.dressCode}</span>
            </dt>
            <dd className="min-w-0 break-words">{fn.dressCode}</dd>
          </div>
        )}
      </dl>
      <div className="mt-auto flex flex-wrap gap-2 pt-1">
        {fn.mapsUrl && (
          <Button asChild variant="secondary" size="sm">
            <a href={fn.mapsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation aria-hidden />
              {guestCopy.directions}
            </a>
          </Button>
        )}
        {fn.googleCalendarUrl && fn.icsUrl && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" leadingIcon={<CalendarPlus aria-hidden />}>
                {guestCopy.addToCalendar}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <a href={fn.googleCalendarUrl} target="_blank" rel="noopener noreferrer">
                  {guestCopy.googleCalendar}
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={fn.icsUrl} download>
                  {guestCopy.appleCalendar}
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </article>
  );
}
