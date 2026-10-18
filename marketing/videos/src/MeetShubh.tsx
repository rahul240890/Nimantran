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
import { DESIGNS, type Lang } from "./designs";
import { BRAND_WORDS, EndCard } from "./parts/brand";
import { Gate } from "./parts/gate";
import { EventCard, Plaque } from "./parts/invite";
import { clamp, CrossFade, easeInOut, musicVolume, Painted, Rise } from "./parts/motion";

/*
 * Meet Shubh (9:16, 32 seconds): the trailer for the channel. A PDF card is set aside for a
 * link that opens; the gate, the pages, the one-tap reply and the live guest list follow,
 * then traditions and languages, the three steps and where to start. All of it is what the
 * site does today (nimantran/docs/PRODUCT.md, "Built so far"), in the site's own words.
 */

export type MeetShubhProps = { lang: Lang };

const W = {
  hook: {
    en: "Still sending your\nwedding card as a PDF?",
    hi: "अब भी शादी का कार्ड\nPDF में भेज रहे हैं?",
  },
  replyBubble: { en: "So beautiful! We'll be there", hi: "बहुत सुंदर! हम ज़रूर आएँगे" },
  answer: { en: "Send one that opens.", hi: "ऐसा भेजिए, जो खुले।" },
  link: { en: "One link on WhatsApp", hi: "WhatsApp पर बस एक लिंक" },
  chatName: { en: "Sia's family", hi: "सिया का परिवार" },
  chatText: {
    en: "Namaste! With joy, we invite you to Arjun and Sia's wedding.",
    hi: "नमस्ते! अर्जुन और सिया के विवाह में आप सादर आमंत्रित हैं।",
  },
  previewTitle: { en: "Arjun & Sia · Wedding invitation", hi: "अर्जुन & सिया · विवाह निमंत्रण" },
  previewDate: { en: "Saturday, 13 February 2027 · Jaipur", hi: "शनिवार, 13 फ़रवरी 2027 · जयपुर" },
  gate: { en: "Guests open a gate, not a file", hi: "मेहमान फ़ाइल नहीं, द्वार खोलते हैं" },
  pages: { en: "A painted page for every function", hi: "हर रस्म का अपना चित्रित पन्ना" },
  reply: { en: "Guests reply in one tap. No app.", hi: "एक टैप में जवाब। कोई ऐप नहीं।" },
  live: { en: "You see who's coming, as it happens", hi: "कौन आ रहा है, उसी पल दिखता है" },
  traditions: { en: "Your tradition. Your language.", hi: "आपकी परंपरा। आपकी भाषा।" },
  traditionsNote: {
    en: "The site in six languages. Cards in any Indian language, even two side by side.",
    hi: "वेबसाइट छह भाषाओं में। कार्ड किसी भी भारतीय भाषा में, दो भाषाएँ साथ-साथ भी।",
  },
  steps: { en: "Ready in three steps", hi: "तीन क़दम में तैयार" },
  stepList: {
    en: ["Pick a design", "Add your details", "Share and track"],
    hi: ["डिज़ाइन चुनें", "अपना ब्योरा जोड़ें", "भेजें और देखें"],
  },
  stepNotes: {
    en: ["By occasion and tradition", "Names, dates and venues", "One link, replies as they come"],
    hi: ["अवसर और परंपरा से", "नाम, तारीख़ें और जगह", "एक लिंक, जवाब आते ही दिखें"],
  },
  proof: {
    en: ["Create free", "No app for guests", "Pay once, no subscription"],
    hi: ["मुफ़्त बनाइए", "मेहमानों को ऐप नहीं चाहिए", "एक बार भुगतान, कोई सब्सक्रिप्शन नहीं"],
  },
  start: { en: "Start your invite", hi: "अपना निमंत्रण बनाइए" },
  rsvp: {
    heading: { en: "Will you join us?", hi: "क्या आप पधारेंगे?" },
    intro: { en: "Reply for each celebration.", hi: "हर उत्सव के लिए जवाब दें।" },
    coming: { en: "Coming", hi: "आ रहे हैं" },
    cant: { en: "Can't come", hi: "नहीं आ पाएँगे" },
    adults: { en: "Adults", hi: "बड़े" },
    send: { en: "Send reply", hi: "जवाब भेजें" },
    thanks: { en: "Thank you, Mehra family!", hi: "धन्यवाद, मेहरा परिवार!" },
    functions: { en: ["Haldi", "Sangeet", "Wedding"], hi: ["हल्दी", "संगीत", "विवाह"] },
  },
  list: {
    title: { en: "Guest list", hi: "मेहमान सूची" },
    opened: { en: "Opened", hi: "खोला" },
    replied: { en: "Replied", hi: "जवाब दिया" },
    waiting: { en: "Waiting", hi: "इंतज़ार" },
    newest: { en: "Mehra family · 3 coming", hi: "मेहरा परिवार · 3 आ रहे हैं" },
    now: { en: "just now", hi: "अभी" },
    others: {
      en: ["Sharma family · 4 coming", "Iyer family · 2 coming", "Patel family · Maybe"],
      hi: ["शर्मा परिवार · 4 आ रहे हैं", "अय्यर परिवार · 2 आ रहे हैं", "पटेल परिवार · शायद"],
    },
  },
} as const;

