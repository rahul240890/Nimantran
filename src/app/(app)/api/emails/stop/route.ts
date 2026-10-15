import { stopReminders } from "@/lib/email/notify";
import { stopTokenValid } from "@/lib/email/stop-link";

/*
 * "Stop these reminders": the form on /emails/stop posts here, and so do mail apps' own
 * Unsubscribe buttons (RFC 8058 one-click), with the signed link's u and t.
 */

export async function POST(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("u") ?? "";
  const token = url.searchParams.get("t") ?? "";
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const valid = Boolean(secret && userId && token && stopTokenValid(secret, userId, token));
  const done = valid && (await stopReminders(userId));
  const body = await request.text().catch(() => "");
  // A mail app's one-click post only needs a yes or no
  if (body.includes("List-Unsubscribe=One-Click")) {
    return new Response(done ? "Stopped" : "Not stopped", { status: done ? 200 : 400 });
  }
  const back = new URL("/emails/stop", url.origin);
  back.searchParams.set(done ? "done" : "error", "1");
  return Response.redirect(back, 303);
}
