import type { CSSProperties, ReactNode } from "react";
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
import { color, font, SITE } from "./brand";
import { DESIGNS, type Lang, type Words } from "./designs";
import { BRAND_WORDS, Diamond, EndCard } from "./parts/brand";
import { Gate } from "./parts/gate";
import { clamp, CrossFade, easeInOut, easeOut, musicVolume, Rise } from "./parts/motion";

/*
 * Feature reels (9:16, about 15 seconds each): one thing Shubh does, shown on a phone with
 * the site's own paintings, then the closing card. Made for Reels, Shorts, WhatsApp Status
 * and video ads. Every claim is on the home page today (nimantran/src/content/landing.ts).
 * Faceless: the raga plays under on-screen words, so a voiceover can be laid on top.
 */

export const FEATURE_IDS = [
  "language",
  "free",
  "website",
  "memories",
  "one-link",
  "social",
  "family-first",
  "guest-names",
] as const;
export type FeatureId = (typeof FEATURE_IDS)[number];
export type FeatureProps = { feature: FeatureId; lang: Lang };

const DEMO = 330;
const END = 132;
const OVERLAP = 12;
export const FEATURE_FRAMES = DEMO + END - OVERLAP;

const hi = (lang: Lang) => lang === "hi";
const RAJ = DESIGNS["rajwada-bagh"]!;

type Feature = {
  headline: Words;
  caption: Words;
  endTitle: Words;
  raga: string;
  background: string;
};

const FEATURES: Record<FeatureId, Feature> = {
  language: {
    headline: {
      en: "Beautiful invitation cards,\nin your language",
      hi: "सुंदर निमंत्रण कार्ड,\nआपकी भाषा में",
    },
    caption: { en: "Ready in minutes, not days", hi: "दिनों में नहीं, मिनटों में तैयार" },
    endTitle: { en: "Your card, your language", hi: "आपका कार्ड, आपकी भाषा" },
    raga: "bihag",
    background: "suites/rajwada-bagh/cover.webp",
  },
  free: {
    headline: { en: "Try everything free", hi: "सब कुछ मुफ़्त आज़माइए" },
    caption: { en: "Pay only when you send it", hi: "भुगतान तभी, जब आप भेजें" },
    endTitle: { en: "Make it free, pay later", hi: "मुफ़्त बनाइए, बाद में भुगतान" },
    raga: "pilu",
    background: "suites/kutch-toran/cover.webp",
  },
  website: {
    headline: { en: "A whole website\nfor your wedding", hi: "आपकी शादी की\nपूरी वेबसाइट" },
    caption: { en: "No app. It opens in one tap.", hi: "कोई ऐप नहीं। एक टैप में खुले।" },
    endTitle: { en: "Your wedding website", hi: "आपकी शादी की वेबसाइट" },
    raga: "bihag",
    background: "suites/rajwada-bagh/wedding.webp",
  },
  memories: {
    headline: {
      en: "Your music, your photos,\nyour memories",
      hi: "आपका संगीत, आपकी तस्वीरें,\nआपकी यादें",
    },
    caption: {
      en: "Guests add their photos after the day",
      hi: "शादी के बाद मेहमान अपनी तस्वीरें जोड़ें",
    },
    endTitle: { en: "Made with your memories", hi: "आपकी यादों से बना" },
    raga: "yaman",
    background: "suites/rajwada-bagh/sangeet.webp",
  },
  "one-link": {
    headline: { en: "One link for everything", hi: "हर चीज़ के लिए\nबस एक लिंक" },
    caption: {
      en: "Every function, map and reply on one page",
      hi: "हर रस्म, नक्शा और जवाब एक ही पेज पर",
    },
    endTitle: { en: "One link for everything", hi: "सब कुछ, एक लिंक में" },
    raga: "hamsadhwani",
    background: "suites/tanjore/cover.webp",
  },
  social: {
    headline: { en: "Made for WhatsApp\nand Instagram", hi: "WhatsApp और Instagram\nके लिए तैयार" },
    caption: {
      en: "A full-HD video for Status, Reels and Stories",
      hi: "Status, Reels और Stories के लिए फ़ुल-HD वीडियो",
    },
    endTitle: { en: "Your invitation, as a video", hi: "आपका निमंत्रण, वीडियो में" },
    raga: "pilu",
    background: "suites/kutch-toran/sangeet.webp",
  },
  "family-first": {
    headline: { en: "Show your family first", hi: "पहले परिवार को दिखाइए" },
    caption: {
      en: "Fix anything, then send to every guest",
      hi: "जो बदलना हो बदलिए, फिर सबको भेजिए",
    },
    endTitle: { en: "Family first, always", hi: "पहले परिवार, फिर मेहमान" },
    raga: "yaman",
    background: "suites/rajwada-bagh/family.webp",
  },
  "guest-names": {
    headline: { en: "Every guest gets\ntheir own invitation", hi: "हर मेहमान का\nअपना निमंत्रण" },
    caption: {
      en: "Their name on the card, their own link",
      hi: "कार्ड पर उनका नाम, उनका अपना लिंक",
    },
    endTitle: { en: "Invite them by name", hi: "नाम से बुलाइए" },
    raga: "hamsadhwani",
    background: "suites/tanjore/wedding.webp",
  },
};

const PROOF: Record<Lang, string[]> = {
  en: ["Create free", "No app for guests", "Pay once, no subscription"],
  hi: ["मुफ़्त बनाइए", "मेहमानों को ऐप नहीं चाहिए", "एक बार भुगतान, कोई सब्सक्रिप्शन नहीं"],
};
const START: Words = { en: "Start free", hi: "मुफ़्त शुरू करें" };

