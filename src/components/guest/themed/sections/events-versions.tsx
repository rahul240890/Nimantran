"use client";

import { CalendarPlus } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { FunctionFacts } from "@/components/guest/function-facts";
import type { GuestFunction } from "@/components/guest/guest-view";
import { useGuestText } from "@/components/guest/guest-language";
import type { FunctionId } from "@/lib/events/functions";
import { cn } from "@/lib/cn";
import { SUITES, pageLook, type SuiteId } from "@/lib/suites/catalog";
import type { EventBox as Box } from "@/lib/suites/event-boxes";
import type { GuestLook } from "@/lib/suites/guest-look";
import type { CardLanguage } from "@/lib/templates/card-languages";
import { CARD_THEMED_WORDS } from "@/lib/templates/themed-words";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { EventBox } from "../event-box";
import { Divider, Framed, Heading, Reveal } from "./parts";

/*
 * The celebrations as each experience family shows them (recipe.ts, SECTION_VERSIONS).
 * The painted pages above already gave every celebration a screen of its own, so these are
 * the practical view: when, where, the map, the dress code and the calendar, set in the
 * family's own way. The hours every theme had before are in celebrations.ts.
 */

type EventsProps = {
  suite: SuiteId;
  look: GuestLook;
  lang: CardLanguage;
  functions: readonly GuestFunction[];
  days: Readonly<Partial<Record<FunctionId, string>>>;
  allIcsUrl: string | null;
  box: Box;
};

/** "Add every celebration to my calendar", when there is more than one. */
function AddAll({ allIcsUrl }: { allIcsUrl: string | null }) {
  const { guestCopy } = useGuestText();
  if (!allIcsUrl) return null;
  return (
    <div className="mt-8 flex justify-center">
      <Button asChild variant="secondary" className="rounded-full">
        <a href={allIcsUrl} download>
          <CalendarPlus aria-hidden />
          {guestCopy.addAll}
        </a>
      </Button>
    </div>
  );
}

/** The celebration's name, and its local name under it. */
function Name({ fn, id, className }: { fn: GuestFunction; id: string; className?: string }) {
  return (
    <h3 id={id} className={cn("flex flex-col font-display leading-tight break-words", className)}>
      {fn.name}
      {fn.localName && (
        <span lang={fn.localName.lang} className="font-sans text-lg text-accent-text">
          {fn.localName.text}
        </span>
      )}
    </h3>
  );
}

/**
 * Editorial: numbered chapters, one under another between fine rules. A large number, the
 * celebration's name and its details, and on a wide screen a small print of its painting.
 */
export function EventsChapters({ suite, look, lang, functions, allIcsUrl }: EventsProps) {
  const cardWords = CARD_THEMED_WORDS[lang];
  const images = SUITES[suite].images;
  return (
    <section
      aria-labelledby="guest-functions"
      data-mood="day"
      data-events="chapters"
      className="guest-sky guest-sky-flat relative isolate px-4 py-16 sm:px-6 sm:py-20"
    >
      <Heading
        id="guest-functions"
        lang={lang}
        label={cardWords.eventsLabel}
        title={cardWords.celebrations}
      />
      <ol className="mx-auto mt-10 flex w-full max-w-5xl flex-col">
        {functions.map((fn, index) => {
          const image = images[pageLook(fn.kind).art] ?? images.cover;
          return (
            <li key={fn.kind} data-tour="8" className="guest-ed-top scroll-mt-4">
              <Reveal className="grid gap-5 py-10 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-8 md:grid-cols-[7rem_minmax(0,1fr)_13rem] md:gap-10">
                <span
                  aria-hidden
                  className="font-display text-[3.5rem] leading-none text-accent-text tabular-nums sm:text-[4.5rem]"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <article
                  aria-labelledby={`fn-${fn.kind}`}
                  lang={lang}
                  className="flex min-w-0 flex-col gap-5"
                >
                  <Name
                    fn={fn}
                    id={`fn-${fn.kind}`}
                    className="text-[2rem] text-ink sm:text-[2.5rem]"
                  />
                  <FunctionFacts fn={fn} />
                </article>
                {image && (
                  <Framed look={look} className="hidden w-full md:block">
                    <Image src={image} alt="" fill sizes="13rem" className="object-cover" />
                  </Framed>
                )}
              </Reveal>
            </li>
          );
        })}
      </ol>
      {functions.length > 1 && <AddAll allIcsUrl={allIcsUrl} />}
    </section>
  );
}

