"use server";

import { z } from "zod";
import { getAccount } from "@/lib/auth/server";
import { removeWallPhotos, setWallHidden } from "@/lib/invites/photo-wall";

/*
 * The host's photo wall changes (Step 24). Every call checks who is signed in; the
 * database's row level security checks again that they host the invite.
 */

const id = z.uuid();
const photoIds = z.array(z.uuid()).min(1).max(200);

async function context(inviteId: string) {
  if (!id.safeParse(inviteId).success) return null;
  return getAccount();
}

export async function hideWallPhotos(
  inviteId: string,
  ids: unknown,
  hidden: boolean,
): Promise<boolean> {
  const parsed = photoIds.safeParse(ids);
  const account = await context(inviteId);
  if (!account || !parsed.success || typeof hidden !== "boolean") return false;
  return setWallHidden(account, inviteId, parsed.data, hidden).catch(() => false);
}

export async function deleteWallPhotos(inviteId: string, ids: unknown): Promise<boolean> {
  const parsed = photoIds.safeParse(ids);
  const account = await context(inviteId);
  if (!account || !parsed.success) return false;
  return removeWallPhotos(account, inviteId, parsed.data).catch(() => false);
}
