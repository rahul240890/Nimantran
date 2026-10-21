import type { Audience } from "@/lib/plans/offers";

/** Who an offer is for, as the admin's pages name it. */
export const AUDIENCE_NAMES: Record<Audience, string> = {
  everyone: "Everyone",
  "first-order": "First booking only",
  returning: "Hosts who have booked before",
};
