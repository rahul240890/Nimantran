import { POSTS } from "@/content/blog";
import type { BlogPost } from "@/content/blog/types";
import { homePath, type UiLocale } from "@/i18n/locales";
import { CATEGORIES } from "@/lib/categories/catalog";

/* The blog's posts, newest first, and their addresses. */

export function postsIn(locale: UiLocale): BlogPost[] {
  return POSTS.filter((post) => post.locale === locale).sort((a, b) =>
    b.published.localeCompare(a.published),
  );
}

export function findPost(slug: string, locale: UiLocale): BlogPost | undefined {
  return POSTS.find((post) => post.slug === slug && post.locale === locale);
}

/** The slug of the same post in another language, if it has been written. */
export function translatedPost(slug: string, locale: UiLocale): string | undefined {
  const post = POSTS.find((item) => item.slug === slug);
  if (!post) return undefined;
  if (post.locale === locale) return post.slug;
  if (!post.pair) return undefined;
  return POSTS.find((item) => item.locale === locale && item.pair === post.pair)?.slug;
}

/** /blog/<slug> in English, /hi/blog/<slug> in Hindi; the blog's front page without a slug. */
export function blogPostPath(slug: string | null, locale: UiLocale): string {
  const blog = locale === "en" ? "/blog" : `${homePath(locale)}/blog`;
  return slug ? `${blog}/${slug}` : blog;
}

/** About how long a post takes to read, in minutes. */
export function readingMinutes(post: BlogPost): number {
  const text = post.body
    .map((block) =>
      typeof block === "string"
        ? block
        : "list" in block
          ? block.list.join(" ")
          : "wording" in block
            ? block.wording.map((item) => item.text).join(" ")
            : "tip" in block
              ? block.tip
              : "h2" in block
                ? block.h2
                : block.h3,
    )
    .join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** A [link](/path) or **bold** words inside a post's text. */
export const INLINE_TOKEN = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;

/** Every link a post carries, in its paragraphs, lists, tips and answers. */
export function postLinks(post: BlogPost): string[] {
  const texts = post.body.flatMap((block) =>
    typeof block === "string"
      ? [block]
      : "list" in block
        ? block.list
        : "tip" in block
          ? [block.tip]
          : [],
  );
  return texts.flatMap((text) =>
    [...text.matchAll(INLINE_TOKEN)].flatMap((match) => (match[2] ? [match[2]] : [])),
  );
}

/**
 * The posts to suggest under a post: the ones it links to or that link to it first, then
 * the same occasion, then the same kind of occasion, then the newest. Readers who came
 * from search find their next answer, and search engines see the posts on a topic linked.
 */
export function relatedPosts(post: BlogPost, posts: readonly BlogPost[], count = 4): BlogPost[] {
  const path = blogPostPath(post.slug, post.locale);
  const linksOut = new Set(postLinks(post));
  const group = (item: BlogPost) => CATEGORIES[item.occasion]?.group;
  const score = (item: BlogPost) =>
    (linksOut.has(blogPostPath(item.slug, item.locale)) ? 3 : 0) +
    (postLinks(item).includes(path) ? 2 : 0) +
    (item.occasion === post.occasion ? 2 : 0) +
    (group(item) === group(post) ? 1 : 0);
  return posts
    .filter((item) => item.slug !== post.slug || item.locale !== post.locale)
    .map((item) => ({ item, score: score(item) }))
    .sort((a, b) => b.score - a.score || b.item.published.localeCompare(a.item.published))
    .slice(0, count)
    .map(({ item }) => item);
}
