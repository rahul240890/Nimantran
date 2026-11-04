import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { englishInitial, PRELUDES, pickPrelude } from "./preludes";

describe("englishInitial", () => {
  it("takes an English name's first letter", () => {
    expect(englishInitial("nita")).toBe("N");
    expect(englishInitial("  Rahul Keshwala")).toBe("R");
  });

  it("prefers a spelling in English letters over the card's script", () => {
    expect(englishInitial("राहुल", "Rahul")).toBe("R");
  });

  it("spells a name in an Indian script in English letters", () => {
    expect(englishInitial("राहुल")).toBe("R");
    expect(englishInitial("நீதா")).toBe("N");
  });

  it("gives nothing for no name", () => {
    expect(englishInitial(undefined, "")).toBe("");
  });
});

describe("pickPrelude", () => {
  const store = new Map<string, string>();
  beforeEach(() => {
    store.clear();
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => store.set(key, value),
      },
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("shows every prelude once before any comes back", () => {
    const seen = new Set(PRELUDES.map(() => pickPrelude("hindu")));
    expect(seen.size).toBe(PRELUDES.length);
  });

  it("never starts a new round with the one just seen", () => {
    // Nothing seen yet: the first pick may be any of them
    let last: string | null = null;
    for (let i = 0; i < 40; i++) {
      const next = pickPrelude("hindu");
      expect(next).not.toBe(last);
      last = next;
    }
  });

  it("never ties the kalava for a Muslim card", () => {
    for (let i = 0; i < 30; i++) expect(pickPrelude("muslim")).not.toBe("thread");
  });
});
