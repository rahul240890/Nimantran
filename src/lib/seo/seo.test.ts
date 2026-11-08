import { describe, expect, it } from "vitest";
import { publicMetadata } from "@/components/seo/pages";
import { UI_LOCALES } from "@/i18n/locales";
import { indexedLocales, pageAlternates, pagePath, publicPages, switchLocalePath } from "./paths";
import { jsonLdText } from "./structured-data";
import { occasionQuestions } from "@/content/occasion-questions";

describe("public pages", () => {
  it("live at readable addresses in each language", () => {
    expect(pagePath({ kind: "home" }, "en")).toBe("/");
    expect(pagePath({ kind: "home" }, "hi")).toBe("/hi");
    expect(pagePath({ kind: "occasion", id: "haldi" }, "en")).toBe("/invitations/haldi");
    expect(pagePath({ kind: "tradition", id: "tamil" }, "hi")).toBe("/hi/traditions/tamil");
    expect(pagePath({ kind: "design", id: "alpona" }, "hi")).toBe("/hi/designs/alpona");
  });

  it("cover every occasion, tradition and design", () => {
    const pages = publicPages();
    expect(pages.filter((page) => page.kind === "occasion")).toHaveLength(40);
    expect(pages.filter((page) => page.kind === "tradition")).toHaveLength(7);
    expect(pages.filter((page) => page.kind === "design")).toHaveLength(12);
    const paths = pages.flatMap((page) => UI_LOCALES.map((locale) => pagePath(page, locale)));
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("name their language versions, with English as the default", () => {
    expect(pageAlternates({ kind: "occasion", id: "sangeet" }, "hi")).toEqual({
      canonical: "/hi/invitations/sangeet",
      languages: {
        "en-IN": "/invitations/sangeet",
        "hi-IN": "/hi/invitations/sangeet",
        "mr-IN": "/mr/invitations/sangeet",
        "gu-IN": "/gu/invitations/sangeet",
        "bn-IN": "/bn/invitations/sangeet",
        "ta-IN": "/ta/invitations/sangeet",
        "x-default": "/invitations/sangeet",
      },
    });
  });

  it("offer contact and legal pages to search in English only", () => {
    expect(indexedLocales({ kind: "privacy" })).toEqual(["en"]);
    expect(indexedLocales({ kind: "occasion", id: "haldi" })).toEqual(UI_LOCALES);
    expect(publicMetadata({ kind: "terms" }, "hi").robots).toEqual({ index: false, follow: true });
    expect(publicMetadata({ kind: "terms" }, "en").robots).toBeUndefined();
    expect(publicMetadata({ kind: "occasion", id: "haldi" }, "ta").robots).toBeUndefined();
    expect(pageAlternates({ kind: "refunds" }, "gu")).toEqual({
      canonical: "/gu/refunds",
      languages: { "en-IN": "/refunds", "x-default": "/refunds" },
    });
  });

  it("have short, unique titles and descriptions in every language", () => {
    for (const locale of UI_LOCALES) {
      const seen = new Set<string>();
      for (const page of publicPages().filter((item) => item.kind !== "home")) {
        const meta = publicMetadata(page, locale);
        const title = String(meta.title);
        expect(title.length, title).toBeLessThanOrEqual(48);
        expect(String(meta.description).length, title).toBeLessThanOrEqual(155);
        expect(seen.has(title), title).toBe(false);
        seen.add(title);
      }
    }
  });

  it("switch language in the address, and leave app pages in place", () => {
    expect(switchLocalePath("/", "hi")).toBe("/hi");
    expect(switchLocalePath("/hi", "en")).toBe("/");
    expect(switchLocalePath("/designs/rose", "hi")).toBe("/hi/designs/rose");
    expect(switchLocalePath("/hi/traditions/bengali", "en")).toBe("/traditions/bengali");
    expect(switchLocalePath("/privacy", "hi")).toBe("/hi/privacy");
    expect(switchLocalePath("/hi/terms", "en")).toBe("/terms");
    expect(switchLocalePath("/ta/pricing", "gu")).toBe("/gu/pricing");
    expect(switchLocalePath("/mr", "en")).toBe("/");
    expect(switchLocalePath("/create", "hi")).toBeNull();
    expect(switchLocalePath("/invites/abc", "hi")).toBeNull();
  });
});

describe("occasion questions", () => {
  it("answer wedding and save the date questions in every language, each on its own", () => {
    for (const locale of UI_LOCALES) {
      const { byOccasion } = occasionQuestions[locale];
      expect(byOccasion.wedding?.length, locale).toBeGreaterThanOrEqual(4);
      expect(byOccasion["save-the-date"]?.length, locale).toBeGreaterThanOrEqual(2);
      for (const items of Object.values(byOccasion)) {
        expect(new Set(items!.map((item) => item.q)).size).toBe(items!.length);
        for (const item of items!) expect(item.a.length, item.q).toBeLessThanOrEqual(300);
      }
    }
  });
});

describe("structured data", () => {
  it("can never close its script tag early", () => {
    expect(jsonLdText({ name: "</script><script>alert(1)</script>" })).not.toContain("<");
  });
});
