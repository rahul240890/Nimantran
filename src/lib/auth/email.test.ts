import { describe, expect, it } from "vitest";
import { isEmailCode, maskEmail, normalizeEmail } from "./email";

describe("email sign-in addresses", () => {
  it("keeps one lower-case form", () => {
    expect(normalizeEmail("  Priya.Sharma@Gmail.com ")).toEqual({
      email: "priya.sharma@gmail.com",
    });
  });

  it("refuses empty and broken addresses", () => {
    expect(normalizeEmail(" ")).toEqual({ error: "email-required" });
    expect(normalizeEmail("priya@")).toEqual({ error: "email-invalid" });
    expect(normalizeEmail("priya gmail.com")).toEqual({ error: "email-invalid" });
  });

  it("shows enough of an address to recognise it", () => {
    expect(maskEmail("priya@gmail.com")).toBe("pr•••@gmail.com");
    expect(maskEmail("ab@x.in")).toBe("a•••@x.in");
  });

  it("takes codes of six to ten digits", () => {
    expect(isEmailCode("123456")).toBe(true);
    expect(isEmailCode("12345678")).toBe(true);
    expect(isEmailCode("12345")).toBe(false);
    expect(isEmailCode("12345a")).toBe(false);
  });
});
