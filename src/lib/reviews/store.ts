import "server-only";
import type { Account } from "@/lib/auth/account";
import { authMode } from "@/lib/auth/mode";
import { previewDb } from "@/lib/invites/preview-db";
import { supabaseService } from "@/lib/supabase/service";

/*
 * Reviews from hosts (owner, 2026-10-24: real reviews from real families, never invented
 * ones). A host whose invitation is live writes one from /review; it shows on the site only
 * once an admin approves it on Admin, Reviews. One per account: writing again replaces it
 * and sends it back for approval. Only the server reads or writes them
 * (supabase/migrations/20261024160000_funnel_and_reviews.sql).
 */

export const REVIEW_STATUSES = ["pending", "approved", "hidden"] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export type ReviewInput = { rating: number; body: string; name: string; place: string };

export type Review = ReviewInput & {
  id: string;
  /** The occasion of the host's live invitation, as a category id. */
  occasion: string;
  status: ReviewStatus;
  updatedAt: string;
};

/** What the site shows of an approved review: never the account behind it. */
export type PublicReview = Omit<Review, "status">;

export type SaveReviewResult = "saved" | "not-live" | "failed";

type ReviewStore = {
  mine(account: Account): Promise<Review | null>;
  save(account: Account, input: ReviewInput): Promise<SaveReviewResult>;
  approved(limit: number): Promise<PublicReview[]>;
  all(): Promise<Review[]>;
  setStatus(id: string, status: ReviewStatus): Promise<boolean>;
};

type Row = {
  id: string;
  rating: number;
  body: string;
  name: string;
  place: string;
  occasion: string;
  status: ReviewStatus;
  updated_at: string;
};

const COLUMNS = "id, rating, body, name, place, occasion, status, updated_at";

const fromRow = (row: Row): Review => ({
  id: row.id,
  rating: row.rating,
  body: row.body,
  name: row.name,
  place: row.place,
  occasion: row.occasion,
  status: row.status,
  updatedAt: row.updated_at,
});

const toPublic = (review: Review): PublicReview => ({
  id: review.id,
  rating: review.rating,
  body: review.body,
  name: review.name,
  place: review.place,
  occasion: review.occasion,
  updatedAt: review.updatedAt,
});

const supabaseStore: ReviewStore = {
  async mine(account) {
    const service = supabaseService();
    if (!service) return null;
    const { data } = await service
      .from("reviews")
      .select(COLUMNS)
      .eq("user_id", account.id)
      .maybeSingle();
    return data ? fromRow(data as Row) : null;
  },

  async save(account, input) {
    const service = supabaseService();
    if (!service) return "failed";
    // Only a host whose invitation has gone live: their latest names the occasion
    const { data: live } = await service
      .from("events")
      .select("id, category_id")
      .eq("owner_id", account.id)
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!live) return "not-live";
    const row = live as { id: string; category_id: string };
    const { error } = await service.from("reviews").upsert(
      {
        user_id: account.id,
        event_id: row.id,
        occasion: row.category_id,
        ...input,
        status: "pending",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
    return error ? "failed" : "saved";
  },

  async approved(limit) {
    const service = supabaseService();
    if (!service) return [];
    const { data } = await service
      .from("reviews")
      .select(COLUMNS)
      .eq("status", "approved")
      .order("updated_at", { ascending: false })
      .limit(limit);
    return ((data ?? []) as Row[]).map((row) => toPublic(fromRow(row)));
  },

  async all() {
    const service = supabaseService();
    if (!service) return [];
    const { data } = await service
      .from("reviews")
      .select(COLUMNS)
      .order("updated_at", { ascending: false })
      .limit(500);
    return ((data ?? []) as Row[]).map(fromRow);
  },

  async setStatus(id, status) {
    const service = supabaseService();
    if (!service) return false;
    const { error, count } = await service
      .from("reviews")
      .update({ status }, { count: "exact" })
      .eq("id", id);
    return !error && (count ?? 0) > 0;
  },
};

/* ---------- Preview mode ---------- */

type Stored = Review & { userId: string };
const holder = globalThis as unknown as { __shubhPreviewReviews?: Stored[] };
const previewReviews = (): Stored[] => (holder.__shubhPreviewReviews ??= []);
const strip = (stored: Stored): Review => ({ ...toPublic(stored), status: stored.status });

const previewStore: ReviewStore = {
  async mine(account) {
    const found = previewReviews().find((review) => review.userId === account.id);
    return found ? strip(found) : null;
  },
  async save(account, input) {
    const live = [...previewDb.invites.values()]
      .filter((stored) => stored.owner === account.id && stored.publishedAt)
      .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)))[0];
    if (!live) return "not-live";
    const review: Stored = {
      ...input,
      id: crypto.randomUUID(),
      userId: account.id,
      occasion: live.event.category_id,
      status: "pending",
      updatedAt: new Date().toISOString(),
    };
    holder.__shubhPreviewReviews = [
      review,
      ...previewReviews().filter((item) => item.userId !== account.id),
    ];
    return "saved";
  },
  async approved(limit) {
    return previewReviews()
      .filter((review) => review.status === "approved")
      .slice(0, limit)
      .map((review) => toPublic(strip(review)));
  },
  async all() {
    return previewReviews().map(strip);
  },
  async setStatus(id, status) {
    const found = previewReviews().find((review) => review.id === id);
    if (!found) return false;
    found.status = status;
    return true;
  },
};

/** Reviews for the current sign-in service, or null when accounts are off. */
export function reviewStore(): ReviewStore | null {
  const mode = authMode();
  if (mode === "supabase") return supabaseStore;
  if (mode === "preview") return previewStore;
  return null;
}
