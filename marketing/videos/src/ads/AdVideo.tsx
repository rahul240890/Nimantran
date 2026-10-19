import {
  AbsoluteFill,
  Html5Audio,
  interpolate,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import "../brand";
import { color } from "../brand";
import type { Lang } from "../designs";
import { clamp } from "../parts/motion";
import { ADS, timeline, type AdId, type TimedBeat } from "./ads";
import { FORMATS, type FormatId } from "./formats";
import {
  AiLabel,
  BrandChip,
  Caption,
  Chips,
  Footage,
  Phone,
  Photo,
  phoneRect,
  Tap,
  type Rect,
} from "./parts";
import {
  ChatScene,
  DesignsScene,
  EndScene,
  GuestsScene,
  LanguagesScene,
  PriceScene,
} from "./scenes";

/*
 * One ad, cut for one format and voiced in one language. The voice sets the pace: each line
 * plays over its beat's picture with its caption, the raga sits underneath, and the closing
 * card carries the call to action.
 */

export type AdVideoProps = { ad: AdId; lang: Lang; format: FormatId };

/** Where the "Coming to everything" button sits in the RSVP recording (1080 × 1920). */
const RSVP_TAP = { x: 335, y: 728, frame: 28 };

function rsvpTap(clipAt: number, rect: Rect | null) {
  if (Math.abs(clipAt - 4) > 0.01) return null;
  const s = rect ? (rect.w - 28) / 1080 : 1;
  const x = rect ? rect.x + 14 + RSVP_TAP.x * s : RSVP_TAP.x;
  const y = rect ? rect.y + 14 + RSVP_TAP.y * s : RSVP_TAP.y;
  return <Tap at={RSVP_TAP.frame} x={x} y={y} />;
}

function BeatView({ beat, lang, format }: { beat: TimedBeat; lang: Lang; format: FormatId }) {
  const v = beat.visual;
  const { width, height } = FORMATS[format];
  const marks = beat.lineAt.map((l) => l.from - beat.from);
  switch (v.kind) {
    case "photo": {
      const portrait = v.src !== "ads/friends.jpg";
      // A tall photo in a wide frame takes the left half; the words take the right
      const rect =
        format === "wide" && portrait ? { x: width - 820, y: 0, w: 820, h: height } : undefined;
      return (
        <AbsoluteFill style={{ backgroundColor: color.night }}>
          <Photo src={v.src} pos={v.pos} zoom={v.zoom} frames={beat.frames} rect={rect} />
          {v.chips && <Chips items={v.chips[lang]} frames={beat.frames} format={format} />}
          <AiLabel lang={lang} format={format} />
        </AbsoluteFill>
      );
    }
    case "screen":
    case "phone": {
      if (v.kind === "screen" && format === "reel") {
        return (
          <AbsoluteFill style={{ backgroundColor: color.night }}>
            <Footage clips={v.clips} frames={beat.frames} />
            {v.clips.length === 1 && rsvpTap(v.clips[0]!.at, null)}
          </AbsoluteFill>
        );
      }
      const rect = phoneRect(format);
      return (
        <AbsoluteFill>
          <PhoneBackdrop />
          <Phone rect={rect}>
            <Footage clips={v.clips} frames={beat.frames} />
          </Phone>
          {v.clips.length === 1 && rsvpTap(v.clips[0]!.at, rect)}
        </AbsoluteFill>
      );
    }
    case "duo": {
      const h = { reel: 780, feed: 700, square: 600, wide: 860 }[format];
      const w = Math.round((h - 28) * (1080 / 1920)) + 28;
      const top = { reel: 360, feed: 110, square: 70, wide: 110 }[format];
      const rect: Rect =
        format === "wide"
          ? { x: 1260, y: top, w, h }
          : { x: width - w - (format === "reel" ? 70 : 56), y: top, w, h };
      const photoRect = format === "wide" ? { x: 0, y: 0, w: 1100, h: height } : undefined;
      return (
        <AbsoluteFill style={{ backgroundColor: color.night }}>
          <Photo src={v.src} pos={v.pos} frames={beat.frames} rect={photoRect} />
          <Phone rect={rect} tilt={4}>
            <Footage clips={[v.clip]} frames={beat.frames} />
          </Phone>
          {rsvpTap(v.clip.at, rect)}
          <AiLabel lang={lang} format={format} />
        </AbsoluteFill>
      );
    }
    case "price":
      return (
        <>
          <PriceScene lang={lang} format={format} marks={marks} />
          <AiLabel lang={lang} format={format} />
        </>
      );
    case "chat":
      return <ChatScene lang={lang} format={format} />;
    case "languages":
      return <LanguagesScene lang={lang} format={format} />;
    case "guests":
      return <GuestsScene lang={lang} format={format} />;
    case "designs":
      return <DesignsScene format={format} frames={beat.frames} />;
    case "end":
      return <EndScene lang={lang} format={format} bg={v.bg} />;
  }
}

/** Behind the phone: the painted palace, blurred. */
function PhoneBackdrop() {
  return (
    <AbsoluteFill style={{ backgroundColor: color.night }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 50% at 50% 45%, rgba(240,164,49,0.28), rgba(18,15,36,0) 70%), ${color.night}`,
        }}
      />
    </AbsoluteFill>
  );
}

function captionMode(beat: TimedBeat, format: FormatId): "low" | "top" | "side" {
  const v = beat.visual;
  if (format === "wide") {
    if (v.kind === "photo") return v.src === "ads/friends.jpg" ? "low" : "side";
    return "side";
  }
  return beat.captionAt ?? "low";
}

export function AdVideo({ ad, lang, format }: AdVideoProps) {
  const { durationInFrames } = useVideoConfig();
  const { beats } = timeline(ad, lang);
  const lines = beats.flatMap((beat) => beat.lineAt.map((line) => ({ line, beat })));
  return (
    <AbsoluteFill style={{ backgroundColor: color.night }}>
      {beats.map((beat, i) => (
        <Sequence key={i} from={beat.from} durationInFrames={beat.frames}>
          <BeatView beat={beat} lang={lang} format={format} />
          {beat.visual.kind !== "end" && <BrandChip lang={lang} format={format} />}
        </Sequence>
      ))}
      {lines.map(({ line, beat }, i) =>
        beat.visual.kind === "end" ? null : (
          <Sequence
            key={`c${i}`}
            from={i === 0 ? 0 : line.from}
            durationInFrames={line.frames + (i === 0 ? line.from : 0)}
          >
            <Caption
              text={line.caption}
              lang={lang}
              format={format}
              mode={captionMode(beat, format)}
              voiceFrames={line.voiceFrames}
              immediate={i === 0}
            />
          </Sequence>
        ),
      )}
      {lines.map(({ line }, i) => (
        <Sequence key={`v${i}`} from={line.from} durationInFrames={line.frames}>
          <Html5Audio src={staticFile(line.file)} />
        </Sequence>
      ))}
      <Html5Audio
        src={staticFile(ADS[ad].music)}
        loop
        volume={(f) =>
          interpolate(
            f,
            [0, 12, durationInFrames - 30, durationInFrames],
            [0, 0.17, 0.17, 0],
            clamp,
          )
        }
      />
    </AbsoluteFill>
  );
}

export function adFrames(ad: AdId, lang: Lang) {
  return timeline(ad, lang).total;
}