/* The scenes, each starting as the one before fades */
const SCENES = [
  { id: "hook", length: 90 },
  { id: "chat", length: 120 },
  { id: "gate", length: 132 },
  { id: "pages", length: 168 },
  { id: "rsvp", length: 180 },
  { id: "traditions", length: 138 },
  { id: "steps", length: 96 },
  { id: "end", length: 144 },
] as const;
const OVERLAP = 12;

function plan() {
  let at = 0;
  return SCENES.map((scene) => {
    const start = at;
    at += scene.length - OVERLAP;
    return { ...scene, start };
  });
}

export const TRAILER_FRAMES = (() => {
  const last = plan().at(-1)!;
  return last.start + last.length;
})();

const hi = (lang: Lang) => lang === "hi";

/** A big line at the top of the frame, clear of the apps' own buttons below. */
function Headline({
  children,
  lang,
  delay = 0,
  top = 190,
}: {
  children: ReactNode;
  lang: Lang;
  delay?: number;
  top?: number;
}) {
  return (
    <div style={{ position: "absolute", top, left: 50, right: 50, textAlign: "center" }}>
      <Rise delay={delay}>
        <div
          style={{
            fontFamily: font.display,
            fontSize: hi(lang) ? 84 : 82,
            lineHeight: hi(lang) ? 1.3 : 1.12,
            color: color.nightInk,
            whiteSpace: "pre-line",
          }}
        >
          {children}
        </div>
      </Rise>
    </div>
  );
}

/** Words over a painting, on a soft dark foot. */
function Caption({
  children,
  lang,
  delay = 4,
}: {
  children: ReactNode;
  lang: Lang;
  delay?: number;
}) {
  return (
    <>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, transparent 50%, rgba(18,15,36,0.85) 72%, rgba(18,15,36,0.92))",
        }}
      />
      <div style={{ position: "absolute", top: 1240, left: 80, right: 80, textAlign: "center" }}>
        <Rise delay={delay}>
          <div
            style={{
              fontFamily: font.display,
              fontSize: hi(lang) ? 80 : 86,
              lineHeight: hi(lang) ? 1.3 : 1.12,
              color: color.nightInk,
            }}
          >
            {children}
          </div>
        </Rise>
      </div>
    </>
  );
}

/** A phone, drawn simply: a dark bezel round whatever screen it holds. */
function Phone({
  children,
  top = 440,
  style,
}: {
  children: ReactNode;
  top?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: (1080 - 700) / 2,
        width: 700,
        height: 1160,
        borderRadius: 86,
        padding: 16,
        background: "#0c0a14",
        boxShadow: "0 50px 100px -30px rgba(0,0,0,0.8), inset 0 0 0 3px #2a2638",
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 72,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** A tap: a ring that grows and fades where the finger lands. */
function Tap({ at, x, y }: { at: number; x: number; y: number }) {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 16], [0, 1], clamp);
  if (frame < at || t >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 50,
        top: y - 50,
        width: 100,
        height: 100,
        borderRadius: 999,
        border: "8px solid rgba(255,255,255,0.95)",
        background: "rgba(255,255,255,0.25)",
        transform: `scale(${0.5 + t})`,
        opacity: 1 - t,
      }}
    />
  );
}

