import { NextResponse, type NextRequest } from "next/server";
import { DEMO_COOKIE, demoPath, pickDemo } from "@/lib/sample/paths";

/*
 * "Open a live invitation": one of the hand-picked demo designs (LIVE_DEMOS), never the one
 * the visitor saw last, so the home page shows another painted story each time.
 */
export function GET(request: NextRequest) {
  const after = request.nextUrl.searchParams.get("after");
  const last = request.cookies.get(DEMO_COOKIE)?.value ?? null;
  const id = pickDemo(after, last);
  const response = NextResponse.redirect(new URL(demoPath(id), request.url), 307);
  response.headers.set("cache-control", "no-store");
  response.headers.set("x-robots-tag", "noindex, nofollow");
  response.cookies.set(DEMO_COOKIE, id, {
    path: "/sample",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
    httpOnly: true,
    secure: request.nextUrl.protocol === "https:",
  });
  return response;
}
