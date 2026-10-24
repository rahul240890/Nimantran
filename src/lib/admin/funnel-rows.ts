/*
 * The admin's funnel (Admin, Visitors) as rows: each step from a first visit to a
 * published invite, how many reached it, and the step where most people stop.
 */

export type FunnelCounts = {
  visitors: number;
  details: number;
  editor: number;
  preview: number;
  signedIn: number;
  checkout: number;
  paid: number;
  published: number;
};

export type FunnelRow = {
  key: keyof FunnelCounts;
  label: string;
  count: number;
  /** Of the visitors, as a share from 0 to 1. */
  ofVisitors: number;
};

const STEPS: readonly { key: keyof FunnelCounts; label: string }[] = [
  { key: "visitors", label: "Visited the site" },
  { key: "details", label: "Opened a design's page" },
  { key: "editor", label: "Opened the editor" },
  { key: "preview", label: "Reached the preview" },
  { key: "signedIn", label: "Signed in" },
  { key: "checkout", label: "Started paying" },
  { key: "paid", label: "Paid" },
  { key: "published", label: "Published" },
];

export function funnelRows(counts: FunnelCounts): FunnelRow[] {
  const visitors = counts.visitors;
  return STEPS.map(({ key, label }) => ({
    key,
    label,
    count: counts[key],
    ofVisitors: visitors ? Math.min(1, counts[key] / visitors) : 0,
  }));
}

/** Too few people at a step to say much about the next one. */
const FEW = 5;

/**
 * The step after which most people stop: the share of one step's people who don't show up
 * at the next. Steps are counted per day, so a later step can outnumber an earlier one;
 * that counts as no drop.
 */
export function biggestDrop(
  rows: readonly FunnelRow[],
): { from: FunnelRow; to: FunnelRow; lost: number } | null {
  let worst: { from: FunnelRow; to: FunnelRow; lost: number } | null = null;
  for (let i = 1; i < rows.length; i++) {
    const from = rows[i - 1]!;
    const to = rows[i]!;
    if (from.count < FEW) continue;
    const lost = Math.max(0, 1 - to.count / from.count);
    if (!worst || lost > worst.lost) worst = { from, to, lost };
  }
  return worst && worst.lost > 0 ? worst : null;
}
