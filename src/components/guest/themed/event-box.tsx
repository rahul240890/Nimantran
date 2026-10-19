import { format, parseISO } from "date-fns";
import type { ReactNode } from "react";
import { FunctionFacts } from "@/components/guest/function-facts";
import type { GuestFunction } from "@/components/guest/guest-view";
import { cn } from "@/lib/cn";
import { BOX_HEADS, type EventBox as Box } from "@/lib/suites/event-boxes";
import type { CardLanguage } from "@/lib/templates/card-languages";

/**
 * One celebration's details in its theme's own box (event-boxes.ts): a jharokha window, a
 * Mughal arch, a mandap roof, a lotus, a scroll, a ticket, a stamp or a gift tag, each
 * with its own heading. The shapes are drawn in guest-sections.css from the theme's cloth,
 * gilt and jewel, so every theme's colours carry over.
 */
export function EventBox({
  box,
  fn,
  day,
  index,
  count,
  lang,
  headingId,
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
  className?: string;
}) {
  const head = (
    <Head box={box} fn={fn} day={day} index={index} count={count} lang={lang} id={headingId} />
  );
  return (
    <div data-box={box} className={cn("guest-box relative w-full", className)}>
      {CROWNS[box]}
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
            {box === "corners" && <Corners />}
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
  count,
  lang,
  id,
}: {
  box: Box;
  fn: GuestFunction;
  day: string;
  index: number;
  count: number;
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

  if (kind === "ribbon")
    return (
      <div className="guest-box-head flex flex-col items-center gap-2 pt-2 text-center">
        <h3
          id={id}
          className="guest-box-ribbon font-display text-[1.6rem] leading-tight break-words"
        >
          {fn.name}
        </h3>
        {fn.localName && (
          <p lang={fn.localName.lang} className="text-lg text-accent-text">
            {fn.localName.text}
          </p>
        )}
      </div>
    );

  if (kind === "rules")
    return (
      <div className="guest-box-head flex flex-col items-center gap-2 text-center">
        {count > 1 && (
          <p
            aria-hidden
            className="font-label text-xs tracking-[0.3em] text-accent-text tabular-nums"
          >
            {index + 1} / {count}
          </p>
        )}
        <Name fn={fn} id={id} className="text-[1.9rem] text-ink" />
        <span aria-hidden className="guest-rule" />
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

/*
 * The roofs some boxes wear above their top edge, drawn in the theme's cloth with a gilt
 * line: a Mughal multifoil arch, a stepped mandap with its kalash, and a lotus.
 */
const ROOFS = {
  cusped:
    "M0 48V40C30 40 44 34 56 26A16 16 0 0 1 84 18A20 20 0 0 1 114 8Q118 5 120 0Q122 5 126 8A20 20 0 0 1 156 18A16 16 0 0 1 184 26C196 34 210 40 240 40V48Z",
  mandap: "M0 48V40H28V32H56V24H84V16H108V10H114Q120 1 126 10H132V16H156V24H184V32H212V40H240V48Z",
  petal:
    "M0 48V44C40 44 58 30 78 34C86 20 100 8 120 0C140 8 154 20 162 34C182 30 200 44 240 44V48Z",
} as const;

function Roof({ shape }: { shape: keyof typeof ROOFS }) {
  // The line follows the roof only, not its foot along the box
  const line = ROOFS[shape].replace(/^M0 48V/, "M0 ").replace(/V48Z$/, "");
  return (
    <svg
      aria-hidden
      viewBox="0 0 240 48"
      preserveAspectRatio="none"
      className="guest-roof pointer-events-none absolute inset-x-0 bottom-[calc(100%-0.5rem)] z-[1] h-12 w-full sm:h-16"
    >
      <path d={ROOFS[shape]} className="guest-roof-fill" />
      <path d={line} className="guest-roof-line" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const CROWNS: Partial<Record<Box, ReactNode>> = {
  cusped: <Roof shape="cusped" />,
  mandap: <Roof shape="mandap" />,
  petal: <Roof shape="petal" />,
};

/** A gilt flourish in each corner. */
function Corners() {
  return (
    <>
      {["", "-scale-x-100 end-1.5", "-scale-y-100 bottom-1.5", "-scale-100 end-1.5 bottom-1.5"].map(
        (place) => (
          <svg
            key={place}
            aria-hidden
            viewBox="0 0 40 40"
            className={cn(
              "guest-corner pointer-events-none absolute size-10 sm:size-12",
              !place.includes("end") && "start-1.5",
              !place.includes("bottom") && "top-1.5",
              place,
            )}
          >
            <path d="M3 37V13Q3 3 13 3H37" />
            <path d="M9 31V16Q9 9 16 9H31" className="guest-corner-thin" />
            <path d="M15 15l4 4-4 4-4-4z" className="guest-corner-gem" />
          </svg>
        ),
      )}
    </>
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
