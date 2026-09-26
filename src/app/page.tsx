import { PageTransition } from "@/components/motion/page-transition";
import { Faq } from "@/components/landing/faq";
import { Hero } from "@/components/landing/hero";
import { MusicDemo } from "@/components/landing/music-demo";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Occasions } from "@/components/landing/occasions";
import { Pricing } from "@/components/landing/pricing";
import { TemplatesCarousel } from "@/components/landing/templates-carousel";
import { Waitlist } from "@/components/landing/waitlist";
import { SiteFooter } from "@/components/shell/site-footer";
import { SiteHeader } from "@/components/shell/site-header";

export default function HomePage() {
  return (
    <PageTransition>
      <div className="relative isolate flex min-h-dvh flex-col">
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 overflow-x-clip outline-none">
          <MusicDemo />
          <Hero />
          <HowItWorks />
          <Occasions />
          <TemplatesCarousel />
          <Pricing />
          <Faq />
          <Waitlist />
        </main>
        <SiteFooter />
      </div>
    </PageTransition>
  );
}
