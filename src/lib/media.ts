/*
 * The theme paintings live on Cloudflare R2 once NEXT_PUBLIC_MEDIA_URL is set (owner,
 * 2026-11-20: the hosting bill). Vercel bills every deployment for the files it carries, and
 * public/suites, public/openings and public/cards are about 600 MB (public/videos, the sample
 * videos, joined them on 2026-11-25) of every one; R2 keeps a
 * single copy and charges nothing for guests downloading it. The files stay in the repository
 * as the source: scripts/media-sync.mjs copies them to R2 in each production build and then
 * leaves them out of the deployment. Without the setting (tests, local work) nothing changes.
 * Pictures the code names by their /suites/… path still work: next.config.ts redirects those
 * addresses to R2, and the Image component asks for the R2 address directly.
 */

/** The public folders that move to R2, as their address prefixes. */
export const MEDIA_FOLDERS = ["suites", "openings", "cards", "videos"] as const;

const PREFIX = new RegExp(`^/(${MEDIA_FOLDERS.join("|")})/`);

/** The media host with no slash at the end, or null while the paintings are served from here. */
export function mediaBase(value = process.env.NEXT_PUBLIC_MEDIA_URL): string | null {
  const base = value?.trim().replace(/\/+$/, "");
  return base ? base : null;
}

/** A painting's address: on R2 when it's set up, otherwise the path as given. */
export function mediaUrl(path: string, base = mediaBase()): string {
  return base && PREFIX.test(path) ? `${base}${path}` : path;
}
