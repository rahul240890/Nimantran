import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource/rozha-one";
import "@fontsource/tenor-sans";
import "@fontsource-variable/karla";
import "@fontsource-variable/karla/wght-italic.css";
import "@fontsource-variable/noto-sans-devanagari";
import { Providers } from "@/components/providers";
import { landingText } from "@/i18n/copy";
import type { UiLocale } from "@/i18n/locales";
import { site } from "@/lib/site";
import { themeInitScript } from "@/lib/theme";
import "@/app/globals.css";

/*
 * The page frame every root layout shares: the language on <html>, the theme set before
 * paint, fonts and app-wide providers. The home pages (/ and /hi) and the app each have
 * their own root layout, so the home pages stay static in both languages.
 */

export function rootMetadata(locale: UiLocale): Metadata {
  const meta = landingText[locale].homeMeta;
  return {
    metadataBase: new URL(site.url),
    title: {
      default: meta.title,
      template: `%s · ${locale === "hi" ? site.nameDevanagari : site.name}`,
    },
    description: meta.description,
    applicationName: site.name,
    openGraph: {
      type: "website",
      siteName: site.name,
      title: site.name,
      description: meta.description,
      locale: locale === "hi" ? "hi_IN" : "en_IN",
    },
    twitter: { card: "summary_large_image", title: site.name, description: meta.description },
  };
}

export const rootViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf6ec" },
    { media: "(prefers-color-scheme: dark)", color: "#120f24" },
  ],
};

export function RootHtml({ locale, children }: { locale: UiLocale; children: ReactNode }) {
  return (
    // The theme script sets data-theme on <html> before hydration, so React must not flag it
    <html lang={locale} className="h-full" suppressHydrationWarning>
      {/* Rendered only by the app's root layouts, where a plain <head> is the right element */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
