import { z } from "zod";
import { getAccount } from "@/lib/auth/server";
import { CLIP_TYPES, MAX_CLIP_BYTES, type ClipType } from "@/lib/editor/music-clip";
import { inviteStore } from "@/lib/invites/store";

/*
 * Uploads an invite's music clip to the account (the body is the file itself). The editor
 * trims and re-encodes it first, so it arrives as a short AAC or WAV file.
 */

const uuid = z.uuid();

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/invites/[id]/music/[clipId]">,
) {
  const { id, clipId } = await ctx.params;
  if (!uuid.safeParse(id).success || !uuid.safeParse(clipId).success) {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }
  const type = request.headers.get("content-type") ?? "";
  if (!(CLIP_TYPES as readonly string[]).includes(type)) {
    return Response.json({ error: "type" }, { status: 415 });
  }
  const store = inviteStore();
  const account = await getAccount();
  if (!store || !account) return Response.json({ error: "signed-out" }, { status: 401 });
  const body = await request.arrayBuffer();
  if (body.byteLength === 0 || body.byteLength > MAX_CLIP_BYTES) {
    return Response.json({ error: "size" }, { status: 413 });
  }
  const saved = await store.addClip(
    account,
    id,
    { id: clipId, type: type as ClipType },
    new Blob([body], { type }),
  );
  return saved ? Response.json({ ok: true }) : Response.json({ error: "failed" }, { status: 403 });
}
