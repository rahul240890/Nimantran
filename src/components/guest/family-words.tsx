"use client";

import { Fragment, useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { isPeople, NAME_BLOCKS, splitPeople, type FamilyParts } from "@/lib/engine/story";

/** One of the family's labelled blocks, as the guest page lists them. */
export type FamilyBlock = {
  id: string;
  title: string;
  text: string;
  lang?: string;
  parts?: FamilyParts;
};

/**
 * Whether a block is one of the two sides' parents, which a wide page sets side by side so
 * the son's family and the daughter's read together; every other block takes a full row.
 */
export function pairedSide(family: readonly FamilyBlock[], block: FamilyBlock): boolean {
  return Boolean(block.parts) && family.filter((b) => b.parts).length === 2;
}

/** Names never shrink below this share of their size to stay whole; past it they may wrap. */
const NAMES_FIT_MIN = 0.6;

/**
 * Sizes every name on a family list as one: when a father's or mother's name is wider than
 * its card, all the names set a little smaller together (`--names-fit` on the list), so no
 * name breaks inside and both sides still match. Only past the smallest size may they wrap.
 * Returns the ref for the list.
 */
export function useNamesFit<T extends HTMLElement>(key: unknown) {
  const list = useRef<T>(null);
  useLayoutEffect(() => {
    const outer = list.current;
    if (!outer) return;
    const measure = () => {
      // Each name at full size and on one line, to see how much room it wants
      outer.style.setProperty("--names-fit", "1");
      delete outer.dataset.namesWrap;
      let fit = 1;
      for (const person of outer.querySelectorAll<HTMLElement>("[data-person]")) {
        const room = person.closest("dd")?.clientWidth ?? 0;
        if (room > 0 && person.scrollWidth > room) fit = Math.min(fit, room / person.scrollWidth);
      }
      const shown = Math.max(NAMES_FIT_MIN, Math.floor(fit * 100) / 100);
      outer.style.setProperty("--names-fit", String(shown));
      if (fit < NAMES_FIT_MIN) outer.dataset.namesWrap = "true";
      else delete outer.dataset.namesWrap;
    };
    measure();
    // Only a change of width can change the fit; the list's own height follows the fit
    let width = outer.clientWidth;
    const observer = new ResizeObserver(() => {
      if (outer.clientWidth === width) return;
      width = outer.clientWidth;
      measure();
    });
    observer.observe(outer);
    void document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [key]);
  return list;
}

/**
 * People's names, each kept whole on its line: two people share a line when they fit, else
 * the second starts its own line at the "&" (or "एवं", "ও"…), so a father's or mother's
 * name never runs over several lines. The list's `useNamesFit` sizes them.
 */
function People({ names, className }: { names: string; className: string }) {
  if (!isPeople(names))
    return <span className={cn("text-balance break-words", className)}>{names}</span>;
  return (
    <span className={cn("text-balance break-words", className)}>
      <span className="text-[length:calc(1em*var(--names-fit,1))]">
        {splitPeople(names).map(({ joiner, person }, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span
              data-person
              className="inline-block max-w-full whitespace-nowrap in-data-[names-wrap]:whitespace-normal"
            >
              {joiner && <span className="text-accent-text">{joiner} </span>}
              {person}
            </span>
          </Fragment>
        ))}
      </span>
    </span>
  );
}

/**
 * A family block's words under its heading. A side's parents are set as a name of their
 * own: "Son of" small above, each parent kept whole on a line (breaking at the "&"), and
 * the home town small beneath, so a long pair of names never wraps mid-name. Blessings,
 * a line in memory and the hosts are names too, kept whole the same way.
 */
export function FamilyWords({
  block,
  className,
  soft,
}: {
  block: FamilyBlock;
  /** The names' (or plain words') own size and face. */
  className: string;
  /** The colour of the small words round the names. */
  soft: string;
}) {
  const { parts } = block;
  if (!parts) {
    return NAME_BLOCKS.includes(block.id) ? (
      <dd className="flex w-full flex-col items-center">
        <People names={block.text} className={className} />
      </dd>
    ) : (
      <dd className={cn("text-balance break-words", className)}>{block.text}</dd>
    );
  }
  // Slanted and spaced-out letters suit Latin; Indic scripts keep their own shapes
  const latin = !block.lang || block.lang === "en";
  return (
    <dd className="flex w-full flex-col items-center gap-1">
      {parts.lead && <span className={cn("text-sm", latin && "italic", soft)}>{parts.lead}</span>}
      <People names={parts.names} className={className} />
      {parts.tail && <span className={cn("text-sm", soft)}>{parts.tail}</span>}
      {parts.place && (
        <span
          className={cn("text-sm", latin && "font-label text-xs tracking-[0.2em] uppercase", soft)}
        >
          {parts.place}
        </span>
      )}
    </dd>
  );
}
