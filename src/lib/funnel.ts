import { track } from "@vercel/analytics";
import { sendStep, type StepKey } from "@/lib/visits";

/*
 * The steps from a first look to a paid invitation, counted by Vercel Web Analytics as
 * custom events, and by the site itself for the admin's Visitors page, so the owner can
 * see where families stop (docs/LAUNCH.md). Each carries only what the step is about, a
 * design, an occasion or a package, never a name, an invitation's address or anything a
 * host or guest typed.
 */

export type FunnelStep =
  | "Sample opened"
  | "Design previewed"
  | "Details opened"
  | "Editor opened"
  | "Preview reached"
  | "Checkout started"
  | "Payment completed"
  | "Invite published"
  | "Family preview shared";

type Detail = Partial<Record<"design" | "category" | "plan" | "tier", string>>;

/** Each step's name in the site's own counts (supabase/migrations/…_funnel_and_reviews.sql). */
const STEP_KEYS: Partial<Record<FunnelStep, StepKey>> = {
  "Sample opened": "sample",
  "Details opened": "details",
  "Editor opened": "editor",
  "Preview reached": "preview",
  "Checkout started": "checkout",
  "Payment completed": "paid",
  "Invite published": "published",
};

/** Counts one step. Analytics never stands in the way: a failure is ignored. */
export function funnel(step: FunnelStep, detail?: Detail): void {
  try {
    track(step, detail);
  } catch {
    // Blocked or offline: the step simply isn't counted
  }
  const key = STEP_KEYS[step];
  if (key) sendStep(key, detail?.design, detail?.category);
}
