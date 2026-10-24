import { describe, expect, it } from "vitest";
import { biggestDrop, funnelRows } from "./funnel-rows";

const counts = {
  visitors: 1000,
  details: 400,
  editor: 300,
  preview: 60,
  signedIn: 40,
  checkout: 12,
  paid: 6,
  published: 5,
};

describe("the admin's funnel", () => {
  it("lists every step from a visit to a published invite, as a share of visitors", () => {
    const rows = funnelRows(counts);
    expect(rows.map((row) => row.key)).toEqual([
      "visitors",
      "details",
      "editor",
      "preview",
      "signedIn",
      "checkout",
      "paid",
      "published",
    ]);
    expect(rows[1]).toMatchObject({ label: "Opened a design's page", count: 400, ofVisitors: 0.4 });
  });

  it("names the step where most people stop", () => {
    const drop = biggestDrop(funnelRows(counts));
    expect(drop?.from.key).toBe("editor");
    expect(drop?.to.key).toBe("preview");
    expect(drop?.lost).toBeCloseTo(0.8);
  });

  it("ignores steps with too few people, and later steps that outnumber earlier ones", () => {
    expect(
      biggestDrop(
        funnelRows({ ...counts, details: 1200, editor: 1200, preview: 1200, signedIn: 4 }),
      )?.from.key,
    ).toBe("preview");
    expect(biggestDrop(funnelRows({ ...counts, visitors: 0, details: 0, editor: 0 }))).toEqual(
      expect.objectContaining({ from: expect.objectContaining({ key: "signedIn" }) }),
    );
    const empty = funnelRows({
      visitors: 0,
      details: 0,
      editor: 0,
      preview: 0,
      signedIn: 0,
      checkout: 0,
      paid: 0,
      published: 0,
    });
    expect(biggestDrop(empty)).toBeNull();
    expect(empty[0]!.ofVisitors).toBe(0);
  });
});
