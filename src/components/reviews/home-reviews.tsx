"use client";

import { Quote } from "lucide-react";
import { useLocale, useText } from "@/i18n/client";
import { trustText } from "@/i18n/copy/trust";
import { CATEGORIES, isCategoryId } from "@/lib/categories/catalog";
import { Stars } from "./stars";
import { useTrust } from "./use-trust";

/**
 * What families say: reviews from hosts whose invitations went live, each read and approved
 * by an admin first. The section is left out while there are none.
 */
export function HomeReviews() {
  const trust = useTrust();
  const { trustCopy } = useText(trustText);
  const locale = useLocale();
  const reviews = trust?.reviews ?? [];
  if (reviews.length === 0) return null;
  return (
    <section
      id="reviews"
      aria-labelledby="home-reviews"
      data-home-reviews
      className="mx-auto w-full max-w-site px-4 py-14 sm:px-6 lg:py-20"
    >
      <div className="mb-8 flex max-w-2xl flex-col gap-2">
        <h2 id="home-reviews" className="font-display text-[1.9rem] leading-tight sm:text-4xl">
          {trustCopy.reviewsHeading}
        </h2>
        <p className="text-ink-muted">{trustCopy.reviewsIntro}</p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.slice(0, 6).map((review) => (
          <li key={review.id}>
            <figure className="flex h-full flex-col gap-3 rounded-lg border border-line bg-surface p-5 shadow-raised">
              <Stars value={review.rating} label={trustCopy.stars(review.rating)} />
              <blockquote className="relative flex-1 text-ink">
                <Quote
                  aria-hidden
                  className="absolute -top-1 -left-1 size-5 text-marigold/40 rtl:right-0 rtl:left-auto"
                />
                <p className="ps-6 break-words">{review.body}</p>
              </blockquote>
              <figcaption className="text-sm text-ink-muted">
                <span className="font-semibold text-ink">{review.name}</span>
                {[
                  review.place,
                  isCategoryId(review.occasion) ? CATEGORIES[review.occasion].names[locale] : "",
                ]
                  .filter(Boolean)
                  .map((part) => ` · ${part}`)
                  .join("")}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
