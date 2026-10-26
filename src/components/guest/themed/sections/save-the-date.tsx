"use client";

import { format, parseISO } from "date-fns";
import type { GuestLook } from "@/lib/suites/guest-look";
import type { SectionLayouts } from "@/lib/suites/section-layouts";
import type { CardLanguage } from "@/lib/templates/card-languages";
import { CARD_THEMED_WORDS, cardMonth } from "@/lib/templates/themed-words";
import { FloorArt, Houseboat } from "../scenery";
import { useInView } from "../use-in-view";
import { Heading, useMounted } from "./parts";

/** Monday to Sunday in a known week, for a calendar page's head in the card's language. */
const WEEK = [1, 2, 3, 4, 5, 6, 7].map((day) => new Date(Date.UTC(2024, 0, day)));

/** The days of the date's month, Monday first, with blanks before the first. */
export function monthGrid(date: Date): (number | null)[] {
  const first = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
  const blanks = (first.getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0)).getUTCDate();
  return [
    ...Array.from({ length: blanks }, () => null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
}

export function SaveTheDate({
  main,
  look,
  lang,
  layout,
}: {
  main: { date: string; venue: string };
  look: GuestLook;
  lang: CardLanguage;
  layout: SectionLayouts["date"];
}) {
  const cardWords = CARD_THEMED_WORDS[lang];
  const day = parseISO(main.date);
  const [ref, seen] = useInView<HTMLDivElement>("0px 0px -20% 0px");
  const mounted = useMounted();
  const month = cardMonth(main.date, lang);
  const weekday = new Intl.DateTimeFormat(`${lang}-IN`, { weekday: "narrow", timeZone: "UTC" });
  const longDay = new Intl.DateTimeFormat(`${lang}-IN`, { weekday: "long", timeZone: "UTC" });
  const reveal = mounted ? (seen ? "in" : "wait") : undefined;
  return (
    <section
      aria-labelledby="guest-save-date"
      data-mood="day"
      data-tour="8"
      data-layout={layout}
      className="guest-sky relative isolate flex min-h-svh flex-col justify-center px-4 py-16 sm:px-6 sm:py-20"
    >
      {look.style === "garden" && (
        <Houseboat className="guest-boat absolute bottom-6 -z-10 w-40 sm:w-56" />
      )}
      <Heading
        id="guest-save-date"
        lang={lang}
        label={cardWords.saveDateLabel}
        title={cardWords.saveDate}
      />
      {layout === "medallion" && (
        <div
          ref={ref}
          data-reveal={reveal}
          className="guest-medallion relative mx-auto mt-10 grid aspect-square w-[min(88vw,26rem,56svh)] place-items-center"
        >
          <FloorArt pattern={look.pattern} flower={look.flower} second={look.secondFlower} />
          <div className="guest-date-disc relative grid aspect-square w-[48%] place-content-center rounded-full text-center">
            <p className="font-label text-[0.7rem] tracking-[0.25em] text-accent-text uppercase sm:text-xs">
              {month}
            </p>
            <p className="font-display text-[3.4rem] leading-none text-ink tabular-nums sm:text-[4.5rem]">
              {format(day, "d")}
            </p>
            <p className="font-label text-sm tracking-[0.3em] text-accent-text">
              {format(day, "yyyy")}
            </p>
          </div>
        </div>
      )}
      {layout === "calendar" && (
        // A page torn from the month's calendar, the day ringed in flowers
        <div
          ref={ref}
          data-reveal={reveal}
          lang={lang}
          className="guest-reveal guest-card guest-calendar mx-auto mt-10 w-[min(88vw,24rem)] px-5 pt-6 pb-7"
        >
          <p className="text-center font-display text-2xl text-ink">
            {month} <span className="text-accent-text tabular-nums">{format(day, "yyyy")}</span>
          </p>
          <div aria-hidden className="mt-4 grid grid-cols-7 gap-y-1.5 text-center">
            {WEEK.map((date) => (
              <span key={date.getTime()} className="font-label text-[0.7rem] text-ink-muted">
                {weekday.format(date)}
              </span>
            ))}
            {monthGrid(day).map((number, index) => (
              <span
                key={index}
                data-day={number === day.getDate() ? "chosen" : undefined}
                className="guest-calendar-day mx-auto grid size-9 place-items-center rounded-full text-sm text-ink tabular-nums"
              >
                {number}
              </span>
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-ink-muted">
            {longDay.format(new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate())))},{" "}
            {format(day, "d")} {month}
          </p>
        </div>
      )}
      {layout === "ticket" && (
        // A ticket to the day: the date large on the stub, the place on the counterfoil
        <div
          ref={ref}
          data-reveal={reveal}
          lang={lang}
          className="guest-reveal guest-ticket mx-auto mt-10 grid w-[min(92vw,30rem)] grid-cols-[auto_1fr] items-stretch"
        >
          <div className="guest-ticket-stub flex flex-col items-center justify-center px-5 py-6 text-center">
            <p className="font-display text-[3.6rem] leading-none text-ink tabular-nums">
              {format(day, "d")}
            </p>
            <p className="font-label text-[0.7rem] tracking-[0.25em] text-accent-text uppercase">
              {month}
            </p>
          </div>
          <div className="guest-ticket-body flex flex-col justify-center gap-1 px-5 py-6">
            <p className="font-label text-xs tracking-[0.25em] text-accent-text uppercase">
              {longDay.format(new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate())))}
            </p>
            <p className="font-display text-2xl leading-tight text-ink tabular-nums">
              {format(day, "yyyy")}
            </p>
            {main.venue && <p className="text-sm text-balance text-ink-muted">{main.venue}</p>}
          </div>
        </div>
      )}
      {main.venue && layout !== "ticket" && (
        <p className="mt-8 text-center font-display text-2xl text-balance text-ink">{main.venue}</p>
      )}
    </section>
  );
}