function HookScene({ lang }: { lang: Lang }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const struck = interpolate(frame, [40, 50], [0, 1], { ...clamp, easing: easeInOut });
  const away = spring({ frame: frame - 52, fps, config: { damping: 200 }, durationInFrames: 20 });
  const wobble = Math.sin(frame / 3) * 1.5 * (1 - struck);
  return (
    <AbsoluteFill style={{ backgroundColor: color.night }}>
      <Headline lang={lang} delay={2}>
        {W.hook[lang]}
      </Headline>
      {/* A PDF attachment, as it arrives in a chat */}
      <div
        style={{
          position: "absolute",
          top: 760,
          left: 190,
          width: 700,
          transform: `rotate(${wobble - away * 8}deg) translateY(${away * 120}px) scale(${1 - away * 0.25})`,
          opacity: 1 - away,
        }}
      >
        <Rise delay={6}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 30,
              padding: 34,
              borderRadius: 28,
              background: color.whatsappBubble,
              boxShadow: "0 20px 40px -20px rgba(0,0,0,0.6)",
            }}
          >
            <div
              style={{
                width: 110,
                height: 130,
                borderRadius: 14,
                background: "#e5533d",
                color: "#fff",
                display: "grid",
                placeItems: "center",
                fontFamily: font.sans,
                fontWeight: 800,
                fontSize: 34,
              }}
            >
              PDF
            </div>
            <div style={{ fontFamily: font.sans, color: "#1f2c34" }}>
              <div style={{ fontSize: 36, fontWeight: 700 }}>Wedding_Card_Final_v3.pdf</div>
              <div style={{ fontSize: 30, color: "#667781", marginTop: 8 }}>8 pages · 14 MB</div>
            </div>
          </div>
        </Rise>
        {/* Struck through */}
        <div
          style={{
            position: "absolute",
            left: -20,
            top: "50%",
            height: 12,
            width: `${struck * 106}%`,
            borderRadius: 6,
            background: color.rose,
            transform: "rotate(-6deg)",
          }}
        />
      </div>
      <div style={{ position: "absolute", top: 1010, left: 70, right: 70, textAlign: "center" }}>
        <Rise delay={54}>
          <div
            style={{
              fontFamily: font.display,
              fontSize: hi(lang) ? 104 : 116,
              lineHeight: 1.2,
              color: color.marigold,
            }}
          >
            {W.answer[lang]}
          </div>
        </Rise>
      </div>
    </AbsoluteFill>
  );
}

