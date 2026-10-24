import "server-only";
import { supabaseService } from "@/lib/supabase/service";

/* The admin's Visitors page reads its counts here, as the server (visit_summary()). */

export const VISIT_RANGES = [7, 30, 90] as const;
export type VisitRange = (typeof VISIT_RANGES)[number];

export type VisitCount = { label: string; visitors: number };

export type VisitSummary = {
  days: number;
  /** Visitors in the last 30 minutes. */
  now: number;
  totals: {
    views: number;
    /** A visitor counts once a day, so this adds up each day's visitors. */
    visitors: number;
    /** Of those, the ones who were signed in at some point that day. */
    signedIn: number;
    /** Different accounts seen. */
    accounts: number;
    /** Visitors who opened one page and left. */
    onePage: number;
  };
  daily: { day: string; views: number; visitors: number; signedIn: number }[];
  pages: { label: string; views: number; visitors: number }[];
  lists: Partial<
    Record<"referrers" | "sources" | "countries" | "devices" | "browsers" | "systems", VisitCount[]>
  >;
};

export function visitRange(value: unknown): VisitRange {
  const days = Number(value);
  return (VISIT_RANGES as readonly number[]).includes(days) ? (days as VisitRange) : 30;
}

/** Null when the database isn't set up, or the counting migration hasn't been run yet. */
export async function visitSummary(days: VisitRange): Promise<VisitSummary | null> {
  const service = supabaseService();
  if (!service) return null;
  const { data, error } = await service.rpc("visit_summary", { p_days: days });
  return error || !data ? null : (data as VisitSummary);
}

/** The funnel for the same days (funnel_summary()): see lib/admin/funnel-rows.ts. */
export type FunnelSummary = {
  days: number;
  /** Visitor-days at each step: a visitor counts once a day at each. */
  steps: Record<
    | "visitors"
    | "sample"
    | "details"
    | "editor"
    | "preview"
    | "signedIn"
    | "checkout"
    | "paid"
    | "published",
    number
  >;
  /** Where visitors came from (their first campaign or site that day), and how far they got. */
  sources: {
    label: string;
    visitors: number;
    designs: number;
    preview: number;
    checkout: number;
    paid: number;
  }[];
  /** The designs opened most, live or on their own page. */
  designs: VisitCount[];
  /** Straight from the tables: exact even when a visitor's counting was blocked. */
  outcomes: {
    accounts: number;
    invites: number;
    payments: number;
    revenuePaise: number;
    published: number;
  };
};

/** Null until the funnel migration (…_funnel_and_reviews.sql) has been run. */
export async function funnelSummary(days: VisitRange): Promise<FunnelSummary | null> {
  const service = supabaseService();
  if (!service) return null;
  const { data, error } = await service.rpc("funnel_summary", { p_days: days });
  return error || !data ? null : (data as FunnelSummary);
}
