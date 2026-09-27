import { describe, expect, it } from "vitest";
import { countableUrl } from "./analytics";

describe("counted addresses", () => {
  it("never carry an invitation, a guest's code or a query", () => {
    expect(countableUrl("https://shubhinvitation.com/i/aarav-weds-meera?g=abc123")).toBe(
      "https://shubhinvitation.com/i/[invite]",
    );
    expect(countableUrl("https://shubhinvitation.com/invites/5f1c/guests")).toBe(
      "https://shubhinvitation.com/invites/[id]/guests",
    );
    expect(countableUrl("https://shubhinvitation.com/join/tok-1")).toBe(
      "https://shubhinvitation.com/join/[token]",
    );
    expect(countableUrl("https://shubhinvitation.com/sign-in?next=%2Finvites#x")).toBe(
      "https://shubhinvitation.com/sign-in",
    );
  });

  it("leave public pages as they are", () => {
    expect(countableUrl("https://shubhinvitation.com/hi/designs/rose")).toBe(
      "https://shubhinvitation.com/hi/designs/rose",
    );
    expect(countableUrl("/invitations/haldi")).toBe("/invitations/haldi");
  });
});
