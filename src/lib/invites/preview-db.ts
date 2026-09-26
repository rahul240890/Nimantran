import "server-only";
import type { EventRow, FunctionRow, PhotoRow } from "./rows";

/*
 * Preview mode's database: invites, their photos and guests' replies, in server memory.
 * Shared by the host's store and the public guest pages, and kept on globalThis so it
 * survives hot reloads during development.
 */

export type PreviewInvite = {
  owner: string;
  event: EventRow;
  functions: FunctionRow[];
  photos: PhotoRow[];
  publishedAt: string | null;
};

type PreviewFile = { type: string; data: Uint8Array };

type PreviewDb = {
  invites: Map<string, PreviewInvite>;
  /** Photo files by "<event id>/<photo id>". */
  files: Map<string, PreviewFile>;
};

const holder = globalThis as unknown as { __shubhdwarPreviewDb?: PreviewDb };

export const previewDb: PreviewDb = (holder.__shubhdwarPreviewDb ??= {
  invites: new Map(),
  files: new Map(),
});

/** A photo as a data URL: preview mode has no file storage to link to. */
export function previewPhotoUrl(eventId: string, photoId: string): string | null {
  const file = previewDb.files.get(`${eventId}/${photoId}`);
  return file ? `data:${file.type};base64,${Buffer.from(file.data).toString("base64")}` : null;
}
