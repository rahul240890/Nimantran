import { isFunctionId } from "@/lib/events/functions";
import { findPublishedInvite } from "@/lib/invites/public";
import { icsCalendar } from "@/lib/publish/calendar";
import { calendarEntries } from "@/lib/publish/describe";
import { inviteUrl } from "@/lib/publish/links";
import { requestOrigin } from "@/lib/request-origin";

/** The invite's functions as an .ics file; ?function=haldi gives just that one. */
export async function GET(request: Request, ctx: RouteContext<"/i/[slug]/calendar">) {
  const { slug } = await ctx.params;
  const invite = await findPublishedInvite(slug);
  if (!invite) return new Response("Not found", { status: 404 });
  const only = new URL(request.url).searchParams.get("function");
  const url = inviteUrl(await requestOrigin(), invite.slug);
  const entries = calendarEntries(invite.draft, { id: invite.id, url }).filter(
    (entry) => !isFunctionId(only) || entry.uid.startsWith(`${invite.id}-${only}@`),
  );
  const name = isFunctionId(only) ? `${invite.slug}-${only}` : invite.slug;
  return new Response(icsCalendar(entries), {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": `attachment; filename="${name}.ics"`,
      "cache-control": "private, no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}