/* ---------- shared pieces ---------- */

/** The screen is 9:16, like the frame, so gates and paintings line up as on a real phone. */
const SCREEN_W = 594;
const SCREEN_H = 1056;
const BEZEL = 16;

function Phone({
  children,
  top = 450,
  scale = 1,
  rotate = 0,
  style,
}: {
  children: ReactNode;
  top?: number;
  scale?: number;
  rotate?: number;
  style?: CSSProperties;
}) {
  const w = SCREEN_W + BEZEL * 2;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: (1080 - w) / 2,
        width: w,
        height: SCREEN_H + BEZEL * 2,
        borderRadius: 82,
        padding: BEZEL,
        background: "#0c0a14",
        boxShadow: "0 60px 120px -30px rgba(0,0,0,0.85), inset 0 0 0 3px #2a2638",
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: SCREEN_W,
          height: SCREEN_H,
          borderRadius: 68,
          overflow: "hidden",
          background: color.night,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** The phone rises in with a soft spring and settles. */
function usePhoneIn(delay = 4) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 16, mass: 0.9 } });
  return { s, y: (1 - s) * 260, opacity: Math.min(1, s * 1.4) };
}

function Headline({ children, lang }: { children: ReactNode; lang: Lang }) {
  return (
    <div style={{ position: "absolute", top: 150, left: 50, right: 50, textAlign: "center" }}>
      <Rise delay={2}>
        <div
          style={{
            fontFamily: font.display,
            fontSize: hi(lang) ? 80 : 84,
            lineHeight: hi(lang) ? 1.3 : 1.1,
            color: color.nightInk,
            whiteSpace: "pre-line",
            textShadow: "0 4px 30px rgba(0,0,0,0.5)",
          }}
        >
          {children}
        </div>
      </Rise>
    </div>
  );
}

/** A marigold pill over the phone's lower edge: the line a viewer reads with the sound off. */
function Chip({
  children,
  lang,
  delay,
  top = 1400,
}: {
  children: ReactNode;
  lang: Lang;
  delay: number;
  top?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 40,
        right: 40,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Rise delay={delay} distance={50}>
        <div
          style={{
            padding: "24px 44px",
            borderRadius: 999,
            background: color.marigold,
            boxShadow: `inset 0 -7px 0 ${color.marigoldEdge}, 0 24px 50px -18px rgba(0,0,0,0.7)`,
            fontFamily: font.sans,
            fontWeight: 700,
            fontSize: hi(lang) ? 42 : 44,
            color: color.onMarigold,
            textAlign: "center",
          }}
        >
          {children}
        </div>
      </Rise>
    </div>
  );
}

/** A slow, blurred painting behind everything, so each reel carries its design's colours. */
function Backdrop({ src }: { src: string }) {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, DEMO], [1.15, 1.28], clamp);
  return (
    <>
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(30px) saturate(1.15) brightness(0.55)",
          transform: `scale(${z})`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(18,15,36,0.25), rgba(18,15,36,0.85) 75%)",
        }}
      />
    </>
  );
}

/** Gold specks drifting up: a little festive light in every reel. */
function Sparkles({ count = 22, seed = 1 }: { count?: number; seed?: number }) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const r = (n: number) => {
          const x = Math.sin((i + 1) * 12.9898 * seed + n * 78.233) * 43758.5453;
          return x - Math.floor(x);
        };
        const speed = 0.8 + r(1) * 1.6;
        const y = 1920 - ((frame * speed * 2.2 + r(2) * 1920) % 2100);
        const x = r(3) * 1080 + Math.sin(frame / (20 + r(4) * 30) + i) * 18;
        const size = 6 + r(5) * 10;
        const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(frame / (8 + r(6) * 10) + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: 999,
              background: color.goldGlint,
              boxShadow: `0 0 ${size * 2}px ${color.marigold}`,
              opacity: twinkle * 0.8,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
}

function Tap({ at, x, y }: { at: number; x: number; y: number }) {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 16], [0, 1], clamp);
  if (frame < at || t >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 46,
        top: y - 46,
        width: 92,
        height: 92,
        borderRadius: 999,
        border: "7px solid rgba(255,255,255,0.95)",
        background: "rgba(255,255,255,0.25)",
        transform: `scale(${0.5 + t})`,
        opacity: 1 - t,
      }}
    />
  );
}

function Fill({
  src,
  position = "50% 50%",
  style,
}: {
  src: string;
  position?: string;
  style?: CSSProperties;
}) {
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: position,
        ...style,
      }}
    />
  );
}

const glow = "0 0 18px rgba(255, 244, 214, 0.95), 0 0 4px rgba(255, 244, 214, 0.9)";

/* ---------- 1. Language ---------- */

const CARD_LANGS = [
  { name: "English", title: "Wedding Invitation", names: "Arjun & Sia", face: font.names },
  { name: "हिंदी", title: "शुभ विवाह", names: "अर्जुन & सिया", face: font.scripts },
  { name: "ગુજરાતી", title: "શુભ લગ્ન", names: "અર્જુન & સિયા", face: font.scripts },
  { name: "தமிழ்", title: "திருமண அழைப்பிதழ்", names: "அர்ஜுன் & சியா", face: font.scripts },
  { name: "বাংলা", title: "শুভ বিবাহ", names: "অর্জুন & সিয়া", face: font.scripts },
  { name: "मराठी", title: "शुभ विवाह", names: "अर्जुन & सिया", face: font.scripts },
];

