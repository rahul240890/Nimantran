import type { RsvpQuestionId } from "./schema";

/*
 * The shape of each RSVP question a category can switch on. Labels live in
 * src/content/categories.ts; the guest page (Step 10) draws the answers from these kinds,
 * and the database (Step 8) stores a host's questions in the same shape.
 */

export type RsvpQuestionKind = "choice" | "date" | "yes-no" | "text";

export type RsvpQuestionSpec = {
  kind: RsvpQuestionKind;
  /** Choices, for kind "choice". */
  options?: readonly string[];
  /** Longest answer, for kind "text". */
  maxLength?: number;
};

export const RSVP_QUESTIONS: Record<RsvpQuestionId, RsvpQuestionSpec> = {
  meal: { kind: "choice", options: ["veg", "jain", "non-veg", "vegan"] },
  arrival: { kind: "date" },
  stay: { kind: "yes-no" },
  pickup: { kind: "yes-no" },
  song: { kind: "text", maxLength: 80 },
  message: { kind: "text", maxLength: 280 },
};
