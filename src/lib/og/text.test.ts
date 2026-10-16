import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { woffToTtf } = await import("./text");

const woff = (file: string) =>
  readFileSync(join(process.cwd(), "node_modules", "@fontsource", file));

describe("fonts for link previews", () => {
  it("unpacks a WOFF into a TrueType file with every table", () => {
    const source = woff("baloo-bhai-2/files/baloo-bhai-2-gujarati-600-normal.woff");
    const ttf = woffToTtf(source);
    const tables = source.readUInt16BE(12);
    expect(ttf.readUInt32BE(0)).toBe(source.readUInt32BE(4));
    expect(ttf.readUInt16BE(4)).toBe(tables);
    // Each table's recorded length matches the WOFF's original length for it
    for (let i = 0; i < tables; i++) {
      expect(ttf.readUInt32BE(12 + i * 16 + 12)).toBe(source.readUInt32BE(44 + i * 20 + 12));
    }
  });

  it("refuses a file that isn't WOFF", () => {
    expect(() => woffToTtf(Buffer.from("not a font at all, really"))).toThrow();
  });
});
