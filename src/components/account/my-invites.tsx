"use client";

import { formatDistanceToNow, format, parseISO } from "date-fns";
import {
  ArrowRight,
  CalendarDays,
  CloudAlert,
  FilePlus2,
  HardDrive,
  Send,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore, useTransition, type ReactNode } from "react";
import { deleteInvite } from "@/app/_actions/invites";
import { TemplateCover } from "@/components/brand/template-cover";
import { CategoryIcon } from "@/components/categories/category-icon";
import { TiltCard } from "@/components/motion/tilt-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { invitesCopy } from "@/content/account";
import { cn } from "@/lib/cn";
import { functionCopy, stepCopy } from "@/content/editor";
import { CATEGORIES, isCategoryId } from "@/lib/categories/catalog";
import { draftCategory, draftCopy, mainFunction, type FunctionId } from "@/lib/editor/draft";
import { forgetShelvedPhotos, shelvedPhotos } from "@/lib/editor/photo-refs";
import { deletePhoto } from "@/lib/editor/photos";
import { inviteDraft } from "@/lib/editor/store";
import type { InviteSummary } from "@/lib/invites/rows";
import { isTemplateId, type TemplateId } from "@/lib/templates/schema";

const noop = () => () => {};

type CardProps = {
  templateId: TemplateId;
  categoryId: string;
  title: string;
  main: FunctionId | null;
  date: string;
  meta: string;
  badge?: ReactNode;
  href: string;
  /** Shown above the card's link, which covers the rest of it. */
  action?: ReactNode;
  /** A second button beside the main one, such as Share. */
  secondary?: ReactNode;
};

function InviteCard({
  templateId,
  categoryId,
  title,
  main,
  date,
  meta,
  badge,
  href,
  action,
  secondary,
}: CardProps) {
  const category = CATEGORIES[isCategoryId(categoryId) ? categoryId : "wedding"];
  return (
    <article className="group relative flex h-full gap-4 rounded-lg border border-line bg-surface p-4 shadow-raised transition-[box-shadow,border-color] duration-300 focus-within:border-marigold/60 hover:shadow-float sm:gap-5 sm:p-5">
      <div className="w-16 shrink-0 min-[360px]:w-20 sm:w-24">
        <TiltCard maxTilt={8} className="rounded-sm">
          <TemplateCover id={templateId} className="rounded-sm shadow-raised" />
        </TiltCard>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className={cn("flex flex-wrap items-center gap-2", action && "pe-10")}>
          <Badge tone="gold">
            <CategoryIcon icon={category.icon} className="me-1 -mt-0.5 inline size-3.5" />
            {category.names.en}
          </Badge>
          {badge}
        </div>
        <h3 className="font-display text-xl leading-tight break-words sm:text-2xl">{title}</h3>
        {main && date && (
          <p className="flex items-center gap-1.5 text-sm text-ink">
            <CalendarDays aria-hidden className="size-4 shrink-0 text-ink-muted" />
            {functionCopy[main].name} · {format(parseISO(date), "d MMM yyyy")}
          </p>
        )}
        <p className="text-sm text-ink-muted">{meta}</p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          <Button asChild size="sm" variant="secondary">
            {/* The whole card is clickable through this link */}
            <Link
              href={href}
              className="after:absolute after:inset-0 after:rounded-lg after:content-['']"
            >
              {invitesCopy.continueEditing}
              <ArrowRight aria-hidden className="rtl:rotate-180" />
            </Link>
          </Button>
          {secondary && <div className="relative z-10">{secondary}</div>}
        </div>
      </div>
      {action && <div className="absolute end-2 top-2 z-10">{action}</div>}
    </article>
  );
}

const titleOf = (first: string, joiner: string, second: string) =>
  first && second ? `${first} ${joiner || "&"} ${second}` : invitesCopy.untitled;

