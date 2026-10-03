import "server-only";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { POSTS } from "@/content/blog";
import type { BlogPost } from "@/content/blog/types";
import type { Account } from "@/lib/auth/account";
import { authMode, supabaseEnv } from "@/lib/auth/mode";
import { isCategoryId, type CategoryId } from "@/lib/categories/catalog";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseService } from "@/lib/supabase/service";
import type { UiLocale } from "@/i18n/locales";
import { parseBody, parseFaq } from "./markup";

/*
 * Posts written on Admin, Blog, kept in the blog_posts table, with their covers in the
 * public "blog" bucket. The blog shows them beside the posts that ship with the code
 * (src/content/blog); a post goes live when it is published and its date has come.
 */

export type PostStatus = "draft" | "published";

/** A post as the admin edits it: the light markup, not yet turned into blocks. */
export type AdminPost = {
  id: string;
  slug: string;
  locale: UiLocale;
  title: string;
  description: string;
  heading: string;
  intro: string;
  body: string;
  faq: string;
  occasion: CategoryId;
  keywords: string[];
  coverPath: string | null;
  coverAlt: string;
  status: PostStatus;
  publishedAt: string;
  updatedAt: string;
};

export type PostInput = Omit<AdminPost, "id" | "updatedAt"> & { id: string | null };

type PostRow = {
  id: string;
  slug: string;
  locale: string;
  title: string;
  description: string;
  heading: string;
  intro: string;
  body: string;
  faq: string;
  occasion: string;
  keywords: string[];
  cover_path: string | null;
  cover_alt: string;
  status: string;
  published_at: string;
  updated_at: string;
};

const COLUMNS =
  "id, slug, locale, title, description, heading, intro, body, faq, occasion, keywords, cover_path, cover_alt, status, published_at, updated_at";

export const COVER_BUCKET = "blog";

function fromRow(row: PostRow): AdminPost {
  return {
    id: row.id,
    slug: row.slug,
    locale: row.locale === "hi" ? "hi" : "en",
    title: row.title,
    description: row.description,
    heading: row.heading,
    intro: row.intro,
    body: row.body,
    faq: row.faq,
    occasion: isCategoryId(row.occasion) ? row.occasion : "wedding",
    keywords: row.keywords,
    coverPath: row.cover_path,
    coverAlt: row.cover_alt,
    status: row.status === "published" ? "published" : "draft",
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  };
}

function toRow(post: PostInput) {
  return {
    slug: post.slug,
    locale: post.locale,
    title: post.title,
    description: post.description,
    heading: post.heading,
    intro: post.intro,
    body: post.body,
    faq: post.faq,
    occasion: post.occasion,
    keywords: post.keywords,
    cover_path: post.coverPath,
    cover_alt: post.coverAlt,
    status: post.status,
    published_at: post.publishedAt,
    updated_at: new Date().toISOString(),
  };
}

// Preview mode (tests, local runs without a database) keeps posts and covers in memory
const holder = globalThis as unknown as {
  __shubhPreviewPosts?: Map<string, AdminPost>;
  __shubhPreviewCovers?: Map<string, string>;
};
const previewPosts = (holder.__shubhPreviewPosts ??= new Map());
const previewCovers = (holder.__shubhPreviewCovers ??= new Map());
const isPreview = () => authMode() === "preview";

/** The cover's public address: Supabase's public bucket, or a data URL in preview mode. */
export function coverUrl(path: string | null): string | null {
  if (!path) return null;
  if (isPreview()) return previewCovers.get(path) ?? null;
  const env = supabaseEnv();
  return env ? `${env.url}/storage/v1/object/public/${COVER_BUCKET}/${path}` : null;
}

export const isLive = (post: Pick<AdminPost, "status" | "publishedAt">, now = new Date()) =>
  post.status === "published" && new Date(post.publishedAt) <= now;

/** An admin post as the blog shows it. */
export function toBlogPost(post: AdminPost): BlogPost {
  const date = post.publishedAt.slice(0, 10);
  const src = coverUrl(post.coverPath);
  return {
    slug: post.slug,
    locale: post.locale,
    title: post.title,
    description: post.description,
    heading: post.heading,
    intro: post.intro,
    published: date,
    updated: post.updatedAt.slice(0, 10) < date ? date : post.updatedAt.slice(0, 10),
    occasion: post.occasion,
    keywords: post.keywords,
    body: parseBody(post.body),
    faq: parseFaq(post.faq),
    ...(src ? { cover: { src, alt: post.coverAlt } } : {}),
  };
}

