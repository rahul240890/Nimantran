import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { color, font, HANDLE, SITE } from "../brand";
import type { Lang } from "../designs";
import { clamp, Rise } from "./motion";

/* Shubh's own marks in a video: the small badge on top, the chip, and the closing card. */

export const BRAND_WORDS = {
  name: { en: "Shubh Invitation", hi: "शुभ इन्विटेशन" },
  tagline: { en: "Invitations that come alive.", hi: "निमंत्रण, जो जीवंत हो उठें।" },
  linkInBio: { en: "Link in bio", hi: "लिंक बायो में" },
} as const;

/** The logo and name, small, at the top: who the video is from, without covering the art. */
export function BrandBadge({ lang, opacity = 1 }: { lang: Lang; opacity?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 120,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "12px 30px 12px 14px",
          borderRadius: 999,
          background: "rgba(18, 15, 36, 0.55)",
          border: "2px solid rgba(246, 236, 216, 0.25)",
        }}
      >
        <Img
          src={staticFile("brand/shubh-icon.png")}
          style={{ width: 56, height: 56, borderRadius: 14 }}
        />
        <span
          style={{
            fontFamily: lang === "hi" ? font.sans : font.label,
            fontWeight: lang === "hi" ? 600 : 400,
            fontSize: 30,
            letterSpacing: lang === "hi" ? 0 : "0.14em",
            textTransform: "uppercase",
            color: color.nightInk,
          }}
        >
          {BRAND_WORDS.name[lang]}
        </span>
      </div>
    </div>
  );
}

/** Small spaced capitals in marigold, the site's eyebrow. */
export function Eyebrow({
  children,
  lang,
  style,
}: {
  children: ReactNode;
  lang: Lang;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        fontFamily: lang === "hi" ? font.sans : font.label,
        fontWeight: lang === "hi" ? 700 : 400,
        fontSize: lang === "hi" ? 40 : 34,
        letterSpacing: lang === "hi" ? 0 : "0.24em",
        textTransform: "uppercase",
        color: color.marigold,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** The site's primary button: marigold with its pressed-in edge. */
export function Button({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 18,
        padding: "30px 60px",
        borderRadius: 999,
        background: color.marigold,
        boxShadow: `inset 0 -8px 0 ${color.marigoldEdge}, 0 20px 40px -16px rgba(240, 164, 49, 0.6)`,
        fontFamily: font.sans,
        fontWeight: 700,
        fontSize: 46,
        color: color.onMarigold,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** A small diamond, the site's list mark. */
export function Diamond({ size = 18, fill = color.marigold }: { size?: number; fill?: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        background: fill,
        transform: "rotate(45deg)",
        flexShrink: 0,
      }}
    />
  );
}

/**
 * The closing card over a darkened painting: logo, the title and lines given, a button and
 * where to find Shubh. Everything sits above the bottom fifth, which the apps cover.
 */
export function EndCard({
  lang,
  background,
  eyebrow,
  title,
  subtitle,
  points,
  action,
}: {
  lang: Lang;
  background: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  points: string[];
  action: string;
}) {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 150], [1.12, 1.2], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: color.night }}>
      <Img
        src={staticFile(background)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(22px) saturate(1.1)",
          transform: `scale(${drift})`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(18,15,36,0.78), rgba(18,15,36,0.9) 60%, rgba(18,15,36,0.96))",
        }}
      />
      <AbsoluteFill
        style={{
          alignItems: "center",
          paddingTop: 230,
          textAlign: "center",
          color: color.nightInk,
        }}
      >
        <Rise delay={0}>
          <Img
            src={staticFile("brand/shubh-icon.png")}
            style={{
              width: 150,
              height: 150,
              borderRadius: 36,
              boxShadow: "0 20px 50px -10px rgba(0,0,0,0.6)",
            }}
          />
        </Rise>
        {eyebrow && (
          <Rise delay={6}>
            <Eyebrow lang={lang} style={{ marginTop: 46 }}>
              {eyebrow}
            </Eyebrow>
          </Rise>
        )}
        <Rise delay={10}>
          <div
            style={{
              fontFamily: font.display,
              fontSize: lang === "hi" ? 118 : 128,
              lineHeight: 1.15,
              marginTop: 18,
              padding: "0 70px",
            }}
          >
            {title}
          </div>
        </Rise>
        {subtitle && (
          <Rise delay={14}>
            <div
              style={{
                fontFamily: font.sans,
                fontSize: 42,
                color: color.nightAccent,
                marginTop: 14,
              }}
            >
              {subtitle}
            </div>
          </Rise>
        )}
        <div
          style={{
            marginTop: 54,
            display: "flex",
            flexDirection: "column",
            gap: 26,
            alignItems: "flex-start",
          }}
        >
          {points.map((point, i) => (
            <Rise key={point} delay={20 + i * 6}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  fontFamily: font.sans,
                  fontSize: 44,
                  color: color.nightInk,
                }}
              >
                <Diamond />
                {point}
              </div>
            </Rise>
          ))}
        </div>
        <Rise delay={44}>
          <Button style={{ marginTop: 64 }}>{action}</Button>
        </Rise>
        <Rise delay={52}>
          <div
            style={{
              marginTop: 44,
              fontFamily: font.sans,
              fontWeight: 700,
              fontSize: 50,
              letterSpacing: "0.01em",
            }}
          >
            {SITE}
          </div>
          <div
            style={{
              marginTop: 10,
              fontFamily: font.sans,
              fontSize: 36,
              color: color.nightInkMuted,
            }}
          >
            {BRAND_WORDS.linkInBio[lang]} · {HANDLE}
          </div>
        </Rise>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
