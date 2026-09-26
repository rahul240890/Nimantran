import type { User } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn(), headers: vi.fn() }));

const { accountFromUser, authFailure } = await import("./server");

const user = (fields: Partial<User>): User =>
  ({
    id: "u1",
    aud: "authenticated",
    created_at: "2026-09-26T00:00:00Z",
    app_metadata: {},
    user_metadata: {},
    ...fields,
  }) as User;

describe("accounts from Supabase users", () => {
  it("reads a phone sign-in, with no name until one is saved", () => {
    const account = accountFromUser(
      user({ phone: "919876543210", app_metadata: { provider: "phone" } }),
    );
    expect(account).toMatchObject({
      phone: "+919876543210",
      name: "",
      email: null,
      language: "en",
      method: "phone",
    });
  });

  it("reads a Google sign-in with its name and picture", () => {
    const account = accountFromUser(
      user({
        email: "meera@example.com",
        app_metadata: { provider: "google" },
        user_metadata: { full_name: "Meera Iyer", avatar_url: "https://example.com/m.png" },
      }),
    );
    expect(account).toMatchObject({
      name: "Meera Iyer",
      email: "meera@example.com",
      avatarUrl: "https://example.com/m.png",
      method: "google",
    });
  });

  it("prefers the name and language saved on the profile", () => {
    const account = accountFromUser(
      user({ user_metadata: { full_name: "Meera Iyer", name: "मीरा", language: "hi" } }),
    );
    expect(account.name).toBe("मीरा");
    expect(account.language).toBe("hi");
    expect(accountFromUser(user({ user_metadata: { language: "xx" } })).language).toBe("en");
  });
});

describe("sign-in errors", () => {
  it.each([
    [{ code: "otp_expired" }, "bad-code"],
    [{ code: "invalid_credentials" }, "bad-code"],
    [{ code: "over_sms_send_rate_limit" }, "too-many"],
    [{ status: 429 }, "too-many"],
    [{ code: "sms_send_failed" }, "sms-failed"],
    [{ code: "phone_provider_disabled" }, "provider-off"],
    [{ code: "something_new" }, "unknown"],
  ] as const)("maps %j to %s", (error, failure) => {
    expect(authFailure(error)).toBe(failure);
  });
});
