"use client";

import { useMemo } from "react";
import type { DesignNames } from "@/components/gallery/design-name";
import { DesignNamesProvider } from "@/components/gallery/design-names";
import { ShelfRow, type Covers } from "@/components/gallery/shelf-row";
import { TrendingRow } from "@/components/gallery/trending-row";
import type { CategoryId } from "@/lib/categories/catalog";
import { designCatalog } from "@/lib/gallery/filters";
import { shelfEntries } from "@/lib/gallery/shelves";

/** One occasion's row: its name, its line, and its own page for View all. */
export type HomeRow = { occasion: CategoryId; title: string; intro: string; href: string };

/**
 * The home page's rows of designs: the wedding's first, then the ones hosts are choosing
 * most, then a row for each other main occasion. Each scrolls sideways, with View all
 * opening that occasion's page.
 */
export function HomeShelves({
  rows,
  covers,
  names,
}: {
  rows: readonly HomeRow[];
  covers: Covers;
  /** The designs' names in the page's language (design-names.tsx). */
  names: DesignNames;
}) {
  const entries = useMemo(() => designCatalog(), []);
  const shelf = (row: HomeRow, index: number) => {
    const { shown, total } = shelfEntries(entries, {
      id: `occasion-${row.occasion}`,
      kind: "occasion",
      value: row.occasion,
    });
    return (
      <ShelfRow
        key={row.occasion}
        id={`home-${row.occasion}`}
        title={row.title}
        intro={row.intro}
        href={row.href}
        entries={shown}
        total={total}
        covers={covers}
        priority={false}
        // Only the first row's paintings come with the page; each other as it nears
        lazy={index > 0}
      />
    );
  };
  const [first, ...rest] = rows;
  return (
    <DesignNamesProvider names={names}>
      {first && shelf(first, 0)}
      <TrendingRow id="home-trending" covers={covers} entries={entries} />
      {rest.map((row, index) => shelf(row, index + 1))}
    </DesignNamesProvider>
  );
}
