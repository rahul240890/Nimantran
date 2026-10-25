/*
 * Keeps a made video: while it is being made it carries on when the host moves to another
 * screen, and once made it is saved in this browser (IndexedDB), so it is still there when
 * they come back, even after closing the tab. One video per invitation and choice (the whole
 * invitation, or one function). Nothing leaves the device. Browser only.
 *
 * Kept under the invitation itself (owner, 2026-10-22: a video made before publishing was
 * asked for again on the share page), with what it was made with, so a page can tell a
 * video made before the invite was live, or before its package, from a finished one.
 */

/** What a made video was made with. */
export type VideoMade = {
  /** The invitation's pages, photos and music; null for a video kept before this was. */
  look: string | null;
  /** The link its last card shows: the site's before the invite is live, then its own. */
  url: string | null;
  /** Whether it carries the free preview's mark. */
  marked: boolean;
  /** Whether it plays the raga. */
  music: boolean;
};

export type KeptVideo =
  /** `frame`: the canvas the video is being drawn on, its latest frame, to show as it's made. */
  | { step: "making"; done: number; frame?: HTMLCanvasElement }
  | ({ step: "ready"; blob: Blob; href: string } & VideoMade);

/** A video made from a page, shown on the others until it's watched (video-away.tsx). */
export type AwayVideo = { key: string; from: string; video: KeptVideo };

/** Where a video was kept before it was kept under its invitation, and what it was made with. */
export type OlderVideo = { key: string; url: string | null; marked: boolean };

type Entry = { video: KeptVideo; stop?: AbortController };

const entries = new Map<string, Entry>();
const listeners = new Set<() => void>();
const loaded = new Set<string>();
/** The page each video was made from, while it's made and until it's watched or put away. */
const origins = new Map<string, string>();
let away: readonly AwayVideo[] = [];

const DB = "shubh-videos";
const STORE = "videos";

function changed() {
  away = [...origins].flatMap(([key, from]) => {
    const video = entries.get(key)?.video;
    return video ? [{ key, from, video }] : [];
  });
  for (const listener of listeners) listener();
}

/**
 * The videos made from a page in this visit, being made or made and not yet watched: the
 * host can go on to another page while one is made (owner, 2026-10-25), and see it there.
 */
export function awayVideos(): readonly AwayVideo[] {
  return away;
}

/** Puts a made video's notice away: it was watched, or hidden. */
export function seenVideo(key: string) {
  if (!origins.delete(key)) return;
  changed();
}

export function subscribeVideos(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The video kept under `key`, if any. */
export function keptVideo(key: string): KeptVideo | null {
  return entries.get(key)?.video ?? null;
}

function set(key: string, entry: Entry | null) {
  const before = entries.get(key)?.video;
  if (
    before?.step === "ready" &&
    (entry?.video.step !== "ready" || entry.video.href !== before.href)
  ) {
    URL.revokeObjectURL(before.href);
  }
  if (entry) entries.set(key, entry);
  else entries.delete(key);
  changed();
}

/**
 * Makes a video under `key`, replacing what was kept there once it is done. Resolves when it
 * is made and saved; rejects when it fails or is stopped, and the kept one stays. `from` is
 * the page it's made from, where the other pages send the host to watch it.
 */
export async function makeKept(
  key: string,
  made: VideoMade,
  make: (
    onProgress: (done: number, frame?: HTMLCanvasElement) => void,
    signal: AbortSignal,
  ) => Promise<Blob>,
  from?: string,
): Promise<void> {
  const previous = entries.get(key)?.video;
  const keep = previous?.step === "ready" ? previous : null;
  const stop = new AbortController();
  entries.set(key, { video: { step: "making", done: 0 }, stop });
  if (from) origins.set(key, from);
  changed();
  // Stopping takes effect at once, even while the raga is still being rendered: the work
  // underneath ends at its next check, and what it made is thrown away
  const stopped = new Promise<never>((_, reject) =>
    stop.signal.addEventListener("abort", () => reject(new DOMException("Stopped", "AbortError")), {
      once: true,
    }),
  );
  stopped.catch(() => undefined);
  try {
    const making = make((done, frame) => {
      const entry = entries.get(key);
      if (entry?.stop !== stop) return;
      entries.set(key, { video: { step: "making", done, frame }, stop });
      changed();
    }, stop.signal);
    making.catch(() => undefined);
    const blob = await Promise.race([making, stopped]);
    if (keep) URL.revokeObjectURL(keep.href);
    set(key, { video: { step: "ready", blob, href: URL.createObjectURL(blob), ...made } });
    await save(key, blob, made).catch(() => undefined);
  } catch (error) {
    // Back to what was there before, the last video if there was one
    if (entries.get(key)?.stop === stop) {
      if (keep) entries.set(key, { video: keep });
      else entries.delete(key);
      origins.delete(key);
      changed();
    }
    throw error;
  }
}

/** Stops the video being made under `key`. */
export function stopKept(key: string) {
  entries.get(key)?.stop?.abort();
}

/**
 * Deletes the video kept under `key`, from this page and from the browser's storage, so the
 * card starts again unmade. One being made is stopped first.
 */
export async function removeKept(key: string): Promise<void> {
  const entry = entries.get(key);
  entry?.stop?.abort();
  origins.delete(key);
  set(key, null);
  await forget(key).catch(() => undefined);
}

/**
 * Loads the video saved under `key` in this browser, once per page load. Without one there,
 * a video kept where it used to be (`older`, first found wins) moves to `key`.
 */
export async function loadKept(key: string, older: readonly OlderVideo[] = []): Promise<void> {
  if (loaded.has(key) || entries.has(key)) return;
  loaded.add(key);
  let found = await read(key).catch(() => null);
  let made = found ? madeOf(found) : null;
  for (const old of found ? [] : older) {
    const saved = await read(old.key).catch(() => null);
    if (!saved) continue;
    found = saved;
    made = { look: null, url: old.url, marked: old.marked, music: true };
    await save(key, saved.blob, made).catch(() => undefined);
    await forget(old.key).catch(() => undefined);
    break;
  }
  if (!found || !made || entries.has(key)) return;
  set(key, {
    video: { step: "ready", blob: found.blob, href: URL.createObjectURL(found.blob), ...made },
  });
}

type Saved = { blob: Blob; look: string | null; made: number } & Partial<Omit<VideoMade, "look">>;

/** What a saved video was made with; one saved before this was kept counts as unknown. */
function madeOf(saved: Saved): VideoMade {
  const known = saved.marked !== undefined;
  return {
    look: known ? saved.look : null,
    url: saved.url ?? null,
    marked: saved.marked ?? false,
    music: saved.music ?? true,
  };
}

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("No IndexedDB"));
      return;
    }
    const request = indexedDB.open(DB, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function save(key: string, blob: Blob, made: VideoMade) {
  const db = await open();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put({ blob, ...made, made: Date.now() } satisfies Saved, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

async function forget(key: string) {
  const db = await open();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

async function read(key: string): Promise<Saved | null> {
  const db = await open();
  const saved = await new Promise<Saved | null>((resolve, reject) => {
    const request = db.transaction(STORE, "readonly").objectStore(STORE).get(key);
    request.onsuccess = () => resolve((request.result as Saved | undefined) ?? null);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return saved && saved.blob instanceof Blob ? saved : null;
}

/** A short fingerprint of what a video is made from. */
export function fingerprint(value: unknown): string {
  const text = JSON.stringify(value) ?? "";
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}
