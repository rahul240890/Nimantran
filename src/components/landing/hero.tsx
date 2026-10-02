import { ArrowRight, Check, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { landingText } from "@/i18n/copy/landing";
import type { UiLocale } from "@/i18n/locales";
import { pagePath } from "@/lib/seo/paths";
import { HeroDeck } from "./hero-deck";

/**
 * The first screen: what Shubh Invitation is and a search for any occasion or design, so the
 * way in is above the fold on every phone. A fanned deck of the painted themes stands beside
 * it, before a painted doorway that fades into the page behind the words.
 */
export function Hero({ locale }: { locale: UiLocale }) {
  const { hero, homeGallery } = landingText[locale];
  const gallery = pagePath({ kind: "gallery" }, locale);
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[26rem] [mask-image:linear-gradient(to_bottom,black_20%,transparent)] lg:inset-y-0 lg:h-auto lg:[mask-image:linear-gradient(to_left,black_40%,transparent_85%),linear-gradient(to_bottom,black_75%,transparent)] lg:[mask-composite:intersect]"
      >
        <Image
          src="/home/doorway.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[78%_center] opacity-20 lg:object-right lg:opacity-60 dark:opacity-15 lg:dark:opacity-35"
        />
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pt-8 pb-6 sm:px-6 sm:pt-12 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:px-8 lg:py-10">
        <div className="flex min-w-0 animate-rise flex-col gap-5 sm:gap-6">
          <p className="font-label text-xs tracking-[0.28em] text-accent-text uppercase">
            {hero.eyebrow}
          </p>
          <h1
            id="hero-title"
            className="font-display text-[2.5rem] leading-[1.04] sm:text-6xl lg:text-[4.1rem]"
          >
            {hero.title}
          </h1>
          <p className="max-w-[34rem] text-lg text-ink-muted sm:text-xl">{hero.body}</p>

          {/* A plain form, so searching works before the page's scripts have loaded */}
          <form
            role="search"
            action={gallery}
            method="get"
            className="flex w-full max-w-xl items-center gap-2 rounded-full border border-line-control bg-surface p-1.5 ps-4 shadow-float focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/35 sm:ps-5"
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

          <div className="flex max-w-xl flex-col gap-2.5">
            <p className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase">
              {hero.popular}
            </p>
            <ul className="flex flex-wrap gap-2">
              {hero.popularSearches.map((word) => (
                <li key={word}>
                  <Link
                    href={`${gallery}?q=${encodeURIComponent(word)}`}
                    className="inline-flex min-h-11 items-center rounded-full border border-line bg-surface/80 px-4 text-sm font-semibold text-ink transition-colors hover:border-line-strong hover:bg-surface focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {word}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
            <Button asChild variant="secondary">
              <Link href={pagePath({ kind: "designs" }, locale)}>
                {hero.primary}
                <ArrowRight aria-hidden className="rtl:rotate-180" />
              </Link>
            </Button>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[0.95rem] text-ink-muted">
              {hero.proof.map((item) => (
                <li key={item} className="inline-flex items-center gap-2">
                  <Check aria-hidden className="size-4 text-success" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <HeroDeck />
      </div>
    </section>
  );
}
