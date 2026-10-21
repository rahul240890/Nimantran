import { siteOffers } from "@/lib/payments/coupons";

/*
 * The offers running now that the admin shows on the site, for the design preview: it
 * shows the ones that cover the design. Pages ask once they open, so static pages never
 * have to be rebuilt for a new offer.
 */
export async function GET() {
  return Response.json(
    { offers: await siteOffers() },
    {
      headers: {
        // Browsers always ask again; the CDN keeps it a minute, so a change shows within one
        "Cache-Control": "no-cache",
        "CDN-Cache-Control": "public, s-maxage=60",
      },
    },
  );
}
