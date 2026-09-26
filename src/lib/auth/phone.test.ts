import { describe, expect, it } from "vitest";
import { formatPhone, isOtp, maskPhone, normalizePhone } from "./phone";

describe("phone numbers", () => {
  it.each([
    ["98765 43210", "+919876543210"],
    ["098765-43210", "+919876543210"],
    ["+91 98765 43210", "+919876543210"],
    ["919876543210", "+919876543210"],
    ["0091 98765 43210", "+919876543210"],
    ["(987) 654-3210", "+919876543210"],
    ["+44 7700 900123", "+447700900123"],
    ["+1 415 555 0100", "+14155550100"],
  ])("reads %s", (input, phone) => {
    expect(normalizePhone(input)).toEqual({ phone });
  });

  it.each([
    ["", "required"],
    ["   ", "required"],
    ["12345", "invalid"],
    ["5876543210", "invalid"],
    ["+91 58765 43210", "invalid"],
    ["98765 4321O", "invalid"],
    ["+1 23", "invalid"],
  ])("rejects %j", (input, error) => {
    expect(normalizePhone(input)).toEqual({ error });
  });

  it("groups and masks Indian numbers", () => {
    expect(formatPhone("+919876543210")).toBe("+91 98765 43210");
    expect(maskPhone("+919876543210")).toBe("+91 ••••• •3210");
    expect(formatPhone("+447700900123")).toBe("+447700900123");
    expect(maskPhone("+447700900123")).toBe("+44••••••0123");
  });

  it("accepts six-digit codes only", () => {
    expect(isOtp("123456")).toBe(true);
    expect(isOtp("12345")).toBe(false);
    expect(isOtp("12345a")).toBe(false);
  });
});
