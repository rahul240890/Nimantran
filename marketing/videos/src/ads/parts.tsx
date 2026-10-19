import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { color, font } from "../brand";
import type { Lang } from "../designs";
import { clamp, easeInOut, easeOut } from "../parts/motion";
import type { Clip } from "./ads";
import { FORMATS, type FormatId } from "./formats";

/* The pieces every ad is built from: captions, the phone, real footage, the closing card. */

export type Rect = { x: number; y: number; w: number; h: number };

const hi = (lang: Lang) => lang === "hi";

/** Where the phone sits in each format; in a wide frame it moves right to leave room for words. */
export function phoneRect(format: FormatId): Rect {
  const h = { reel: 1030, feed: 1010, square: 860, wide: 920 }[format];
  const top = { reel: 300, feed: 110, square: 70, wide: 80 }[format];
  const w = Math.round((h - 28) * (1080 / 1920)) + 28;
  const { width } = FORMATS[format];
  const cx = format === "wide" ? 1390 : width / 2;
  return { x: Math.round(cx - w / 2), y: top, w, h };
}

/** Splits "*marked*" words out so they can be set in marigold. */
function words(text: string) {
  const out: { word: string; mark: boolean }[] = [];
  let mark = false;
  for (const part of text.split(/(\*)/)) {
    if (part === "*") {
      mark = !mark;
      continue;
    }
    for (const word of part.split(/\s+/).filter(Boolean)) out.push({ word, mark });
  }
  return out;
}

/**
 * The spoken line on screen. Each word brightens as the voice reaches it, so the caption
 * reads along with the voice; the first line of an ad shows in full from frame 0.
 */
export function Caption({
  text,
  lang,
  format,
  mode,
  voiceFrames,
  immediate,
}: {
  text: string;
  lang: Lang;
  format: FormatId;
  mode: "low" | "top" | "side";
  voiceFrames: number;
  immediate?: boolean;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = FORMATS[format];
  const list = words(text);
  const pop = immediate ? 1 : spring({ frame, fps, config: { damping: 18, stiffness: 220 } });
  const size = mode === "side" ? 74 : f.caption + (hi(lang) ? 2 : 0);
  const spoken = (i: number) =>
    immediate
      ? 1
      : interpolate(
          frame,
          [((i - 0.6) / list.length) * voiceFrames, (i / list.length) * voiceFrames],
          [0.38, 1],
          clamp,
        );

  const body = (
    <span
      style={{
        fontFamily: font.sans,
        fontWeight: 800,
        fontSize: size,
        lineHeight: hi(lang) ? 1.5 : 1.32,
        color: color.nightInk,
        ...(mode === "side"
          ? { display: "block", textShadow: "0 4px 30px rgba(0,0,0,0.5)" }
          : {
              background: "rgba(18, 15, 36, 0.8)",
              padding: "8px 24px",
              borderRadius: 20,
              boxDecorationBreak: "clone",
              WebkitBoxDecorationBreak: "clone",
            }),
      }}
    >
      {list.map(({ word, mark }, i) => (
        <span key={i} style={{ color: mark ? color.marigold : undefined, opacity: spoken(i) }}>
          {word}{" "}
        </span>
      ))}
    </span>
  );

  if (mode === "side") {
    return (
      <div
        style={{
          position: "absolute",
          left: f.safe.side,
          width: 760,
          top: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          transform: `translateY(${(1 - pop) * 30}px)`,
          opacity: pop,
        }}
      >
        {body}
      </div>
    );
  }
  const place: CSSProperties =
    mode === "top"
      ? { top: f.safe.top + (format === "reel" ? 96 : 86) }
      : { bottom: f.safe.bottom };
  return (
    <div
      style={{
        position: "absolute",
        left: f.safe.side,
        right: f.safe.side,
        ...place,
        textAlign: "center",
        transform: `scale(${0.92 + pop * 0.08})`,
        opacity: pop,
      }}
    >
      {body}
    </div>
  );
}

/** Who the ad is from, small, inside the safe area. */
export function BrandChip({ lang, format }: { lang: Lang; format: FormatId }) {
  const f = FORMATS[format];
  return (
    <div
      style={{
        position: "absolute",
        top: f.safe.top + (format === "reel" ? 10 : 0),
        left: f.safe.side,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "10px 24px 10px 10px",
        borderRadius: 999,
        background: "rgba(18, 15, 36, 0.6)",
        border: "2px solid rgba(246, 236, 216, 0.22)",
      }}
    >
      <Img
        src={staticFile("brand/shubh-icon.png")}
        style={{ width: 52, height: 52, borderRadius: 13 }}
      />
      <span
        style={{
          fontFamily: hi(lang) ? font.sans : font.label,
          fontWeight: hi(lang) ? 700 : 400,
          fontSize: 26,
          letterSpacing: hi(lang) ? 0 : "0.14em",
          textTransform: "uppercase",
          color: color.nightInk,
        }}
      >
        {hi(lang) ? "शुभ इन्विटेशन" : "Shubh Invitation"}
      </span>
    </div>
  );
}

/** AI-made people are labelled on the picture itself, as India's IT Rules expect. */
export function AiLabel({ lang, format }: { lang: Lang; format: FormatId }) {
  const f = FORMATS[format];
  return (
    <div
      style={{
        position: "absolute",
        top: f.safe.top + (format === "reel" ? 24 : 14),
        right: f.safe.side,
        padding: "6px 14px",
        borderRadius: 10,
        background: "rgba(18, 15, 36, 0.55)",
        fontFamily: font.sans,
        fontWeight: 600,
        fontSize: 22,
        color: "rgba(246, 236, 216, 0.85)",
      }}
    >
      {hi(lang) ? "AI से बनी तस्वीर" : "AI-generated image"}
    </div>
  );
}

/** Real screen recordings of the site, one after another across the beat. */
export function Footage({
  clips,
  frames,
  style,
}: {
  clips: Clip[];
  frames: number;
  style?: CSSProperties;
}) {
  const each = Math.ceil(frames / clips.length);
  return (
    <>
      {clips.map((clip, i) => (
        <Sequence key={i} from={i * each} durationInFrames={each} layout="none">
          <OffthreadVideo
            src={staticFile(`footage/${clip.file}.mp4`)}
            trimBefore={Math.round(clip.at * 30)}
            muted
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              ...style,
            }}
          />
        </Sequence>
      ))}
    </>
  );
}

