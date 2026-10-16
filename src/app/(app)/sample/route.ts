import { NextResponse, type NextRequest } from "next/server";
import { DEMO_COOKIE, newTourSeed, tourPath, tourStart } from "@/lib/sample/paths";

/*
 * "Open a live invitation": a tour of the hand-picked demo designs (LIVE_DEMOS) in an order
 * of its own, never starting with the design the last tour began with, so each visit shows
 * other painted stories first. Previous and Next on the sample walk the same order.
 */
export function GET(request: NextRequest) {
  const seed = newTourSeed();
  const id = tourStart(seed, request.cookies.get(DEMO_COOKIE)?.value ?? null);
  const response = NextResponse.redirect(new URL(tourPath(id, seed), request.url), 307);
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
