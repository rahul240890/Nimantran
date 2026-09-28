/*
 * The drawn touches of the themed guest page (Step 12q): the music players, the seals,
 * the lights and the ornaments between sections. Each is a small SVG in the theme's own
 * colours (the --suite-* tokens), animated by the guest-* rules in globals.css.
 */

import type { CSSProperties } from "react";
import type { GuestLights, GuestPlayer, GuestSeal, GuestStyle } from "@/lib/suites/guest-look";

const GOLD = "var(--suite-gold)";
const LIGHT = "var(--suite-light)";
const ACCENT = "var(--suite-accent)";
const PLATE = "var(--suite-plate)";
const NEAR = "var(--suite-near)";
const LEAF = "var(--suite-leaf)";

/** The music player, drawn; its moving part turns while the music plays. */
export function PlayerArt({ kind, monogram }: { kind: GuestPlayer; monogram: string }) {
  return (
    <svg viewBox="0 0 220 170" aria-hidden className="h-auto w-full">
      {kind === "gramophone" && (
        <>
          <rect x="18" y="104" width="150" height="46" rx="8" fill={NEAR} stroke={GOLD} />
          <rect
            x="26"
            y="112"
            width="134"
            height="30"
            rx="5"
            fill="none"
            stroke={GOLD}
            strokeOpacity="0.5"
          />
          <g className="guest-spin" style={{ transformOrigin: "93px 104px" }}>
            <ellipse
              cx="93"
              cy="104"
              rx="62"
              ry="15"
              fill="var(--suite-sky-top)"
              stroke={GOLD}
              strokeOpacity="0.6"
            />
            <ellipse
              cx="93"
              cy="104"
              rx="44"
              ry="10.5"
              fill="none"
              stroke={GOLD}
              strokeOpacity="0.25"
            />
            <ellipse cx="93" cy="104" rx="18" ry="4.5" fill={GOLD} />
          </g>
          <path
            d="M150 100 L168 74 L170 52"
            fill="none"
            stroke={GOLD}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path d="M164 54 L170 8 A24 13 -40 0 1 214 36 L172 58 Z" fill={GOLD} />
          <ellipse
            cx="192"
            cy="22"
            rx="23"
            ry="9"
            transform="rotate(40 192 22)"
            fill={NEAR}
            stroke={LIGHT}
            strokeOpacity="0.7"
          />
          <text
            x="93"
            y="106.5"
            textAnchor="middle"
            fontSize="7"
            fill={NEAR}
            className="font-label"
          >
            {monogram}
          </text>
        </>
      )}
      {kind === "shehnai" && (
        <>
          <g transform="rotate(-18 110 90)">
            <rect x="30" y="84" width="120" height="12" rx="6" fill={GOLD} />
            <path d="M150 80 L196 62 L196 118 L150 100 Z" fill={GOLD} />
            <ellipse cx="196" cy="90" rx="8" ry="28" fill={ACCENT} stroke={GOLD} strokeWidth="2" />
            {[50, 70, 90, 110, 130].map((x) => (
              <circle key={x} cx={x} cy="90" r="2.6" fill={NEAR} />
            ))}
            <rect x="18" y="87" width="14" height="6" rx="2" fill={ACCENT} />
          </g>
          {(
            [
              [168, 40, 0],
              [188, 22, 1],
              [150, 20, 2],
            ] as const
          ).map(([x, y, i]) => (
            <g key={i} className="guest-note" style={{ animationDelay: `${i * 0.5}s` }}>
              <circle cx={x} cy={y} r="5" fill={LIGHT} />
              <rect x={x + 4} y={y - 18} width="2" height="18" fill={LIGHT} />
            </g>
          ))}
          <text x="60" y="150" fontSize="10" fill={GOLD} className="font-label">
            {monogram}
          </text>
        </>
      )}
      {kind === "veena" && (
        <>
          <circle cx="54" cy="100" r="40" fill={ACCENT} stroke={GOLD} strokeWidth="3" />
          <circle cx="54" cy="100" r="26" fill="none" stroke={GOLD} strokeOpacity="0.5" />
          <circle cx="176" cy="92" r="22" fill={ACCENT} stroke={GOLD} strokeWidth="3" />
          <rect x="60" y="90" width="140" height="14" rx="6" fill={GOLD} />
          <path
            d="M198 84 C214 76 214 60 204 52"
            fill="none"
            stroke={GOLD}
            strokeWidth="5"
            strokeLinecap="round"
          />
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              className="guest-string"
              style={{ animationDelay: `${i * 0.12}s` }}
              x1="80"
              y1={93 + i * 2.8}
              x2="198"
              y2={93 + i * 2.8}
              stroke={PLATE}
              strokeWidth="0.9"
            />
          ))}
          <text
            x="54"
            y="104"
            textAnchor="middle"
            fontSize="10"
            fill={PLATE}
            className="font-label"
          >
            {monogram}
          </text>
        </>
      )}
      {kind === "boombox" && (
        <>
          <rect
            x="20"
            y="50"
            width="180"
            height="100"
            rx="14"
            fill={NEAR}
            stroke={GOLD}
            strokeWidth="3"
          />
          <path d="M60 50 C60 24 160 24 160 50" fill="none" stroke={GOLD} strokeWidth="5" />
          {[62, 158].map((cx) => (
            <g key={cx} className="guest-thump" style={{ transformOrigin: `${cx}px 104px` }}>
              <circle cx={cx} cy="104" r="30" fill={ACCENT} stroke={GOLD} strokeWidth="2" />
              <circle cx={cx} cy="104" r="12" fill={GOLD} />
            </g>
          ))}
          <rect x="94" y="84" width="32" height="20" rx="3" fill={PLATE} />
          <text x="110" y="98" textAnchor="middle" fontSize="8" fill={NEAR} className="font-label">
            {monogram}
          </text>
          <rect x="94" y="112" width="32" height="8" rx="2" fill={LEAF} />
        </>
      )}
    </svg>
  );
}

