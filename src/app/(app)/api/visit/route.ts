import { authMode } from "@/lib/auth/mode";
import { supabaseServer } from "@/lib/supabase/server";
import {
  campaignSource,
  catalogId,
  isBot,
  isStepKey,
  readAgent,
  referrerHost,
  uncounted,
  visitPath,
} from "@/lib/visits";

/*
 * Counts one page view, or one funnel step, for the admin's Visitors page (lib/visits.ts).
 * The database gets the visitor's network and browser only to make the day's code, and
 * keeps the code; a signed-in person's view is recorded under their account by the
 * database itself, from their session. Bots, malformed beacons and the admin's pages are
 * dropped quietly.
 */

const MAX_BYTES = 2048;
const done = () => new Response(null, { status: 204 });

export async function POST(request: Request) {
  const agent = request.headers.get("user-agent");
  if (isBot(agent) || authMode() !== "supabase") return done();
  const body = await request.text();
  if (body.length > MAX_BYTES) return new Response(null, { status: 413 });
  let beacon: Record<string, unknown>;
  try {
    beacon = JSON.parse(body);
  } catch {
    return new Response(null, { status: 400 });
  }
  const network =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "";
  const key = `${network}|${agent}`;
  const supabase = await supabaseServer();

  // A funnel step: the same visitor code as the views, and only the design or occasion
  if (typeof beacon === "object" && beacon !== null && "step" in beacon) {
    if (!isStepKey(beacon.step)) return new Response(null, { status: 400 });
    await supabase
      ?.rpc("record_step", {
        p_key: key,
        p_step: beacon.step,
        p_design: catalogId(beacon.design),
        p_category: catalogId(beacon.category),
      })
      .then(
        () => undefined,
        () => undefined,
      );
    return done();
  }

  const path = visitPath(beacon?.path);
  if (!path) return new Response(null, { status: 400 });
  if (uncounted(path)) return done();

  const { device, browser, os } = readAgent(agent!);
  await supabase
    ?.rpc("record_visit", {
      p_key: key,
      p_path: path,
      p_referrer: referrerHost(beacon.referrer, request.headers.get("host")),
      p_source: campaignSource(beacon.source),
      p_country: request.headers.get("x-vercel-ip-country"),
      p_device: device,
      p_browser: browser,
      p_os: os,
    })
    .then(
      () => undefined,
      () => undefined,
    );
  return done();
}
