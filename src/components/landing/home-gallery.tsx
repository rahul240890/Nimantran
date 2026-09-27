import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { DesignCard } from "@/components/gallery/design-card";
import { designWords } from "@/components/gallery/design-words";
import { OccasionTile } from "@/components/gallery/occasion-tile";
import { Button } from "@/components/ui/button";
import { galleryText } from "@/i18n/copy/gallery";
import { landingText } from "@/i18n/copy/landing";
import type { UiLocale } from "@/i18n/locales";
import { cn } from "@/lib/cn";
import {
  OCCASIONS,
  PAINTED_SUITES,
  designHref,
  paintedDesign,
  suiteOccasion,
} from "@/lib/gallery/catalog";
import { pagePath } from "@/lib/seo/paths";
import { Section } from "./section";

/**
 * The home page's way in (Step 12g): a search that opens the gallery, the wedding journey's
 * occasions as paintings, and the occasions coming next.
 */
export function HomeOccasions({ locale }: { locale: UiLocale }) {
  const { homeGallery } = landingText[locale];
  const { galleryCopy, occasionTaglines } = galleryText[locale];
  const gallery = pagePath({ kind: "gallery" }, locale);
  const wedding = OCCASIONS.filter((occasion) => occasion.section === "wedding");
  const beyond = OCCASIONS.filter((occasion) => occasion.section !== "wedding");
  // Each painting once: occasions sharing one (a baby shower and a naming ceremony) show the
  // first. Live occasions lead, then the paintings of those still to come.
  const painted = beyond
    .filter(
      (occasion, index) =>
        occasion.tile && beyond.findIndex((other) => other.tile === occasion.tile) === index,
    )
    .sort((a, b) => Number(Boolean(b.category)) - Number(Boolean(a.category)));
  const soon = beyond
    .filter((occasion) => !occasion.category && !painted.includes(occasion))
    .slice(0, 10);
  const other = locale === "en" ? "hi" : "en";

  return (
    <Section
      id="occasions"
      eyebrow={homeGallery.occasionsEyebrow}
      title={homeGallery.occasionsTitle}
      intro={homeGallery.occasionsIntro}
    >
      <div className="flex flex-col gap-10">
        {/* A plain form, so searching works before the page's scripts have loaded */}
        <form
          role="search"
          action={gallery}
          method="get"
          className="mx-auto flex w-full max-w-2xl items-center gap-2 rounded-full border border-line-control bg-surface p-1.5 ps-5 shadow-raised focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/35"
        >
          <Search aria-hidden className="size-5 shrink-0 text-ink-muted" />
          <label htmlFor="home-search" className="sr-only">
            {homeGallery.searchLabel}
          </label>
          <input
            id="home-search"
            name="q"
            type="search"
            placeholder={homeGallery.searchPlaceholder}
            autoComplete="off"
            enterKeyHint="search"
            className="h-11 min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-faint [&::-webkit-search-cancel-button]:hidden"
          />
          <Button type="submit" size="sm" className="rounded-full max-[359px]:px-3">
            {homeGallery.search}
          </Button>
        </form>

        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {wedding.map((occasion, index) => (
            <li
              key={occasion.id}
              className={cn("reveal-on-scroll", index === 0 && "col-span-2 row-span-2")}
            >
              <OccasionTile
                occasion={occasion}
                name={occasion.names[locale]}
                otherName={{ text: occasion.names[other], lang: other }}
                tagline={occasionTaglines[occasion.id] ?? ""}
                href={pagePath({ kind: "occasion", id: occasion.category! }, locale)}
                soonLabel={galleryCopy.soon}
                feature={index === 0}
              />
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-center gap-5 text-center">
          <h3 className="font-label text-xs tracking-[0.24em] text-ink-muted uppercase">
            {homeGallery.moreHeading}
          </h3>
          <ul className="grid w-full grid-cols-2 gap-3 text-start sm:grid-cols-3 sm:gap-4 lg:grid-cols-7">
            {painted.slice(0, 7).map((occasion, index) => (
              // Six fill two or three even rows on smaller screens; the seventh joins at full width
              <li
                key={occasion.id}
                className={cn("reveal-on-scroll", index === 6 && "hidden lg:block")}
              >
                <OccasionTile
                  occasion={occasion}
                  name={occasion.names[locale]}
                  otherName={null}
                  tagline=""
                  href={
                    occasion.category
                      ? pagePath({ kind: "occasion", id: occasion.category }, locale)
                      : null
                  }
                  soonLabel={galleryCopy.soon}
                  compact
                />
              </li>
            ))}
          </ul>
          <p className="pt-2 font-label text-xs tracking-[0.24em] text-ink-muted uppercase">
            {homeGallery.soonHeading}
          </p>
          <ul className="flex flex-wrap justify-center gap-2">
            {soon.map((occasion) => (
              <li
                key={occasion.id}
                className="inline-flex min-h-11 items-center rounded-full border border-line bg-surface px-4 text-sm text-ink-muted"
              >
                {occasion.names[locale]}
              </li>
            ))}
          </ul>
          <Button asChild variant="secondary">
            <Link href={gallery}>
              {homeGallery.allOccasions}
              <ArrowRight aria-hidden className="rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}

/** Every painted theme, each opening into all its pages. */
export function HomeThemes({ locale }: { locale: UiLocale }) {
  const { homeGallery } = landingText[locale];
  return (
    <Section
      id="templates"
      eyebrow={homeGallery.themesEyebrow}
      title={homeGallery.themesTitle}
      intro={homeGallery.themesIntro}
    >
      <div className="flex flex-col items-center gap-8">
        {/* A row that scrolls sideways, so seven themes never leave a gap in a grid */}
        <ul className="-mx-4 flex w-[calc(100%+2rem)] snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:w-[calc(100%+3rem)] sm:scroll-px-6 sm:gap-4 sm:px-6 lg:mx-0 lg:w-full lg:scroll-px-0 lg:px-0">
          {PAINTED_SUITES.map((suite) => {
            const design = paintedDesign(suite);
            const { name, description } = designWords(design, locale);
            return (
              <li key={suite} className="w-[68%] shrink-0 snap-start sm:w-[38%] lg:w-[23.5%]">
                <DesignCard
                  design={design}
                  name={name}
                  description={description}
                  href={designHref(design, { category: suiteOccasion(suite) })}
                />
              </li>
            );
          })}
        </ul>
        <Button asChild variant="secondary">
          <Link href={`${pagePath({ kind: "occasion", id: "wedding" }, locale)}#designs`}>
            {homeGallery.allDesigns}
            <ArrowRight aria-hidden className="rtl:rotate-180" />
          </Link>
        </Button>
      </div>
    </Section>
  );
}