function ChatScene({ lang }: { lang: Lang }) {
  const frame = useCurrentFrame();
  const design = DESIGNS["rajwada-bagh"]!;
  const couple = design.couple[lang];
  // After the tap, the phone zooms into the link preview
  const zoom = interpolate(frame, [86, 120], [1, 2.6], { ...clamp, easing: easeInOut });
  return (
    <AbsoluteFill style={{ backgroundColor: color.night }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "50% 52%" }}>
        <Headline lang={lang} delay={0}>
          {W.link[lang]}
        </Headline>
        <Phone>
          <AbsoluteFill style={{ background: color.whatsappChat }}>
            {/* The chat's header */}
            <div
              style={{
                height: 150,
                background: "#0b5c4d",
                display: "flex",
                alignItems: "flex-end",
                padding: "0 30px 24px",
                gap: 22,
              }}
            >
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 999,
                  background: color.marigold,
                  display: "grid",
                  placeItems: "center",
                  fontFamily: font.sans,
                  fontWeight: 800,
                  fontSize: 34,
                  color: color.onMarigold,
                }}
              >
                {hi(lang) ? "सि" : "S"}
              </div>
              <div style={{ fontFamily: font.sans, color: "#fff" }}>
                <div style={{ fontSize: 34, fontWeight: 700 }}>{W.chatName[lang]}</div>
                <div style={{ fontSize: 24, opacity: 0.8 }}>online</div>
              </div>
            </div>
            <div style={{ position: "absolute", top: 210, left: 26, right: 90 }}>
              <Rise delay={14} distance={30}>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "0 24px 24px 24px",
                    padding: 14,
                    boxShadow: "0 2px 2px rgba(0,0,0,0.08)",
                  }}
                >
                  {/* The link preview the site draws in the design's colours */}
                  <div
                    style={{
                      position: "relative",
                      height: 330,
                      borderRadius: 16,
                      overflow: "hidden",
                    }}
                  >
                    <Img
                      src={staticFile(design.cover.src)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "50% 30%",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "grid",
                        placeItems: "center",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: font.names,
                          fontSize: hi(lang) ? 64 : 70,
                          color: design.cover.namesColor,
                          textShadow: design.cover.shadow,
                          lineHeight: 1.1,
                        }}
                      >
                        {couple.first}{" "}
                        <span style={{ fontStyle: "italic", color: color.rose }}>&amp;</span>{" "}
                        {couple.second}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#f5f6f6",
                      margin: "0 0 0",
                      padding: "16px 18px",
                      borderRadius: "0 0 12px 12px",
                      fontFamily: font.sans,
                    }}
                  >
                    <div style={{ fontSize: 28, fontWeight: 700, color: "#111b21" }}>
                      {W.previewTitle[lang]}
                    </div>
                    <div style={{ fontSize: 24, color: "#667781", marginTop: 4 }}>
                      {W.previewDate[lang]}
                    </div>
                    <div style={{ fontSize: 22, color: "#667781", marginTop: 4 }}>{SITE}</div>
                  </div>
                  <div
                    style={{
                      fontFamily: font.sans,
                      fontSize: 28,
                      color: "#111b21",
                      padding: "16px 8px 4px",
                      lineHeight: 1.35,
                    }}
                  >
                    {W.chatText[lang]}
                  </div>
                  <div
                    style={{
                      fontFamily: font.sans,
                      fontSize: 26,
                      color: "#027eb5",
                      padding: "0 8px",
                    }}
                  >
                    {SITE}/sample/rajwada-bagh
                  </div>
                  <div
                    style={{
                      fontFamily: font.sans,
                      fontSize: 22,
                      color: "#667781",
                      textAlign: "right",
                      padding: "4px 8px 0",
                    }}
                  >
                    10:24
                  </div>
                </div>
              </Rise>
            </div>
            {/* The guest answers before even opening it */}
            <div style={{ position: "absolute", bottom: 60, right: 26, maxWidth: 480 }}>
              <Rise delay={40} distance={30}>
                <div
                  style={{
                    background: color.whatsappBubble,
                    borderRadius: "24px 0 24px 24px",
                    padding: "18px 24px",
                    fontFamily: font.sans,
                    fontSize: 30,
                    color: "#111b21",
                    boxShadow: "0 2px 2px rgba(0,0,0,0.08)",
                  }}
                >
                  {W.replyBubble[lang]}
                  <span style={{ fontSize: 22, color: "#667781", marginLeft: 16 }}>10:25</span>
                </div>
              </Rise>
            </div>
          </AbsoluteFill>
        </Phone>
        <Tap at={72} x={540} y={870} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

function GateScene({ lang }: { lang: Lang }) {
  const frame = useCurrentFrame();
  const design = DESIGNS["rajwada-bagh"]!;
  const open = interpolate(frame, [30, 90], [0, 1], { ...clamp, easing: easeInOut });
  const push = interpolate(frame, [0, 30, 132], [1, 1.03, 1.6], { ...clamp, easing: easeInOut });
  return (
    <AbsoluteFill>
      <Gate gate={design.gate.id} hole={design.gate.hole} open={open} push={push}>
        <Plaque design={design} lang={lang} opacity={interpolate(frame, [24, 38], [1, 0], clamp)} />
      </Gate>
      <Caption lang={lang} delay={20}>
        {W.gate[lang]}
      </Caption>
    </AbsoluteFill>
  );
}

/** Four functions from four designs, each painting with its card. */
const MONTAGE = [
  { design: "rajwada-bagh", page: 0 },
  { design: "kutch-toran", page: 2 },
  { design: "tanjore", page: 3 },
  { design: "rajwada-bagh", page: 3 },
] as const;

