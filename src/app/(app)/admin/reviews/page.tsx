import { MessageSquareHeart } from "lucide-react";
import type { Metadata } from "next";
import { AdminHeading } from "@/components/admin/admin-shell";
import { AskForReview, ReviewControls } from "@/components/admin/review-controls";
import { Stars } from "@/components/reviews/stars";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { requireAdmin } from "@/lib/admin/access";
import { CATEGORIES, isCategoryId } from "@/lib/categories/catalog";
import { reviewStore, type Review } from "@/lib/reviews/store";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Reviews" };

const when = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" });

const STATUS = {
  pending: { label: "Waiting for you", tone: "warning" },
  approved: { label: "On the site", tone: "success" },
  hidden: { label: "Hidden", tone: "neutral" },
} as const;

/**
 * Hosts' reviews (lib/reviews/store.ts): new ones wait here until an admin shows them on the
 * site or hides them. Only real reviews from hosts whose invitation went live ever arrive.
 */
export default async function ReviewsPage() {
  await requireAdmin("/admin/reviews");
  const reviews =
    (await reviewStore()
      ?.all()
      .catch(() => [])) ?? [];
  const order = { pending: 0, approved: 1, hidden: 2 } as const;
  const sorted = [...reviews].sort((a, b) => order[a.status] - order[b.status]);

  return (
    <>
      <AdminHeading
        eyebrow="People"
        title="Reviews"
        intro="Hosts whose invitation is live can write a review from their account. Nothing shows on the site until you choose Show on the site, and the home page and designs' pages then show it with the name and place the host chose."
      />
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ask a family for a review</CardTitle>
            <CardDescription>
              Send this link to a family after their invitation went out. They sign in, and it opens
              their review form.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <AskForReview url={`${site.url}/review`} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareHeart aria-hidden className="size-5 text-accent-text" />
              Reviews
            </CardTitle>
          </CardHeader>
          <CardBody>
            {sorted.length === 0 ? (
              <EmptyState
                icon={<MessageSquareHeart aria-hidden />}
                title="No reviews yet"
                description="Send families the review link above once their invitation has gone out."
              />
            ) : (
              <ul className="-my-2 divide-y divide-line" data-review-list>
                {sorted.map((review) => (
                  <ReviewRow key={review.id} review={review} />
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}

function ReviewRow({ review }: { review: Review }) {
  const status = STATUS[review.status];
  const occasion = isCategoryId(review.occasion) ? CATEGORIES[review.occasion].names.en : "";
  return (
    <li data-review={review.id} className="flex flex-col gap-3 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <Stars value={review.rating} label={`${review.rating} out of 5 stars`} />
        <Badge tone={status.tone} dot>
          {status.label}
        </Badge>
        <span className="text-xs text-ink-muted">{when.format(new Date(review.updatedAt))}</span>
      </div>
      <p className="break-words whitespace-pre-line">{review.body}</p>
      <p className="text-sm text-ink-muted">
        <span className="font-semibold text-ink">{review.name}</span>
        {[review.place, occasion]
          .filter(Boolean)
          .map((part) => ` · ${part}`)
          .join("")}
      </p>
      <ReviewControls id={review.id} status={review.status} />
    </li>
  );
}
