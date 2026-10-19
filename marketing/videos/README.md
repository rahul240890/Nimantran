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

## Ads

Six video ads (`gate`, `maa`, `sangeet`, `price`, `pov`, `explainer`), each voiced in English and Hindi, cut to the sizes each placement needs (Reels 9:16, feed 4:5, square, YouTube 16:9), and the still images for Instagram, YouTube and Google. The plan they serve is in [docs/ADS.md](../../docs/ADS.md).

```bash
npm run setup                    # as above; also copies assets/ads (the AI photos) to public/
# with the site running (npm run build && npm start in the site's folder):
npm run record open && npm run record rsvp && npm run record joys && npm run record designs
npm run shots                    # still frames for the posters, from the recordings
npm run voice                    # speaks voice/lines.json with Kokoro, writes src/voice.json
npm run ads                      # every ad to out/ads/, sound levelled to −14 LUFS
npm run stills                   # every image to out/images/<placement>-<size>/
node tools/preview.mjs out/preview 8 ad-gate-reel-en   # a strip of frames, to check a layout
```

- **Voice:** [Kokoro](https://huggingface.co/hexgrad/Kokoro-82M) (Apache-2.0), voices `af_heart` (English) and `hf_beta` (Hindi). `pip install kokoro-onnx`, then put `onnx/model_quantized.onnx` (as `model.onnx`), `voices/af_heart.bin` and `voices/hf_beta.bin` from `onnx-community/Kokoro-82M-v1.0-ONNX` in `tools/kokoro/`. The Hindi voice says nukta sounds and some English words badly; `tools/voice.py` drops nuktas and corrects a few phonemes (`FIX`). Check new lines by ear before spending on them.
- **Timing:** each beat lasts as long as its voice line plus a breath (`src/ads/ads.ts`), so changing a line changes the cut. Captions follow the voice word by word; `*marked*` words are set in marigold.
- **Footage:** real screen recordings of `/sample/rajwada-bagh` and `/designs` (`tools/record.mjs`). Scene times in `src/ads/ads.ts` point into these recordings; re-check them if the sample changes.
- **AI photos:** the six women in `assets/ads/` were made with Canva's AI image generator. They are models only, never customers: no names, quotes or reviews attached. Every ad and image that shows one carries an "AI-generated image" mark.
- **Safe areas:** Reels and Stories keep the top 14%, the bottom 35% and 6% each side clear of words (`src/ads/formats.ts`); the YouTube banner keeps its words in the middle 1235 × 338.

## Rules the videos keep

- Only what the site does today (docs/PRODUCT.md, "Built so far"), in the site's own words where it has them.
- The brand's colours and fonts only (`src/brand.ts`, from `src/app/globals.css`).
- Sacred art is shown whole and still, with nothing written over a deity (docs/TRADITIONS.md). Pages with a deity at the top zoom about their top edge.
- Words stay clear of the bottom fifth and the right edge, where the apps put their own buttons and captions.
- Made-up families and places only; the trailer's link is the real sample, `/sample/rajwada-bagh`.

## Licence

Remotion is free for individuals and companies of up to three people; a bigger company needs a Remotion company licence (remotion.dev/license).
