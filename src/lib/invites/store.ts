import "server-only";
import type { Account } from "@/lib/auth/account";
import { authMode } from "@/lib/auth/mode";
import type { InviteDraft } from "@/lib/editor/draft";
import { supabaseServer } from "@/lib/supabase/server";
import {
  draftToRows,
  rowsToDraft,
  summarize,
  type EventRow,
  type FunctionRow,
  type InviteSummary,
} from "./rows";

/*
 * Invites saved in the signed-in person's account. Supabase in production, where row
 * level security decides what each person can reach (co-hosts included); an in-memory
 * store in preview mode, so tests can follow a draft from one browser to another.
 */

export type SaveResult = { ok: true; id: string; updatedAt: number } | { ok: false };

type InviteStore = {
  list(account: Account): Promise<InviteSummary[] | null>;
  get(account: Account, id: string): Promise<InviteDraft | null>;
  save(account: Account, draft: InviteDraft): Promise<SaveResult>;
  remove(account: Account, id: string): Promise<boolean>;
};

const EVENT_COLUMNS =
  "id, category_id, template_id, status, content, music, editor_step, updated_at";
const FUNCTION_COLUMNS = "kind, position, date, start_time, venue, address, dress_code";

const supabaseStore: InviteStore = {
  async list() {
    const supabase = await supabaseServer();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("events")
      .select(`${EVENT_COLUMNS}, functions(${FUNCTION_COLUMNS})`)
      .neq("status", "archived")
      .order("updated_at", { ascending: false })
      .limit(100);
    if (error || !data) return null;
    return data.map((row) => {
      const { functions, ...event } = row as EventRow & { functions: FunctionRow[] };
      return summarize(event, functions);
    });
  },

  async get(_account, id) {
    const supabase = await supabaseServer();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("events")
      .select(`${EVENT_COLUMNS}, functions(${FUNCTION_COLUMNS})`)
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    const { functions, ...event } = data as EventRow & { functions: FunctionRow[] };
    return rowsToDraft(event, functions);
  },

  async save(_account, draft) {
    const supabase = await supabaseServer();
    if (!supabase) return { ok: false };
    const { event, functions } = draftToRows(draft);
    const saved = draft.remoteId
      ? await supabase
          .from("events")
          .update(event)
          .eq("id", draft.remoteId)
          .select("id, updated_at")
          .maybeSingle()
      : await supabase.from("events").insert(event).select("id, updated_at").single();
    // A draft pointing at an event that's gone (deleted, or a co-host was removed) starts a new one
    if (!saved.error && !saved.data && draft.remoteId) {
      return supabaseStore.save(_account, { ...draft, remoteId: null });
    }
    if (saved.error || !saved.data) return { ok: false };
    const id = saved.data.id as string;
    const kinds = functions.map((row) => row.kind);
    const removed = supabase.from("functions").delete().eq("event_id", id);
    const { error: removeError } = await (kinds.length
      ? removed.not("kind", "in", `(${kinds.join(",")})`)
      : removed);
    if (removeError) return { ok: false };
    if (functions.length) {
      const { error } = await supabase.from("functions").upsert(
        functions.map((row) => ({ ...row, event_id: id })),
        { onConflict: "event_id,kind" },
      );
      if (error) return { ok: false };
    }
    return { ok: true, id, updatedAt: Date.parse(saved.data.updated_at as string) || Date.now() };
  },

  async remove(_account, id) {
    const supabase = await supabaseServer();
    if (!supabase) return false;
    const { error, count } = await supabase.from("events").delete({ count: "exact" }).eq("id", id);
    return !error && (count ?? 0) > 0;
  },
};

type Stored = { event: EventRow; functions: FunctionRow[]; owner: string };
const globalStore = globalThis as unknown as { __nimantranPreviewInvites?: Map<string, Stored> };
const previewInvites = (globalStore.__nimantranPreviewInvites ??= new Map());

const previewStore: InviteStore = {
  async list(account) {
    return [...previewInvites.values()]
      .filter((stored) => stored.owner === account.id)
      .map((stored) => summarize(stored.event, stored.functions))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  },
  async get(account, id) {
    const stored = previewInvites.get(id);
    return stored && stored.owner === account.id
      ? rowsToDraft(stored.event, stored.functions)
      : null;
  },
  async save(account, draft) {
    const existing = draft.remoteId ? previewInvites.get(draft.remoteId) : undefined;
    const id = existing && existing.owner === account.id ? existing.event.id : crypto.randomUUID();
    const { event, functions } = draftToRows(draft);
    const updated = new Date();
    previewInvites.set(id, {
      owner: account.id,
      event: {
        ...event,
        id,
        status: existing?.event.status ?? "draft",
        updated_at: updated.toISOString(),
      },
      functions,
    });
    return { ok: true, id, updatedAt: updated.getTime() };
  },
  async remove(account, id) {
    const stored = previewInvites.get(id);
    if (!stored || stored.owner !== account.id) return false;
    return previewInvites.delete(id);
  },
};

/** The store for the current sign-in service, or null when accounts are off. */
export function inviteStore(): InviteStore | null {
  const mode = authMode();
  if (mode === "supabase") return supabaseStore;
  if (mode === "preview") return previewStore;
  return null;
}
