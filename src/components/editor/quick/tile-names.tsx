"use client";

import { useSyncExternalStore } from "react";
import { inviteDraft } from "@/lib/editor/store";
import type { SuiteId } from "@/lib/suites/catalog";

/** The couple's names as the draft has them, "Kabir & Meera", or nothing yet. */
function draftNames(): string {
  const { first, second } = inviteDraft.get().draft.content;
  return [first, second]
    .map((name) => name?.trim())
    .filter(Boolean)
    .join(" & ");
}

/**
 * One of the family's names as the draft has it, for a card design's cover, or the cover's
 * own sample until it is typed (and on the server, which hasn't the draft).
 */
export function DraftName({ slot, sample }: { slot: "first" | "second"; sample: string }) {
  return useSyncExternalStore(
    inviteDraft.subscribe,
    () => inviteDraft.get().draft.content[slot]?.trim() || sample,
    () => sample,
  );
}

/**
 * The family's own names over another design's painting (owner, 2026-10-25), so each one
 * reads as their invitation in it: printed as its pages print words, in the design's own
 * colours, dark on a light middle or light on a night one, with a soft haze behind on busy
 * art. Nothing until names are typed, and nothing on the server, which hasn't the draft.
 */
export function TileNames({ suite, tone }: { suite: SuiteId; tone: "light" | "dark" }) {
  const names = useSyncExternalStore(inviteDraft.subscribe, draftNames, () => "");
  if (!names) return null;
  return (
    <span
      aria-hidden
      data-suite={suite}
      data-tone={tone}
      className="story-print scene-print story-print-haze pointer-events-none absolute inset-x-[16%] top-[30%] px-[4%] py-[6%] text-center font-card-display text-[clamp(0.8rem,9cqw,1.15rem)] leading-tight text-balance break-words text-card-ink"
    >
      {names}
    </span>
  );
}