function PagesScene({ lang }: { lang: Lang }) {
  // Four pages, each fading into the next, inside the scene's 168 frames
  const each = 48;
  return (
    <AbsoluteFill style={{ backgroundColor: color.night }}>
      {MONTAGE.map(({ design: id, page }, i) => {
        const design = DESIGNS[id]!;
        return (
          <Sequence key={i} from={i * (each - 9)} durationInFrames={each}>
            <CrossFade duration={each} fade={9} fadeIn={i > 0} fadeOut={i < MONTAGE.length - 1}>
              <Painted
                src={design.pages[page]!.src}
                from={1}
                to={1.06}
                duration={each}
                style={design.keepTop ? { transformOrigin: "50% 0%" } : undefined}
              />
              <EventCard design={design} page={design.pages[page]!} lang={lang} />
            </CrossFade>
          </Sequence>
        );
      })}
      <Caption lang={lang} delay={6}>
        {W.pages[lang]}
      </Caption>
    </AbsoluteFill>
  );
}

function Choice({ chosen, children }: { chosen: number; children: ReactNode }) {
  return (
    <div
      style={{
        flex: 1,
        textAlign: "center",
        padding: "18px 0",
        borderRadius: 999,
        border: `3px solid ${chosen > 0.5 ? color.marigoldEdge : color.line}`,
        background: chosen > 0.5 ? color.marigold : "#fff",
        fontFamily: font.sans,
        fontWeight: 700,
        fontSize: 28,
        color: color.ink,
        transform: `scale(${1 + Math.sin(chosen * Math.PI) * 0.06})`,
      }}
    >
      {children}
    </div>
  );
}

function RsvpScene({ lang }: { lang: Lang }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const taps = [26, 38, 50];
  const adults = frame < 64 ? 1 : frame < 72 ? 2 : 3;
  const sent = frame >= 92;
  const list = spring({ frame: frame - 112, fps, config: { damping: 200 }, durationInFrames: 24 });
  return (
    <AbsoluteFill style={{ backgroundColor: color.night }}>
      <div style={{ opacity: 1 - list }}>
        <Headline lang={lang}>{W.reply[lang]}</Headline>
      </div>
      <div style={{ opacity: list }}>
        <Headline lang={lang} delay={112}>
          {W.live[lang]}
        </Headline>
      </div>
      <Phone>
        <AbsoluteFill style={{ background: color.paper, padding: "90px 48px 0" }}>
          <div style={{ fontFamily: font.display, fontSize: 62, color: color.ink }}>
            {W.rsvp.heading[lang]}
          </div>
          <div style={{ fontFamily: font.sans, fontSize: 28, color: color.inkMuted, marginTop: 6 }}>
            {W.rsvp.intro[lang]}
          </div>
          {W.rsvp.functions[lang].map((name, i) => {
            const chosen = interpolate(frame, [taps[i]!, taps[i]! + 6], [0, 1], clamp);
            return (
              <div
                key={name}
                style={{
                  marginTop: i === 0 ? 40 : 26,
                  padding: 24,
                  borderRadius: 28,
                  background: "#fff",
                  border: `2px solid ${color.line}`,
                }}
              >
                <div style={{ fontFamily: font.display, fontSize: 40, color: color.ink }}>
                  {name}
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
                  <Choice chosen={chosen}>
                    {(chosen > 0.5 ? "✓ " : "") + W.rsvp.coming[lang]}
                  </Choice>
                  <Choice chosen={0}>{W.rsvp.cant[lang]}</Choice>
                </div>
              </div>
            );
          })}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 30,
              fontFamily: font.sans,
              fontSize: 32,
              color: color.ink,
            }}
          >
            <span style={{ fontWeight: 700 }}>{W.rsvp.adults[lang]}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 26 }}>
              <span
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 999,
                  border: `3px solid ${color.line}`,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 40,
                }}
              >
                −
              </span>
              <span style={{ fontWeight: 800, fontSize: 40, width: 30, textAlign: "center" }}>
                {adults}
              </span>
              <span
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 999,
                  border: `3px solid ${color.line}`,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 40,
                }}
              >
                +
              </span>
            </span>
          </div>
          <div
            style={{
              marginTop: 36,
              padding: "26px 0",
              borderRadius: 999,
              textAlign: "center",
              fontFamily: font.sans,
              fontWeight: 800,
              fontSize: 34,
              background: sent ? color.success : color.marigold,
              color: sent ? "#fff" : color.onMarigold,
              boxShadow: sent ? "none" : `inset 0 -6px 0 ${color.marigoldEdge}`,
            }}
          >
            {sent ? `✓ ${W.rsvp.thanks[lang]}` : W.rsvp.send[lang]}
          </div>
          {/* The host's guest list slides up over the reply */}
          <AbsoluteFill
            style={{
              background: color.paper,
              transform: `translateY(${(1 - list) * 100}%)`,
              padding: "120px 44px 0",
            }}
          >
            <div style={{ fontFamily: font.display, fontSize: 58, color: color.ink }}>
              {W.list.title[lang]}
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 28 }}>
              {(
                [
                  [W.list.opened[lang], 142],
                  [W.list.replied[lang], 97],
                  [W.list.waiting[lang], 45],
                ] as const
              ).map(([label, count]) => (
                <div
                  key={label}
                  style={{
                    flex: 1,
                    padding: "22px 16px",
                    borderRadius: 24,
                    background: "#fff",
                    border: `2px solid ${color.line}`,
                  }}
                >
                  <div style={{ fontFamily: font.display, fontSize: 56, color: color.ink }}>
                    {count}
                  </div>
                  <div style={{ fontFamily: font.sans, fontSize: 24, color: color.inkMuted }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 16 }}>
              <Rise delay={130} distance={-30}>
                <div
                  style={{
                    padding: "22px 24px",
                    borderRadius: 22,
                    background: color.goldGlint,
                    border: `3px solid ${color.marigold}`,
                    fontFamily: font.sans,
                    fontSize: 28,
                    color: color.ink,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontWeight: 700 }}>{W.list.newest[lang]}</span>
                  <span style={{ color: color.accentText }}>{W.list.now[lang]}</span>
                </div>
              </Rise>
              {W.list.others[lang].map((row) => (
                <div
                  key={row}
                  style={{
                    padding: "22px 24px",
                    borderRadius: 22,
                    background: "#fff",
                    border: `2px solid ${color.line}`,
                    fontFamily: font.sans,
                    fontSize: 28,
                    color: color.ink,
                  }}
                >
                  {row}
                </div>
              ))}
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      </Phone>
      {taps.map((at, i) => (
        <Tap key={at} at={at} x={393} y={822 + 210 * i} />
      ))}
      <Tap at={68} x={794} y={1367} />
      <Tap at={88} x={540} y={1481} />
    </AbsoluteFill>
  );
}

