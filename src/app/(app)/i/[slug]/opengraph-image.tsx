import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { draftCopy, draftTemplate } from "@/lib/editor/draft";
import { initialOf } from "@/lib/templates/content";
import { findPublishedInvite } from "@/lib/invites/public";
import { lightTokens, ogFonts } from "@/lib/og/assets";
import { firstReadable, readableOn } from "@/lib/og/contrast";
import { inviteNames, inviteWhen, inviteWhere, occasionName } from "@/lib/publish/describe";
import { draftSuite } from "@/lib/publish/story";
import { suitePreview } from "@/lib/suites/catalog";
import { site } from "@/lib/site";

export const alt = "The invitation's cover";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The picture WhatsApp and other apps show under the link: the family's card, in its colours. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
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
  const monogram = [copy.first, copy.second].filter(Boolean).map(initialOf).join(" · ");
  // A painted theme shows its own cover painting, the first thing guests will open
  const painting = await paintedCover(draftSuite(draft));

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
        <div
          style={{
            fontFamily: "Rozha One",
            fontSize: inviteNames(draft).length > 22 ? 64 : 84,
            lineHeight: 1.05,
          }}
        >
          {inviteNames(draft)}
        </div>
        {when && <div style={{ fontFamily: "Tenor Sans", fontSize: 30, marginTop: 8 }}>{when}</div>}
        {where && (
          <div style={{ fontFamily: "Tenor Sans", fontSize: 26, color: detail }}>{where}</div>
        )}
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
                fontFamily: "Rozha One",
                fontSize: monogram.length > 5 ? 44 : 60,
                color: accentText,
              }}
            >
              {monogram}
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
