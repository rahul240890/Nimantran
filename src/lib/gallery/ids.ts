/* The gallery's fixed lists, apart from its data, so addresses and links stay light. */

/** A wedding's kinds: who the family is, and the designs made for them alone. */
export const WEDDING_KINDS = [
  "north-indian",
  "gujarati",
  "rajasthani",
  "marathi",
  "bengali",
  "tamil",
  "punjabi",
  "muslim",
  "modern",
] as const;
export type WeddingKind = (typeof WEDDING_KINDS)[number];

export function isWeddingKind(value: unknown): value is WeddingKind {
  return typeof value === "string" && (WEDDING_KINDS as readonly string[]).includes(value);
}
