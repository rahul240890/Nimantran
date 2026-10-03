import { site } from "@/lib/site";
import type { UiLocale } from "@/i18n/locales";

/*
 * Structured data (schema.org JSON-LD) for the public pages, so search results can show
 * the site's name, the FAQ, breadcrumbs and the design gallery. Only facts that are true
 * today: the free plan is the one offer that exists.
 */

type Thing = Record<string, unknown>;

export const absolute = (path: string) => new URL(path, site.url).toString();

const inLanguage = (locale: UiLocale) => (locale === "hi" ? "hi-IN" : "en-IN");

export function organization(): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absolute("/#organization"),
    name: site.name,
    alternateName: site.nameDevanagari,
    url: absolute("/"),
    logo: absolute("/icon.svg"),
  };
}

export function website(locale: UiLocale, homeUrl: string): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    alternateName: site.nameDevanagari,
    url: absolute(homeUrl),
    inLanguage: inLanguage(locale),
    publisher: { "@id": absolute("/#organization") },
  };
}

export function application(locale: UiLocale, description: string): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.name,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web, Android, iOS",
    url: absolute("/"),
    description,
    inLanguage: inLanguage(locale),
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    publisher: { "@id": absolute("/#organization") },
  };
}

export function faqPage(items: readonly { q: string; a: string }[], locale: UiLocale): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: inLanguage(locale),
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbList(items: readonly { name: string; path: string }[]): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

export function itemList(items: readonly { name: string; path: string }[]): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absolute(item.path),
    })),
  };
}

export function blogPosting(post: {
  heading: string;
  description: string;
  published: string;
  updated: string;
  path: string;
  locale: UiLocale;
  image?: string;
}): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.heading,
    description: post.description,
    datePublished: post.published,
    dateModified: post.updated,
    inLanguage: inLanguage(post.locale),
    mainEntityOfPage: absolute(post.path),
    url: absolute(post.path),
    ...(post.image ? { image: absolute(post.image) } : {}),
    author: { "@type": "Organization", name: site.name, url: absolute("/") },
    publisher: organization(),
  };
}

/** JSON for a script tag: "<" is escaped so no text can close the tag early. */
export function jsonLdText(data: Thing | Thing[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
