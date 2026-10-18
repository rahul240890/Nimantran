import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import type { Hole } from "../designs";

/*
 * A painted gate as the guest page draws it (nimantran/src/components/guest/opening/
 * opening-gate.tsx): the place beyond, two doors hung in the arch's hole, the arch in
 * front. `open` runs 0 → 1: the doors swing in to 96°, the place beyond lights up.
 * `push` scales the whole painting about the doorway, as if walking through.
 */

const fill: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export function Gate({
  gate,
  hole,
  open,
  push = 1,
  children,
}: {
  gate: string;
  hole: Hole;
  open: number;
  push?: number;
  /** Drawn over the arch and pushed with it, such as the name plaque. */
  children?: ReactNode;
}) {
  const base = `gates/${gate}`;
  const angle = open * 96;
  const lit = Math.min(1, open * 1.6);
  const mask = `url(${staticFile(`${base}/hole.webp`)})`;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "50% 58%" }}>
        {/* Round the arch the place beyond waits in the dark, then lights up */}
        <Img
          src={staticFile(`${base}/beyond.webp`)}
          style={{
            ...fill,
            filter: `brightness(${0.38 + 0.62 * lit}) saturate(${0.8 + 0.2 * lit}) blur(${(1 - lit) * 4}px)`,
          }}
        />
        <AbsoluteFill
          style={{
            WebkitMaskImage: mask,
            maskImage: mask,
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
          }}
        >
          <Img
            src={staticFile(`${base}/beyond.webp`)}
            style={{ ...fill, filter: "brightness(1.12) saturate(1.05)" }}
          />
          <div
            style={{
              position: "absolute",
              left: `${hole.left}%`,
              top: `${hole.top}%`,
              width: `${hole.width}%`,
              height: `${hole.height}%`,
              perspective: 1512,
            }}
          >
            {(["left", "right"] as const).map((side) => (
              <div
                key={side}
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  width: "50%",
                  [side]: 0,
                  transformOrigin: `${side} center`,
                  transform: `rotateY(${side === "left" ? angle : -angle}deg)`,
                  backfaceVisibility: "hidden",
                }}
              >
                <Img
                  src={staticFile(`${base}/door-${side}.webp`)}
                  style={{ ...fill, objectPosition: side === "left" ? "right" : "left" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(90deg, transparent 40%, rgba(20, 8, 4, 0.75))",
                    transform: side === "right" ? "scaleX(-1)" : undefined,
                    opacity: lit,
                  }}
                />
              </div>
            ))}
            {/* Light glows through the seam before the doors part */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: "50%",
                width: 6,
                marginLeft: -3,
                background:
                  "linear-gradient(180deg, transparent, rgba(255, 228, 160, 0.9) 30%, rgba(255, 228, 160, 0.9) 70%, transparent)",
                filter: "blur(4px)",
                opacity: open > 0 ? Math.max(0, 1 - open * 4) : 0.8,
              }}
            />
          </div>
        </AbsoluteFill>
        <Img src={staticFile(`${base}/arch.webp`)} style={fill} />
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
