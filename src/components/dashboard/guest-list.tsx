"use client";

import { formatDistanceToNow } from "date-fns";
import {
  BellRing,
  CircleCheck,
  CircleHelp,
  CircleX,
  Clock,
  Copy,
  Download,
  Eye,
  EyeOff,
  MessageCircle,
  MoreVertical,
  Pencil,
  Search,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeferredValue, useMemo, useState, useTransition } from "react";
import { markReminded, removeGuests } from "@/actions/guests";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { formatPhone } from "@/lib/auth/phone";
import { cn } from "@/lib/cn";
import {
  GUEST_FILTERS,
  filterGuests,
  invitedTo,
  matchesFilter,
  peopleIn,
  sortGuests,
  type GuestFilter,
  type HostGuest,
} from "@/lib/guests/list";
import { personalUrl, whatsappToUrl } from "@/lib/publish/links";
import { GuestFormDialog } from "./guest-form";
import type { DashboardView } from "./types";
import { useLocale, useText } from "@/i18n/client";
import { dateLocale } from "@/i18n/dates";
import { dashboardText } from "@/i18n/copy/dashboard";
import { editorText } from "@/i18n/copy/editor";

const statusLook = {
  attending: { icon: CircleCheck, className: "border-success/35 bg-success/10 text-success" },
  maybe: { icon: CircleHelp, className: "border-warning/35 bg-warning/10 text-warning" },
  declined: { icon: CircleX, className: "border-line-strong bg-surface-2 text-ink-muted" },
  waiting: { icon: Clock, className: "border-dashed border-line-strong text-ink-muted" },
} as const;

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

type Messages = (typeof dashboardText)["en"]["dashboardCopy"]["messages"];

/** A message with the guest's name and their own link, for WhatsApp. */
export function guestMessage(
  messages: Messages,
  view: DashboardView,
  guest: HostGuest,
  kind: "invite" | "reminder",
  template?: string,
): string {
  const link = view.url ? personalUrl(view.url, guest.token) : "";
  const body =
    template?.replaceAll("{name}", guest.name) ??
    messages[kind](guest.name, view.names, view.occasion, view.when);
  return `${body.trim()}\n${link}`;
}

