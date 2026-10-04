import "server-only";
import type { Account } from "@/lib/auth/account";
import { authMode } from "@/lib/auth/mode";
import { questionLabels } from "@/content/categories";
import { RSVP_QUESTIONS } from "@/lib/categories/questions";
import type { RsvpQuestionId } from "@/lib/categories/schema";
import { draftQuestions, type InviteDraft } from "@/lib/editor/draft";
import { clipPath, type MusicClip } from "@/lib/editor/music-clip";
import { supabaseServer } from "@/lib/supabase/server";
import { wallFilePaths } from "./photo-wall";
import { previewDb, previewEdits, previewHosts, previewPhotoUrl } from "./preview-db";
import {
  draftToRows,
  photoPath,
  rowsToDraft,
  summarize,
  type EventRow,
  type FunctionRow,
  type InviteSummary,
  type PhotoRow,
} from "./rows";

/*
 * Invites saved in the signed-in person's account. Supabase in production, where row
 * level security decides what each person can reach (co-hosts included); an in-memory
 * store in preview mode, so tests can follow a draft from one browser to another.
 */

export type SaveResult =
  | {
      ok: true;
      id: string;
      updatedAt: number;
      missingPhotos: string[];
      /** The host's music clip isn't in the account yet. */
      missingClip: boolean;
    }
  | { ok: false };

export type PublishResult =
  { ok: true; slug: string } | { ok: false; reason: "taken" | "missing" | "failed" };

export type NewPhoto = { id: string; width: number; height: number; position: number };

type InviteStore = {
  list(account: Account): Promise<InviteSummary[] | null>;
  get(account: Account, id: string): Promise<InviteDraft | null>;
  /** Saves the draft and its photo order; photos the account doesn't have yet come back. */
  save(account: Account, draft: InviteDraft): Promise<SaveResult>;
  remove(account: Account, id: string): Promise<boolean>;
  addPhoto(account: Account, id: string, photo: NewPhoto, file: Blob): Promise<boolean>;
  /** Stores the host's music clip; the draft names it on its next save. */
  addClip(
    account: Account,
    id: string,
    clip: Pick<MusicClip, "id" | "type">,
    file: Blob,
  ): Promise<boolean>;
  /** Short-lived links to an invite's photos and music clip, by id. */
  photoUrls(account: Account, id: string): Promise<Record<string, string>>;
  slugAvailable(slug: string): Promise<boolean>;
  publish(account: Account, id: string, slug: string): Promise<PublishResult>;
  unpublish(account: Account, id: string): Promise<boolean>;
};

const EVENT_COLUMNS =
  "id, category_id, template_id, status, slug, content, music, editor_step, updated_at, tradition_id, religious, languages";
const FUNCTION_COLUMNS = "kind, position, date, start_time, end_time, venue, address, dress_code";
const MEDIA_COLUMNS = "id, width, height, position";
const QUESTION_COLUMNS = "preset";
const BUCKET = "event-media";
const PHOTO_LINK_SECONDS = 60 * 60;

/** A library question as the rsvp_questions table stores it. */
function questionRow(eventId: string, preset: RsvpQuestionId, position: number) {
  const spec = RSVP_QUESTIONS[preset];
  return {
    event_id: eventId,
    preset,
    kind: spec.kind,
    label: questionLabels[preset],
    options: spec.options ?? [],
    position,
  };
}

type Joined = EventRow & {
  functions: FunctionRow[];
  media?: PhotoRow[];
  rsvp_questions?: { preset: string | null }[];
};

