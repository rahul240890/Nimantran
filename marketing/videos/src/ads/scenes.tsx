import type { ReactNode } from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { color, font, SITE } from "../brand";
import type { Lang } from "../designs";
import { Button } from "../parts/brand";
import { clamp, easeOut } from "../parts/motion";
import { FORMATS, type FormatId } from "./formats";
import { Backdrop, Footage, Phone, phoneRect, type Rect } from "./parts";

/* The scenes that are drawn rather than filmed: the price card, the chat, the languages,
   the guest list, the wall of designs and the closing card. */

const hi = (lang: Lang) => lang === "hi";
const t = (lang: Lang, en: string, hiText: string) => (hi(lang) ? hiText : en);

/** Lays phone-screen content out at a fixed 564 px width and scales it to the phone. */
function Screen({ rect, children }: { rect: Rect; children: ReactNode }) {
  const inner = rect.w - 28;
  const s = inner / 564;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 564,
        height: (rect.h - 28) / s,
        transform: `scale(${s})`,
        transformOrigin: "0 0",
      }}
    >
      {children}
    </div>
  );
}

function usePop(at: number) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping: 16, stiffness: 190 } });
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

// ———————————————————————————— price

function Row({
  label,
  value,
  on,
  strong,
}: {
  label: string;
  value: string;
  on: number;
  strong?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "14px 0",
        borderTop: `2px solid ${color.line}`,
        opacity: on,
        transform: `translateY(${(1 - on) * 16}px)`,
      }}
    >
      <span style={{ fontFamily: font.sans, fontWeight: 600, fontSize: 36, color: color.inkMuted }}>
        {label}
      </span>
      <span
        style={{
          fontFamily: font.sans,
          fontWeight: 800,
          fontSize: strong ? 54 : 44,
          color: color.ink,
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function PriceScene({
  lang,
  format,
  marks,
}: {
  lang: Lang;
  format: FormatId;
  marks: number[];
}) {
  const frame = useCurrentFrame();
  const f = FORMATS[format];
  const [, second = 60, third = 120] = marks;
  const region: Rect =
    format === "wide"
      ? { x: 960, y: 110, w: 860, h: 860 }
      : format === "reel"
        ? { x: f.safe.side, y: 640, w: 1080 - 2 * f.safe.side, h: 600 }
        : format === "feed"
          ? { x: f.safe.side, y: 400, w: 1080 - 2 * f.safe.side, h: 830 }
          : { x: f.safe.side, y: 300, w: 1080 - 2 * f.safe.side, h: 690 };
  const rupees = Math.round(interpolate(frame, [6, 40], [0, 25000], { ...clamp, easing: easeOut }));
  const oldOn = usePop(4);
  const weeks = usePop(second);
  const shubh = usePop(third);
  const struck = interpolate(frame, [third - 6, third + 8], [0, 1], { ...clamp, easing: easeOut });
  const card = {
    background: color.paper,
    borderRadius: 32,
    padding: "26px 36px 14px",
    boxShadow: "0 30px 60px -20px rgba(0,0,0,0.7)",
  } as const;
  return (
    <AbsoluteFill>
      <Backdrop src="ads/mehendi.jpg" dim={0.5} blur={6} />
      <div
        style={{
          position: "absolute",
          left: region.x,
          top: region.y,
          width: region.w,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <div
          style={{
            ...card,
            position: "relative",
            opacity: 0.25 + 0.75 * oldOn * (1 - struck * 0.45),
            transform: `scale(${0.9 + 0.1 * oldOn})`,
          }}
        >
          <div
            style={{
              fontFamily: hi(lang) ? font.sans : font.label,
              fontWeight: hi(lang) ? 700 : 400,
              fontSize: 30,
              letterSpacing: hi(lang) ? 0 : "0.18em",
              textTransform: "uppercase",
              color: color.accentText,
              paddingBottom: 12,
            }}
          >
            {t(lang, "Printed cards", "छपे हुए कार्ड")}
          </div>
          <Row
            label={t(lang, "300 cards, printing, post", "300 कार्ड, छपाई, डाक")}
            value={`₹${rupees.toLocaleString("en-IN")}+`}
            on={1}
            strong
          />
          <Row
            label={t(lang, "Delivering them", "बाँटने में")}
            value={t(lang, "Weeks", "हफ़्ते")}
            on={weeks}
          />
          <div
            style={{
              position: "absolute",
              left: 20,
              right: 20,
              top: "54%",
              height: 10,
              borderRadius: 5,
              background: color.rose,
              transform: `scaleX(${struck}) rotate(-4deg)`,
              transformOrigin: "0 50%",
            }}
          />
        </div>
        <div
          style={{
            ...card,
            border: `5px solid ${color.marigold}`,
            opacity: shubh,
            transform: `translateY(${(1 - shubh) * 60}px)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 12 }}>
            <Img
              src={staticFile("brand/shubh-icon.png")}
              style={{ width: 54, height: 54, borderRadius: 13 }}
            />
            <span style={{ fontFamily: font.display, fontSize: 46, color: color.ink }}>
              {t(lang, "Shubh Invitation", "शुभ इन्विटेशन")}
            </span>
          </div>
          <Row
            label={t(lang, "To start", "शुरुआत")}
            value={t(lang, "Free", "मुफ़्त")}
            on={shubh}
            strong
          />
          <Row
            label={t(lang, "Paid designs, once", "पेड डिज़ाइन, एक बार")}
            value="₹499"
            on={shubh}
          />
          <Row
            label={t(lang, "Reaches every guest", "हर मेहमान तक")}
            value={t(lang, "Same day", "उसी दिन")}
            on={shubh}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ———————————————————————————— chat

function Ticks({ blue }: { blue: boolean }) {
  const c = blue ? color.whatsappTick : color.inkMuted;
  return (
    <svg width="34" height="20" viewBox="0 0 34 20" style={{ marginLeft: 6 }}>
      <path d="M2 11 L8 17 L20 3" stroke={c} strokeWidth="3" fill="none" />
      <path d="M13 13 L17 17 L30 3" stroke={c} strokeWidth="3" fill="none" />
    </svg>
  );
}

function Incoming({ name, text, on }: { name: string; text: string; on: number }) {
  return (
    <div
      style={{
        alignSelf: "flex-start",
        maxWidth: 400,
        background: "#fff",
        borderRadius: "0 22px 22px 22px",
        padding: "12px 18px",
        boxShadow: "0 2px 2px rgba(0,0,0,0.08)",
        opacity: on,
        transform: `translateY(${(1 - on) * 24}px)`,
      }}
    >
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 22, color: color.rose }}>
        {name}
      </div>
      <div style={{ fontFamily: font.sans, fontSize: 28, color: color.ink }}>{text}</div>
    </div>
  );
}

export function ChatScene({ lang, format }: { lang: Lang; format: FormatId }) {
  const frame = useCurrentFrame();
  const rect = phoneRect(format);
  const sent = usePop(6);
  const r1 = usePop(36);
  const r2 = usePop(58);
  return (
    <AbsoluteFill>
      <Backdrop src="suites/rajwada-bagh/cover.webp" />
      <Phone rect={rect}>
        <Screen rect={rect}>
          <div style={{ position: "absolute", inset: 0, background: color.whatsappChat }} />
          <div
            style={{
              position: "relative",
              height: 132,
              background: color.whatsappBar,
              display: "flex",
              alignItems: "flex-end",
              gap: 18,
              padding: "0 24px 20px",
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
                fontFamily: font.sans,
                fontWeight: 800,
                fontSize: 30,
                color: color.onMarigold,
              }}
            >
              {t(lang, "S", "श")}
            </div>
            <div style={{ fontFamily: font.sans, color: "#fff" }}>
              <div style={{ fontSize: 32, fontWeight: 700 }}>
                {t(lang, "Sharma Family", "शर्मा परिवार")}
              </div>
              <div style={{ fontSize: 22, opacity: 0.8 }}>{t(lang, "42 members", "42 सदस्य")}</div>
            </div>
          </div>
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 18,
              padding: "28px 22px",
            }}
          >
            <div
              style={{
                alignSelf: "flex-end",
                width: 430,
                background: color.whatsappBubble,
                borderRadius: "22px 0 22px 22px",
                padding: 10,
                boxShadow: "0 2px 2px rgba(0,0,0,0.08)",
                opacity: sent,
                transform: `translateY(${(1 - sent) * 40}px) scale(${0.94 + 0.06 * sent})`,
              }}
            >
              <div
                style={{ position: "relative", height: 300, borderRadius: 14, overflow: "hidden" }}
              >
                <Img
                  src={staticFile("shots/gate.jpg")}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "50% 24%",
                  }}
                />
              </div>
              <div
                style={{
                  background: "rgba(0,0,0,0.05)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  marginTop: 8,
                }}
              >
                <div
                  style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 26, color: color.ink }}
                >
                  {t(lang, "Arjun & Sia · Wedding invitation", "अर्जुन और सिया · शादी का निमंत्रण")}
                </div>
                <div style={{ fontFamily: font.sans, fontSize: 21, color: color.inkMuted }}>
                  {SITE}
                </div>
              </div>
              <div
                style={{
                  fontFamily: font.sans,
                  fontSize: 27,
                  color: color.ink,
                  padding: "10px 8px 2px",
                }}
              >
                {t(
                  lang,
                  "With joy, we invite you to Arjun and Sia's wedding.",
                  "अर्जुन और सिया की शादी में आप सादर आमंत्रित हैं।",
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  fontFamily: font.sans,
                  fontSize: 19,
                  color: color.inkMuted,
                  padding: "0 6px",
                }}
              >
                8:15 PM <Ticks blue={frame > 30} />
              </div>
            </div>
            <Incoming
              name={t(lang, "Neha", "नेहा")}
              text={t(lang, "So beautiful!", "कितना सुंदर!")}
              on={r1}
            />
            <Incoming
              name={t(lang, "Mama ji", "मामा जी")}
              text={t(lang, "We'll be there for every function", "हम हर रस्म में आएँगे")}
              on={r2}
            />
          </div>
        </Screen>
      </Phone>
    </AbsoluteFill>
  );
}

// ———————————————————————————— languages

const GREETINGS = [
  { text: "शुभ विवाह", label: "हिंदी · Hindi", face: font.display },
  { text: "Wedding Invitation", label: "English", face: font.names },
  { text: "શુભ લગ્ન", label: "ગુજરાતી · Gujarati", face: font.scripts },
  { text: "শুভ বিবাহ", label: "বাংলা · Bengali", face: font.scripts },
  { text: "திருமண அழைப்பிதழ்", label: "தமிழ் · Tamil", face: font.scripts },
  { text: "शुभमंगल सावधान", label: "मराठी · Marathi", face: font.display },
];

export function LanguagesScene({ lang, format }: { lang: Lang; format: FormatId }) {
  const frame = useCurrentFrame();
  const rect = phoneRect(format);
  const step = 20;
  const i = Math.floor(frame / step) % GREETINGS.length;
  const local = frame % step;
  const fade = interpolate(local, [0, 5, step - 4, step], [0, 1, 1, 0], clamp);
  const g = GREETINGS[i]!;
  const w = Math.min(rect.w + 160, format === "wide" ? 780 : 900);
  const cx = rect.x + rect.w / 2;
  // Tall formats keep the card above the caption
  const h = format === "wide" ? rect.h - 80 : rect.h - (format === "square" ? 220 : 250);
  const s = Math.min(1, h / 780);
  return (
    <AbsoluteFill>
      <Backdrop src="suites/tanjore/cover.webp" dim={0.55} />
      <div
        style={{
          position: "absolute",
          left: cx - w / 2,
          top: rect.y + (format === "wide" ? 40 : 20),
          width: w,
          height: h,
          borderRadius: 36,
          background: color.cardIvory,
          border: `6px double ${color.cardGold}`,
          boxShadow: "0 40px 80px -30px rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: color.cardInk,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
            textAlign: "center",
            transform: `scale(${s})`,
          }}
        >
          <div
            style={{
              height: 150,
              display: "grid",
              placeItems: "center",
              opacity: fade,
              transform: `translateY(${(1 - fade) * 12}px)`,
            }}
          >
            <div
              style={{
                fontFamily: g.face,
                fontSize: g.text.length > 14 ? 64 : 92,
                color: color.cardGoldText,
                lineHeight: 1.2,
                padding: "0 30px",
              }}
            >
              {g.text}
            </div>
          </div>
          <div
            style={{
              fontFamily: font.label,
              fontSize: 30,
              letterSpacing: "0.08em",
              color: color.cardInkMuted,
              opacity: fade,
            }}
          >
            {g.label}
          </div>
          <div style={{ width: 160, height: 3, background: color.cardGold, margin: "10px 0" }} />
          <div style={{ fontFamily: font.names, fontSize: 104, lineHeight: 1.05 }}>
            {t(lang, "Arjun", "अर्जुन")}
          </div>
          <div
            style={{
              fontFamily: font.names,
              fontStyle: "italic",
              fontSize: 54,
              color: color.cardGoldText,
            }}
          >
            &amp;
          </div>
          <div style={{ fontFamily: font.names, fontSize: 104, lineHeight: 1.05 }}>
            {t(lang, "Sia", "सिया")}
          </div>
          <div
            style={{
              fontFamily: font.sans,
              fontSize: 32,
              color: color.cardInkMuted,
              marginTop: 20,
              padding: "0 40px",
            }}
          >
            {t(lang, "Haldi · Mehendi · Sangeet · Wedding", "हल्दी · मेहंदी · संगीत · विवाह")}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ———————————————————————————— guest list

function Stat({ label, value, on }: { label: string; value: number; on: number }) {
  return (
    <div
      style={{
        flex: 1,
        background: color.paper,
        border: `2px solid ${color.line}`,
        borderRadius: 20,
        padding: "16px 10px",
        textAlign: "center",
      }}
    >
      <div style={{ fontFamily: font.display, fontSize: 56, color: color.ink }}>
        {Math.round(value * on)}
      </div>
      <div style={{ fontFamily: font.sans, fontWeight: 600, fontSize: 22, color: color.inkMuted }}>
        {label}
      </div>
    </div>
  );
}

export function GuestsScene({ lang, format }: { lang: Lang; format: FormatId }) {
  const frame = useCurrentFrame();
  const rect = phoneRect(format);
  const on = interpolate(frame, [6, 40], [0, 1], { ...clamp, easing: easeOut });
  const rows = [
    [t(lang, "Haldi", "हल्दी"), 64],
    [t(lang, "Mehendi", "मेहंदी"), 88],
    [t(lang, "Sangeet", "संगीत"), 126],
    [t(lang, "Wedding", "विवाह"), 212],
    [t(lang, "Reception", "रिसेप्शन"), 240],
  ] as const;
  return (
    <AbsoluteFill>
      <Backdrop src="suites/rajwada-bagh/cover.webp" />
      <Phone rect={rect}>
        <Screen rect={rect}>
          <div style={{ position: "absolute", inset: 0, background: color.surface2 }} />
          <div style={{ position: "relative", padding: "64px 28px 0" }}>
            <div
              style={{
                fontFamily: hi(lang) ? font.sans : font.label,
                fontWeight: hi(lang) ? 700 : 400,
                fontSize: 22,
                letterSpacing: hi(lang) ? 0 : "0.2em",
                textTransform: "uppercase",
                color: color.accentText,
              }}
            >
              {t(lang, "Arjun & Sia", "अर्जुन और सिया")}
            </div>
            <div
              style={{
                fontFamily: font.display,
                fontSize: 58,
                color: color.ink,
                margin: "6px 0 24px",
              }}
            >
              {t(lang, "Guest list", "गेस्ट लिस्ट")}
            </div>
            <div style={{ display: "flex", gap: 14 }}>
              <Stat label={t(lang, "Opened", "खोला")} value={268} on={on} />
              <Stat label={t(lang, "Replied", "जवाब दिया")} value={231} on={on} />
              <Stat label={t(lang, "Waiting", "बाकी")} value={37} on={on} />
            </div>
            <div
              style={{
                marginTop: 30,
                background: color.paper,
                borderRadius: 24,
                border: `2px solid ${color.line}`,
                padding: "8px 24px",
              }}
            >
              {rows.map(([name, n], i) => {
                const r = interpolate(frame, [14 + i * 6, 44 + i * 6], [0, 1], {
                  ...clamp,
                  easing: easeOut,
                });
                return (
                  <div
                    key={name}
                    style={{ padding: "16px 0", borderTop: i ? `2px solid ${color.line}` : "none" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontFamily: font.sans,
                        fontSize: 28,
                      }}
                    >
                      <span style={{ fontWeight: 700, color: color.ink }}>{name}</span>
                      <span style={{ color: color.success, fontWeight: 700 }}>
                        {Math.round(n * r)} {t(lang, "coming", "आ रहे")}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 10,
                        borderRadius: 5,
                        background: color.line,
                        marginTop: 10,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${(n / 260) * 100 * r}%`,
                          height: "100%",
                          background: color.marigold,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Screen>
      </Phone>
    </AbsoluteFill>
  );
}

// ———————————————————————————— designs

export function DesignsScene({ format, frames }: { format: FormatId; frames: number }) {
  const frame = useCurrentFrame();
  const rect = phoneRect(format);
  const { width, height } = FORMATS[format];
  const cols = format === "wide" ? 6 : 3;
  const tileW = width / cols + 20;
  const tileH = tileW * 1.6;
  const drift = interpolate(frame, [0, frames], [0, -tileH * 0.5], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: color.night, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: -20,
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${tileW}px)`,
          gap: 18,
          transform: `translateY(${drift}px) rotate(-6deg) scale(1.15)`,
          opacity: 0.85,
        }}
      >
        {Array.from({ length: cols * Math.ceil(height / tileH + 3) }, (_, i) => (
          <Img
            key={i}
            src={staticFile(`suites/${SUITES[i % SUITES.length]}/cover.webp`)}
            style={{ width: tileW, height: tileH, objectFit: "cover", borderRadius: 22 }}
          />
        ))}
      </div>
      <AbsoluteFill style={{ background: "rgba(18, 15, 36, 0.5)" }} />
      <Phone rect={rect}>
        <Footage clips={[{ file: "designs", at: 4.5 }]} frames={frames} />
      </Phone>
    </AbsoluteFill>
  );
}

// ———————————————————————————— closing card

export function EndScene({ lang, format, bg }: { lang: Lang; format: FormatId; bg: string }) {
  const f = FORMATS[format];
  const logo = usePop(0);
  const title = usePop(5);
  const cta = usePop(12);
  const top = { reel: f.safe.top + 40, feed: 170, square: 110, wide: 120 }[format];
  const big = format === "reel" ? 1 : format === "square" ? 0.82 : 0.9;
  return (
    <AbsoluteFill>
      <Backdrop src={bg} dim={0.74} blur={18} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          paddingTop: top,
          textAlign: "center",
          color: color.nightInk,
        }}
      >
        <Img
          src={staticFile("brand/shubh-icon.png")}
          style={{
            width: 150 * big,
            height: 150 * big,
            borderRadius: 36 * big,
            boxShadow: "0 20px 50px -10px rgba(0,0,0,0.6)",
            transform: `scale(${logo})`,
          }}
        />
        <div
          style={{
            fontFamily: font.display,
            fontSize: (hi(lang) ? 110 : 120) * big,
            lineHeight: 1.15,
            marginTop: 30 * big,
            opacity: title,
            transform: `translateY(${(1 - title) * 30}px)`,
          }}
        >
          {t(lang, "Shubh Invitation", "शुभ इन्विटेशन")}
        </div>
        <div
          style={{
            fontFamily: font.sans,
            fontSize: 44 * big,
            color: color.nightAccent,
            marginTop: 10,
            opacity: title,
          }}
        >
          {t(lang, "Invitations that come alive.", "निमंत्रण, जो जीवंत हो उठें।")}
        </div>
        <div style={{ marginTop: 56 * big, opacity: cta, transform: `scale(${0.9 + 0.1 * cta})` }}>
          <Button style={{ fontSize: 50 * big, padding: `${30 * big}px ${66 * big}px` }}>
            {t(lang, "Make yours free", "मुफ़्त में बनाइए")}
          </Button>
        </div>
        <div
          style={{
            fontFamily: font.sans,
            fontWeight: 700,
            fontSize: 40 * big,
            marginTop: 34 * big,
            opacity: cta,
          }}
        >
          {SITE}
        </div>
        <div
          style={{
            fontFamily: font.sans,
            fontSize: 30 * big,
            color: color.nightInkMuted,
            marginTop: 14,
            opacity: cta,
            padding: "0 60px",
          }}
        >
          {t(
            lang,
            "Free to start · Paid designs from ₹499, once",
            "मुफ़्त शुरुआत · पेड डिज़ाइन ₹499 से, एक बार",
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
