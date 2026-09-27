"use client";

import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { Mandala } from "@/components/brand/mandala";
import { CategoryIcon } from "@/components/categories/category-icon";
import { TiltCard } from "@/components/motion/tilt-card";
import { categoriesText } from "@/i18n/copy/categories";
import { useText } from "@/i18n/client";
import { CATEGORIES, CATEGORY_IDS, type CategoryId } from "@/lib/categories/catalog";
import { isLocal, rankCategories } from "@/lib/categories/rank";
import { regionLanguage } from "@/lib/categories/regions";
import { useVisitor } from "@/lib/categories/use-visitor";
import { TEMPLATES } from "@/lib/templates/catalog";
import { stockStyle } from "@/lib/templates/stock";
import { Section } from "./section";

/**
 * The occasions a host can start from, each printed on the stock of the design that suits
 * it best. Local and seasonal occasions come first: the page renders the base order, then
 * the browser reorders for where and when the visitor is.
 */
export function Occasions() {
  const { categoryTaglines, occasionsSection } = useText(categoriesText);
  const visitor = useVisitor();
  const local = regionLanguage(visitor.region);
  const ranked = rankCategories(
    CATEGORY_IDS.map((id) => CATEGORIES[id]),
    visitor,
  );

  return (
    <Section
      id="occasions"
      eyebrow={occasionsSection.eyebrow}
      title={occasionsSection.title}
      intro={occasionsSection.intro}
    >
      <ul
        aria-label={occasionsSection.listLabel}
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5"
      >
        {ranked.map((category) => {
          const id = category.id as CategoryId;
          const near = isLocal(category, visitor.region);
          return (
            <li key={id} data-category={id} className="reveal-on-scroll">
              <TiltCard maxTilt={5} className="h-full rounded-lg">
                <Link
                  href={`/create?category=${id}`}
                  style={stockStyle(TEMPLATES[category.templates[0]!])}
                  className="group relative isolate flex h-full min-h-44 flex-col gap-5 overflow-hidden rounded-lg border border-card-gold/50 bg-card-ivory p-3.5 text-card-ink shadow-raised transition-shadow duration-300 hover:shadow-float focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring min-[400px]:p-4 sm:min-h-52 sm:p-5"
                >
                  {/* A printed double frame and a mandala watermark, like the card itself */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-1.5 rounded-md border border-card-gold/40"
                  />
                  <Mandala
                    simple
                    className="pointer-events-none absolute -end-14 -top-14 -z-10 w-40 text-card-gold opacity-30 transition-transform duration-700 ease-out-expo [--mandala-fill:var(--card-gold)] group-hover:rotate-45 sm:w-48 motion-still:group-hover:rotate-0"
                  />
                  <span className="flex items-start justify-between gap-2">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full border border-card-gold bg-card-ivory text-card-gold-text shadow-[0_2px_0_color-mix(in_srgb,var(--card-gold)_45%,transparent)] sm:size-12">
                      <CategoryIcon icon={category.icon} className="size-5" />
                    </span>
                    <ArrowRight
                      aria-hidden
                      className="mt-1 size-5 text-card-accent-text opacity-70 transition-[opacity,translate] duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                    />
                  </span>
                  <span className="mt-auto flex min-w-0 flex-col gap-1">
                    <span
                      lang={local}
                      className="text-sm [overflow-wrap:anywhere] text-card-accent-text"
                    >
                      {category.names[local]}
                    </span>
                    <span className="font-display text-[1.05rem] leading-[1.1] break-words min-[400px]:text-[1.35rem] sm:text-2xl">
                      {category.names.en}
                    </span>
                    <span className="hidden text-sm text-card-ink-muted sm:block">
                      {categoryTaglines[id]}
                    </span>
                    {near && (
                      <span className="mt-1 flex items-start gap-1 font-label text-[0.7rem] leading-snug tracking-[0.14em] text-card-gold-text uppercase">
                        <MapPin aria-hidden className="size-3.5 shrink-0" />
                        {occasionsSection.nearYou}
                      </span>
                    )}
                  </span>
                </Link>
              </TiltCard>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
