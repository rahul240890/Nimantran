import { PageTransition } from "@/components/motion/page-transition";
import { Faq } from "./faq";
import { Hero } from "./hero";
import { MusicDemo } from "./music-demo";
import { HowItWorks } from "./how-it-works";
import { Occasions } from "./occasions";
import { Pricing } from "./pricing";
import { TemplatesCarousel } from "./templates-carousel";
import { Waitlist } from "./waitlist";
import { SiteFooter } from "@/components/shell/site-footer";
import { SiteHeader } from "@/components/shell/site-header";
import type { UiLocale } from "@/i18n/locales";

/** The landing page in one site language; / and /hi render it. */
export function HomePage({ locale }: { locale: UiLocale }) {
  return (
    <PageTransition>
      <div className="relative isolate flex min-h-dvh flex-col">
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 overflow-x-clip outline-none">
          <MusicDemo />
          <Hero locale={locale} />
          <HowItWorks locale={locale} />
          <Occasions />
          <TemplatesCarousel />
          <Pricing locale={locale} />
          <Faq locale={locale} />
          <Waitlist />
        </main>
        <SiteFooter locale={locale} />
      </div>
    </PageTransition>
  );
}
