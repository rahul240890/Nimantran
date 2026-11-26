#!/usr/bin/env node
/*
 * Sends the live site's changed pages to IndexNow (src/lib/seo/indexnow.ts) after a production
 * deploy. By default it sends blog posts updated in the last few days; with --all it sends every
 * address in the sitemap, for after a change that touches many pages (titles, occasion pages).
 *
 *   node scripts/indexnow.mjs https://www.shubhinvitations.com [--all] [--days=3]
 */

const KEY = "45ee731174a20f128b1ba8fda783dadb";
const [siteArg, ...flags] = process.argv.slice(2);
if (!siteArg) {
  console.error("Usage: node scripts/indexnow.mjs <site url> [--all] [--days=3]");
  process.exit(1);
}
const site = new URL(siteArg);
const all = flags.includes("--all");
const days = Number(flags.find((flag) => flag.startsWith("--days="))?.slice(7) ?? 3);

const xml = await (await fetch(new URL("/sitemap.xml", site))).text();
const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, body]) => ({
  loc: body.match(/<loc>([^<]+)<\/loc>/)?.[1],
  lastmod: body.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
}));
const since = Date.now() - days * 24 * 60 * 60 * 1000;
const urls = entries
  .filter((entry) => entry.loc && (all || (entry.lastmod && Date.parse(entry.lastmod) >= since)))
  .map((entry) => entry.loc.replaceAll("&amp;", "&"));

if (urls.length === 0) {
  console.log("Nothing changed recently; no IndexNow ping sent.");
  process.exit(0);
}
const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: site.host,
    key: KEY,
    keyLocation: new URL(`/${KEY}.txt`, site).toString(),
    urlList: urls.slice(0, 10000),
  }),
});
console.log(`IndexNow: sent ${urls.length} addresses, answer ${response.status}.`);
if (!response.ok && response.status !== 202) process.exit(1);
