import { CATEGORIES, isCategoryId } from "@/lib/categories/catalog";
import { RSVP_QUESTION_IDS } from "@/lib/categories/ids";
import {
  EDITOR_STEPS,
  draftPeople,
  FUNCTION_IDS,
  newDraft,
  type EventFunction,
  type FunctionId,
  type InviteDraft,
} from "@/lib/editor/draft";
import { parseDraft } from "@/lib/editor/draft-checks";
import { isTemplateId } from "@/lib/templates/ids";
import { suiteFor, type SuiteId } from "@/lib/suites/catalog";

/*
 * An invite as the database stores it (supabase/migrations): one events row, one
 * functions row per planned function, and one media row per photo, whose file lives in
 * the event-media bucket at <event id>/<photo id>.<ext>.
 */

export type EventRow = {
  id: string;
  category_id: string;
  template_id: string;
  status: "draft" | "published" | "archived";
  slug: string | null;
  content: Record<string, string>;
  music: { raga: string | null; playOnOpen: boolean };
  editor_step: string;
  updated_at: string;
  /** The tradition pack and the family's religious elements (Step 12a). */
  tradition_id?: string | null;
  religious?: Record<string, unknown> | null;
  /** The card's languages, main first (Step 12a part 3). */
  languages?: string[] | null;
};

export type FunctionRow = {
  kind: FunctionId;
  position: number;
  date: string | null;
  start_time: string | null;
  /** Read and written from Step 12a; older reads may leave it out. */
  end_time?: string | null;
  venue: string;
  address: string;
  dress_code: string;
};

export type PhotoRow = {
  id: string;
  width: number | null;
  height: number | null;
  position: number;
};

export type EventWrite = Omit<EventRow, "id" | "status" | "slug" | "updated_at">;

/** Where a photo's file lives in the event-media bucket. */
export function photoPath(eventId: string, photoId: string, type: string): string {
  const ext = type === "image/png" ? "png" : type === "image/jpeg" ? "jpg" : "webp";
  return `${eventId}/${photoId}.${ext}`;
}

export function draftToRows(draft: InviteDraft): { event: EventWrite; functions: FunctionRow[] } {
  const functions = FUNCTION_IDS.filter((id) => draft.functions[id].included).map(
    (kind): FunctionRow => {
      const fn = draft.functions[kind];
      return {
        kind,
        position: FUNCTION_IDS.indexOf(kind),
        date: fn.date || null,
        start_time: fn.time || null,
        end_time: fn.endTime || null,
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
      tradition_id: draft.tradition.id,
      religious: {
        symbol: draft.tradition.symbol,
        invocation: draft.tradition.invocation,
        wording: draft.tradition.wording,
        // The events table has no column of its own for the second language's wording
        translation: draft.translation,
        suite: draft.suite,
        textBox: draft.textBox,
        type: draft.type,
        couplePhotos: draft.couplePhotos,
        blessingPage: draft.blessingPage,
        format: draft.format,
        family: draft.family,
        pages: draft.pages,
      },
      languages: draft.languages,
    },
    functions,
  };
}

/** Rebuilds the editor's draft, leniently: anything unknown falls back to a default. */
export function rowsToDraft(
  event: EventRow,
  functions: FunctionRow[],
  photos: PhotoRow[] = [],
  /** The RSVP's questions as saved; left out, the occasion's own apply. */
  questions?: readonly string[],
): InviteDraft {
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
      endTime: row.end_time ? row.end_time.slice(0, 5) : "",
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
    photos: [...photos]
      .sort((a, b) => a.position - b.position)
      .map((photo) => ({ id: photo.id, width: photo.width ?? 1, height: photo.height ?? 1 })),
    updatedAt: Date.parse(event.updated_at) || 0,
    remoteId: event.id,
    slug: event.status === "published" ? event.slug : null,
    questions: questions ? RSVP_QUESTION_IDS.filter((id) => questions.includes(id)) : null,
    // Read leniently: an unknown pack or symbol falls back to none
    tradition: { ...event.religious, id: event.tradition_id ?? null },
    languages: event.languages ?? undefined,
    translation: event.religious?.translation,
    suite: event.religious?.suite,
    textBox: event.religious?.textBox,
    type: event.religious?.type,
    couplePhotos: event.religious?.couplePhotos,
    blessingPage: event.religious?.blessingPage,
    format: event.religious?.format,
    family: event.religious?.family,
    pages: event.religious?.pages,
  });
  return draft ?? { ...base, remoteId: event.id };
}

/** What My invites shows for one invite. */
export type InviteSummary = {
  id: string;
  categoryId: string;
  templateId: string;
  status: EventRow["status"];
  /** The live link, when published. */
  slug: string | null;
  first: string;
  second: string;
  joiner: string;
  /** The main function's date, yyyy-MM-dd, or empty. */
  date: string;
  mainFunction: FunctionId | null;
  /** The painted theme its pages use, for its picture in My invites. */
  theme: SuiteId;
  updatedAt: number;
  /** Whether this person made the invite or helps run it (Step 11). */
  role: "owner" | "cohost";
};

export function summarize(
  event: EventRow,
  functions: FunctionRow[],
  role: InviteSummary["role"] = "owner",
): InviteSummary {
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
    slug: draft.slug,
    first: draft.content.first?.trim() ?? "",
    // A birthday or a party is led by one name
    second: (draftPeople(draft) !== "one" && draft.content.second?.trim()) || "",
    joiner: draft.content.joiner?.trim() || "&",
    date: main ? draft.functions[main].date : "",
    mainFunction: main,
    theme: suiteFor({
      suite: draft.suite,
      tradition: draft.tradition.id,
      templateId: draft.templateId,
      category: draft.categoryId,
    }),
    updatedAt: draft.updatedAt,
    role,
  };
}
