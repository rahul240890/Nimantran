import { drawCover } from "@/lib/og/cover";
import { asJpeg } from "@/lib/og/jpeg";

/*
 * The invitation's link preview picture (src/lib/og/cover.tsx): what WhatsApp shows under
 * the link, and what the share page shows as "How it looks in WhatsApp", from one address.
 * With its version (?v=, see coverPath) the CDN keeps it for good, so the picture is ready
 * the moment WhatsApp asks: opening the share page draws it once, ahead of any guest.
 */
export async function GET(request: Request, ctx: RouteContext<"/i/[slug]/cover">) {
  const { slug } = await ctx.params;
  const image = await asJpeg(await drawCover(slug));
  const versioned = new URL(request.url).searchParams.has("v");
  image.headers.set(
    "cache-control",
    versioned
      ? "public, max-age=86400, s-maxage=31536000, immutable"
      : "public, max-age=0, s-maxage=300, stale-while-revalidate=3600",
  );
  image.headers.set("x-robots-tag", "noindex, nofollow");
  return image;
}
