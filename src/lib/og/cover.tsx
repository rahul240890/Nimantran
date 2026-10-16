/* eslint-disable @next/next/no-img-element -- next/og draws these into the preview picture; no page shows them */
import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { CSSProperties } from "react";
import { ImageResponse } from "next/og";
import { draftCopy, draftTemplate } from "@/lib/editor/draft";
import { findPublishedInvite } from "@/lib/invites/public";
import { lightTokens, ogFonts } from "@/lib/og/assets";
import { firstReadable, readableOn } from "@/lib/og/contrast";
import { textPicture, type TextPicture } from "@/lib/og/text";
import { inviteNames, inviteWhen, inviteWhere, occasionName } from "@/lib/publish/describe";
import { draftSuite } from "@/lib/publish/story";
import { suitePreview } from "@/lib/suites/catalog";
import { site } from "@/lib/site";

/*
 * The picture WhatsApp and other apps show under an invitation's link: the family's card,
 * in its colours. The names, date and place are drawn by sharp (src/lib/og/text.ts), so
 * every card language reads right.
 */

export const COVER_SIZE = { width: 1200, height: 630 };
export const COVER_ALT = "The invitation's cover";
const size = COVER_SIZE;

/** The words' column: the preview's width less its padding, the gap and the painting. */
const TEXT_WIDTH = 660;

/**
 * The cover's address. The version changes with every save, so apps and the CDN may keep a
 * copy for good, and an edited invite gets a fresh picture.
 */
export function coverPath(slug: string, updatedAt: string): string {
  const version = (Date.parse(updatedAt) || 0).toString(36);
  return `/i/${slug}/cover?v=${version}`;
}

/** A piece of text drawn by sharp, at its own size. */
function TextImage({ picture, style }: { picture: TextPicture; style?: CSSProperties }) {
  return (
    <img src={picture.src} alt="" width={picture.width} height={picture.height} style={style} />
  );
}

export async function drawCover(slug: string): Promise<Response> {
  const [invite, tokens, fonts] = await Promise.all([
    findPublishedInvite(slug),
    lightTokens(),
    ogFonts(),
  ]);
  const colour = (token: string, fallback: string) => tokens[token] ?? fallback;

  if (!invite) {
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: colour("paper", "#fbf6ec"),
          color: colour("ink", "#2a1a24"),
          fontFamily: "Rozha One",
          fontSize: 72,
        }}
      >
        {site.name}
      </div>,
      { ...size, fonts },
    );
  }

  const { draft } = invite;
  const template = draftTemplate(draft);
  const copy = draftCopy(draft);
  const c = template.colours;
  const back = colour(c.back, "#7d1d3a");
  const paper = colour(c.paper, "#f8efdc");
  const gold = colour(c.gold, "#b8862f");
  const ink = colour(c.ink, "#2a1a24");
  const accentText = colour(c.accentText, "#9a4c08");
  // Most cards are light paper on a dark back; a dark-paper card (Emerald Palace) has light ink
  const text = readableOn(back, paper, ink);
  // Gold details on the back, unless the card's gold is too close to it to read
  const detail = firstReadable(back, 3, gold, accentText, text);
  const when = inviteWhen(draft);
  const where = inviteWhere(draft);
  const names = inviteNames(draft);
  // A painted theme shows its own cover painting, the first thing guests will open
  const [painting, namesPicture, whenPicture, wherePicture] = await Promise.all([
    paintedCover(draftSuite(draft)),
    textPicture(names, {
      look: "display",
      size: names.length > 22 ? 64 : 84,
      colour: text,
      width: TEXT_WIDTH,
    }),
    when ? textPicture(when, { look: "label", size: 30, colour: text, width: TEXT_WIDTH }) : null,
    where
      ? textPicture(where, { look: "label", size: 26, colour: detail, width: TEXT_WIDTH })
      : null,
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: 56,
        padding: "0 72px",
        background: back,
        color: text,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 18 }}>
        <div style={{ fontFamily: "Tenor Sans", fontSize: 26, letterSpacing: 8, color: detail }}>
          {`YOU'RE INVITED · ${occasionName(draft).toUpperCase()}`}
        </div>
        <TextImage picture={namesPicture} />
        {whenPicture && <TextImage picture={whenPicture} style={{ marginTop: 8 }} />}
        {wherePicture && <TextImage picture={wherePicture} />}
      </div>

      {painting ? (
        <img
          src={painting}
          alt=""
          width={318}
          height={566}
          style={{
            borderRadius: 18,
            border: `4px solid ${gold}`,
            boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          style={{
            width: 330,
            height: 440,
            display: "flex",
            padding: 12,
            background: paper,
            borderRadius: 12,
            boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 18,
              border: `3px solid ${gold}`,
              borderRadius: 6,
              color: ink,
            }}
          >
            {copy.doors[0] && (
              <div
                style={{
                  fontFamily: "Tenor Sans",
                  fontSize: 22,
                  letterSpacing: 6,
                  color: accentText,
                }}
              >
                {`${copy.doors[0]} ${copy.doors[1]}`.trim().toUpperCase()}
              </div>
            )}
            <div
              style={{
                width: 150,
                height: 150,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                border: `3px solid ${gold}`,
              }}
            >
              {/* A gilt flower in the ring: the preview never shows the names' initials */}
              <svg width="92" height="92" viewBox="-20 -20 40 40">
                {Array.from({ length: 8 }, (_, petal) => (
                  <ellipse
                    key={petal}
                    cx="0"
                    cy="-9"
                    rx="3.6"
                    ry="7.4"
                    transform={`rotate(${petal * 45})`}
                    fill="none"
                    stroke={accentText}
                    strokeWidth="1.4"
                  />
                ))}
                <circle r="3.4" fill={accentText} />
              </svg>
            </div>
            <div style={{ fontFamily: "Tenor Sans", fontSize: 18, letterSpacing: 4, color: gold }}>
              {site.name.toUpperCase()}
            </div>
          </div>
        </div>
      )}
    </div>,
    { ...size, fonts },
  );
}

/** The theme's cover as a data URL, or null for the card-colours theme. */
async function paintedCover(suite: Parameters<typeof suitePreview>[0]): Promise<string | null> {
  const path = suitePreview(suite);
  if (!path) return null;
  try {
    const file = await readFile(join(process.cwd(), "public", path));
    return `data:image/jpeg;base64,${file.toString("base64")}`;
  } catch {
    return null;
  }
}
