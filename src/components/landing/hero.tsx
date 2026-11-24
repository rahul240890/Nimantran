import { ArrowRight, Check, PlayCircle } from "lucide-react";
import { Image } from "@/components/ui/image";
import Link from "next/link";
import { TrustLine } from "@/components/reviews/trust-line";
import { Button } from "@/components/ui/button";
import { landingText } from "@/i18n/copy/landing";
import type { UiLocale } from "@/i18n/locales";
import { designWords } from "@/components/gallery/design-words";
import { allDesigns, suiteImage } from "@/lib/gallery/catalog";
import { DEMO_PATH, samplePath } from "@/lib/sample/paths";
import { pagePath } from "@/lib/seo/paths";
import type { SuiteId } from "@/lib/suites/catalog";
import { HomeFeatures, type FeaturesCopy } from "./home-features";

/** The design most of the phone's screens show. */
const FEATURE_SUITE: SuiteId = "rajwada-bagh";

/** The paintings a phone sees on the first screen, each opening live (owner, 2026-11-24 redesign). */
const HERO_SUITES: readonly SuiteId[] = ["rajwada-bagh", "kayal", "chaand-kalayein"];

/** Three painted designs under the buttons, below a laptop's width where the phone is lower. */
function HeroPaintings({ locale }: { locale: UiLocale }) {
  const designs = HERO_SUITES.flatMap((suite) => {
    const design = allDesigns().find((item) => item.suite === suite);
    const src = suiteImage(suite, "cover");
    return design && src ? [{ design, src }] : [];
  });
  if (designs.length === 0) return null;
  return (
    <ul className="grid w-full max-w-md grid-cols-3 gap-2 sm:gap-3 xl:hidden">
      {designs.map(({ design, src }, index) => {
        const { name } = designWords(design, locale);
        return (
          <li key={design.id}>
            <Link
              href={samplePath(design.id)}
              prefetch={false}
              className="group flex flex-col gap-1.5 rounded-lg text-start outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
            >
              <span className="relative block aspect-[9/16] overflow-hidden rounded-lg bg-night">
                <Image
                  src={src}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="(min-width: 40rem) 9rem, 31vw"
                  className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04] motion-still:transition-none motion-still:group-hover:scale-100"
                />
              </span>
              <span className="text-sm leading-tight">{name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** The phone's words in the page's language, as plain strings for the browser. */
function featuresCopy(locale: UiLocale): FeaturesCopy {
  const { homeFeatures } = landingText[locale];
  // The phone's counts are worked out here: the browser gets only their words
  const { people, added, guests, brideName, groomName, joiner, ...words } = homeFeatures.phone;
  const counts = [4, 2, 2];
  const total = homeFeatures.features.length;
  return {
    heading: homeFeatures.heading,
    pause: homeFeatures.pause,
    play: homeFeatures.play,
    features: homeFeatures.features.map((feature, index) => ({
      ...feature,
      label: homeFeatures.of(index + 1, total),
    })),
    phone: {
      ...words,
      names: `${brideName} ${joiner} ${groomName}`,
      guests: guests.map((name, index) => ({ name, people: people(counts[index]!) })),
      added: added(counts.reduce((sum, count) => sum + count, 0)),
    },
  };
}

/**
 * The first screen: what Shubh Invitation is, its two ways in (start free, or open a live
 * invitation), a phone beside them that shows what Shubh gives a family one feature at a
 * time, and every feature in one row beneath (owner, 2026-10-25: features, not steps).
 */
export function Hero({ locale }: { locale: UiLocale }) {
  const { hero, shell } = landingText[locale];
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[26rem] [mask-image:linear-gradient(to_bottom,black_20%,transparent)] xl:inset-y-0 xl:h-auto xl:[mask-image:linear-gradient(to_left,black_30%,transparent_80%),linear-gradient(to_bottom,black_75%,transparent)] xl:[mask-composite:intersect]"
      >
        <Image
          src="/home/doorway.webp"
          alt=""
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-[78%_center] opacity-15 xl:object-right xl:opacity-40 dark:opacity-10 xl:dark:opacity-25"
        />
      </div>
      <div className="mx-auto grid w-full max-w-site items-center gap-10 px-4 pt-8 pb-12 sm:px-6 sm:pt-12 lg:px-8 xl:grid-cols-[minmax(0,1fr)_auto] xl:gap-x-14 xl:gap-y-10 xl:pt-10 xl:pb-14">
        <div className="flex min-w-0 animate-rise flex-col gap-5 max-xl:mx-auto max-xl:max-w-2xl max-xl:items-center max-xl:text-center sm:gap-6">
          <p className="font-label text-sm text-accent-text">{hero.eyebrow}</p>
          <h1
            id="hero-title"
            className="font-display text-[2.25rem] leading-[1.06] sm:text-5xl xl:text-6xl"
          >
            {hero.title}
          </h1>
          <p className="max-w-[34rem] text-lg text-ink-muted sm:text-xl">{hero.body}</p>
          <div className="flex flex-wrap gap-3 max-xl:justify-center max-sm:w-full max-sm:max-w-xs max-sm:flex-col">
            <Button asChild size="lg">
              <Link href={pagePath({ kind: "gallery" }, locale)} data-hero-start>
                {shell.createInvite}
                <ArrowRight aria-hidden className="rtl:rotate-180" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              {/* Another demo design each time: the address picks one, so never prefetched */}
              <Link href={DEMO_PATH} prefetch={false} data-hero-sample>
                <PlayCircle aria-hidden className="text-accent-text" />
                {hero.sample}
              </Link>
            </Button>
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-ui text-ink-muted max-xl:justify-center">
            {hero.proof.map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <Check aria-hidden className="size-4 text-success" strokeWidth={2.5} />
                {item}
              </li>
            ))}
          </ul>
          <HeroPaintings locale={locale} />
          <TrustLine className="max-xl:justify-center" />
        </div>
        <HomeFeatures
          copy={featuresCopy(locale)}
          picture={suiteImage(FEATURE_SUITE, "cover") ?? ""}
          locale={locale}
        />
      </div>
    </section>
  );
}
