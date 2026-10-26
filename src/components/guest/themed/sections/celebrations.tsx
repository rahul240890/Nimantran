"use client";

import { CalendarPlus } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import type { GuestFunction } from "@/components/guest/guest-view";
import { useGuestText } from "@/components/guest/guest-language";
import type { FunctionId } from "@/lib/events/functions";
import { cn } from "@/lib/cn";
import { SUITES, pageLook, type SuiteId } from "@/lib/suites/catalog";
import type { EventBox as Box } from "@/lib/suites/event-boxes";
import type { GuestLook } from "@/lib/suites/guest-look";
import type { SectionLayouts } from "@/lib/suites/section-layouts";
import type { CardLanguage } from "@/lib/templates/card-languages";
import { CARD_THEMED_WORDS } from "@/lib/templates/themed-words";
import { EventBox } from "../event-box";
import { Divider, Framed, Heading, Reveal } from "./parts";

/** Each celebration in its own hour of the day, under its own painting from the theme. */
export function Celebrations({
  suite,
  look,
  lang,
  functions,
  days,
  allIcsUrl,
  layouts,
  box,
}: {
  suite: SuiteId;
  look: GuestLook;
  lang: CardLanguage;
  functions: readonly GuestFunction[];
  days: Readonly<Partial<Record<FunctionId, string>>>;
  allIcsUrl: string | null;
  layouts: SectionLayouts;
  /** The theme's box for each celebration's details (event-boxes.ts). */
  box: Box;
}) {
  const { guestCopy } = useGuestText();
  const cardWords = CARD_THEMED_WORDS[lang];
  const images = SUITES[suite].images;
  const plan = layouts.plan;
  // On a timeline the thread itself is the day's plan, so the list above it is left out
  const line = layouts.hours === "timeline";
  return (
    <section aria-labelledby="guest-functions" className="relative isolate">
      <div
        data-mood="day"
        data-tour={functions.length > 1 ? "6" : undefined}
        className={cn(
          "guest-sky guest-sky-flat px-4 pt-4 pb-10 sm:px-6",
          // With more than one celebration, the day's plan fills a screen of its own first
          functions.length > 1 && "flex min-h-svh flex-col justify-center py-16",
        )}
      >
        <Heading
          id="guest-functions"
          lang={lang}
          label={cardWords.eventsLabel}
          title={cardWords.celebrations}
        />
        {functions.length > 1 && !line && (
          <Reveal
            className={cn("mx-auto mt-8 w-full", plan === "tiles" ? "max-w-2xl" : "max-w-md")}
          >
            <ol
              lang={lang}
              data-layout={plan}
              className={cn(
                "guest-stagger",
                plan === "cards" && "flex flex-col gap-3",
                plan === "timeline" && "guest-timeline flex flex-col gap-1 ps-2",
                plan === "tiles" && "grid grid-cols-2 gap-3 sm:grid-cols-3",
              )}
            >
              {functions.map((fn) => (
                <li key={fn.kind} className={cn(plan === "timeline" && "relative ps-9")}>
                  {plan === "timeline" && (
                    <span aria-hidden className="guest-timeline-dot absolute start-0 top-4" />
                  )}
                  <a
                    href={`#fn-${fn.kind}`}
                    className={cn(
                      "flex min-h-14 flex-col gap-0.5 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-still:transition-none motion-still:hover:translate-y-0",
                      plan === "cards" && "guest-card items-center px-5 py-3 text-center",
                      plan === "timeline" && "rounded-xl px-2 py-2.5 text-start",
                      plan === "tiles" &&
                        "guest-card guest-tile h-full items-center justify-center px-3 py-5 text-center",
                    )}
                  >
                    <span className="max-w-full font-display text-xl leading-tight break-words text-ink">
                      {fn.name}
                    </span>
                    {(fn.date || fn.time) && (
                      <span className="text-sm text-ink-muted">
                        {[fn.date, fn.time].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ol>
          </Reveal>
        )}
        {line && (
          <Timeline
            look={look}
            box={box}
            images={images}
            lang={lang}
            functions={functions}
            days={days}
          />
        )}
        {allIcsUrl && (
          <div className="mt-6 flex justify-center">
            <Button asChild variant="secondary" className="rounded-full">
              <a href={allIcsUrl} download>
                <CalendarPlus aria-hidden />
                {guestCopy.addAll}
              </a>
            </Button>
          </div>
        )}
      </div>
      {!line && (
        <ol data-layout={layouts.hours}>
          {functions.map((fn, index) => {
            const { art, mood } = pageLook(fn.kind);
            const image = images[art] ?? images.cover;
            const headingId = `fn-${fn.kind}`;
            const overlay = layouts.hours === "overlay" && Boolean(image);
            // Zigzag: every other hour sets its painting on the far side
            const flipped = layouts.hours === "zigzag" && index % 2 === 1;
            return (
              <li
                key={fn.kind}
                data-mood={mood}
                data-tour="8"
                className="guest-sky guest-hour relative isolate flex min-h-svh flex-col justify-center px-4 pt-6 pb-16 sm:px-6 sm:pb-20"
              >
                <Divider look={look} />
                {overlay && image && (
                  // The hour's painting fills the screen, the card held over it
                  <div aria-hidden className="guest-hour-backdrop absolute inset-0 -z-10">
                    <Image
                      src={image}
                      alt=""
                      fill
                      unoptimized
                      sizes="100vw"
                      className="object-cover object-[50%_40%]"
                    />
                  </div>
                )}
                <Reveal
                  className={cn(
                    "guest-hour-body mx-auto grid w-full items-center gap-6 pt-12 sm:gap-10 md:pt-16",
                    overlay ? "max-w-lg" : "max-w-5xl md:grid-cols-2 md:gap-14",
                  )}
                >
                  {image && !overlay && (
                    <Framed
                      look={look}
                      className={cn(
                        "guest-hour-art mx-auto w-[min(60vw,20rem,calc(34svh*0.8))] md:w-[min(68vw,20rem)]",
                        flipped && "md:order-2",
                      )}
                    >
                      <Image
                        src={image}
                        alt=""
                        fill
                        unoptimized
                        sizes="(min-width: 48rem) 20rem, 68vw"
                        className="object-cover object-[50%_40%]"
                      />
                    </Framed>
                  )}
                  <EventBox
                    box={box}
                    fn={fn}
                    day={days[fn.kind] ?? ""}
                    index={index}
                    count={functions.length}
                    lang={lang}
                    headingId={headingId}
                  />
                </Reveal>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

/**
 * Every celebration on one thread through the day (guest-sections.css): a bead with the
 * hour's painting at each box, and on wider screens the day and time across the thread.
 */
export function Timeline({
  look,
  box,
  images,
  lang,
  functions,
  days,
}: {
  look: GuestLook;
  box: Box;
  images: (typeof SUITES)[SuiteId]["images"];
  lang: CardLanguage;
  functions: readonly GuestFunction[];
  days: Readonly<Partial<Record<FunctionId, string>>>;
}) {
  return (
    <ol
      lang={lang}
      data-layout="timeline"
      className="guest-line mx-auto mt-10 flex w-full max-w-5xl flex-col gap-12 sm:gap-16"
    >
      {functions.map((fn, index) => {
        const { art, mood } = pageLook(fn.kind);
        const image = images[art] ?? images.cover;
        // Wider screens set every other box on the far side of the thread
        const far = index % 2 === 1;
        return (
          <li
            key={fn.kind}
            data-mood={mood}
            className="guest-hour relative grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-x-4 gap-y-3 md:grid-cols-[minmax(0,1fr)_5.5rem_minmax(0,1fr)] md:gap-x-8"
          >
            <span
              aria-hidden
              className="guest-line-bead relative col-start-1 row-start-1 md:col-start-2 md:mt-6"
            >
              {image && <Image src={image} alt="" fill sizes="5.5rem" className="object-cover" />}
            </span>
            {/* Across the thread: the day and time, and wider, the hour's painting under them */}
            <div
              className={cn(
                "col-start-2 row-start-1 flex flex-col gap-6 md:row-start-1 md:mt-6",
                far ? "md:col-start-1 md:items-end md:text-end" : "md:col-start-3",
              )}
            >
              {(fn.date || fn.time) && (
                <p className="flex min-h-12 flex-col justify-center md:min-h-22">
                  <span className="font-display text-xl leading-tight text-ink md:text-2xl">
                    {fn.date}
                  </span>
                  {fn.time && <span className="text-sm text-ink">{fn.time}</span>}
                </p>
              )}
              {image && (
                <Framed look={look} className="hidden w-[min(100%,12rem)] md:block">
                  <Image src={image} alt="" fill sizes="12rem" className="object-cover" />
                </Framed>
              )}
            </div>
            <Reveal
              className={cn(
                "col-span-2 col-start-1 row-start-2 md:col-span-1 md:row-start-1",
                far ? "md:col-start-3" : "md:col-start-1",
              )}
            >
              <EventBox
                box={box}
                fn={fn}
                day={days[fn.kind] ?? ""}
                index={index}
                count={functions.length}
                lang={lang}
                headingId={`fn-${fn.kind}`}
              />
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
