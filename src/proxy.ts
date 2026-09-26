import { NextResponse, type NextRequest } from "next/server";
import { parseRegion } from "@/lib/categories/rank";
import { REGION_COOKIE } from "@/lib/categories/regions";

/*
 * Remembers which Indian state a visitor is in, from the hosting platform's location
 * headers, so the home screen and the editor can put local occasions first. Only the
 * state is kept, for a day; nothing is stored on the server.
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const country = request.headers.get("x-vercel-ip-country");
  const region =
    country === "IN" ? parseRegion(request.headers.get("x-vercel-ip-country-region")) : null;
  const current = request.cookies.get(REGION_COOKIE)?.value ?? null;
  if (region && region !== current) {
    response.cookies.set(REGION_COOKIE, region, {
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
      path: "/",
    });
  } else if (!region && current && country) {
    response.cookies.delete(REGION_COOKIE);
  }
  return response;
}

export const config = {
  matcher: ["/", "/create"],
};
