/*
 * Copies the theme paintings to Cloudflare R2 and leaves them out of the Vercel deployment
 * (owner, 2026-11-20: Vercel bills every deployment for the ~600 MB it carries; R2 keeps one
 * copy and charges nothing for downloads). Runs before every build (package.json "build"):
 *
 * - Without NEXT_PUBLIC_MEDIA_URL it does nothing, so local work, tests and CI are unchanged.
 * - With it, every file in public/suites, public/openings and public/cards that R2 lacks, or
 *   holds a different copy of, is uploaded. Nothing is ever deleted from R2: older deployments
 *   (and a rollback to one) still show their paintings.
 * - It then checks a painting can be read at the public address, with CORS for the video
 *   maker, and fails the build if not, so the live site stays on its last good deployment.
 * - On Vercel only, it then removes those folders from the build, all but each theme's
 *   preview.jpg, which the link previews read from disk (src/lib/og/cover.tsx).
 *
 * The first upload can also be run from a computer with the same settings:
 *   NEXT_PUBLIC_MEDIA_URL=… R2_ACCOUNT_ID=… R2_BUCKET=… R2_ACCESS_KEY_ID=… \
 *   R2_SECRET_ACCESS_KEY=… node scripts/media-sync.mjs
 * Setup steps: docs/MEDIA.md.
 */
import { createHash } from "node:crypto";
import { readdir, readFile, rm, writeFile } from "node:fs/promises";
import { extname, join, relative, sep } from "node:path";
import { AwsClient } from "aws4fetch";

/** Must match MEDIA_FOLDERS in src/lib/media.ts. */
const FOLDERS = ["suites", "openings", "cards", "videos"];
const PUBLIC = join(process.cwd(), "public");
const CACHE_CONTROL = "public, max-age=86400, stale-while-revalidate=604800";
const AT_ONCE = 16;
const TYPES = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".m4a": "audio/mp4",
};

/** Kept in the deployment: the link previews read these from disk. */
const keepOnDisk = (key) => /^suites\/[^/]+\/preview\.jpg$/.test(key);

function fail(message) {
  console.error(`media-sync: ${message}`);
  process.exit(1);
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name);
      return entry.isDirectory() ? walk(path) : entry.isFile() ? [path] : [];
    }),
  );
  return files.flat();
}

/** Every R2 object under the prefix, as key → ETag (the MD5 of a single-part upload). */
async function listBucket(r2, endpoint, prefix) {
  const found = new Map();
  let token = "";
  do {
    const url = new URL(endpoint);
    url.searchParams.set("list-type", "2");
    url.searchParams.set("prefix", prefix);
    if (token) url.searchParams.set("continuation-token", token);
    const response = await r2.fetch(url);
    if (!response.ok) fail(`listing ${prefix} failed: ${response.status} ${await response.text()}`);
    const xml = await response.text();
    for (const [, body] of xml.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g)) {
      const key = body.match(/<Key>([\s\S]*?)<\/Key>/)?.[1];
      const etag = body.match(/<ETag>([\s\S]*?)<\/ETag>/)?.[1];
      if (key) found.set(decodeXml(key), decodeXml(etag ?? "").replaceAll('"', ""));
    }
    token = /<IsTruncated>true<\/IsTruncated>/.test(xml)
      ? decodeXml(
          xml.match(/<NextContinuationToken>([\s\S]*?)<\/NextContinuationToken>/)?.[1] ?? "",
        )
      : "";
  } while (token);
  return found;
}

function decodeXml(text) {
  return text
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}

async function upload(r2, endpoint, key, body) {
  const url = `${endpoint}/${key.split("/").map(encodeURIComponent).join("/")}`;
  for (let attempt = 1; ; attempt++) {
    const response = await r2
      .fetch(url, {
        method: "PUT",
        body,
        headers: {
          "Content-Type": TYPES[extname(key).toLowerCase()] ?? "application/octet-stream",
          "Cache-Control": CACHE_CONTROL,
        },
      })
      .catch((error) => ({ ok: false, status: String(error) }));
    if (response.ok) return;
    if (attempt === 3) fail(`uploading ${key} failed: ${response.status}`);
    await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
  }
}

/** A painting must come back from the public address, readable by the site's own pages. */
async function checkPublic(base, key, origin) {
  const response = await fetch(`${base}/${key}`, { headers: { Origin: origin } }).catch(
    (error) => ({ ok: false, status: String(error), headers: new Headers() }),
  );
  if (!response.ok) {
    fail(`${base}/${key} answered ${response.status}; is the bucket's public address set up?`);
  }
  if (!response.headers.get("access-control-allow-origin")) {
    fail(`${base}/${key} has no CORS header; add the bucket's CORS rule (docs/MEDIA.md).`);
  }
}

const base = process.env.NEXT_PUBLIC_MEDIA_URL?.trim().replace(/\/+$/, "");
if (!base) {
  console.log("media-sync: NEXT_PUBLIC_MEDIA_URL isn't set; paintings are served from public/.");
  process.exit(0);
}

const { R2_ACCOUNT_ID, R2_BUCKET, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env;
if (!R2_ACCOUNT_ID || !R2_BUCKET || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  fail(
    "NEXT_PUBLIC_MEDIA_URL is set, but R2_ACCOUNT_ID, R2_BUCKET, R2_ACCESS_KEY_ID or " +
      "R2_SECRET_ACCESS_KEY is missing, so the paintings can't be copied to R2.",
  );
}

const r2 = new AwsClient({
  accessKeyId: R2_ACCESS_KEY_ID,
  secretAccessKey: R2_SECRET_ACCESS_KEY,
  service: "s3",
  region: "auto",
});
// R2_ENDPOINT only for trying the script against a stand-in
const endpoint = `${process.env.R2_ENDPOINT ?? `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`}/${R2_BUCKET}`;

const files = (await Promise.all(FOLDERS.map((folder) => walk(join(PUBLIC, folder))))).flat();
if (files.length === 0) fail("no paintings found in public/; nothing to copy.");
const toKey = (path) => relative(PUBLIC, path).split(sep).join("/");

const remote = new Map();
for (const folder of FOLDERS) {
  for (const [key, etag] of await listBucket(r2, endpoint, `${folder}/`)) remote.set(key, etag);
}

let uploaded = 0;
const queue = [...files];
await Promise.all(
  Array.from({ length: AT_ONCE }, async () => {
    for (let path = queue.shift(); path; path = queue.shift()) {
      const key = toKey(path);
      const body = await readFile(path);
      const md5 = createHash("md5").update(body).digest("hex");
      if (remote.get(key) === md5) continue;
      await upload(r2, endpoint, key, body);
      uploaded++;
    }
  }),
);
console.log(`media-sync: ${files.length} paintings on R2, ${uploaded} uploaded this time.`);

const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://shubhinvitations.com";
const sample = files.map(toKey).filter((key) => !keepOnDisk(key));
for (const key of [sample[0], sample[Math.floor(sample.length / 2)], sample.at(-1)]) {
  await checkPublic(base, key, origin);
}

// next.config.ts refuses a build with the media host set that didn't come through here
await writeFile(join(process.cwd(), ".media-synced"), `${base}\n`);

if (process.env.VERCEL) {
  const leave = files.filter((path) => !keepOnDisk(toKey(path)));
  await Promise.all(leave.map((path) => rm(path)));
  console.log(`media-sync: left ${leave.length} paintings out of the deployment.`);
}
