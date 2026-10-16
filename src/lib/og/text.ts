import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { inflateSync } from "node:zlib";
import sharp from "sharp";

/*
 * Words on link previews in any card language. The preview is laid out by next/og, whose
 * text engine can't shape Indian scripts: Gujarati comes out as empty boxes, and a vowel
 * sign such as ि lands after its letter (किशोर reads कशिोर). So names, dates and places are
 * drawn here by sharp, whose Pango and HarfBuzz shape every script properly, and placed on
 * the preview as pictures.
 *
 * sharp loads fonts from TTF files only, and a server has no fonts of its own, so the
 * site's WOFF files are unpacked to TTF in the temp folder once per server. Every face is
 * registered with sharp, so one line can mix scripts: Latin and Devanagari in Rozha One,
 * Gujarati, Bengali and Tamil in their own faces.
 */

const root = process.cwd();

/** The faces, in the order Pango tries them for each letter. */
const FACES = [
  { file: "rozha-one/files/rozha-one-latin-400-normal.woff", family: "Rozha One" },
  { file: "rozha-one/files/rozha-one-devanagari-400-normal.woff", family: "Rozha One" },
  { file: "tenor-sans/files/tenor-sans-latin-400-normal.woff", family: "Tenor Sans" },
  {
    file: "baloo-bhai-2/files/baloo-bhai-2-gujarati-600-normal.woff",
    family: "Baloo Bhai 2 SemiBold",
  },
  { file: "baloo-da-2/files/baloo-da-2-bengali-600-normal.woff", family: "Baloo Da 2 SemiBold" },
  { file: "catamaran/files/catamaran-tamil-600-normal.woff", family: "Catamaran SemiBold" },
] as const;

const INDIC = "Baloo Bhai 2 SemiBold, Baloo Da 2 SemiBold, Catamaran SemiBold";

/** The two looks a preview's words take: the display face for names, the label face for details. */
const FAMILIES = {
  display: `Rozha One, ${INDIC}`,
  label: `Tenor Sans, Rozha One, ${INDIC}`,
} as const;

export type TextLook = keyof typeof FAMILIES;

/** WOFF 1.0 to a plain TrueType file: each table inflated, the directory rebuilt. */
export function woffToTtf(woff: Buffer): Buffer {
  if (woff.toString("ascii", 0, 4) !== "wOFF") throw new Error("not a WOFF file");
  const flavor = woff.readUInt32BE(4);
  const count = woff.readUInt16BE(12);
  const tables = Array.from({ length: count }, (_, i) => {
    const at = 44 + i * 20;
    const offset = woff.readUInt32BE(at + 4);
    const packed = woff.readUInt32BE(at + 8);
    const size = woff.readUInt32BE(at + 12);
    const body = woff.subarray(offset, offset + packed);
    return {
      tag: woff.subarray(at, at + 4),
      checksum: woff.readUInt32BE(at + 16),
      data: packed < size ? inflateSync(body) : body,
    };
  });
  let range = 1;
  let selector = 0;
  while (range * 2 <= count) {
    range *= 2;
    selector++;
  }
  const head = Buffer.alloc(12 + count * 16);
  head.writeUInt32BE(flavor, 0);
  head.writeUInt16BE(count, 4);
  head.writeUInt16BE(range * 16, 6);
  head.writeUInt16BE(selector, 8);
  head.writeUInt16BE(count * 16 - range * 16, 10);
  let offset = head.length;
  const bodies: Buffer[] = [];
  tables.forEach((table, i) => {
    const at = 12 + i * 16;
    table.tag.copy(head, at);
    head.writeUInt32BE(table.checksum, at + 4);
    head.writeUInt32BE(offset, at + 8);
    head.writeUInt32BE(table.data.length, at + 12);
    // Every table starts on a four-byte boundary
    const pad = (4 - (table.data.length % 4)) % 4;
    bodies.push(table.data, Buffer.alloc(pad));
    offset += table.data.length + pad;
  });
  return Buffer.concat([head, ...bodies]);
}

let ready: Promise<void> | null = null;

/** Unpacks and registers every face, once per server. */
function fontsReady(): Promise<void> {
  ready ??= (async () => {
    const dir = join(tmpdir(), "shubh-og-fonts");
    await mkdir(join(dir, "cache"), { recursive: true });
    // Fontconfig needs a configuration; a server may have none, and no fonts to list
    const config = join(dir, "fonts.conf");
    await writeFile(
      config,
      `<?xml version="1.0"?><fontconfig><cachedir>${join(dir, "cache")}</cachedir></fontconfig>`,
    );
    process.env.FONTCONFIG_FILE ??= config;
    for (const [i, face] of FACES.entries()) {
      const ttf = join(dir, `${i}.ttf`);
      await writeFile(
        ttf,
        woffToTtf(await readFile(join(root, "node_modules", "@fontsource", face.file))),
      );
      // Drawing once with the file registers it for every later drawing in this process
      await sharp({ text: { text: ".", font: `${face.family}, 12`, fontfile: ttf } }).toBuffer();
    }
  })().catch((error: unknown) => {
    ready = null;
    throw error;
  });
  return ready;
}

/** Text as Pango reads it: its markup characters escaped. */
const escapeMarkup = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export type TextPicture = { src: string; width: number; height: number };

/**
 * One piece of text as a transparent PNG for the preview, shaped for its script, wrapping
 * at `width` pixels. Letter spacing is in pixels, as the preview's labels use it.
 */
export async function textPicture(
  text: string,
  {
    look,
    size,
    colour,
    width,
    spacing = 0,
  }: { look: TextLook; size: number; colour: string; width: number; spacing?: number },
): Promise<TextPicture> {
  await fontsReady();
  // At 72 dots per inch a point is a pixel; Pango spaces letters in 1024ths of a point
  const markup = `<span foreground="${colour}" letter_spacing="${Math.round(spacing * 1024)}">${escapeMarkup(text)}</span>`;
  const { data, info } = await sharp({
    text: {
      text: markup,
      font: `${FAMILIES[look]}, ${size}`,
      width,
      dpi: 72,
      rgba: true,
      wrap: "word",
    },
  })
    .png()
    .toBuffer({ resolveWithObject: true });
  return {
    src: `data:image/png;base64,${data.toString("base64")}`,
    width: info.width,
    height: info.height,
  };
}
