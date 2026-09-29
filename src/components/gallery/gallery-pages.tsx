import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { TemplateCover } from "@/components/brand/template-cover";
import { FeatureRow, LinkPills, PublicShell, type Crumb } from "@/components/seo/public-page";
import { editorText } from "@/i18n/copy/editor";
import { galleryText } from "@/i18n/copy/gallery";
import { seoText } from "@/i18n/copy/seo";
import type { UiLocale } from "@/i18n/locales";
import { CATEGORIES, CATEGORY_IDS, type CategoryId } from "@/lib/categories/catalog";
import {
  OCCASIONS,
  OCCASION_SECTIONS,
  WEDDING_KINDS,
  WEDDING_KIND_ENTRIES,
  kindDesigns,
  occasionDesigns,
  suiteImage,
  designHref,
  type GalleryDesign,
  type Occasion,
  type WeddingKind,
} from "@/lib/gallery/catalog";
import { pagePath } from "@/lib/seo/paths";
import { itemList } from "@/lib/seo/structured-data";
import { cn } from "@/lib/cn";
import { DesignCard } from "./design-card";
import { designWords } from "./design-words";
import { GallerySearch } from "./gallery-search";
import { OccasionTile, PaintedTile } from "./occasion-tile";

/*
 * The gallery's pages (Step 12g): every occasion (/invitations), one occasion's designs, or
 * a wedding's kinds (/invitations/wedding), and one kind's designs
 * (/invitations/wedding/gujarati). Server-rendered, so search engines read every word.
 */

function crumbs(locale: UiLocale, ...rest: Crumb[]): Crumb[] {
  const { seoCopy } = seoText[locale];
  const { galleryCopy } = galleryText[locale];
  return [
    { name: seoCopy.home, path: pagePath({ kind: "home" }, locale) },
    { name: galleryCopy.breadcrumb, path: pagePath({ kind: "gallery" }, locale) },
    ...rest,
  ];
}

function GalleryHero({
  eyebrow,
  heading,
  intro,
  native,
}: {
  eyebrow: string;
  heading: string;
  intro: string;
  native?: { text: string; lang: string } | null;
}) {
  return (
    <section
      aria-labelledby="page-title"
      className="relative isolate mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 pt-4 pb-8 sm:px-6 sm:pb-10 lg:px-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -z-10 aspect-square w-[min(120%,56rem)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--marigold) 22%, transparent), color-mix(in srgb, var(--rose) 6%, transparent) 60%, transparent)",
        }}
      />
      <p className="flex items-center gap-3 font-label text-xs tracking-[0.28em] text-accent-text uppercase">
        <span aria-hidden className="h-px w-6 bg-marigold" />
        {eyebrow}
      </p>
      <h1
        id="page-title"
        className="font-display text-[2.3rem] leading-[1.06] break-words sm:text-[3.2rem] lg:text-[3.6rem]"
      >
        {native && (
          <span lang={native.lang} className="block text-[0.55em] leading-tight text-accent-text">
            {native.text}
          </span>
        )}
        {heading}
      </h1>
      <p className="max-w-2xl text-lg text-ink-muted">{intro}</p>
    </section>
  );
}

function Shelf({
  id,
  heading,
  intro,
  children,
  className,
}: {
  id: string;
  heading: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-labelledby={`${id}-heading`}
      className={cn("mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 lg:px-8", className)}
    >
      <div className="mb-5 flex flex-col gap-1.5">
        <h2 id={`${id}-heading`} className="font-display text-[1.7rem] leading-tight sm:text-3xl">
          {heading}
        </h2>
        {intro && <p className="max-w-2xl text-ink-muted">{intro}</p>}
      </div>
      {children}
    </section>
  );
}

function occasionTile(occasion: Occasion, locale: UiLocale, index: number, feature = false) {
  const { galleryCopy, occasionTaglines } = galleryText[locale];
  const other = locale === "en" ? "hi" : "en";
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
      feature={feature}
      priority={index < 3}
    />
  );
}

function DesignGallery({
  locale,
  designs,
  category,
  kind = null,
}: {
  locale: UiLocale;
  designs: GalleryDesign[];
  category: CategoryId;
  kind?: WeddingKind | null;
}) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
      {designs.map((design, index) => {
        const { name, description } = designWords(design, locale);
        return (
          <li key={design.id}>
            <DesignCard
              design={design}
              name={name}
              description={description}
              href={designHref(design, { category, kind })}
              priority={index < 4}
              cover={
                design.suite === "classic" ? (
                  <TemplateCover id={design.template} locale={locale} className="max-w-[16rem]" />
                ) : undefined
              }
            />
          </li>
        );
      })}
    </ul>
  );
}