const supabaseStore: InviteStore = {
  async list(account) {
    const supabase = await supabaseServer();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("events")
      .select(`${EVENT_COLUMNS}, owner_id, functions(${FUNCTION_COLUMNS})`)
      .neq("status", "archived")
      .order("updated_at", { ascending: false })
      .limit(100);
    if (error || !data) return null;
    return data.map((row) => {
      const { functions, owner_id: owner, ...event } = row as Joined & { owner_id: string };
      return summarize(event, functions, owner === account.id ? "owner" : "cohost");
    });
  },

  async get(_account, id) {
    const supabase = await supabaseServer();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("events")
      .select(
        `${EVENT_COLUMNS}, functions(${FUNCTION_COLUMNS}), media(${MEDIA_COLUMNS}), rsvp_questions(${QUESTION_COLUMNS})`,
      )
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    const { functions, media, rsvp_questions: questions, ...event } = data as Joined;
    return rowsToDraft(
      event,
      functions,
      media ?? [],
      (questions ?? []).flatMap((row) => (row.preset ? [row.preset] : [])),
    );
  },

  async save(account, draft) {
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
    // A draft pointing at an event that's gone (deleted, or a co-host was removed) starts a
    // new one. One this person can still see but not change (a co-host who runs only the
    // guests) is left alone rather than copied.
    if (!saved.error && !saved.data && draft.remoteId) {
      const { data: visible } = await supabase
        .from("events")
        .select("id")
        .eq("id", draft.remoteId)
        .maybeSingle();
      if (visible) return { ok: false };
      return supabaseStore.save(account, { ...draft, remoteId: null, slug: null });
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

    // The RSVP's questions: add the new ones and drop the ones taken out
    const questions = draftQuestions(draft);
    const { data: asked, error: askedError } = await supabase
      .from("rsvp_questions")
      .select("id, preset")
      .eq("event_id", id)
      .not("preset", "is", null);
    if (askedError || !asked) return { ok: false };
    const dropped = asked.filter((row) => !questions.includes(row.preset as RsvpQuestionId));
    if (dropped.length) {
      await supabase
        .from("rsvp_questions")
        .delete()
        .in(
          "id",
          dropped.map((row) => row.id as string),
        );
    }
    const added = questions.filter((preset) => !asked.some((row) => row.preset === preset));
    if (added.length) {
      const { error } = await supabase
        .from("rsvp_questions")
        .insert(added.map((preset) => questionRow(id, preset, questions.indexOf(preset))));
      if (error) return { ok: false };
    }

    // Photos: drop the ones taken out, keep the order, and report the ones still to upload
    const { data: media, error: mediaError } = await supabase
      .from("media")
      .select("id, storage_path, position")
      .eq("event_id", id)
      .eq("kind", "photo");
    if (mediaError || !media) return { ok: false };
    const wanted = draft.photos.map((photo) => photo.id);
    const gone = media.filter((row) => !wanted.includes(row.id as string));
    if (gone.length) {
      await supabase.storage.from(BUCKET).remove(gone.map((row) => row.storage_path as string));
      await supabase
        .from("media")
        .delete()
        .in(
          "id",
          gone.map((row) => row.id as string),
        );
    }
    for (const row of media) {
      const position = wanted.indexOf(row.id as string);
      if (position >= 0 && position !== row.position) {
        await supabase
          .from("media")
          .update({ position })
          .eq("id", row.id as string);
      }
    }
    const stored = new Set(media.map((row) => row.id as string));

    // The music clip: drop any the host replaced or took out, and say if this one is missing
    const { data: clips, error: clipsError } = await supabase
      .from("media")
      .select("id, storage_path")
      .eq("event_id", id)
      .eq("kind", "audio");
    if (clipsError || !clips) return { ok: false };
    const clipId = draft.music.clip?.id ?? null;
    const oldClips = clips.filter((row) => row.id !== clipId);
    if (oldClips.length) {
      await supabase.storage.from(BUCKET).remove(oldClips.map((row) => row.storage_path as string));
      await supabase
        .from("media")
        .delete()
        .in(
          "id",
          oldClips.map((row) => row.id as string),
        );
    }
    return {
      ok: true,
      id,
      updatedAt: Date.parse(saved.data.updated_at as string) || Date.now(),
      missingPhotos: wanted.filter((photoId) => !stored.has(photoId)),
      missingClip: clipId !== null && !clips.some((row) => row.id === clipId),
    };
  },

  async remove(_account, id) {
    const supabase = await supabaseServer();
    if (!supabase) return false;
    // Files first: deleting the event removes the media rows but not the files
    const { data: files } = await supabase.storage.from(BUCKET).list(id, { limit: 100 });
    if (files?.length) {
      await supabase.storage.from(BUCKET).remove(files.map((file) => `${id}/${file.name}`));
    }
    // Guests' photo wall files too, which can be many more than one listing holds
    const wall = await wallFilePaths(id);
    for (let start = 0; start < wall.length; start += 500) {
      await supabase.storage.from(BUCKET).remove(wall.slice(start, start + 500));
    }
    const { error, count } = await supabase.from("events").delete({ count: "exact" }).eq("id", id);
    return !error && (count ?? 0) > 0;
  },

  async addPhoto(_account, id, photo, file) {
    const supabase = await supabaseServer();
    if (!supabase) return false;
    const path = photoPath(id, photo.id, file.type);
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type, upsert: true });
    if (uploadError) return false;
    const { error } = await supabase.from("media").upsert({
      id: photo.id,
      event_id: id,
      kind: "photo",
      storage_path: path,
      width: photo.width,
      height: photo.height,
      position: photo.position,
    });
    return !error;
  },

  async addClip(_account, id, clip, file) {
    const supabase = await supabaseServer();
    if (!supabase) return false;
    const path = clipPath(id, clip);
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type, upsert: true });
    if (uploadError) return false;
    const { error } = await supabase.from("media").upsert({
      id: clip.id,
      event_id: id,
      kind: "audio",
      storage_path: path,
      position: 0,
    });
    return !error;
  },

  async photoUrls(_account, id) {
    const supabase = await supabaseServer();
    if (!supabase) return {};
    const { data: media } = await supabase
      .from("media")
      .select("id, storage_path")
      .eq("event_id", id)
      .in("kind", ["photo", "audio"]);
    if (!media?.length) return {};
    const { data } = await supabase.storage.from(BUCKET).createSignedUrls(
      media.map((row) => row.storage_path as string),
      PHOTO_LINK_SECONDS,
    );
    const byPath = new Map((data ?? []).map((link) => [link.path, link.signedUrl]));
    return Object.fromEntries(
      media.flatMap((row) => {
        const url = byPath.get(row.storage_path as string);
        return url ? [[row.id as string, url]] : [];
      }),
    );
  },

  async slugAvailable(slug) {
    const supabase = await supabaseServer();
    if (!supabase) return false;
    const { data, error } = await supabase.rpc("slug_available", { p_slug: slug });
    return !error && data === true;
  },

  async publish(_account, id, slug) {
    const supabase = await supabaseServer();
    if (!supabase) return { ok: false, reason: "failed" };
    const { data: current } = await supabase
      .from("events")
      .select("status, slug, published_at")
      .eq("id", id)
      .maybeSingle();
    if (!current) return { ok: false, reason: "missing" };
    // Once shared, a link never changes, so links already sent keep working
    const keep = current.published_at && current.slug ? (current.slug as string) : slug;
    const { data, error } = await supabase
      .from("events")
      .update({
        status: "published",
        slug: keep,
        published_at: (current.published_at as string | null) ?? new Date().toISOString(),
      })
      .eq("id", id)
      .select("slug")
      .maybeSingle();
    if (error?.code === "23505") return { ok: false, reason: "taken" };
    if (error || !data) return { ok: false, reason: "failed" };
    return { ok: true, slug: data.slug as string };
  },

  async unpublish(_account, id) {
    const supabase = await supabaseServer();
    if (!supabase) return false;
    const { error, count } = await supabase
      .from("events")
      .update({ status: "draft" }, { count: "exact" })
      .eq("id", id);
    return !error && (count ?? 0) > 0;
  },
};

