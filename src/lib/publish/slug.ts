import type { CategoryId } from "@/lib/categories/catalog";

/*
 * The invite's public address, /i/<slug>. Built from the names so families can read it
 * ("aarav-weds-meera"), in plain lowercase ASCII so it survives WhatsApp, SMS and print.
 */

export const SLUG_MAX = 60;
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Occasions whose link reads "<first>-weds-<second>". */
const WEDS: readonly CategoryId[] = ["wedding", "save-the-date", "reception"];

export function isSlug(value: unknown): value is string {
  return typeof value === "string" && value.length <= SLUG_MAX && SLUG_PATTERN.test(value);
}

/** "Priyá  D'Souza" → "priya-dsouza". Scripts other than Latin give an empty string. */
export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX)
    .replace(/-+$/, "");
}

/** Cleans what a host types into the link field, keeping a trailing dash while they type. */
export function cleanSlugInput(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+/, "")
    .slice(0, SLUG_MAX);
}

/** The link an invite suggests: "aarav-weds-meera", "aarav-and-meera-roka", "meera-haldi". */
export function suggestSlug({
  first,
  second,
  categoryId,
}: {
  first: string;
  second: string;
  categoryId: CategoryId;
}): string {
  const a = slugify(first);
  const b = slugify(second);
  let slug: string;
  if (a && b) slug = WEDS.includes(categoryId) ? `${a}-weds-${b}` : `${a}-and-${b}-${categoryId}`;
  else if (a || b) slug = `${a || b}-${categoryId}`;
  else slug = `${categoryId}-invite`;
  return trim(slug);
}

function trim(slug: string, room = 0): string {
  return slug.slice(0, SLUG_MAX - room).replace(/-+$/, "");
}

/** Other links to offer when one is taken: "-2" to "-9", then a short random ending. */
export function slugAlternatives(slug: string, random: () => number = Math.random): string[] {
  const numbered = Array.from({ length: 8 }, (_, i) => `${trim(slug, 2)}-${i + 2}`);
  const tail = Math.floor(random() * 36 ** 4)
    .toString(36)
    .padStart(4, "0");
  return [...numbered, `${trim(slug, 5)}-${tail}`];
}
