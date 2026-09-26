import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/page-transition";
import { Actions } from "./_sections/actions";
import { Choices } from "./_sections/choices";
import { Feedback } from "./_sections/feedback";
import { Forms } from "./_sections/forms";
import { Foundations } from "./_sections/foundations";
import { Navigation } from "./_sections/navigation";
import { Overlays } from "./_sections/overlays";
import { People } from "./_sections/people";
import { DesignHeader, DesignSideNav } from "./_sections/shell";
import { Surfaces } from "./_sections/surfaces";

export const metadata: Metadata = {
  title: "Design system",
  description: "Every Shubhdwar component in every state, in light and dark.",
  robots: { index: false, follow: false },
};

/*
 * A review page for the design system, not a product screen.
 * Its English copy is demo content, so it does not go through translations.
 */
export default function DesignPage() {
  return (
    <PageTransition>
      <div id="top" className="flex min-h-dvh flex-col">
        <DesignHeader />
        <div className="mx-auto grid w-full max-w-7xl flex-1 gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14 lg:px-8">
          <DesignSideNav />
          <main className="flex min-w-0 flex-col gap-20 sm:gap-24">
            <div className="flex flex-col gap-4">
              <p className="font-label text-xs tracking-[0.28em] text-accent-text uppercase">
                Step 2 · Design system
              </p>
              <h1 className="font-display text-[2.4rem] leading-[1.05] sm:text-6xl">
                The pieces every screen is built from
              </h1>
              <p className="max-w-2xl text-lg text-ink-muted">
                Each component in every state, in light and dark. Use the switches above to change
                the theme or turn motion off, and try everything with the keyboard.
              </p>
            </div>
            <Foundations />
            <Actions />
            <Forms />
            <Choices />
            <Surfaces />
            <Overlays />
            <Navigation />
            <People />
            <Feedback />
          </main>
        </div>
        <footer className="border-t border-line">
          <p className="mx-auto max-w-7xl px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-sm text-ink-muted sm:px-6 lg:px-8">
            Shubhdwar design system · tokens in <code>src/app/globals.css</code>, components in{" "}
            <code>src/components/ui</code>
          </p>
        </footer>
      </div>
    </PageTransition>
  );
}
