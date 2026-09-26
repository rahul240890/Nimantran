import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/*
 * Fonts and colours for generated images (link previews). Images can't read CSS
 * variables, so colours come from the light theme in globals.css, parsed once. Files are
 * listed in next.config.ts so they ship with the server functions.
 */

const root = process.cwd();

const fontFile = (pkg: string, file: string) =>
  readFile(join(root, "node_modules", "@fontsource", pkg, "files", file));

export async function ogFonts() {
  const [rozha, rozhaDevanagari, tenor] = await Promise.all([
    fontFile("rozha-one", "rozha-one-latin-400-normal.woff"),
    fontFile("rozha-one", "rozha-one-devanagari-400-normal.woff"),
    fontFile("tenor-sans", "tenor-sans-latin-400-normal.woff"),
  ]);
  return [
    { name: "Rozha One", data: rozha, style: "normal" as const, weight: 400 as const },
    { name: "Rozha One", data: rozhaDevanagari, style: "normal" as const, weight: 400 as const },
    { name: "Tenor Sans", data: tenor, style: "normal" as const, weight: 400 as const },
  ];
}

let tokens: Promise<Record<string, string>> | null = null;

/** The light theme's colour tokens by name, e.g. { "card-ivory": "#f8efdc" }. */
export function lightTokens(): Promise<Record<string, string>> {
  tokens ??= readFile(join(root, "src", "app", "globals.css"), "utf8").then(parseRootTokens);
  return tokens;
}

export function parseRootTokens(css: string): Record<string, string> {
  const start = css.indexOf(":root {");
  const open = css.indexOf("{", start);
  const close = css.indexOf("}", open);
  const found: Record<string, string> = {};
  for (const match of css.slice(open, close).matchAll(/--([\w-]+):\s*(#[0-9a-f]{3,8})/gi)) {
    found[match[1]!] = match[2]!;
  }
  return found;
}
