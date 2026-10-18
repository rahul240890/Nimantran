import type { CSSProperties, ReactNode } from "react";
import {
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/* Small motion pieces every video shares: rising lines, fades and slow painted pans. */

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);

/** The music's volume at a frame: full, then fading out over the last two seconds. */
export function musicVolume(frame: number, total: number) {
  return interpolate(frame, [total - 60, total - 4], [1, 0], clamp);
}

/** 0 → 1 between two frames, eased. */
export function useProgress(from: number, to: number, easing = easeInOut) {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, to], [0, 1], { ...clamp, easing });
}

/** A line that rises into place and fades in at `delay` frames, and out at `out` if given. */
export function Rise({
  delay = 0,
  out,
  distance = 40,
  children,
  style,
}: {
  delay?: number;
  out?: number;
  distance?: number;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 22,
  });
  const leave = out === undefined ? 0 : interpolate(frame, [out, out + 12], [0, 1], clamp);
  return (
    <div
      style={{
        opacity: enter * (1 - leave),
        transform: `translateY(${(1 - enter) * distance - leave * distance * 0.5}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** A painting that fills the frame and drifts slowly: zoom from → to, panning by (x, y) %. */
export function Painted({
  src,
  from = 1,
  to = 1.08,
  x = 0,
  y = 0,
  duration,
  style,
}: {
  src: string;
  from?: number;
  to?: number;
  x?: number;
  y?: number;
  duration: number;
  style?: CSSProperties;
}) {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, duration], [0, 1], clamp);
  const scale = from + (to - from) * t;
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: `scale(${scale}) translate(${x * t}%, ${y * t}%)`,
        ...style,
      }}
    />
  );
}

/** Fades its children in over `fade` frames from the start, and out over the last `fade`. */
export function CrossFade({
  duration,
  fade = 12,
  fadeIn = true,
  fadeOut = true,
  children,
}: {
  duration: number;
  fade?: number;
  fadeIn?: boolean;
  fadeOut?: boolean;
  children: ReactNode;
}) {
  const frame = useCurrentFrame();
  const inn = fadeIn ? interpolate(frame, [0, fade], [0, 1], clamp) : 1;
  const out = fadeOut ? interpolate(frame, [duration - fade, duration], [1, 0], clamp) : 1;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: Math.min(inn, out) }}>{children}</div>
  );
}
