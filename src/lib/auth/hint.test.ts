import { describe, expect, it } from "vitest";
import { decodeAccountHint, encodeAccountHint } from "./hint";

describe("account hint cookie", () => {
  it("reads back what the server wrote, as the browser sees it", () => {
    const value = encodeURIComponent(encodeAccountHint({ name: "प्रिया शर्मा", avatarUrl: null }));
    expect(decodeAccountHint(value)).toEqual({ name: "प्रिया शर्मा", avatarUrl: null });
  });

  it("reads a damaged or foreign value as signed out", () => {
    expect(decodeAccountHint("%7Bnot-json")).toBeNull();
    expect(decodeAccountHint(encodeURIComponent('{"id":1}'))).toBeNull();
    expect(decodeAccountHint(undefined)).toBeNull();
  });
});
