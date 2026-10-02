import { z } from "zod";
import {
  addWallPhoto,
  guestWall,
  inviteWallWindow,
  removeOwnWallPhoto,
} from "@/lib/invites/photo-wall";
import { findPublishedInvite } from "@/lib/invites/public";
import { WALL_RULES } from "@/lib/photo-wall/rules";

/*
 * The shared photo wall for guests (Step 24): GET reads it, POST adds one photo (the body
 * is the file, shrunk on the phone first), DELETE takes back one of this phone's photos.
 * Guests don't sign in; a random key their phone keeps marks their own photos.
 */

const device = z.string().regex(/^[0-9a-f]{32}$/);
const size = z.coerce.number().int().min(1).max(10_000);
const token = z
  .string()
  .regex(/^[0-9a-zA-Z_-]{8,128}$/)
  .nullable();

const noStore = { "cache-control": "no-store" };

export async function GET(request: Request, ctx: RouteContext<"/api/i/[slug]/wall">) {
  const { slug } = await ctx.params;
  const key = device.safeParse(new URL(request.url).searchParams.get("device"));
  const invite = await findPublishedInvite(slug);
  if (!invite) return Response.json({ error: "not-found" }, { status: 404 });
  const [window, photos] = await Promise.all([
    inviteWallWindow(invite),
    guestWall(invite, key.success ? key.data : ""),
  ]);
  return Response.json({ window, photos }, { headers: noStore });
}

export async function POST(request: Request, ctx: RouteContext<"/api/i/[slug]/wall">) {
  const { slug } = await ctx.params;
  const url = new URL(request.url);
  const meta = z
    .object({
      width: size,
      height: size,
      device,
      token,
      name: z.string().trim().max(80),
    })
    .safeParse({
      width: url.searchParams.get("w"),
      height: url.searchParams.get("h"),
      device: url.searchParams.get("device"),
      token: url.searchParams.get("token") || null,
      name: url.searchParams.get("name") ?? "",
    });
  const type = request.headers.get("content-type") ?? "";
  if (!meta.success) return Response.json({ error: "bad-request" }, { status: 400 });
  if (!WALL_RULES.types.includes(type)) return Response.json({ error: "type" }, { status: 415 });
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > WALL_RULES.maxBytes) return Response.json({ error: "size" }, { status: 413 });

  const invite = await findPublishedInvite(slug);
  if (!invite) return Response.json({ error: "not-found" }, { status: 404 });
  const window = await inviteWallWindow(invite);
  if (window.state !== "open") return Response.json({ error: "closed" }, { status: 403 });

  const body = await request.arrayBuffer();
  if (body.byteLength === 0 || body.byteLength > WALL_RULES.maxBytes) {
    return Response.json({ error: "size" }, { status: 413 });
  }
  const result = await addWallPhoto(invite, {
    ...meta.data,
    file: new Blob([body], { type }),
  }).catch(() => ({ ok: false, reason: "failed" }) as const);
  if (result.ok) return Response.json({ photo: result.photo }, { headers: noStore });
  const status = { closed: 403, full: 409, share: 429, unavailable: 503, failed: 500 }[
    result.reason
  ];
  return Response.json({ error: result.reason }, { status });
}

export async function DELETE(request: Request, ctx: RouteContext<"/api/i/[slug]/wall">) {
  const { slug } = await ctx.params;
  const url = new URL(request.url);
  const key = device.safeParse(url.searchParams.get("device"));
  const photo = z.uuid().safeParse(url.searchParams.get("photo"));
  if (!key.success || !photo.success) {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }
  const invite = await findPublishedInvite(slug);
  if (!invite) return Response.json({ error: "not-found" }, { status: 404 });
  const removed = await removeOwnWallPhoto(invite, key.data, photo.data).catch(() => false);
  return removed
    ? Response.json({ ok: true })
    : Response.json({ error: "failed" }, { status: 403 });
}