function LanguageDemo({ lang }: { lang: Lang }) {
  const frame = useCurrentFrame();
  const phone = usePhoneIn();
  const start = 40;
  const each = 40;
  const index = Math.max(0, Math.min(CARD_LANGS.length - 1, Math.floor((frame - start) / each)));
  const local = frame - start - index * each;
  // Each language flips in: a quick turn about the middle
  const flip =
    frame < start ? 0 : interpolate(local, [0, 10], [90, 0], { ...clamp, easing: easeOut });
  const current = CARD_LANGS[index]!;
  return (
    <>
      <Headline lang={lang}>{FEATURES.language.headline[lang]}</Headline>
      <div style={{ transform: `translateY(${phone.y}px)`, opacity: phone.opacity }}>
        <Phone>
          <Fill src={RAJ.cover.src} />
          <div
            style={{
              position: "absolute",
              top: "15%",
              left: 30,
              right: 30,
              textAlign: "center",
              transform: `perspective(900px) rotateX(${flip}deg)`,
              transformOrigin: "50% 50%",
            }}
          >
            <div
              style={{
                fontFamily: current.face,
                fontSize: 40,
                color: color.rose,
                textShadow: glow,
              }}
            >
              {current.title}
            </div>
            <div
              style={{
                fontFamily: current.face,
                fontSize: current.names.length > 12 ? 70 : 84,
                lineHeight: 1.3,
                marginTop: 14,
                color: RAJ.cover.namesColor,
                textShadow: glow,
              }}
            >
              {current.names}
            </div>
          </div>
        </Phone>
      </div>
      {/* The languages, the current one lit */}
      <div
        style={{
          position: "absolute",
          top: 1365,
          left: 40,
          right: 40,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 16,
        }}
      >
        {CARD_LANGS.map((l, i) => {
          const on = frame >= start && i === index;
          const seen = frame >= start + i * each;
          return (
            <div
              key={l.name}
              style={{
                padding: "14px 28px",
                borderRadius: 999,
                fontFamily: font.scripts,
                fontSize: 36,
                background: on ? color.marigold : "rgba(18,15,36,0.75)",
                color: on ? color.onMarigold : color.nightInk,
                border: `3px solid ${on ? color.marigold : "rgba(246,236,216,0.3)"}`,
                transform: `scale(${on ? 1.1 : 1})`,
                opacity: seen ? 1 : 0.45,
              }}
            >
              {l.name}
            </div>
          );
        })}
      </div>
      <Chip lang={lang} delay={start + each * 6 - 4} top={1250}>
        {FEATURES.language.caption[lang]}
      </Chip>
    </>
  );
}

/* ---------- 2. Free to try, pay later ---------- */

const FREE_ITEMS: { src: string; label: Words; video?: boolean }[] = [
  {
    src: "suites/rajwada-bagh/cover.webp",
    label: { en: "Invitation website", hi: "निमंत्रण वेबसाइट" },
  },
  {
    src: "suites/kutch-toran/cover.webp",
    label: { en: "Invitation video", hi: "निमंत्रण वीडियो" },
    video: true,
  },
  { src: "suites/tanjore/cover.webp", label: { en: "Invitation card", hi: "निमंत्रण कार्ड" } },
  {
    src: "suites/rajwada-bagh/reception.webp",
    label: { en: "Thank-you card", hi: "धन्यवाद कार्ड" },
  },
];

function FreeDemo({ lang }: { lang: Lang }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const FREE = hi(lang) ? "मुफ़्त" : "FREE";
  // After the four, they gather and the price lands
  const gather = interpolate(frame, [170, 200], [0, 1], { ...clamp, easing: easeInOut });
  const price = spring({ frame: frame - 196, fps, config: { damping: 11 } });
  return (
    <>
      <Headline lang={lang}>{FEATURES.free.headline[lang]}</Headline>
      {FREE_ITEMS.map((item, i) => {
        const s = spring({ frame: frame - (20 + i * 26), fps, config: { damping: 14 } });
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 90 + col * 470;
        const y = 380 + row * 520;
        const stamp = spring({
          frame: frame - (36 + i * 26),
          fps,
          config: { damping: 9, stiffness: 180 },
        });
        const tilt = (col ? 1 : -1) * (3 + row * 2);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + gather * (290 - x),
              top: y + gather * (640 - y),
              width: 430,
              opacity: s * (1 - gather),
              transform: `translateY(${(1 - s) * 200}px) rotate(${tilt * (1 - gather) + (1 - s) * tilt * 3}deg) scale(${1 - gather * 0.5})`,
            }}
          >
            <div
              style={{
                position: "relative",
                height: 440,
                borderRadius: 30,
                overflow: "hidden",
                border: `5px solid ${color.cardGold}`,
                boxShadow: "0 30px 60px -20px rgba(0,0,0,0.8)",
              }}
            >
              <Fill src={item.src} position="50% 30%" />
              {item.video && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 999,
                      background: "rgba(18,15,36,0.6)",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <svg viewBox="0 0 24 24" style={{ width: 60, height: 60, marginLeft: 8 }}>
                      <path d="M6 4l14 8-14 8z" fill={color.nightInk} />
                    </svg>
                  </div>
                </div>
              )}
              {/* The free stamp */}
              <div
                style={{
                  position: "absolute",
                  top: 22,
                  right: 22,
                  padding: "10px 24px",
                  borderRadius: 14,
                  background: color.success,
                  color: "#fff",
                  fontFamily: font.sans,
                  fontWeight: 800,
                  fontSize: 32,
                  letterSpacing: hi(lang) ? 0 : "0.08em",
                  transform: `scale(${stamp}) rotate(-8deg)`,
                }}
              >
                {FREE}
              </div>
            </div>
            <div
              style={{
                marginTop: 18,
                textAlign: "center",
                fontFamily: font.sans,
                fontWeight: 700,
                fontSize: 38,
                color: color.nightInk,
              }}
            >
              {item.label[lang]}
            </div>
          </div>
        );
      })}
      {/* ₹0 */}
      <div
        style={{
          position: "absolute",
          top: 640,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: Math.min(1, price),
          transform: `scale(${0.4 + price * 0.6})`,
        }}
      >
        <div
          style={{
            fontFamily: font.display,
            fontSize: 300,
            lineHeight: 1,
            color: color.marigold,
            textShadow: "0 10px 60px rgba(240,164,49,0.5)",
          }}
        >
          ₹0
        </div>
        <div style={{ fontFamily: font.sans, fontSize: 46, color: color.nightInk, marginTop: 20 }}>
          {hi(lang) ? "बनाने के लिए" : "to make it"}
        </div>
      </div>
      <Chip lang={lang} delay={222} top={1180}>
        {FEATURES.free.caption[lang]}
      </Chip>
    </>
  );
}

