"use client";

import type { ReactNode } from "react";
import { PricingProvider } from "@/components/pricing/pricing-provider";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocaleProvider } from "@/i18n/client";
import { uiText } from "@/i18n/copy/ui";
import type { UiLocale } from "@/i18n/locales";
import { DEFAULT_PRICING, type Pricing } from "@/lib/plans/design-tiers";
import type { SampleWords } from "@/lib/sample/words";
import { SampleWordsProvider } from "./gallery/sample-words";

/**
 * App-wide client providers: the page's language, design tiers and prices, one tooltip
 * delay, one toast stack.
 */
export function Providers({
  locale,
  pricing = DEFAULT_PRICING,
  sampleWords = { functions: {}, occasions: {} },
  children,
}: {
  locale: UiLocale;
  pricing?: Pricing;
  /** The words design previews print (lib/sample/words.ts). */
  sampleWords?: SampleWords;
  children: ReactNode;
}) {
  const { uiStrings } = uiText[locale];
  return (
    <LocaleProvider locale={locale}>
      <PricingProvider pricing={pricing}>
        <TooltipProvider delayDuration={400} skipDelayDuration={200}>
          <SampleWordsProvider words={sampleWords}>{children}</SampleWordsProvider>
          <Toaster closeLabel={uiStrings.close} regionLabel={uiStrings.notifications} />
        </TooltipProvider>
      </PricingProvider>
    </LocaleProvider>
  );
}
