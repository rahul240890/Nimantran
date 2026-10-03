import { getPricing } from "@/lib/plans/pricing";

/*
 * The admin's edition prices and the designs they have moved between tiers (Admin,
 * Designs), for the badges on every page. Pages are built with the defaults and ask here
 * once they open, so a change shows without rebuilding them.
 */
export async function GET() {
  return Response.json(await getPricing(), {
    headers: {
      // Browsers always ask again; the CDN keeps it a minute, so a change shows within one
      "Cache-Control": "no-cache",
      "CDN-Cache-Control": "public, s-maxage=60",
    },
  });
}
