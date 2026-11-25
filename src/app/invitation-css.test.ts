import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

/*
 * The invitation's own styles live in invitation.css, out of globals.css, so the site's own
 * pages (the blog, help, pricing) don't download them. A component that uses one of its
 * classes, keyframes, theme attributes or custom properties, without importing it, would
 * render an invitation unstyled on any page that doesn't happen to load it some other way.
 */
const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");
const strip = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");

const css = strip(read("src/app/invitation.css"));
const globals = strip(read("src/app/globals.css"));
const escape = (word: string) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const anyOf = (words: Iterable<string>) =>
  new RegExp(
    `(?<![\\w-])(${[...words]
      .sort((a, b) => b.length - a.length)
      .map(escape)
      .join("|")})(?![\\w-])`,
  );

const classes = new Set(
  [...css.matchAll(/([^{};]+)\{/g)]
    .map((match) => match[1]!)
    .filter((selector) => !selector.trim().startsWith("@"))
    .flatMap((selector) => [...selector.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]!)),
);
const keyframes = new Set([...css.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]!));
const globalProperties = new Set([...globals.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]!));
const properties = new Set(
  [...css.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]!).filter((p) => !globalProperties.has(p)),
);
const attributes = ["data-suite", "data-mood", "data-opening", "data-scene-mood"];

// A one-word class (.gate) is only counted in a className, as the word turns up elsewhere
const oneWord = [...classes].filter((name) => !name.includes("-"));
const uses = anyOf([...classes, ...keyframes, ...attributes].filter((w) => !oneWord.includes(w)));
const usesOneWord = new RegExp(
  `className=["'\`{][^"'\`]*(?<![\\w-])(${oneWord.join("|")})(?![\\w-])`,
);
const usesProperty = anyOf(properties);

const components = readdirSync(resolve(process.cwd(), "src"), { recursive: true, encoding: "utf8" })
  .filter((file) => file.endsWith(".tsx") && !file.includes(".test."))
  .map((file) => `src/${file}`);

describe("invitation.css", () => {
  it("holds the invitation's styles", () => {
    expect(classes.size).toBeGreaterThan(100);
    expect(css).toContain('[data-suite="rajwada-bagh"]');
    expect(globals).not.toContain("[data-suite=");
  });

  it("is imported by every component that uses it", () => {
    const missing = components.filter((file) => {
      const source = read(file);
      if (source.includes('import "@/app/invitation.css"')) return false;
      const code = strip(source).replace(/^\s*\/\/.*$/gm, "");
      const usesCss = /import "@\/app\/(?!globals|reveals)[\w-]+\.css"/.test(code);
      return uses.test(code) || usesOneWord.test(code) || usesProperty.test(code) || usesCss;
    });
    expect(missing).toEqual([]);
  });

  /*
   * A part loaded later (near-screen.tsx, next/dynamic) brings its stylesheets only when its
   * script arrives, after the server's drawing has already painted unstyled. Whatever loads
   * one that uses invitation.css imports it too (home-later.tsx).
   */
  it("is imported where a part that uses it is loaded later", () => {
    const resolveImport = (from: string, spec: string) => {
      const base = spec.startsWith("@/")
        ? `src/${spec.slice(2)}`
        : spec.startsWith(".")
          ? join(dirname(from), spec)
          : undefined;
      if (!base) return undefined;
      return [`${base}.tsx`, `${base}.ts`, `${base}/index.tsx`, `${base}/index.ts`].find((file) =>
        existsSync(resolve(process.cwd(), file)),
      );
    };
    const seen = new Map<string, boolean>();
    const needs = (file: string): boolean => {
      if (seen.has(file)) return seen.get(file)!;
      seen.set(file, false);
      const source = read(file);
      const result =
        source.includes('import "@/app/invitation.css"') ||
        [...source.matchAll(/^import\s+(?!type\b)[^"']*?from\s+["']([^"']+)["']/gm)].some(
          (match) => {
            const target = resolveImport(file, match[1]!);
            return target !== undefined && needs(target);
          },
        );
      seen.set(file, result);
      return result;
    };
    const missing = components.filter((file) => {
      const source = read(file);
      if (source.includes('import "@/app/invitation.css"')) return false;
      return [...source.matchAll(/import\(\s*["']([^"']+)["']\s*\)/g)].some((match) => {
        const target = resolveImport(file, match[1]!);
        return target !== undefined && needs(target);
      });
    });
    expect(missing).toEqual([]);
  });
});
