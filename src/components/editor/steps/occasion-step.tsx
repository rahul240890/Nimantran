"use client";

import { CalendarCheck, MessageCircleQuestion, Palette } from "lucide-react";
import { CategoryIcon } from "@/components/categories/category-icon";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { categoryGroups, categoryTaglines, questionLabels } from "@/content/categories";
import { functionCopy, occasionCopy } from "@/content/editor";
import { CATEGORIES, CATEGORY_IDS, isCategoryId } from "@/lib/categories/catalog";
import { rankCategories } from "@/lib/categories/rank";
import { regionLanguage } from "@/lib/categories/regions";
import { CATEGORY_GROUPS } from "@/lib/categories/schema";
import { useVisitor } from "@/lib/categories/use-visitor";
import { draftCategory, functionOrder, withCategory } from "@/lib/editor/draft";
import type { StepProps } from "./types";

/** What the chosen occasion plans, asks and suggests, so the choice never feels blind. */
function SetsUp({ draft }: Pick<StepProps, "draft">) {
  const category = draftCategory(draft);
  const planned = functionOrder(draft).suggested.filter((id) =>
    category.functions.planned.includes(id),
  );
  return (
    <section
      aria-labelledby="sets-up-heading"
      aria-live="polite"
      className="flex flex-col gap-4 rounded-lg border border-line bg-surface-2/60 p-5"
    >
      <h2 id="sets-up-heading" className="font-display text-xl">
        {occasionCopy.setsUp}
      </h2>
      <dl className="grid gap-4 text-sm sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <dt className="flex items-center gap-2 font-semibold">
            <CalendarCheck aria-hidden className="size-4 text-accent-text" />
            {occasionCopy.planned}
          </dt>
          <dd className="text-ink-muted">
            {planned.map((id) => functionCopy[id].name).join(", ")}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="flex items-center gap-2 font-semibold">
            <MessageCircleQuestion aria-hidden className="size-4 text-accent-text" />
            {occasionCopy.questions}
          </dt>
          <dd className="text-ink-muted">
            {category.rsvpQuestions.length > 0
              ? category.rsvpQuestions.map((id) => questionLabels[id]).join(", ")
              : occasionCopy.noQuestions}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="flex items-center gap-2 font-semibold">
            <Palette aria-hidden className="size-4 text-accent-text" />
            {occasionCopy.designs(category.templates.length)}
          </dt>
          <dd className="text-ink-muted">{categoryTaglines[draft.categoryId]}</dd>
        </div>
      </dl>
    </section>
  );
}

export function OccasionStep({ draft, update }: StepProps) {
  const visitor = useVisitor();
  const local = regionLanguage(visitor.region);
  // Local and seasonal occasions first, the same order as the home screen
  const ranked = rankCategories(
    CATEGORY_IDS.map((id) => CATEGORIES[id]),
    visitor,
  );
  const groups = CATEGORY_GROUPS.map((group) => ({
    group,
    items: ranked.filter((category) => category.group === group),
  })).filter((entry) => entry.items.length > 0);

  return (
    <div className="flex flex-col gap-8">
      {groups.map(({ group, items }) => (
        <section key={group} aria-labelledby={`group-${group}`} className="flex flex-col gap-4">
          <h2
            id={`group-${group}`}
            className="font-label text-xs tracking-[0.24em] text-ink-muted uppercase"
          >
            {categoryGroups[group]}
          </h2>
          <RadioGroup
            label={categoryGroups[group]}
            variant="card"
            value={draft.categoryId}
            onValueChange={(value) => {
              if (isCategoryId(value)) update((current) => withCategory(current, value));
            }}
            className="grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-2 xl:grid-cols-3"
          >
            {items.map((category) => {
              const id = category.id;
              return (
                <RadioItem
                  key={id}
                  value={id}
                  label={
                    <span className="flex flex-col">
                      <span className="font-display text-lg leading-tight font-normal">
                        {category.names.en}
                      </span>
                      <span
                        lang={local}
                        className="text-sm font-normal [overflow-wrap:anywhere] text-accent-text"
                      >
                        {category.names[local]}
                      </span>
                    </span>
                  }
                  description={categoryTaglines[id as keyof typeof categoryTaglines]}
                  icon={
                    <span className="grid size-11 place-items-center rounded-full border border-marigold/45 bg-[color-mix(in_srgb,var(--marigold)_12%,var(--surface))] text-accent-text shadow-[inset_0_1px_0_color-mix(in_srgb,white_40%,transparent)] [&_svg]:size-5!">
                      <CategoryIcon icon={category.icon} />
                    </span>
                  }
                />
              );
            })}
          </RadioGroup>
        </section>
      ))}
      <SetsUp draft={draft} />
    </div>
  );
}
