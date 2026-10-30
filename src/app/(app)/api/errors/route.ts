import { after } from "next/server";
import { countableUrl } from "@/lib/analytics";
import { sendAlert } from "@/lib/errors/alert";
import { isBot } from "@/lib/visits";

/*
 * Receives browser error reports (lib/errors/report.ts), writes each to the server logs as
 * one line of JSON, and emails the ones that aren't the browser's own noise to whoever
 * looks after the site (lib/errors/alert.ts). Bots and headless browsers are logged but never
 * emailed: what breaks in a scraper isn't something a visitor saw. Nothing is stored;
 * malformed or oversized reports are dropped.
 */

const MAX_BYTES = 4096;
const SOURCES = new Set(["window", "promise", "boundary"]);

const text = (value: unknown, max: number) =>
  typeof value === "string" ? value.slice(0, max) : undefined;

export async function POST(request: Request) {
  const body = await request.text();
  if (body.length > MAX_BYTES) return new Response(null, { status: 413 });
  let report: Record<string, unknown>;
  try {
    report = JSON.parse(body);
  } catch {
    return new Response(null, { status: 400 });
  }
  const message = text(report.message, 500);
  const url = text(report.url, 300);
  if (!message || !url || !SOURCES.has(String(report.source))) {
    return new Response(null, { status: 400 });
  }
  const stack = text(report.stack, 2000);
  const page = countableUrl(url);
  const agent = request.headers.get("user-agent")?.slice(0, 200);
  console.error(
    "[client-error]",
    JSON.stringify({
      message,
      stack,
      digest: text(report.digest, 100),
      url: page,
      source: report.source,
      agent,
    }),
  );
  if (isBot(agent)) return new Response(null, { status: 204 });
  after(() =>
    sendAlert({
      where: "browser",
      message,
      stack,
      path: new URL(page, "https://example.invalid").pathname,
      facts: [
        ["Caught by", String(report.source)],
        ...(agent ? [["Browser", agent] as [string, string]] : []),
      ],
    }).catch(() => false),
  );
  return new Response(null, { status: 204 });
}
