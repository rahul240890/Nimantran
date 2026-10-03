/*
 * Reading the first sheet of an Excel workbook (.xlsx) in the browser, for importing a
 * guest list. An .xlsx file is a zip of XML files; the browser's own DecompressionStream
 * unzips it, so no spreadsheet library ships to every host. Values come back as text,
 * the way they show in the sheet's cells (numbers without Excel's formatting).
 */

type ZipEntry = { name: string; method: number; offset: number; size: number };

const decoder = new TextDecoder();

function zipEntries(bytes: Uint8Array): ZipEntry[] {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  // The end-of-directory record sits in the last 22 bytes, plus up to 64 KB of comment
  let end = -1;
  for (let at = bytes.length - 22; at >= Math.max(0, bytes.length - 22 - 65535); at -= 1) {
    if (view.getUint32(at, true) === 0x06054b50) {
      end = at;
      break;
    }
  }
  if (end < 0) throw new Error("not a zip");
  const count = view.getUint16(end + 10, true);
  let at = view.getUint32(end + 16, true);
  const entries: ZipEntry[] = [];
  for (let index = 0; index < count; index += 1) {
    if (view.getUint32(at, true) !== 0x02014b50) throw new Error("bad zip directory");
    const method = view.getUint16(at + 10, true);
    const size = view.getUint32(at + 20, true);
    const nameLength = view.getUint16(at + 28, true);
    const extraLength = view.getUint16(at + 30, true);
    const commentLength = view.getUint16(at + 32, true);
    const offset = view.getUint32(at + 42, true);
    const name = decoder.decode(bytes.subarray(at + 46, at + 46 + nameLength));
    entries.push({ name, method, offset, size });
    at += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}

async function readEntry(bytes: Uint8Array, entry: ZipEntry): Promise<string> {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (view.getUint32(entry.offset, true) !== 0x04034b50) throw new Error("bad zip entry");
  const start =
    entry.offset +
    30 +
    view.getUint16(entry.offset + 26, true) +
    view.getUint16(entry.offset + 28, true);
  const data = bytes.slice(start, start + entry.size);
  if (entry.method === 0) return decoder.decode(data);
  if (entry.method !== 8) throw new Error("unsupported zip method");
  const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Response(stream).text();
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };

function unescapeXml(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (whole, code: string) => {
    if (code[0] === "#") {
      const point =
        code[1] === "x" || code[1] === "X" ? parseInt(code.slice(2), 16) : Number(code.slice(1));
      return Number.isFinite(point) ? String.fromCodePoint(point) : whole;
    }
    return ENTITIES[code] ?? whole;
  });
}

/** All the text runs inside an element, joined (rich text keeps each run in its own <t>). */
function textOf(xml: string): string {
  let text = "";
  for (const match of xml.matchAll(/<(?:\w+:)?t(?:\s[^>]*)?>([^<]*)<\/(?:\w+:)?t>/g)) {
    text += match[1];
  }
  return unescapeXml(text);
}

const attr = (tag: string, name: string) =>
  new RegExp(`\\s${name}="([^"]*)"`).exec(tag)?.[1] ?? null;

/** "C12" to column index 2. */
function columnIndex(ref: string): number {
  let index = 0;
  for (const char of ref.replace(/\d+$/, "").toUpperCase()) {
    index = index * 26 + (char.charCodeAt(0) - 64);
  }
  return index - 1;
}

/** Excel writes long numbers like phone numbers as 9.1987654321E11 at times. */
function plainNumber(value: string): string {
  if (!/e/i.test(value)) return value;
  const number = Number(value);
  return Number.isFinite(number) && Number.isInteger(number) ? number.toFixed(0) : value;
}

function sheetPath(workbook: string, rels: string, names: string[]): string | null {
  const first = /<(?:\w+:)?sheet\s[^>]*>/.exec(workbook)?.[0];
  const relId = first ? /\sr:id="([^"]*)"/.exec(first)?.[1] : null;
  if (relId) {
    for (const match of rels.matchAll(/<Relationship\s[^>]*>/g)) {
      if (attr(match[0], "Id") !== relId) continue;
      const target = attr(match[0], "Target") ?? "";
      const path = target.startsWith("/") ? target.slice(1) : `xl/${target}`;
      if (names.includes(path)) return path;
    }
  }
  return names.filter((name) => /^xl\/worksheets\/[^/]+\.xml$/.test(name)).sort()[0] ?? null;
}

/** The first sheet's rows as text cells. Throws when the file isn't a readable workbook. */
export async function readXlsx(data: ArrayBuffer | Uint8Array): Promise<string[][]> {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  const entries = zipEntries(bytes);
  const byName = new Map(entries.map((entry) => [entry.name, entry]));
  const read = (name: string) => {
    const entry = byName.get(name);
    return entry ? readEntry(bytes, entry) : Promise.resolve("");
  };
  const [workbook, rels, sharedXml] = await Promise.all([
    read("xl/workbook.xml"),
    read("xl/_rels/workbook.xml.rels"),
    read("xl/sharedStrings.xml"),
  ]);
  const path = sheetPath(workbook, rels, [...byName.keys()]);
  if (!path) throw new Error("no sheet");
  const sheet = await read(path);

  const shared = [...sharedXml.matchAll(/<(?:\w+:)?si>([\s\S]*?)<\/(?:\w+:)?si>/g)].map((m) =>
    textOf(m[1]!),
  );

  const rows: string[][] = [];
  for (const rowMatch of sheet.matchAll(
    /<(?:\w+:)?row\b[^>]*?(?:\/>|>([\s\S]*?)<\/(?:\w+:)?row>)/g,
  )) {
    const rowNumber = Number(attr(rowMatch[0], "r")) || rows.length + 1;
    const cells: string[] = [];
    let next = 0;
    for (const cellMatch of (rowMatch[1] ?? "").matchAll(
      /<(?:\w+:)?c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/(?:\w+:)?c>)/g,
    )) {
      const tag = ` ${cellMatch[1]}`;
      const ref = attr(tag, "r");
      const index = ref ? columnIndex(ref) : next;
      next = index + 1;
      const inner = cellMatch[2] ?? "";
      const type = attr(tag, "t");
      const raw = /<(?:\w+:)?v>([^<]*)<\/(?:\w+:)?v>/.exec(inner)?.[1];
      let value = "";
      if (type === "s") value = shared[Number(raw)] ?? "";
      else if (type === "inlineStr") value = textOf(inner);
      else if (raw !== undefined)
        value = type === "n" || !type ? plainNumber(raw) : unescapeXml(raw);
      cells[index] = value.trim();
    }
    // Keep the sheet's row numbers, so blank rows stay blank rather than closing up
    while (rows.length < rowNumber - 1) rows.push([]);
    rows.push(Array.from(cells, (cell) => cell ?? ""));
  }
  return rows;
}
