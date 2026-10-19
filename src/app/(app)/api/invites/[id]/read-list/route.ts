import { z } from "zod";
import { getAccount } from "@/lib/auth/server";
import {
  MAX_READ_BYTES,
  MAX_READ_PAGES,
  MAX_READ_TEXT,
  pdfPages,
  textPages,
} from "@/lib/guests/read-list";
import { readGuestPage } from "@/lib/guests/read-list-server";

/*
 * Reads one page of a guest list with AI (the body is the file itself): a photo the
 * browser has shrunk, a PDF, or text the browser took out of a Word, Excel or notes file.
 * Answers with the guests found, for the host to check before adding. Nothing is stored.
 */

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const uuid = z.uuid();
const query = z.object({
  page: z.coerce.number().int().min(1).max(100),
  english: z.enum(["0", "1"]),
});

// Reading a crowded handwritten page can take a while
export const maxDuration = 120;

export async function POST(request: Request, ctx: RouteContext<"/api/invites/[id]/read-list">) {
  const { id } = await ctx.params;
  const url = new URL(request.url);
  const meta = query.safeParse({
    page: url.searchParams.get("page"),
    english: url.searchParams.get("english") ?? "0",
  });
  if (!uuid.safeParse(id).success || !meta.success) {
    return Response.json({ ok: false, reason: "failed" }, { status: 400 });
  }
  const account = await getAccount();
  if (!account) return Response.json({ ok: false, reason: "not-found" }, { status: 401 });

  const type = (request.headers.get("content-type") ?? "").split(";")[0]!.trim();
  const body = new Uint8Array(await request.arrayBuffer());
  if (body.byteLength === 0 || body.byteLength > MAX_READ_BYTES) {
    return Response.json({ ok: false, reason: "too-big" }, { status: 413 });
  }
  const common = { english: meta.data.english === "1", page: meta.data.page };

  let result;
  if ((IMAGE_TYPES as readonly string[]).includes(type)) {
    result = await readGuestPage(account, id, {
      ...common,
      pages: 1,
      attachment: {
        kind: "image",
        mediaType: type as (typeof IMAGE_TYPES)[number],
        data: Buffer.from(body).toString("base64"),
      },
    });
  } else if (type === "application/pdf") {
    const pages = pdfPages(body);
    if (pages > MAX_READ_PAGES) return Response.json({ ok: false, reason: "too-big" });
    result = await readGuestPage(account, id, {
      ...common,
      pages,
      attachment: { kind: "pdf", data: Buffer.from(body).toString("base64") },
    });
  } else if (type === "text/plain") {
    const text = new TextDecoder().decode(body).trim();
    if (!text || text.length > MAX_READ_TEXT) {
      return Response.json({ ok: false, reason: text ? "too-big" : "failed" });
    }
    result = await readGuestPage(account, id, { ...common, pages: textPages(text), text });
  } else {
    return Response.json({ ok: false, reason: "unsupported" }, { status: 415 });
  }
  return Response.json(result);
}
