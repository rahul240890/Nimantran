import sharp from "sharp";
import { inviteCover } from "@/lib/og/invite-cover";

/*
 * The link preview's picture, which the guest page names in og:image. WhatsApp shows no
 * preview at all when the picture is too heavy (around 300 KB), and the PNG with a painted
 * theme's cover comes to about 500 KB, so it goes out as a JPEG of about a fifth of that.
 */
export async function GET(_request: Request, ctx: RouteContext<"/i/[slug]/cover">) {
  const { slug } = await ctx.params;
  const png = Buffer.from(await (await inviteCover(slug)).arrayBuffer());
  const jpeg = await sharp(png).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpeg), {
    headers: {
      "content-type": "image/jpeg",
      "content-length": String(jpeg.length),
      // The address carries the invite's last change, so a fresh copy follows each edit
      "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}
