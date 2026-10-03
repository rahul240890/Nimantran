/* Colour contrast for generated images, which pick their text colour at render time. */

function luminance(hex: string): number {
  const full =
    hex.length === 4 ? `#${[...hex.slice(1)].map((c) => c + c).join("")}` : hex.slice(0, 7);
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(full.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

/** The WCAG contrast ratio between two hex colours. */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
}

/** Whichever of the candidates reads best on the background. */
export function readableOn(background: string, ...candidates: string[]): string {
  return candidates.reduce((best, colour) =>
    contrast(colour, background) > contrast(best, background) ? colour : best,
  );
}

/** The first candidate that reaches the ratio on the background, else the most readable. */
export function firstReadable(background: string, ratio: number, ...candidates: string[]): string {
  return (
    candidates.find((colour) => contrast(colour, background) >= ratio) ??
    readableOn(background, ...candidates)
  );
}
