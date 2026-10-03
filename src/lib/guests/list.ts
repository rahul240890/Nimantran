import { normalizePhone } from "@/lib/auth/phone";
import type { FunctionId } from "@/lib/events/functions";

/*
 * The host's guest list (Step 11): where each guest stands, the counts at the top of the
 * dashboard, search and filters, a CSV for the caterer, and pasting a list in one go.
 * Pure functions, shared by the server and the dashboard.
 */

export type ReplyStatus = "attending" | "maybe" | "declined";

export type GuestReplyRow = {
  functionId: string;
  status: ReplyStatus;
  adults: number;
  children: number;
};

export type HostGuest = {
  id: string;
  name: string;
  phone: string | null;
  group: string;
  partySize: number;
  /** The guest's own key, for their personal link (/i/<slug>?g=<token>). */
  token: string;
  /** Functions this guest is invited to; empty means all. */
  functionIds: string[];
  /** Added by replying from the open link rather than by the hosts. */
  selfAdded: boolean;
  /** First time they opened their personal link. */
  openedAt: string | null;
  /** Latest visit, and how many visits (each counted once per half hour). */
  lastOpenedAt: string | null;
  openCount: number;
  remindedAt: string | null;
  createdAt: string;
  replies: GuestReplyRow[];
  message: string;
  respondedAt: string | null;
  answers: Record<string, string>;
};

export type HostFunction = { id: string; kind: FunctionId };

/**
 * One word for where a guest stands. Coming wins when they said yes to anything; declined
 * only when they turned down everything they answered.
 */
export type GuestState = "coming" | "maybe" | "declined" | "waiting";

export function guestState(guest: Pick<HostGuest, "replies">): GuestState {
  if (guest.replies.length === 0) return "waiting";
  if (guest.replies.some((reply) => reply.status === "attending")) return "coming";
  if (guest.replies.some((reply) => reply.status === "maybe")) return "maybe";
  return "declined";
}

/** People a reply brings; a decline brings nobody. */
export function peopleIn(reply: GuestReplyRow): number {
  return reply.status === "declined" ? 0 : reply.adults + reply.children;
}

export const GUEST_FILTERS = [
  "all",
  "coming",
  "maybe",
  "declined",
  "waiting",
  "seen",
  "not-opened",
] as const;
export type GuestFilter = (typeof GUEST_FILTERS)[number];

/** Whether the guest has seen the invitation: opened their link, or replied from any link. */
export function hasOpened(guest: Pick<HostGuest, "openedAt" | "replies">): boolean {
  return Boolean(guest.openedAt) || guest.replies.length > 0;
}

export function matchesFilter(guest: HostGuest, filter: GuestFilter): boolean {
  if (filter === "all") return true;
  if (filter === "not-opened") return !hasOpened(guest);
  // Opened their personal link but not replied: the people a nudge helps most
  if (filter === "seen") return Boolean(guest.openedAt) && guest.replies.length === 0;
  return guestState(guest) === filter;
}

/** Who opened their personal link most recently, newest first. */
export function recentOpens(guests: HostGuest[], limit = 6): HostGuest[] {
  return guests
    .filter((guest) => guest.lastOpenedAt && !guest.selfAdded)
    .sort((a, b) => b.lastOpenedAt!.localeCompare(a.lastOpenedAt!))
    .slice(0, limit);
}

