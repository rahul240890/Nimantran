/*
 * Reads what a video needs from the page (Step 17c): each theme's colours as the browser
 * resolves the design tokens, the fonts, and the paintings and photos, loaded and ready
 * to draw. Browser only.
 */

import type { Mood, SuiteId } from "@/lib/suites/catalog";
import { SUITES } from "@/lib/suites/catalog";
import type { Template } from "@/lib/templates/schema";
import { stockStyle } from "@/lib/templates/stock";
import type { Fonts, Palette } from "./draw";

const TOKENS: Record<keyof Palette, string> = {
  paper: "var(--card-ivory)",
  ink: "var(--card-ink)",
  inkMuted: "var(--card-ink-muted)",
  gold: "var(--card-gold)",
  goldText: "var(--card-gold-text)",
  accent: "var(--card-accent)",
  accentText: "var(--card-accent-text)",
  glow: "var(--print-glow, var(--card-ivory))",
  near: "var(--suite-near, var(--card-ink))",
};

/**
 * A palette reader for a theme: builds the same wrappers the live pages use (the theme,
 * the page's light, printed words' tone), off screen, and reads each colour back as rgb.
 */
export function paletteReader(suite: SuiteId, template: Template) {
  const cache = new Map<string, Palette>();
  return (mood: Mood, tone: "light" | "dark" | null): Palette => {
    const key = `${mood}:${tone}`;
    const known = cache.get(key);
    if (known) return known;
    const root = document.createElement("div");
    root.dataset.suite = suite;
    root.dataset.mood = mood;
    root.setAttribute("aria-hidden", "true");
    root.style.cssText = "position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;";
    if (SUITES[suite].art === "card") {
      for (const [name, value] of Object.entries(stockStyle(template))) {
        root.style.setProperty(name, String(value));
      }
    }
    const inner = document.createElement("div");
    inner.className = "story-print";
    if (tone) inner.dataset.tone = tone;
    root.append(inner);
    // One probe per colour, set before it joins the page: a probe whose colour changed
    // would report the start of the site's colour transition instead of the colour
    const probes = (Object.entries(TOKENS) as [keyof Palette, string][]).map(([name, token]) => {
      const probe = document.createElement("span");
      probe.style.transition = "none";
      probe.style.color = token;
      inner.append(probe);
      return [name, probe] as const;
    });
    document.body.append(root);
    const palette = {} as Palette;
    for (const [name, probe] of probes) palette[name] = toRgb(getComputedStyle(probe).color);
    root.remove();
    cache.set(key, palette);
    return palette;
  };
}

let pixel: CanvasRenderingContext2D | null = null;

/** Any CSS colour (oklab from a color-mix, say) as rgb(), which the drawing code can fade. */
function toRgb(colour: string): string {
  if (/^rgb\(/.test(colour)) return colour;
  pixel ??= document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!pixel) return colour;
  pixel.clearRect(0, 0, 1, 1);
  pixel.fillStyle = colour;
  pixel.fillRect(0, 0, 1, 1);
  const [r, g, b] = pixel.getImageData(0, 0, 1, 1).data;
  return `rgb(${r}, ${g}, ${b})`;
}

/** The site's three families, as the fonts are named in the stylesheet. */
export function readFonts(): Fonts {
  const probe = document.createElement("span");
  probe.style.cssText = "position:fixed;left:-9999px;";
  document.body.append(probe);
  const read = (className: string) => {
    probe.className = className;
    return getComputedStyle(probe).fontFamily;
  };
  const fonts = {
    display: read("font-display"),
    sans: read("font-sans"),
    label: read("font-label"),
  };
  probe.remove();
  return fonts;
}

/** Waits for every font the words use, in the letters they are written in. */
export async function loadFonts(families: readonly string[], text: string) {
  if (!("fonts" in document)) return;
  await Promise.all(
    families.map((family) => document.fonts.load(`32px ${family}`, text).catch(() => [])),
  );
}

/** Loads the paintings and photos; any that fail are left out rather than stopping the video. */
export async function loadImages(urls: readonly string[]): Promise<Map<string, ImageBitmap>> {
  const images = new Map<string, ImageBitmap>();
  await Promise.all(
    urls.map(async (url) => {
      try {
        const response = await fetch(url, { mode: "cors", credentials: "omit" });
        if (!response.ok) return;
        images.set(url, await createImageBitmap(await response.blob()));
      } catch {
        // A photo that can't load leaves its frame showing the painting
      }
    }),
  );
  return images;
}
