import { NextResponse, type NextRequest } from "next/server";
import { authMode } from "@/lib/auth/mode";
import { PREVIEW_COOKIE, openPreviewSession } from "@/lib/auth/preview-session";
import { parseRegion } from "@/lib/categories/rank";
import { REGION_COOKIE } from "@/lib/categories/regions";
import { refreshSupabaseSession } from "@/lib/supabase/proxy";

/** Pages that need someone signed in. */
const PRIVATE = ["/invites", "/account"];

function isPrivate(pathname: string) {
  return PRIVATE.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

/**
 * Runs before the pages below. Keeps the sign-in session fresh, sends signed-out visitors
 * from account pages to sign in (and back afterwards), and remembers which Indian state a
 * visitor is in so local occasions come first. Only the state is kept, for a day.
 */
export async function proxy(request: NextRequest) {
  const mode = authMode();
  const { pathname, search } = request.nextUrl;
  let response = NextResponse.next({ request });
  let signedIn = false;

  // The landing page reads who is signed in from a hint cookie, so it skips this
  if (mode === "supabase" && pathname !== "/") {
    const refreshed = await refreshSupabaseSession(request, () => NextResponse.next({ request }));
    response = refreshed.response;
    signedIn = refreshed.signedIn;
  } else if (mode === "preview") {
    signedIn = Boolean(await openPreviewSession(request.cookies.get(PREVIEW_COOKIE)?.value));
  }

  if (isPrivate(pathname) && !signedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    const redirect = NextResponse.redirect(url);
    for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie);
    return redirect;
  }

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
  matcher: ["/", "/create", "/sign-in", "/auth/:path*", "/invites/:path*", "/account/:path*"],
};
