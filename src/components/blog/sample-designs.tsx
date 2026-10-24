import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import Link from "next/link";
import { designWords } from "@/components/gallery/design-words";
import { galleryText } from "@/i18n/copy/gallery";
import type { UiLocale } from "@/i18n/locales";
import { CATEGORIES, type CategoryId } from "@/lib/categories/catalog";
import { occasionDesigns, suiteImage } from "@/lib/gallery/catalog";
import { samplePath } from "@/lib/sample/paths";

/** How many designs a post shows: enough to choose between, few enough to read past. */
const SHOWN = 4;

/**
 * Under a post, a few painted designs for its occasion, each opening as a live invitation:
 * the reader goes from words about an invitation to seeing one.
 */
export function SampleDesigns({
  occasion,
  locale,
  heading,
}: {
  occasion: CategoryId;
  locale: UiLocale;
  heading: string;
}) {
  const { galleryCopy } = galleryText[locale];
  const seen = new Set<string>();
  const designs = occasionDesigns(occasion).filter((design) => {
    if (design.suite === "classic" || seen.has(design.suite) || !suiteImage(design.suite)) {
      return false;
    }
    seen.add(design.suite);
    return true;
  });
  if (designs.length === 0) return null;
  return (
    <section aria-labelledby="sample-designs-heading" className="mt-4 flex flex-col gap-4">
      <h2 id="sample-designs-heading" className="font-display text-2xl sm:text-3xl">
        {heading}
      </h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {designs.slice(0, SHOWN).map((design) => {
          const { name, description } = designWords(design, locale);
          return (
            <li key={design.id}>
              <Link
                href={samplePath(design.id)}
                data-sample-design={design.id}
                className="group flex flex-col gap-2 rounded-lg outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
              >
                <span className="relative block aspect-[9/16] overflow-hidden rounded-xl bg-night shadow-raised ring-1 ring-line">
                  <Image
                    src={suiteImage(design.suite)!}
                    alt={galleryCopy.designImage(
                      name,
                      CATEGORIES[occasion].names[locale],
                      description,
                    )}
                    fill
                    sizes="(min-width: 40rem) 11rem, 45vw"
                    className="object-cover object-top transition-transform duration-700 ease-out-expo group-hover:scale-[1.04] motion-still:transition-none motion-still:group-hover:scale-100"
                  />
                </span>
                <span className="font-display text-lg leading-tight">{name}</span>
                <span className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-accent-text">
                  {galleryCopy.seeSample}
                  <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