function KindTiles({ locale }: { locale: UiLocale }) {
  const { weddingKindCopy } = galleryText[locale];
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {WEDDING_KINDS.map((kind, index) => {
        const entry = WEDDING_KIND_ENTRIES[kind];
        return (
          <li key={kind} className={cn(index === 0 && "col-span-2 row-span-2")}>
            <PaintedTile
              href={pagePath({ kind: "wedding-kind", id: kind }, locale)}
              image={suiteImage(entry.art.suite, entry.art.page) ?? ""}
              name={weddingKindCopy[kind].name}
              otherName={entry.nativeName}
              tagline={weddingKindCopy[kind].description}
              feature={index === 0}
              priority={index < 3}
              data-kind={kind}
            />
          </li>
        );
      })}
    </ul>
  );
}

/** Closes the wedding shelf: a fan of three paintings leading to every wedding design. */
function AllDesignsTile({ locale }: { locale: UiLocale }) {
  const { galleryCopy } = galleryText[locale];
  const fan = (["kayal", "rajbari", "noor-bagh"] as const).map((suite) => suiteImage(suite)!);
  return (
    <Link
      href={`${pagePath({ kind: "occasion", id: "wedding" }, locale)}#designs`}
      className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-xl border border-line-strong bg-surface-2 p-4 shadow-raised outline-offset-3 focus-visible:outline-2 focus-visible:outline-ring sm:p-5"
    >
      <span aria-hidden className="absolute inset-x-0 top-[12%] -z-10 flex justify-center">
        {fan.map((src, index) => (
          <span
            key={src}
            className={cn(
              "relative -mx-5 aspect-[9/16] w-[34%] overflow-hidden rounded-md border-2 border-card-ivory shadow-float transition-transform duration-500 ease-out-expo motion-still:transition-none",
              index === 0 && "-rotate-12 group-hover:-rotate-[16deg]",
              index === 1 && "z-10 -translate-y-2 group-hover:-translate-y-4",
              index === 2 && "rotate-12 group-hover:rotate-[16deg]",
            )}
          >
            <Image src={src} alt="" fill sizes="8rem" className="object-cover" />
          </span>
        ))}
      </span>
      <span className="flex items-end justify-between gap-2">
        <span className="font-display text-[1.35rem] leading-[1.05] sm:text-2xl">
          {galleryCopy.allWeddingDesigns}
        </span>
        <ArrowRight aria-hidden className="mb-1 size-5 shrink-0 text-accent-text rtl:rotate-180" />
      </span>
    </Link>
  );
}

/** /invitations: search, then every occasion by section. */
export function GalleryIndexPage({ locale }: { locale: UiLocale }) {
  const { galleryCopy, sectionNames } = galleryText[locale];
  const live = OCCASIONS.filter((occasion) => occasion.category);
  return (
    <PublicShell
      locale={locale}
      crumbs={crumbs(locale)}
      jsonLd={[
        itemList(
          live.map((occasion) => ({
            name: occasion.names[locale],
            path: pagePath({ kind: "occasion", id: occasion.category! }, locale),
          })),
        ),
      ]}
    >
      <GalleryHero
        eyebrow={galleryCopy.eyebrow}
        heading={galleryCopy.heading}
        intro={galleryCopy.intro}
      />
      <GallerySearch>
        <div className="pt-10">
          {OCCASION_SECTIONS.map((section) => {
            const occasions = OCCASIONS.filter((occasion) => occasion.section === section);
            const wedding = section === "wedding";
            return (
              <Shelf key={section} id={`section-${section}`} heading={sectionNames[section]}>
                <ul
                  className={cn(
                    "grid gap-3 sm:gap-4",
                    wedding
                      ? "grid-cols-2 lg:grid-cols-4"
                      : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
                  )}
                >
                  {occasions.map((occasion, index) => (
                    <li
                      key={occasion.id}
                      className={cn(wedding && index === 0 && "col-span-2 row-span-2")}
                    >
                      {occasionTile(occasion, locale, index, wedding && index === 0)}
                    </li>
                  ))}
                  {wedding && (
                    <li>
                      <AllDesignsTile locale={locale} />
                    </li>
                  )}
                </ul>
                {!wedding && <p className="mt-4 text-sm text-ink-muted">{galleryCopy.soonNote}</p>}
              </Shelf>
            );
          })}
        </div>
      </GallerySearch>
    </PublicShell>
  );
}

