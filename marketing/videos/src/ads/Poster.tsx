import type { CSSProperties } from "react";
import { AbsoluteFill, Freeze, Img, staticFile } from "remotion";
import "../brand";
import { color, font, SITE } from "../brand";
import type { Lang } from "../designs";
import { Button } from "../parts/brand";
import type { FormatId } from "./formats";
import { PriceScene } from "./scenes";

/*
 * Still images for feeds, Stories, carousels, YouTube and Google: one concept laid out for
 * any size. The layout follows the shape: tall ones stack words over the picture, wide ones
 * set words beside it. Text is the site's own faces; *marked* words are set in marigold.
 */

type Copy = Record<Lang, string>;
export type ConceptId =
  | "mother"
  | "grandmother"
  | "friends"
  | "gate"
  | "price"
  | "bride"
  | "mehendi"
  | "rsvp"
  | "c1"
  | "c2"
  | "c3"
  | "c4"
  | "c5"
  | "yt-explainer"
  | "yt-gate"
  | "banner"
  | "logo"
  | "logo-wide";

type Concept = {
  photo?: { src: string; pos?: string };
  shot?: string;
  headline?: Copy;
  sub?: Copy;
  cta?: boolean;
  step?: number;
};

const CTA: Copy = { en: "Make yours free", hi: "मुफ़्त में बनाइए" };

const CONCEPTS: Record<ConceptId, Concept> = {
  mother: {
    photo: { src: "ads/mother.jpg", pos: "50% 30%" },
    headline: {
      en: "Invite every relative. *With one link.*",
      hi: "हर रिश्तेदार को न्योता। *बस एक लिंक से।*",
    },
    sub: {
      en: "A painted invitation that opens like a palace gate. Guests reply in one tap.",
      hi: "महल के दरवाज़े जैसा खुलने वाला निमंत्रण। मेहमान एक टैप में जवाब दें।",
    },
    cta: true,
  },
  grandmother: {
    photo: { src: "ads/grandmother.jpg", pos: "40% 35%" },
    headline: {
      en: "Even Dadi can open it. *No app needed.*",
      hi: "दादी भी खोल लें। *कोई ऐप नहीं।*",
    },
    sub: {
      en: "One WhatsApp link. Every function, with directions.",
      hi: "एक व्हाट्सऐप लिंक। हर रस्म, रास्ते के साथ।",
    },
    cta: true,
  },
  friends: {
    photo: { src: "ads/friends.jpg", pos: "50% 40%" },
    headline: {
      en: "Haldi. Mehendi. Sangeet. *One link for all.*",
      hi: "हल्दी। मेहंदी। संगीत। *सबके लिए एक लिंक।*",
    },
    sub: { en: "Every function gets its own painted page.", hi: "हर रस्म का अपना सुंदर पेज।" },
    cta: true,
  },
  gate: {
    shot: "shots/gate.jpg",
    headline: {
      en: "Your wedding card, *opening like a palace gate.*",
      hi: "आपका शादी का कार्ड, *महल के दरवाज़े की तरह खुलता हुआ।*",
    },
    sub: { en: `See a live sample at ${SITE}`, hi: `लाइव सैंपल देखें: ${SITE}` },
    cta: true,
  },
  price: {
    headline: {
      en: "300 printed cards: ₹25,000+. *One Shubh link: start free.*",
      hi: "300 छपे कार्ड: ₹25,000+। *शुभ का एक लिंक: मुफ़्त शुरुआत।*",
    },
  },
  bride: {
    photo: { src: "ads/bride-glow.jpg", pos: "50% 30%" },
    headline: {
      en: "*POV:* your invitations went out in one evening.",
      hi: "*POV:* सारे निमंत्रण एक ही शाम में चले गए।",
    },
    cta: true,
  },
  mehendi: {
    photo: { src: "ads/mehendi.jpg", pos: "50% 50%" },
    headline: {
      en: "The mehendi is still drying. *The invitations are already out.*",
      hi: "मेहंदी अभी सूखी भी नहीं, *और निमंत्रण पहुँच भी गए।*",
    },
    cta: true,
  },
  rsvp: {
    shot: "shots/rsvp-coming.jpg",
    headline: {
      en: "Know who's coming to *every function.*",
      hi: "जानिए कौन *किस रस्म* में आ रहा है।",
    },
    sub: {
      en: "Guests reply in one tap, function by function.",
      hi: "मेहमान हर रस्म के लिए एक टैप में जवाब देते हैं।",
    },
    cta: true,
  },
  c1: {
    photo: { src: "ads/friends.jpg", pos: "50% 40%" },
    headline: { en: "Your whole wedding, *in one link.*", hi: "पूरी शादी, *एक लिंक में।*" },
    sub: { en: "Swipe to see how →", hi: "कैसे? आगे देखें →" },
  },
  c2: {
    shot: "shots/designs.jpg",
    step: 1,
    headline: { en: "Pick a *hand-painted* design", hi: "*हाथ से पेंट किया* डिज़ाइन चुनें" },
    sub: {
      en: "Rajasthani palaces, Tanjore gold, Kutch, Bengal and more.",
      hi: "राजस्थानी महल, तंजौर का सोना, कच्छ, बंगाल और भी बहुत।",
    },
  },
  c3: {
    shot: "shots/cover.jpg",
    step: 2,
    headline: {
      en: "Add names, functions, venues, *in your language*",
      hi: "नाम, रस्में, जगह लिखें, *अपनी भाषा में*",
    },
    sub: {
      en: "Hindi, English, Marathi, Gujarati, Bengali, Tamil.",
      hi: "हिंदी, अंग्रेज़ी, मराठी, गुजराती, बांग्ला, तमिल।",
    },
  },
  c4: {
    shot: "shots/haldi.jpg",
    step: 3,
    headline: {
      en: "Send *one link.* Every function gets its own page",
      hi: "*एक लिंक* भेजें। हर रस्म का अपना पेज",
    },
    sub: { en: "With the date, time and directions.", hi: "तारीख़, समय और रास्ते के साथ।" },
  },
  c5: {
    shot: "shots/rsvp-coming.jpg",
    step: 4,
    headline: { en: "Guests reply *in one tap*", hi: "मेहमान *एक टैप में* जवाब दें" },
    sub: {
      en: "Start free. Paid designs from ₹499, once.",
      hi: "मुफ़्त शुरुआत। पेड डिज़ाइन ₹499 से, एक बार।",
    },
    cta: true,
  },
  "yt-explainer": {
    photo: { src: "ads/friends.jpg", pos: "35% 40%" },
    headline: { en: "Invite everyone *in one link*", hi: "पूरी शादी का न्योता, *एक लिंक में*" },
  },
  "yt-gate": {
    shot: "shots/gate.jpg",
    headline: { en: "This is *not* a wedding card!", hi: "ये शादी का कार्ड *नहीं* है!" },
  },
  banner: {},
  logo: {},
  "logo-wide": {},
};

