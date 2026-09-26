import { describe, expect, it } from "vitest";
import type { Account } from "./account";
import { openPreviewSession, sealPreviewSession } from "./preview-session";
import { safeNext } from "./account";

const account: Account = {
  id: "preview-919876543210",
  name: "Priya Sharma",
  phone: "+919876543210",
  email: null,
  avatarUrl: null,
  language: "hi",
  method: "phone",
};

describe("preview session", () => {
  it("opens what it sealed, including other scripts", async () => {
    const named = { ...account, name: "प्रिया शर्मा" };
    expect(await openPreviewSession(await sealPreviewSession(named))).toEqual(named);
  });

  it("rejects an edited or missing cookie", async () => {
    const sealed = await sealPreviewSession(account);
    const [payload, signature] = sealed.split(".");
    const forged = btoa(JSON.stringify({ ...account, id: "someone-else" }));
    expect(await openPreviewSession(`${forged}.${signature}`)).toBeNull();
    expect(await openPreviewSession(`${payload}.x${signature!.slice(1)}`)).toBeNull();
    expect(await openPreviewSession(payload)).toBeNull();
    expect(await openPreviewSession(undefined)).toBeNull();
  });
});

describe("where to go after signing in", () => {
  it("keeps paths on this site only", () => {
    expect(safeNext("/create?step=2")).toBe("/create?step=2");
    expect(safeNext("https://evil.example")).toBe("/invites");
    expect(safeNext("//evil.example")).toBe("/invites");
    expect(safeNext("/\\evil.example")).toBe("/invites");
    expect(safeNext(undefined)).toBe("/invites");
  });
});
