import { NextResponse, type NextRequest } from "next/server";
import { safeNext } from "@/lib/auth/account";
import { finishGoogleSignIn } from "@/lib/auth/server";

/** Google sends the browser back here; finish signing in, then carry on where they were. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = safeNext(searchParams.get("next"));
  if (searchParams.has("error")) {
    return NextResponse.redirect(`${origin}/sign-in?error=google&next=${encodeURIComponent(next)}`);
  }
  const result = await finishGoogleSignIn(searchParams);
  if (!result.ok) {
    return NextResponse.redirect(`${origin}/sign-in?error=google&next=${encodeURIComponent(next)}`);
  }
  return NextResponse.redirect(`${origin}${next}`);
}
