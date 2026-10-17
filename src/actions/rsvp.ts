"use server";

import { z } from "zod";
import { RSVP_QUESTION_IDS } from "@/lib/categories/ids";
import {
  findReply,
  REPLY_STATUSES,
  submitReply,
  type GuestReply,
  type SubmitResult,
} from "@/lib/invites/rsvp";
import { replySender } from "@/lib/invites/reply-sender";
import { openLinkHasRoom } from "@/lib/payments/invite-room";
import { isSlug } from "@/lib/publish/slug";

/*
 * Guests reply from the invitation page without signing in. Everything is checked here
 * and again in the database, which only accepts replies to a published invite's own
 * functions, and only so many new guests from one network.
 */

const token = z.string().regex(/^[0-9a-f]{16,64}$/);

const replySchema = z.object({
  name: z.string().trim().min(1).max(80),
  replies: z
    .array(
      z.object({
        functionId: z.string().min(1).max(80),
        status: z.enum(REPLY_STATUSES),
        adults: z.number().int().min(0).max(20),
        children: z.number().int().min(0).max(20),
      }),
    )
    .min(1)
    .max(20),
  message: z.string().trim().max(280),
  answers: z.partialRecord(z.enum(RSVP_QUESTION_IDS), z.string().trim().max(120)),
  /** A field people never see: only a bot fills it in. */
  website: z.string().max(0).optional(),
});

export async function loadReply(slug: string, guestToken: string): Promise<GuestReply | null> {
  if (!isSlug(slug) || !token.safeParse(guestToken).success) return null;
  return findReply(slug, guestToken).catch(() => null);
}

export type SendResult = SubmitResult | { ok: false; reason: "invalid" | "full" };

export async function sendReply(
  slug: string,
  guestToken: string | null,
  input: unknown,
): Promise<SendResult> {
  const parsed = replySchema.safeParse(input);
  if (!isSlug(slug) || !parsed.success) return { ok: false, reason: "invalid" };
  const known = guestToken && token.safeParse(guestToken).success ? guestToken : null;
  // A new guest from the open link counts towards the package's invites
  if (!known && !(await openLinkHasRoom(slug).catch(() => true))) {
    return { ok: false, reason: "full" };
  }
  const answers = Object.fromEntries(
    Object.entries(parsed.data.answers).filter(([, value]) => value),
  ) as Record<string, string>;
  const { name, replies, message } = parsed.data;
  const sender = await replySender(slug).catch(() => null);
  return submitReply(slug, known, { name, replies, message, answers }, sender).catch(
    () => ({ ok: false, reason: "failed" }) as const,
  );
}
