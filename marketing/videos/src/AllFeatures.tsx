import type { ReactNode } from "react";
import {
  AbsoluteFill,
  Html5Audio,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { color, font } from "./brand";
import type { Lang, Words } from "./designs";
import { BRAND_WORDS, EndCard } from "./parts/brand";
import { clamp, musicVolume } from "./parts/motion";
import { Backdrop, Bare, DEMOS, Sparkles, type FeatureId } from "./Features";

/*
 * Every feature at once (9:16): an odd hook line, then one feature every 1.2 seconds, each a
 * slice of its feature reel's own animation under a two- or three-word line, then the price
 * and the closing card. Two lengths: 15 seconds for Reels and video ads, and a 6-second
 * bumper for Google's non-skippable bumper ads. Three hooks, so ads can test which one wins.
 */

export const HOOKS = ["sings", "mummy", "alive"] as const;
export type Hook = (typeof HOOKS)[number];
export type AllFeaturesProps = { lang: Lang; hook: Hook; bumper?: boolean };

const HOOK_WORDS: Record<Hook, Words> = {
  sings: { en: "A wedding card...\nthat sings?", hi: "शादी का कार्ड...\nजो गाना भी गाए?" },
  mummy: { en: "Mummy said:\ndon't send a PDF.", hi: "मम्मी ने कहा:\nPDF मत भेजना।" },
  alive: {
    en: "This card opens,\nsings,\nand collects the replies.",
    hi: "ये कार्ड खुलता है,\nगाता है,\nऔर जवाब भी लेता है।",
  },
};

type Beat = { feature: FeatureId; at: number; words: Words; background: string };

/** Each beat: which reel, from which of its frames, and the line over it. */
const BEATS: Beat[] = [
  {
    feature: "memories",
    at: 44,
    words: { en: "Your music", hi: "आपका संगीत" },
    background: "suites/rajwada-bagh/sangeet.webp",
  },
  {
    feature: "language",
    at: 118,
    words: { en: "Your language", hi: "आपकी भाषा" },
    background: "suites/rajwada-bagh/cover.webp",
  },
  {
    feature: "memories",
    at: 190,
    words: { en: "Your photos, your memories", hi: "आपकी तस्वीरें, आपकी यादें" },
    background: "suites/rajwada-bagh/sangeet.webp",
  },
  {
    feature: "guest-names",
    at: 98,
    words: { en: "Every guest by name", hi: "हर मेहमान का नाम" },
    background: "suites/tanjore/wedding.webp",
  },
  {
    feature: "one-link",
    at: 110,
    words: { en: "One link", hi: "बस एक लिंक" },
    background: "suites/tanjore/cover.webp",
  },
  {
    feature: "website",
    at: 100,
    words: { en: "A whole website", hi: "पूरी वेबसाइट" },
    background: "suites/rajwada-bagh/wedding.webp",
  },
  {
    feature: "social",
    at: 116,
    words: { en: "A video for WhatsApp", hi: "WhatsApp के लिए वीडियो" },
    background: "suites/kutch-toran/sangeet.webp",
  },
  {
    feature: "family-first",
    at: 128,
    words: { en: "Family sees it first", hi: "पहले परिवार देखे" },
    background: "suites/rajwada-bagh/family.webp",
  },
];
/** The bumper keeps four. */
const BUMPER_BEATS = [0, 1, 2, 4];
const FREE_BEAT: Beat = {
  feature: "free",
  at: 196,
  words: { en: "Make it free, pay later", hi: "मुफ़्त बनाइए, बाद में भुगतान" },
  background: "suites/kutch-toran/cover.webp",
};

type Shot = { kind: "hook" | "beat" | "end"; length: number; beat?: Beat };

function shots(bumper: boolean): Shot[] {
  if (bumper)
    return [
      { kind: "hook", length: 36 },
      ...BUMPER_BEATS.map((i) => ({ kind: "beat" as const, length: 20, beat: BEATS[i]! })),
      { kind: "end", length: 60 },
    ];
  return [
    { kind: "hook", length: 60 },
    ...BEATS.map((beat) => ({ kind: "beat" as const, length: 36, beat })),
    { kind: "beat", length: 45, beat: FREE_BEAT },
    { kind: "end", length: 66 },
  ];
}

export function allFeaturesFrames(bumper: boolean) {
  return shots(bumper).reduce((sum, shot) => sum + shot.length, 0);
}

const hi = (lang: Lang) => lang === "hi";

/** A white flash on each cut, so the beats land like a drum. */
function Flash() {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 5], [0.55, 0], clamp);
  return (
    <AbsoluteFill style={{ background: color.goldGlint, opacity: o, pointerEvents: "none" }} />
  );
}

