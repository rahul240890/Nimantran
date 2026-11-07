"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { DesignNames } from "@/components/gallery/design-name";
import { DesignNamesProvider } from "@/components/gallery/design-names";
import { ShelfRow, type Covers } from "@/components/gallery/shelf-row";
import { NO_FILTERS, designCatalog } from "@/lib/gallery/filters";
import { sectionOccasion, type HomeSectionId } from "@/lib/gallery/home-sections";
import {
  parseRecent,
  recentServerSnapshot,
  recentSnapshot,
  subscribeRecent,
} from "@/lib/gallery/recent";

/**
 * One section as the server set it out: its words, View all, and the designs it shows in
 * order (home-fill.ts: the admin's choices, or Royal and Signature designs first, and no
 * design in two sections).
 */
export type HomeSection = {
  id: HomeSectionId;
  title: string;
  intro: string;
  href: string;
  /** Designs to show, in order. */
  designs: string[];
  /** Shows all of them on every screen (Trending, Best sellers, the wedding, the engagement). */
  fixed: boolean;
  /** The number View all names: the occasion's designs, or every design. */
  total: number;
};

/** The home page's sections of designs (home-sections.ts), each a grid that ends in View all. */
export function HomeShelves({
  sections,
  covers,
  names,
  recent,
}: {
  sections: readonly HomeSection[];
  covers: Covers;
  /** The designs' names in the page's language (design-names.tsx). */
  names: DesignNames;
  /** Recently viewed's words: the designs this browser opened lately, shown first. */
  recent: { title: string; intro: string };
}) {
  const byId = useMemo(() => new Map(designCatalog().map((entry) => [entry.design.id, entry])), []);
  // Read after the page is drawn, so the server's page and the browser's first one match
  const stored = useSyncExternalStore(subscribeRecent, recentSnapshot, recentServerSnapshot);
  const viewed = useMemo(
    () => parseRecent(stored).flatMap((id) => byId.get(id) ?? []),
    [stored, byId],
  );

  return (
    <DesignNamesProvider names={names}>
      {viewed.length > 0 && (
        <ShelfRow
          id="home-recent"
          title={recent.title}
          intro={recent.intro}
          entries={viewed}
          total={viewed.length}
          covers={covers}
          priority={false}
          layout="grid"
          every
        />
      )}
      {sections.map((section, index) => {
        const shown = section.designs.flatMap((id) => byId.get(id) ?? []);
        if (shown.length === 0) return null;
        return (
          <ShelfRow
            key={section.id}
            id={`home-${section.id}`}
            title={section.title}
            intro={section.intro}
            href={section.href}
            entries={shown}
            total={section.total}
            covers={covers}
            priority={false}
            // Only the first section's paintings come with the page; each other as it nears
            lazy={index > 0}
            layout="grid"
            every={section.fixed}
            // Trending and Best sellers open a design for a wedding when it suits one
            filters={{ ...NO_FILTERS, occasion: sectionOccasion(section.id) ?? "wedding" }}
          />
        );
      })}
    </DesignNamesProvider>
  );
}
