"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { GuestLook } from "@/lib/suites/guest-look";
import { FlowerFrame, Garland } from "../flowers";
import { Bunting, Festoon, PalaceSkyline } from "../scenery";
import { useInView } from "../use-in-view";

/*
 * The pieces every section of the themed guest page is built from: its heading, its
 * entrance, the frame a picture hangs in, and the scenery at its head and foot.
 */

const noSubscribe = () => () => {};
/** True in the browser once hydrated: sections wait to play their entrance only there. */
export const useMounted = () =>
  useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );

export type Music = { playing: boolean; toggle: () => void };

/** A section's small label, a flower and its title. */
export function Heading({
  id,
  lang,
  label,
  title,
}: {
  id?: string;
  lang: string;
  label: string;
  title: string;
}) {
  return (
    <div lang={lang} className="flex flex-col items-center gap-2 text-center">
      <p className="font-label text-xs tracking-[0.3em] text-accent-text uppercase">{label}</p>
      <h2
        id={id}
        className="font-display text-[2rem] leading-tight text-balance break-words text-ink sm:text-[2.75rem]"
      >
        {title}
      </h2>
      <span aria-hidden className="guest-rule" />
    </div>
  );
}

/** Plays its entrance (the style's own, in globals.css) once scrolled into view. */
export function Reveal({ className, children }: { className?: string; children: ReactNode }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  const mounted = useMounted();
  return (
    <div
      ref={ref}
      data-reveal={mounted ? (seen ? "in" : "wait") : undefined}
      className={cn("guest-reveal", className)}
    >
      {children}
    </div>
  );
}

/** The frame a photo or painting hangs in: an arch in a palace, an oval by the water. */
export function Framed({
  look,
  children,
  className,
}: {
  look: GuestLook;
  children: ReactNode;
  className?: string;
}) {
  const shape = look.style === "garden" || look.style === "party" ? "ring" : "arch";
  return (
    <div className={cn("relative", className)}>
      <div data-shape={shape} className="guest-frame relative aspect-[4/5] overflow-hidden">
        {children}
      </div>
      <FlowerFrame shape={shape} flower={look.flower} second={look.secondFlower} />
    </div>
  );
}

/** The scenery along the foot of a section: water, a skyline, or nothing at a party. */
export function Ground({ look, className }: { look: GuestLook; className?: string }) {
  if (look.style === "garden") return <span aria-hidden className={cn("guest-water", className)} />;
  if (look.style === "party") return null;
  return <PalaceSkyline className={cn("guest-skyline", className)} />;
}

/**
 * What hangs between the hours: a garland in a palace, mirror-work bunting on a
 * procession, a kasavu border by the water, coloured bulbs at a party.
 */
export function Divider({ look }: { look: GuestLook }) {
  if (look.style === "garden")
    return <span aria-hidden className="guest-kasavu absolute inset-x-0 top-0" />;
  if (look.style === "procession")
    return <Bunting className="guest-garland absolute inset-x-0 top-0 h-12 w-full sm:h-16" />;
  if (look.style === "party")
    return <Festoon className="guest-festoon absolute inset-x-0 top-0 h-10 w-full sm:h-14" />;
  return (
    <Garland
      flower={look.flower}
      second={look.secondFlower}
      swags={8}
      className="guest-garland absolute inset-x-0 top-0 h-14 w-full sm:h-20"
    />
  );
}
