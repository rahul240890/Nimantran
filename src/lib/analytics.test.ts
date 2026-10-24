import { describe, expect, it } from "vitest";
import { countableUrl } from "./analytics";

describe("counted addresses", () => {
  it("never carry an invitation, a guest's code or a query", () => {
    expect(countableUrl("https://shubhinvitations.com/i/aarav-weds-meera?g=abc123")).toBe(
      "https://shubhinvitations.com/i/[invite]",
    );
    expect(countableUrl("https://shubhinvitations.com/invites/5f1c/guests")).toBe(
      "https://shubhinvitations.com/invites/[id]/guests",
    );
    expect(countableUrl("https://shubhinvitations.com/join/tok-1")).toBe(
      "https://shubhinvitations.com/join/[token]",
    );
    expect(countableUrl("/claim/0123abcd")).toBe("/claim/[token]");
    expect(countableUrl("/family/0b8c6a7e-5f43.sig")).toBe("/family/[token]");
    expect(countableUrl("https://shubhinvitations.com/sign-in?next=%2Finvites#x")).toBe(
      "https://shubhinvitations.com/sign-in",
    );
  });

  it("leave public pages as they are", () => {
    expect(countableUrl("https://shubhinvitations.com/hi/designs/rose")).toBe(
      "https://shubhinvitations.com/hi/designs/rose",
    );
    expect(countableUrl("/invitations/haldi")).toBe("/invitations/haldi");
  });
});