export type PosterProps = { concept: ConceptId; lang: Lang; width: number; height: number };

const hi = (lang: Lang) => lang === "hi";

function Marked({ text }: { text: string }) {
  return (
    <>
      {text.split("*").map((part, i) => (
        <span key={i} style={i % 2 ? { color: color.marigold } : undefined}>
          {part}
        </span>
      ))}
    </>
  );
}

function Logo({
  size,
  lang,
  light = true,
  row = false,
}: {
  size: number;
  lang: Lang;
  light?: boolean;
  row?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: size * 0.3,
        flexDirection: row ? "row" : "column",
      }}
    >
      <Img
        src={staticFile("brand/shubh-icon.png")}
        style={{ width: size, height: size, borderRadius: size * 0.24 }}
      />
      <span
        style={{
          fontFamily: font.display,
          fontSize: size * 0.56,
          color: light ? color.nightInk : color.ink,
          whiteSpace: "nowrap",
        }}
      >
        {hi(lang) ? "शुभ इन्विटेशन" : "Shubh Invitation"}
      </span>
    </div>
  );
}

function Phone({ src, h, style }: { src: string; h: number; style?: CSSProperties }) {
  const w = Math.round((h - 28) * (1080 / 1920)) + 28;
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: w * 0.12,
        padding: 14,
        background: "#0c0a14",
        boxShadow: "0 50px 100px -30px rgba(0,0,0,0.85), inset 0 0 0 3px #2a2638",
        ...style,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: w * 0.1,
          display: "block",
        }}
      />
    </div>
  );
}

