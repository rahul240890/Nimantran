"use client";

import { useMemo } from "react";
import type { DesignNames } from "@/components/gallery/design-name";
import { DesignNamesProvider } from "@/components/gallery/design-names";
import { ShelfRow, type Covers } from "@/components/gallery/shelf-row";
import type { CategoryId } from "@/lib/categories/catalog";
import { designCatalog, type CatalogEntry } from "@/lib/gallery/filters";
import type { HomeSectionId } from "@/lib/gallery/home-sections";
import { shelfEntries } from "@/lib/gallery/shelves";

/**
 * One section as the server set it out: its words, View all, and either the designs it
 * shows in order (Trending, Best sellers, New designs, or any the admin chose) or the
 * occasion it fills itself from.
 */
export type HomeSection = {
  id: HomeSectionId;
  title: string;
  intro: string;
  href: string;
  /** Designs to show, in order; null fills the section from its occasion. */
  designs: string[] | null;
  occasion: CategoryId | null;
  /** The number View all names: the occasion's designs, or every design. */
  total: number;
};

/**
 * The home page's sections of designs (home-sections.ts), each a grid that ends in View all.
 * A section that fills itself skips designs a section above already shows, so the page
 * doesn't repeat itself; the admin's own choices show as chosen.
 */
export function HomeShelves({
  sections,
  covers,
  names,
}: {
  sections: readonly HomeSection[];
  covers: Covers;
  /** The designs' names in the page's language (design-names.tsx). */
  names: DesignNames;
}) {
  const entries = useMemo(() => designCatalog(), []);
  const filled = useMemo(() => {
    const byId = new Map(entries.map((entry) => [entry.design.id, entry]));
    const seen = new Set<string>();
    return sections.map((section) => {
      let shown: CatalogEntry[];
      let total = section.total;
      if (section.designs) {
        shown = section.designs.flatMap((id) => byId.get(id) ?? []);
      } else if (section.occasion) {
        const result = shelfEntries(
          entries,
          { id: `occasion-${section.occasion}`, kind: "occasion", value: section.occasion },
          seen,
        );
        shown = result.shown;
        total = result.total;
      } else {
        shown = [];
      }
      for (const entry of shown) seen.add(entry.design.id);
      return { shown, total };
    });
  }, [entries, sections]);

  return (
    <DesignNamesProvider names={names}>
      {sections.map((section, index) => {
        const { shown, total } = filled[index]!;
        if (shown.length === 0) return null;
        return (
          <ShelfRow
            key={section.id}
            id={`home-${section.id}`}
            title={section.title}
            intro={section.intro}
            href={section.href}
            entries={shown}
            total={total}
            covers={covers}
            priority={false}
            // Only the first section's paintings come with the page; each other as it nears
            lazy={index > 0}
            layout="grid"
          />
        );
      })}
    </DesignNamesProvider>
  );
}
