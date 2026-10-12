"use client";

import { useMemo } from "react";
import { useText } from "@/i18n/client";
import { galleryText } from "@/i18n/copy/gallery";
import { designCatalog, type CatalogEntry } from "@/lib/gallery/filters";
import { ShelfRow, type Covers } from "./shelf-row";
import { useTrending } from "./use-trending";

/** The trending designs as a row, on the home page and the Designs page. */
export function TrendingRow({
  id,
  covers,
  entries,
}: {
  id: string;
  covers: Covers;
  /** The catalogue, when the page already has it. */
  entries?: readonly CatalogEntry[];
}) {
  const { shelfCopy } = useText(galleryText);
  const trending = useTrending();
  const all = useMemo(() => entries ?? designCatalog(), [entries]);
  const shown = useMemo(() => {
    const byId = new Map(all.map((entry) => [entry.design.id, entry]));
    return trending.flatMap((designId) => byId.get(designId) ?? []);
  }, [all, trending]);
  if (shown.length === 0) return null;
  return (
    <ShelfRow
      id={id}
      title={shelfCopy.trending.title}
      intro={shelfCopy.trending.intro}
      entries={shown}
      total={shown.length}
      covers={covers}
      priority={false}
    />
  );
}
