import { describe, expect, it } from "vitest";
import { helpPath, isHelpLink, isPageLink, navHref } from "./nav-links";

describe("header links", () => {
  it("send each of the five links where it belongs, in the site's language", () => {
    expect(navHref("weddings", "en")).toBe("/invitations/wedding");
    expect(navHref("designs", "en")).toBe("/designs");
    expect(navHref("sample", "en")).toBe("/sample");
    expect(navHref("pricing", "en")).toBe("/#pricing");
    expect(navHref("help", "en")).toBe("/help/whatsapp");
    expect(navHref("weddings", "hi")).toBe("/hi/invitations/wedding");
    expect(navHref("pricing", "hi")).toBe("/hi#pricing");
    expect(navHref("help", "gu")).toBe("/help/whatsapp?lang=gu");
  });

  it("tell pages, home page sections and WhatsApp apart", () => {
    expect(["weddings", "designs", "sample"].every(isPageLink)).toBe(true);
    expect(isPageLink("pricing")).toBe(false);
    expect(isHelpLink("help")).toBe(true);
    expect(isPageLink("help")).toBe(false);
    expect(helpPath("ta")).toBe("/help/whatsapp?lang=ta");
  });
});
