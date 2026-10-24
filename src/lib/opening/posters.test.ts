import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import SHEET from "./gate-posters.json";
import { GATE_SHEET, gatePoster } from "./posters";
import { POSTER_GATES } from "./poster-gates";

describe("gate pictures", () => {
  it("are made for every painted gate (npx tsx scripts/gate-posters.ts after adding one)", () => {
    expect(SHEET.gates).toEqual([...POSTER_GATES]);
    expect(existsSync(join(process.cwd(), "public", GATE_SHEET))).toBe(true);
    for (const gate of POSTER_GATES) {
      const poster = gatePoster(gate);
      expect(poster, gate).not.toBeNull();
      expect(existsSync(join(process.cwd(), "public", poster!.src)), gate).toBe(true);
    }
  });

  it("leave the gates drawn on the page to draw themselves", () => {
    expect(gatePoster("palace")).toBeNull();
    expect(gatePoster("curtain")).toBeNull();
  });
});
