import "server-only";
import { unstable_cache } from "next/cache";
import { authMode } from "@/lib/auth/mode";
import { previewDb } from "@/lib/invites/preview-db";
import { supabaseService } from "@/lib/supabase/service";
import { reviewStore, type PublicReview } from "./store";

/*
 * What the site can say about itself, all of it real (owner, 2026-10-24): how many
 * invitations have gone live, and the reviews an admin approved, with their average.
 * Counted at most every ten minutes, and straight away when an admin approves or hides one.
 */

export const TRUST_TAG = "trust";

/** Below this, a count of invitations says more about being new than about trust. */
export const SHOW_SENT_FROM = 25;

/** The reviews the site shows at most. */
const SHOWN = 12;

export type Trust = {
  /** Invitations that have gone live, or null while there are too few to say. */
  sent: number | null;
  reviews: PublicReview[];
  /** The average of every approved review's stars, to one decimal, or null with none. */
  average: number | null;
  count: number;
};

const EMPTY: Trust = { sent: null, reviews: [], average: null, count: 0 };

async function sentCount(): Promise<number> {
  if (authMode() === "preview") {
    return [...previewDb.invites.values()].filter((stored) => stored.publishedAt).length;
  }
  const service = supabaseService();
  if (!service) return 0;
  const { count, error } = await service
    .from("events")
    .select("id", { count: "exact", head: true })
    .not("published_at", "is", null);
  if (error) throw error;
  return count ?? 0;
}

async function ratings(): Promise<number[]> {
  if (authMode() === "preview") {
    return ((await reviewStore()?.all()) ?? [])
      .filter((review) => review.status === "approved")
      .map((review) => review.rating);
  }
  const service = supabaseService();
  if (!service) return [];
  const { data } = await service.from("reviews").select("rating").eq("status", "approved");
  return ((data ?? []) as { rating: number }[]).map((row) => row.rating);
}

/** The average to one decimal, or null with none. */
export function averageOf(stars: readonly number[]): number | null {
  if (stars.length === 0) return null;
  return Math.round((stars.reduce((sum, value) => sum + value, 0) / stars.length) * 10) / 10;
}

const cached = unstable_cache(
  async (): Promise<Trust> => {
    const [sent, reviews, stars] = await Promise.all([
      sentCount(),
      reviewStore()?.approved(SHOWN) ?? Promise.resolve([]),
      ratings(),
    ]);
    return {
      sent: sent >= SHOW_SENT_FROM ? sent : null,
      reviews,
      average: averageOf(stars),
      count: stars.length,
    };
  },
  ["trust", "v1"],
  { tags: [TRUST_TAG], revalidate: 600 },
);

export async function getTrust(): Promise<Trust> {
  // A database hiccup, or the migration not run yet, never breaks a page: it says nothing
  return cached().catch(() => EMPTY);
}