/** The big line at the top: punches in a touch large and settles. */
function Punch({ children, lang, size = 96 }: { children: ReactNode; lang: Lang; size?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12, stiffness: 220 } });
  return (
    <div style={{ position: "absolute", top: 170, left: 40, right: 40, textAlign: "center" }}>
      <div
        style={{
          fontFamily: font.display,
          fontSize: hi(lang) ? size * 0.92 : size,
          lineHeight: hi(lang) ? 1.3 : 1.08,
          color: color.nightInk,
          whiteSpace: "pre-line",
          textShadow: "0 6px 36px rgba(0,0,0,0.6)",
          transform: `scale(${1.25 - 0.25 * s})`,
          opacity: Math.min(1, s * 1.5),
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** The invitation itself, rising and swaying under the hook line. */
function HookCard({ bumper }: { bumper: boolean }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - (bumper ? 4 : 10), fps, config: { damping: 14 } });
  const sway = Math.sin(frame / 14) * 3;
  return (
    <div
      style={{
        position: "absolute",
        top: 860,
        left: (1080 - 420) / 2,
        width: 420,
        height: 640,
        borderRadius: 34,
        overflow: "hidden",
        border: `6px solid ${color.cardGold}`,
        boxShadow: "0 50px 90px -30px rgba(0,0,0,0.9), 0 0 80px rgba(240,164,49,0.35)",
        transform: `translateY(${(1 - s) * 500}px) rotate(${sway - 4}deg)`,
      }}
    >
      <Img
        src={staticFile("suites/rajwada-bagh/cover.webp")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}

function HookShot({ lang, hook, bumper }: { lang: Lang; hook: Hook; bumper: boolean }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = HOOK_WORDS[hook][lang].split("\n");
  const gap = bumper ? 6 : 12;
  return (
    <AbsoluteFill>
      <Backdrop src="suites/rajwada-bagh/cover.webp" />
      <Sparkles count={30} seed={7} />
      <HookCard bumper={bumper} />
      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          padding: "330px 60px 0",
        }}
      >
        {lines.map((line, i) => {
          const s = spring({
            frame: frame - i * gap,
            fps,
            config: { damping: 11, stiffness: 200 },
          });
          return (
            <div
              key={i}
              style={{
                fontFamily: font.display,
                fontSize: hi(lang) ? 104 : 112,
                lineHeight: hi(lang) ? 1.35 : 1.12,
                textAlign: "center",
                color: i === lines.length - 1 ? color.marigold : color.nightInk,
                textShadow: "0 6px 40px rgba(0,0,0,0.6)",
                transform: `translateY(${(1 - s) * 60}px) scale(${0.8 + 0.2 * s})`,
                opacity: Math.min(1, s * 1.5),
              }}
            >
              {line}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

function BeatShot({ beat, lang }: { beat: Beat; lang: Lang }) {
  const Demo = DEMOS[beat.feature];
  const frame = useCurrentFrame();
  // A slow push in, so even a still moment moves
  const z = interpolate(frame, [0, 45], [1.04, 1], clamp);
  return (
    <AbsoluteFill>
      <Sequence from={-beat.at}>
        <Backdrop src={beat.background} />
      </Sequence>
      <Sparkles seed={beat.at} />
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        <Sequence from={-beat.at}>
          <Bare.Provider value={true}>
            <Demo lang={lang} />
          </Bare.Provider>
        </Sequence>
      </AbsoluteFill>
      <Punch lang={lang} size={beat.words[lang].length > 16 ? 84 : 100}>
        {beat.words[lang]}
      </Punch>
      <Flash />
    </AbsoluteFill>
  );
}

const START: Words = { en: "Start free", hi: "मुफ़्त शुरू करें" };
const TRY: Words = { en: "Try it free today", hi: "आज ही मुफ़्त आज़माइए" };
const PROOF: Record<Lang, string[]> = {
  en: ["Create free", "No app for guests", "Pay once, no subscription"],
  hi: ["मुफ़्त बनाइए", "मेहमानों को ऐप नहीं चाहिए", "एक बार भुगतान, कोई सब्सक्रिप्शन नहीं"],
};

export function AllFeatures({ lang, hook, bumper = false }: AllFeaturesProps) {
  const list = shots(bumper);
  const total = allFeaturesFrames(bumper);
  let at = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: color.night }}>
      {list.map((shot, i) => {
        const from = at;
        at += shot.length;
        return (
          <Sequence key={i} from={from} durationInFrames={shot.length}>
            {shot.kind === "hook" && <HookShot lang={lang} hook={hook} bumper={bumper} />}
            {shot.kind === "beat" && <BeatShot beat={shot.beat!} lang={lang} />}
            {shot.kind === "end" && (
              <>
                <EndCard
                  lang={lang}
                  background="suites/rajwada-bagh/cover.webp"
                  eyebrow={BRAND_WORDS.name[lang]}
                  title={bumper ? TRY[lang] : BRAND_WORDS.tagline[lang]}
                  points={bumper ? [] : PROOF[lang]}
                  action={START[lang]}
                />
                <Flash />
              </>
            )}
          </Sequence>
        );
      })}
      <Html5Audio src={staticFile("music/pilu.wav")} volume={(f) => musicVolume(f, total)} />
    </AbsoluteFill>
  );
}
