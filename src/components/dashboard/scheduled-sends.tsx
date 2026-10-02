"use client";

import { format, formatDistance, parseISO } from "date-fns";
import {
  CalendarClock,
  CalendarPlus,
  Check,
  Copy,
  Download,
  MessageCircle,
  MoreVertical,
  Plus,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { closeSend, markReminded, scheduleSend } from "@/actions/guests";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field } from "@/components/ui/field";
import { IconButton } from "@/components/ui/icon-button";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TimePicker } from "@/components/ui/time-picker";
import { toast } from "@/components/ui/toast";
import { formatPhone } from "@/lib/auth/phone";
import type { HostGuest } from "@/lib/guests/list";
import {
  SCHEDULE_LIMIT,
  SEND_PURPOSES,
  defaultSendTime,
  formatSendTime,
  isDue,
  istParts,
  pendingSends,
  sendAudience,
  type ScheduledSend,
  type SendPurpose,
} from "@/lib/guests/schedule";
import { googleCalendarUrl, icsCalendar, type CalendarEntry } from "@/lib/publish/calendar";
import { whatsappToUrl } from "@/lib/publish/links";
import { guestMessage } from "./guest-list";
import type { DashboardView } from "./types";
import { useLocale, useText } from "@/i18n/client";
import { dateLocale } from "@/i18n/dates";
import { dashboardText } from "@/i18n/copy/dashboard";
import { editorText } from "@/i18n/copy/editor";

type Copy = (typeof dashboardText)["en"]["dashboardCopy"];

/** Where the host's calendar reminder points: the dashboard, with this send's list open. */
const sendLink = (view: DashboardView, sendId: string) =>
  `${view.origin}/invites/${view.id}?send=${sendId}`;

/** A 15-minute calendar entry that rings at the send time. */
function calendarEntry(copy: Copy, view: DashboardView, send: ScheduledSend): CalendarEntry {
  const { date, time } = istParts(send.sendAt);
  const { time: endTime } = istParts(new Date(Date.parse(send.sendAt) + 15 * 60_000).toISOString());
  return {
    uid: `send-${send.id}@shubh`,
    title: copy.schedule.calendarTitle(send.purpose, view.names),
    date,
    time,
    endTime,
    location: "",
    description: copy.schedule.calendarBody,
    url: sendLink(view, send.id),
    alarm: true,
  };
}