/** Deleting asks first: the invite, its functions and guest list go for good. */
function DeleteInvite({ invite, title }: { invite: InviteSummary; title: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, startDeleting] = useTransition();

  const remove = () =>
    startDeleting(async () => {
      const done = await deleteInvite(invite.id).catch(() => false);
      if (!done) {
        toast({ title: invitesCopy.remove.failed, tone: "error" });
        return;
      }
      // Its photos on this device go too, and the editor starts fresh if it had it open
      const open = inviteDraft.get().draft;
      const photos = open.remoteId === invite.id ? open.photos : shelvedPhotos(invite.id);
      for (const photo of photos) void deletePhoto(photo.id).catch(() => {});
      forgetShelvedPhotos(invite.id);
      if (open.remoteId === invite.id) inviteDraft.reset();
      setOpen(false);
      toast({ title: invitesCopy.remove.done, tone: "success" });
      router.refresh();
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <IconButton
        variant="ghost"
        size="sm"
        label={invitesCopy.remove.label(title)}
        icon={<Trash2 aria-hidden />}
        onClick={() => setOpen(true)}
        className="text-ink-muted hover:text-danger"
      />
      <DialogContent
        title={invitesCopy.remove.title}
        closeLabel={invitesCopy.remove.close}
        footer={
          <>
            <DialogClose asChild>
              <Button variant="secondary">{invitesCopy.remove.cancel}</Button>
            </DialogClose>
            <Button variant="danger" loading={deleting} onClick={remove}>
              {invitesCopy.remove.confirm}
            </Button>
          </>
        }
      >
        <p className="text-ink-muted">{invitesCopy.remove.body(title)}</p>
      </DialogContent>
    </Dialog>
  );
}

function SectionHeading({
  id,
  icon,
  title,
  note,
}: {
  id: string;
  icon: ReactNode;
  title: string;
  note?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <h2
        id={id}
        className="flex items-center gap-2 font-label text-xs tracking-[0.24em] text-ink-muted uppercase"
      >
        {icon}
        {title}
      </h2>
      {note && <p className="text-sm text-ink-muted">{note}</p>}
    </div>
  );
}

/**
 * The invites saved in this person's account, and a draft on this device that isn't in
 * the account yet (made before signing in, or while offline). invites is null when the
 * account's list couldn't be read.
 */
export function MyInvites({ invites }: { invites: InviteSummary[] | null }) {
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
      <div role="status" aria-label={invitesCopy.loading} className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-44 rounded-lg" />
        <Skeleton className="h-44 rounded-lg max-md:hidden" />
      </div>
    );
  }

  const saved = invites ?? [];
  const onDevice = draft.updatedAt !== 0 && !saved.some((invite) => invite.id === draft.remoteId);

  if (!onDevice && saved.length === 0 && invites) {
    return (
      <EmptyState
        icon={<FilePlus2 aria-hidden className="size-7" />}
        title={invitesCopy.empty.title}
        description={invitesCopy.empty.body}
        action={
          <Button asChild>
            <Link href="/create?new=1">{invitesCopy.empty.action}</Link>
          </Button>
        }
      />
    );
  }

  const deviceCard = () => {
    const copy = draftCopy(draft);
    const main = mainFunction(draft);
    const named = Boolean(draft.content.first?.trim() && draft.content.second?.trim());
    return (
      <InviteCard
        templateId={draft.templateId}
        categoryId={draftCategory(draft).id}
        title={named ? titleOf(copy.first, copy.joiner, copy.second) : invitesCopy.untitled}
        main={main}
        date={main ? draft.functions[main].date : ""}
        meta={`${invitesCopy.updated(formatDistanceToNow(draft.updatedAt, { addSuffix: true }))} · ${invitesCopy.step(stepCopy[draft.step].label)}`}
        badge={
          <Badge tone="warning">
            <HardDrive aria-hidden className="me-1 -mt-0.5 inline size-3.5" />
            {invitesCopy.deviceBadge}
          </Badge>
        }
        href="/create"
      />
    );
  };

  return (
    <div className="flex flex-col gap-10">
      {invites === null && (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-md border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-ink"
        >
          <CloudAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-warning" />
          {invitesCopy.loadFailed}
        </p>
      )}

      {onDevice && (
        <section aria-labelledby="device-heading" className="flex flex-col gap-4">
          <SectionHeading
            id="device-heading"
            icon={<HardDrive aria-hidden className="size-4" />}
            title={invitesCopy.deviceHeading}
            note={invitesCopy.deviceNote}
          />
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
            <li>{deviceCard()}</li>
          </ul>
        </section>
      )}

      {saved.length > 0 && (
        <section aria-labelledby="account-heading" className="flex flex-col gap-4">
          <SectionHeading
            id="account-heading"
            icon={<FilePlus2 aria-hidden className="size-4" />}
            title={invitesCopy.accountHeading(saved.length)}
          />
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
            {saved.map((invite) => {
              const title = titleOf(invite.first, invite.joiner, invite.second);
              return (
                <li key={invite.id}>
                  <InviteCard
                    templateId={isTemplateId(invite.templateId) ? invite.templateId : "marigold"}
                    categoryId={invite.categoryId}
                    title={title}
                    main={invite.mainFunction}
                    date={invite.date}
                    meta={invitesCopy.updated(
                      formatDistanceToNow(invite.updatedAt, { addSuffix: true }),
                    )}
                    badge={
                      <>
                        {invite.status === "published" ? (
                          <Badge tone="success" dot>
                            {invitesCopy.status.published}
                          </Badge>
                        ) : (
                          <Badge tone="neutral">{invitesCopy.status.draft}</Badge>
                        )}
                        {invite.role === "cohost" && (
                          <Badge tone="rose">{invitesCopy.cohost}</Badge>
                        )}
                      </>
                    }
                    href={`/create?invite=${invite.id}`}
                    secondary={
                      <div className="flex flex-wrap gap-2">
                        <Button asChild size="sm" variant="secondary">
                          <Link href={`/invites/${invite.id}`}>
                            <Users aria-hidden />
                            {invitesCopy.guests}
                          </Link>
                        </Button>
                        {invite.status === "published" && (
                          <Button asChild size="sm">
                            <Link href={`/invites/${invite.id}/share`}>
                              <Send aria-hidden className="rtl:-scale-x-100" />
                              {invitesCopy.share}
                            </Link>
                          </Button>
                        )}
                      </div>
                    }
                    action={
                      invite.role === "owner" ? (
                        <DeleteInvite
                          invite={invite}
                          title={invite.first && invite.second ? title : invitesCopy.remove.unnamed}
                        />
                      ) : undefined
                    }
                  />
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