/** Every post the admin has written, newest first. */
export async function adminPosts(): Promise<AdminPost[]> {
  if (isPreview()) {
    return [...previewPosts.values()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }
  const supabase = await supabaseServer();
  if (!supabase) return [];
  const { data } = await supabase
    .from("blog_posts")
    .select(COLUMNS)
    .order("published_at", { ascending: false });
  return ((data ?? []) as PostRow[]).map(fromRow);
}

export async function adminPost(id: string): Promise<AdminPost | null> {
  if (isPreview()) return previewPosts.get(id) ?? null;
  const supabase = await supabaseServer();
  if (!supabase) return null;
  const { data } = await supabase.from("blog_posts").select(COLUMNS).eq("id", id).maybeSingle();
  return data ? fromRow(data as PostRow) : null;
}

/** Live admin posts for the public blog, read without a visitor's cookies so pages can be cached. */
export async function livePosts(): Promise<BlogPost[]> {
  if (isPreview()) return [...previewPosts.values()].filter((post) => isLive(post)).map(toBlogPost);
  const env = supabaseEnv();
  if (!env) return [];
  const client = createClient(env.url, env.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client
    .from("blog_posts")
    .select(COLUMNS)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });
  // Before the owner runs the blog SQL the table is missing: show the code's posts only
  if (error) return [];
  return ((data ?? []) as PostRow[]).map(fromRow).map(toBlogPost);
}

export type SaveResult =
  { ok: true; id: string } | { ok: false; reason: "taken" | "code-post" | "failed" };

export async function savePost(post: PostInput, admin: Account): Promise<SaveResult> {
  if (POSTS.some((item) => item.slug === post.slug && item.locale === post.locale)) {
    return { ok: false, reason: "code-post" };
  }
  if (isPreview()) {
    const clash = [...previewPosts.values()].some(
      (item) => item.slug === post.slug && item.locale === post.locale && item.id !== post.id,
    );
    if (clash) return { ok: false, reason: "taken" };
    const id = post.id ?? randomUUID();
    previewPosts.set(id, { ...post, id, updatedAt: new Date().toISOString() });
    return { ok: true, id };
  }
  const supabase = await supabaseServer();
  if (!supabase) return { ok: false, reason: "failed" };
  const row = toRow(post);
  const { data, error } = post.id
    ? await supabase.from("blog_posts").update(row).eq("id", post.id).select("id").single()
    : await supabase
        .from("blog_posts")
        .insert({ ...row, created_by: admin.id })
        .select("id")
        .single();
  if (error) return { ok: false, reason: error.code === "23505" ? "taken" : "failed" };
  return { ok: true, id: (data as { id: string }).id };
}

export async function deletePost(id: string): Promise<AdminPost | null> {
  const post = await adminPost(id);
  if (!post) return null;
  if (isPreview()) {
    previewPosts.delete(id);
    return post;
  }
  const supabase = await supabaseServer();
  if (!supabase) return null;
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) return null;
  if (post.coverPath) await supabase.storage.from(COVER_BUCKET).remove([post.coverPath]);
  return post;
}

const COVER_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
export const COVER_MAX_BYTES = 5 * 1024 * 1024;

/** Stores a cover picture; its path, or null when the file isn't a picture we take. */
export async function uploadCover(file: File): Promise<string | null> {
  const extension = COVER_TYPES[file.type];
  if (!extension || file.size === 0 || file.size > COVER_MAX_BYTES) return null;
  const path = `covers/${randomUUID()}.${extension}`;
  if (isPreview()) {
    const bytes = Buffer.from(await file.arrayBuffer()).toString("base64");
    previewCovers.set(path, `data:${file.type};base64,${bytes}`);
    return path;
  }
  const supabase = (await supabaseServer()) ?? supabaseService();
  if (!supabase) return null;
  const { error } = await supabase.storage
    .from(COVER_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  return error ? null : path;
}

/** Every live post in one language, the code's and the admin's, newest first. */
export async function allPostsIn(locale: UiLocale): Promise<BlogPost[]> {
  const admin = (await livePosts()).filter((post) => post.locale === locale);
  return [...POSTS.filter((post) => post.locale === locale), ...admin].sort((a, b) =>
    b.published.localeCompare(a.published),
  );
}

export async function findLivePost(slug: string, locale: UiLocale): Promise<BlogPost | null> {
  const code = POSTS.find((post) => post.slug === slug && post.locale === locale);
  if (code) return code;
  return (await livePosts()).find((post) => post.slug === slug && post.locale === locale) ?? null;
}
