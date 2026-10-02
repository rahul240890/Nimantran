/*
 * The invite's photos, kept on this device in IndexedDB (local storage is too small for
 * pictures). Each photo is shrunk to at most 1600px on its long side and saved as a JPEG
 * or WebP before it is stored, so a phone's 12 MB original becomes a few hundred KB.
 * Step 8 moves them into Supabase storage.
 */

const DB_NAME = "nimantran-editor";
const STORE = "photos";
export const PHOTO_MAX_SIDE = 1600;
export const PHOTO_ACCEPT = "image/jpeg,image/png,image/webp,image/heic,image/heif";

/** The largest side of a photo once shrunk, keeping its shape. */
export function fitWithin(width: number, height: number, max = PHOTO_MAX_SIDE) {
  const scale = Math.min(1, max / Math.max(width, height));
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB unavailable"));
  });
}

async function run<T>(mode: IDBTransactionMode, work: (store: IDBObjectStore) => IDBRequest<T>) {
  const db = await openDb();
  try {
    return await new Promise<T>((resolve, reject) => {
      const request = work(db.transaction(STORE, mode).objectStore(STORE));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed"));
    });
  } finally {
    db.close();
  }
}

export function savePhoto(id: string, blob: Blob) {
  return run("readwrite", (store) => store.put(blob, id));
}

export async function loadPhoto(id: string): Promise<Blob | null> {
  const value = await run<unknown>("readonly", (store) => store.get(id));
  return value instanceof Blob ? value : null;
}

export function deletePhoto(id: string) {
  return run("readwrite", (store) => store.delete(id));
}

export function clearPhotos() {
  return run("readwrite", (store) => store.clear());
}

/** Decodes, shrinks and re-encodes a picked file. Throws if the browser can't read it. */
export async function preparePhoto(
  file: File,
  maxSide = PHOTO_MAX_SIDE,
): Promise<{ blob: Blob; width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  try {
    const size = fitWithin(bitmap.width, bitmap.height, maxSide);
    const canvas = document.createElement("canvas");
    canvas.width = size.width;
    canvas.height = size.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("No 2D canvas");
    context.drawImage(bitmap, 0, 0, size.width, size.height);
    const encode = (type: string) =>
      new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85));
    // Browsers that can't write WebP hand back a PNG, which is far bigger than a JPEG
    let blob = await encode("image/webp");
    if (blob?.type !== "image/webp") blob = await encode("image/jpeg");
    if (!blob) throw new Error("Could not encode the photo");
    return { blob, ...size };
  } finally {
    bitmap.close();
  }
}
