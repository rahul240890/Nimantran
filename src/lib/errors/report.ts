import { countableUrl } from "@/lib/analytics";

/*
 * Errors in visitors' browsers, sent to /api/errors so they show in the server logs next
 * to server errors (docs/LAUNCH.md). No names or codes: the address is trimmed as for
 * analytics, and only the message and where it happened are sent.
 */

export type ErrorReport = {
  message: string;
  stack?: string;
  digest?: string;
  url: string;
  source: "window" | "promise" | "boundary";
};

/** At most this many reports per page load, so a loop can't flood the logs. */
const LIMIT = 5;
let sent = 0;

/** Our own bundles by path; anything else (photos, music) by host only, as paths can name people. */
function loadedFrom(src: string): string {
  const url = new URL(src, "https://example.invalid");
  return url.pathname.startsWith("/_next/") ? countableUrl(src) : url.origin;
}

export function describeError(error: unknown): Pick<ErrorReport, "message" | "stack" | "digest"> {
  if (error instanceof Error) {
    const digest = "digest" in error ? String(error.digest) : undefined;
    return { message: error.message.slice(0, 500), stack: error.stack?.slice(0, 2000), digest };
  }
  // A failed script, image or audio load rejects with a bare Event: name what failed
  if (typeof Event !== "undefined" && error instanceof Event) {
    const target = error.target as { nodeName?: string; src?: unknown } | null;
    const src = typeof target?.src === "string" && target.src ? ` ${loadedFrom(target.src)}` : "";
    return {
      message: `${error.type} event on ${target?.nodeName ?? "unknown"}${src}`.slice(0, 500),
    };
  }
  return { message: String(error).slice(0, 500) };
}

export function reportError(error: unknown, source: ErrorReport["source"]) {
  if (typeof window === "undefined" || sent >= LIMIT) return;
  sent += 1;
  const report: ErrorReport = {
    ...describeError(error),
    url: countableUrl(window.location.href),
    source,
  };
  try {
    const body = JSON.stringify(report);
    if (!navigator.sendBeacon?.("/api/errors", new Blob([body], { type: "application/json" }))) {
      void fetch("/api/errors", { method: "POST", body, keepalive: true }).catch(() => {});
    }
  } catch {
    // Reporting must never break the page
  }
}
