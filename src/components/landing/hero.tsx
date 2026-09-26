import { ArrowDown, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { landingText } from "@/i18n/copy";
import type { UiLocale } from "@/i18n/locales";
import { HeroInvite } from "./hero-invite";

/**
 * The first screen. On desktop the whole hero is a tall scroll track: it pins below the header
 * while the invitation opens, then lets go. On phones the headline scrolls away first and
 * only the card pins (inside HeroInvite). Still mode drops the extra scroll length entirely.
 */
export function Hero({ locale }: { locale: UiLocale }) {
  const { hero } = landingText[locale];
  return (
    <section
      data-hero-track
      aria-labelledby="hero-title"
      className="relative lg:h-[200svh] lg:motion-still:h-auto"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-4 px-4 pt-10 sm:px-6 sm:pt-14 lg:sticky lg:top-16 lg:h-[calc(100svh-4rem)] lg:min-h-[36rem] lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:px-8 lg:pt-0 lg:motion-still:static lg:motion-still:h-auto lg:motion-still:py-16">
        <div className="flex animate-rise flex-col gap-6 sm:gap-7">
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
          <div className="flex flex-col gap-3 min-[400px]:flex-row min-[400px]:flex-wrap">
            <Button asChild size="lg">
              <Link href="/create">{hero.primary}</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href="#how-it-works">
                {hero.secondary}
                <ArrowDown aria-hidden />
              </a>
            </Button>
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-[0.95rem] text-ink-muted">
            {hero.proof.map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <Check aria-hidden className="size-4 text-success" strokeWidth={2.5} />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <HeroInvite />
      </div>
    </section>
  );
}
