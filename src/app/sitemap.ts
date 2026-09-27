import type { MetadataRoute } from "next";
import { UI_LOCALES } from "@/i18n/locales";
import { pagePath, publicPages } from "@/lib/seo/paths";
import { absolute } from "@/lib/seo/structured-data";

/* Every public page in every site language, each listing its other language versions. */

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPages().flatMap((page) => {
    const languages = {
      ...Object.fromEntries(
        UI_LOCALES.map((code) => [`${code}-IN`, absolute(pagePath(page, code))]),
      ),
      "x-default": absolute(pagePath(page, "en")),
    };
    return UI_LOCALES.map((locale) => ({
      url: absolute(pagePath(page, locale)),
      changeFrequency: "weekly" as const,
      priority: page.kind === "home" ? 1 : page.kind === "designs" ? 0.8 : 0.7,
      alternates: { languages },
    }));
  });
}
