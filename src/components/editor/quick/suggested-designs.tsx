import Link from "next/link";
import { TemplateCover } from "@/components/brand/template-cover";
import { CardPicture } from "@/components/gallery/card-picture";
import { designWords } from "@/components/gallery/design-words";
import type { UiLocale } from "@/i18n/locales";
import { editorText } from "@/i18n/copy/editor";
import { CATEGORIES, type CategoryId } from "@/lib/categories/catalog";
import {
  designById,
  designHref,
  kindDesigns,
  occasionDesigns,
  suiteImage,
  type WeddingKind,
} from "@/lib/gallery/catalog";

/** How many designs the row offers. */
const SHOWN = 12;

/**
 * More designs for the same occasion under a design's page, to compare with (owner,
 * 2026-10-24). Each opens its own page; what was typed stays, since it is the same draft.
 * An invite opened from the account stays named, so the design picked is that invite's.
 */
export function SuggestedDesigns({
  current,
  occasion,
  kind,
  invite = null,
  locale,
}: {
  current: string;
  occasion: CategoryId;
  kind: WeddingKind | null;
  /** The invite open on the page (?invite=), when it came from the account. */
  invite?: string | null;
  locale: UiLocale;
}) {
  const { quickCopy } = editorText[locale];
  // One of each painting: its Scene and its Story are the same picture, so the first shown
  const seen = new Set([designById(current)?.suite ?? current]);
  const designs = (kind ? kindDesigns(kind) : occasionDesigns(occasion))
    .filter((design) => {
      const key = design.id.startsWith("card-") ? design.id : design.suite;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, SHOWN);
  if (designs.length === 0) return null;
  return (
    // Change design jumps here (#more-designs): its heading lands below the sticky header, and
    // on a wide screen the section is a screen tall, so the jump carries the sticky design
    // column above clear away rather than leaving it half under the header
    <section
      aria-labelledby="more-designs"
      data-suggested-designs
      className="mx-auto w-full max-w-site border-t border-line px-4 py-8 sm:px-6 lg:min-h-dvh lg:px-8"
    >
      <h2 id="more-designs" className="mb-4 scroll-mt-24 font-display text-lg">
        {quickCopy.moreDesigns(CATEGORIES[occasion].names[locale])}
      </h2>
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {designs.map((design) => {
          const name = designWords(design, locale).name;
          const picture = design.id.startsWith("card-") ? null : suiteImage(design.suite);
          return (
            <li key={design.id}>
              <Link
                href={`${designHref(design, { category: occasion, kind })}${invite ? `&invite=${invite}` : ""}`}
                className="group flex flex-col gap-1.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {picture ? (
                  // The card's own cut of its painting, as in the gallery, never the image resizer
                  <span className="relative block aspect-[3/4] overflow-hidden rounded-md bg-night shadow-raised">
                    <CardPicture
                      src={picture}
                      className="transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </span>
                ) : (
                  <TemplateCover
                    id={design.template}
                    locale={locale}
                    className="rounded-md shadow-raised"
                  />
                )}
                <span className="min-h-11 truncate text-sm font-semibold group-hover:text-accent-text">
                  {name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
