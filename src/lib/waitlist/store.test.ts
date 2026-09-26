import { afterEach, describe, expect, it, vi } from "vitest";
import { storeWaitlistEntry } from "./store";

const entry = {
  name: "Meera Sharma",
  email: "meera@example.com",
  phone: "",
  occasion: "wedding" as const,
};

describe("storeWaitlistEntry", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("refuses to pretend it stored anything when no destination is set", async () => {
    vi.stubEnv("WAITLIST_WEBHOOK_URL", "");
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(storeWaitlistEntry(entry)).resolves.toBe("unavailable");
  });

  it("logs instead of sending when asked, except on the live site", async () => {
    vi.stubEnv("WAITLIST_LOG_ONLY", "1");
    vi.stubEnv("WAITLIST_WEBHOOK_URL", "");
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(storeWaitlistEntry(entry)).resolves.toBe("stored");
    vi.stubEnv("VERCEL_ENV", "production");
    await expect(storeWaitlistEntry(entry)).resolves.toBe("unavailable");
  });

  it("posts the entry as JSON to the webhook", async () => {
    vi.stubEnv("WAITLIST_WEBHOOK_URL", "https://hooks.example/waitlist");
    const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetch);
    await expect(storeWaitlistEntry(entry)).resolves.toBe("stored");
    const [url, init] = fetch.mock.calls[0]!;
    expect(url).toBe("https://hooks.example/waitlist");
    expect(JSON.parse(init.body)).toMatchObject({ ...entry, source: "landing" });
  });

  it("reports a webhook error or outage as failed", async () => {
    vi.stubEnv("WAITLIST_WEBHOOK_URL", "https://hooks.example/waitlist");
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 500 })));
    await expect(storeWaitlistEntry(entry)).resolves.toBe("failed");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    await expect(storeWaitlistEntry(entry)).resolves.toBe("failed");
  });
});
