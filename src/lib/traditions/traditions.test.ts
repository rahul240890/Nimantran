import { describe, expect, it } from "vitest";
import { traditionCopy as en } from "@/content/editor";
import { traditionCopy as hi } from "@/content/hi/editor";
import { CATEGORIES } from "@/lib/categories/catalog";
import { isFunctionId } from "@/lib/events/functions";
import { SLOT_RULES, TEMPLATE_IDS } from "@/lib/templates/ids";
import { allowsTradition, rankTraditions, TRADITION_LIST } from "./catalog";
import { WORDING_MAX } from "./schema";

const NOT_LATIN = /[^\p{Script=Latin}\p{P}\p{N}\p{Zs}]/u;

describe.each(TRADITION_LIST)("the $id pack", (pack) => {
  it("stays a draft until two community reviewers sign off", () => {
    if (pack.status === "reviewed") expect(pack.reviewedBy.length).toBeGreaterThanOrEqual(2);
    else expect(pack.status).toBe("draft");
  });

  it("points only at designs and functions that exist", () => {
    for (const id of pack.templates) expect(TEMPLATE_IDS).toContain(id);
    for (const id of Object.keys(pack.ceremonies)) expect(isFunctionId(id)).toBe(true);
    for (const id of pack.functions) expect(isFunctionId(id)).toBe(true);
  });

  it("uses its own symbols, with the default among them", () => {
    if (pack.symbols.default) expect(pack.symbols.options).toContain(pack.symbols.default);
    expect(new Set(pack.symbols.options).size).toBe(pack.symbols.options.length);
  });

  it("writes invocations and names in their own script, and fits the card", () => {
    if (pack.invocation) {
      expect(pack.invocation.script).toMatch(NOT_LATIN);
      expect(pack.invocation.latin).not.toMatch(NOT_LATIN);
      expect(pack.invocation.script.length).toBeLessThanOrEqual(SLOT_RULES.blessing.maxLength);
      expect(pack.invocation.latin.length).toBeLessThanOrEqual(SLOT_RULES.blessing.maxLength);
      // Its meaning is explained in each site language
      expect(en.meanings[pack.invocation.latin]).toBeTruthy();
      expect(hi.meanings[pack.invocation.latin]).toBeTruthy();
    }
    for (const name of Object.values(pack.ceremonies)) {
      expect(name.native).toMatch(NOT_LATIN);
      expect(name.latin).not.toMatch(NOT_LATIN);
    }
    for (const block of Object.values(pack.wording)) {
      expect(block.title).toMatch(NOT_LATIN);
      expect(block.example.length).toBeLessThanOrEqual(WORDING_MAX);
    }
    if (pack.doors) {
      for (const word of pack.doors.native) {
        expect(word).toMatch(NOT_LATIN);
        expect(word.length).toBeLessThanOrEqual(SLOT_RULES.doorLeft.maxLength);
      }
      for (const word of pack.doors.latin) {
        expect(word).not.toMatch(NOT_LATIN);
        expect(word.length).toBeLessThanOrEqual(SLOT_RULES.doorLeft.maxLength);
      }
    }
  });

  it("is named in each site language", () => {
    expect(en.names[pack.id]).toBeTruthy();
    expect(hi.names[pack.id]).toBeTruthy();
    expect(hi.names[pack.id]).toMatch(NOT_LATIN);
  });
});

it("keeps the Modern pack free of religious symbols and invocations", () => {
  const modern = TRADITION_LIST.find((pack) => pack.community === "modern")!;
  expect(modern.invocation).toBeNull();
  expect(modern.symbols).toEqual({ default: null, options: [] });
});

it("offers traditions for the wedding journey, never for parties", () => {
  expect(allowsTradition(CATEGORIES.wedding)).toBe(true);
  expect(allowsTradition({ ...CATEGORIES.wedding, group: "parties" })).toBe(false);
  expect(allowsTradition({ ...CATEGORIES.wedding, group: "business" })).toBe(false);
});

it("lists the visitor's own traditions first", () => {
  expect(rankTraditions({ region: "TN" })[0]!.id).toBe("tamil");
  expect(rankTraditions({ region: "WB" })[0]!.id).toBe("bengali");
  expect(rankTraditions({ region: null }).map((pack) => pack.id)).toEqual(
    TRADITION_LIST.map((pack) => pack.id),
  );
});
