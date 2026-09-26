/*
 * The functions (ceremonies) an invite can announce, in the order they usually happen.
 * Categories choose which of these an invite plans by default (src/lib/categories).
 */

export const FUNCTION_IDS = [
  "roka",
  "engagement",
  "haldi",
  "mehendi",
  "sangeet",
  "wedding",
  "reception",
] as const;
export type FunctionId = (typeof FUNCTION_IDS)[number];

export function isFunctionId(value: unknown): value is FunctionId {
  return typeof value === "string" && (FUNCTION_IDS as readonly string[]).includes(value);
}
