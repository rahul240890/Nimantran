import { afterEach, describe, expect, it, vi } from "vitest";
import { phoneSignIn } from "./mode";

/* Sign-in by mobile number: off on the live site until SMS codes are set up (owner, 2026-10-16). */

const supabase = () => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "sb_publishable_test");
};

describe("sign-in by mobile number", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("is off on the live site until PHONE_SIGN_IN is on", () => {
    supabase();
    vi.stubEnv("PHONE_SIGN_IN", "");
    expect(phoneSignIn()).toBe(false);
    vi.stubEnv("PHONE_SIGN_IN", "on");
    expect(phoneSignIn()).toBe(true);
  });

  it("stays on in preview mode, where the tests sign in with a number", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    vi.stubEnv("SHUBHDWAR_AUTH_PREVIEW", "1");
    vi.stubEnv("VERCEL_ENV", "development");
    expect(phoneSignIn()).toBe(true);
  });

  it("is off when accounts are off", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    vi.stubEnv("SHUBHDWAR_AUTH_PREVIEW", "");
    expect(phoneSignIn()).toBe(false);
  });
});
