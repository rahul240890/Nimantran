import { describe, expect, it } from "vitest";
import { inviteUrl, mapsUrl, whatsappShareUrl } from "./links";

describe("links", () => {
  it("prefills WhatsApp with the whole message", () => {
    const url = new URL(whatsappShareUrl("You're invited! https://x.in/i/a-weds-b"));
    expect(url.origin).toBe("https://wa.me");
    expect(url.searchParams.get("text")).toBe("You're invited! https://x.in/i/a-weds-b");
  });

  it("searches maps for the venue and address together", () => {
    const url = new URL(mapsUrl("The Leela Palace", " Lake Pichola, Udaipur "));
    expect(url.searchParams.get("query")).toBe("The Leela Palace, Lake Pichola, Udaipur");
    expect(new URL(mapsUrl("Home", "")).searchParams.get("query")).toBe("Home");
  });

  it("builds the guest link", () => {
    expect(inviteUrl("https://shubhdwar.com/", "a-weds-b")).toBe(
      "https://shubhdwar.com/i/a-weds-b",
    );
  });
});
