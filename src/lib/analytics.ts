/*
 * Visit counts (Vercel Web Analytics: no cookies, nothing personal). Addresses are
 * trimmed before they leave the browser: an invitation's link names the couple and a
 * guest's link carries their private code, so neither is ever sent (docs/LAUNCH.md).
 */

const PRIVATE: readonly [RegExp, string][] = [
  [/^\/i\/[^/]+/, "/i/[invite]"],
  [/^\/invites\/[^/]+/, "/invites/[id]"],
  [/^\/join\/[^/]+/, "/join/[token]"],
];

/** The address as it may be counted: no query or fragment, private segments replaced. */
export function countableUrl(url: string): string {
  const parsed = new URL(url, "https://example.invalid");
  let path = parsed.pathname;
  for (const [pattern, replacement] of PRIVATE) path = path.replace(pattern, replacement);
  return url.startsWith("/") ? path : `${parsed.origin}${path}`;
}
