import { site } from "@/lib/site";

/*
 * IndexNow (indexnow.org): tells Bing, Yandex, Seznam and Naver the moment a page is added or
 * changed, instead of waiting for their crawlers. Bing's index feeds ChatGPT search and
 * Copilot, so a new post can be found by answer engines within hours. The key is public by
 * design: search engines check it at /<key>.txt to confirm the site sent the ping.
 */

export const INDEXNOW_KEY = "45ee731174a20f128b1ba8fda783dadb";

const ENDPOINT = "https://api.indexnow.org/indexnow";

/** Sends the given site paths or addresses to IndexNow. Only the live site pings; failures are ignored. */
export async function submitToIndexNow(paths: readonly string[]): Promise<void> {
  if (process.env.VERCEL_ENV !== "production" || paths.length === 0) return;
  const base = new URL(site.url);
  try {
    await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: base.host,
        key: INDEXNOW_KEY,
        keyLocation: new URL(`/${INDEXNOW_KEY}.txt`, base).toString(),
        urlList: paths.map((path) => new URL(path, base).toString()),
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // A missed ping only means the search engine finds the page on its next crawl.
  }
}
