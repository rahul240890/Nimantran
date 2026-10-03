import "server-only";
import type { EditorPost } from "@/components/admin/blog-editor";
import { CATEGORIES, CATEGORY_IDS } from "@/lib/categories/catalog";
import { indiaLocal } from "./india-time";
import { coverUrl, type AdminPost } from "./store";

/* Turning a stored post into what the admin's editor holds, and the occasion choices. */

export function toEditorPost(post: AdminPost | null): EditorPost {
  if (!post) {
    return {
      id: null,
      slug: "",
      locale: "en",
      title: "",
      description: "",
      heading: "",
      intro: "",
      body: "",
      faq: "",
      occasion: "wedding",
      keywords: "",
      coverPath: null,
      coverUrl: null,
      coverAlt: "",
      status: "draft",
      publishedLocal: indiaLocal(new Date().toISOString()),
    };
  }
  return {
    ...post,
    keywords: post.keywords.join(", "),
    coverUrl: coverUrl(post.coverPath),
    publishedLocal: indiaLocal(post.publishedAt),
  };
}

export const occasionOptions = () =>
  CATEGORY_IDS.map((id) => ({ value: id, label: CATEGORIES[id].names.en })).sort((a, b) =>
    a.label.localeCompare(b.label),
  );
