import type { CSSProperties, ReactNode } from "react";
import { color, font } from "../brand";
import type { Design, Lang, Page } from "../designs";
import { Rise } from "./motion";

/* The invitation's own pieces, set as the guest page sets them: the plaque on the gate, the
   names on the cover and the card on each function's page. */

const isHindi = (lang: Lang) => lang === "hi";

/** Names in the invitation's lettering: Playfair for Latin, Rozha One for Devanagari. */
function namesStyle(lang: Lang, size: number, longest = 0): CSSProperties {
  // Long names such as Meenakshi step down so they stay inside the painting's arch
  const fit = Math.min(1, 7 / Math.max(longest, 1));
  return {
    fontFamily: font.names,
    fontSize: (isHindi(lang) ? size * 0.9 : size) * fit,
    lineHeight: isHindi(lang) ? 1.25 : 1.05,
  };
}

function Ampersand({ size, colour }: { size: number; colour: string }) {
  return (
    <div
      style={{
        fontFamily: font.names,
        fontStyle: "italic",
        fontSize: size,
        color: colour,
        lineHeight: 1,
      }}
    >
      &amp;
    </div>
  );
}

/** The ivory name plaque hung on the closed gate. */
export function Plaque({
  design,
  lang,
  opacity = 1,
}: {
  design: Design;
  lang: Lang;
  opacity?: number;
}) {
  const couple = design.couple[lang];
  const longest = Math.max(couple.first.length, couple.second.length) * 0.92;
  return (
    <div
      style={{
        position: "absolute",
        top: "14.5%",
        left: "14%",
        right: "14%",
        opacity,
        padding: "64px 40px 44px",
        textAlign: "center",
        background: color.cardIvory,
        borderRadius: "46% 46% 36px 36px / 120px 120px 36px 36px",
        border: `5px solid ${color.cardGold}`,
        outline: `3px solid ${color.cardIvory}`,
        outlineOffset: -18,
        boxShadow: "0 30px 60px -20px rgba(20, 8, 4, 0.7)",
      }}
    >
      <div
        style={{
          fontFamily: isHindi(lang) ? font.words : font.names,
          color: color.rose,
          fontSize: 40,
          lineHeight: 1.25,
          whiteSpace: "pre-line",
        }}
      >
        {design.blessing[lang]}
      </div>
      <div style={{ color: design.headingColor, marginTop: 18, ...namesStyle(lang, 122) }}>
        {couple.first}
      </div>
      <Ampersand size={64} colour={color.rose} />
      <div style={{ color: design.headingColor, ...namesStyle(lang, 122) }}>{couple.second}</div>
      <div style={{ height: 2, background: color.line, margin: "26px 60px 18px" }} />
      <div style={{ fontFamily: font.sans, fontSize: 34, color: color.cardInkMuted }}>
        {design.date[lang]}
      </div>
    </div>
  );
}

/** The names written over the cover painting, line by line. */
export function CoverLettering({ design, lang }: { design: Design; lang: Lang }) {
  const { cover } = design;
  const couple = design.couple[lang];
  const longest = Math.max(couple.first.length, couple.second.length);
  const line: CSSProperties = { textShadow: cover.shadow };
  return (
    <div
      style={{
        position: "absolute",
        top: `${cover.top}%`,
        left: 60,
        right: 60,
        textAlign: "center",
      }}
    >
      {/* A design that opens with a blessing page has said it already */}
      {!design.blessingPage && (
        <Rise delay={8}>
          <div
            style={{
              ...line,
              fontFamily: isHindi(lang) ? font.words : font.names,
              color: cover.blessingColor,
              fontSize: isHindi(lang) ? 54 : 50,
              lineHeight: 1.25,
              whiteSpace: "pre-line",
            }}
          >
            {design.blessing[lang]}
          </div>
        </Rise>
      )}
      <Rise delay={16}>
        <div
          style={{
            ...line,
            ...namesStyle(lang, 150, longest),
            color: cover.namesColor,
            marginTop: 24,
          }}
        >
          {couple.first}
        </div>
      </Rise>
      <Rise delay={22}>
        <div style={line}>
          <Ampersand size={78} colour={cover.blessingColor} />
        </div>
      </Rise>
      <Rise delay={28}>
        <div style={{ ...line, ...namesStyle(lang, 150, longest), color: cover.namesColor }}>
          {couple.second}
        </div>
      </Rise>
      <Rise delay={38}>
        <div
          style={{
            ...line,
            marginTop: 30,
            fontFamily: isHindi(lang) ? font.sans : font.label,
            letterSpacing: isHindi(lang) ? 0 : "0.18em",
            textTransform: "uppercase",
            fontSize: 34,
            color: cover.namesColor,
          }}
        >
          {design.date[lang]}
        </div>
      </Rise>
    </div>
  );
}

