import { describe, expect, it } from "vitest";
import {
  inviteUrl,
  mapsUrl,
  personalUrl,
  supportWhatsAppUrl,
  whatsappShareUrl,
  whatsappToUrl,
} from "./links";

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
    expect(inviteUrl("https://shubhinvitations.com/", "a-weds-b")).toBe(
      "https://shubhinvitations.com/i/a-weds-b",
    );
  });

  it("sends to one guest's WhatsApp, or lets the host pick a chat", () => {
    const url = new URL(whatsappToUrl("+919876543210", "Hello"));
    expect(url.pathname).toBe("/919876543210");
    expect(url.searchParams.get("text")).toBe("Hello");
    expect(new URL(whatsappToUrl(null, "Hi")).pathname).toBe("/");
    expect(personalUrl("https://x.in/i/a", "abc")).toBe("https://x.in/i/a?g=abc");
  });
});

describe("support on WhatsApp", () => {
  it("adds India's code to a ten-digit number and keeps one given in full", () => {
    expect(supportWhatsAppUrl("98765 43210", "Hi")).toBe("https://wa.me/919876543210?text=Hi");
    expect(supportWhatsAppUrl("+91 98765-43210", "Hi")).toBe("https://wa.me/919876543210?text=Hi");
    expect(supportWhatsAppUrl("098765 43210", "Hi")).toBe("https://wa.me/919876543210?text=Hi");
  });

  it("gives nothing without a usable number", () => {
    expect(supportWhatsAppUrl("", "Hi")).toBeNull();
    expect(supportWhatsAppUrl("12345", "Hi")).toBeNull();
  });
});
