// @vitest-environment node
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { crc32, zipFiles } from "./zip";

const bytes = (text: string) => new TextEncoder().encode(text);

describe("the photo zip", () => {
  it("checksums like every other zip tool", () => {
    expect(crc32(bytes("123456789"))).toBe(0xcbf43926);
  });

  it("writes an archive that opens, with every file intact", async () => {
    const blob = zipFiles([
      { name: "photo-1.jpg", data: bytes("first"), date: new Date(2026, 11, 12, 18, 30) },
      { name: "रोहन-2.webp", data: bytes("second photo") },
    ]);
    const data = new Uint8Array(await blob.arrayBuffer());
    expect(new DataView(data.buffer).getUint32(0, true)).toBe(0x04034b50);
    const end = new DataView(data.buffer, data.byteLength - 22);
    expect(end.getUint32(0, true)).toBe(0x06054b50);
    expect(end.getUint16(10, true)).toBe(2);

    // Python's zipfile reads it back and checks each file's checksum
    const file = join(mkdtempSync(join(tmpdir(), "zip-")), "photos.zip");
    writeFileSync(file, data);
    const listed = execFileSync("python3", [
      "-c",
      "import sys, zipfile; z = zipfile.ZipFile(sys.argv[1]); assert z.testzip() is None; print('|'.join(n + '=' + z.read(n).decode() for n in z.namelist()))",
      file,
    ])
      .toString()
      .trim();
    expect(listed).toBe("photo-1.jpg=first|रोहन-2.webp=second photo");
  });
});
