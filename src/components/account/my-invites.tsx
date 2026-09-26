"use client";

import { formatDistanceToNow, format, parseISO } from "date-fns";
import { ArrowRight, CalendarDays, FilePlus2, HardDrive } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { TemplateCover } from "@/components/brand/template-cover";
import { CategoryIcon } from "@/components/categories/category-icon";
import { TiltCard } from "@/components/motion/tilt-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { invitesCopy } from "@/content/account";
import { functionCopy, stepCopy } from "@/content/editor";
import { draftCategory, draftCopy, mainFunction } from "@/lib/editor/draft";
import { inviteDraft } from "@/lib/editor/store";

const noop = () => () => {};

/** The invites this person has on the device, for now the one draft the editor keeps. */
export function MyInvites() {
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const { draft } = useSyncExternalStore(
    inviteDraft.subscribe,
    inviteDraft.get,
    inviteDraft.getServer,
  );

  if (!hydrated) {
    return (
      <div role="status" aria-label={invitesCopy.loading} className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-44 rounded-lg" />
      </div>
    );
  }

  if (draft.updatedAt === 0) {
    return (
      <EmptyState
        icon={<FilePlus2 aria-hidden className="size-7" />}
        title={invitesCopy.empty.title}
        description={invitesCopy.empty.body}
        action={
          <Button asChild>
            <Link href="/create">{invitesCopy.empty.action}</Link>
          </Button>
        }
      />
    );
  }

  const category = draftCategory(draft);
  const copy = draftCopy(draft);
  const named = Boolean(draft.content.first?.trim() && draft.content.second?.trim());
  const title = named ? `${copy.first} ${copy.joiner || "&"} ${copy.second}` : invitesCopy.untitled;
  const main = mainFunction(draft);
  const date = main ? draft.functions[main].date : "";

  return (
    <section aria-labelledby="device-heading" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2
          id="device-heading"
          className="flex items-center gap-2 font-label text-xs tracking-[0.24em] text-ink-muted uppercase"
        >
          <HardDrive aria-hidden className="size-4" />
          {invitesCopy.deviceHeading}
        </h2>
        <p className="text-sm text-ink-muted">{invitesCopy.deviceNote}</p>
      </div>
      <ul className="grid gap-4 md:grid-cols-2">
        <li>
          <article className="group relative flex h-full gap-4 rounded-lg border border-line bg-surface p-4 shadow-raised transition-[box-shadow,border-color] duration-300 focus-within:border-marigold/60 hover:shadow-float sm:gap-5 sm:p-5">
            <div className="w-20 shrink-0 sm:w-24">
              <TiltCard maxTilt={8} className="rounded-sm">
                <TemplateCover id={draft.templateId} className="rounded-sm shadow-raised" />
              </TiltCard>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Badge tone="gold" className="self-start">
                <CategoryIcon icon={category.icon} className="me-1 -mt-0.5 inline size-3.5" />
                {category.names.en}
              </Badge>
              <h3 className="font-display text-xl leading-tight break-words sm:text-2xl">
                {title}
              </h3>
              {main && date && (
                <p className="flex items-center gap-1.5 text-sm text-ink">
                  <CalendarDays aria-hidden className="size-4 shrink-0 text-ink-muted" />
                  {functionCopy[main].name} · {format(parseISO(date), "d MMM yyyy")}
                </p>
              )}
              <p className="text-sm text-ink-muted">
                {invitesCopy.updated(formatDistanceToNow(draft.updatedAt, { addSuffix: true }))}
                {" · "}
                {invitesCopy.step(stepCopy[draft.step].label)}
              </p>
              <div className="mt-auto pt-2">
                <Button asChild size="sm" variant="secondary">
                  {/* The whole card is clickable through this link */}
                  <Link
                    href="/create"
                    className="after:absolute after:inset-0 after:rounded-lg after:content-['']"
                  >
                    {invitesCopy.continueEditing}
                    <ArrowRight aria-hidden className="rtl:rotate-180" />
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        </li>
      </ul>
    </section>
  );
}
