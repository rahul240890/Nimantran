"use client";

import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocaleProvider } from "@/i18n/client";
import { uiText } from "@/i18n/copy";
import type { UiLocale } from "@/i18n/locales";

/** App-wide client providers: the page's language, one tooltip delay, one toast stack. */
export function Providers({ locale, children }: { locale: UiLocale; children: ReactNode }) {
  const { uiStrings } = uiText[locale];
  return (
    <LocaleProvider locale={locale}>
      <TooltipProvider delayDuration={400} skipDelayDuration={200}>
        {children}
        <Toaster closeLabel={uiStrings.close} regionLabel={uiStrings.notifications} />
      </TooltipProvider>
    </LocaleProvider>
  );
}
