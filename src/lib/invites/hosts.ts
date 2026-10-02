import "server-only";
import { randomBytes, randomUUID } from "node:crypto";
import type { Account } from "@/lib/auth/account";
import { authMode } from "@/lib/auth/mode";
import { isCategoryId } from "@/lib/categories/catalog";
import { RSVP_QUESTION_IDS, type RsvpQuestionId } from "@/lib/categories/ids";
import { isFunctionId } from "@/lib/events/functions";
import type { InviteDraft } from "@/lib/editor/draft";
import type { GuestReplyRow, HostFunction, HostGuest, ReplyStatus } from "@/lib/guests/list";
import {
  SCHEDULE_LIMIT,
  type ScheduledSend,
  type SendPurpose,
  type SendStatus,
} from "@/lib/guests/schedule";
import { supabaseServer } from "@/lib/supabase/server";
import { isTemplateId, type TemplateId } from "@/lib/templates/ids";
import { previewDb, previewHosts, type PreviewGuest, type PreviewInvite } from "./preview-db";
import { rowsToDraft, type EventRow, type FunctionRow } from "./rows";

/*
 * The host dashboard (Step 11): the guest list with everyone's replies, and the people who
 * run the invite. Supabase checks every read and write with row level security, so a
 * co-host reaches exactly what the owner does except adding or removing hosts.
 */

export type Host = {
  userId: string;
  name: string;
  role: "owner" | "cohost";
  side: string;
  you: boolean;
};

export type HostInvite = { id: string; label: string; token: string; createdAt: string };

export type Dashboard = {
  id: string;
  role: "owner" | "cohost";
  status: EventRow["status"];
  slug: string | null;
  draft: InviteDraft;
  functions: HostFunction[];
  questions: RsvpQuestionId[];
  guests: HostGuest[];
  hosts: Host[];
  /** Co-host links not used yet; only the owner sees them. */
  hostInvites: HostInvite[];
  /** Invitations and reminders planned for later, sent from the host's WhatsApp. */
  schedules: ScheduledSend[];
};

export type NewSend = { purpose: SendPurpose; functionId: string | null; sendAt: string };

export type NewGuest = {
  name: string;
  phone: string | null;
  group: string;
  partySize: number;
  functionIds: string[];
};

export type GuestPatch = NewGuest;

export type JoinPreview = {
  eventId: string;
  categoryId: string;
  templateId: TemplateId;
  content: Record<string, string>;
  label: string;
  invitedBy: string;
};

export type AcceptResult = { ok: true; id: string } | { ok: false; reason: "used" | "failed" };

type HostStore = {
  dashboard(account: Account, id: string): Promise<Dashboard | null>;
  addGuests(account: Account, id: string, guests: NewGuest[]): Promise<boolean>;
  updateGuest(account: Account, id: string, guestId: string, patch: GuestPatch): Promise<boolean>;
  removeGuests(account: Account, id: string, guestIds: string[]): Promise<boolean>;
  markReminded(account: Account, id: string, guestIds: string[]): Promise<boolean>;
  scheduleSend(account: Account, id: string, send: NewSend): Promise<string | null>;
  closeSend(
    account: Account,
    id: string,
    sendId: string,
    status: Exclude<SendStatus, "scheduled">,
  ): Promise<boolean>;
  createHostInvite(account: Account, id: string, label: string): Promise<string | null>;
  withdrawHostInvite(account: Account, id: string, inviteId: string): Promise<boolean>;
  removeHost(account: Account, id: string, userId: string): Promise<boolean>;
  joinPreview(token: string): Promise<JoinPreview | null>;
  acceptHostInvite(account: Account, token: string): Promise<AcceptResult>;
};

const EVENT_COLUMNS =
  "id, owner_id, category_id, template_id, status, slug, content, music, editor_step, updated_at, tradition_id, religious, languages";
const FUNCTION_COLUMNS =
  "id, kind, position, date, start_time, end_time, venue, address, dress_code";
const GUEST_COLUMNS =
  "id, name, phone, group_name, party_size, token, function_ids, self_added, opened_at, reminded_at, created_at";
/** Visit counts arrive with 20261002170000_guest_opens.sql; until it runs the list reads without them. */
const OPEN_COLUMNS = ", last_opened_at, open_count";
const SEND_COLUMNS = "id, channel, purpose, function_id, send_at, status";
const REPLY_COLUMNS =
  "guest_id, function_id, status, adults, children, message, answers, responded_at";