function AiTag({ lang, s }: { lang: Lang; s: number }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 28 * s,
        right: 28 * s,
        padding: `${5 * s}px ${12 * s}px`,
        borderRadius: 8 * s,
        background: "rgba(18,15,36,0.55)",
        fontFamily: font.sans,
        fontWeight: 600,
        fontSize: 20 * s,
        color: "rgba(246,236,216,0.85)",
      }}
    >
      {hi(lang) ? "AI से बनी तस्वीर" : "AI-generated image"}
    </div>
  );
}

function Words({
  c,
  lang,
  s,
  align = "center",
  width,
}: {
  c: Concept;
  lang: Lang;
  s: number;
  align?: "center" | "left";
  width?: number;
}) {
  return (
    <div
      style={{
        textAlign: align,
        width,
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        gap: 22 * s,
      }}
    >
      {c.step && (
        <div
          style={{
            width: 76 * s,
            height: 76 * s,
            borderRadius: 999,
            background: color.marigold,
            color: color.onMarigold,
            display: "grid",
            placeItems: "center",
            fontFamily: font.display,
            fontSize: 46 * s,
          }}
        >
          {c.step}
        </div>
      )}
      {c.headline && (
        <div
          style={{
            fontFamily: font.display,
            fontSize: (hi(lang) ? 70 : 76) * s,
            lineHeight: hi(lang) ? 1.3 : 1.12,
            color: color.nightInk,
            textShadow: "0 4px 30px rgba(0,0,0,0.45)",
          }}
        >
          <Marked text={c.headline[lang]} />
        </div>
      )}
      {c.sub && (
        <div
          style={{
            fontFamily: font.sans,
            fontWeight: 600,
            fontSize: 34 * s,
            lineHeight: 1.35,
            color: color.nightInk,
            opacity: 0.92,
          }}
        >
          {c.sub[lang]}
        </div>
      )}
      {c.cta && (
        <Button style={{ fontSize: 40 * s, padding: `${22 * s}px ${50 * s}px`, marginTop: 8 * s }}>
          {CTA[lang]}
        </Button>
      )}
    </div>
  );
}

function Painted({
  src = "suites/rajwada-bagh/cover.webp",
  dim = 0.6,
}: {
  src?: string;
  dim?: number;
}) {
  return (
    <AbsoluteFill style={{ backgroundColor: color.night, overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          inset: -40,
          width: "calc(100% + 80px)",
          height: "calc(100% + 80px)",
          objectFit: "cover",
          filter: "blur(24px) saturate(1.15)",
        }}
      />
      <AbsoluteFill style={{ background: `rgba(18,15,36,${dim})` }} />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(60% 50% at 70% 55%, rgba(240,164,49,0.25), rgba(18,15,36,0) 70%)",
        }}
      />
    </AbsoluteFill>
  );
}

const SUITES = [
  "rajwada-bagh",
  "tanjore",
  "kutch-toran",
  "noor-bagh",
  "pichwai",
  "rajbari",
  "peshwai-wada",
  "phulkari-haveli",
  "kayal",
];

