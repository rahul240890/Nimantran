import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { proxy } from "./proxy";

describe("proxy", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon");
  });
  afterEach(() => vi.unstubAllEnvs());

  it("finishes a Google sign-in that Supabase sent to the home page", async () => {
    const response = await proxy(new NextRequest("https://shubhinvitations.com/?code=abc-123"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://shubhinvitations.com/auth/callback?code=abc-123&next=%2F",
    );
  });
});