/* ---------- 3. A whole website ---------- */

const SITE_PAGES: { src: string; label: Words }[] = [
  {
    src: "suites/rajwada-bagh/cover.webp",
    label: { en: "Your names, painted", hi: "आपके नाम, चित्र में" },
  },
  {
    src: "suites/rajwada-bagh/haldi.webp",
    label: { en: "A page for every function", hi: "हर रस्म का अपना पन्ना" },
  },
  {
    src: "suites/rajwada-bagh/sangeet.webp",
    label: { en: "Map and add-to-calendar", hi: "नक्शा और कैलेंडर" },
  },
  {
    src: "suites/rajwada-bagh/wedding.webp",
    label: { en: "A countdown to the day", hi: "शादी तक उलटी गिनती" },
  },
  {
    src: "suites/rajwada-bagh/reply.webp",
    label: { en: "Replies in one tap", hi: "एक टैप में जवाब" },
  },
];

function WebsiteDemo({ lang }: { lang: Lang }) {
  const frame = useCurrentFrame();
  const phone = usePhoneIn();
  const first = 50;
  const each = 52;
  // Scroll stop to stop, each a swipe and a rest
  let offset = 0;
  for (let i = 1; i < SITE_PAGES.length; i++) {
    offset += interpolate(
      frame,
      [first + (i - 1) * each + 26, first + (i - 1) * each + 46],
      [0, 1],
      {
        ...clamp,
        easing: easeInOut,
      },
    );
  }
  const index = Math.round(offset);
  const words = [RAJ.couple[lang].first, "&", RAJ.couple[lang].second];
  return (
    <>
      <Headline lang={lang}>{FEATURES.website.headline[lang]}</Headline>
      <div style={{ transform: `translateY(${phone.y}px)`, opacity: phone.opacity }}>
        <Phone>
          {/* The address bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 96,
              zIndex: 2,
              background: "rgba(251,246,236,0.94)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              paddingBottom: 16,
              fontFamily: font.sans,
              fontSize: 24,
              color: color.inkMuted,
            }}
          >
            <span style={{ padding: "6px 20px", borderRadius: 999, background: color.surface2 }}>
              {SITE}/i/arjun-weds-sia
            </span>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: -offset * SCREEN_H }}>
            {SITE_PAGES.map((page, i) => (
              <div key={i} style={{ position: "relative", height: SCREEN_H }}>
                <Fill src={page.src} />
                {i === 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "17%",
                      left: 20,
                      right: 20,
                      textAlign: "center",
                    }}
                  >
                    {words.map((w, k) => (
                      <div
                        key={k}
                        style={{
                          fontFamily: font.names,
                          fontStyle: k === 1 ? "italic" : "normal",
                          fontSize: k === 1 ? 50 : 88,
                          lineHeight: 1.1,
                          color: k === 1 ? color.rose : RAJ.cover.namesColor,
                          textShadow: glow,
                        }}
                      >
                        {w}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Phone>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1330,
          left: 40,
          right: 40,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          key={index}
          style={{
            padding: "22px 40px",
            borderRadius: 999,
            background: "rgba(18,15,36,0.85)",
            border: `3px solid ${color.marigold}`,
            fontFamily: font.sans,
            fontWeight: 700,
            fontSize: 42,
            color: color.nightInk,
            display: "flex",
            alignItems: "center",
            gap: 18,
            opacity: interpolate(offset % 1, [0, 0.3, 0.7, 1], [1, 0, 0, 1], clamp) * phone.opacity,
          }}
        >
          <Diamond />
          {SITE_PAGES[index]!.label[lang]}
        </div>
      </div>
      <Chip lang={lang} delay={first + each * 4 + 30} top={1210}>
        {FEATURES.website.caption[lang]}
      </Chip>
    </>
  );
}

/* ---------- 4. Music, photos, memories ---------- */

const POLAROIDS = [
  { src: "suites/rajwada-bagh/wedding.webp", x: 40, y: 1020, r: -9 },
  { src: "suites/kutch-toran/sangeet.webp", x: 720, y: 960, r: 8 },
  { src: "suites/kutch-toran/wedding.webp", x: 70, y: 560, r: 6 },
  { src: "suites/rajwada-bagh/sangeet.webp", x: 730, y: 520, r: -7 },
];

function MemoriesDemo({ lang }: { lang: Lang }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phone = usePhoneIn();
  return (
    <>
      <Headline lang={lang}>{FEATURES.memories.headline[lang]}</Headline>
      <div style={{ transform: `translateY(${phone.y}px)`, opacity: phone.opacity }}>
        <Phone>
          {/* What sits in the photo frame: the couple's own picture once they add one */}
          <Fill
            src="suites/rajwada-bagh/wedding.webp"
            position="50% 60%"
            style={{ transform: "scale(1.4)" }}
          />
          <Fill src="suites/rajwada-bagh/couple.webp" />
          {/* The song chip */}
          <div style={{ position: "absolute", left: 40, right: 40, top: 760 }}>
            <Rise delay={40}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "18px 26px",
                  borderRadius: 999,
                  background: "rgba(18,15,36,0.85)",
                  color: color.nightInk,
                  fontFamily: font.sans,
                  fontWeight: 700,
                  fontSize: 32,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 999,
                    background: color.marigold,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <svg viewBox="0 0 24 24" style={{ width: 34, height: 34 }}>
                    <path
                      d="M9 18V5l12-2v13"
                      stroke={color.onMarigold}
                      strokeWidth={2.4}
                      fill="none"
                    />
                    <circle cx="6" cy="18" r="3" fill={color.onMarigold} />
                    <circle cx="18" cy="16" r="3" fill={color.onMarigold} />
                  </svg>
                </div>
                <span style={{ flex: 1 }}>{hi(lang) ? "आपका गाना" : "Your song"}</span>
                {/* Bars that dance */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 44 }}>
                  {[0, 1, 2, 3, 4].map((b) => (
                    <div
                      key={b}
                      style={{
                        width: 8,
                        borderRadius: 4,
                        background: color.marigold,
                        height: 10 + Math.abs(Math.sin(frame / (3 + b * 0.7) + b)) * 34,
                      }}
                    />
                  ))}
                </div>
              </div>
            </Rise>
          </div>
        </Phone>
      </div>
      {/* Guests' photos arrive round the phone */}
      {POLAROIDS.map((p, i) => {
        const s = spring({ frame: frame - (120 + i * 22), fps, config: { damping: 12 } });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: 290,
              padding: "16px 16px 54px",
              background: "#fffdf7",
              borderRadius: 8,
              boxShadow: "0 30px 50px -20px rgba(0,0,0,0.8)",
              transform: `rotate(${p.r + (1 - s) * 20}deg) scale(${s})`,
              opacity: Math.min(1, s * 1.5),
            }}
          >
            <div style={{ position: "relative", height: 300, overflow: "hidden" }}>
              <Fill src={p.src} position="50% 55%" />
            </div>
            <svg
              viewBox="0 0 24 24"
              style={{ position: "absolute", right: 20, bottom: 10, width: 36, height: 36 }}
            >
              <path
                d="M12 21s-8-5.3-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.7-8 11-8 11z"
                fill={color.rose}
              />
            </svg>
          </div>
        );
      })}
      <Chip lang={lang} delay={220} top={1420}>
        {FEATURES.memories.caption[lang]}
      </Chip>
    </>
  );
}

