import { ArrowRight, Check, PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TrustLine } from "@/components/reviews/trust-line";
import { Button } from "@/components/ui/button";
import { landingText } from "@/i18n/copy/landing";
import type { UiLocale } from "@/i18n/locales";
import { suiteImage } from "@/lib/gallery/catalog";
import { DEMO_PATH } from "@/lib/sample/paths";
import { pagePath } from "@/lib/seo/paths";
import type { SuiteId } from "@/lib/suites/catalog";
import { HomeFlow, type FlowCopy } from "./home-flow";

/** The covers on the phone's first screen; the second is the one chosen and filled in. */
const FLOW_SUITES = [
  "kayal",
  "rajwada-bagh",
  "noor-bagh",
  "rajbari",
  "shahi-savari",
  "peshwai-wada",
] as const satisfies readonly SuiteId[];

/** The phone's words in the page's language, as plain strings for the browser. */
function flowCopy(locale: UiLocale): FlowCopy {
  const { homeFlow } = landingText[locale];
  // The phone's counts are worked out here: the browser gets only their words
  const { people, tally, guests, ...words } = homeFlow.phone;
  const counts = [4, 2, 2];
  return {
    heading: homeFlow.heading,
    pause: homeFlow.pause,
    play: homeFlow.play,
    steps: homeFlow.steps.map((step, index) => ({
      ...step,
      label: homeFlow.stepOf(index + 1, homeFlow.steps.length),
    })),
    phone: {
      ...words,
      cardLang: locale === "en" ? "hi" : undefined,
      guests: guests.map((name, index) => ({ name, people: people(counts[index]!) })),
      tally: tally(counts.reduce((sum, count) => sum + count, 0)),
    },
  };
}

/**
 * The first screen: what Shubh Invitation is, its two ways in (start free, or open a live
 * invitation), and a phone beside them that plays the whole journey, from choosing a design
 * to the guests' replies, so a family sees in a few seconds how it works.
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
      <div className="mx-auto grid w-full max-w-site items-center gap-10 px-4 pt-8 pb-12 sm:px-6 sm:pt-12 lg:px-8 xl:grid-cols-[minmax(0,1fr)_auto] xl:gap-14 xl:pt-10 xl:pb-14">
        <div className="flex min-w-0 animate-rise flex-col gap-5 max-xl:mx-auto max-xl:max-w-2xl max-xl:items-center max-xl:text-center sm:gap-6">
          <p className="font-label text-xs tracking-[0.28em] text-accent-text uppercase">
            {hero.eyebrow}
          </p>
          <h1
            id="hero-title"
            className="font-display text-[2.2rem] leading-[1.04] sm:text-5xl xl:text-6xl"
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
          <TrustLine className="max-xl:justify-center" />
        </div>
        <HomeFlow
          copy={flowCopy(locale)}
          pictures={FLOW_SUITES.map((suite) => suiteImage(suite, "cover") ?? "")}
        />
      </div>
    </section>
  );
}
