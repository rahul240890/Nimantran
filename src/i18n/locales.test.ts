import { describe, expect, it } from "vitest";
import { homePath, pickLocale } from "./locales";

describe("picking the language", () => {
  it("follows the visitor's own choice first", () => {
    expect(pickLocale("hi", "en-IN,en;q=0.9")).toBe("hi");
    expect(pickLocale("en", "hi-IN")).toBe("en");
  });

  it("then the phone's languages, best first", () => {
    expect(pickLocale(null, "hi-IN,hi;q=0.9,en-US;q=0.8")).toBe("hi");
    expect(pickLocale(null, "en-GB,hi;q=0.5")).toBe("en");
    expect(pickLocale(null, "fr;q=0.4,hi;q=0.8")).toBe("hi");
    expect(pickLocale("xx", "ta-IN")).toBe("en");
    expect(pickLocale(undefined, "")).toBe("en");
  });

  it("puts English at / and Hindi at /hi", () => {
    expect(homePath("en")).toBe("/");
    expect(homePath("hi")).toBe("/hi");
  });
});
