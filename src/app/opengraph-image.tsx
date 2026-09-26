import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Image rendering can't read CSS variables, so these mirror the light tokens in globals.css.
const colors = {
  paper: "#fbf6ec",
  ink: "#2a1a24",
  inkMuted: "#6b5864",
  accentText: "#9a4c08",
  cardIvory: "#f8efdc",
  cardGold: "#b8862f",
  cardBack: "#7d1d3a",
};

const fontFile = (pkg: string, file: string) =>
  readFile(join(process.cwd(), "node_modules", "@fontsource", pkg, "files", file));

export default async function Image() {
  const [rozha, tenor] = await Promise.all([
    fontFile("rozha-one", "rozha-one-latin-400-normal.woff"),
    fontFile("tenor-sans", "tenor-sans-latin-400-normal.woff"),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: 64,
        padding: "0 80px",
        background: colors.paper,
        color: colors.ink,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 28 }}>
        <div
          style={{
            fontFamily: "Tenor Sans",
            fontSize: 26,
            letterSpacing: 8,
            color: colors.accentText,
          }}
        >
          {site.name.toUpperCase()}
        </div>
        <div style={{ fontFamily: "Rozha One", fontSize: 76, lineHeight: 1.05 }}>
          Invitations your guests open, turn and keep.
        </div>
        <div style={{ fontFamily: "Tenor Sans", fontSize: 28, color: colors.inkMuted }}>
          3D invites · WhatsApp · RSVP in one tap
        </div>
      </div>

      {/* Gate-fold card, doors half open */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: 70,
            height: 300,
            background: colors.cardBack,
            borderRadius: "10px 0 0 10px",
            transform: "skewY(8deg)",
          }}
        />
        <div
          style={{
            width: 280,
            height: 340,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: colors.cardIvory,
            border: `4px solid ${colors.cardGold}`,
            borderRadius: 10,
            fontFamily: "Rozha One",
            fontSize: 48,
            color: colors.ink,
          }}
        >
          <div>Aarav</div>
          <div style={{ fontSize: 32, color: colors.accentText }}>&amp;</div>
          <div>Meera</div>
        </div>
        <div
          style={{
            width: 70,
            height: 300,
            background: colors.cardBack,
            borderRadius: "0 10px 10px 0",
            transform: "skewY(-8deg)",
          }}
        />
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
