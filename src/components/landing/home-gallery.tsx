import {
  ArrowRight,
  BookOpen,
  Clapperboard,
  Image as ImageIcon,
  Layers,
  LayoutGrid,
  Rotate3d,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { TemplateCover } from "@/components/brand/template-cover";
import { ScenePoster } from "@/components/gallery/scene-poster";
import { Button } from "@/components/ui/button";
import { ScrollRow } from "@/components/ui/scroll-row";
import { designNamesText } from "@/i18n/copy/design-names";
import { galleryText } from "@/i18n/copy/gallery";
import { landingText } from "@/i18n/copy/landing";
import type { UiLocale } from "@/i18n/locales";
import type { CategoryId } from "@/lib/categories/catalog";
import { cn } from "@/lib/cn";
import { OCCASIONS, suiteImage } from "@/lib/gallery/catalog";
import type { DesignFormat } from "@/lib/gallery/filters";
import { shelfHref } from "@/lib/gallery/shelves";
import { pagePath } from "@/lib/seo/paths";
import { TEMPLATE_IDS } from "@/lib/templates/ids";
import { HomeShelves } from "./home-shelves";

/** The occasions in the strip under the first screen, the wedding's functions first. */
const STRIP_OCCASIONS = [
  "wedding",
  "engagement",
  "haldi",
  "mehendi",
  "sangeet",
  "reception",
  "save-the-date",
  "birthday",
  "anniversary",
  "baby-shower",
  "housewarming",
  "puja",
  "diwali",
] as const satisfies readonly CategoryId[];

/** A catalogue section's heading: a small label over a display title, at the start. */
function Heading({
  id,
  eyebrow,
  title,
  intro,
  action,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="flex max-w-2xl min-w-0 flex-col gap-2">
        <p className="flex items-center gap-3 font-label text-xs tracking-[0.24em] text-accent-text uppercase">
          <span aria-hidden className="h-px w-6 bg-marigold" />
          {eyebrow}
        </p>
        <h2 id={id} className="font-display text-[1.9rem] leading-[1.08] sm:text-[2.5rem]">
          {title}
        </h2>
        {intro && <p className="text-base text-ink-muted sm:text-lg">{intro}</p>}
      </div>
      {action}
    </div>
  );
}

/**
 * Every main occasion as a round painting in one strip, straight under the first screen,
 * the way large shops head their home page with their departments: one tap to the designs
 * made for it. Two rows that scroll sideways on a phone; all of them at once on a wide screen.
 */
export function HomeOccasions({ locale }: { locale: UiLocale }) {
  const { homeGallery } = landingText[locale];
  const occasions = STRIP_OCCASIONS.flatMap((id) => {
    const occasion = OCCASIONS.find((item) => item.category === id);
    const image =
      occasion?.tile ?? (occasion?.art ? suiteImage(occasion.art.suite, occasion.art.page) : null);
    return occasion && image ? [{ id, name: occasion.names[locale], image }] : [];
  });
  const circle =
    "relative grid size-[4.5rem] shrink-0 place-items-center overflow-hidden rounded-full border-2 border-line bg-night shadow-raised transition-[border-color] group-hover:border-marigold sm:size-20";
  const tile =
    "group flex h-full flex-col items-center gap-2 rounded-xl p-1.5 text-center outline-offset-2 transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-ring";

  return (
    <section
      id="occasions"
      tabIndex={-1}
      aria-labelledby="occasions-title"
      className="scroll-mt-20 rounded-2xl border border-line bg-surface/90 shadow-raised backdrop-blur-sm outline-none"
    >
      <div className="flex flex-col gap-3 py-4 sm:py-5">
        <div className="flex items-baseline justify-between gap-4 px-4 sm:px-5">
          <h2 id="occasions-title" className="font-display text-xl sm:text-2xl">
            {homeGallery.occasionsTitle}
          </h2>
          <Link
            href={pagePath({ kind: "gallery" }, locale)}
            className="hidden min-h-11 items-center gap-1 rounded-full px-2 text-sm font-semibold text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:inline-flex"
          >
            {homeGallery.allOccasions}
            <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />
          </Link>
        </div>
        <ScrollRow className="grid snap-x scroll-px-3 auto-cols-[5.5rem] grid-flow-col grid-rows-2 gap-x-1 gap-y-2 overflow-x-auto px-3 pb-1 sm:auto-cols-[6.5rem] sm:px-4 lg:grid-flow-row lg:grid-cols-7 lg:grid-rows-none lg:overflow-visible">
          {occasions.map(({ id, name, image }, index) => (
            <li key={id} data-occasion={id} className="snap-start">
              <Link href={pagePath({ kind: "occasion", id }, locale)} className={tile}>
                <span className={circle}>
                  <Image
                    src={image}
                    alt=""
                    fill
                    // Small, and below the first screen on a phone: no need to jump the queue
                    loading={index < 7 ? "eager" : "lazy"}
                    sizes="5rem"
                    className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-110 motion-still:transition-none motion-still:group-hover:scale-100"
                  />
                </span>
                <span className="text-sm leading-snug font-semibold text-ink">{name}</span>
              </Link>
            </li>
          ))}
          <li className="snap-start">
            <Link href={pagePath({ kind: "gallery" }, locale)} className={tile}>
              <span
                className={cn(
                  circle,
                  "border-dashed border-line-strong bg-surface-2 text-accent-text",
                )}
              >
                <LayoutGrid aria-hidden className="size-6" />
              </span>
              <span className="text-sm leading-snug font-semibold text-accent-text">
                {homeGallery.allOccasions}
              </span>
            </Link>
          </li>
        </ScrollRow>
      </div>
    </section>
  );
}

/**
 * A taste of the designs: the wedding traditions as round paintings, the designs hosts are
 * choosing most, and the way on to every design.
 */
export function HomeDesigns({ locale }: { locale: UiLocale }) {
  const { homeGallery } = landingText[locale];
  const designsPath = pagePath({ kind: "designs" }, locale);
  return (
    <section
      id="templates"
      tabIndex={-1}
      aria-labelledby="templates-title"
      className="scroll-mt-16 outline-none"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:gap-14 lg:px-8">
        <Heading
          id="templates-title"
          eyebrow={homeGallery.designsEyebrow}
          title={homeGallery.designsTitle}
          intro={homeGallery.designsIntro}
        />
        <HomeShelves
          designsPath={designsPath}
          covers={covers(locale)}
          names={designNamesText[locale]}
        />
        <Button asChild variant="secondary" className="self-center">
          <Link href={designsPath}>
            {homeGallery.allDesigns}
            <ArrowRight aria-hidden className="rtl:rotate-180" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

/** The 3D cards' covers, drawn on the server (see DesignCard). */
function covers(locale: UiLocale) {
  return Object.fromEntries(
    TEMPLATE_IDS.map((id) => [
      id,
      <TemplateCover key={id} id={id} locale={locale} className="max-w-[16rem]" />,
    ]),
  );
}

const KIND_ICONS = {
  moving: Clapperboard,
  storybook: BookOpen,
  story: Layers,
  scene: ImageIcon,
  card: Rotate3d,
} as const;

/**
 * The three kinds of invitation as wide banners, each a picture of one and its View all:
 * a Story, a Scene and a 3D card. Side by side on a wide screen, stacked on a phone.
 */
export function HomeKinds({ locale }: { locale: UiLocale }) {
  const { homeGallery } = landingText[locale];
  const { shelfCopy } = galleryText[locale];
  const designsPath = pagePath({ kind: "designs" }, locale);
  const kinds: readonly { format: DesignFormat; picture: ReactNode }[] = [
    {
      format: "story",
      picture: (
        <Image
          src={suiteImage("rajwada-bagh", "wedding") ?? ""}
          alt=""
          fill
          sizes="(min-width: 40rem) 33vw, 40vw"
          className="object-cover object-top"
        />
      ),
    },
    { format: "scene", picture: <ScenePoster suite="kayal" /> },
    {
      format: "card",
      picture: (
        <span
          className="absolute inset-0 flex justify-center bg-night px-[18%] pt-[6%] pb-[50%] sm:pt-[8%] sm:pb-[40%]"
          style={{
            backgroundImage:
              "radial-gradient(60% 45% at 50% 32%, color-mix(in srgb, var(--marigold) 35%, transparent), transparent)",
          }}
        >
          <TemplateCover id="marigold" locale={locale} className="h-full w-auto max-w-full" />
        </span>
      ),
    },
  ];

  return (
    <section
      id="kinds"
      aria-labelledby="kinds-title"
      className="border-y border-line bg-surface-2/60"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <Heading
          id="kinds-title"
          eyebrow={homeGallery.kindsEyebrow}
          title={homeGallery.kindsTitle}
          intro={homeGallery.kindsIntro}
        />
        <ul className="grid gap-4 sm:grid-cols-3 lg:gap-6">
          {kinds.map(({ format, picture }) => {
            const Icon = KIND_ICONS[format];
            const { title, intro } = shelfCopy.format[format];
            return (
              <li key={format} data-kind-banner={format}>
                <Link
                  href={shelfHref(
                    { id: `format-${format}`, kind: "format", value: format },
                    designsPath,
                  )}
                  className="group relative isolate flex aspect-[5/4] h-full flex-col justify-end overflow-hidden rounded-2xl bg-night shadow-raised ring-1 ring-line outline-offset-3 transition-[box-shadow,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-float focus-visible:outline-2 focus-visible:outline-ring sm:aspect-[3/4] lg:aspect-[4/5] motion-still:transition-none motion-still:hover:translate-y-0"
                >
                  <span className="absolute inset-0 -z-10 transition-transform duration-700 ease-out-expo group-hover:scale-105 motion-still:transition-none motion-still:group-hover:scale-100">
                    {picture}
                  </span>
                  {/* Night rising from the foot keeps the words readable on any painting */}
                  <span
                    aria-hidden
                    className="absolute inset-0 -z-10 bg-linear-to-t from-night via-night/60 to-transparent to-70%"
                  />
                  <span className="flex flex-col gap-1.5 p-5 text-card-ivory sm:p-6">
                    <span className="grid size-10 place-items-center rounded-full bg-marigold text-on-marigold shadow-float">
                      <Icon aria-hidden className="size-5" />
                    </span>
                    <span className="pt-1 font-display text-2xl leading-tight sm:text-[1.75rem]">
                      {title}
                    </span>
                    <span className="text-sm leading-snug text-card-ivory/80 sm:text-base">
                      {intro}
                    </span>
                    <span className="inline-flex items-center gap-1 pt-2 text-sm font-semibold text-marigold">
                      {shelfCopy.viewAll}
                      <ArrowRight
                        aria-hidden
                        className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 motion-still:transition-none"
                      />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
