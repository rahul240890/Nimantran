// Gujarati, Bengali and Tamil type for those pages; a page downloads only its own script's
import "@fontsource/hind-vadodara/400.css";
import "@fontsource/baloo-da-2/400.css";
import "@fontsource/catamaran/400.css";
import { RootHtml, rootMetadata, rootViewport } from "@/components/root-html";
import { isPrefixedLocale } from "@/i18n/locales";
import { BUILT_PRICING } from "@/lib/plans/design-defaults";
import { localeParams } from "./locale";

/*
 * The site's pages in each language but English, served static at /hi, /mr, /gu, /bn, /ta.
 * Any other first segment (/no-such-page) gets the English frame here, and its page answers
 * 404 with not-found.tsx: a root layout can't call notFound() itself, nothing above it would
 * catch it. Not dynamicParams = false: with it, a page here that's revalidated (pricing,
 * business details) comes back as a 404.
 */

export const generateStaticParams = localeParams;
export const viewport = rootViewport;

async function frameLocale(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  return isPrefixedLocale(locale) ? locale : "en";
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">) {
  return rootMetadata(await frameLocale(params));
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  return (
    <RootHtml locale={await frameLocale(params)} pricing={BUILT_PRICING}>
      {children}
    </RootHtml>
  );
}
