import { getTrust } from "@/lib/reviews/trust";

/*
 * How many invitations have gone live and the approved reviews (lib/reviews/trust.ts), for
 * the home page and a design's page. Asked once they open, so static pages never wait.
 */
export async function GET() {
  return Response.json(await getTrust(), {
    headers: {
      "Cache-Control": "no-cache",
      "CDN-Cache-Control": "public, s-maxage=60",
    },
  });
}
