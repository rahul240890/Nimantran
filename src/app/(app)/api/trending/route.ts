import { getTrending } from "@/lib/gallery/trending-store";

/*
 * The trending designs, for the Trending row and badges. Pages are built with the starting
 * list and ask here once they open, so the row follows real invitations without a rebuild.
 */
export async function GET() {
  const { trending } = await getTrending();
  return Response.json(
    { trending },
    {
      headers: {
        "Cache-Control": "no-cache",
        "CDN-Cache-Control": "public, s-maxage=300",
      },
    },
  );
}
