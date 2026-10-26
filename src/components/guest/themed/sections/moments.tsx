"use client";

import { format, parseISO } from "date-fns";
import { Image } from "@/components/ui/image";
import { FunctionFacts } from "@/components/guest/function-facts";
import type { GuestFunction } from "@/components/guest/guest-view";
import { useGuestText } from "@/components/guest/guest-language";
import type { FunctionId } from "@/lib/events/functions";
import { cn } from "@/lib/cn";
import { SUITES, pageLook, type SuiteId } from "@/lib/suites/catalog";
import type { CardLanguage } from "@/lib/templates/card-languages";
import { CARD_THEMED_WORDS, cardMonth } from "@/lib/templates/themed-words";
import type { GuestLook } from "@/lib/suites/guest-look";
import { PetalDrift } from "../flowers";
import { PalaceSkyline } from "../scenery";
import { ScratchCover, type CoverKind } from "../scratch-cover";
import { AddAll } from "./events-versions";
import { Heading } from "./parts";

/*
 * Moments the guest touches, as the invitations guests pass around on WhatsApp do (owner,
 * 2026-10-26): the date under gold foil to scratch away, and each celebration as its own
 * painted card under a cover to rub off. They sit on the jewel ground, deep maroon lit with
 * gold, and the words beneath every cover are in the page all along.
 */

/** Save the date under gold foil: the day, the month and the year in three medallions. */
export function DateScratch({
  main,
  lang,
}: {
  main: { date: string; venue: string };
  lang: CardLanguage;
}) {
  const cardWords = CARD_THEMED_WORDS[lang];
  const words = useGuestText().guestCopy.themed.reveal;
  const day = parseISO(main.date);
  const longDay = new Intl.DateTimeFormat(`${lang}-IN`, { weekday: "long", timeZone: "UTC" });
  const medals = [
    { key: "day", text: format(day, "d"), size: "text-[clamp(2rem,10cqw,3.5rem)] tabular-nums" },
    { key: "month", text: cardMonth(main.date, lang), size: "text-[clamp(1rem,5cqw,1.6rem)]" },
    {
      key: "year",
      text: format(day, "yyyy"),
      size: "text-[clamp(1.4rem,6.5cqw,2.4rem)] tabular-nums",
    },
  ];
  return (
    <section
      aria-labelledby="guest-save-date"
      data-mood="jewel"
      data-tour="8"
      data-date="scratch"
      className="guest-sky relative isolate flex min-h-svh flex-col justify-center px-4 py-16 sm:px-6 sm:py-20"
    >
      <Heading
        id="guest-save-date"
        lang={lang}
        label={cardWords.saveDateLabel}
        title={cardWords.saveDate}
      />
      <ScratchCover
        kind="gold"
        hint={words.date}
        reveal={words.button}
        className="guest-foil mx-auto mt-10 w-full max-w-[32rem] overflow-hidden rounded-[1.5rem]"
      >
        <div
          lang={lang}
          data-invitation
          className="guest-foil-face @container relative flex aspect-[4/5] flex-col items-center justify-center gap-5 px-4 pt-8 pb-24 text-center sm:aspect-[5/4] sm:pb-20"
        >
          <PalaceSkyline className="guest-foil-skyline absolute inset-x-0 bottom-0 w-full" />
          <p className="relative font-label text-xs tracking-[0.3em] text-card-accent-text uppercase">
            {longDay.format(day)}
          </p>
          <div className="relative flex w-full justify-center gap-[3cqw]">
            {medals.map((medal) => (
              <span
                key={medal.key}
                data-medal={medal.key}
                className="guest-foil-medal grid aspect-square w-[30cqw] max-w-40 place-content-center rounded-full px-1"
              >
                <span
                  className={cn(
                    "font-card-display leading-none break-words text-card-ink",
                    medal.size,
                  )}
                >
                  {medal.text}
                </span>
              </span>
            ))}
          </div>
          {main.venue && (
            <p className="relative max-w-sm font-card-display text-lg leading-snug text-card-ink">
              {main.venue}
            </p>
          )}
        </div>
      </ScratchCover>
    </section>
  );
}

/** What each celebration is hidden under: its own colour where it has one. */
const COVERS: Partial<Record<FunctionId, CoverKind>> = {
  haldi: "turmeric",
  mehendi: "henna",
  wedding: "gold",
  mandap: "gold",
  engagement: "gold",
  reception: "gold",
};

