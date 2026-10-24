import { ArrowRight, LayoutGrid } from "lucide-react";
import { Image } from "@/components/ui/image";
import Link from "next/link";
import { galleryText } from "@/i18n/copy/gallery";
import { landingText } from "@/i18n/copy/landing";
import type { UiLocale } from "@/i18n/locales";
import { CATEGORIES, type CategoryId } from "@/lib/categories/catalog";
import { occasionTile } from "@/lib/gallery/catalog";
import { NO_FILTERS, designCatalog, filterCatalog } from "@/lib/gallery/filters";
import { pagePath } from "@/lib/seo/paths";

/** The four occasions most families come for, as large painted tiles. */
const BIG = [
  "wedding",
  "engagement",
  "birthday",
  "baby-shower",
] as const satisfies readonly CategoryId[];

/** Then the others asked for most, as a row of small links. */
const SMALL = [
  "save-the-date",
  "haldi",
  "mehendi",
  "sangeet",
  "anniversary",
  "housewarming",
  "diwali",
  "naming-ceremony",
] as const satisfies readonly CategoryId[];

/**
 * What are you celebrating? Straight under the first screen: the four main occasions as
 * large paintings with how many designs each has, then the next few as small links and the
 * way on to every occasion. One tap lands on the occasion's designs.
 */
export function HomeOccasions({ locale }: { locale: UiLocale }) {
  const { homePicks } = landingText[locale];
  const { catalogCopy, occasionTaglines } = galleryText[locale];
  const entries = designCatalog();
  const count = (id: CategoryId) =>
    catalogCopy.count(filterCatalog(entries, { ...NO_FILTERS, occasion: id }, () => "").length);
  const chip =
    "inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-semibold whitespace-nowrap text-ink transition-colors hover:border-marigold-edge hover:text-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

  return (
    <section
      id="occasions"
      tabIndex={-1}
      aria-labelledby="occasions-title"
      className="scroll-mt-20 outline-none"
    >
      <div className="mx-auto flex w-full max-w-site flex-col gap-5 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <h2 id="occasions-title" className="font-display text-[1.6rem] leading-tight sm:text-3xl">
          {homePicks.title}
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {BIG.map((id, index) => (
            <li key={id} data-occasion={id}>
              <Link
                href={pagePath({ kind: "occasion", id }, locale)}
                className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl bg-night shadow-raised ring-1 ring-line outline-offset-3 transition-[box-shadow,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-float focus-visible:outline-2 focus-visible:outline-ring sm:aspect-[5/4] lg:aspect-[4/5] motion-still:transition-none motion-still:hover:translate-y-0"
              >
                <Image
                  src={occasionTile(id) ?? ""}
                  alt=""
                  fill
                  // The first two are on a phone's second screen; the rest come as it scrolls
                  loading={index < 2 ? "eager" : "lazy"}
                  sizes="(min-width: 64rem) 22rem, (min-width: 40rem) 45vw, 50vw"
                  className="-z-10 object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105 motion-still:transition-none motion-still:group-hover:scale-100"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-linear-to-t from-night/90 via-night/35 to-transparent to-65%"
                />
                <span className="flex flex-col gap-0.5 p-3.5 text-card-ivory sm:p-5">
                  <span className="font-display text-xl leading-tight sm:text-2xl">
                    {CATEGORIES[id].names[locale]}
                  </span>
                  <span className="text-sm text-card-ivory/85 max-sm:hidden">
                    {occasionTaglines[id]}
                  </span>
                  <span className="inline-flex items-center gap-1 pt-1 text-sm font-semibold text-marigold">
                    {count(id)}
                    <ArrowRight
                      aria-hidden
                      className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 motion-still:transition-none"
                    />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <ul aria-label={homePicks.more} className="flex flex-wrap gap-2">
          {SMALL.map((id) => (
            <li key={id} data-occasion={id}>
              <Link href={pagePath({ kind: "occasion", id }, locale)} className={chip}>
                {CATEGORIES[id].names[locale]}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={pagePath({ kind: "gallery" }, locale)}
              className={`${chip} border-dashed border-line-strong text-accent-text`}
            >
              <LayoutGrid aria-hidden className="size-4" />
              {homePicks.all}
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