/* ---------- 5. One link ---------- */

const LINK_TILES: { label: Words; src: string }[] = [
  { label: { en: "Haldi", hi: "हल्दी" }, src: "suites/rajwada-bagh/haldi.webp" },
  { label: { en: "Mehendi", hi: "मेहंदी" }, src: "suites/rajwada-bagh/mehendi.webp" },
  { label: { en: "Sangeet", hi: "संगीत" }, src: "suites/rajwada-bagh/sangeet.webp" },
  { label: { en: "Wedding", hi: "विवाह" }, src: "suites/rajwada-bagh/wedding.webp" },
  { label: { en: "Map", hi: "नक्शा" }, src: "suites/kutch-toran/wedding.webp" },
  { label: { en: "RSVP", hi: "जवाब" }, src: "suites/rajwada-bagh/baraat.webp" },
  { label: { en: "Photos", hi: "तस्वीरें" }, src: "suites/kutch-toran/sangeet.webp" },
  { label: { en: "Video", hi: "वीडियो" }, src: "suites/kutch-toran/cover.webp" },
];

function OneLinkDemo({ lang }: { lang: Lang }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const link = spring({ frame: frame - 18, fps, config: { damping: 14 } });
  // The tiles burst out of the link, then gather back into it
  const back = interpolate(frame, [236, 268], [0, 1], { ...clamp, easing: easeInOut });
  const cx = 540;
  const cy = 900;
  return (
    <>
      <Headline lang={lang}>{FEATURES["one-link"].headline[lang]}</Headline>
      {LINK_TILES.map((tile, i) => {
        const s = spring({ frame: frame - (54 + i * 9), fps, config: { damping: 13 } });
        // Turned by an eighth of a turn's half, so no tile sits on the link's ends
        const angle = ((i + 0.5) / LINK_TILES.length) * Math.PI * 2 - Math.PI / 2;
        const t = s * (1 - back);
        const x = cx + Math.cos(angle) * 360 * t;
        const y = cy + Math.sin(angle) * 480 * t;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 105,
              top: y - 118,
              width: 210,
              opacity: Math.min(1, t * 2),
              transform: `scale(${0.3 + t * 0.7})`,
            }}
          >
            <div
              style={{
                position: "relative",
                height: 190,
                borderRadius: 26,
                overflow: "hidden",
                border: `4px solid ${color.cardGold}`,
                boxShadow: "0 20px 40px -16px rgba(0,0,0,0.8)",
              }}
            >
              <Fill src={tile.src} position="50% 45%" />
            </div>
            <div
              style={{
                marginTop: 8,
                textAlign: "center",
                fontFamily: font.sans,
                fontWeight: 700,
                fontSize: 34,
                color: color.nightInk,
                textShadow: "0 2px 10px rgba(0,0,0,0.8)",
              }}
            >
              {tile.label[lang]}
            </div>
          </div>
        );
      })}
      {/* The link itself, at the middle */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: cy - 60,
          display: "flex",
          justifyContent: "center",
          transform: `scale(${link * (1 + back * 0.15)})`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "26px 40px",
            borderRadius: 999,
            background: color.paper,
            border: `4px solid ${color.marigold}`,
            boxShadow: `0 0 ${40 + back * 60}px rgba(240,164,49,${0.4 + back * 0.4})`,
            fontFamily: font.sans,
            fontWeight: 700,
            fontSize: 36,
            color: color.ink,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            style={{ width: 44, height: 44 }}
            fill="none"
            stroke={color.marigoldStrong}
            strokeWidth={2.4}
            strokeLinecap="round"
          >
            <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
            <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
          </svg>
          {SITE}/i/arjun-weds-sia
        </div>
      </div>
      <Chip lang={lang} delay={262} top={1360}>
        {FEATURES["one-link"].caption[lang]}
      </Chip>
    </>
  );
}