/** The seal the guest breaks, unties or opens; `open` plays its opening. */
export function SealArt({ kind, monogram }: { kind: GuestSeal; monogram: string }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden className="h-full w-full overflow-visible">
      {kind === "wax" && (
        <>
          <g className="guest-seal-half guest-seal-left">
            <path
              d="M60 8 C42 6 30 16 20 22 C10 34 6 46 8 60 C6 74 12 88 22 98 C32 108 46 114 60 112 Z"
              fill={ACCENT}
            />
          </g>
          <g className="guest-seal-half guest-seal-right">
            <path
              d="M60 8 C78 6 90 16 100 22 C110 34 114 46 112 60 C114 74 108 88 98 98 C88 108 74 114 60 112 Z"
              fill={ACCENT}
            />
          </g>
          <circle
            cx="60"
            cy="60"
            r="36"
            fill="none"
            stroke={GOLD}
            strokeWidth="2"
            className="guest-seal-face"
          />
          <text
            x="60"
            y="66"
            textAnchor="middle"
            fontSize="17"
            fill={LIGHT}
            className="guest-seal-face font-display"
          >
            {monogram}
          </text>
        </>
      )}
      {kind === "knot" && (
        <>
          <path
            className="guest-knot-cord guest-seal-left"
            d="M0 60 C30 40 44 80 60 60"
            fill="none"
            stroke={ACCENT}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            className="guest-knot-cord guest-seal-right"
            d="M120 60 C90 80 76 40 60 60"
            fill="none"
            stroke={GOLD}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle
            cx="60"
            cy="60"
            r="26"
            fill={NEAR}
            stroke={GOLD}
            strokeWidth="2"
            className="guest-seal-face"
          />
          <text
            x="60"
            y="65"
            textAnchor="middle"
            fontSize="13"
            fill={LIGHT}
            className="guest-seal-face font-display"
          >
            {monogram}
          </text>
          {[-1, 1].map((side) => (
            <path
              key={side}
              d={`M${60 + side * 20} 84 l${side * 6} 26 l${side * -10} -4 z`}
              fill={ACCENT}
              className="guest-seal-face"
            />
          ))}
        </>
      )}
      {kind === "lotus" && (
        <>
          {[-60, -30, 0, 30, 60].map((angle, i) => (
            <path
              key={angle}
              className="guest-petal"
              style={
                {
                  "--petal": `${angle}deg`,
                  transformOrigin: "60px 96px",
                  transitionDelay: `${i * 0.06}s`,
                } as CSSProperties
              }
              d="M60 96 C44 76 46 44 60 22 C74 44 76 76 60 96 Z"
              fill={
                angle === 0
                  ? ACCENT
                  : "color-mix(in oklab, var(--suite-accent) 70%, var(--suite-plate))"
              }
              stroke={GOLD}
              strokeWidth="1.2"
            />
          ))}
          <text
            x="60"
            y="118"
            textAnchor="middle"
            fontSize="12"
            fill={LIGHT}
            className="font-display"
          >
            {monogram}
          </text>
        </>
      )}
      {kind === "ribbon" && (
        <>
          <path
            className="guest-seal-left"
            d="M60 60 C40 30 14 34 16 56 C18 76 44 70 60 60 Z"
            fill={ACCENT}
          />
          <path
            className="guest-seal-right"
            d="M60 60 C80 30 106 34 104 56 C102 76 76 70 60 60 Z"
            fill={ACCENT}
          />
          <path
            d="M56 64 L40 110 L52 104 L58 116 Z M64 64 L80 110 L68 104 L62 116 Z"
            fill={ACCENT}
            opacity="0.85"
          />
          <circle cx="60" cy="60" r="16" fill={GOLD} className="guest-seal-face" />
          <text
            x="60"
            y="64"
            textAnchor="middle"
            fontSize="9"
            fill={NEAR}
            className="guest-seal-face font-label"
          >
            {monogram}
          </text>
        </>
      )}
    </svg>
  );
}