type ReplyRow = {
  guest_id: string | null;
  function_id: string;
  status: ReplyStatus;
  adults: number;
  children: number;
  message: string;
  answers: Record<string, string>;
  responded_at: string;
};

type SendRow = {
  id: string;
  channel: string;
  purpose: string;
  function_id: string | null;
  send_at: string;
  status: string;
};

/** WhatsApp sends the dashboard can show; email and SMS rows wait for their providers. */
function toSends(rows: SendRow[]): ScheduledSend[] {
  return rows.flatMap((row): ScheduledSend[] =>
    row.channel === "whatsapp" &&
    (row.purpose === "invite" || row.purpose === "reminder") &&
    (row.status === "scheduled" || row.status === "sent" || row.status === "cancelled")
      ? [
          {
            id: row.id,
            purpose: row.purpose,
            functionId: row.function_id,
            sendAt: new Date(row.send_at).toISOString(),
            status: row.status,
          },
        ]
      : [],
  );
}

type GuestRow = {
  id: string;
  name: string;
  phone: string | null;
  group_name: string;
  party_size: number;
  token: string;
  function_ids: string[];
  self_added: boolean;
  opened_at: string | null;
  last_opened_at?: string | null;
  open_count?: number;
  reminded_at: string | null;
  created_at: string;
};

/** A guest with their replies folded in: the latest note and answers win. */
function withReplies(
  guest: Omit<HostGuest, "replies" | "message" | "respondedAt" | "answers">,
  rows: ReplyRow[],
): HostGuest {
  const latest = [...rows].sort((a, b) => b.responded_at.localeCompare(a.responded_at))[0];
  return {
    ...guest,
    replies: rows.map((row): GuestReplyRow => ({
      functionId: row.function_id,
      status: row.status,
      adults: row.adults,
      children: row.children,
    })),
    message: latest?.message ?? "",
    respondedAt: latest?.responded_at ?? null,
    answers: latest?.answers ?? {},
  };
}

function orderedFunctions(rows: { id: string; kind: string; position: number }[]): HostFunction[] {
  return [...rows]
    .sort((a, b) => a.position - b.position)
    .flatMap((row) => (isFunctionId(row.kind) ? [{ id: row.id, kind: row.kind }] : []));
}

