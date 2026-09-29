/*
 * The functions (ceremonies) an invite can announce, in the order they usually happen.
 * Categories choose which of these an invite plans by default (src/lib/categories), and
 * tradition packs add their community's own (src/lib/traditions): a Gujarati kankotri's
 * Jaan Prasthan and Jaan Aagman are "baraat" and "baraat-welcome" under local names.
 * The research behind the list is in docs/TRADITIONS.md, section 12.
 */

export const FUNCTION_IDS = [
  "roka",
  "engagement",
  "tilak",
  "ganesh-puja",
  "grah-shanti",
  "mandap",
  "mameru",
  "haldi",
  "mehendi",
  "sangeet",
  "garba",
  "bhoj",
  "baraat",
  "baraat-welcome",
  "wedding",
  "vidaai",
  "reception",
  // Beyond weddings (Step 12p): each of these occasions is one function
  "birthday",
  "anniversary",
  "party",
  "baby-shower",
  "diwali",
] as const;
export type FunctionId = (typeof FUNCTION_IDS)[number];

/** The functions of the occasions beyond weddings, which weddings don't offer. */
export const OCCASION_FUNCTIONS: readonly FunctionId[] = [
  "birthday",
  "anniversary",
  "party",
  "baby-shower",
  "diwali",
];

export function isFunctionId(value: unknown): value is FunctionId {
  return typeof value === "string" && (FUNCTION_IDS as readonly string[]).includes(value);
}
