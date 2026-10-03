import "server-only";
import { randomBytes, randomUUID } from "node:crypto";
import type { Account } from "@/lib/auth/account";
import { authMode } from "@/lib/auth/mode";
import { isFunctionId, type FunctionId } from "@/lib/events/functions";
import { supabasePublic } from "@/lib/supabase/public";
import { supabaseServer } from "@/lib/supabase/server";
import { previewDb, previewHosts, type PreviewReply } from "./preview-db";
import { findPublishedInvite } from "./public";

/*
 * Guests' replies (Step 10). Guests reach them only through their link: the database's
 * submit_rsvp() and guest_reply() check the invite is published and that every function
 * is its own. Hosts read the replies through row level security.
 */

export const REPLY_STATUSES = ["attending", "maybe", "declined"] as const;
export type ReplyStatus = (typeof REPLY_STATUSES)[number];

export type FunctionReply = {
  functionId: string;
  status: ReplyStatus;
  adults: number;
  children: number;
};

export type ReplyInput = {
  name: string;
  replies: FunctionReply[];
  message: string;
  /** Answers to the host's questions, by question id ("meal": "veg"). */
  answers: Record<string, string>;
};

export type GuestReply = ReplyInput & {
  /** Functions this guest is invited to; empty means all. */
  functionIds: string[];
};

export type SubmitResult =
  { ok: true; token: string } | { ok: false; reason: "missing" | "not-invited" | "failed" };

type RpcReply = {
  name: string;
  function_ids: string[];
  replies: {
    function_id: string;
    status: ReplyStatus;
    adults: number;
    children: number;
    message: string;
    answers: Record<string, string>;
  }[];
};

function fromRows(name: string, functionIds: string[], rows: RpcReply["replies"]): GuestReply {
  return {
    name,
    functionIds,
    replies: rows.map((row) => ({
      functionId: row.function_id,
      status: row.status,
      adults: row.adults,
      children: row.children,
    })),
    message: rows[0]?.message ?? "",
    answers: rows[0]?.answers ?? {},
  };
}

/** A guest's reply so far, by their link's token. Also marks the invitation opened. */
export async function findReply(slug: string, token: string): Promise<GuestReply | null> {
  const mode = authMode();
  if (mode === "supabase") {
    const supabase = supabasePublic();
    if (!supabase) return null;
    const { data, error } = await supabase.rpc("guest_reply", { p_slug: slug, p_token: token });
    if (error || !data) return null;
    const row = data as RpcReply;
    return fromRows(row.name, row.function_ids ?? [], row.replies ?? []);
  }
  if (mode === "preview") {
    const invite = await findPublishedInvite(slug);
    const guest = previewDb.guests.get(token);
    if (!invite || !guest || guest.eventId !== invite.id) return null;
    const now = new Date();
    guest.openedAt ??= now.toISOString();
    // One visit per half hour, as guest_reply() counts them
    const last = guest.lastOpenedAt ? Date.parse(guest.lastOpenedAt) : 0;
    if (now.getTime() - last > 30 * 60 * 1000) guest.openCount = (guest.openCount ?? 0) + 1;
    guest.lastOpenedAt = now.toISOString();
    return fromRows(
      guest.name,
      guest.functionIds,
      guest.replies.map((reply) => ({ ...reply, function_id: reply.functionId })),
    );
  }
  return null;
}

export async function submitReply(
  slug: string,
  token: string | null,
  input: ReplyInput,
): Promise<SubmitResult> {
  const mode = authMode();
  if (mode === "supabase") {
    const supabase = supabasePublic();
    if (!supabase) return { ok: false, reason: "failed" };
    const { data, error } = await supabase.rpc("submit_rsvp", {
      p_slug: slug,
      p_token: token,
      p_name: input.name,
      p_replies: input.replies.map((reply) => ({
        function_id: reply.functionId,
        status: reply.status,
        adults: reply.adults,
        children: reply.children,
      })),
      p_message: input.message,
      p_answers: input.answers,
    });
    if (error?.code === "P0002") return { ok: false, reason: "missing" };
    if (error?.code === "42501") return { ok: false, reason: "not-invited" };
    if (error || typeof data !== "string") return { ok: false, reason: "failed" };
    return { ok: true, token: data };
  }
  if (mode === "preview") return submitPreview(slug, token, input);
  return { ok: false, reason: "failed" };
}

