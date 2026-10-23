// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const sendEmail = vi.fn();
vi.mock("@/lib/email/send", () => ({ emailConfigured: () => true, sendEmail }));
vi.mock("@/lib/auth/mode", () => ({ authMode: () => "supabase" }));
vi.mock("@/lib/supabase/service", () => ({ supabaseService: () => null }));

const { fingerprint, isNoise, resetAlerts, sendAlert } = await import("./alert");
const { errorAlertEmail } = await import("@/lib/email/templates");

const crash = {
  where: "server" as const,
  message: "Cannot read properties of undefined (reading 'functions')",
  stack: "TypeError: Cannot read properties of undefined\n    at GuestPage (page.js:12:5)",
  path: "/i/[link]",
  facts: [["Route", "GET /i/[slug] (render)"]] as [string, string][],
};

beforeEach(() => {
  vi.stubEnv("ALERT_EMAIL", "owner@example.com, partner@example.com");
  sendEmail.mockResolvedValue({ ok: true, id: "re_1" });
});

afterEach(() => {
  vi.unstubAllEnvs();
  sendEmail.mockReset();
  resetAlerts();
});

describe("error alerts", () => {
  it("leave out what browsers report about the visitor's own phone or connection", () => {
    const browser = (message: string, stack = "") => ({
      ...crash,
      where: "browser" as const,
      message,
      stack,
    });
    expect(isNoise(browser("TypeError: Failed to fetch"))).toBe(true);
    expect(isNoise(browser("Load failed"))).toBe(true);
    expect(isNoise(browser("ResizeObserver loop completed with undelivered notifications."))).toBe(
      true,
    );
    expect(isNoise(browser("ChunkLoadError: Loading chunk 812 failed."))).toBe(true);
    expect(isNoise(browser("error event on IMG https://cdn.example"))).toBe(true);
    expect(
      isNoise(browser("Transition was aborted because of invalid state. Viewport size changed")),
    ).toBe(true);
    expect(isNoise(browser("Skipping view transition because viewport size changed."))).toBe(true);
    expect(isNoise(browser("x is not a function", "at chrome-extension://abc/inject.js:1"))).toBe(
      true,
    );
    expect(isNoise(browser("Cannot read properties of null (reading 'play')"))).toBe(false);
    expect(isNoise({ ...crash, message: "aborted" })).toBe(true);
    expect(isNoise(crash)).toBe(false);
  });

  it("count the same bug on another invitation or order as the same kind", async () => {
    const one = await fingerprint({ ...crash, message: "No order 4f1c2a9e0b7d for 1200 paise" });
    const two = await fingerprint({ ...crash, message: "No order 9a8b7c6d5e4f for 999 paise" });
    expect(one).toBe(two);
    expect(await fingerprint({ ...crash, path: "/create" })).not.toBe(await fingerprint(crash));
    expect(await fingerprint({ ...crash, where: "browser" })).not.toBe(await fingerprint(crash));
  });

  it("email everyone in ALERT_EMAIL once a day for each kind of error", async () => {
    const now = new Date("2026-10-17T06:00:00Z");
    expect(await sendAlert(crash, now)).toBe(true);
    expect(sendEmail).toHaveBeenCalledTimes(1);
    const [to, email, options] = sendEmail.mock.calls[0]!;
    expect(to).toEqual(["owner@example.com", "partner@example.com"]);
    expect(email.subject).toContain("Cannot read properties of undefined");
    expect(options.idempotencyKey).toMatch(/^error-[0-9a-f]{24}-2026-10-17$/);

    // The same kind again that day costs nothing; a different one still goes
    expect(await sendAlert(crash, new Date("2026-10-17T09:00:00Z"))).toBe(false);
    expect(await sendAlert({ ...crash, message: "Payment check failed" }, now)).toBe(true);
    expect(sendEmail).toHaveBeenCalledTimes(2);
    // A day later it alerts again
    expect(await sendAlert(crash, new Date("2026-10-18T06:30:00Z"))).toBe(true);
  });

  it("send at most ten an hour from one server, and nothing without anyone to tell", async () => {
    const now = new Date("2026-10-17T06:00:00Z");
    for (let i = 0; i < 12; i++) await sendAlert({ ...crash, path: `/page-${"x".repeat(i)}` }, now);
    expect(sendEmail).toHaveBeenCalledTimes(10);

    resetAlerts();
    sendEmail.mockClear();
    vi.stubEnv("ALERT_EMAIL", "");
    expect(await sendAlert(crash, now)).toBe(false);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("read as a plain report with the page, time and stack, and escape the message", () => {
    const email = errorAlertEmail(
      { name: "Shubh Invitation", siteUrl: "https://shubhinvitations.com", contactEmail: null },
      { ...crash, message: "<img src=x onerror=alert(1)>", at: new Date("2026-10-17T06:00:00Z") },
    );
    expect(email.html).not.toContain("<img src=x");
    expect(email.html).toContain("Something broke on the server");
    expect(email.text).toContain("Page: /i/[link]");
    expect(email.text).toContain("When: 17 Oct 2026, 11:30 am IST");
    expect(email.text).toContain("at GuestPage (page.js:12:5)");
    expect(email.text).toContain("server-error");
  });
});
