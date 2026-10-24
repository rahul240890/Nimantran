"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";
import { getAdmin } from "@/lib/admin/access";
import { getAccount } from "@/lib/auth/server";
import { REVIEW_STATUSES, reviewStore, type SaveReviewResult } from "@/lib/reviews/store";
import { TRUST_TAG } from "@/lib/reviews/trust";

/* Reviews: a host writes one (/review); an admin approves or hides it (Admin, Reviews). */

const reviewInput = z.object({
  rating: z.number().int().min(1).max(5),
  body: z.string().trim().min(10).max(600),
  name: z.string().trim().min(1).max(60),
  place: z.string().trim().max(60),
});

export type ReviewFields = z.input<typeof reviewInput>;

export async function saveReview(
  fields: ReviewFields,
): Promise<SaveReviewResult | "signed-out" | "invalid"> {
  const parsed = reviewInput.safeParse(fields);
  if (!parsed.success) return "invalid";
  const store = reviewStore();
  const account = await getAccount();
  if (!store) return "failed";
  if (!account) return "signed-out";
  return store.save(account, parsed.data).catch(() => "failed" as const);
}

export async function setReviewStatus(id: string, status: string): Promise<boolean> {
  const store = reviewStore();
  const admin = await getAdmin();
  const known = (REVIEW_STATUSES as readonly string[]).includes(status);
  if (!store || !admin || !known || !z.uuid().safeParse(id).success) return false;
  const done = await store
    .setStatus(id, status as (typeof REVIEW_STATUSES)[number])
    .catch(() => false);
  // The home page and designs' pages show approved reviews straight away
  if (done) revalidateTag(TRUST_TAG, { expire: 0 });
  return done;
}
