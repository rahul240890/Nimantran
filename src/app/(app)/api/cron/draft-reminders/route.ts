import { timingSafeEqual } from "node:crypto";
import { sendDraftReminders } from "@/lib/email/notify";

/*
 * Vercel Cron calls this once a day (vercel.json), sending CRON_SECRET as a bearer token.
 * Each run emails one reminder to hosts whose unpaid draft has sat untouched for a day.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorised(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  const wanted = Buffer.from(`Bearer ${secret}`);
  return given.length === wanted.length && timingSafeEqual(given, wanted);
}

export async function GET(request: Request) {
  if (!authorised(request)) return new Response("Unauthorised", { status: 401 });
  return Response.json(await sendDraftReminders());
}