const icon = { width: 44, height: 44, flexShrink: 0 } as const;

function Clock() {
  return (
    <svg
      viewBox="0 0 24 24"
      style={icon}
      fill="none"
      stroke={color.rose}
      strokeWidth={2}
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function Pin() {
  return (
    <svg
      viewBox="0 0 24 24"
      style={icon}
      fill="none"
      stroke={color.rose}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 30px",
        borderRadius: 999,
        border: `3px solid ${color.cardGold}`,
        fontFamily: font.sans,
        fontWeight: 600,
        fontSize: 32,
        color: color.cardInk,
      }}
    >
      {children}
    </div>
  );
}

export const CARD_WORDS = {
  directions: { en: "Directions", hi: "रास्ता देखें" },
  map: { en: "Map", hi: "नक्शा" },
  reply: { en: "Reply", hi: "जवाब दें" },
} as const;

/** A function's card, as the guest page shows it over that function's painting. */
export function EventCard({ design, page, lang }: { design: Design; page: Page; lang: Lang }) {
  return (
    <div style={{ position: "absolute", top: `${design.cardTop}%`, left: 64, right: 64 }}>
      <Rise delay={6} distance={60}>
        <div
          style={{
            background: color.cardIvory,
            borderRadius: 40,
            border: `5px solid ${color.cardGold}`,
            outline: `2px solid rgba(184, 134, 47, 0.45)`,
            outlineOffset: -16,
            padding: "52px 56px 50px",
            boxShadow: "0 40px 80px -30px rgba(20, 8, 4, 0.75)",
          }}
        >
          <div
            style={{
              fontFamily: font.display,
              fontSize: 84,
              lineHeight: 1.15,
              color: design.headingColor,
            }}
          >
            {page.title[lang]}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 28 }}>
            <Clock />
            <div style={{ fontFamily: font.sans, fontSize: 38, color: color.cardInk }}>
              {page.when[lang]}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 18 }}>
            <Pin />
            <div
              style={{ fontFamily: font.sans, fontSize: 38, fontWeight: 600, color: color.cardInk }}
            >
              {page.where[lang]}
            </div>
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 36 }}>
            <Pill>
              <svg
                viewBox="0 0 24 24"
                style={{ width: 34, height: 34 }}
                fill="none"
                stroke={color.cardInk}
                strokeWidth={2}
                strokeLinejoin="round"
              >
                <path d="M3 11 21 3l-8 18-2-8z" />
              </svg>
              {CARD_WORDS.directions[lang]}
            </Pill>
            <Pill>
              <svg
                viewBox="0 0 24 24"
                style={{ width: 34, height: 34 }}
                fill="none"
                stroke={color.cardInk}
                strokeWidth={2}
                strokeLinejoin="round"
              >
                <path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2z M9 4v14 M15 6v14" />
              </svg>
              {CARD_WORDS.map[lang]}
            </Pill>
          </div>
        </div>
      </Rise>
    </div>
  );
}
