"use client";

import { Send, Star } from "lucide-react";
import { useState, useTransition } from "react";
import { saveReview } from "@/actions/reviews";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useText } from "@/i18n/client";
import { dashboardText } from "@/i18n/copy/dashboard";
import type { ReviewStatus } from "@/lib/reviews/store";

type Initial = {
  rating: number;
  body: string;
  name: string;
  place: string;
  /** Null before the first review. */
  status: ReviewStatus | null;
};

/** Stars, words, and the name and place to show with them. */
export function ReviewForm({ initial }: { initial: Initial }) {
  const { reviewCopy } = useText(dashboardText);
  const [rating, setRating] = useState(initial.rating);
  const [body, setBody] = useState(initial.body);
  const [name, setName] = useState(initial.name);
  const [place, setPlace] = useState(initial.place);
  const [status, setStatus] = useState(initial.status);
  const [checked, setChecked] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const errors = {
    rating: rating < 1 ? reviewCopy.errors.rating : undefined,
    body: body.trim().length < 10 ? reviewCopy.errors.body : undefined,
    name: name.trim().length < 1 ? reviewCopy.errors.name : undefined,
  };
  const shown: Partial<typeof errors> = checked ? errors : {};

  const send = () => {
    setChecked(true);
    setMessage(null);
    if (errors.rating || errors.body || errors.name) return;
    start(async () => {
      const result = await saveReview({ rating, body, name, place }).catch(() => "failed");
      if (result === "saved") {
        setStatus("pending");
        setMessage(reviewCopy.saved);
      } else if (result === "not-live") {
        setMessage(reviewCopy.notLive);
      } else {
        setMessage(reviewCopy.failed);
      }
    });
  };

  return (
    <form
      noValidate
      data-review-form
      onSubmit={(event) => {
        event.preventDefault();
        send();
      }}
      className="flex flex-col gap-6"
    >
      {status && !message && (
        <p className="rounded-md border border-line bg-surface-2 px-4 py-3 text-sm">
          {reviewCopy.status[status]}
        </p>
      )}
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 font-semibold">{reviewCopy.rating}</legend>
        <RadioGroup
          label={reviewCopy.rating}
          variant="segment"
          value={rating ? String(rating) : ""}
          onValueChange={(value) => setRating(Number(value))}
          invalid={Boolean(shown.rating)}
        >
          {[1, 2, 3, 4, 5].map((count) => (
            <RadioItem
              key={count}
              value={String(count)}
              icon={<Star className={count <= rating ? "fill-current text-accent-text" : ""} />}
              label={
                <>
                  <span aria-hidden>{count}</span>
                  <span className="sr-only">{reviewCopy.stars(count)}</span>
                </>
              }
            />
          ))}
        </RadioGroup>
        {shown.rating && (
          <p role="alert" className="text-sm font-medium text-danger">
            {shown.rating}
          </p>
        )}
      </fieldset>
      <Field label={reviewCopy.body} hint={reviewCopy.bodyHint} error={shown.body} required>
        <Textarea
          rows={5}
          maxLength={600}
          value={body}
          onChange={(event) => setBody(event.target.value)}
        />
      </Field>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label={reviewCopy.name} hint={reviewCopy.nameHint} error={shown.name} required>
          <Input maxLength={60} value={name} onChange={(event) => setName(event.target.value)} />
        </Field>
        <Field label={reviewCopy.place}>
          <Input maxLength={60} value={place} onChange={(event) => setPlace(event.target.value)} />
        </Field>
      </div>
      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          size="lg"
          loading={pending}
          leadingIcon={<Send aria-hidden className="rtl:-scale-x-100" />}
          className="self-start"
        >
          {reviewCopy.submit}
        </Button>
        <p role="status" aria-live="polite" className="text-sm font-medium">
          {message}
        </p>
      </div>
    </form>
  );
}
