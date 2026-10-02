// @vitest-environment node
import { deflateRawSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { readXlsx } from "./xlsx";

/** A minimal zip: each file stored or deflated, with a central directory. */
function zip(files: Record<string, string>, deflate: boolean): Uint8Array {
  const encoder = new TextEncoder();
  const locals: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;
  for (const [name, text] of Object.entries(files)) {
    const nameBytes = encoder.encode(name);
    const raw = encoder.encode(text);
    const data = deflate ? new Uint8Array(deflateRawSync(raw)) : raw;
    const local = new Uint8Array(30 + nameBytes.length + data.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(8, deflate ? 8 : 0, true);
    lv.setUint32(18, data.length, true);
    lv.setUint32(22, raw.length, true);
    lv.setUint16(26, nameBytes.length, true);
    local.set(nameBytes, 30);
    local.set(data, 30 + nameBytes.length);
    const entry = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(entry.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(10, deflate ? 8 : 0, true);
    cv.setUint32(20, data.length, true);
    cv.setUint32(24, raw.length, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint32(42, offset, true);
    entry.set(nameBytes, 46);
    locals.push(local);
    central.push(entry);
    offset += local.length;
  }
  const centralSize = central.reduce((sum, part) => sum + part.length, 0);
  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(8, central.length, true);
  ev.setUint16(10, central.length, true);
  ev.setUint32(12, centralSize, true);
  ev.setUint32(16, offset, true);
  const out = new Uint8Array(offset + centralSize + 22);
  let at = 0;
  for (const part of [...locals, ...central, end]) {
    out.set(part, at);
    at += part.length;
  }
  return out;
}

const workbook = {
  "xl/workbook.xml":
    '<workbook xmlns:r="r"><sheets><sheet name="Guests" sheetId="1" r:id="rId3"/><sheet name="Other" sheetId="2" r:id="rId1"/></sheets></workbook>',
  "xl/_rels/workbook.xml.rels":
    '<Relationships><Relationship Id="rId1" Target="worksheets/sheet1.xml"/><Relationship Id="rId3" Target="worksheets/sheet2.xml"/></Relationships>',
  "xl/sharedStrings.xml":
    "<sst><si><t>Name</t></si><si><t>Phone</t></si><si><r><t>Sharma </t></r><r><t>&amp; family</t></r></si><si><t>दादी</t></si></sst>",
  "xl/worksheets/sheet1.xml":
    '<worksheet><sheetData><row r="1"><c r="A1" t="inlineStr"><is><t>Wrong sheet</t></is></c></row></sheetData></worksheet>',
  "xl/worksheets/sheet2.xml": `<worksheet><sheetData>
    <row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1" t="s"><v>1</v></c></row>
    <row r="2"><c r="A2" t="s"><v>2</v></c><c r="B2"><v>9.87654321E9</v></c></row>
    <row r="4"><c r="A4" t="s"><v>3</v></c><c r="C4" t="inlineStr"><is><t>Note</t></is></c></row>
    <row r="5"/>
  </sheetData></worksheet>`,
};

describe("reading an Excel sheet", () => {
  for (const deflate of [false, true]) {
    it(`reads the first sheet's cells (${deflate ? "compressed" : "stored"})`, async () => {
      expect(await readXlsx(zip(workbook, deflate))).toEqual([
        ["Name", "Phone"],
        ["Sharma & family", "9876543210"],
        [],
        ["दादी", "", "Note"],
        [],
      ]);
    });
  }

  it("refuses a file that isn't a workbook", async () => {
    await expect(readXlsx(new TextEncoder().encode("Name,Phone\nDadi,1"))).rejects.toThrow();
  });
});
