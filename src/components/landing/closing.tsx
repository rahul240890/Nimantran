import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Mandala } from "@/components/brand/mandala";
import { Button } from "@/components/ui/button";
import { landingText } from "@/i18n/copy/landing";
import type { UiLocale } from "@/i18n/locales";
import { pagePath } from "@/lib/seo/paths";

/**
 * The home page's last word before the footer: a night-blue band with the painted doorway
 * glowing through it, and the two ways in, start an invite or browse the designs.
 */
export function Closing({ locale }: { locale: UiLocale }) {
  const { closing } = landingText[locale];
  return (
    <section
      aria-labelledby="closing-title"
      className="mx-auto w-full max-w-site px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8"
    >
      <div className="relative isolate w-full overflow-hidden rounded-3xl bg-night px-6 py-14 text-card-ivory shadow-overlay sm:px-12 sm:py-16 lg:px-16 lg:py-20">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 [mask-image:linear-gradient(to_left,black_15%,transparent_75%)]"
        >
          <Image
            src="/home/doorway.webp"
            alt=""
            fill
            sizes="(min-width: 72rem) 72rem, 100vw"
            className="object-cover object-right opacity-25 sm:opacity-45"
          />
        </div>
        <Mandala className="absolute -end-24 -bottom-28 -z-10 size-80 text-marigold/30 [--mandala-fill:transparent] max-md:hidden sm:size-96" />
        <span
          aria-hidden
          className="absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-marigold to-transparent"
        />
        <div className="flex max-w-xl flex-col gap-5">
          <p className="flex items-center gap-3 font-label text-xs tracking-[0.28em] text-marigold uppercase">
            <span aria-hidden className="h-px w-6 bg-marigold" />
            {closing.eyebrow}
          </p>
          <h2
            id="closing-title"
            className="font-display text-[1.8rem] leading-[1.08] sm:text-5xl lg:text-[2.5rem]"
          >
            {closing.title}
          </h2>
          <p className="text-lg text-card-ivory/80">{closing.body}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg">
              <Link href={pagePath({ kind: "gallery" }, locale)}>
                {closing.primary}
                <ArrowRight aria-hidden className="rtl:rotate-180" />
              </Link>
            </Button>
            <Link
              href={pagePath({ kind: "designs" }, locale)}
              className="inline-flex h-14 items-center rounded-md border border-card-ivory/30 px-6 text-base font-semibold text-card-ivory transition-colors hover:border-card-ivory/60 hover:bg-card-ivory/10 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-marigold"
            >
              {closing.secondary}
            </Link>
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-[0.95rem] text-card-ivory/80">
            {closing.proof.map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <Check aria-hidden className="size-4 text-marigold" strokeWidth={2.5} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
