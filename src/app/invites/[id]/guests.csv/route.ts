import { z } from "zod";
import { questionLabels } from "@/content/categories";
import { dashboardCopy } from "@/content/dashboard";
import { functionCopy } from "@/content/editor";
import { getAccount } from "@/lib/auth/server";
import { guestsCsv, sortGuests } from "@/lib/guests/list";
import { hostStore } from "@/lib/invites/hosts";
import { inviteUrl, personalUrl } from "@/lib/publish/links";
import { slugify } from "@/lib/publish/slug";
import { inviteNames } from "@/lib/publish/describe";
import { requestOrigin } from "@/lib/request-origin";

/** The guest list as a spreadsheet, for the caterer, the hotel or the seating plan. */
export async function GET(_request: Request, { params }: RouteContext<"/invites/[id]/guests.csv">) {
  const { id } = await params;
  const account = await getAccount();
  if (!account || !z.uuid().safeParse(id).success) return new Response(null, { status: 404 });
  const data = await hostStore()?.dashboard(account, id);
  if (!data) return new Response(null, { status: 404 });

  const link = data.slug ? inviteUrl(await requestOrigin(), data.slug) : null;
  const labels = dashboardCopy.csv;
  const csv = guestsCsv(sortGuests(data.guests), data.functions, {
    labels: {
      ...labels,
      functionName: (kind) => functionCopy[kind].name,
      people: (kind) => labels.people(functionCopy[kind].name),
      answers: data.questions
        .filter((question) => question !== "message")
        .map((question) => ({ id: question, label: questionLabels[question] })),
    },
    linkFor: (guest) => (link ? personalUrl(link, guest.token) : ""),
  });
  const name = slugify(inviteNames(data.draft)) || "guests";
  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${name}-guests.csv"`,
      "cache-control": "private, no-store",
      "x-robots-tag": "noindex",
    },
  });
}