function GuestRow({
  view,
  guest,
  onEdit,
  onRemove,
}: {
  view: DashboardView;
  guest: HostGuest;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const locale = useLocale();
  const copy = useText(dashboardText).dashboardCopy;
  const { functionCopy } = useText(editorText);
  const router = useRouter();
  const waiting = guest.replies.length === 0;
  const opened = Boolean(guest.openedAt) || !waiting;
  const kind = waiting && (guest.openedAt || guest.remindedAt) ? "reminder" : "invite";

  const send = () => {
    if (kind === "reminder") {
      void markReminded(view.id, [guest.id]).then((ok) => ok && router.refresh());
    }
  };

  return (
    <li className="flex gap-3 py-4 first:pt-1 sm:gap-4">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-semibold break-words">{guest.name}</span>
          {guest.group && <Badge tone="neutral">{guest.group}</Badge>}
          <span className="text-sm text-ink-muted">{copy.guest.party(guest.partySize)}</span>
        </div>
        <ul className="flex flex-wrap gap-1.5" aria-label={guest.name}>
          {view.functions.map((fn) => {
            const reply = guest.replies.find((item) => item.functionId === fn.id);
            if (!reply && !invitedTo(guest, fn.id)) return null;
            const state = reply?.status ?? "waiting";
            const look = statusLook[state];
            const Icon = look.icon;
            return (
              <li
                key={fn.id}
                className={cn(
                  "inline-flex min-h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold",
                  look.className,
                )}
              >
                <Icon aria-hidden className="size-3.5" />
                {functionCopy[fn.kind].name}:{" "}
                {reply ? copy.guest.status[reply.status] : copy.guest.waiting}
                {reply && reply.status !== "declined" && copy.guest.people(peopleIn(reply))}
              </li>
            );
          })}
        </ul>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            {opened ? (
              <Eye aria-hidden className="size-4" />
            ) : (
              <EyeOff aria-hidden className="size-4" />
            )}
            {opened ? copy.guest.opened : copy.guest.notOpened}
          </span>
          {guest.phone && <span className="tabular-nums">{formatPhone(guest.phone)}</span>}
          {guest.remindedAt && waiting && (
            <span className="inline-flex items-center gap-1.5">
              <BellRing aria-hidden className="size-4" />
              {copy.guest.reminded(
                formatDistanceToNow(guest.remindedAt, {
                  addSuffix: true,
                  locale: dateLocale[locale],
                }),
              )}
            </span>
          )}
          {guest.selfAdded && <span>{copy.guest.selfAdded}</span>}
        </p>
        {guest.message && (
          <q className="text-sm break-words text-ink-muted italic">{guest.message}</q>
        )}
      </div>
      <div className="flex shrink-0 items-start gap-1">
        {view.url && (
          <Button
            asChild
            size="sm"
            variant={kind === "reminder" ? "secondary" : "ghost"}
            className="max-sm:hidden"
          >
            <a
              href={whatsappToUrl(guest.phone, guestMessage(copy.messages, view, guest, kind))}
              target="_blank"
              rel="noopener noreferrer"
              onClick={send}
              aria-label={
                kind === "reminder"
                  ? copy.guest.remindTo(guest.name)
                  : copy.guest.sendTo(guest.name)
              }
            >
              <MessageCircle aria-hidden />
              {kind === "reminder" ? copy.list.remind : copy.guest.send}
            </a>
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton
              variant="ghost"
              size="sm"
              label={copy.guest.actions(guest.name)}
              icon={<MoreVertical aria-hidden />}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {view.url && (
              <>
                <DropdownMenuItem asChild>
                  <a
                    href={whatsappToUrl(
                      guest.phone,
                      guestMessage(copy.messages, view, guest, "invite"),
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle aria-hidden className="absolute start-3 size-4.5" />
                    {copy.guest.sendInvite}
                  </a>
                </DropdownMenuItem>
                {waiting && (
                  <DropdownMenuItem asChild>
                    <a
                      href={whatsappToUrl(
                        guest.phone,
                        guestMessage(copy.messages, view, guest, "reminder"),
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        void markReminded(view.id, [guest.id]).then((ok) => ok && router.refresh())
                      }
                    >
                      <BellRing aria-hidden className="absolute start-3 size-4.5" />
                      {copy.guest.sendReminder}
                    </a>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onSelect={async () => {
                    const ok = await copyText(personalUrl(view.url!, guest.token));
                    toast(
                      ok
                        ? { title: copy.guest.linkCopied, tone: "success" }
                        : { title: copy.guest.copyFailed, tone: "error" },
                    );
                  }}
                >
                  <Copy aria-hidden className="absolute start-3 size-4.5" />
                  {copy.guest.copyLink}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onSelect={onEdit}>
              <Pencil aria-hidden className="absolute start-3 size-4.5" />
              {copy.guest.edit}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onRemove} className="text-danger">
              <Trash2 aria-hidden className="absolute start-3 size-4.5" />
              {copy.guest.remove}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  );
}

function RemoveGuest({
  view,
  guest,
  onClose,
}: {
  view: DashboardView;
  guest: HostGuest | null;
  onClose: () => void;
}) {
  const copy = useText(dashboardText).dashboardCopy;
  const router = useRouter();
  const [pending, start] = useTransition();
  const remove = () =>
    start(async () => {
      if (!guest) return;
      const ok = await removeGuests(view.id, [guest.id]).catch(() => false);
      if (!ok) {
        toast({ title: copy.removeGuest.failed, tone: "error" });
        return;
      }
      toast({ title: copy.removeGuest.done, tone: "success" });
      router.refresh();
      onClose();
    });
  return (
    <Dialog open={Boolean(guest)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        title={copy.removeGuest.title}
        closeLabel={copy.form.close}
        footer={
          <>
            <DialogClose asChild>
              <Button variant="secondary" disabled={pending}>
                {copy.removeGuest.cancel}
              </Button>
            </DialogClose>
            <Button variant="danger" loading={pending} onClick={remove}>
              {copy.removeGuest.confirm}
            </Button>
          </>
        }
      >
        <p className="text-ink-muted">{guest ? copy.removeGuest.body(guest.name) : null}</p>
      </DialogContent>
    </Dialog>
  );
}

/** The guest list: search, filters, add, export and each guest's replies and actions. */
export function GuestList({ view }: { view: DashboardView }) {
  const copy = useText(dashboardText).dashboardCopy;
  const { functionCopy } = useText(editorText);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<GuestFilter>("all");
  const [functionId, setFunctionId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<HostGuest | null>(null);
  const [removing, setRemoving] = useState<HostGuest | null>(null);
  const deferredQuery = useDeferredValue(query);

  const sorted = useMemo(() => sortGuests(view.guests), [view.guests]);
  const shown = useMemo(
    () => filterGuests(sorted, { filter, query: deferredQuery, functionId }),
    [sorted, filter, deferredQuery, functionId],
  );
  const total = view.guests.length;

  const reset = () => {
    setQuery("");
    setFilter("all");
    setFunctionId(null);
  };

  return (
    <section
      aria-labelledby="guest-list-heading"
      className="flex min-w-0 flex-col gap-5 rounded-lg border border-line bg-surface p-4 shadow-raised sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="guest-list-heading" className="font-display text-2xl leading-tight">
          {copy.list.heading}
        </h2>
        <div className="flex flex-wrap gap-2">
          {total > 0 && (
            <Button asChild variant="secondary" size="sm">
              <a href={`/invites/${view.id}/guests.csv`} download>
                <Download aria-hidden />
                {copy.list.export}
              </a>
            </Button>
          )}
          <Button size="sm" leadingIcon={<UserPlus aria-hidden />} onClick={() => setAdding(true)}>
            {copy.list.add}
          </Button>
        </div>
      </div>

      {total === 0 ? (
        <EmptyState
          icon={<Users aria-hidden className="size-7" />}
          title={copy.list.empty.title}
          description={copy.list.empty.body}
          action={
            <Button leadingIcon={<UserPlus aria-hidden />} onClick={() => setAdding(true)}>
              {copy.list.add}
            </Button>
          }
        />
      ) : (
        <>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="min-w-0 flex-1">
                <label htmlFor="guest-search" className="sr-only">
                  {copy.list.search}
                </label>
                <Input
                  id="guest-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={copy.list.searchPlaceholder}
                  leading={<Search />}
                  trailing={
                    query ? (
                      <IconButton
                        variant="ghost"
                        size="sm"
                        label={copy.list.clearSearch}
                        icon={<X aria-hidden />}
                        onClick={() => setQuery("")}
                      />
                    ) : undefined
                  }
                  className="[&::-webkit-search-cancel-button]:hidden"
                />
              </div>
              {view.functions.length > 1 && (
                <div className="sm:w-56">
                  <Select
                    aria-label={copy.list.functionLabel}
                    value={functionId ?? "all"}
                    onValueChange={(value) => setFunctionId(value === "all" ? null : value)}
                    options={[
                      { value: "all", label: copy.list.allFunctions },
                      ...view.functions.map((fn) => ({
                        value: fn.id,
                        label: functionCopy[fn.kind].name,
                      })),
                    ]}
                  />
                </div>
              )}
            </div>
            <div role="group" aria-label={copy.list.filterLabel} className="flex flex-wrap gap-2">
              {GUEST_FILTERS.map((item) => {
                const count = view.guests.filter((guest) => matchesFilter(guest, item)).length;
                const active = filter === item;
                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(item)}
                    className={cn(
                      "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
                      active
                        ? "border-marigold bg-marigold/15 text-ink"
                        : "border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink",
                    )}
                  >
                    {copy.list.filters[item]}
                    <span
                      className={cn(
                        "rounded-full px-1.5 text-xs tabular-nums",
                        active ? "bg-marigold/25" : "bg-surface-2",
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <p aria-live="polite" className="text-sm text-ink-muted">
            {copy.list.showing(shown.length, total)}
          </p>

          {shown.length === 0 ? (
            <EmptyState
              icon={<Search aria-hidden className="size-7" />}
              title={copy.list.noMatch.title}
              description={copy.list.noMatch.body}
              action={
                <Button variant="secondary" onClick={reset}>
                  {copy.list.noMatch.action}
                </Button>
              }
            />
          ) : (
            <ul className="flex flex-col divide-y divide-line" data-testid="guest-list">
              {shown.map((guest) => (
                <GuestRow
                  key={guest.id}
                  view={view}
                  guest={guest}
                  onEdit={() => setEditing(guest)}
                  onRemove={() => setRemoving(guest)}
                />
              ))}
            </ul>
          )}
        </>
      )}

      <Dialog open={adding} onOpenChange={setAdding}>
        {adding && (
          <GuestFormDialog
            inviteId={view.id}
            functions={view.functions}
            onDone={() => setAdding(false)}
          />
        )}
      </Dialog>
      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        {editing && (
          <GuestFormDialog
            key={editing.id}
            inviteId={view.id}
            functions={view.functions}
            guest={editing}
            onDone={() => setEditing(null)}
          />
        )}
      </Dialog>
      <RemoveGuest view={view} guest={removing} onClose={() => setRemoving(null)} />
    </section>
  );
}
