import { countableUrl } from "@/lib/analytics";

/*
 * Our own visitor counts for the master admin (/admin/visitors), next to Vercel's: each
 * page view goes to /api/visit, which drops bots and keeps only what the admin page shows,
 * a kind of device, a browser and where the visitor came from. Addresses are trimmed as
 * for Vercel (lib/analytics.ts), and the database turns the visitor's network into a code
 * that changes every day (supabase/migrations/20261019090000_site_visits.sql).
 */

/** What the browser sends: the page, and on the first page only, how they arrived. */
export type VisitBeacon = { path: string; referrer?: string; source?: string };

/** The funnel steps the site counts itself (lib/funnel.ts). */
export const STEP_KEYS = [
  "sample",
  "details",
  "editor",
  "preview",
  "checkout",
  "paid",
  "published",
] as const;
export type StepKey = (typeof STEP_KEYS)[number];

/** A step the browser reports, with the design or occasion it was about. */
export type StepBeacon = { step: StepKey; design?: string; category?: string };

export function isStepKey(value: unknown): value is StepKey {
  return typeof value === "string" && (STEP_KEYS as readonly string[]).includes(value);
}

/** A design or occasion id as the catalogues write them, else nothing. */
export function catalogId(value: unknown): string | null {
  return typeof value === "string" && /^[a-z0-9][a-z0-9-]{0,59}$/.test(value) ? value : null;
}

export type Agent = {
  device: "mobile" | "tablet" | "desktop";
  browser: string | null;
  os: string | null;
};

const BOT =
  /bot|crawl|spider|slurp|archiver|facebookexternalhit|whatsapp|telegram|preview|headless|lightpanda|phantom|puppeteer|playwright|selenium|lighthouse|pagespeed|vercel|curl|wget|python|axios|node-fetch|go-http/i;

/** Crawlers, link previews and scripts, which aren't people visiting. */
export function isBot(agent: string | null | undefined): boolean {
  return !agent || BOT.test(agent);
}

const BROWSERS: readonly [RegExp, string][] = [
  [/SamsungBrowser/, "Samsung Internet"],
  [/EdgA?\/|Edg\//, "Edge"],
  [/OPR\/|Opera/, "Opera"],
  [/UCBrowser/, "UC Browser"],
  [/FxiOS|Firefox\//, "Firefox"],
  [/CriOS|Chrome\//, "Chrome"],
  [/Safari\//, "Safari"],
];

const SYSTEMS: readonly [RegExp, string][] = [
  [/iPhone|iPad|iPod/, "iOS"],
  [/Android/, "Android"],
  [/Windows/, "Windows"],
  [/Mac OS X|Macintosh/, "macOS"],
  [/CrOS/, "ChromeOS"],
  [/Linux/, "Linux"],
];

/** The kind of device, browser and system, from the browser's description of itself. */
export function readAgent(agent: string): Agent {
  const tablet = /iPad|Tablet/i.test(agent) || (/Android/.test(agent) && !/Mobile/.test(agent));
  const mobile = !tablet && /Mobi|iPhone|iPod|Android/i.test(agent);
  return {
    device: tablet ? "tablet" : mobile ? "mobile" : "desktop",
    browser: BROWSERS.find(([pattern]) => pattern.test(agent))?.[1] ?? null,
    os: SYSTEMS.find(([pattern]) => pattern.test(agent))?.[1] ?? null,
  };
}

/** The page as it may be counted: a path on this site, private parts hidden. */
export function visitPath(path: unknown): string | null {
  if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//")) return null;
  const counted = countableUrl(path.slice(0, 500));
  return counted.slice(0, 300);
}

/** Pages that aren't counted: the admin's own, and the site's plumbing. */
export function uncounted(path: string): boolean {
  return /^\/(admin|api|auth)(\/|$)/.test(path);
}

/** The site the visitor came from, by name only; null for our own site or none. */
export function referrerHost(referrer: unknown, ownHost: string | null): string | null {
  if (typeof referrer !== "string" || !referrer) return null;
  try {
    const url = new URL(referrer);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if (!host) return null;
    if (
      ownHost &&
      host ===
        ownHost
          .toLowerCase()
          .replace(/^www\./, "")
          .replace(/:\d+$/, "")
    ) {
      return null;
    }
    return host.slice(0, 200);
  } catch {
    return null;
  }
}

/** A campaign name from ?utm_source=, in plain letters only. */
export function campaignSource(source: unknown): string | null {
  if (typeof source !== "string") return null;
  const clean = source
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 40);
  return clean || null;
}

function send(beacon: VisitBeacon | StepBeacon): void {
  // Browsers driven by a script say so, even when they dress up as Chrome
  if (navigator.webdriver) return;
  const body = JSON.stringify(beacon);
  if (!navigator.sendBeacon?.("/api/visit", new Blob([body], { type: "application/json" }))) {
    void fetch("/api/visit", { method: "POST", body, keepalive: true }).catch(() => {});
  }
}

/** Sends this page's view; the first page of a visit also says how they arrived. */
export function sendVisit(landing: boolean): void {
  try {
    const path = visitPath(window.location.pathname);
    if (!path || uncounted(path)) return;
    const beacon: VisitBeacon = { path };
    if (landing) {
      beacon.referrer = document.referrer || undefined;
      beacon.source = new URLSearchParams(window.location.search).get("utm_source") ?? undefined;
    }
    send(beacon);
  } catch {
    // Counting must never break the page
  }
}

/** Sends a funnel step, from the admin's own pages never. */
export function sendStep(step: StepKey, design?: string, category?: string): void {
  try {
    if (uncounted(window.location.pathname)) return;
    send({
      step,
      design: catalogId(design) ?? undefined,
      category: catalogId(category) ?? undefined,
    });
  } catch {
    // Counting must never break the page
  }
}
