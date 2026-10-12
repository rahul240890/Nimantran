import { Fragment } from "react";
import { cn } from "@/lib/cn";
import type { FamilyParts } from "@/lib/engine/story";

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

/**
 * A family block's words under its heading. A side's parents are set as a name of their
 * own: "Son of" small above, each parent kept whole on a line (breaking at the "&"), and
 * the home town small beneath, so a long pair of names never wraps mid-name.
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
  if (!parts) return <dd className={cn("text-balance break-words", className)}>{block.text}</dd>;
  const people = parts.names.split(/\s+&\s+/);
  // Slanted and spaced-out letters suit Latin; Indic scripts keep their own shapes
  const latin = !block.lang || block.lang === "en";
  return (
    <dd className="flex flex-col items-center gap-1">
      {parts.lead && <span className={cn("text-sm", latin && "italic", soft)}>{parts.lead}</span>}
      <span className={cn("text-balance break-words", className)}>
        {people.map((person, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span className="inline-block max-w-full">
              {i > 0 && <span className="text-accent-text">&amp; </span>}
              {person}
            </span>
          </Fragment>
        ))}
      </span>
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
