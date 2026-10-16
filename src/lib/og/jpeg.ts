import "server-only";
import sharp from "sharp";

/*
 * WhatsApp shows a link's picture only when the file is small: above about 300 KB it sends the
 * message with no preview at all. A painted cover drawn as PNG comes to around 500 KB, so link
 * previews go out as JPEG, a tenth of that.
 */

/** Below WhatsApp's limit with room to spare, whatever the painting. */
export const PREVIEW_MAX_BYTES = 250_000;

/** The same picture as JPEG, keeping the original response's caching. */
export async function asJpeg(image: Response): Promise<Response> {
  const png = Buffer.from(await image.arrayBuffer());
  let quality = 82;
  let jpeg = await encode(png, quality);
  // A very detailed painting can still come out large; step down until it fits
  while (jpeg.byteLength > PREVIEW_MAX_BYTES && quality > 50) {
    quality -= 12;
    jpeg = await encode(png, quality);
  }
  const headers = new Headers(image.headers);
  headers.set("content-type", "image/jpeg");
  headers.delete("content-length");
  return new Response(new Uint8Array(jpeg), { status: image.status, headers });
}

function encode(png: Buffer, quality: number): Promise<Buffer> {
  // JPEG has no transparency: anything see-through sits on white, as WhatsApp would show it
  return sharp(png).flatten({ background: "#ffffff" }).jpeg({ quality, mozjpeg: true }).toBuffer();
}