/** Search by name, group or phone digits, ignoring case, accents and spacing. */
export function matchesQuery(guest: HostGuest, query: string): boolean {
  const fold = (value: string) =>
    value
      .normalize("NFKD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();
  const words = fold(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = fold(`${guest.name} ${guest.group}`);
  const digits = (guest.phone ?? "").replace(/\D/g, "");
  return words.every((word) => {
    if (haystack.includes(word)) return true;
    const wordDigits = word.replace(/\D/g, "");
    return wordDigits.length >= 3 && wordDigits.length === word.replace(/[\s+()-]/g, "").length
      ? digits.includes(wordDigits)
      : false;
  });
}

/** Whether the guest is invited to a function; an empty list means everything. */
export function invitedTo(guest: Pick<HostGuest, "functionIds">, functionId: string): boolean {
  return guest.functionIds.length === 0 || guest.functionIds.includes(functionId);
}

export function filterGuests(
  guests: HostGuest[],
  { filter, query, functionId }: { filter: GuestFilter; query: string; functionId: string | null },
): HostGuest[] {
  return guests.filter(
    (guest) =>
      matchesFilter(guest, filter) &&
      matchesQuery(guest, query) &&
      (!functionId || invitedTo(guest, functionId)),
  );
}

/** Newest replies first, then those still waiting, alphabetically. */
export function sortGuests(guests: HostGuest[]): HostGuest[] {
  return [...guests].sort((a, b) => {
    if (a.respondedAt && b.respondedAt) return b.respondedAt.localeCompare(a.respondedAt);
    if (a.respondedAt) return -1;
    if (b.respondedAt) return 1;
    return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
  });
}

export type DashboardCounts = {
  guests: number;
  /** People the invitations are for, by the hosts' party sizes. */
  invitedPeople: number;
  opened: number;
  replied: number;
  waiting: number;
  byState: Record<GuestState, number>;
  functions: {
    id: string;
    kind: FunctionId;
    /** People coming, adults and children together. */
    coming: number;
    children: number;
    maybe: number;
    /** Guests who can't come. */
    declined: number;
    /** Invited guests yet to reply for this function. */
    waiting: number;
  }[];
};

export function dashboardCounts(guests: HostGuest[], functions: HostFunction[]): DashboardCounts {
  const byState: Record<GuestState, number> = { coming: 0, maybe: 0, declined: 0, waiting: 0 };
  let opened = 0;
  let invitedPeople = 0;
  for (const guest of guests) {
    byState[guestState(guest)] += 1;
    if (hasOpened(guest)) opened += 1;
    invitedPeople += guest.partySize;
  }
  return {
    guests: guests.length,
    invitedPeople,
    opened,
    replied: guests.length - byState.waiting,
    waiting: byState.waiting,
    byState,
    functions: functions.map((fn) => {
      const total = { id: fn.id, kind: fn.kind, coming: 0, children: 0, maybe: 0, declined: 0 };
      let waiting = 0;
      for (const guest of guests) {
        const reply = guest.replies.find((item) => item.functionId === fn.id);
        if (!reply) {
          if (invitedTo(guest, fn.id)) waiting += 1;
          continue;
        }
        if (reply.status === "attending") {
          total.coming += peopleIn(reply);
          total.children += reply.children;
        } else if (reply.status === "maybe") total.maybe += peopleIn(reply);
        else total.declined += 1;
      }
      return { ...total, waiting };
    }),
  };
}

/* ---------- CSV ---------- */

/** A cell safe for spreadsheets: quoted, and never read as a formula. */
export function csvCell(value: string | number): string {
  let text = String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export type CsvLabels = {
  name: string;
  phone: string;
  group: string;
  partySize: string;
  opened: string;
  link: string;
  message: string;
  yes: string;
  no: string;
  status: Record<ReplyStatus | "waiting" | "not-invited", string>;
  functionName: (kind: FunctionId) => string;
  people: (kind: FunctionId) => string;
  answers: { id: string; label: string }[];
};

export function guestsCsv(
  guests: HostGuest[],
  functions: HostFunction[],
  { labels, linkFor }: { labels: CsvLabels; linkFor: (guest: HostGuest) => string },
): string {
  const header = [
    labels.name,
    labels.phone,
    labels.group,
    labels.partySize,
    ...functions.flatMap((fn) => [labels.functionName(fn.kind), labels.people(fn.kind)]),
    ...labels.answers.map((answer) => answer.label),
    labels.message,
    labels.opened,
    labels.link,
  ];
  const rows = guests.map((guest) => [
    guest.name,
    guest.phone ?? "",
    guest.group,
    guest.partySize,
    ...functions.flatMap((fn) => {
      const reply = guest.replies.find((item) => item.functionId === fn.id);
      if (!reply) return [labels.status[invitedTo(guest, fn.id) ? "waiting" : "not-invited"], ""];
      return [labels.status[reply.status], reply.status === "declined" ? 0 : peopleIn(reply)];
    }),
    ...labels.answers.map((answer) => guest.answers[answer.id] ?? ""),
    guest.message,
    hasOpened(guest) ? labels.yes : labels.no,
    linkFor(guest),
  ]);
  // A byte order mark so Excel opens Hindi and other scripts correctly
  return "﻿" + [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
}

/* ---------- Pasting a list ---------- */

export const GUEST_RULES = { name: 80, group: 40, partySize: 20, paste: 300 } as const;

/** Most guests one save sends; bigger imports go in batches of this size. */
export const GUEST_BATCH = GUEST_RULES.paste;

export type PastedGuest = {
  line: number;
  name: string;
  phone: string | null;
  partySize: number;
  error: "name" | "phone" | null;
};

/**
 * One guest per line, the way families keep lists in their notes app:
 * "Sharma uncle, 98765 43210", "Meera Iyer +91 98765 00000 (4)", or just a name.
 * A number in brackets or after "x" is how many people the invitation is for.
 */
export function parseGuestList(text: string): PastedGuest[] {
  return text
    .split(/\r?\n/)
    .map((raw, index) => ({ raw: raw.trim(), line: index + 1 }))
    .filter(({ raw }) => raw.length > 0)
    .slice(0, GUEST_RULES.paste)
    .map(({ raw, line }): PastedGuest => {
      let rest = raw.replace(/^(?:[-*•]|\d+[.)])\s+/, "");
      let partySize = 1;
      const size = /\s*(?:\((\d{1,2})\)|[x×]\s?(\d{1,2}))\s*$/i.exec(rest);
      if (size) {
        partySize = Math.min(GUEST_RULES.partySize, Math.max(1, Number(size[1] ?? size[2])));
        rest = rest.slice(0, size.index);
      }
      const phoneMatch = /(\+?[\d][\d\s().-]{7,}\d)\s*$/.exec(rest);
      let phone: string | null = null;
      let error: PastedGuest["error"] = null;
      if (phoneMatch) {
        const parsed = normalizePhone(phoneMatch[1]!);
        if ("phone" in parsed) phone = parsed.phone;
        else error = "phone";
        rest = rest.slice(0, phoneMatch.index);
      }
      const name = rest
        .replace(/[,;:|\t-]+\s*$/, "")
        .trim()
        .slice(0, GUEST_RULES.name);
      if (!name) error = "name";
      return { line, name, phone, partySize, error };
    });
}