/** /invitations/<occasion>: a wedding's kinds and all its designs, or the occasion's designs. */
export function OccasionGalleryPage({ id, locale }: { id: CategoryId; locale: UiLocale }) {
  const { seoCopy } = seoText[locale];
  const { galleryCopy } = galleryText[locale];
  const { functionCopy } = editorText[locale];
  const category = CATEGORIES[id];
  const words = seoCopy.occasions[id];
  const name = category.names[locale];
  const designs = occasionDesigns(id);
  const functions = category.functions.suggested;
  return (
    <PublicShell
      locale={locale}
      crumbs={crumbs(locale, { name, path: pagePath({ kind: "occasion", id }, locale) })}
      jsonLd={[
        itemList(
          designs.map((design) => ({
            name: designWords(design, locale).name,
            path: pagePath({ kind: "occasion", id }, locale),
          })),
        ),
      ]}
    >
      <GalleryHero eyebrow={seoCopy.invitations} heading={words.heading} intro={words.intro} />
      {id === "wedding" && (
        <Shelf id="kinds" heading={galleryCopy.chooseKind} intro={galleryCopy.chooseKindIntro}>
          <KindTiles locale={locale} />
        </Shelf>
      )}
      <Shelf
        id="designs"
        heading={id === "wedding" ? galleryCopy.allWeddingDesigns : galleryCopy.designsHeading}
        intro={galleryCopy.designsCount(designs.length)}
      >
        <DesignGallery locale={locale} designs={designs} category={id} />
      </Shelf>
      <FeatureRow locale={locale} />
      {functions.length > 1 && (
        <Shelf
          id="functions"
          heading={seoCopy.functionsHeading}
          intro={seoCopy.functionsIntro}
          className="pt-12"
        >
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {functions.map((fn) => (
              <li
                key={fn}
                className="flex flex-col gap-1 rounded-lg border border-line bg-surface p-5 shadow-raised"
              >
                <h3 className="font-display text-xl">{functionCopy[fn].name}</h3>
                <p className="text-sm text-ink-muted">{functionCopy[fn].description}</p>
              </li>
            ))}
          </ul>
        </Shelf>
      )}
      <Shelf id="more" heading={galleryCopy.moreOccasions}>
        <LinkPills
          links={CATEGORY_IDS.filter((other) => other !== id).map((other) => ({
            label: CATEGORIES[other].names[locale],
            href: pagePath({ kind: "occasion", id: other }, locale),
          }))}
        />
      </Shelf>
    </PublicShell>
  );
}

/** /invitations/wedding/<kind>: only the designs made for this kind of wedding. */
export function WeddingKindPage({ kind, locale }: { kind: WeddingKind; locale: UiLocale }) {
  const { galleryCopy, weddingKindCopy } = galleryText[locale];
  const entry = WEDDING_KIND_ENTRIES[kind];
  const words = weddingKindCopy[kind];
  const designs = kindDesigns(kind);
  const wedding = CATEGORIES.wedding.names[locale];
  return (
    <PublicShell
      locale={locale}
      crumbs={crumbs(
        locale,
        { name: wedding, path: pagePath({ kind: "occasion", id: "wedding" }, locale) },
        { name: words.name, path: pagePath({ kind: "wedding-kind", id: kind }, locale) },
      )}
    >
      <GalleryHero
        eyebrow={wedding}
        heading={galleryCopy.kindMeta(words.name).title}
        intro={`${words.description} ${galleryCopy.kindIntro}`}
        native={entry.nativeName}
      />
      <Shelf
        id="designs"
        heading={galleryCopy.designsFor(words.name)}
        intro={galleryCopy.designsCount(designs.length)}
      >
        <DesignGallery locale={locale} designs={designs} category="wedding" kind={kind} />
      </Shelf>
      <FeatureRow locale={locale} />
      <Shelf id="more" heading={galleryCopy.chooseKind} className="pt-12">
        <LinkPills
          links={WEDDING_KINDS.filter((other) => other !== kind).map((other) => ({
            label: weddingKindCopy[other].name,
            href: pagePath({ kind: "wedding-kind", id: other }, locale),
          }))}
        />
      </Shelf>
    </PublicShell>
  );
}