const supabaseStore: HostStore = {
  async dashboard(account, id) {
    const supabase = await supabaseServer();
    if (!supabase) return null;
    const read = (guestColumns: string) =>
      supabase
        .from("events")
        .select(
          `${EVENT_COLUMNS}, functions(${FUNCTION_COLUMNS}), rsvp_questions(preset), guests(${guestColumns}), rsvps(${REPLY_COLUMNS}), scheduled_sends(${SEND_COLUMNS})`,
        )
        .eq("id", id)
        .maybeSingle();
    let { data, error } = await read(GUEST_COLUMNS + OPEN_COLUMNS);
    if (error) ({ data, error } = await read(GUEST_COLUMNS));
    if (error || !data) return null;
    const row = data as unknown as EventRow & {
      owner_id: string;
      functions: (FunctionRow & { id: string })[];
      rsvp_questions: { preset: string | null }[];
      guests: GuestRow[];
      rsvps: ReplyRow[];
      scheduled_sends: SendRow[] | null;
    };
    const role = row.owner_id === account.id ? "owner" : "cohost";
    const [{ data: hostRows }, { data: inviteRows }] = await Promise.all([
      supabase.rpc("event_host_list", { p_event: id }),
      role === "owner"
        ? supabase
            .from("event_host_invites")
            .select("id, label, token, created_at")
            .eq("event_id", id)
            .is("accepted_at", null)
            .order("created_at")
        : Promise.resolve({
            data: [] as { id: string; label: string; token: string; created_at: string }[],
          }),
    ]);
    const presets = row.rsvp_questions.flatMap((q) => (q.preset ? [q.preset] : []));
    const byGuest = new Map<string, ReplyRow[]>();
    for (const reply of row.rsvps) {
      if (!reply.guest_id) continue;
      byGuest.set(reply.guest_id, [...(byGuest.get(reply.guest_id) ?? []), reply]);
    }
    return {
      id,
      role,
      status: row.status,
      slug: row.status === "published" ? row.slug : null,
      draft: rowsToDraft(row, row.functions, [], presets),
      functions: orderedFunctions(row.functions),
      questions: RSVP_QUESTION_IDS.filter((q) => presets.includes(q)),
      guests: row.guests.map((guest) =>
        withReplies(
          {
            id: guest.id,
            name: guest.name,
            phone: guest.phone,
            group: guest.group_name,
            partySize: guest.party_size,
            token: guest.token,
            functionIds: guest.function_ids ?? [],
            selfAdded: guest.self_added,
            openedAt: guest.opened_at,
            lastOpenedAt: guest.last_opened_at ?? guest.opened_at,
            openCount: guest.open_count ?? (guest.opened_at ? 1 : 0),
            remindedAt: guest.reminded_at,
            createdAt: guest.created_at,
          },
          byGuest.get(guest.id) ?? [],
        ),
      ),
      hosts: (
        (hostRows ?? []) as { user_id: string; name: string; role: Host["role"]; side: string }[]
      ).map((host) => ({
        userId: host.user_id,
        name: host.name,
        role: host.role,
        side: host.side,
        you: host.user_id === account.id,
      })),
      hostInvites: (inviteRows ?? []).map((invite) => ({
        id: invite.id,
        label: invite.label,
        token: invite.token,
        createdAt: invite.created_at,
      })),
      schedules: toSends(row.scheduled_sends ?? []),
    };
  },

  async addGuests(_account, id, guests) {
    const supabase = await supabaseServer();
    if (!supabase) return false;
    const { error } = await supabase.from("guests").insert(
      guests.map((guest) => ({
        event_id: id,
        name: guest.name,
        phone: guest.phone,
        group_name: guest.group,
        party_size: guest.partySize,
        function_ids: guest.functionIds,
      })),
    );
    return !error;
  },

  async updateGuest(_account, id, guestId, patch) {
    const supabase = await supabaseServer();
    if (!supabase) return false;
    const { error, count } = await supabase
      .from("guests")
      .update(
        {
          name: patch.name,
          phone: patch.phone,
          group_name: patch.group,
          party_size: patch.partySize,
          function_ids: patch.functionIds,
        },
        { count: "exact" },
      )
      .eq("event_id", id)
      .eq("id", guestId);
    return !error && (count ?? 0) > 0;
  },

  async removeGuests(_account, id, guestIds) {
    const supabase = await supabaseServer();
    if (!supabase) return false;
    const { error } = await supabase.from("guests").delete().eq("event_id", id).in("id", guestIds);
    return !error;
  },

  async markReminded(_account, id, guestIds) {
    const supabase = await supabaseServer();
    if (!supabase) return false;
    const { error } = await supabase
      .from("guests")
      .update({ reminded_at: new Date().toISOString() })
      .eq("event_id", id)
      .in("id", guestIds);
    return !error;
  },

  async scheduleSend(_account, id, send) {
    const supabase = await supabaseServer();
    if (!supabase) return null;
    const { count } = await supabase
      .from("scheduled_sends")
      .select("id", { count: "exact", head: true })
      .eq("event_id", id)
      .eq("status", "scheduled");
    if ((count ?? 0) >= SCHEDULE_LIMIT) return null;
    const { data, error } = await supabase
      .from("scheduled_sends")
      .insert({
        event_id: id,
        function_id: send.functionId,
        channel: "whatsapp",
        purpose: send.purpose,
        audience: send.purpose === "reminder" ? "pending" : "all",
        send_at: send.sendAt,
      })
      .select("id")
      .single();
    return error || !data ? null : (data.id as string);
  },

  async closeSend(_account, id, sendId, status) {
    const supabase = await supabaseServer();
    if (!supabase) return false;
    const { error, count } = await supabase
      .from("scheduled_sends")
      .update(
        { status, sent_at: status === "sent" ? new Date().toISOString() : null },
        { count: "exact" },
      )
      .eq("event_id", id)
      .eq("id", sendId)
      .eq("status", "scheduled");
    return !error && (count ?? 0) > 0;
  },

  async createHostInvite(_account, id, label) {
    const supabase = await supabaseServer();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("event_host_invites")
      .insert({ event_id: id, label })
      .select("token")
      .single();
    return error || !data ? null : (data.token as string);
  },

  async withdrawHostInvite(_account, id, inviteId) {
    const supabase = await supabaseServer();
    if (!supabase) return false;
    const { error, count } = await supabase
      .from("event_host_invites")
      .delete({ count: "exact" })
      .eq("event_id", id)
      .eq("id", inviteId);
    return !error && (count ?? 0) > 0;
  },

  async removeHost(_account, id, userId) {
    const supabase = await supabaseServer();
    if (!supabase) return false;
    const { error, count } = await supabase
      .from("event_hosts")
      .delete({ count: "exact" })
      .eq("event_id", id)
      .eq("user_id", userId)
      .eq("role", "cohost");
    return !error && (count ?? 0) > 0;
  },

  async joinPreview(token) {
    const supabase = await supabaseServer();
    if (!supabase) return null;
    const { data, error } = await supabase.rpc("host_invite_preview", { p_token: token });
    if (error || !data) return null;
    const row = data as {
      event_id: string;
      category_id: string;
      template_id: string;
      content: Record<string, string>;
      label: string;
      invited_by: string;
    };
    return {
      eventId: row.event_id,
      categoryId: isCategoryId(row.category_id) ? row.category_id : "wedding",
      templateId: isTemplateId(row.template_id) ? row.template_id : "marigold",
      content: row.content ?? {},
      label: row.label,
      invitedBy: row.invited_by,
    };
  },

  async acceptHostInvite(_account, token) {
    const supabase = await supabaseServer();
    if (!supabase) return { ok: false, reason: "failed" };
    const { data, error } = await supabase.rpc("accept_host_invite", { p_token: token });
    if (error?.code === "P0002") return { ok: false, reason: "used" };
    if (error || typeof data !== "string") return { ok: false, reason: "failed" };
    return { ok: true, id: data };
  },
};