/**
 * Royal: a corridor of palace doors, one per celebration, each with its painting in the
 * arch and its name and date beneath. The guest opens a door (a tab) and its room shows
 * the celebration's painting beside its details in the theme's box. A link to a
 * celebration (the event-day banner's Details) opens its door.
 */
export function EventsRooms({ suite, look, lang, functions, days, allIcsUrl, box }: EventsProps) {
  const cardWords = CARD_THEMED_WORDS[lang];
  const images = SUITES[suite].images;
  const still = useReducedMotion();
  const [open, setOpen] = useState(0);
  const doors = useRef<(HTMLButtonElement | null)[]>([]);
  const room = useRef<HTMLDivElement>(null);
  const kinds = functions.map((fn) => fn.kind).join(" ");

  // A link to #fn-<celebration> opens that door and brings its room into view
  useEffect(() => {
    const list = kinds.split(" ");
    const follow = () => {
      const kind = window.location.hash.replace(/^#fn-/, "");
      const index = list.indexOf(kind);
      if (index < 0) return;
      setOpen(index);
      requestAnimationFrame(() =>
        room.current?.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" }),
      );
    };
    follow();
    window.addEventListener("hashchange", follow);
    return () => window.removeEventListener("hashchange", follow);
  }, [kinds, still]);

  // Arrow keys walk the doors, Home and End go to the first and last
  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const step = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[event.key];
    let next: number | null = null;
    if (step) next = (open + step + functions.length) % functions.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = functions.length - 1;
    if (next === null) return;
    event.preventDefault();
    setOpen(next);
    doors.current[next]?.focus();
  };

  const shown = functions[open] ?? functions[0];
  if (!shown) return null;
  const shownImage = images[pageLook(shown.kind).art] ?? images.cover;

  return (
    <section
      aria-labelledby="guest-functions"
      data-mood="day"
      data-tour="10"
      data-events="rooms"
      className="guest-sky relative isolate flex min-h-svh flex-col justify-center px-4 pt-20 pb-16 sm:px-6 sm:pt-24"
    >
      <Divider look={look} />
      <Heading
        id="guest-functions"
        lang={lang}
        label={cardWords.eventsLabel}
        title={cardWords.celebrations}
      />
      {functions.length > 1 && (
        <div
          role="tablist"
          aria-label={cardWords.celebrations}
          onKeyDown={onKey}
          className="guest-doors mx-auto mt-10 flex max-w-full gap-3 overflow-x-auto px-1 pt-1 pb-3 sm:gap-4"
        >
          {functions.map((fn, index) => {
            const image = images[pageLook(fn.kind).art] ?? images.cover;
            const selected = index === open;
            return (
              <button
                key={fn.kind}
                ref={(node) => {
                  doors.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`door-${fn.kind}`}
                aria-selected={selected}
                aria-controls="guest-room"
                tabIndex={selected ? 0 : -1}
                onClick={() => setOpen(index)}
                className="guest-door flex w-24 shrink-0 cursor-pointer flex-col items-center gap-2 rounded-t-full p-1.5 pb-3 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:w-28"
              >
                <span
                  aria-hidden
                  className="guest-door-arch relative block aspect-[3/4] w-full overflow-hidden rounded-t-full"
                >
                  {image && <Image src={image} alt="" fill sizes="7rem" className="object-cover" />}
                </span>
                <span
                  lang={lang}
                  className="max-w-full font-display text-base leading-tight break-words text-ink"
                >
                  {fn.name}
                </span>
                {fn.date && <span className="text-xs leading-tight text-ink-muted">{fn.date}</span>}
              </button>
            );
          })}
        </div>
      )}
      <div
        ref={room}
        id="guest-room"
        role={functions.length > 1 ? "tabpanel" : undefined}
        aria-labelledby={functions.length > 1 ? `door-${shown.kind}` : undefined}
        className="scroll-mt-4"
      >
        <div
          key={shown.kind}
          className="guest-room mx-auto mt-8 grid w-full max-w-5xl items-center gap-8 md:grid-cols-2 md:gap-14"
        >
          {shownImage && (
            <Framed
              look={look}
              className="mx-auto w-[min(60vw,20rem,calc(34svh*0.8))] md:w-[min(68vw,20rem)]"
            >
              <Image
                src={shownImage}
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
            fn={shown}
            day={days[shown.kind] ?? ""}
            index={open}
            count={functions.length}
            lang={lang}
            headingId={`fn-${shown.kind}`}
          />
        </div>
      </div>
      {functions.length > 1 && <AddAll allIcsUrl={allIcsUrl} />}
    </section>
  );
}