/** A phone: dark bezel, rounded screen, a soft shadow. */
export function Phone({
  rect,
  children,
  tilt = 0,
  style,
}: {
  rect: Rect;
  children: ReactNode;
  tilt?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        borderRadius: rect.w * 0.12,
        padding: 14,
        background: "#0c0a14",
        boxShadow: "0 50px 100px -30px rgba(0,0,0,0.85), inset 0 0 0 3px #2a2638",
        transform: `rotate(${tilt}deg)`,
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: rect.w * 0.1,
          overflow: "hidden",
          background: color.night,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** A painted or photo backdrop, blurred and darkened so the phone and words stand out. */
export function Backdrop({
  src,
  dim = 0.62,
  blur = 26,
}: {
  src: string;
  dim?: number;
  blur?: number;
}) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: color.night, overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: `blur(${blur}px) saturate(1.15)`,
          transform: `scale(${interpolate(frame, [0, 300], [1.15, 1.25], clamp)})`,
        }}
      />
      <AbsoluteFill style={{ background: `rgba(18, 15, 36, ${dim})` }} />
    </AbsoluteFill>
  );
}

/** A photo filling the frame with a slow push in; a shade at the foot keeps captions readable. */
export function Photo({
  src,
  pos = "50% 50%",
  zoom = [1, 1.08],
  frames,
  rect,
}: {
  src: string;
  pos?: string;
  zoom?: [number, number];
  frames: number;
  rect?: Rect;
}) {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, frames], zoom, { ...clamp, easing: easeInOut });
  const box: CSSProperties = rect
    ? {
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        overflow: "hidden",
      }
    : { position: "absolute", inset: 0, overflow: "hidden" };
  return (
    <div style={box}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: pos,
          transform: `scale(${scale})`,
          transformOrigin: pos,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(18,15,36,0.35) 0%, rgba(18,15,36,0) 22%, rgba(18,15,36,0) 50%, rgba(18,15,36,0.55) 100%)",
        }}
      />
    </div>
  );
}

/** Tags that land one by one, then are struck through: the old way, crossed out. */
export function Chips({
  items,
  frames,
  format,
}: {
  items: string[];
  frames: number;
  format: FormatId;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const top = { reel: 520, feed: 300, square: 230, wide: 260 }[format];
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 26,
      }}
    >
      {items.map((item, i) => {
        const at = 4 + i * 9;
        const pop = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 200 } });
        const strike = interpolate(frame, [frames - 24 + i * 3, frames - 12 + i * 3], [0, 1], {
          ...clamp,
          easing: easeOut,
        });
        return (
          <div
            key={item}
            style={{
              position: "relative",
              padding: "16px 40px",
              borderRadius: 999,
              background: color.paper,
              color: color.ink,
              fontFamily: font.sans,
              fontWeight: 800,
              fontSize: format === "reel" ? 58 : 50,
              boxShadow: "0 18px 40px -14px rgba(0,0,0,0.6)",
              transform: `scale(${pop}) rotate(${(i % 2 ? 1 : -1) * 2}deg)`,
              opacity: pop,
            }}
          >
            {item}
            <div
              style={{
                position: "absolute",
                left: 24,
                right: 24,
                top: "52%",
                height: 8,
                borderRadius: 4,
                background: color.rose,
                transform: `scaleX(${strike})`,
                transformOrigin: "0 50%",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

/** A finger tap: a ring that grows and fades. */
export function Tap({ at, x, y }: { at: number; x: number; y: number }) {
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