/* ---------- Preview mode ---------- */

function hosted(account: Account, id: string): PreviewInvite | null {
  const stored = previewDb.invites.get(id);
  return stored && previewHosts(stored, account.id) ? stored : null;
}

function previewGuestView(guest: PreviewGuest): HostGuest {
  return withReplies(
    {
      id: guest.id ?? guest.token,
      name: guest.name,
      phone: guest.phone ?? null,
      group: guest.group ?? "",
      partySize: guest.partySize ?? 1,
      token: guest.token,
      functionIds: guest.functionIds,
      selfAdded: guest.selfAdded,
      openedAt: guest.openedAt ?? null,
      lastOpenedAt: guest.lastOpenedAt ?? guest.openedAt ?? null,
      openCount: guest.openCount ?? (guest.openedAt ? 1 : 0),
      remindedAt: guest.remindedAt ?? null,
      createdAt: guest.createdAt ?? new Date(0).toISOString(),
    },
    guest.replies.map((reply) => ({
      guest_id: guest.id ?? guest.token,
      function_id: reply.functionId,
      status: reply.status,
      adults: reply.adults,
      children: reply.children,
      message: reply.message,
      answers: reply.answers,
      responded_at: reply.respondedAt,
    })),
  );
}

function guestsOf(id: string): PreviewGuest[] {
  return [...previewDb.guests.values()].filter((guest) => guest.eventId === id);
}

const findGuest = (id: string, guestId: string) =>
  guestsOf(id).find((guest) => (guest.id ?? guest.token) === guestId);

