"use client";

import { Image } from "@/components/ui/image";
import Link from "next/link";
import { useText } from "@/i18n/client";
import { galleryText } from "@/i18n/copy/gallery";
import { ScrollRow } from "@/components/ui/scroll-row";
import { cn } from "@/lib/cn";
import { suiteImage } from "@/lib/gallery/catalog";
import { COLLECTIONS, COLLECTION_IDS, type CollectionGroup } from "@/lib/gallery/collections";
import type { CatalogEntry } from "@/lib/gallery/filters";
import { shelfHref } from "@/lib/gallery/shelves";
import type { Covers } from "./shelf-row";

const GROUPS = ["wedding", "celebration"] as const satisfies readonly CollectionGroup[];

/**
 * The collections as painted tiles, wedding collections first, each opening its View all.
 * A strip that scrolls sideways on a phone, a grid of two rows per group on a wide screen.
 * The header's Collections link lands here (#collections).
 */
export function CollectionTiles({
  entries,
  covers,
  designsPath,
}: {
  entries: readonly CatalogEntry[];
  covers: Covers;
  designsPath: string;
}) {
  const { collectionCopy, catalogCopy, shelfCopy } = useText(galleryText);
  const counts = new Map<string, number>();
  for (const entry of entries)
    counts.set(entry.collection, (counts.get(entry.collection) ?? 0) + 1);

  return (
    <section
      id="collections"
      tabIndex={-1}
      aria-labelledby="collections-heading"
      className="flex scroll-mt-24 flex-col gap-5 outline-none"
    >
      <div className="flex flex-col gap-1">
        <h2 id="collections-heading" className="font-display text-2xl sm:text-[1.5rem]">
          {collectionCopy.heading}
        </h2>
        <p className="text-sm text-ink-muted">{collectionCopy.intro}</p>
      </div>
      {GROUPS.map((group) => {
        const ids = COLLECTION_IDS.filter((id) => COLLECTIONS[id].group === group);
        return (
          <div key={group} className="flex flex-col gap-2">
            <h3 className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase">
              {collectionCopy.groups[group]}
            </h3>
            <ScrollRow
              labels={shelfCopy}
              className={cn(
                "relative -mx-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:grid lg:gap-4 lg:overflow-visible lg:px-0",
                ids.length > 8 ? "lg:grid-cols-5" : "lg:grid-cols-4",
              )}
            >
              {ids.map((id) => {
                const { cover } = COLLECTIONS[id];
                const words = collectionCopy.names[id];
                return (
                  <li
                    key={id}
                    data-collection={id}
                    className="w-40 shrink-0 snap-start sm:w-48 lg:w-auto"
                  >
                    <Link
                      href={shelfHref(
                        { id: `collection-${id}`, kind: "collection", value: id },
                        designsPath,
                      )}
                      className="group flex h-full flex-col gap-2 rounded-xl outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      <span className="relative block aspect-[4/5] overflow-hidden rounded-xl border border-line bg-night shadow-raised transition-[border-color] group-hover:border-marigold">
                        {"suite" in cover ? (
                          <Image
                            src={suiteImage(cover.suite, "cover") ?? ""}
                            alt=""
                            fill
                            sizes="(min-width: 64rem) 20vw, 12rem"
                            className="object-cover object-top transition-transform duration-700 ease-out-expo group-hover:scale-[1.05] motion-still:transition-none motion-still:group-hover:scale-100"
                          />
                        ) : (
                          <span className="absolute inset-0 grid place-items-center bg-surface-2 p-[14%] pb-[30%]">
                            {covers[cover.template]}
                          </span>
                        )}
                        {/* A shade at the foot keeps the name readable on any painting */}
                        <span
                          aria-hidden
                          className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-night/85 via-night/40 to-transparent"
                        />
                        <span className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-3">
                          <span className="font-label text-[0.6rem] tracking-[0.18em] text-card-ivory/80 uppercase">
                            {collectionCopy.label}
                          </span>
                          <span className="font-display text-lg leading-tight text-card-ivory">
                            {words.name}
                          </span>
                        </span>
                      </span>
                      <span className="flex flex-col gap-0.5 px-0.5">
                        <span className="line-clamp-2 text-sm leading-snug text-ink-muted">
                          {words.intro}
                        </span>
                        <span className="text-xs font-semibold text-accent-text">
                          {catalogCopy.count(counts.get(id) ?? 0)}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ScrollRow>
          </div>
        );
      })}
    </section>
  );
}