/** One hanging light; `lit` makes it glow (and a bell swing). */
export function LightArt({ kind, index }: { kind: GuestLights; index: number }) {
  const colours = [ACCENT, GOLD, LEAF, LIGHT];
  const glass = kind === "bulbs" ? colours[index % colours.length] : LIGHT;
  return (
    <svg viewBox="0 0 40 70" aria-hidden className="guest-light h-full w-full overflow-visible">
      <line
        x1="20"
        y1="0"
        x2="20"
        y2={kind === "diyas" ? 0 : 18}
        stroke={GOLD}
        strokeOpacity="0.7"
      />
      {kind === "lanterns" && (
        <>
          <path
            d="M12 18 H28 L32 26 V46 L28 54 H12 L8 46 V26 Z"
            fill={NEAR}
            stroke={GOLD}
            strokeWidth="1.5"
          />
          <rect className="guest-glass" x="12" y="26" width="16" height="20" rx="2" fill={glass} />
          <path d="M16 54 L20 62 L24 54" fill={GOLD} />
        </>
      )}
      {kind === "bells" && (
        <g className="guest-bell" style={{ transformOrigin: "20px 18px" }}>
          <path d="M20 18 C10 20 10 36 8 46 H32 C30 36 30 20 20 18 Z" fill={GOLD} />
          <rect x="6" y="45" width="28" height="4" rx="2" fill={GOLD} />
          <circle className="guest-glass" cx="20" cy="52" r="3.5" fill={glass} />
        </g>
      )}
      {kind === "diyas" && (
        <>
          <path
            className="guest-flame guest-glass"
            d="M20 28 C14 38 16 46 20 48 C24 46 26 38 20 28 Z"
            fill={glass}
          />
          <path d="M4 48 C8 62 32 62 36 48 Z" fill={ACCENT} stroke={GOLD} strokeWidth="1.2" />
        </>
      )}
      {kind === "bulbs" && (
        <>
          <rect x="16" y="16" width="8" height="6" rx="1" fill={GOLD} />
          <ellipse className="guest-glass" cx="20" cy="31" rx="8" ry="10" fill={glass} />
        </>
      )}
    </svg>
  );
}

/** The little ornament between a section's label and its title. */
export function Ornament({ style }: { style: GuestStyle }) {
  return (
    <svg viewBox="0 0 160 20" aria-hidden className="h-5 w-40">
      <line x1="0" y1="10" x2="64" y2="10" stroke={GOLD} strokeOpacity="0.6" />
      <line x1="96" y1="10" x2="160" y2="10" stroke={GOLD} strokeOpacity="0.6" />
      {style === "palace" && (
        <path
          d="M68 16 C68 4 92 4 92 16 M74 16 C74 8 86 8 86 16"
          fill="none"
          stroke={GOLD}
          strokeWidth="1.5"
        />
      )}
      {style === "garden" && (
        <path
          d="M80 3 C74 8 74 14 80 17 C86 14 86 8 80 3 Z M70 10 C74 10 78 14 80 17 C74 17 70 14 70 10 Z M90 10 C86 10 82 14 80 17 C86 17 90 14 90 10 Z"
          fill={GOLD}
        />
      )}
      {style === "procession" && (
        <path d="M72 4 H88 L84 16 H76 Z M80 16 V19" fill="none" stroke={GOLD} strokeWidth="1.5" />
      )}
      {style === "party" && (
        <path d="M80 2 L83 8 L90 10 L83 12 L80 18 L77 12 L70 10 L77 8 Z" fill={GOLD} />
      )}
    </svg>
  );
}
