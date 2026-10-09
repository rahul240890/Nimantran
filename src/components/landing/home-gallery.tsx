import { ArrowRight, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { DesignCard } from "@/components/gallery/design-card";
import { designWords } from "@/components/gallery/design-words";
import { FormatFilter } from "@/components/gallery/format-filter";
import { OccasionTile } from "@/components/gallery/occasion-tile";
import { Button } from "@/components/ui/button";
import { galleryText } from "@/i18n/copy/gallery";
import { landingText } from "@/i18n/copy/landing";
import type { UiLocale } from "@/i18n/locales";
import {
  OCCASIONS,
  designHref,
  paintedDesign,
  sceneDesign,
  suiteOccasion,
  type GalleryDesign,
  type Occasion,
} from "@/lib/gallery/catalog";
import { designPhotos } from "@/lib/gallery/photos";
import type { SuiteId } from "@/lib/suites/catalog";
import { hasScene } from "@/lib/suites/scene";
import { pagePath } from "@/lib/seo/paths";
import { Section } from "./section";

function SubHeading({ children }: { children: string }) {
  return (
    <h3 className="mb-4 font-label text-xs tracking-[0.22em] text-ink-muted uppercase">
      {children}
    </h3>
  );
}

/**
 * The home page's occasions: the wedding's functions, then every other occasion that is ready,
 * each a painting with its name on a plain strip beneath it, and one quiet line for those
 * still being painted.
 */
export function HomeOccasions({ locale }: { locale: UiLocale }) {
  const { homeGallery } = landingText[locale];
  const { galleryCopy, occasionTaglines } = galleryText[locale];
  const gallery = pagePath({ kind: "gallery" }, locale);
  const wedding = OCCASIONS.filter((occasion) => occasion.section === "wedding");
  const more = OCCASIONS.filter((occasion) => occasion.section !== "wedding" && occasion.category);
  const soon = OCCASIONS.filter((occasion) => !occasion.category);
  const other = locale === "en" ? "hi" : "en";
  const tile = (occasion: Occasion, compact = false) => (
    <OccasionTile
      occasion={occasion}
      name={occasion.names[locale]}
      otherName={compact ? null : { text: occasion.names[other], lang: other }}
      tagline={compact ? "" : (occasionTaglines[occasion.id] ?? "")}
      href={pagePath({ kind: "occasion", id: occasion.category! }, locale)}
      soonLabel={galleryCopy.soon}
      compact={compact}
    />
  );

  return (
    <Section
      id="occasions"
      eyebrow={homeGallery.occasionsEyebrow}
      title={homeGallery.occasionsTitle}
      intro={homeGallery.occasionsIntro}
    >
      <div className="flex flex-col gap-12">
        <div>
          <SubHeading>{homeGallery.weddingHeading}</SubHeading>
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {wedding.map((occasion) => (
              <li key={occasion.id} className="reveal-on-scroll">
                {tile(occasion)}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <SubHeading>{homeGallery.moreHeading}</SubHeading>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            {more.map((occasion) => (
              <li key={occasion.id} className="reveal-on-scroll">
                {tile(occasion, true)}
              </li>
            ))}
            <li className="reveal-on-scroll">
              <Link
                href={gallery}
                className="group flex h-full min-h-40 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line-strong bg-surface-2 p-4 text-center outline-offset-3 transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-ring"
              >
                <span className="grid size-12 place-items-center rounded-full bg-surface text-accent-text shadow-raised">
                  <LayoutGrid aria-hidden className="size-5" />
                </span>
                <span className="inline-flex items-center gap-1.5 font-display text-lg leading-tight text-ink">
                  {homeGallery.allOccasions}
                  <ArrowRight
                    aria-hidden
                    className="size-4 text-accent-text transition-transform group-hover:translate-x-0.5 rtl:rotate-180 motion-still:transition-none"
                  />
                </span>
              </Link>
            </li>
          </ul>
          {soon.length > 0 && (
            <p className="mt-5 text-sm leading-relaxed text-ink-muted">
              <span className="font-label text-xs tracking-[0.18em] text-ink uppercase">
                {homeGallery.soonHeading}:
              </span>{" "}
              {soon.map((occasion) => occasion.names[locale]).join(" · ")}
            </p>
          )}
        </div>
      </div>
    </Section>
  );
}

/** Themes the home page shows first: well-loved paintings across traditions and occasions. */
const POPULAR: readonly SuiteId[] = [
  "rajwada-bagh",
  "kayal",
  "noor-bagh",
  "shahi-savari",
  "rajbari",
  "ivory-arch",
  "peshwai-wada",
  "gubbara",
];

/** Eight designs: every Scene among the popular themes (up to four), each beside a Story. */
function popularDesigns(): GalleryDesign[] {
  const scenes = POPULAR.filter(hasScene).slice(0, 4).map(sceneDesign);
  const stories = POPULAR.slice(0, 8 - scenes.length).map(paintedDesign);
  return stories.flatMap((story, index) => (scenes[index] ? [scenes[index], story] : [story]));
}

/** A short pick of designs, with the Scene and Story switch, leading to all of them. */
export function HomeThemes({ locale }: { locale: UiLocale }) {
  const { homeGallery } = landingText[locale];
  const designs = popularDesigns();
  return (
    <Section
      id="templates"
      eyebrow={homeGallery.themesEyebrow}
      title={homeGallery.themesTitle}
      intro={homeGallery.themesIntro}
    >
      <div className="flex flex-col items-center gap-8">
        <div className="w-full">
          <FormatFilter formats={["scene", "story"]}>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {designs.map((design) => {
                const { name, description } = designWords(design, locale);
                return (
                  <li
                    key={design.id}
                    data-format-item={design.format === "scene" ? "scene" : "story"}
                  >
                    <DesignCard
                      design={design}
                      name={name}
                      description={description}
                      href={designHref(design, { category: suiteOccasion(design.suite) })}
                      photos={designPhotos(design, suiteOccasion(design.suite))}
                    />
                  </li>
                );
              })}
            </ul>
          </FormatFilter>
        </div>
        <Button asChild>
          <Link href={pagePath({ kind: "designs" }, locale)}>
            {homeGallery.allDesigns}
            <ArrowRight aria-hidden className="rtl:rotate-180" />
          </Link>
        </Button>
      </div>
    </Section>
  );
}