async function submitPreview(
  slug: string,
  token: string | null,
  input: ReplyInput,
): Promise<SubmitResult> {
  const invite = await findPublishedInvite(slug);
  if (!invite) return { ok: false, reason: "missing" };
  const known = new Set(Object.values(invite.functionIds));
  if (input.replies.some((reply) => !known.has(reply.functionId))) {
    return { ok: false, reason: "failed" };
  }
  let guest = token ? previewDb.guests.get(token) : undefined;
  if (guest && guest.eventId !== invite.id) guest = undefined;
  if (
    guest?.functionIds.length &&
    input.replies.some((reply) => !guest!.functionIds.includes(reply.functionId))
  ) {
    return { ok: false, reason: "not-invited" };
  }
  if (!guest) {
    guest = {
      eventId: invite.id,
      token: randomBytes(12).toString("hex"),
      id: randomUUID(),
      name: input.name,
      selfAdded: true,
      functionIds: [],
      replies: [],
      openedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    previewDb.guests.set(guest.token, guest);
  } else if (guest.selfAdded) {
    guest.name = input.name;
  }
  const now = new Date().toISOString();
  for (const reply of input.replies) {
    const declined = reply.status === "declined";
    const next: PreviewReply = {
      functionId: reply.functionId,
      status: reply.status,
      adults: declined ? 0 : reply.adults,
      children: declined ? 0 : reply.children,
      message: input.message,
      answers: input.answers,
      respondedAt: now,
    };
    guest.replies = [
      ...guest.replies.filter((existing) => existing.functionId !== reply.functionId),
      next,
    ];
  }
  return { ok: true, token: guest.token };
}

/* ---------- What the host sees ---------- */

export type ReplySummary = {
  totals: { kind: FunctionId; attending: number; maybe: number; declined: number }[];
  guests: {
    name: string;
    respondedAt: string;
    message: string;
    statuses: { kind: FunctionId; status: ReplyStatus; people: number }[];
  }[];
};

type HostRow = {
  guest_id: string | null;
  name: string;
  status: ReplyStatus;
  adults: number;
  children: number;
  message: string;
  responded_at: string;
  kind: string;
};

function summarize(rows: HostRow[]): ReplySummary {
  const totals = new Map<FunctionId, ReplySummary["totals"][number]>();
  const guests = new Map<string, ReplySummary["guests"][number]>();
  for (const row of rows) {
    if (!isFunctionId(row.kind)) continue;
    const people = row.adults + row.children;
    const total = totals.get(row.kind) ?? { kind: row.kind, attending: 0, maybe: 0, declined: 0 };
    if (row.status === "declined") total.declined += 1;
    else total[row.status] += people;
    totals.set(row.kind, total);
    const key = row.guest_id ?? `${row.name}:${row.responded_at}`;
    const guest = guests.get(key) ?? {
      name: row.name,
      respondedAt: row.responded_at,
      message: row.message,
      statuses: [],
    };
    guest.statuses.push({ kind: row.kind, status: row.status, people });
    if (row.responded_at > guest.respondedAt) {
      guest.respondedAt = row.responded_at;
      guest.name = row.name;
      guest.message = row.message;
    }
    guests.set(key, guest);
  }
  return {
    totals: [...totals.values()],
    guests: [...guests.values()].sort((a, b) => b.respondedAt.localeCompare(a.respondedAt)),
  };
}

/** Replies to one of the host's invites, per function and per guest, newest first. */
export async function hostReplies(account: Account, eventId: string): Promise<ReplySummary> {
  const mode = authMode();
  if (mode === "supabase") {
    const supabase = await supabaseServer();
    if (!supabase) return { totals: [], guests: [] };
    const { data } = await supabase
      .from("rsvps")
      .select("guest_id, name, status, adults, children, message, responded_at, functions(kind)")
      .eq("event_id", eventId)
      .order("responded_at", { ascending: false })
      .limit(1000);
    return summarize(
      (data ?? []).map((row) => {
        const fn = row.functions as unknown as { kind: string } | null;
        return { ...(row as unknown as HostRow), kind: fn?.kind ?? "" };
      }),
    );
  }
  if (mode === "preview") {
    const stored = previewDb.invites.get(eventId);
    if (!stored || !previewHosts(stored, account.id)) return { totals: [], guests: [] };
    const rows: HostRow[] = [...previewDb.guests.values()]
      .filter((guest) => guest.eventId === eventId)
      .flatMap((guest) =>
        guest.replies.map((reply) => ({
          guest_id: guest.token,
          name: guest.name,
          status: reply.status,
          adults: reply.adults,
          children: reply.children,
          message: reply.message,
          responded_at: reply.respondedAt,
          kind: reply.functionId.split(":")[1] ?? "",
        })),
      );
    return summarize(rows);
  }
  return { totals: [], guests: [] };
}