const TILES = [
  {
    src: "suites/rajwada-bagh/cover.webp",
    word: "शुभ विवाह",
    label: { en: "Rajasthani", hi: "राजस्थानी" },
  },
  {
    src: "suites/kutch-toran/cover.webp",
    word: "શુભ લગ્ન",
    label: { en: "Gujarati", hi: "गुजराती" },
  },
  { src: "suites/peshwai-wada/cover.webp", word: "शुभमंगल", label: { en: "Marathi", hi: "मराठी" } },
  { src: "suites/rajbari/cover.webp", word: "শুভ বিবাহ", label: { en: "Bengali", hi: "बंगाली" } },
  { src: "suites/tanjore/cover.webp", word: "திருமணம்", label: { en: "Tamil", hi: "तमिल" } },
  { src: "suites/noor-bagh/cover.webp", word: "Nikah", label: { en: "Muslim", hi: "निकाह" } },
] as const;

function TraditionsScene({ lang }: { lang: Lang }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: color.night }}>
      <Headline lang={lang} top={170}>
        {W.traditions[lang]}
      </Headline>
      <div
        style={{
          position: "absolute",
          top: 420,
          left: 60,
          right: 60,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 22,
        }}
      >
        {TILES.map((tile, i) => {
          const pop = spring({
            frame: frame - 6 - i * 5,
            fps,
            config: { damping: 14, mass: 0.6 },
            durationInFrames: 30,
          });
          return (
            <div
              key={tile.src}
              style={{
                position: "relative",
                height: 440,
                borderRadius: 28,
                overflow: "hidden",
                transform: `scale(${0.7 + 0.3 * pop})`,
                opacity: Math.min(1, pop * 1.4),
                boxShadow: "0 20px 40px -20px rgba(0,0,0,0.8)",
              }}
            >
              <Img
                src={staticFile(tile.src)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, transparent 45%, rgba(18,15,36,0.9))",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 26,
                  textAlign: "center",
                  color: color.nightInk,
                }}
              >
                <div
                  style={{
                    fontFamily: tile.word === "Nikah" ? font.names : font.scripts,
                    fontSize: 48,
                    lineHeight: 1.3,
                  }}
                >
                  {tile.word}
                </div>
                <div
                  style={{
                    fontFamily: hi(lang) ? font.sans : font.label,
                    fontSize: 24,
                    letterSpacing: hi(lang) ? 0 : "0.16em",
                    textTransform: "uppercase",
                    color: color.nightAccent,
                    marginTop: 4,
                  }}
                >
                  {tile.label[lang]}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 1370, left: 90, right: 90, textAlign: "center" }}>
        <Rise delay={40}>
          <div
            style={{
              fontFamily: font.sans,
              fontSize: 44,
              lineHeight: 1.4,
              color: color.nightInkMuted,
            }}
          >
            {W.traditionsNote[lang]}
          </div>
        </Rise>
      </div>
    </AbsoluteFill>
  );
}

