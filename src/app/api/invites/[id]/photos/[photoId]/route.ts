import { z } from "zod";
import { getAccount } from "@/lib/auth/server";
import { MAX_PHOTOS } from "@/lib/editor/draft";
import { inviteStore } from "@/lib/invites/store";

/*
 * Uploads one of an invite's photos to the account (the body is the file itself). The
 * editor shrinks photos to 1600px first, so they arrive at a few hundred KB.
 */

const TYPES = ["image/webp", "image/jpeg", "image/png"];
const MAX_BYTES = 5 * 1024 * 1024;
const uuid = z.uuid();
const size = z.coerce.number().int().min(1).max(10_000);
const position = z.coerce
  .number()
  .int()
  .min(0)
  .max(MAX_PHOTOS - 1);

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/invites/[id]/photos/[photoId]">,
) {
  const { id, photoId } = await ctx.params;
  const url = new URL(request.url);
  const meta = z.object({ width: size, height: size, position }).safeParse({
    width: url.searchParams.get("w"),
    height: url.searchParams.get("h"),
    position: url.searchParams.get("position"),
  });
  const type = request.headers.get("content-type") ?? "";
  if (!uuid.safeParse(id).success || !uuid.safeParse(photoId).success || !meta.success) {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }
  if (!TYPES.includes(type)) return Response.json({ error: "type" }, { status: 415 });
  const store = inviteStore();
  const account = await getAccount();
  if (!store || !account) return Response.json({ error: "signed-out" }, { status: 401 });
  const body = await request.arrayBuffer();
  if (body.byteLength === 0 || body.byteLength > MAX_BYTES) {
    return Response.json({ error: "size" }, { status: 413 });
  }
  const saved = await store.addPhoto(
    account,
    id,
    { id: photoId, ...meta.data },
    new Blob([body], { type }),
  );
  return saved ? Response.json({ ok: true }) : Response.json({ error: "failed" }, { status: 403 });
}
