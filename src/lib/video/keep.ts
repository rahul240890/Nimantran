/*
 * Keeps a made video: while it is being made it carries on when the host moves to another
 * screen, and once made it is saved in this browser (IndexedDB), so it is still there when
 * they come back, even after closing the tab. One video per invitation and choice (the whole
 * invitation, or one function). Nothing leaves the device. Browser only.
 */

export type KeptVideo =
  | { step: "making"; done: number }
  | {
      step: "ready";
      blob: Blob;
      href: string;
      /** What the video was made from, to tell when the invitation has changed since. */
      look: string;
    };

type Entry = { video: KeptVideo; stop?: AbortController };

const entries = new Map<string, Entry>();
const listeners = new Set<() => void>();
const loaded = new Set<string>();

const DB = "shubh-videos";
const STORE = "videos";

function changed() {
  for (const listener of listeners) listener();
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
 * is made and saved; rejects when it fails or is stopped, and the kept one stays.
 */
export async function makeKept(
  key: string,
  look: string,
  make: (onProgress: (done: number) => void, signal: AbortSignal) => Promise<Blob>,
): Promise<void> {
  const previous = entries.get(key)?.video;
  const keep = previous?.step === "ready" ? previous : null;
  const stop = new AbortController();
  entries.set(key, { video: { step: "making", done: 0 }, stop });
  changed();
  try {
    const blob = await make((done) => {
      const entry = entries.get(key);
      if (entry?.stop !== stop) return;
      entries.set(key, { video: { step: "making", done }, stop });
      changed();
    }, stop.signal);
    if (keep) URL.revokeObjectURL(keep.href);
    set(key, { video: { step: "ready", blob, href: URL.createObjectURL(blob), look } });
    await save(key, blob, look).catch(() => undefined);
  } catch (error) {
    // Back to what was there before, the last video if there was one
    if (entries.get(key)?.stop === stop) {
      if (keep) entries.set(key, { video: keep });
      else entries.delete(key);
      changed();
    }
    throw error;
  }
}

/** Stops the video being made under `key`. */
export function stopKept(key: string) {
  entries.get(key)?.stop?.abort();
}

/** Loads the video saved under `key` in this browser, once per page load. */
export async function loadKept(key: string): Promise<void> {
  if (loaded.has(key) || entries.has(key)) return;
  loaded.add(key);
  const saved = await read(key).catch(() => null);
  if (!saved || entries.has(key)) return;
  set(key, {
    video: {
      step: "ready",
      blob: saved.blob,
      href: URL.createObjectURL(saved.blob),
      look: saved.look,
    },
  });
}

type Saved = { blob: Blob; look: string; made: number };

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

async function save(key: string, blob: Blob, look: string) {
  const db = await open();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put({ blob, look, made: Date.now() } satisfies Saved, key);
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
