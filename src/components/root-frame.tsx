import type { ReactNode } from "react";
// The site's headings: Fraunces, and for Hindi and Marathi one weight of Noto Serif Devanagari
import "@fontsource-variable/fraunces/wght.css";
import "@fontsource/noto-serif-devanagari/devanagari-500.css";
// The lettering invitations keep (globals.css, [data-invitation]); a page downloads a face only when it shows it
import "@fontsource/rozha-one";
import "@fontsource/tenor-sans";
import "@fontsource-variable/karla";
import "@fontsource-variable/karla/wght-italic.css";
import "@fontsource-variable/noto-sans-devanagari";
import { Providers } from "@/components/providers";
import { SiteAnalytics } from "@/components/shell/site-analytics";
import { VisitCounter } from "@/components/shell/visit-counter";
import type { UiLocale } from "@/i18n/locales";
import type { Pricing } from "@/lib/plans/design-tiers";
import type { SampleWords } from "@/lib/sample/words";
import { themeInitScript } from "@/lib/theme";
import "@/app/globals.css";

/*
 * <html> and <body> with the theme script, fonts and providers, and nothing that reads the
 * site's copy: global-error.tsx draws it in the browser, and every page loads that file
 * ahead of time, so whatever this imports every visitor downloads. The layouts' words come
 * through RootHtml (root-html.tsx).
 */
export function RootFrame({
  locale,
  pricing,
  sampleWords,
  children,
}: {
  locale: UiLocale;
  /** The admin's design tiers and prices; the defaults where a layout can't read them. */
  pricing?: Pricing;
  /** The words the gallery's previews print (lib/sample/words.ts). */
  sampleWords?: SampleWords;
  children: ReactNode;
}) {
  return (
    // The theme script sets data-theme on <html> before hydration, so React must not flag it
    <html lang={locale} className="h-full" suppressHydrationWarning>
      {/* Rendered only by the app's root layouts, where a plain <head> is the right element */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <Providers locale={locale} pricing={pricing} sampleWords={sampleWords}>
          {children}
        </Providers>
        {/* Counted only on the live site, where Analytics is switched on (docs/LAUNCH.md) */}
        {process.env.VERCEL_ENV === "production" && (
          <>
            <SiteAnalytics />
            {/* Our own counts, for the admin's Visitors page (lib/visits.ts) */}
            <VisitCounter />
          </>
        )}
      </body>
    </html>
  );
}
