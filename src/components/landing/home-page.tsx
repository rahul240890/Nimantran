import { PageTransition } from "@/components/motion/page-transition";
import { Closing } from "./closing";
import { Faq } from "./faq";
import { Hero } from "./hero";
import { HomeDesigns } from "./home-designs";
import { HomeHelp } from "./home-help";
import { HomeOccasions } from "./home-occasions";
import { HomeOffers } from "@/components/offers/offers";
import { HomeReviews } from "@/components/reviews/home-reviews";
import { OfferBar } from "@/components/offers/offer-bar";
import { SiteFooter } from "@/components/shell/site-footer";
import { SiteHeader } from "@/components/shell/site-header";
import { siteMenu } from "@/components/shell/site-menu";
import { JsonLd } from "@/components/seo/json-ld";
import { landingText } from "@/i18n/copy/landing";
import { homePath, type UiLocale } from "@/i18n/locales";
import { application, faqPage, organization, website } from "@/lib/seo/structured-data";

/**
 * The landing page in one site language; / and /hi render it. Kept to what helps a family
 * decide quickly: a phone that shows how it works beside Start free, the occasions, rows of
 * designs, two ways on for a family short of time, then the questions families ask.
 */
export function HomePage({ locale }: { locale: UiLocale }) {
  const { faq, homeMeta } = landingText[locale];
  return (
    <PageTransition>
      <div className="relative isolate flex min-h-dvh flex-col">
        <SiteHeader menu={siteMenu(locale)} />
        {/* Shown above the header, but after it for the keyboard: the skip link stays first */}
        <OfferBar />
        <main id="main" tabIndex={-1} className="flex-1 overflow-x-clip outline-none">
          <Hero locale={locale} />
          <HomeOccasions locale={locale} />
          <HomeDesigns locale={locale} />
          <HomeHelp locale={locale} />
          <HomeReviews />
          <HomeOffers locale={locale} />
          <Faq locale={locale} />
          <Closing locale={locale} />
        </main>
        <SiteFooter locale={locale} />
        <JsonLd
          data={[
            organization(),
            website(locale, homePath(locale)),
            application(locale, homeMeta.description),
            faqPage(faq.items, locale),
          ]}
        />
      </div>
    </PageTransition>
  );
}
