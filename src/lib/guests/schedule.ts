import { format, type Locale } from "date-fns";
import { enIN } from "date-fns/locale";
import { formatTime } from "@/lib/time";
import { invitedTo, type HostGuest } from "./list";

/*
 * Scheduled sending (Step 9's last piece). India has no text-message route for us yet (DLT),
 * so a schedule doesn't send by itself: at the chosen time the host's calendar reminds them,
 * and the dashboard has every guest's WhatsApp message ready to send one tap at a time from
 * their own number. Rows live in `scheduled_sends` with channel "whatsapp". Times are India
 * Standard Time, like every time on an invite.
 */

export const SEND_PURPOSES = ["invite", "reminder"] as const;
export type SendPurpose = (typeof SEND_PURPOSES)[number];

export type SendStatus = "scheduled" | "sent" | "cancelled";

export type ScheduledSend = {
  id: string;
  purpose: SendPurpose;
  /** One celebration, or null for the whole invite. */
  functionId: string | null;
  /** ISO time in UTC. */
  sendAt: string;
  status: SendStatus;
};

/** How many sends can wait at once, so a slip of the finger can't fill the list. */
export const SCHEDULE_LIMIT = 20;

const IST_OFFSET_MS = 330 * 60_000;
const pad = (n: number) => String(n).padStart(2, "0");

/** "2026-11-20" and "09:30" in India Standard Time, as a UTC ISO string; null when not a real time. */
export function istToIso(date: string, time: string): string | null {
  const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const t = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);
  if (!d || !t) return null;
  const [y, m, day] = [Number(d[1]), Number(d[2]), Number(d[3])];
  const utc = Date.UTC(y, m - 1, day, Number(t[1]), Number(t[2]));
  const check = new Date(utc);
  // 31 February rolls into March; refuse it rather than move the send
  if (check.getUTCMonth() !== m - 1 || check.getUTCDate() !== day) return null;
  return new Date(utc - IST_OFFSET_MS).toISOString();
}

/** The date ("yyyy-MM-dd") and time ("HH:mm") an instant falls on in India. */
export function istParts(iso: string): { date: string; time: string } {
  const at = new Date(new Date(iso).getTime() + IST_OFFSET_MS);
  return {
    date: `${at.getUTCFullYear()}-${pad(at.getUTCMonth() + 1)}-${pad(at.getUTCDate())}`,
    time: `${pad(at.getUTCHours())}:${pad(at.getUTCMinutes())}`,
  };
}

/** "Fri, 20 Nov · 9:30 AM", the same on the server and in the browser. */
export function formatSendTime(iso: string, locale: Locale = enIN): string {
  const { date, time } = istParts(iso);
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  return `${format(new Date(y, m - 1, d), "EEE, d MMM", { locale })} · ${formatTime(time, locale)}`;
}

/** The form's starting point: tomorrow at 10 AM in India. */
export function defaultSendTime(now: Date): { date: string; time: string } {
  const { date } = istParts(new Date(now.getTime() + 24 * 3_600_000).toISOString());
  return { date, time: "10:00" };
}

export function isDue(send: Pick<ScheduledSend, "sendAt" | "status">, now: Date): boolean {
  return send.status === "scheduled" && new Date(send.sendAt).getTime() <= now.getTime();
}

/** Sends still to do, the ones already due first, then by time. */
export function pendingSends(sends: ScheduledSend[]): ScheduledSend[] {
  return sends
    .filter((send) => send.status === "scheduled")
    .sort((a, b) => a.sendAt.localeCompare(b.sendAt));
}

/**
 * Who a send is for. Invitations go to everyone invited (to that celebration, when one is
 * picked); reminders only to guests who haven't replied yet.
 */
export function sendAudience(
  send: Pick<ScheduledSend, "purpose" | "functionId">,
  guests: HostGuest[],
): HostGuest[] {
  const fn = send.functionId;
  const invited = fn ? guests.filter((guest) => invitedTo(guest, fn)) : guests;
  if (send.purpose === "invite") return invited;
  return invited.filter((guest) =>
    fn ? !guest.replies.some((reply) => reply.functionId === fn) : guest.replies.length === 0,
  );
}
