import { ArrowRight, Star } from "lucide-react";
import { Image } from "@/components/ui/image";
import Link from "next/link";
import { SocialIcon } from "@/components/brand/social-links";
import { helpPath } from "@/components/shell/nav-links";
import { landingText } from "@/i18n/copy/landing";
import type { UiLocale } from "@/i18n/locales";
import { suiteImage } from "@/lib/gallery/catalog";
import { pagePath } from "@/lib/seo/paths";

/**
 * Two ways on for a family short of time, side by side on a wide screen: the Complete
 * Wedding Set, which opens the package with every piece in it, and We'll make it for you,
 * a WhatsApp chat with the request already written.
 */
export function HomeHelp({ locale }: { locale: UiLocale }) {
  const { homeHelp } = landingText[locale];
  const cta =
    "mt-auto inline-flex min-h-11 items-center gap-2 self-start rounded-full px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-3";
  return (
    <section aria-label={`${homeHelp.set.eyebrow}, ${homeHelp.make.title}`}>
      <ul className="mx-auto grid w-full max-w-site gap-4 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.4fr_1fr] lg:gap-6 lg:px-8">
        <li className="relative isolate flex min-h-72 flex-col overflow-hidden rounded-3xl bg-night p-6 text-card-ivory shadow-overlay sm:p-8">
          <div
            aria-hidden
            className="absolute inset-y-0 end-0 -z-10 w-full [mask-image:linear-gradient(to_left,black_25%,transparent_80%)] sm:w-2/3"
          >
            <Image
              src={suiteImage("rajwada-bagh", "baraat") ?? suiteImage("rajwada-bagh") ?? ""}
              alt=""
              fill
              sizes="(min-width: 64rem) 36rem, 100vw"
              className="object-cover object-top opacity-40 sm:opacity-70"
            />
          </div>
          <div className="flex max-w-md flex-1 flex-col gap-3">
            <p className="inline-flex items-center gap-2 font-label text-xs tracking-[0.24em] text-marigold uppercase">
              <Star aria-hidden className="size-4 fill-marigold" />
              {homeHelp.set.eyebrow}
            </p>
            <h2 className="font-display text-2xl leading-tight sm:text-3xl">
              {homeHelp.set.title}
            </h2>
            <p className="text-card-ivory/85">{homeHelp.set.body}</p>
            <Link
              href={`${pagePath({ kind: "pricing" }, locale)}#plan-grand`}
              className={`${cta} mt-3 bg-marigold text-on-marigold hover:bg-marigold-strong focus-visible:outline-marigold`}
            >
              {homeHelp.set.cta}
              <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />
            </Link>
          </div>
        </li>
        <li className="flex min-h-72 flex-col gap-3 rounded-3xl border border-line bg-surface p-6 shadow-raised sm:p-8">
          <span className="grid size-12 place-items-center rounded-full bg-success/15">
            <SocialIcon channel="whatsapp" className="size-6 text-success" />
          </span>
          <p className="font-label text-xs tracking-[0.24em] text-accent-text uppercase">
            {homeHelp.make.eyebrow}
          </p>
          <h2 className="font-display text-2xl leading-tight sm:text-3xl">{homeHelp.make.title}</h2>
          <p className="text-ink-muted">{homeHelp.make.body}</p>
          <a
            href={helpPath(locale, "make")}
            target="_blank"
            rel="noopener noreferrer"
            className={`${cta} mt-3 border border-success/40 bg-success/10 text-ink hover:bg-success/20 focus-visible:outline-ring`}
          >
            <SocialIcon channel="whatsapp" className="size-4 text-success" />
            {homeHelp.make.cta}
          </a>
        </li>
      </ul>
    </section>
  );
}