function Wall({ cols, tile }: { cols: number; tile: number }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: -tile * 0.3,
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${tile}px)`,
        gap: tile * 0.08,
        transform: "rotate(-6deg) scale(1.1)",
        opacity: 0.9,
      }}
    >
      {Array.from({ length: cols * 6 }, (_, i) => (
        <Img
          key={i}
          src={staticFile(`suites/${SUITES[(i * 4) % SUITES.length]}/cover.webp`)}
          style={{ width: tile, height: tile * 1.6, objectFit: "cover", borderRadius: tile * 0.08 }}
        />
      ))}
    </div>
  );
}

function Brand({ lang, s, pos }: { lang: Lang; s: number; pos: CSSProperties }) {
  return (
    <div style={{ position: "absolute", ...pos }}>
      <Logo size={56 * s} lang={lang} row />
    </div>
  );
}

export function Poster({ concept, lang, width, height }: PosterProps) {
  const c = CONCEPTS[concept];
  const r = width / height;
  const s = Math.min(width, height) / 1080;
  const pad = Math.round(64 * s);

  if (concept === "logo") {
    return (
      <AbsoluteFill
        style={{ backgroundColor: color.paper, alignItems: "center", justifyContent: "center" }}
      >
        <Img
          src={staticFile("brand/shubh-icon.png")}
          style={{ width: width * 0.8, height: width * 0.8, borderRadius: width * 0.18 }}
        />
      </AbsoluteFill>
    );
  }
  if (concept === "logo-wide") {
    return (
      <AbsoluteFill
        style={{ backgroundColor: color.paper, alignItems: "center", justifyContent: "center" }}
      >
        <Logo size={height * 0.62} lang={lang} light={false} row />
      </AbsoluteFill>
    );
  }
  if (concept === "banner") {
    // YouTube shows only the middle 1235 × 338 everywhere; the rest is art for TVs
    return (
      <AbsoluteFill style={{ backgroundColor: color.night, overflow: "hidden" }}>
        <Wall cols={11} tile={260} />
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(50% 40% at 50% 50%, rgba(18,15,36,0.92), rgba(18,15,36,0.55) 70%, rgba(18,15,36,0.35))",
          }}
        />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 18 }}>
          <Logo size={120} lang="en" row />
          <div
            style={{
              fontFamily: font.sans,
              fontWeight: 600,
              fontSize: 38,
              color: color.nightAccent,
            }}
          >
            Painted wedding invitations for WhatsApp · {SITE}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  if (concept === "price") {
    // The video's price card, frozen once everything has landed, scaled to fit
    const fmt: FormatId = r < 0.7 ? "reel" : r < 0.95 ? "feed" : "square";
    const baseH = { reel: 1920, feed: 1350, square: 1080, wide: 1080 }[fmt];
    const k = width / 1080;
    return (
      <AbsoluteFill style={{ backgroundColor: color.night, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: (height - baseH * k) / 2,
            width: 1080,
            height: baseH,
            transform: `scale(${k})`,
            transformOrigin: "0 0",
          }}
        >
          <Freeze frame={400}>
            <PriceScene lang={lang} format={fmt} marks={[0, 60, 120]} />
          </Freeze>
          <div
            style={{ position: "absolute", top: fmt === "reel" ? 330 : 120, left: 64, right: 64 }}
          >
            <Words c={c} lang={lang} s={fmt === "square" ? 0.8 : 0.9} />
          </div>
        </div>
        <AiTag lang={lang} s={s} />
      </AbsoluteFill>
    );
  }

  // Carousel steps, gate, rsvp, YouTube: words and a phone showing the real site
  if (c.shot && !c.photo) {
    const wide = r > 1.05;
    if (concept === "c2") {
      return (
        <AbsoluteFill style={{ backgroundColor: color.night, overflow: "hidden" }}>
          <Wall cols={4} tile={300} />
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(180deg, rgba(18,15,36,0.92) 0%, rgba(18,15,36,0.75) 40%, rgba(18,15,36,0.3) 100%)",
            }}
          />
          <div style={{ position: "absolute", top: pad * 1.4, left: pad, right: pad }}>
            <Words c={c} lang={lang} s={s} />
          </div>
          <Brand lang={lang} s={s * 0.8} pos={{ bottom: pad, left: pad }} />
        </AbsoluteFill>
      );
    }
    if (wide) {
      const big = concept === "yt-gate";
      return (
        <AbsoluteFill>
          <Painted />
          <div
            style={{
              position: "absolute",
              left: pad * 1.2,
              top: 0,
              bottom: 0,
              width: width * 0.56,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Words
              c={{ ...c, sub: big ? undefined : c.sub }}
              lang={lang}
              s={s * (big ? 1.5 : 1.15)}
              align="left"
            />
          </div>
          <Phone
            src={c.shot}
            h={height * 1.05}
            style={{
              position: "absolute",
              right: width * 0.08,
              top: height * 0.08,
              transform: "rotate(5deg)",
            }}
          />
          <Brand lang={lang} s={s * 0.9} pos={{ top: pad * 0.6, left: pad * 1.2 }} />
        </AbsoluteFill>
      );
    }
    const tallPhone = r < 0.7;
    return (
      <AbsoluteFill>
        <Painted />
        <div
          style={{ position: "absolute", top: tallPhone ? 300 : pad * 1.2, left: pad, right: pad }}
        >
          <Words c={{ ...c, cta: tallPhone ? c.cta : false }} lang={lang} s={s} />
        </div>
        <Phone
          src={c.shot}
          h={tallPhone ? 1000 : height * 0.82}
          style={{
            position: "absolute",
            left: "50%",
            top: tallPhone ? 760 : height * (c.step ? 0.42 : 0.4),
            transform: `translateX(-50%) rotate(${c.step ? 0 : -3}deg)`,
          }}
        />
        {!tallPhone && c.cta && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: pad,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button style={{ fontSize: 40 * s, padding: `${22 * s}px ${50 * s}px` }}>
              {CTA[lang]}
            </Button>
          </div>
        )}
      </AbsoluteFill>
    );
  }

  // Photo concepts
  const photo = c.photo!;
  const landscapePhoto = photo.src === "ads/friends.jpg";
  if (r > 1.05) {
    // Wide: the photo on one side, words on the other (or over the photo if it is wide)
    const yt = concept === "yt-explainer";
    if (landscapePhoto && !yt) {
      return (
        <AbsoluteFill style={{ backgroundColor: color.night }}>
          <Img
            src={staticFile(photo.src)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "60% 40%",
            }}
          />
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(90deg, rgba(18,15,36,0.92) 0%, rgba(18,15,36,0.7) 38%, rgba(18,15,36,0) 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: pad,
              top: 0,
              bottom: 0,
              width: width * 0.48,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Words c={c} lang={lang} s={s * 0.9} align="left" />
          </div>
          <AiTag lang={lang} s={s} />
        </AbsoluteFill>
      );
    }
    const photoW = yt ? width * 0.48 : width * 0.44;
    return (
      <AbsoluteFill style={{ backgroundColor: color.night }}>
        <Img
          src={staticFile(photo.src)}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: photoW,
            height: "100%",
            objectFit: "cover",
            objectPosition: photo.pos,
          }}
        />
        <AbsoluteFill
          style={{
            background: `linear-gradient(90deg, rgba(18,15,36,0) ${(photoW / width) * 70}%, ${color.night} ${(photoW / width) * 100}%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: photoW + pad * 0.4,
            right: pad * 0.8,
            top: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Words c={c} lang={lang} s={s * (yt ? 1.45 : 0.9)} align="left" />
        </div>
        {yt && <Brand lang={lang} s={s * 0.9} pos={{ bottom: pad * 0.6, right: pad * 0.8 }} />}
        <AiTag lang={lang} s={s} />
      </AbsoluteFill>
    );
  }
  // Tall and square: the photo fills, words sit at the foot (Stories: above Meta's lower UI)
  const story = r < 0.7;
  return (
    <AbsoluteFill style={{ backgroundColor: color.night }}>
      <Img
        src={staticFile(photo.src)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: landscapePhoto ? "50% 40%" : photo.pos,
        }}
      />
      <AbsoluteFill
        style={{
          background: story
            ? "linear-gradient(180deg, rgba(18,15,36,0.75) 0%, rgba(18,15,36,0.2) 30%, rgba(18,15,36,0) 50%, rgba(18,15,36,0.5) 100%)"
            : "linear-gradient(180deg, rgba(18,15,36,0.25) 0%, rgba(18,15,36,0) 35%, rgba(18,15,36,0.88) 78%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: pad,
          right: pad,
          ...(story ? { top: 300 } : { bottom: pad * 1.1 }),
        }}
      >
        <Words c={c} lang={lang} s={s * (story ? 1 : 0.92)} />
      </div>
      {!story && <Brand lang={lang} s={s * 0.75} pos={{ top: pad * 0.6, left: pad * 0.8 }} />}
      <AiTag lang={lang} s={s} />
    </AbsoluteFill>
  );
}

export const POSTER_DEFAULTS: PosterProps = {
  concept: "mother",
  lang: "en",
  width: 1080,
  height: 1350,
};