function StepsScene({ lang }: { lang: Lang }) {
  return (
    <AbsoluteFill style={{ backgroundColor: color.night }}>
      <Headline lang={lang} top={260}>
        {W.steps[lang]}
      </Headline>
      <div
        style={{
          position: "absolute",
          top: 520,
          left: 90,
          right: 90,
          display: "flex",
          flexDirection: "column",
          gap: 40,
        }}
      >
        {W.stepList[lang].map((step, i) => (
          <Rise key={step} delay={8 + i * 12}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 36,
                padding: "34px 40px",
                borderRadius: 36,
                background: color.nightSurface,
                border: `2px solid ${color.nightLine}`,
              }}
            >
              <div
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: 999,
                  background: color.marigold,
                  color: color.onMarigold,
                  display: "grid",
                  placeItems: "center",
                  fontFamily: font.display,
                  fontSize: 64,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: font.display,
                    fontSize: 64,
                    lineHeight: 1.2,
                    color: color.nightInk,
                  }}
                >
                  {step}
                </div>
                <div
                  style={{
                    fontFamily: font.sans,
                    fontSize: 36,
                    color: color.nightInkMuted,
                    marginTop: 4,
                  }}
                >
                  {W.stepNotes[lang][i]}
                </div>
              </div>
            </div>
          </Rise>
        ))}
      </div>
    </AbsoluteFill>
  );
}

export function MeetShubh({ lang }: MeetShubhProps) {
  const scenes = plan();
  return (
    <AbsoluteFill style={{ backgroundColor: color.night }}>
      {scenes.map((scene, i) => (
        <Sequence key={scene.id} from={scene.start} durationInFrames={scene.length}>
          <CrossFade
            duration={scene.length}
            fade={OVERLAP}
            fadeIn={i > 0}
            fadeOut={i < scenes.length - 1}
          >
            {scene.id === "hook" && <HookScene lang={lang} />}
            {scene.id === "chat" && <ChatScene lang={lang} />}
            {scene.id === "gate" && <GateScene lang={lang} />}
            {scene.id === "pages" && <PagesScene lang={lang} />}
            {scene.id === "rsvp" && <RsvpScene lang={lang} />}
            {scene.id === "traditions" && <TraditionsScene lang={lang} />}
            {scene.id === "steps" && <StepsScene lang={lang} />}
            {scene.id === "end" && (
              <EndCard
                lang={lang}
                background="suites/rajwada-bagh/cover.webp"
                title={BRAND_WORDS.name[lang]}
                subtitle={BRAND_WORDS.tagline[lang]}
                points={[...W.proof[lang]]}
                action={W.start[lang]}
              />
            )}
          </CrossFade>
        </Sequence>
      ))}
      <Html5Audio
        src={staticFile("music/yaman.wav")}
        volume={(f) => musicVolume(f, TRAILER_FRAMES)}
      />
    </AbsoluteFill>
  );
}
