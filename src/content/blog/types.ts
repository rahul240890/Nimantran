import type { UiLocale } from "@/i18n/locales";
import type { CategoryId } from "@/lib/categories/catalog";

/*
 * The shape of a blog post (docs/BLOG.md). Posts are data, written in one language each,
 * and rendered by src/components/blog. Paragraphs may carry [a link](/path) and **bold**.
 */

/** Messages a reader can copy as they are, such as invitation wording. */
export type Wording = { label?: string; text: string; lang?: string };

export type PostBlock =
  | string
  | { h2: string; id: string }
  | { h3: string }
  | { list: readonly string[]; ordered?: boolean }
  | { wording: readonly Wording[] }
  | { tip: string };

export type BlogPost = {
  /** The address: /blog/<slug>, or /hi/blog/<slug> for a Hindi post. */
  slug: string;
  locale: UiLocale;
  /** The same post in another language shares this key. */
  pair?: string;
  /** For the browser tab and search results: 48 characters at most. */
  title: string;
  /** For search results: 155 characters at most. */
  description: string;
  heading: string;
  intro: string;
  /** YYYY-MM-DD. */
  published: string;
  updated: string;
  /** The occasion the post leads to: its designs page and the editor. */
  occasion: CategoryId;
  /** The search phrases the post is written for (docs/BLOG.md); not shown. */
  keywords: readonly string[];
  body: readonly PostBlock[];
  faq?: readonly { q: string; a: string }[];
};
