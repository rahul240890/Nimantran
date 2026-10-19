"use client";

import { Check, Copy, MessageCircle, Send, SkipForward } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { markSent } from "@/actions/guests";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { formatPhone } from "@/lib/auth/phone";
import { cn } from "@/lib/cn";
import {
  SEND_AUDIENCES,
  SEND_BATCHES,
  guestGroups,
  sendQueue,
  type HostGuest,
  type SendAudience,
} from "@/lib/guests/list";
import { personalUrl, whatsappToUrl } from "@/lib/publish/links";
import { guestMessage } from "./guest-list";
import type { DashboardView } from "./types";
import { useText } from "@/i18n/client";
import { dashboardText } from "@/i18n/copy/dashboard";

/*
 * Sending invitations to many guests from the host's own WhatsApp, one tap each: choose who
 * (not sent yet, not replied, everyone, or one group) and how many at a time, then tap Send
 * for the next guest, send in WhatsApp, come back and the next one is ready. Each message
 * carries the guest's personal link, so their name greets them on the invitation's first
 * page. Bulk sending without a tap each needs WhatsApp Business (Step 22).
 */
export function SendMany({ view, onDone }: { view: DashboardView; onDone: () => void }) {
  const { dashboardCopy } = useText(dashboardText);
  const copy = dashboardCopy.sendMany;
  const router = useRouter();
  const groups = useMemo(() => guestGroups(view.guests), [view.guests]);
  const [audience, setAudience] = useState<SendAudience>(() =>
    sendQueue(view.guests, { audience: "not-sent", batch: 0 }).length ? "not-sent" : "waiting",
  );
  const [group, setGroup] = useState<string | null>(null);
  const [batch, setBatch] = useState<number>(SEND_BATCHES[0]);
  const [template, setTemplate] = useState(() =>
    dashboardCopy.messages.invite("{name}", view.names, view.occasion, view.when),
  );
  // The guests being sent to, fixed once sending starts so the list doesn't shift under a tap
  const [queue, setQueue] = useState<HostGuest[] | null>(null);
  const [sent, setSent] = useState<Set<string>>(new Set());
  const [skipped, setSkipped] = useState<Set<string>>(new Set());

  const counts = useMemo(
    () =>
      Object.fromEntries(
        SEND_AUDIENCES.map((item) => [
          item,
          sendQueue(view.guests, { audience: item, group, batch: 0 }).length,
        ]),
      ) as Record<SendAudience, number>,
    [view.guests, group],
  );
  const planned = sendQueue(view.guests, { audience, group, batch });

  const messageFor = (guest: HostGuest) =>
    guestMessage(dashboardCopy.messages, view, guest, "invite", template);

  const record = (guest: HostGuest) => {
    setSent((current) => new Set(current).add(guest.id));
    void markSent(view.id, [guest.id]);
  };

  const copyMessage = async (guest: HostGuest) => {
    try {
      await navigator.clipboard.writeText(messageFor(guest));
      toast({ title: copy.copied, tone: "success" });
      record(guest);
    } catch {
      toast({ title: dashboardCopy.guest.copyFailed, tone: "error" });
    }
  };

  const copyAll = async () => {
    if (!queue || !view.url) return;
    const lines = queue.map((guest) => `${guest.name}: ${personalUrl(view.url!, guest.token)}`);
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      toast({ title: copy.allCopied, tone: "success" });
    } catch {
      toast({ title: dashboardCopy.guest.copyFailed, tone: "error" });
    }
  };

  const finish = () => {
    if (sent.size) router.refresh();
    onDone();
  };

  if (!queue) {
    return (
      <DialogContent
        title={copy.title}
        description={copy.description}
        closeLabel={dashboardCopy.form.close}
        className="sm:max-w-xl"
        footer={
          <>
            <DialogClose asChild>
              <Button variant="secondary">{dashboardCopy.form.cancel}</Button>
            </DialogClose>
            <Button
              leadingIcon={<Send aria-hidden className="rtl:-scale-x-100" />}
              disabled={planned.length === 0}
              onClick={() => {
                setQueue(planned);
                setSent(new Set());
                setSkipped(new Set());
              }}
            >
              {copy.start(planned.length)}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="font-semibold">{copy.who}</p>
            <RadioGroup
              label={copy.who}
              value={audience}
              onValueChange={(value) => setAudience(value as SendAudience)}
            >
              {SEND_AUDIENCES.map((item) => (
                <RadioItem
                  key={item}
                  value={item}
                  label={copy.audiences[item](counts[item])}
                  description={copy.audienceHints[item]}
                />
              ))}
            </RadioGroup>
          </div>
          {groups.length > 0 && (
            <Field label={copy.group}>
              <Select
                value={group ?? "all"}
                onValueChange={(value) => setGroup(value === "all" ? null : value)}
                options={[
                  { value: "all", label: copy.allGroups },
                  ...groups.map((name) => ({ value: name, label: name })),
                ]}
              />
            </Field>
          )}
          <div className="flex flex-col gap-2">
            <p className="font-semibold">{copy.batch}</p>
            <RadioGroup
              label={copy.batch}
              variant="segment"
              value={String(batch)}
              onValueChange={(value) => setBatch(Number(value))}
            >
              {SEND_BATCHES.map((size) => (
                <RadioItem key={size} value={String(size)} label={copy.batchSize(size)} />
              ))}
            </RadioGroup>
          </div>
          <Field label={copy.message} hint={copy.messageHint}>
            <Textarea
              value={template}
              onChange={(event) => setTemplate(event.target.value)}
              rows={4}
              maxLength={600}
            />
          </Field>
          {planned.length === 0 && (
            <p role="status" className="text-sm font-medium text-ink-muted">
              {copy.nobody}
            </p>
          )}
        </div>
      </DialogContent>
    );
  }

  const next = queue.find((guest) => !sent.has(guest.id) && !skipped.has(guest.id));
  const remaining = sendQueue(view.guests, { audience, group, batch: 0 }).filter(
    (guest) => !queue.some((item) => item.id === guest.id),
  ).length;

  return (
    <DialogContent
      title={copy.title}
      closeLabel={dashboardCopy.form.close}
      className="sm:max-w-xl"
      onInteractOutside={(event) => event.preventDefault()}
      footer={
        <>
          <Button variant="secondary" onClick={() => setQueue(null)}>
            {copy.back}
          </Button>
          <Button onClick={finish}>{copy.done}</Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p aria-live="polite" className="text-sm font-semibold tabular-nums">
            {copy.progress(sent.size, queue.length)}
          </p>
          <div className="h-2 overflow-hidden rounded-full bg-surface-2" aria-hidden>
            <div
              className="h-full rounded-full bg-marigold transition-[width] duration-300 motion-reduce:transition-none"
              style={{ width: `${(sent.size / Math.max(1, queue.length)) * 100}%` }}
            />
          </div>
        </div>

        {next ? (
          <div className="flex flex-col gap-3 rounded-lg border border-marigold/45 bg-marigold/10 p-4">
            <p className="font-label text-xs tracking-[0.2em] text-accent-text uppercase">
              {copy.next}
            </p>
            <div className="flex min-w-0 flex-col">
              <span className="font-display text-2xl leading-tight break-words">{next.name}</span>
              <span className="text-sm text-ink-muted tabular-nums">
                {[next.phone ? formatPhone(next.phone) : copy.noPhone, next.group]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild size="lg" className="sm:flex-1">
                <a
                  href={whatsappToUrl(next.phone, messageFor(next))}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => record(next)}
                >
                  <MessageCircle aria-hidden />
                  {copy.sendTo(next.name)}
                </a>
              </Button>
              <Button
                variant="ghost"
                leadingIcon={<SkipForward aria-hidden className="rtl:-scale-x-100" />}
                onClick={() => setSkipped((current) => new Set(current).add(next.id))}
              >
                {copy.skip}
              </Button>
            </div>
          </div>
        ) : (
          <div
            role="status"
            className="flex flex-col gap-3 rounded-lg border border-success/35 bg-success/10 p-4"
          >
            <p className="flex items-center gap-2 font-semibold">
              <Check aria-hidden className="size-5 text-success" />
              {copy.finished(sent.size)}
            </p>
            {remaining > 0 && (
              <Button
                variant="secondary"
                className="self-start"
                onClick={() => {
                  router.refresh();
                  setQueue(null);
                }}
              >
                {copy.more(remaining)}
              </Button>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold">{copy.list(queue.length)}</h3>
            <Button
              variant="ghost"
              size="sm"
              leadingIcon={<Copy aria-hidden />}
              onClick={() => void copyAll()}
            >
              {copy.copyAll}
            </Button>
          </div>
          <ul className="flex max-h-[min(20rem,40vh)] flex-col divide-y divide-line overflow-y-auto overscroll-contain rounded-md border border-line px-3">
            {queue.map((guest) => {
              const done = sent.has(guest.id);
              return (
                <li
                  key={guest.id}
                  className={cn("flex items-center gap-3 py-2", guest === next && "font-semibold")}
                >
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="break-words">{guest.name}</span>
                    <span className="text-xs font-normal text-ink-muted tabular-nums">
                      {guest.phone ? formatPhone(guest.phone) : copy.noPhone}
                    </span>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    variant={done ? "ghost" : "secondary"}
                    className="shrink-0"
                  >
                    <a
                      href={whatsappToUrl(guest.phone, messageFor(guest))}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => record(guest)}
                      aria-label={dashboardCopy.guest.sendTo(guest.name)}
                    >
                      {done ? <Check aria-hidden /> : <MessageCircle aria-hidden />}
                      {done ? copy.sent : copy.send}
                    </a>
                  </Button>
                  {!guest.phone && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="shrink-0 max-sm:hidden"
                      leadingIcon={<Copy aria-hidden />}
                      onClick={() => void copyMessage(guest)}
                    >
                      {copy.copy}
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="text-xs text-ink-muted">{copy.copyAllHint}</p>
        </div>
      </div>
    </DialogContent>
  );
}