function downloadIcs(entry: CalendarEntry) {
  const blob = new Blob([icsCalendar([entry])], { type: "text/calendar;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = "shubh-send-reminder.ics";
  link.click();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}

/** Planning a send: what, for which celebration, and when. Then the calendar buttons. */
function PlanDialog({
  view,
  now,
  open,
  onOpenChange,
}: {
  view: DashboardView;
  now: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const locale = useLocale();
  const { dashboardCopy } = useText(dashboardText);
  const { functionCopy } = useText(editorText);
  const copy = dashboardCopy.schedule;
  const router = useRouter();
  const start = useMemo(() => defaultSendTime(now), [now]);
  const [purpose, setPurpose] = useState<SendPurpose>("invite");
  const [functionId, setFunctionId] = useState("all");
  const [date, setDate] = useState(start.date);
  const [time, setTime] = useState(start.time);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<ScheduledSend | null>(null);
  const [pending, startTransition] = useTransition();
  const { today, end } = useMemo(() => {
    const day = parseISO(istParts(now.toISOString()).date);
    return { today: day, end: new Date(day.getFullYear() + 2, 11, 31) };
  }, [now]);

  const reset = () => {
    setPurpose("invite");
    setFunctionId("all");
    setDate(start.date);
    setTime(start.time);
    setError(null);
    setSaved(null);
  };

  const submit = () => {
    if (!date || !time) {
      setError(copy.missing);
      return;
    }
    startTransition(async () => {
      const fn = functionId === "all" ? null : functionId;
      const result = await scheduleSend(view.id, { purpose, functionId: fn, date, time });
      if (!result.ok) {
        setError(result.reason === "past" ? copy.past : copy.failed);
        return;
      }
      setSaved({
        id: result.id,
        purpose,
        functionId: fn,
        sendAt: new Date(`${date}T${time}:00+05:30`).toISOString(),
        status: "scheduled",
      });
      router.refresh();
    });
  };

  const entry = saved ? calendarEntry(dashboardCopy, view, saved) : null;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent
        title={saved ? copy.savedTitle : copy.planTitle}
        description={
          saved
            ? copy.savedBody(formatSendTime(saved.sendAt, dateLocale[locale]))
            : copy.planDescription
        }
        closeLabel={dashboardCopy.reminders.close}
        className="sm:max-w-lg"
        footer={
          saved ? (
            <Button onClick={() => onOpenChange(false)}>{copy.done}</Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                {copy.cancel}
              </Button>
              <Button onClick={submit} loading={pending}>
                {copy.save}
              </Button>
            </>
          )
        }
      >
        {saved && entry ? (
          <div className="flex flex-col gap-3">
            <Button asChild variant="secondary">
              <a href={googleCalendarUrl(entry)} target="_blank" rel="noopener noreferrer">
                <CalendarPlus aria-hidden />
                {copy.google}
              </a>
            </Button>
            <Button
              variant="secondary"
              leadingIcon={<Download aria-hidden />}
              onClick={() => downloadIcs(entry)}
            >
              {copy.apple}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <RadioGroup
              label={copy.what}
              value={purpose}
              onValueChange={(value) => setPurpose(value as SendPurpose)}
            >
              {SEND_PURPOSES.map((id) => (
                <RadioItem
                  key={id}
                  value={id}
                  label={copy.purposes[id]}
                  description={copy.purposeHints[id]}
                />
              ))}
            </RadioGroup>
            {view.functions.length > 1 && (
              <Field label={copy.forLabel}>
                <Select
                  value={functionId}
                  onValueChange={setFunctionId}
                  options={[
                    { value: "all", label: copy.everything },
                    ...view.functions.map((fn) => ({
                      value: fn.id,
                      label: functionCopy[fn.kind].name,
                    })),
                  ]}
                />
              </Field>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={copy.date} required>
                <DatePicker
                  value={date ? parseISO(date) : undefined}
                  onValueChange={(day) => {
                    setDate(day ? format(day, "yyyy-MM-dd") : "");
                    setError(null);
                  }}
                  placeholder={copy.datePlaceholder}
                  disabledDays={{ before: today }}
                  startMonth={today}
                  endMonth={end}
                />
              </Field>
              <Field label={copy.time} required hint={copy.timeHint}>
                <TimePicker
                  value={time || undefined}
                  onValueChange={(value) => {
                    setTime(value);
                    setError(null);
                  }}
                  placeholder={copy.time}
                />
              </Field>
            </div>
            {error && (
              <p role="alert" className="text-sm font-semibold text-danger">
                {error}
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/** Going through one send's list: a WhatsApp button per guest, then "Mark as sent". */
function SendDialog({
  view,
  send,
  label,
  onClose,
}: {
  view: DashboardView;
  send: ScheduledSend;
  label: string;
  onClose: () => void;
}) {
  const { dashboardCopy } = useText(dashboardText);
  const copy = dashboardCopy.schedule;
  const router = useRouter();
  const guests = sendAudience(send, view.guests);
  const kind = send.purpose;
  const [template, setTemplate] = useState(() =>
    dashboardCopy.messages[kind]("{name}", view.names, view.occasion, view.when),
  );
  const [sent, setSent] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();

  const record = (guest: HostGuest) => setSent((current) => [...current, guest.id]);

  const copyFor = async (guest: HostGuest) => {
    try {
      await navigator.clipboard.writeText(
        guestMessage(dashboardCopy.messages, view, guest, kind, template),
      );
      toast({ title: dashboardCopy.hosts.copied, tone: "success" });
      record(guest);
    } catch {
      toast({ title: dashboardCopy.guest.copyFailed, tone: "error" });
    }
  };

  const finish = () => {
    startTransition(async () => {
      if (kind === "reminder" && sent.length) await markReminded(view.id, sent);
      const ok = await closeSend(view.id, send.id, "sent");
      toast(ok ? { title: copy.marked, tone: "success" } : { title: copy.failed, tone: "error" });
      if (ok) {
        onClose();
        router.refresh();
      }
    });
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        title={copy.sendTitle(label)}
        description={copy.sendDescription}
        closeLabel={dashboardCopy.reminders.close}
        className="sm:max-w-xl"
        footer={
          <>
            <Button variant="ghost" onClick={onClose}>
              {copy.notYet}
            </Button>
            <Button onClick={finish} loading={pending} leadingIcon={<Check aria-hidden />}>
              {copy.markSent}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          <Field label={dashboardCopy.reminders.message} hint={dashboardCopy.reminders.messageHint}>
            <Textarea
              value={template}
              onChange={(event) => setTemplate(event.target.value)}
              rows={4}
              maxLength={600}
            />
          </Field>
          {guests.length === 0 ? (
            <p className="text-sm text-ink-muted">{copy.nobody}</p>
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {guests.map((guest) => {
                const done = sent.includes(guest.id);
                const name = guest.name;
                return (
                  <li key={guest.id} className="flex items-center gap-3 py-3">
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="font-semibold break-words">{name}</span>
                      <span className="text-sm text-ink-muted">
                        {guest.phone ? formatPhone(guest.phone) : dashboardCopy.reminders.noPhone}
                      </span>
                    </div>
                    {guest.phone ? (
                      <Button
                        asChild
                        size="sm"
                        variant={done ? "ghost" : "primary"}
                        className="shrink-0"
                      >
                        <a
                          href={whatsappToUrl(
                            guest.phone,
                            guestMessage(dashboardCopy.messages, view, guest, kind, template),
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => record(guest)}
                          aria-label={
                            kind === "reminder"
                              ? dashboardCopy.guest.remindTo(name)
                              : dashboardCopy.guest.sendTo(name)
                          }
                        >
                          {done ? <Check aria-hidden /> : <MessageCircle aria-hidden />}
                          {done ? dashboardCopy.reminders.sent : dashboardCopy.reminders.send}
                        </a>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="shrink-0"
                        leadingIcon={done ? <Check aria-hidden /> : <Copy aria-hidden />}
                        onClick={() => void copyFor(guest)}
                        aria-label={`${dashboardCopy.reminders.copy}: ${name}`}
                      >
                        {done ? dashboardCopy.reminders.sent : dashboardCopy.reminders.copy}
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Scheduled sending: the host picks when invitations or a reminder go out. With no text
 * message route in India yet, the send happens from the host's own WhatsApp: their calendar
 * rings at the time and the list here has every guest's message ready.
 */
export function ScheduledSends({
  view,
  openSend,
}: {
  view: DashboardView;
  /** A send to open straight away, from the calendar reminder's link. */
  openSend?: string;
}) {
  const locale = useLocale();
  const { dashboardCopy } = useText(dashboardText);
  const { functionCopy } = useText(editorText);
  const copy = dashboardCopy.schedule;
  const router = useRouter();
  // The server's clock first, so the first paint matches; then the browser's, every half minute
  const [now, setNow] = useState(() => new Date(view.now));
  const [planning, setPlanning] = useState(false);
  const [sending, setSending] = useState<string | null>(openSend ?? null);
  const pending = pendingSends(view.schedules);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const labelFor = (send: ScheduledSend) => {
    const fn = view.functions.find((item) => item.id === send.functionId);
    return copy.label(send.purpose, fn ? functionCopy[fn.kind].name : null);
  };

  const cancel = async (send: ScheduledSend) => {
    const ok = await closeSend(view.id, send.id, "cancelled");
    toast(ok ? { title: copy.cancelled, tone: "success" } : { title: copy.failed, tone: "error" });
    if (ok) router.refresh();
  };

  const closeList = () => {
    setSending(null);
    if (openSend) window.history.replaceState(null, "", `/invites/${view.id}`);
  };

  const active = view.url ? pending.find((send) => send.id === sending) : undefined;

  return (
    <Card role="region" aria-labelledby="schedule-heading" className="gap-4 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-marigold/15 text-accent-text">
          <CalendarClock aria-hidden className="size-5" />
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <h2 id="schedule-heading" className="font-semibold">
            {copy.heading}
          </h2>
          <p className="text-sm text-ink-muted">
            {view.url ? copy.body(pending.length) : copy.notLive}
          </p>
        </div>
      </div>

      {view.url && pending.length > 0 && (
        <ul className="flex flex-col divide-y divide-line" aria-label={copy.heading}>
          {pending.map((send) => {
            const due = isDue(send, now);
            const label = labelFor(send);
            const entry = calendarEntry(dashboardCopy, view, send);
            return (
              <li
                key={send.id}
                className="flex flex-wrap items-start justify-end gap-x-2 gap-y-1 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex min-w-48 flex-1 flex-col gap-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold break-words">{label}</span>
                    {due && (
                      <Badge tone="gold" dot>
                        {copy.due}
                      </Badge>
                    )}
                  </span>
                  <span className="text-sm text-ink-muted">
                    {formatSendTime(send.sendAt, dateLocale[locale])}
                    {!due &&
                      ` (${formatDistance(send.sendAt, now, {
                        addSuffix: true,
                        locale: dateLocale[locale],
                      })})`}
                  </span>
                  <span className="text-sm text-ink-muted">
                    {copy.audience(sendAudience(send, view.guests).length)}
                  </span>
                </div>
                <div className="flex shrink-0 items-start gap-1">
                  <Button
                    size="sm"
                    variant={due ? "primary" : "ghost"}
                    onClick={() => setSending(send.id)}
                    aria-label={`${copy.sendNow}: ${label}`}
                  >
                    {copy.sendNow}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <IconButton
                        variant="ghost"
                        size="sm"
                        label={copy.actions(label)}
                        icon={<MoreVertical aria-hidden />}
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <a
                          href={googleCalendarUrl(entry)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <CalendarPlus aria-hidden className="absolute start-3 size-4.5" />
                          {copy.google}
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => downloadIcs(entry)}>
                        <Download aria-hidden className="absolute start-3 size-4.5" />
                        {copy.apple}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={() => void cancel(send)}>
                        <X aria-hidden className="absolute start-3 size-4.5" />
                        {copy.cancelSend}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {view.url &&
        (pending.length < SCHEDULE_LIMIT ? (
          <Button
            variant="secondary"
            leadingIcon={<Plus aria-hidden />}
            onClick={() => setPlanning(true)}
          >
            {copy.add}
          </Button>
        ) : (
          <p className="text-sm text-ink-muted">{copy.limit}</p>
        ))}

      {view.url && <PlanDialog view={view} now={now} open={planning} onOpenChange={setPlanning} />}
      {active && (
        <SendDialog
          key={active.id}
          view={view}
          send={active}
          label={labelFor(active)}
          onClose={closeList}
        />
      )}
    </Card>
  );
}
