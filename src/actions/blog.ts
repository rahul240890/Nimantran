"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAdmin } from "@/lib/admin/access";
import { draftPost, testAi, type PostDraft } from "@/lib/blog/ai-draft";
import { blogPostPath } from "@/lib/blog/posts";
import { adminPost, deletePost, savePost, uploadCover, type SaveResult } from "@/lib/blog/store";
import { isCategoryId } from "@/lib/categories/catalog";
import { UI_LOCALES } from "@/i18n/locales";

/* Admin, Blog: writing, publishing and removing posts, their covers, and AI drafts. */

const postSchema = z.object({
  id: z.uuid().nullable(),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    .max(80),
  locale: z.enum(UI_LOCALES),
  title: z.string().trim().min(1).max(70),
  description: z.string().trim().max(200),
  heading: z.string().trim().min(1).max(160),
  intro: z.string().trim().max(1200),
  body: z.string().max(60000),
  faq: z.string().max(8000),
  occasion: z.string().refine(isCategoryId),
  keywords: z.array(z.string().trim().min(1).max(80)).max(20),
  coverPath: z
    .string()
    .regex(/^covers\/[0-9a-f-]{36}\.(jpg|png|webp)$/)
    .nullable(),
  coverAlt: z.string().trim().max(200),
  status: z.enum(["draft", "published"]),
  publishedAt: z.iso.datetime({ offset: true }),
});

/** Refreshes the blog pages a post appears on, so a change shows at once. */
function refreshBlog(slug: string, locale: (typeof UI_LOCALES)[number]) {
  revalidatePath("/admin/blog");
  for (const code of UI_LOCALES) revalidatePath(blogPostPath(null, code));
  revalidatePath(blogPostPath(slug, locale));
  revalidatePath("/sitemap.xml");
}

export async function saveBlogPost(
  input: unknown,
): Promise<SaveResult | { ok: false; reason: "invalid" } | null> {
  const admin = await getAdmin();
  if (!admin) return null;
  const parsed = postSchema.safeParse(input);
  if (!parsed.success) return { ok: false, reason: "invalid" };
  const post = { ...parsed.data, occasion: parsed.data.occasion as never };
  const before = post.id ? await adminPost(post.id) : null;
  const result = await savePost(post, admin.account);
  if (result.ok) {
    refreshBlog(post.slug, post.locale);
    if (before && (before.slug !== post.slug || before.locale !== post.locale)) {
      revalidatePath(blogPostPath(before.slug, before.locale));
    }
  }
  return result;
}

export async function removeBlogPost(id: unknown): Promise<boolean> {
  if (!(await getAdmin())) return false;
  const parsed = z.uuid().safeParse(id);
  if (!parsed.success) return false;
  const post = await deletePost(parsed.data);
  if (post) refreshBlog(post.slug, post.locale);
  return Boolean(post);
}

export async function uploadBlogCover(form: FormData): Promise<string | null> {
  if (!(await getAdmin())) return null;
  const file = form.get("cover");
  return file instanceof File ? uploadCover(file) : null;
}

export async function draftBlogPost(
  input: unknown,
): Promise<{ ok: true; draft: PostDraft } | { ok: false; reason: "off" | "failed" } | null> {
  if (!(await getAdmin())) return null;
  const parsed = z
    .object({
      keyword: z.string().trim().min(3).max(120),
      locale: z.enum(UI_LOCALES),
      occasion: z.string().refine(isCategoryId),
    })
    .safeParse(input);
  if (!parsed.success) return { ok: false, reason: "failed" };
  const draft = await draftPost(parsed.data);
  if (draft === "off") return { ok: false, reason: "off" };
  return draft ? { ok: true, draft } : { ok: false, reason: "failed" };
}

export async function testAiConnection(): Promise<"ok" | "off" | "failed" | null> {
  if (!(await getAdmin())) return null;
  return testAi();
}
