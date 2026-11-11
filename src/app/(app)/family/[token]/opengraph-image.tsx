import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { familyCopy } from "@/content/publish";
import { site } from "@/lib/site";

/*
 * The WhatsApp card for a family preview link: the brand, then "Family preview" and "Not
 * the final invitation. Payment pending." in large type, never the couple's design. Whoever
 * a host's family forwards it to sees, before opening it, that it isn't the invitation.
 * English only: the image's fonts carry Latin letters, and the card's title beside it is in
 * the visitor's language.
 */

export const alt = `${site.name}: ${familyCopy.ogHeading}. ${familyCopy.ogLine}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Image rendering can't read CSS variables, so these mirror the light tokens in globals.css.
const colors = {
  paper: "#fbf6ec",
  ink: "#2a1a24",
  inkMuted: "#6b5864",
  accentText: "#9a4c08",
  marigold: "#f0a431",
  onMarigold: "#2a1a24",
};

const fontFile = (pkg: string, file: string) =>
  readFile(join(process.cwd(), "node_modules", "@fontsource", pkg, "files", file));

export default async function Image() {
  const [rozha, tenor, icon] = await Promise.all([
    fontFile("rozha-one", "rozha-one-latin-400-normal.woff"),
    fontFile("tenor-sans", "tenor-sans-latin-400-normal.woff"),
    readFile(join(process.cwd(), "public", "brand", "shubh-icon.png")),
  ]);
  const iconSrc = `data:image/png;base64,${icon.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 36,
        padding: "0 90px",
        background: colors.paper,
        color: colors.ink,
        position: "relative",
      }}
    >
      {/* The ribbon a reader sees first, in the marigold of the page's own badge */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: colors.marigold,
          color: colors.onMarigold,
          fontFamily: "Tenor Sans",
          fontSize: 26,
          letterSpacing: 6,
        }}
      >
        {familyCopy.watermark.toUpperCase()}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <img src={iconSrc} width={80} height={80} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontFamily: "Rozha One", fontSize: 40, letterSpacing: 6, lineHeight: 1 }}>
            {site.shortName.toUpperCase()}
          </div>
          <div
            style={{
              fontFamily: "Tenor Sans",
              fontSize: 20,
              letterSpacing: 6,
              color: colors.accentText,
            }}
          >
            Invitation
          </div>
        </div>
      </div>
      <div style={{ fontFamily: "Rozha One", fontSize: 96, lineHeight: 1 }}>
        {familyCopy.ogHeading}
      </div>
      <div style={{ fontFamily: "Tenor Sans", fontSize: 38, color: colors.inkMuted }}>
        {familyCopy.ogLine}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Rozha One", data: rozha, style: "normal", weight: 400 },
        { name: "Tenor Sans", data: tenor, style: "normal", weight: 400 },
      ],
    },
  );
}
