import { track } from "@vercel/analytics";

/*
 * The steps from a first look to a paid invitation, counted by Vercel Web Analytics as
 * custom events so the owner can see where families stop (docs/LAUNCH.md). Each carries
 * only what the step is about, a design, an occasion or a package, never a name, an
 * invitation's address or anything a host or guest typed.
 */

export type FunnelStep =
  | "Sample opened"
  | "Design previewed"
  | "Editor opened"
  | "Preview reached"
  | "Checkout started"
  | "Payment completed"
  | "Invite published";

type Detail = Partial<Record<"design" | "category" | "plan" | "tier", string>>;

/** Counts one step. Analytics never stands in the way: a failure is ignored. */
export function funnel(step: FunnelStep, detail?: Detail): void {
  try {
    track(step, detail);
  } catch {
    // Blocked or offline: the step simply isn't counted
  }
}
