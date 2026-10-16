import { describe, expect, it } from "vitest";
import { PREFIXED_LOCALES, homePath, pickLocale } from "./locales";

describe("picking the language", () => {
  it("follows the visitor's own choice first", () => {
    expect(pickLocale("hi", "en-IN,en;q=0.9")).toBe("hi");
    expect(pickLocale("en", "hi-IN")).toBe("en");
  });

  it("then the phone's languages, best first", () => {
    expect(pickLocale(null, "hi-IN,hi;q=0.9,en-US;q=0.8")).toBe("hi");
    expect(pickLocale(null, "en-GB,hi;q=0.5")).toBe("en");
    expect(pickLocale(null, "fr;q=0.4,hi;q=0.8")).toBe("hi");
    // A Tamil phone reads Tamil; a language the site doesn't speak yet reads English
    expect(pickLocale("xx", "ta-IN")).toBe("ta");
    expect(pickLocale(null, "mr-IN,hi;q=0.8")).toBe("mr");
    expect(pickLocale(null, "te-IN")).toBe("en");
    expect(pickLocale(undefined, "")).toBe("en");
  });

  it("puts English at / and every other language under its own prefix", () => {
    expect(homePath("en")).toBe("/");
    expect(homePath("hi")).toBe("/hi");
    expect(homePath("gu")).toBe("/gu");
    expect(PREFIXED_LOCALES).toEqual(["hi", "mr", "gu", "bn", "ta"]);
  });
});
