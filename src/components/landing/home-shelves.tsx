"use client";

import Image from "next/image";
import { Tabs as TabsPrimitive } from "radix-ui";
import { useMemo, useState } from "react";
import { ShelfRow, TraditionTiles, type Covers } from "@/components/gallery/shelf-row";
import { TrendingRow } from "@/components/gallery/trending-row";
import { useLocale, useText } from "@/i18n/client";
import { galleryText } from "@/i18n/copy/gallery";
import { CATEGORIES } from "@/lib/categories/catalog";
import { occasionTile } from "@/lib/gallery/catalog";
import { designCatalog } from "@/lib/gallery/filters";
import { SHELVES, shelfEntries, shelfHref, type Shelf } from "@/lib/gallery/shelves";

/**
 * The Designs page's rows on the home page, with the same names and View all links:
 * for the wedding, the traditions and a row for each kind of photo; for other
 * celebrations, one row with a tab per occasion, so the page stays short.
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
  const rows: { shelf: Shelf; title: string; intro: string }[] =
    group === "wedding"
      ? [
          // The moving scenes lead the wedding rows
          ...SHELVES.flatMap((shelf) =>
            shelf.kind === "format" && shelf.value === "moving"
              ? [{ shelf, ...shelfCopy.format.moving }]
              : [],
          ),
          ...SHELVES.flatMap((shelf) =>
            shelf.kind === "photos" ? [{ shelf, ...shelfCopy.photos[shelf.value] }] : [],
          ),
        ]
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

  if (group === "occasion") {
    return <OccasionTabs rows={rows} entries={entries} designsPath={designsPath} covers={covers} />;
  }

  return (
    <>
      <TraditionTiles
        designsPath={designsPath}
        headingId="home-traditions"
        eager={false}
        level={3}
      />
      <TrendingRow id="home-trending" covers={covers} entries={entries} />
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

/**
 * The other celebrations as tabs over one row: each tab a round painting and the occasion's
 * name, the row under them showing that occasion's designs and its View all.
 */
function OccasionTabs({
  rows,
  entries,
  designsPath,
  covers,
}: {
  rows: { shelf: Shelf; title: string; intro: string }[];
  entries: ReturnType<typeof designCatalog>;
  designsPath: string;
  covers: Covers;
}) {
  const [chosen, setChosen] = useState(rows[0]?.shelf.id ?? "");
  return (
    <TabsPrimitive.Root value={chosen} onValueChange={setChosen} className="flex flex-col gap-8">
      <TabsPrimitive.List
        aria-labelledby="more-title"
        className="-mx-4 scrollbar-none flex snap-x gap-2 overflow-x-auto px-4 py-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-wrap lg:justify-start lg:px-0"
      >
        {rows.map(({ shelf, title }) => {
          const tile = shelf.kind === "occasion" ? occasionTile(shelf.value) : null;
          return (
            <TabsPrimitive.Trigger
              key={shelf.id}
              value={shelf.id}
              data-occasion-tab={shelf.value}
              className="group/tab inline-flex min-h-12 shrink-0 cursor-pointer snap-start items-center gap-2.5 rounded-full border border-line bg-surface py-1 ps-1 pe-5 text-[0.95rem] font-semibold whitespace-nowrap text-ink-muted shadow-raised transition-[background-color,border-color,color,box-shadow] duration-200 hover:border-line-strong hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[state=active]:border-marigold data-[state=active]:bg-marigold/15 data-[state=active]:text-ink data-[state=active]:shadow-float motion-still:transition-none"
            >
              <span className="relative block size-10 shrink-0 overflow-hidden rounded-full bg-night ring-2 ring-surface transition-[box-shadow] group-data-[state=active]/tab:ring-marigold">
                {tile && <Image src={tile} alt="" fill sizes="2.5rem" className="object-cover" />}
              </span>
              {title}
            </TabsPrimitive.Trigger>
          );
        })}
      </TabsPrimitive.List>
      {rows.map(({ shelf, title, intro }) => {
        const { shown, total } = shelfEntries(entries, shelf);
        return (
          <TabsPrimitive.Content
            key={shelf.id}
            value={shelf.id}
            className="animate-fade-in rounded-xl outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring motion-still:animate-none"
          >
            <ShelfRow
              id={`home-${shelf.id}`}
              title={title}
              intro={intro}
              href={shelfHref(shelf, designsPath)}
              entries={shown}
              total={total}
              covers={covers}
              priority={false}
            />
          </TabsPrimitive.Content>
        );
      })}
    </TabsPrimitive.Root>
  );
}
