import { describe, expect, it } from "vitest";
import { publicMetadata } from "@/components/seo/pages";
import { UI_LOCALES } from "@/i18n/locales";
import { pageAlternates, pagePath, publicPages, switchLocalePath } from "./paths";
import { jsonLdText } from "./structured-data";

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
        "x-default": "/invitations/sangeet",
      },
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
    expect(switchLocalePath("/create", "hi")).toBeNull();
    expect(switchLocalePath("/invites/abc", "hi")).toBeNull();
  });
});

describe("structured data", () => {
  it("can never close its script tag early", () => {
    expect(jsonLdText({ name: "</script><script>alert(1)</script>" })).not.toContain("<");
  });
});
