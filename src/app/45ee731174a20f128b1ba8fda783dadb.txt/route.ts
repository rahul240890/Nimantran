import { INDEXNOW_KEY } from "@/lib/seo/indexnow";

/* The IndexNow key file (src/lib/seo/indexnow.ts): search engines read it to trust our pings. */

export const dynamic = "force-static";

export function GET() {
  return new Response(INDEXNOW_KEY, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
