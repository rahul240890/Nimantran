import { describe, expect, it } from "vitest";
import { helpPath, isHelpLink, navHref } from "./nav-links";

describe("footer links", () => {
  it("send each link where it belongs, in the site's language", () => {
    expect(navHref("designs", "en")).toBe("/designs");
    expect(navHref("sample", "en")).toBe("/sample");
    expect(navHref("pricing", "en")).toBe("/pricing");
    expect(navHref("help", "en")).toBe("/help/whatsapp");
    expect(navHref("pricing", "hi")).toBe("/hi/pricing");
    expect(navHref("help", "gu")).toBe("/help/whatsapp?lang=gu");
    expect(isHelpLink("help")).toBe(true);
    expect(isHelpLink("pricing")).toBe(false);
  });

  it("ask for help, or for us to make the invitation, in the visitor's language", () => {
    expect(helpPath("ta")).toBe("/help/whatsapp?lang=ta");
    expect(helpPath("en", "make")).toBe("/help/whatsapp?for=make");
    expect(helpPath("hi", "make")).toBe("/help/whatsapp?lang=hi&for=make");
    expect(helpPath("en", "make", "rajwada-bagh")).toBe(
      "/help/whatsapp?for=make&design=rajwada-bagh",
    );
  });
});
