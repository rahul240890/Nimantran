import { SCRIPT_SAMPLE, scriptOf } from "@/lib/editor/type";
import { VOICES } from "@/lib/suites/lettering";
import type { CardLanguage } from "@/lib/templates/card-languages";

/**
 * Fetches every voice's faces in the card's scripts before a design needs them (owner,
 * 2026-10-22: a new design took a while to show its lettering). A browser downloads a face
 * only when text first uses it, so without this the pages drew in a fallback font, then
 * changed, each time the host tried a design in another voice. Latin is always fetched:
 * headings and dates are in Latin letters on every card.
 */
export function warmLettering(languages: readonly CardLanguage[]): void {
  if (typeof document === "undefined" || !("fonts" in document)) return;
  const scripts = [...new Set(["latin" as const, ...languages.map(scriptOf)])];
  const asked = new Set<string>();
  for (const voice of Object.values(VOICES)) {
    for (const face of Object.values(voice)) {
      for (const script of scripts) {
        const { family, weight } = face[script];
        const font = `${weight ?? 400} 16px "${family}"`;
        if (asked.has(`${font}/${script}`)) continue;
        asked.add(`${font}/${script}`);
        // A face that can't load leaves the fallback in place, as it always has
        document.fonts.load(font, SCRIPT_SAMPLE[script]).catch(() => {});
      }
    }
  }
}