/* ---------- 6. WhatsApp and Instagram ---------- */

function SocialDemo({ lang }: { lang: Lang }) {
  const frame = useCurrentFrame();
  const phone = usePhoneIn();
  const design = DESIGNS["kutch-toran"]!;
  // Status first: the gate opens as a video plays; then the Reel with hearts rising
  const open = interpolate(frame, [50, 130], [0, 1], { ...clamp, easing: easeInOut });
  const push = interpolate(frame, [110, 160], [1, 1.25], { ...clamp, easing: easeInOut });
  const toReel = interpolate(frame, [168, 186], [0, 1], clamp);
  const progress = interpolate(frame, [20, 180], [0, 1], clamp);
  const couple = design.couple[lang];
  return (
    <>
      <Headline lang={lang}>{FEATURES.social.headline[lang]}</Headline>
      <div style={{ transform: `translateY(${phone.y}px)`, opacity: phone.opacity }}>
        <Phone>
          {/* WhatsApp Status */}
          <AbsoluteFill style={{ opacity: 1 - toReel }}>
            <Gate gate={design.gate.id} hole={design.gate.hole} open={open} push={push} />
            <div
              style={{
                position: "absolute",
                top: 40,
                left: 24,
                right: 24,
                display: "flex",
                gap: 8,
              }}
            >
              {[0, 1, 2].map((b) => (
                <div
                  key={b}
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.4)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.max(0, Math.min(1, progress * 3 - b)) * 100}%`,
                      background: "#fff",
                    }}
                  />
                </div>
              ))}
            </div>
            <div
              style={{
                position: "absolute",
                top: 66,
                left: 28,
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontFamily: font.sans,
                color: "#fff",
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 999,
                  background: color.whatsapp,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 26,
                }}
              >
                {hi(lang) ? "का" : "K"}
              </div>
              {hi(lang) ? "मेरा स्टेटस" : "My status"}
            </div>
          </AbsoluteFill>
          {/* Instagram Reel */}
          <AbsoluteFill style={{ opacity: toReel }}>
            <Fill src={design.cover.src} style={{ transform: `scale(${1.05 + toReel * 0.05})` }} />
            <div
              style={{ position: "absolute", top: "24%", left: 20, right: 20, textAlign: "center" }}
            >
              {[couple.first, "&", couple.second].map((w, k) => (
                <div
                  key={k}
                  style={{
                    fontFamily: font.names,
                    fontStyle: k === 1 ? "italic" : "normal",
                    fontSize: k === 1 ? 54 : 92,
                    lineHeight: 1.1,
                    color: k === 1 ? design.cover.blessingColor : design.cover.namesColor,
                    textShadow: design.cover.shadow,
                  }}
                >
                  {w}
                </div>
              ))}
            </div>
            {/* The side rail: like, comment, share */}
            <div
              style={{
                position: "absolute",
                right: 22,
                bottom: 150,
                display: "flex",
                flexDirection: "column",
                gap: 34,
                alignItems: "center",
              }}
            >
              {[
                "M12 21s-8-5.3-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.7-8 11-8 11z",
                "M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z",
                "M22 3 11 14 M22 3l-7 19-4-8-8-4z",
              ].map((d, k) => (
                <svg
                  key={k}
                  viewBox="0 0 24 24"
                  style={{ width: 56, height: 56 }}
                  fill={k === 0 ? "#ff3b5c" : "none"}
                  stroke="#fff"
                  strokeWidth={k === 0 ? 0 : 2}
                  strokeLinejoin="round"
                >
                  <path d={d} />
                </svg>
              ))}
            </div>
            {/* Hearts rising */}
            {Array.from({ length: 9 }, (_, k) => {
              const t = (frame - 190 - k * 12) / 70;
              if (t < 0 || t > 1) return null;
              return (
                <svg
                  key={k}
                  viewBox="0 0 24 24"
                  style={{
                    position: "absolute",
                    right: 30 + Math.sin(k * 2.1 + t * 6) * 30,
                    bottom: 220 + t * 520,
                    width: 50,
                    height: 50,
                    opacity: 1 - t,
                    transform: `scale(${0.6 + t * 0.6})`,
                  }}
                >
                  <path
                    d="M12 21s-8-5.3-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.7-8 11-8 11z"
                    fill="#ff3b5c"
                  />
                </svg>
              );
            })}
            <div
              style={{
                position: "absolute",
                left: 28,
                bottom: 60,
                right: 120,
                fontFamily: font.sans,
                color: "#fff",
                fontSize: 28,
                textShadow: "0 2px 8px rgba(0,0,0,0.7)",
              }}
            >
              <b>{hi(lang) ? "ध्रुव_काव्या" : "dhruv.kavya"}</b>{" "}
              {hi(lang) ? "हमारी शादी में ज़रूर आइए" : "Save the date for our wedding"}
            </div>
          </AbsoluteFill>
          <Tap at={160} x={SCREEN_W / 2} y={SCREEN_H / 2} />
        </Phone>
      </div>
      <Chip lang={lang} delay={232} top={1380}>
        {FEATURES.social.caption[lang]}
      </Chip>
    </>
  );
}

/* ---------- 7. Family first ---------- */

type Bubble = {
  me: boolean;
  who?: Words;
  text: Words;
  at: number;
  preview?: boolean;
  tick?: boolean;
};

const FAMILY_CHAT: Bubble[] = [
  {
    me: true,
    text: {
      en: "Here's our invitation, before the guests see it",
      hi: "मेहमानों से पहले, हमारा निमंत्रण देखिए",
    },
    at: 30,
    preview: true,
  },
  {
    me: false,
    who: { en: "Mummy", hi: "मम्मी" },
    text: { en: "So beautiful! Lovely colours", hi: "बहुत सुंदर! रंग बहुत प्यारे हैं" },
    at: 92,
  },
  {
    me: false,
    who: { en: "Chacha ji", hi: "चाचा जी" },
    text: { en: "Add Nani ji's name too", hi: "नानी जी का नाम भी जोड़ो" },
    at: 140,
  },
  {
    me: true,
    text: { en: "Done! Same link, already updated", hi: "हो गया! वही लिंक, बदलाव हो गया" },
    at: 188,
    tick: true,
  },
];

function FamilyDemo({ lang }: { lang: Lang }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phone = usePhoneIn();
  const send = spring({ frame: frame - 236, fps, config: { damping: 12 } });
  return (
    <>
      <Headline lang={lang}>{FEATURES["family-first"].headline[lang]}</Headline>
      <div style={{ transform: `translateY(${phone.y}px)`, opacity: phone.opacity }}>
        <Phone>
          <AbsoluteFill style={{ background: color.whatsappChat }}>
            <div
              style={{
                height: 140,
                background: "#0b5c4d",
                display: "flex",
                alignItems: "flex-end",
                padding: "0 26px 22px",
                gap: 18,
              }}
            >
              <div
                style={{
                  width: 66,
                  height: 66,
                  borderRadius: 999,
                  background: color.marigold,
                  display: "grid",
                  placeItems: "center",
                  fontFamily: font.sans,
                  fontWeight: 800,
                  fontSize: 30,
                  color: color.onMarigold,
                }}
              >
                {hi(lang) ? "श" : "S"}
              </div>
              <div style={{ fontFamily: font.sans, color: "#fff" }}>
                <div style={{ fontSize: 32, fontWeight: 700 }}>
                  {hi(lang) ? "शर्मा परिवार" : "Sharma Family"}
                </div>
                <div style={{ fontSize: 22, opacity: 0.8 }}>
                  {hi(lang) ? "मम्मी, पापा, चाचा जी, दीदी" : "Mummy, Papa, Chacha ji, Didi"}
                </div>
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                top: 170,
                left: 20,
                right: 20,
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              {FAMILY_CHAT.map((b, i) =>
                frame < b.at ? null : (
                  <Rise key={i} delay={b.at} distance={30}>
                    <div
                      style={{ display: "flex", justifyContent: b.me ? "flex-end" : "flex-start" }}
                    >
                      <div
                        style={{
                          maxWidth: b.preview ? 420 : 440,
                          background: b.me ? color.whatsappBubble : "#fff",
                          borderRadius: b.me ? "22px 0 22px 22px" : "0 22px 22px 22px",
                          padding: b.preview ? 10 : "14px 20px",
                          boxShadow: "0 2px 2px rgba(0,0,0,0.08)",
                          fontFamily: font.sans,
                          fontSize: 27,
                          color: "#1f2c34",
                        }}
                      >
                        {b.who && (
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: 24,
                              color: color.rose,
                              marginBottom: 4,
                            }}
                          >
                            {b.who[lang]}
                          </div>
                        )}
                        {b.preview && (
                          <div
                            style={{
                              position: "relative",
                              height: 260,
                              borderRadius: 14,
                              overflow: "hidden",
                              marginBottom: 10,
                            }}
                          >
                            <Fill src={RAJ.cover.src} position="50% 25%" />
                            <div
                              style={{
                                position: "absolute",
                                top: 40,
                                left: 0,
                                right: 0,
                                textAlign: "center",
                                fontFamily: font.names,
                                fontSize: 50,
                                color: RAJ.cover.namesColor,
                                textShadow: glow,
                              }}
                            >
                              {RAJ.couple[lang].first} & {RAJ.couple[lang].second}
                            </div>
                          </div>
                        )}
                        <div style={{ padding: b.preview ? "0 10px 6px" : 0 }}>
                          {b.text[lang]}
                          {b.tick && (
                            <span style={{ color: "#53bdeb", marginLeft: 10, fontWeight: 700 }}>
                              ✓✓
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Rise>
                ),
              )}
            </div>
            {/* Then the button that sends it to everyone */}
            <div
              style={{
                position: "absolute",
                left: 24,
                right: 24,
                bottom: 40,
                opacity: Math.min(1, send),
                transform: `translateY(${(1 - send) * 80}px)`,
              }}
            >
              <div
                style={{
                  padding: "26px 0",
                  borderRadius: 999,
                  textAlign: "center",
                  background: color.whatsapp,
                  color: "#fff",
                  fontFamily: font.sans,
                  fontWeight: 800,
                  fontSize: 34,
                  boxShadow: "0 16px 30px -12px rgba(0,0,0,0.5)",
                }}
              >
                {hi(lang) ? "अब सभी मेहमानों को भेजें" : "Now send to all guests"}
              </div>
            </div>
            <Tap at={262} x={SCREEN_W / 2} y={SCREEN_H - 84} />
          </AbsoluteFill>
        </Phone>
      </div>
      <Chip lang={lang} delay={276} top={1390}>
        {FEATURES["family-first"].caption[lang]}
      </Chip>
    </>
  );
}

/* ---------- 8. Guest names ---------- */

const GUESTS: Words[] = [
  { en: "Sharma family", hi: "शर्मा परिवार" },
  { en: "Mehta ji", hi: "मेहता जी" },
  { en: "Priya and Rohan", hi: "प्रिया और रोहन" },
  { en: "Iyer family", hi: "अय्यर परिवार" },
];

function GuestNamesDemo({ lang }: { lang: Lang }) {
  const frame = useCurrentFrame();
  const phone = usePhoneIn();
  const design = DESIGNS.tanjore!;
  const start = 40;
  const each = 62;
  const index = Math.max(0, Math.min(GUESTS.length - 1, Math.floor((frame - start) / each)));
  const local = frame - start - index * each;
  const swap =
    frame < start ? 0 : interpolate(local, [0, 12], [1, 0], { ...clamp, easing: easeOut });
  const dear = hi(lang) ? "प्रिय" : "Dear";
  const count = Math.round(interpolate(frame, [start, start + each * 4], [1, 248], clamp));
  return (
    <>
      <Headline lang={lang}>{FEATURES["guest-names"].headline[lang]}</Headline>
      <div style={{ transform: `translateY(${phone.y}px)`, opacity: phone.opacity }}>
        <Phone>
          <Fill src={design.cover.src} />
          {/* The greeting the guest page writes for each guest */}
          <div
            style={{
              position: "absolute",
              top: 120,
              left: 40,
              right: 40,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                padding: "22px 34px",
                borderRadius: 26,
                background: color.cardIvory,
                border: `4px solid ${color.cardGold}`,
                boxShadow: "0 24px 40px -16px rgba(0,0,0,0.7)",
                textAlign: "center",
                transform: `perspective(800px) rotateX(${swap * 90}deg)`,
              }}
            >
              <div
                style={{
                  fontFamily: font.label,
                  fontSize: 24,
                  letterSpacing: hi(lang) ? 0 : "0.2em",
                  textTransform: "uppercase",
                  color: color.cardGoldText,
                }}
              >
                {dear}
              </div>
              <div
                style={{
                  fontFamily: font.display,
                  fontSize: 56,
                  lineHeight: 1.2,
                  color: design.headingColor,
                }}
              >
                {GUESTS[index]![lang]}
              </div>
            </div>
          </div>
          <div style={{ position: "absolute", top: 430, left: 20, right: 20, textAlign: "center" }}>
            {[design.couple[lang].first, "&", design.couple[lang].second].map((w, k) => (
              <div
                key={k}
                style={{
                  fontFamily: font.names,
                  fontStyle: k === 1 ? "italic" : "normal",
                  fontSize: k === 1 ? 48 : 76,
                  lineHeight: 1.1,
                  color: k === 1 ? design.cover.blessingColor : design.cover.namesColor,
                  textShadow: design.cover.shadow,
                }}
              >
                {w}
              </div>
            ))}
          </div>
        </Phone>
      </div>
      {/* Sent, one by one */}
      <div
        style={{
          position: "absolute",
          top: 1330,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "20px 38px",
            borderRadius: 999,
            background: "rgba(18,15,36,0.85)",
            border: `3px solid ${color.whatsapp}`,
            fontFamily: font.sans,
            fontWeight: 700,
            fontSize: 40,
            color: color.nightInk,
            opacity: phone.opacity,
          }}
        >
          <span style={{ color: "#53bdeb" }}>✓✓</span>
          {hi(lang) ? `${count} मेहमानों को भेजा` : `Sent to ${count} guests`}
        </div>
      </div>
      <Chip lang={lang} delay={start + each * 4 - 6} top={1200}>
        {FEATURES["guest-names"].caption[lang]}
      </Chip>
    </>
  );
}

/* ---------- the reel ---------- */

const DEMOS: Record<FeatureId, (p: { lang: Lang }) => ReactNode> = {
  language: LanguageDemo,
  free: FreeDemo,
  website: WebsiteDemo,
  memories: MemoriesDemo,
  "one-link": OneLinkDemo,
  social: SocialDemo,
  "family-first": FamilyDemo,
  "guest-names": GuestNamesDemo,
};

export function FeatureReel({ feature, lang }: FeatureProps) {
  const f = FEATURES[feature];
  const Demo = DEMOS[feature];
  return (
    <AbsoluteFill style={{ backgroundColor: color.night }}>
      <Sequence durationInFrames={DEMO}>
        <CrossFade duration={DEMO} fade={OVERLAP} fadeIn={false}>
          <Backdrop src={f.background} />
          <Sparkles seed={FEATURE_IDS.indexOf(feature) + 1} />
          <Demo lang={lang} />
        </CrossFade>
      </Sequence>
      <Sequence from={DEMO - OVERLAP} durationInFrames={END}>
        <CrossFade duration={END} fade={OVERLAP} fadeOut={false}>
          <EndCard
            lang={lang}
            background={f.background}
            eyebrow={BRAND_WORDS.name[lang]}
            title={f.endTitle[lang]}
            points={PROOF[lang]}
            action={START[lang]}
          />
        </CrossFade>
      </Sequence>
      <Html5Audio
        src={staticFile(`music/${f.raga}.wav`)}
        volume={(fr) => musicVolume(fr, FEATURE_FRAMES)}
      />
    </AbsoluteFill>
  );
}
