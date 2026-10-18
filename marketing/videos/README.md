# Shubh marketing videos

Short vertical videos for Instagram Reels, YouTube Shorts and the WhatsApp channel, made with [Remotion](https://www.remotion.dev) (React, rendered frame by frame to MP4). They use the site's own paintings, gates, logo, fonts and raga music, so every video looks and sounds like the invitations. This folder is its own project: the site's build, checks and tests leave it alone.

Captions, hashtags and when to post: [POSTING.md](POSTING.md).

## Make the videos

```bash
npm install          # in the site's folder first, then here
npm run setup        # copies the art and fonts from the site, records the ragas
npm run studio       # preview and scrub every video in the browser
npm run render       # renders all of them to out/
node render.mjs dotd-tanjore-hi   # or just one
```

`npm run setup` records music with the site's raga engine (`src/lib/engine/music-render.ts`) in a headless browser. Set `CHROMIUM_PATH` to use a Chromium already on the machine.

## The series

| Video                                                                           | Composition ids                        | Length  |
| ------------------------------------------------------------------------------- | -------------------------------------- | ------- |
| Meet Shubh (trailer)                                                            | `meet-shubh-en`, `meet-shubh-hi`       | 33 s    |
| Design of the day: one design's gate, cover, function pages and where to try it | `dotd-<design>-en`, `dotd-<design>-hi` | 21–24 s |

Design of the day so far: Rajwada Bagh (Rajasthani), Kutch Toran (Gujarati), Tanjore (Tamil). To add one, give it an entry in `src/designs.ts` (its gate and hole from `PAINTED_GATES` in `src/lib/opening/catalog.ts`, its raga from its template, made-up names, and each page's function, time and place), add its folder to `STORIES` and its raga to `RAGAS` in `tools/setup.mjs`, and run `npm run setup`.

## Rules the videos keep

- Only what the site does today (docs/PRODUCT.md, "Built so far"), in the site's own words where it has them.
- The brand's colours and fonts only (`src/brand.ts`, from `src/app/globals.css`).
- Sacred art is shown whole and still, with nothing written over a deity (docs/TRADITIONS.md). Pages with a deity at the top zoom about their top edge.
- Words stay clear of the bottom fifth and the right edge, where the apps put their own buttons and captions.
- Made-up families and places only; the trailer's link is the real sample, `/sample/rajwada-bagh`.

## Licence

Remotion is free for individuals and companies of up to three people; a bigger company needs a Remotion company licence (remotion.dev/license).
