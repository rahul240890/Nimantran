import type { UiLocale } from "@/i18n/locales";
import type { CategoryId } from "@/lib/categories/catalog";

/*
 * The public sample videos: the video Shubh makes, for a design's made-up sample invite, so
 * search can show families what one looks like (docs/BLOG.md, "Videos"). Each is made by
 * scripts/sample-videos.mjs into public/videos/<id>.mp4 with a poster at <id>.jpg, and has a
 * watch page at /videos/<id> in its own language's address. Add one here, run the script, and
 * the page, the sitemap's video entry and the occasion page's video all follow.
 */

export type SampleVideo = {
  id: string;
  /** The design whose sample it films (src/lib/gallery/catalog.ts). */
  design: string;
  /** The site language it is filmed in, which is also its page's language. */
  lang: UiLocale;
  occasion: CategoryId;
  /** Its length in seconds, from the script's output. */
  seconds: number;
};

export const SAMPLE_VIDEOS: readonly SampleVideo[] = [
  {
    id: "rajwada-bagh-wedding",
    design: "rajwada-bagh",
    lang: "en",
    occasion: "wedding",
    seconds: 60,
  },
  {
    id: "rajwada-bagh-shaadi",
    design: "rajwada-bagh",
    lang: "hi",
    occasion: "wedding",
    seconds: 60,
  },
  {
    id: "shahi-savari-wedding",
    design: "shahi-savari",
    lang: "en",
    occasion: "wedding",
    seconds: 60,
  },
  {
    id: "noor-bagh-wedding",
    design: "noor-bagh",
    lang: "en",
    occasion: "wedding",
    seconds: 60,
  },
  {
    id: "gulaab-shaadi",
    design: "gulaab",
    lang: "hi",
    occasion: "wedding",
    seconds: 60,
  },
  {
    id: "kutch-toran-lagna",
    design: "kutch-toran",
    lang: "gu",
    occasion: "wedding",
    seconds: 60,
  },
  {
    id: "peshwai-wada-lagna",
    design: "peshwai-wada",
    lang: "mr",
    occasion: "wedding",
    seconds: 60,
  },
  {
    id: "rajbari-biye",
    design: "rajbari",
    lang: "bn",
    occasion: "wedding",
    seconds: 59,
  },
  {
    id: "kayal-thirumanam",
    design: "kayal",
    lang: "ta",
    occasion: "wedding",
    seconds: 60,
  },
  {
    id: "griha-kalash-housewarming",
    design: "griha-kalash-scene",
    lang: "en",
    occasion: "housewarming",
    seconds: 39,
  },
  {
    id: "griha-kalash-griha-pravesh",
    design: "griha-kalash-scene",
    lang: "hi",
    occasion: "housewarming",
    seconds: 39,
  },
  {
    id: "pehla-janamdin-birthday",
    design: "pehla-janamdin-scene",
    lang: "en",
    occasion: "birthday",
    seconds: 42,
  },
  {
    id: "lohri-bonfire-lohri",
    design: "lohri-bonfire-scene",
    lang: "en",
    occasion: "lohri",
    seconds: 38,
  },
  {
    id: "uttarayan-kites-uttarayan",
    design: "uttarayan-kites-scene",
    lang: "gu",
    occasion: "sankranti",
    seconds: 42,
  },
  {
    id: "pongal-paanai-pongal",
    design: "pongal-paanai-scene",
    lang: "ta",
    occasion: "sankranti",
    seconds: 39,
  },
  {
    id: "annaprashan-mukhe-bhaat",
    design: "annaprashan-scene",
    lang: "bn",
    occasion: "annaprashan",
    seconds: 42,
  },
];
