import { describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ headers: vi.fn() }));

const { networkOf, senderHash } = await import("./reply-sender");

const from = (values: Record<string, string>) => new Headers(values);

describe("the network a reply came from", () => {
  it("is Vercel's client address, IPv4 as it is", () => {
    expect(networkOf(from({ "x-real-ip": "49.36.12.7" }))).toBe("49.36.12.7");
    expect(networkOf(from({ "x-forwarded-for": "49.36.12.7, 10.0.0.1" }))).toBe("49.36.12.7");
    expect(networkOf(from({ "x-real-ip": "::ffff:49.36.12.7" }))).toBe("49.36.12.7");
  });

  it("is an IPv6 address's /64, however the phone rotates the rest", () => {
    const one = networkOf(from({ "x-real-ip": "2409:4040:d8f:a1b2:1111:2222:3333:4444" }));
    const two = networkOf(from({ "x-real-ip": "2409:4040:0d8f:a1b2::9" }));
    expect(one).toBe("2409:4040:d8f:a1b2");
    expect(two).toBe(one);
    expect(networkOf(from({ "x-real-ip": "2409::1" }))).toBe("2409:0:0:0");
    expect(networkOf(from({ "x-real-ip": "2409:4040:d8f:a1c0::9" }))).not.toBe(one);
  });

  it("is unknown without a usable address", () => {
    expect(networkOf(from({}))).toBeNull();
    expect(networkOf(from({ "x-real-ip": "not an address" }))).toBeNull();
  });
});

describe("the sender the database counts", () => {
  it("is a keyed hash that differs per invitation and never shows the address", () => {
    const a = senderHash("priya-weds-arjun", "49.36.12.7", "key");
    expect(a).toMatch(/^[\w-]{43}$/);
    expect(a).not.toContain("49.36");
    expect(senderHash("priya-weds-arjun", "49.36.12.7", "key")).toBe(a);
    expect(senderHash("tara-weds-ishaan", "49.36.12.7", "key")).not.toBe(a);
    expect(senderHash("priya-weds-arjun", "49.36.12.7", "other key")).not.toBe(a);
  });

  it("is left out without an address or a key", () => {
    expect(senderHash("priya-weds-arjun", null, "key")).toBeNull();
    expect(senderHash("priya-weds-arjun", "49.36.12.7", undefined)).toBeNull();
  });
});
