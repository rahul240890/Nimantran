import { describe, expect, it } from "vitest";
import { POSTS } from "@/content/blog";
import { UI_LOCALES } from "@/i18n/locales";
import { pagePath, publicPages, switchLocalePath } from "@/lib/seo/paths";
import { blogPostPath, postLinks, postsIn, readingMinutes, translatedPost } from "./posts";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

describe("blog posts", () => {
  it("have unique addresses and short titles and descriptions", () => {
    const paths = POSTS.map((post) => blogPostPath(post.slug, post.locale));
    expect(new Set(paths).size).toBe(paths.length);
    for (const post of POSTS) {
      expect(post.slug, post.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(post.title.length, post.title).toBeLessThanOrEqual(48);
      expect(post.description.length, post.title).toBeLessThanOrEqual(155);
      expect(post.published, post.slug).toMatch(DATE);
      expect(post.updated >= post.published, post.slug).toBe(true);
      expect(readingMinutes(post)).toBeGreaterThan(0);
    }
  });

  it("give each section heading its own anchor", () => {
    for (const post of POSTS) {
      const ids = post.body.flatMap((block) =>
        typeof block !== "string" && "h2" in block ? [block.id] : [],
      );
      expect(new Set(ids).size, post.slug).toBe(ids.length);
    }
  });

  it("only link to pages that exist", () => {
    const known = new Set([
      ...publicPages().flatMap((page) => UI_LOCALES.map((locale) => pagePath(page, locale))),
      ...POSTS.map((post) => blogPostPath(post.slug, post.locale)),
    ]);
    for (const post of POSTS) {
      for (const link of postLinks(post))
        expect(known.has(link), `${post.slug}: ${link}`).toBe(true);
    }
  });

  it("are listed newest first, in their own language", () => {
    for (const locale of UI_LOCALES) {
      const posts = postsIn(locale);
      expect(posts.every((post) => post.locale === locale)).toBe(true);
      const dates = posts.map((post) => post.published);
      expect(dates).toEqual([...dates].sort().reverse());
    }
    expect(postsIn("en").length).toBeGreaterThanOrEqual(6);
  });

  it("switch language to the same post when written, otherwise to the blog", () => {
    expect(translatedPost("wedding-invitation-wording", "en")).toBe("wedding-invitation-wording");
    expect(switchLocalePath("/blog/wedding-invitation-wording", "hi")).toBe("/hi/blog");
    expect(switchLocalePath("/hi/blog/shadi-card-matter-hindi", "en")).toBe("/blog");
    expect(switchLocalePath("/hi/blog/shadi-card-matter-hindi", "hi")).toBe(
      "/hi/blog/shadi-card-matter-hindi",
    );
    expect(switchLocalePath("/blog", "hi")).toBe("/hi/blog");
    expect(switchLocalePath("/pricing", "hi")).toBe("/hi/pricing");
    expect(switchLocalePath("/hi/refunds", "en")).toBe("/refunds");
  });
});
