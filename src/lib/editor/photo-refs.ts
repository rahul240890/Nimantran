import type { PhotoRef } from "./draft";

/*
 * Photos upload to the account a moment after they're added, but one added offline, or
 * just before switching, may not be there yet. When the host switches between invites on
 * one device, each invite's photo list is kept here, by its account id, and joins the
 * account's list when it reopens.
 */

const KEY = "nimantran-invite-photos";

type Shelf = Record<string, PhotoRef[]>;

function read(): Shelf {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? (value as Shelf) : {};
  } catch {
    return {};
  }
}

function write(shelf: Shelf) {
  try {
    if (Object.keys(shelf).length) localStorage.setItem(KEY, JSON.stringify(shelf));
    else localStorage.removeItem(KEY);
  } catch {
    // Storage blocked: photos only follow the draft that's open
  }
}

export function shelvePhotos(inviteId: string, photos: PhotoRef[]) {
  const shelf = read();
  if (photos.length) shelf[inviteId] = photos;
  else delete shelf[inviteId];
  write(shelf);
}

export function shelvedPhotos(inviteId: string): PhotoRef[] {
  const photos = read()[inviteId];
  return Array.isArray(photos)
    ? photos.filter(
        (photo): photo is PhotoRef =>
          typeof photo?.id === "string" &&
          typeof photo.width === "number" &&
          typeof photo.height === "number",
      )
    : [];
}

export function forgetShelvedPhotos(inviteId: string) {
  shelvePhotos(inviteId, []);
}
