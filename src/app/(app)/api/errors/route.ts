import { countableUrl } from "@/lib/analytics";

/*
 * Receives browser error reports (lib/errors/report.ts) and writes each to the server
 * logs as one line of JSON. Nothing is stored; malformed or oversized reports are dropped.
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
  console.error(
    "[client-error]",
    JSON.stringify({
      message,
      stack: text(report.stack, 2000),
      digest: text(report.digest, 100),
      url: countableUrl(url),
      source: report.source,
      agent: request.headers.get("user-agent")?.slice(0, 200),
    }),
  );
  return new Response(null, { status: 204 });
}
