import type { MetadataRoute } from "next";
import { UI_LOCALES } from "@/i18n/locales";
import { POSTS } from "@/content/blog";
import { blogPostPath, translatedPost } from "@/lib/blog/posts";
import { pagePath, publicPages } from "@/lib/seo/paths";
import { absolute } from "@/lib/seo/structured-data";

/*
 * Every public page in every site language, each listing its other language versions, and
 * every blog post in the language it was written in.
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = publicPages().flatMap((page) => {
    const legal = page.kind === "privacy" || page.kind === "terms" || page.kind === "refunds";
    const languages = {
      ...Object.fromEntries(
        UI_LOCALES.map((code) => [`${code}-IN`, absolute(pagePath(page, code))]),
      ),
      "x-default": absolute(pagePath(page, "en")),
    };
    return UI_LOCALES.map((locale) => ({
      url: absolute(pagePath(page, locale)),
      changeFrequency: legal ? ("yearly" as const) : ("weekly" as const),
      priority: page.kind === "home" ? 1 : page.kind === "designs" ? 0.8 : legal ? 0.2 : 0.7,
      alternates: { languages },
    }));
  });
  const posts = POSTS.map((post) => {
    const languages = Object.fromEntries(
      UI_LOCALES.flatMap((locale) => {
        const slug = translatedPost(post.slug, locale);
        return slug ? [[`${locale}-IN`, absolute(blogPostPath(slug, locale))]] : [];
      }),
    );
    return {
      url: absolute(blogPostPath(post.slug, post.locale)),
      lastModified: post.updated,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: { languages },
    };
  });
  return [...pages, ...posts];
}
