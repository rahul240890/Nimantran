"use client";

import { Analytics } from "@vercel/analytics/next";
import { countableUrl } from "@/lib/analytics";

/** Anonymous visit counts, with invitation and guest addresses hidden (lib/analytics.ts). */
export function SiteAnalytics() {
  return <Analytics beforeSend={(event) => ({ ...event, url: countableUrl(event.url) })} />;
}
