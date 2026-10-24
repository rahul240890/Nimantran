"use server";

import { z } from "zod";
import { getAccount } from "@/lib/auth/server";
import { familyToken } from "@/lib/invites/family-link";
import { inviteStore } from "@/lib/invites/store";
import { site } from "@/lib/site";

/** A family preview link for an invite the signed-in person runs, or null. */
export async function familyLink(id: string): Promise<string | null> {
  if (!z.uuid().safeParse(id).success) return null;
  const account = await getAccount();
  const store = inviteStore();
  if (!account || !store) return null;
  const draft = await store.get(account, id).catch(() => null);
  if (!draft) return null;
  const token = familyToken(id);
  return token ? `${site.url}/family/${token}` : null;
}
