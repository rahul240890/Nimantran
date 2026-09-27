import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { landingText } from "@/i18n/copy/landing";
import type { UiLocale } from "@/i18n/locales";
import { cn } from "@/lib/cn";
import { Section } from "./section";

type Plan = {
  name: string;
  price: string;
  per: string;
  points: readonly string[];
  badge?: string;
};

function PlanCard({ plan, featured }: { plan: Plan; featured?: boolean }) {
  return (
    <Card
      className={cn(
        "h-full reveal-on-scroll gap-6 p-6 sm:p-8",
        featured && "border-marigold/60 shadow-float",
      )}
    >
      {featured ? (
        <span
          aria-hidden
          className="absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-marigold to-transparent"
        />
      ) : null}
      {/* Wraps below the name on the narrowest phones rather than poking out of the card */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <h3 className="font-display text-2xl">{plan.name}</h3>
        {plan.badge ? (
          <Badge tone="gold" dot>
            {plan.badge}
          </Badge>
        ) : null}
      </div>
      <p className="flex flex-wrap items-baseline gap-x-2">
        <span className={cn("font-display text-5xl leading-none", featured && "text-gold-shimmer")}>
          {plan.price}
        </span>
        <span className="text-ink-muted">{plan.per}</span>
      </p>
      <ul className="flex flex-col gap-3 border-t border-line pt-6">
        {plan.points.map((point) => (
          <li key={point} className="flex items-start gap-3">
            <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-success" strokeWidth={2.5} />
            {point}
          </li>
        ))}
      </ul>
    </Card>
  );
}

/** A preview only: real plans and checkout arrive with payments. */
export function Pricing({ locale }: { locale: UiLocale }) {
  const { pricing } = landingText[locale];
  return (
    <Section id="pricing" eyebrow={pricing.eyebrow} title={pricing.title} intro={pricing.intro}>
      <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2 md:gap-6">
        <PlanCard plan={pricing.free} />
        <PlanCard plan={pricing.premium} featured />
      </div>
      <div className="mt-10 flex flex-col items-center gap-5 text-center">
        <p className="max-w-md text-ink-muted">{pricing.note}</p>
        <Button asChild>
          <a href="#waitlist">{pricing.cta}</a>
        </Button>
      </div>
    </Section>
  );
}
