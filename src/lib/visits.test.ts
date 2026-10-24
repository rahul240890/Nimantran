import { describe, expect, it } from "vitest";
import { campaignSource, isBot, readAgent, referrerHost, uncounted, visitPath } from "./visits";

const ANDROID =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36";
const IPAD =
  "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const WINDOWS_EDGE =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36 Edg/129.0";

describe("visits", () => {
  it("tell people from bots and link previews", () => {
    expect(isBot(ANDROID)).toBe(false);
    expect(isBot("Mozilla/5.0 (compatible; Googlebot/2.1)")).toBe(true);
    expect(isBot("WhatsApp/2.23.20.0")).toBe(true);
    expect(isBot(null)).toBe(true);
  });

  it("read the kind of device, browser and system", () => {
    expect(readAgent(ANDROID)).toEqual({ device: "mobile", browser: "Chrome", os: "Android" });
    expect(readAgent(IPAD)).toEqual({ device: "tablet", browser: "Safari", os: "iOS" });
    expect(readAgent(WINDOWS_EDGE)).toEqual({ device: "desktop", browser: "Edge", os: "Windows" });
  });

  it("count only this site's pages, with invitations hidden", () => {
    expect(visitPath("/i/aarav-weds-meera")).toBe("/i/[invite]");
    expect(visitPath("/designs?q=rose")).toBe("/designs");
    expect(visitPath("https://elsewhere.example/")).toBeNull();
    expect(visitPath("//elsewhere.example/")).toBeNull();
    expect(uncounted("/admin/visitors")).toBe(true);
    expect(uncounted("/administrator-tips")).toBe(false);
  });

  it("keep only the name of the site that sent a visitor", () => {
    expect(referrerHost("https://www.google.com/search?q=x", "shubhinvitation.com")).toBe(
      "google.com",
    );
    expect(referrerHost("https://shubhinvitation.com/designs", "www.shubhinvitation.com")).toBe(
      null,
    );
    expect(referrerHost("not a url", null)).toBeNull();
    expect(campaignSource("Instagram Story!")).toBe("instagramstory");
    expect(campaignSource("")).toBeNull();
  });
});

describe("funnel steps", () => {
  it("are only the steps the site counts, with catalogue ids only", async () => {
    const { catalogId, isStepKey } = await import("./visits");
    expect(isStepKey("preview")).toBe(true);
    expect(isStepKey("hacked")).toBe(false);
    expect(isStepKey(7)).toBe(false);
    expect(catalogId("rajwada-bagh")).toBe("rajwada-bagh");
    expect(catalogId("Priya & Aditya")).toBeNull();
    expect(catalogId("a".repeat(61))).toBeNull();
  });
});