const previewStore: InviteStore = {
  async list(account) {
    return [...previewDb.invites.values()]
      .filter((stored) => previewHosts(stored, account.id))
      .map((stored) =>
        summarize(stored.event, stored.functions, stored.owner === account.id ? "owner" : "cohost"),
      )
      .sort((a, b) => b.updatedAt - a.updatedAt);
  },
  async get(account, id) {
    const stored = previewDb.invites.get(id);
    return stored && previewHosts(stored, account.id)
      ? rowsToDraft(stored.event, stored.functions, stored.photos, stored.questions)
      : null;
  },
  async save(account, draft) {
    const existing = draft.remoteId ? previewDb.invites.get(draft.remoteId) : undefined;
    const mine = existing && previewHosts(existing, account.id) ? existing : undefined;
    if (mine && !previewEdits(mine, account.id)) return { ok: false };
    const id = mine ? mine.event.id : crypto.randomUUID();
    const { event, functions } = draftToRows(draft);
    const updated = new Date();
    const wanted = draft.photos.map((photo) => photo.id);
    const photos = (mine?.photos ?? [])
      .filter((photo) => wanted.includes(photo.id))
      .map((photo) => ({ ...photo, position: wanted.indexOf(photo.id) }));
    for (const photo of mine?.photos ?? []) {
      if (!wanted.includes(photo.id)) previewDb.files.delete(`${id}/${photo.id}`);
    }
    const clipId = draft.music.clip?.id ?? null;
    const oldClip = mine?.clip ?? null;
    if (oldClip && oldClip !== clipId) previewDb.files.delete(`${id}/${oldClip}`);
    previewDb.invites.set(id, {
      owner: mine?.owner ?? account.id,
      hosts: mine?.hosts ?? [
        {
          userId: account.id,
          name: account.name,
          role: "owner",
          side: "",
          createdAt: updated.toISOString(),
        },
      ],
      hostInvites: mine?.hostInvites ?? [],
      event: {
        ...event,
        id,
        status: mine?.event.status ?? "draft",
        slug: mine?.event.slug ?? null,
        updated_at: updated.toISOString(),
      },
      functions,
      photos,
      clip: clipId,
      questions: draftQuestions(draft),
      publishedAt: mine?.publishedAt ?? null,
    });
    const stored = new Set(photos.map((photo) => photo.id));
    return {
      ok: true,
      id,
      updatedAt: updated.getTime(),
      missingPhotos: wanted.filter((photoId) => !stored.has(photoId)),
      missingClip: clipId !== null && !previewDb.files.has(`${id}/${clipId}`),
    };
  },
  async remove(account, id) {
    const stored = previewDb.invites.get(id);
    if (!stored || stored.owner !== account.id) return false;
    for (const photo of stored.photos) previewDb.files.delete(`${id}/${photo.id}`);
    for (const row of previewDb.wall.values()) {
      if (row.eventId !== id) continue;
      previewDb.files.delete(row.path);
      previewDb.wall.delete(row.id);
    }
    if (stored.clip) previewDb.files.delete(`${id}/${stored.clip}`);
    return previewDb.invites.delete(id);
  },
  async addPhoto(account, id, photo, file) {
    const stored = previewDb.invites.get(id);
    if (!stored || !previewEdits(stored, account.id)) return false;
    previewDb.files.set(`${id}/${photo.id}`, {
      type: file.type,
      data: new Uint8Array(await file.arrayBuffer()),
    });
    stored.photos = [
      ...stored.photos.filter((row) => row.id !== photo.id),
      { id: photo.id, width: photo.width, height: photo.height, position: photo.position },
    ];
    return true;
  },
  async addClip(account, id, clip, file) {
    const stored = previewDb.invites.get(id);
    if (!stored || !previewHosts(stored, account.id)) return false;
    previewDb.files.set(`${id}/${clip.id}`, {
      type: file.type,
      data: new Uint8Array(await file.arrayBuffer()),
    });
    return true;
  },
  async photoUrls(account, id) {
    const stored = previewDb.invites.get(id);
    if (!stored || !previewHosts(stored, account.id)) return {};
    const ids = [...stored.photos.map((photo) => photo.id), ...(stored.clip ? [stored.clip] : [])];
    return Object.fromEntries(
      ids.flatMap((fileId) => {
        const url = previewPhotoUrl(id, fileId);
        return url ? [[fileId, url]] : [];
      }),
    );
  },
  async slugAvailable(slug) {
    return ![...previewDb.invites.values()].some((stored) => stored.event.slug === slug);
  },
  async publish(account, id, slug) {
    const stored = previewDb.invites.get(id);
    if (!stored || !previewEdits(stored, account.id)) return { ok: false, reason: "missing" };
    const keep = stored.publishedAt && stored.event.slug ? stored.event.slug : slug;
    const taken = [...previewDb.invites.values()].some(
      (other) => other !== stored && other.event.slug === keep,
    );
    if (taken) return { ok: false, reason: "taken" };
    stored.event = { ...stored.event, status: "published", slug: keep };
    stored.publishedAt ??= new Date().toISOString();
    return { ok: true, slug: keep };
  },
  async unpublish(account, id) {
    const stored = previewDb.invites.get(id);
    if (!stored || !previewEdits(stored, account.id)) return false;
    stored.event = { ...stored.event, status: "draft" };
    return true;
  },
};

/** The store for the current sign-in service, or null when accounts are off. */
export function inviteStore(): InviteStore | null {
  const mode = authMode();
  if (mode === "supabase") return supabaseStore;
  if (mode === "preview") return previewStore;
  return null;
}
