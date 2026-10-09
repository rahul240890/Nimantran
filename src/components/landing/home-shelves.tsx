"use client";

import { useMemo } from "react";
import { ShelfRow, TraditionTiles, type Covers } from "@/components/gallery/shelf-row";
import { useLocale, useText } from "@/i18n/client";
import { galleryText } from "@/i18n/copy/gallery";
import { CATEGORIES } from "@/lib/categories/catalog";
import { designCatalog } from "@/lib/gallery/filters";
import { SHELVES, shelfEntries, shelfHref } from "@/lib/gallery/shelves";

/**
 * The Designs page's rows on the home page, with the same names and View all links:
 * for the wedding, the traditions and a row for each kind of photo; for other
 * celebrations, a row per occasion.
 */
export function HomeShelves({
  designsPath,
  group,
  covers,
}: {
  designsPath: string;
  group: "wedding" | "occasion";
  covers: Covers;
}) {
  const locale = useLocale();
  const { shelfCopy, occasionTaglines } = useText(galleryText);
  const entries = useMemo(() => designCatalog(), []);
  const rows =
    group === "wedding"
      ? SHELVES.flatMap((shelf) =>
          shelf.kind === "photos" ? [{ shelf, ...shelfCopy.photos[shelf.value] }] : [],
        )
      : SHELVES.flatMap((shelf) =>
          shelf.kind === "occasion"
            ? [
                {
                  shelf,
                  title: CATEGORIES[shelf.value].names[locale],
                  intro: occasionTaglines[shelf.value] ?? "",
                },
              ]
            : [],
        );

  return (
    <>
      {group === "wedding" && (
        <TraditionTiles
          designsPath={designsPath}
          headingId="home-traditions"
          eager={false}
          level={3}
        />
      )}
      {rows.map(({ shelf, title, intro }) => {
        const { shown, total } = shelfEntries(entries, shelf);
        return (
          <ShelfRow
            key={shelf.id}
            id={`home-${shelf.id}`}
            title={title}
            intro={intro}
            href={shelfHref(shelf, designsPath)}
            entries={shown}
            total={total}
            covers={covers}
            priority={false}
          />
        );
      })}
    </>
  );
}
