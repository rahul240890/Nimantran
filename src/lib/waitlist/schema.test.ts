import { describe, expect, it } from "vitest";
import { waitlist } from "@/content/landing";
import { validateWaitlist } from "./schema";

const valid = { name: "Meera Sharma", email: "Meera@Example.com ", phone: "", occasion: "wedding" };
const e = waitlist.errors;

describe("validateWaitlist", () => {
  it("accepts a complete entry and tidies the email", () => {
    const result = validateWaitlist(valid);
    expect(result).toEqual({
      ok: true,
      data: { name: "Meera Sharma", email: "meera@example.com", phone: "", occasion: "wedding" },
    });
  });

  it("gives one friendly message per field", () => {
    const result = validateWaitlist({ name: " ", email: "meera@", phone: "12", occasion: "" });
    expect(result).toEqual({
      ok: false,
      errors: { name: e.name, email: e.email, phone: e.phone, occasion: e.occasion },
    });
  });

  it.each(["+91 98765 43210", "9876543210", "(022) 2345-6789", "+44 20 7946 0958"])(
    "accepts the phone number %s",
    (phone) => {
      expect(validateWaitlist({ ...valid, phone }).ok).toBe(true);
    },
  );

  it.each(["98765", "call me", "+91 98765 43210 1234 5"])(
    "rejects the phone number %s",
    (phone) => {
      expect(validateWaitlist({ ...valid, phone })).toEqual({
        ok: false,
        errors: { phone: e.phone },
      });
    },
  );

  it("rejects very long names and unknown occasions", () => {
    expect(validateWaitlist({ ...valid, name: "M".repeat(81) })).toEqual({
      ok: false,
      errors: { name: e.nameLong },
    });
    expect(validateWaitlist({ ...valid, occasion: "party" }).ok).toBe(false);
  });

  it("treats anything that is not a form as invalid", () => {
    expect(validateWaitlist(null).ok).toBe(false);
    expect(validateWaitlist({ ...valid, name: 42 }).ok).toBe(false);
  });
});
