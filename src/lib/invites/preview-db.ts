import "server-only";
import type { RsvpQuestionId } from "@/lib/categories/schema";
import type { ScheduledSend } from "@/lib/guests/schedule";
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
  /** The RSVP's library questions, in order. */
  questions: RsvpQuestionId[];
  publishedAt: string | null;
  /** Everyone who runs the invite, owner first (Step 11). */
  hosts?: PreviewHost[];
  /** Co-host links not yet used. */
  hostInvites?: PreviewHostInvite[];
  /** Invitations and reminders planned for later (scheduled sending). */
  schedules?: ScheduledSend[];
};

export type PreviewHost = {
  userId: string;
  name: string;
  role: "owner" | "cohost";
  side: string;
  createdAt: string;
};

export type PreviewHostInvite = {
  id: string;
  label: string;
  token: string;
  invitedBy: string;
  invitedByName: string;
  createdAt: string;
};

type PreviewFile = { type: string; data: Uint8Array };

export type PreviewReply = {
  /** "<event id>:<function kind>", as the public invite names functions in preview mode. */
  functionId: string;
  status: "attending" | "declined" | "maybe";
  adults: number;
  children: number;
  message: string;
  answers: Record<string, string>;
  respondedAt: string;
};

export type PreviewGuest = {
  eventId: string;
  token: string;
  name: string;
  selfAdded: boolean;
  functionIds: string[];
  replies: PreviewReply[];
  /** Added with the guest list (Step 11); guests from earlier previews lack them. */
  id?: string;
  phone?: string | null;
  group?: string;
  partySize?: number;
  openedAt?: string | null;
  remindedAt?: string | null;
  createdAt?: string;
};

/** A guest's photo on the shared wall (Step 24); its file is in `files` under `path`. */
export type PreviewWallPhoto = {
  id: string;
  eventId: string;
  guestToken: string | null;
  name: string;
  device: string;
  path: string;
  width: number;
  height: number;
  hidden: boolean;
  createdAt: string;
};

type PreviewDb = {
  invites: Map<string, PreviewInvite>;
  /** Photo files by "<event id>/<photo id>". */
  files: Map<string, PreviewFile>;
  /** Guests by token. */
  guests: Map<string, PreviewGuest>;
  /** Photo wall photos by id. */
  wall: Map<string, PreviewWallPhoto>;
};

const holder = globalThis as unknown as { __shubhdwarPreviewDb?: PreviewDb };

export const previewDb: PreviewDb = (holder.__shubhdwarPreviewDb ??= {
  invites: new Map(),
  files: new Map(),
  guests: new Map(),
  wall: new Map(),
});
previewDb.guests ??= new Map();
previewDb.wall ??= new Map();

/** A photo as a data URL: preview mode has no file storage to link to. */
export function previewPhotoUrl(eventId: string, photoId: string): string | null {
  const file = previewDb.files.get(`${eventId}/${photoId}`);
  return file ? `data:${file.type};base64,${Buffer.from(file.data).toString("base64")}` : null;
}

/** Whether this person owns or co-hosts a preview invite. */
export function previewHosts(stored: PreviewInvite, accountId: string): boolean {
  return (
    stored.owner === accountId || (stored.hosts ?? []).some((host) => host.userId === accountId)
  );
}
