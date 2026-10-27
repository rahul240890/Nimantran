"use client";

import { format, parseISO } from "date-fns";
import { CalendarPlus, Navigation } from "lucide-react";
import { useEventDayClock } from "@/components/guest/event-day-banner";
import { FunctionFacts } from "@/components/guest/function-facts";
import type { GuestFunction } from "@/components/guest/guest-view";
import { useGuestText } from "@/components/guest/guest-language";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { FunctionId } from "@/lib/events/functions";
import { eventDayStatus } from "@/lib/publish/event-day";
import type { SectionLayouts } from "@/lib/suites/section-layouts";
import type { CardLanguage } from "@/lib/templates/card-languages";
import { cardMonth } from "@/lib/templates/themed-words";
import { CelebrationIcon } from "./celebration-icons";
import "@/app/guest-below.css";

/**
 * Every celebration on one timeline (owner, 2026-10-26: the pages above already give each
 * its own painting, so below they are listed once, in order, with what a guest needs on the
 * day: when, where, what to wear, directions and the calendar). Each theme draws the line
 * its own way (section-layouts.ts), in its own colours (guest-below.css):
 * - thread: numbered beads on a line down the start side
 * - alternate: a centre line, the celebrations taking turns on either side of it
 * - cards: cloth cards, each with its day on a seal, joined by a dotted line
 * - diary: the day large in a column of its own, the details beside it, ruled like a diary
 * Each celebration has its own small drawing (celebration-icons.tsx) and says how far off it
 * is. The line draws itself down as the guest scrolls, each mark lighting as it is reached
 * (guest-below.css), and on the day the celebration on now, or next, glows, with a card at
 * the top of the timeline and one tap to directions (owner, 2026-10-27).
 */
export function EventsTimeline({
  functions,
  days,
  lang,
  layout,
  allIcsUrl,
  previewNow,
}: {
  /** With how far off each is ("In 5 days"), once the browser knows today. */
  functions: readonly (GuestFunction & { countdown?: string })[];
  /** Each celebration's date (YYYY-MM-DD), for its day number and month. */
  days: Readonly<Partial<Record<FunctionId, string>>>;
  lang: CardLanguage;
  layout: SectionLayouts["timeline"];
  allIcsUrl: string | null;
  /** A fixed moment, for review pages. */
  previewNow?: number;
}) {
  const { guestCopy } = useGuestText();
  const words = guestCopy.eventDay;
  const now = useEventDayClock(previewNow);
  const status = now === null ? null : eventDayStatus(functions, now);
  const today = status ? functions.find((fn) => fn.kind === status.kind) : undefined;
  const dated = layout === "cards" || layout === "diary";
  return (
    <>
      {status && today && (
        <div
          data-today={status.state}
          className="guest-today mx-auto mb-12 flex w-full max-w-xl flex-wrap items-center gap-x-5 gap-y-4 rounded-2xl px-5 py-4 sm:px-6"
        >
          <span aria-hidden className="relative flex size-3 shrink-0">
            {status.state === "now" && (
              <span className="absolute inset-0 rounded-full bg-rose opacity-60 motion-safe:animate-ping" />
            )}
            <span
              className={cn(
                "relative size-3 rounded-full",
                status.state === "now" ? "bg-rose" : "bg-marigold",
              )}
            />
          </span>
          <p className="min-w-0 flex-1 basis-48 leading-snug">
            <span className="block font-label text-xs tracking-[0.2em] text-accent-text uppercase">
              {status.state === "now" ? words.now : words.later}
            </span>
            <a
              href={`#fn-${today.kind}`}
              className="block font-display text-xl break-words text-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {words.at(today.name, status.state === "now" ? "" : today.time)}
            </a>
            {today.venue && <span className="block text-sm text-ink-muted">{today.venue}</span>}
          </p>
          {today.mapsUrl && (
            <Button asChild className="rounded-full">
              <a href={today.mapsUrl} target="_blank" rel="noopener noreferrer">
                <Navigation aria-hidden />
                {guestCopy.directions}
              </a>
            </Button>
          )}
        </div>
      )}
      <ol lang={lang} data-timeline={layout} className="guest-timeline-list mx-auto w-full">
        {functions.map((fn, index) => {
          const day = days[fn.kind] ? parseISO(days[fn.kind]!) : null;
          return (
            <li
              key={fn.kind}
              data-side={index % 2 === 1 ? "far" : "near"}
              data-today={status?.kind === fn.kind ? status.state : undefined}
              className="guest-timeline-item relative"
            >
              <span aria-hidden className="guest-timeline-mark">
                {!dated ? (
                  <CelebrationIcon kind={fn.kind} className="size-6" />
                ) : !day ? (
                  <span className="font-display tabular-nums">{index + 1}</span>
                ) : (
                  <>
                    <span className="font-display leading-none tabular-nums">
                      {format(day, "d")}
                    </span>
                    <span className="font-label text-[0.65rem] tracking-[0.18em] uppercase">
                      {cardMonth(days[fn.kind]!, lang)}
                    </span>
                  </>
                )}
              </span>
              <article
                aria-labelledby={`fn-${fn.kind}`}
                className={cn(
                  "guest-timeline-body flex min-w-0 flex-col gap-3",
                  layout === "cards" && "guest-card px-5 pt-6 pb-5 sm:px-7",
                )}
              >
                {(dated || fn.countdown || status?.kind === fn.kind) && (
                  <div className="flex flex-wrap items-center gap-3">
                    {dated && <CelebrationIcon kind={fn.kind} className="size-9" />}
                    {status?.kind === fn.kind ? (
                      <span className="guest-timeline-tag" data-today={status.state}>
                        {status.state === "now" ? words.now : words.later}
                      </span>
                    ) : (
                      fn.countdown && <span className="guest-timeline-tag">{fn.countdown}</span>
                    )}
                  </div>
                )}
                <h3
                  id={`fn-${fn.kind}`}
                  className="flex flex-col font-display text-2xl leading-tight break-words text-ink sm:text-[1.75rem]"
                >
                  {fn.name}
                  {fn.localName && (
                    <span lang={fn.localName.lang} className="font-sans text-lg text-accent-text">
                      {fn.localName.text}
                    </span>
                  )}
                </h3>
                <FunctionFacts fn={fn} />
              </article>
            </li>
          );
        })}
      </ol>
      {allIcsUrl && functions.length > 1 && (
        <div className="mt-10 flex justify-center">
          <Button asChild variant="secondary" className="rounded-full">
            <a href={allIcsUrl} download>
              <CalendarPlus aria-hidden />
              {guestCopy.addAll}
            </a>
          </Button>
        </div>
      )}
    </>
  );
}
