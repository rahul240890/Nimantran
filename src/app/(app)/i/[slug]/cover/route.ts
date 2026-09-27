import Image from "../opengraph-image";

/*
 * The same picture as the link preview, at a fixed address. Next.js serves opengraph-image
 * under a hashed path, so the share page shows the preview from here instead.
 */
export async function GET(_request: Request, ctx: RouteContext<"/i/[slug]/cover">) {
  const image = await Image({ params: ctx.params });
  image.headers.set("x-robots-tag", "noindex, nofollow");
  return image;
}
