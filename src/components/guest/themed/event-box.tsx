import { format, parseISO } from "date-fns";
import { FunctionFacts } from "@/components/guest/function-facts";
import type { GuestFunction } from "@/components/guest/guest-view";
import { cn } from "@/lib/cn";
import { BOX_HEADS, isOrnate, type EventBox as Box, type PartyBox } from "@/lib/suites/event-boxes";
import type { GuestFlower } from "@/lib/suites/guest-look";
import type { CardLanguage } from "@/lib/templates/card-languages";
import { OrnateCard } from "./ornate-card";

/**
 * One celebration's details in its theme's own box (event-boxes.ts): an ornate card with
 * the hour's painting in it (ornate-card.tsx), or at a party a ticket, a stamp or a gift
 * tag, each with its own heading. The shapes are drawn in event-cards.css and
 * guest-sections.css from the theme's cloth, gilt and jewel, so every theme's colours
 * carry over.
 */
export function EventBox({
  box,
  fn,
  day,
  index,
  count,
  lang,
  headingId,
  flower,
  second,
  className,
}: {
  box: Box;
  fn: GuestFunction;
  /** The celebration's date (YYYY-MM-DD), for a seal or a stub; empty when not set. */
  day: string;
  index: number;
  count: number;
  lang: CardLanguage;
  headingId: string;
  /** The theme's flowers, for an ornate card's garlands and corners. */
  flower: GuestFlower;
  second: GuestFlower;
  className?: string;
}) {
  if (isOrnate(box))
    return (
      <OrnateCard
        box={box}
        fn={fn}
        index={index}
        count={count}
        headingId={headingId}
        flower={flower}
        second={second}
        className={className}
      />
    );
  const head = <Head box={box} fn={fn} day={day} index={index} lang={lang} id={headingId} />;
  return (
    <div data-box={box} className={cn("guest-box relative w-full", className)}>
      {box === "tag" && <TagString />}
      <article aria-labelledby={headingId} className="guest-card flex flex-col gap-4 p-5 sm:p-7">
        {box === "ticket" ? (
          <>
            <div className="guest-ticket-top px-5 py-4 sm:px-7">{head}</div>
            <div className="guest-ticket-bottom flex flex-col gap-4 px-5 pt-5 pb-6 sm:px-7">
              <FunctionFacts fn={fn} />
            </div>
          </>
        ) : (
          <>
            {head}
            <FunctionFacts fn={fn} />
          </>
        )}
      </article>
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

function Head({
  box,
  fn,
  day,
  index,
  lang,
  id,
}: {
  box: PartyBox;
  fn: GuestFunction;
  day: string;
  index: number;
  lang: CardLanguage;
  id: string;
}) {
  const kind = BOX_HEADS[box];
  const number = String(index + 1).padStart(2, "0");
  const date = day ? parseISO(day) : null;
  const month = date
    ? new Intl.DateTimeFormat(`${lang}-IN`, { month: "short", timeZone: "UTC" }).format(
        new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1)),
      )
    : "";

  if (kind === "seal")
    return (
      <div
        className={cn(
          "guest-box-head flex flex-col gap-3",
          box === "stamp" ? "items-start pe-20 text-start" : "items-center text-center",
        )}
      >
        <span aria-hidden className="guest-seal" lang={lang}>
          {date ? (
            <>
              <span className="font-label text-[0.65rem] tracking-[0.2em] uppercase">{month}</span>
              <span className="font-display text-[1.75rem] tabular-nums">{format(date, "d")}</span>
            </>
          ) : (
            <span className="font-display text-[1.75rem] tabular-nums">{number}</span>
          )}
        </span>
        <Name fn={fn} id={id} className="text-[1.9rem] text-ink" />
      </div>
    );

  if (kind === "stub")
    return (
      <div className="guest-box-head flex items-center gap-4">
        <span
          aria-hidden
          lang={lang}
          className="guest-stub flex shrink-0 flex-col items-center pe-4 text-center leading-none"
        >
          <span className="font-display text-[2.5rem] text-ink tabular-nums">
            {date ? format(date, "d") : number}
          </span>
          {date && (
            <span className="mt-1 font-label text-[0.65rem] tracking-[0.2em] text-accent-text uppercase">
              {month}
            </span>
          )}
        </span>
        <Name fn={fn} id={id} className="min-w-0 text-[1.75rem] text-ink" />
      </div>
    );

  return (
    <div className="guest-box-head flex items-end gap-3">
      <span aria-hidden className="guest-box-number font-display leading-none tabular-nums">
        {number}
      </span>
      <Name fn={fn} id={id} className="min-w-0 pb-1 text-[1.75rem] text-ink" />
    </div>
  );
}

/** The string a gift tag hangs from, threaded through its hole. */
function TagString() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 48 56"
      className="guest-tag-string pointer-events-none absolute bottom-[calc(100%-1.5rem)] left-1/2 z-[1] h-14 w-12 -translate-x-1/2"
    >
      <path d="M24 56C24 38 8 34 14 18S38 10 32 0" />
    </svg>
  );
}
