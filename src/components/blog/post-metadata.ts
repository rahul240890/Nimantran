import type { Metadata } from "next";
import type { BlogPost } from "@/content/blog/types";
import { blogPostPath, translatedPost } from "@/lib/blog/posts";
import { UI_LOCALES } from "@/i18n/locales";
import { site } from "@/lib/site";

/* A post's title, description, address and link preview; other languages only where written. */
export function postMetadata(post: BlogPost): Metadata {
  const path = blogPostPath(post.slug, post.locale);
  const languages = Object.fromEntries(
    UI_LOCALES.flatMap((locale) => {
      const slug = translatedPost(post.slug, locale);
      return slug ? [[`${locale}-IN`, blogPostPath(slug, locale)]] : [];
    }),
  );
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: path, languages },
    openGraph: {
      type: "article",
      siteName: site.name,
      title: post.title,
      description: post.description,
      url: path,
      locale: post.locale === "hi" ? "hi_IN" : "en_IN",
      publishedTime: post.published,
      modifiedTime: post.updated,
      ...(post.cover ? { images: [{ url: post.cover.src, alt: post.cover.alt }] } : {}),
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  };
}
