import { describe, expect, it } from "vitest";
import { countableUrl } from "./analytics";

describe("counted addresses", () => {
  it("never carry an invitation, a guest's code or a query", () => {
    expect(countableUrl("https://shubhdwar.com/i/aarav-weds-meera?g=abc123")).toBe(
      "https://shubhdwar.com/i/[invite]",
    );
    expect(countableUrl("https://shubhdwar.com/invites/5f1c/guests")).toBe(
      "https://shubhdwar.com/invites/[id]/guests",
    );
    expect(countableUrl("https://shubhdwar.com/join/tok-1")).toBe(
      "https://shubhdwar.com/join/[token]",
    );
    expect(countableUrl("https://shubhdwar.com/sign-in?next=%2Finvites#x")).toBe(
      "https://shubhdwar.com/sign-in",
    );
  });

  it("leave public pages as they are", () => {
    expect(countableUrl("https://shubhdwar.com/hi/designs/rose")).toBe(
      "https://shubhdwar.com/hi/designs/rose",
    );
    expect(countableUrl("/invitations/haldi")).toBe("/invitations/haldi");
  });
});