/**
 * Each celebration as its own painted invitation card, its name, day and place lettered on
 * the theme's painting of it, under turmeric, henna, gold or petals for the guest to rub away.
 * Beside it (below on a phone) the practical part: the map, the calendar and the dress code.
 */
export function EventsCards({
  suite,
  look,
  lang,
  functions,
  allIcsUrl,
}: {
  suite: SuiteId;
  look: GuestLook;
  lang: CardLanguage;
  functions: readonly GuestFunction[];
  allIcsUrl: string | null;
}) {
  const cardWords = CARD_THEMED_WORDS[lang];
  const words = useGuestText().guestCopy.themed.reveal;
  const images = SUITES[suite].images;
  return (
    <section
      aria-labelledby="guest-functions"
      data-mood="jewel"
      data-tour="10"
      data-events="cards"
      className="guest-sky relative isolate px-4 py-16 sm:px-6 sm:py-24"
    >
      <Heading
        id="guest-functions"
        lang={lang}
        label={cardWords.eventsLabel}
        title={cardWords.celebrations}
      />
      <ol className="guest-invite-line relative mx-auto mt-12 flex w-full max-w-5xl flex-col gap-16 sm:gap-24">
        {functions.map((fn, index) => {
          const image = images[pageLook(fn.kind).art] ?? images.cover;
          const kind = COVERS[fn.kind] ?? "petals";
          const flip = index % 2 === 1;
          return (
            <li key={fn.kind} data-tour="8" className="relative scroll-mt-4">
              <article
                aria-labelledby={`fn-${fn.kind}`}
                lang={lang}
                className="grid items-center gap-8 md:grid-cols-2 md:gap-16"
              >
                <ScratchCover
                  kind={kind}
                  hint={words[kind]}
                  reveal={words.button}
                  className={cn(
                    "guest-invite mx-auto w-full max-w-[min(24rem,calc(70svh*0.75))] overflow-hidden rounded-[1.25rem]",
                    flip && "md:order-2",
                  )}
                >
                  <div data-invitation className="@container relative aspect-[3/4]">
                    {image && (
                      <Image
                        src={image}
                        alt=""
                        fill
                        sizes="(min-width: 48rem) 24rem, 92vw"
                        className="guest-invite-art object-cover"
                      />
                    )}
                    {/* Petals drift down over the painting, in front of it and behind the words */}
                    <div className="absolute inset-0 isolate overflow-hidden">
                      <PetalDrift flowers={[look.flower, look.secondFlower]} count={7} />
                    </div>
                    <div className="guest-invite-panel absolute inset-x-[13%] top-[12%] bottom-[14%] flex flex-col items-center justify-center gap-[2.4cqw] rounded-t-full px-[5cqw] pt-[14cqw] pb-[6cqw] text-center">
                      <p className="font-label text-[clamp(0.6rem,2.8cqw,0.75rem)] tracking-[0.3em] text-card-accent-text uppercase">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3
                        id={`fn-${fn.kind}`}
                        className="font-card-display text-[clamp(1.6rem,11cqw,2.75rem)] leading-[1.05] break-words text-card-ink"
                      >
                        {fn.name}
                      </h3>
                      {fn.localName && (
                        <p
                          lang={fn.localName.lang}
                          className="text-[clamp(0.9rem,4.4cqw,1.15rem)] text-card-accent-text"
                        >
                          {fn.localName.text}
                        </p>
                      )}
                      <span aria-hidden className="guest-invite-rule" />
                      {fn.date && (
                        <p className="font-label text-[clamp(0.62rem,3cqw,0.8rem)] tracking-[0.18em] text-card-ink uppercase">
                          {fn.date}
                        </p>
                      )}
                      {fn.time && (
                        <p className="text-[clamp(0.75rem,3.6cqw,0.95rem)] text-card-ink-muted">
                          {fn.muhurat && (
                            <span lang={fn.muhurat.lang} className="text-card-accent-text">
                              {fn.muhurat.text} ·{" "}
                            </span>
                          )}
                          {fn.time}
                        </p>
                      )}
                      {fn.venue && (
                        <p className="font-card-display text-[clamp(0.85rem,4.4cqw,1.15rem)] leading-snug break-words text-card-ink">
                          {fn.venue}
                        </p>
                      )}
                    </div>
                  </div>
                </ScratchCover>
                <div className="flex min-w-0 flex-col gap-5">
                  <FunctionFacts fn={fn} onCard />
                </div>
              </article>
            </li>
          );
        })}
      </ol>
      {functions.length > 1 && <AddAll allIcsUrl={allIcsUrl} />}
    </section>
  );
}
