import {
  ArrowRight,
  BadgeIndianRupee,
  Clapperboard,
  ContactRound,
  DoorOpen,
  Eye,
  HeartHandshake,
  Images,
  Languages,
  Link2,
  ListChecks,
  Mails,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Image } from "@/components/ui/image";
import { landingText } from "@/i18n/copy/landing";
import type { UiLocale } from "@/i18n/locales";
import { DEMO_PATH } from "@/lib/sample/paths";
import { Section } from "./section";

type Point = keyof (typeof landingText)["en"]["homeWhy"]["points"];

/** The points after the first two, in the owner's order, each with its sign. */
const REST: readonly [Point, LucideIcon][] = [
  ["oneLink", Link2],
  ["social", Clapperboard],
  ["guests", ContactRound],
  ["language", Languages],
  ["replies", ListChecks],
  ["opening", DoorOpen],
  ["cards", Mails],
  ["photos", Images],
  ["family", HeartHandshake],
];

/** The painting the lead point's phone shows, a design guests open every day. */
const PHONE_PAINTING = "/suites/rajwada-bagh/cover.webp";

/**
 * Why Shubh (owner, 2026-10-24): what a family gets, in plain words, once they have seen the
 * designs (owner, 2026-10-25: after them, not at the top). Seeing it before paying leads, on
 * night with a phone showing a real design beside it; paying later sits next to it in
 * marigold; the rest follow as a grid, each a row of sign and words on a phone.
 */
export function HomeWhy({ locale }: { locale: UiLocale }) {
  const { homeWhy } = landingText[locale];
  const { preview, payLater } = homeWhy.points;
  return (
    <Section id="why" eyebrow={homeWhy.eyebrow} title={homeWhy.title} intro={homeWhy.intro}>
      {/* One rise for the whole grid: a scroll-timed rise on each of the eleven cards held
          Chrome's page change for four seconds while it pictured the page on the way out */}
      <ul className="grid reveal-on-scroll gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
        <li className="relative isolate flex overflow-hidden rounded-3xl bg-night p-6 text-card-ivory shadow-overlay sm:col-span-2 sm:p-8">
          <span
            aria-hidden
            className="absolute -end-16 -top-24 -z-10 size-72 rounded-full bg-marigold/20 blur-3xl"
          />
          <div className="flex w-full items-center gap-6 sm:gap-10">
            <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
              <span className="grid size-12 place-items-center rounded-full bg-marigold text-on-marigold">
                <Eye aria-hidden className="size-6" />
              </span>
              <h3 className="font-display text-2xl leading-tight sm:text-3xl">{preview.title}</h3>
              <p className="max-w-md text-card-ivory/85">{preview.body}</p>
              <Link
                href={DEMO_PATH}
                prefetch={false}
                className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-full bg-marigold px-5 text-sm font-semibold text-on-marigold transition-colors hover:bg-marigold-strong focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-marigold"
              >
                {homeWhy.demo}
                <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />
              </Link>
            </div>
            {/* A phone with a real design on it, live: what the host sees while making it */}
            <div
              aria-hidden
              className="relative hidden aspect-[9/16] w-36 shrink-0 overflow-hidden rounded-[1.6rem] border-[5px] border-card-ivory/20 bg-night shadow-float sm:block lg:w-40"
            >
              <Image
                src={PHONE_PAINTING}
                alt=""
                fill
                // The hero's phone asks for this painting at its own width (home-features.tsx), so
                // asking the same here finds it already in rather than fetching another size
                sizes="17rem"
                className="object-cover object-top"
              />
              <span className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-night to-transparent" />
              <span className="absolute start-1/2 top-2 h-1.5 w-10 -translate-x-1/2 rounded-full bg-card-ivory/30 rtl:translate-x-1/2" />
              <span className="absolute end-2 bottom-2 grid size-3 place-items-center">
                <span className="absolute size-3 animate-ping rounded-full bg-success/50 motion-still:animate-none" />
                <span className="size-2 rounded-full bg-success" />
              </span>
            </div>
          </div>
        </li>
        <li className="flex flex-col items-start gap-3 rounded-3xl border border-marigold/40 bg-marigold/10 p-6 shadow-raised sm:p-8">
          <span className="grid size-12 place-items-center rounded-full bg-marigold/20 text-accent-text">
            <BadgeIndianRupee aria-hidden className="size-6" />
          </span>
          <p className="rounded-full bg-marigold px-3 py-1 font-label text-xs tracking-[0.18em] text-on-marigold uppercase">
            {homeWhy.free}
          </p>
          <h3 className="font-display text-2xl leading-tight text-ink">{payLater.title}</h3>
          <p className="text-ink-muted">{payLater.body}</p>
        </li>
        {REST.map(([point, Icon]) => {
          const { title, body } = homeWhy.points[point];
          return (
            <li
              key={point}
              data-why={point}
              className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-5 shadow-raised transition-shadow duration-300 hover:shadow-float sm:flex-col sm:gap-3 sm:p-6 motion-still:transition-none"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-marigold/15 text-accent-text">
                <Icon aria-hidden className="size-5" />
              </span>
              <div className="flex min-w-0 flex-col gap-1.5">
                <h3 className="font-display text-xl leading-tight text-ink">{title}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{body}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