const previewStore: HostStore = {
  async dashboard(account, id) {
    const stored = hosted(account, id);
    if (!stored) return null;
    const role = stored.owner === account.id ? "owner" : "cohost";
    return {
      id,
      role,
      status: stored.event.status,
      slug: stored.event.status === "published" ? stored.event.slug : null,
      draft: rowsToDraft(stored.event, stored.functions, [], stored.questions),
      functions: stored.functions.map((fn) => ({ id: `${id}:${fn.kind}`, kind: fn.kind })),
      questions: stored.questions,
      guests: guestsOf(id).map(previewGuestView),
      hosts: (stored.hosts ?? []).map((host) => ({
        userId: host.userId,
        name: host.name,
        role: host.role,
        side: host.side,
        you: host.userId === account.id,
      })),
      hostInvites:
        role === "owner"
          ? (stored.hostInvites ?? []).map(({ id: inviteId, label, token, createdAt }) => ({
              id: inviteId,
              label,
              token,
              createdAt,
            }))
          : [],
      schedules: (stored.schedules ?? []).map((send) => ({ ...send })),
    };
  },
  async addGuests(account, id, guests) {
    if (!hosted(account, id)) return false;
    const now = new Date().toISOString();
    for (const guest of guests) {
      const token = randomBytes(12).toString("hex");
      previewDb.guests.set(token, {
        eventId: id,
        token,
        id: randomUUID(),
        name: guest.name,
        phone: guest.phone,
        group: guest.group,
        partySize: guest.partySize,
        functionIds: guest.functionIds,
        selfAdded: false,
        replies: [],
        openedAt: null,
        remindedAt: null,
        createdAt: now,
      });
    }
    return true;
  },
  async updateGuest(account, id, guestId, patch) {
    const guest = hosted(account, id) ? findGuest(id, guestId) : undefined;
    if (!guest) return false;
    Object.assign(guest, {
      name: patch.name,
      phone: patch.phone,
      group: patch.group,
      partySize: patch.partySize,
      functionIds: patch.functionIds,
    });
    return true;
  },
  async removeGuests(account, id, guestIds) {
    if (!hosted(account, id)) return false;
    for (const guest of guestsOf(id)) {
      if (guestIds.includes(guest.id ?? guest.token)) previewDb.guests.delete(guest.token);
    }
    return true;
  },
  async markReminded(account, id, guestIds) {
    if (!hosted(account, id)) return false;
    const now = new Date().toISOString();
    for (const guest of guestsOf(id)) {
      if (guestIds.includes(guest.id ?? guest.token)) guest.remindedAt = now;
    }
    return true;
  },
  async scheduleSend(account, id, send) {
    const stored = hosted(account, id);
    if (!stored) return null;
    const waiting = (stored.schedules ?? []).filter((item) => item.status === "scheduled");
    if (waiting.length >= SCHEDULE_LIMIT) return null;
    if (send.functionId && !stored.functions.some((fn) => `${id}:${fn.kind}` === send.functionId)) {
      return null;
    }
    const sendId = randomUUID();
    stored.schedules = [...(stored.schedules ?? []), { id: sendId, ...send, status: "scheduled" }];
    return sendId;
  },
  async closeSend(account, id, sendId, status) {
    const send = hosted(account, id)?.schedules?.find((item) => item.id === sendId);
    if (!send || send.status !== "scheduled") return false;
    send.status = status;
    return true;
  },
  async createHostInvite(account, id, label) {
    const stored = hosted(account, id);
    if (!stored || stored.owner !== account.id) return null;
    const token = randomBytes(18).toString("hex");
    stored.hostInvites = [
      ...(stored.hostInvites ?? []),
      {
        id: randomUUID(),
        label,
        token,
        invitedBy: account.id,
        invitedByName: account.name,
        createdAt: new Date().toISOString(),
      },
    ];
    return token;
  },
  async withdrawHostInvite(account, id, inviteId) {
    const stored = hosted(account, id);
    if (!stored || stored.owner !== account.id) return false;
    const before = stored.hostInvites?.length ?? 0;
    stored.hostInvites = (stored.hostInvites ?? []).filter((invite) => invite.id !== inviteId);
    return stored.hostInvites.length < before;
  },
  async removeHost(account, id, userId) {
    const stored = hosted(account, id);
    if (!stored) return false;
    // The owner removes co-hosts; a co-host can only take themselves off
    if (stored.owner !== account.id && userId !== account.id) return false;
    const before = stored.hosts?.length ?? 0;
    stored.hosts = (stored.hosts ?? []).filter(
      (host) => host.role === "owner" || host.userId !== userId,
    );
    return stored.hosts.length < before;
  },
  async joinPreview(token) {
    for (const stored of previewDb.invites.values()) {
      const invite = stored.hostInvites?.find((item) => item.token === token);
      if (!invite) continue;
      return {
        eventId: stored.event.id,
        categoryId: isCategoryId(stored.event.category_id) ? stored.event.category_id : "wedding",
        templateId: isTemplateId(stored.event.template_id) ? stored.event.template_id : "marigold",
        content: stored.event.content,
        label: invite.label,
        invitedBy: invite.invitedByName,
      };
    }
    return null;
  },
  async acceptHostInvite(account, token) {
    for (const stored of previewDb.invites.values()) {
      const invite = stored.hostInvites?.find((item) => item.token === token);
      if (!invite) continue;
      stored.hostInvites = stored.hostInvites!.filter((item) => item !== invite);
      if (!previewHosts(stored, account.id)) {
        stored.hosts = [
          ...(stored.hosts ?? []),
          {
            userId: account.id,
            name: account.name,
            role: "cohost",
            side: invite.label,
            createdAt: new Date().toISOString(),
          },
        ];
      }
      return { ok: true, id: stored.event.id };
    }
    return { ok: false, reason: "used" };
  },
};

/** The dashboard's store for the current sign-in service, or null when accounts are off. */
export function hostStore(): HostStore | null {
  const mode = authMode();
  if (mode === "supabase") return supabaseStore;
  if (mode === "preview") return previewStore;
  return null;
}
