import type { FunctionId } from "@/lib/events/functions";

/*
 * The made-up wedding every sample shows: each celebration's day and time, early in 2027
 * so the invitation is always still to come.
 */

export const SAMPLE_DAYS = {
  haldi: ["2027-02-12", "10:00"],
  mehendi: ["2027-02-12", "16:00"],
  sangeet: ["2027-02-12", "20:00"],
  baraat: ["2027-02-13", "17:00"],
  wedding: ["2027-02-13", "19:30"],
  reception: ["2027-02-14", "20:00"],
} as const satisfies Partial<Record<FunctionId, readonly [string, string]>>;

export type SampleFunction = keyof typeof SAMPLE_DAYS;

/** An occasion's one celebration, on the sample wedding day. */
export const SAMPLE_OCCASION_DAY = ["2027-02-13", "18:00"] as const;
