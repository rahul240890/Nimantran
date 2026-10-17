import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { RootFrame } from "@/components/root-frame";
import { landingText } from "@/i18n/copy/landing";
import type { Pricing } from "@/lib/plans/design-tiers";
import { ogLocale, type UiLocale } from "@/i18n/locales";
import { sampleWords } from "@/lib/sample/words";
import { site, siteNameIn } from "@/lib/site";

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
      template: `%s · ${siteNameIn(locale)}`,
    },
    description: meta.description,
    applicationName: site.shortName,
    appleWebApp: { title: site.shortName },
    // The cream icon for light screens, the night one for dark; favicon.ico and apple-icon.png are the cream one.
    icons: {
      icon: [
        {
          url: "/brand/icon-light.png",
          type: "image/png",
          sizes: "192x192",
          media: "(prefers-color-scheme: light)",
        },
        {
          url: "/brand/icon-dark.png",
          type: "image/png",
          sizes: "192x192",
          media: "(prefers-color-scheme: dark)",
        },
      ],
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: site.name,
      description: meta.description,
      locale: ogLocale(locale),
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

export function RootHtml({
  locale,
  pricing,
  children,
}: {
  locale: UiLocale;
  /** The admin's design tiers and prices; the defaults where a layout can't read them. */
  pricing?: Pricing;
  children: ReactNode;
}) {
  return (
    <RootFrame locale={locale} pricing={pricing} sampleWords={sampleWords(locale)}>
      {children}
    </RootFrame>
  );
}
