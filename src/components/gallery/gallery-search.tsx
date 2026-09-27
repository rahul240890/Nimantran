"use client";

import { Search, X } from "lucide-react";
import { useDeferredValue, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { useLocale, useText } from "@/i18n/client";
import { galleryText } from "@/i18n/copy/gallery";
import { pagePath } from "@/lib/seo/paths";
import { WEDDING_KIND_ENTRIES, occasionById, suiteImage, designHref } from "@/lib/gallery/catalog";
import { searchGallery, type SearchHit } from "@/lib/gallery/search";
import { DesignCard } from "./design-card";
import { designWords, searchWords } from "./design-words";
import { OccasionTile, PaintedTile } from "./occasion-tile";

/** Quick searches under the box, for hosts who would rather tap than type. */
const SUGGESTIONS = {
  en: ["Gujarati wedding", "Haldi", "Sangeet", "Bengali", "Nikah", "Birthday"],
  hi: ["गुजराती शादी", "हल्दी", "संगीत", "बंगाली", "निकाह", "जन्मदिन"],
} as const;

/**
 * The gallery's search box. While it is empty the occasions (children) show; once the host
 * types, matching occasions, wedding kinds and designs replace them, as they type.
 */
const noSubscribe = () => () => {};

/** A search passed in the address (/invitations?q=haldi), from the home page's search box. */
function useAddressQuery(): string {
  return useSyncExternalStore(
    noSubscribe,
    () => new URLSearchParams(window.location.search).get("q") ?? "",
    () => "",
  );
}

export function GallerySearch({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const { galleryCopy } = useText(galleryText);
  const fromAddress = useAddressQuery();
  const [typed, setQuery] = useState<string | null>(null);
  const query = typed ?? fromAddress;
  const deferred = useDeferredValue(query);
  const words = useMemo(() => searchWords(), []);
  const hits = useMemo(() => searchGallery(deferred, words), [deferred, words]);
  const searching = deferred.trim().length > 0;

  const places = hits.filter((hit) => hit.type !== "design");
  const designs = hits.flatMap((hit) => (hit.type === "design" ? [hit.design] : []));
  const other = locale === "en" ? "hi" : "en";

  return (
    <>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 sm:px-6 lg:px-8">
        <form
          role="search"
          onSubmit={(event) => event.preventDefault()}
          className="relative flex items-center"
        >
          <label htmlFor="gallery-search" className="sr-only">
            {galleryCopy.searchLabel}
          </label>
          <Search
            aria-hidden
            className="pointer-events-none absolute start-5 size-5 text-ink-muted"
          />
          <input
            id="gallery-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={galleryCopy.searchPlaceholder}
            autoComplete="off"
            enterKeyHint="search"
            className="h-14 w-full rounded-full border border-line-control bg-surface ps-13 pe-14 text-lg text-ink shadow-raised transition-shadow outline-none placeholder:text-ink-faint focus-visible:border-ring focus-visible:shadow-float focus-visible:ring-2 focus-visible:ring-ring/35 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={galleryCopy.clearSearch}
              className="absolute end-1.5 grid size-11 cursor-pointer place-items-center rounded-full text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-ring"
            >
              <X aria-hidden className="size-5" />
            </button>
          )}
        </form>
        <ul className="flex flex-wrap gap-2">
          {SUGGESTIONS[locale].map((word) => (
            <li key={word}>
              <button
                type="button"
                onClick={() => setQuery(word)}
                className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line bg-surface px-4 text-sm text-ink-muted transition-colors hover:border-line-strong hover:text-ink focus-visible:outline-2 focus-visible:outline-ring"
              >
                {word}
              </button>
            </li>
          ))}
        </ul>
        <p aria-live="polite" className="sr-only">
          {searching ? galleryCopy.results(hits.length) : ""}
        </p>
      </div>

      {searching ? (
        <section
          aria-label={galleryCopy.results(hits.length)}
          className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pt-8 pb-16 sm:px-6 lg:px-8"
        >
          {hits.length === 0 && <p className="text-lg text-ink-muted">{galleryCopy.noResults}</p>}
          {places.length > 0 && (
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {places.map((hit) => (
                <li key={`${hit.type}-${hit.id}`}>
                  <PlaceResult hit={hit} locale={locale} other={other} />
                </li>
              ))}
            </ul>
          )}
          {designs.length > 0 && (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
              {designs.map((design) => {
                const { name, description } = designWords(design, locale);
                return (
                  <li key={design.id}>
                    <DesignCard
                      design={design}
                      name={name}
                      description={description}
                      href={designHref(design, { category: "wedding" })}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      ) : (
        children
      )}
    </>
  );
}

/** An occasion or wedding kind the search found, as its tile. */
function PlaceResult({
  hit,
  locale,
  other,
}: {
  hit: Exclude<SearchHit, { type: "design" }>;
  locale: "en" | "hi";
  other: "en" | "hi";
}) {
  const { galleryCopy, occasionTaglines, weddingKindCopy } = useText(galleryText);
  if (hit.type === "kind") {
    const entry = WEDDING_KIND_ENTRIES[hit.id];
    return (
      <PaintedTile
        href={pagePath({ kind: "wedding-kind", id: hit.id }, locale)}
        image={suiteImage(entry.art.suite, entry.art.page) ?? ""}
        name={weddingKindCopy[hit.id].name}
        otherName={entry.nativeName}
        tagline={galleryCopy.resultKinds.kind}
        data-kind={hit.id}
      />
    );
  }
  const occasion = occasionById(hit.id)!;
  return (
    <OccasionTile
      occasion={occasion}
      name={occasion.names[locale]}
      otherName={{ text: occasion.names[other], lang: other }}
      tagline={occasionTaglines[occasion.id] ?? ""}
      href={
        occasion.category ? pagePath({ kind: "occasion", id: occasion.category }, locale) : null
      }
      soonLabel={galleryCopy.soon}
    />
  );
}
