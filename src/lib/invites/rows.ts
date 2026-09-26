import { CATEGORIES, isCategoryId } from "@/lib/categories/catalog";
import {
  EDITOR_STEPS,
  FUNCTION_IDS,
  newDraft,
  parseDraft,
  type EventFunction,
  type FunctionId,
  type InviteDraft,
} from "@/lib/editor/draft";
import { isTemplateId } from "@/lib/templates/schema";

/*
 * An invite as the database stores it (supabase/migrations): one events row and one
 * functions row per planned function. Photos stay on the device until publishing
 * (Step 9) uploads them to the event-media bucket.
 */

export type EventRow = {
  id: string;
  category_id: string;
  template_id: string;
  status: "draft" | "published" | "archived";
  content: Record<string, string>;
  music: { raga: string | null; playOnOpen: boolean };
  editor_step: string;
  updated_at: string;
};

export type FunctionRow = {
  kind: FunctionId;
  position: number;
  date: string | null;
  start_time: string | null;
  venue: string;
  address: string;
  dress_code: string;
};

export type EventWrite = Omit<EventRow, "id" | "status" | "updated_at">;

export function draftToRows(draft: InviteDraft): { event: EventWrite; functions: FunctionRow[] } {
  const functions = FUNCTION_IDS.filter((id) => draft.functions[id].included).map(
    (kind): FunctionRow => {
      const fn = draft.functions[kind];
      return {
        kind,
        position: FUNCTION_IDS.indexOf(kind),
        date: fn.date || null,
        start_time: fn.time || null,
        venue: fn.venue,
        address: fn.address,
        dress_code: fn.dressCode,
      };
    },
  );
  const content: Record<string, string> = {};
  for (const [slot, value] of Object.entries(draft.content)) {
    if (typeof value === "string") content[slot] = value;
  }
  return {
    event: {
      category_id: draft.categoryId,
      template_id: draft.templateId,
      content,
      music: draft.music,
      editor_step: draft.step,
    },
    functions,
  };
}

/** Rebuilds the editor's draft, leniently: anything unknown falls back to a default. */
export function rowsToDraft(event: EventRow, functions: FunctionRow[]): InviteDraft {
  const base = newDraft(
    isTemplateId(event.template_id) ? event.template_id : "marigold",
    isCategoryId(event.category_id) ? event.category_id : "wedding",
  );
  const fns = Object.fromEntries(
    FUNCTION_IDS.map((id) => [id, { ...base.functions[id], included: false }]),
  ) as Record<FunctionId, EventFunction>;
  for (const row of functions) {
    if (!(FUNCTION_IDS as readonly string[]).includes(row.kind)) continue;
    fns[row.kind] = {
      included: true,
      date: row.date ?? "",
      // Postgres returns times as HH:MM:SS
      time: row.start_time ? row.start_time.slice(0, 5) : "",
      venue: row.venue,
      address: row.address,
      dressCode: row.dress_code,
    };
  }
  const draft = parseDraft({
    ...base,
    step: (EDITOR_STEPS as readonly string[]).includes(event.editor_step)
      ? event.editor_step
      : "occasion",
    content: event.content,
    functions: fns,
    music: event.music,
    updatedAt: Date.parse(event.updated_at) || 0,
    remoteId: event.id,
  });
  return draft ?? { ...base, remoteId: event.id };
}

/** What My invites shows for one invite. */
export type InviteSummary = {
  id: string;
  categoryId: string;
  templateId: string;
  status: EventRow["status"];
  first: string;
  second: string;
  joiner: string;
  /** The main function's date, yyyy-MM-dd, or empty. */
  date: string;
  mainFunction: FunctionId | null;
  updatedAt: number;
};

export function summarize(event: EventRow, functions: FunctionRow[]): InviteSummary {
  const draft = rowsToDraft(event, functions);
  const category = CATEGORIES[draft.categoryId];
  const planned = functions.map((row) => row.kind);
  const main = planned.includes(category.functions.primary)
    ? category.functions.primary
    : planned.includes("wedding")
      ? "wedding"
      : (planned[0] ?? null);
  return {
    id: event.id,
    categoryId: draft.categoryId,
    templateId: draft.templateId,
    status: event.status,
    first: draft.content.first?.trim() ?? "",
    second: draft.content.second?.trim() ?? "",
    joiner: draft.content.joiner?.trim() || "&",
    date: main ? draft.functions[main].date : "",
    mainFunction: main,
    updatedAt: draft.updatedAt,
  };
}
