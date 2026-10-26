"use client";

import { format, parseISO } from "date-fns";
import { CalendarPlus } from "lucide-react";
import { FunctionFacts } from "@/components/guest/function-facts";
import type { GuestFunction } from "@/components/guest/guest-view";
import { useGuestText } from "@/components/guest/guest-language";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { FunctionId } from "@/lib/events/functions";
import type { SectionLayouts } from "@/lib/suites/section-layouts";
import type { CardLanguage } from "@/lib/templates/card-languages";
import { cardMonth } from "@/lib/templates/themed-words";
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
 */
export function EventsTimeline({
  functions,
  days,
  lang,
  layout,
  allIcsUrl,
}: {
  functions: readonly GuestFunction[];
  /** Each celebration's date (YYYY-MM-DD), for its day number and month. */
  days: Readonly<Partial<Record<FunctionId, string>>>;
  lang: CardLanguage;
  layout: SectionLayouts["timeline"];
  allIcsUrl: string | null;
}) {
  const { guestCopy } = useGuestText();
  return (
    <>
      <ol lang={lang} data-timeline={layout} className="guest-timeline-list mx-auto w-full">
        {functions.map((fn, index) => {
          const day = days[fn.kind] ? parseISO(days[fn.kind]!) : null;
          return (
            <li
              key={fn.kind}
              data-side={index % 2 === 1 ? "far" : "near"}
              className="guest-timeline-item relative"
            >
              <span aria-hidden className="guest-timeline-mark">
                {layout === "thread" || layout === "alternate" || !day ? (
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
