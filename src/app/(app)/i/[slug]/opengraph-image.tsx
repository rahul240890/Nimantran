import { ImageResponse } from "next/og";
import { draftCopy, draftTemplate } from "@/lib/editor/draft";
import { initialOf } from "@/lib/templates/content";
import { findPublishedInvite } from "@/lib/invites/public";
import { lightTokens, ogFonts } from "@/lib/og/assets";
import { inviteNames, inviteWhen, inviteWhere, occasionName } from "@/lib/publish/describe";
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
  const when = inviteWhen(draft);
  const where = inviteWhere(draft);
  const monogram = [copy.first, copy.second].filter(Boolean).map(initialOf).join(" · ");

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
        color: paper,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 18 }}>
        <div style={{ fontFamily: "Tenor Sans", fontSize: 26, letterSpacing: 8, color: gold }}>
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
          <div style={{ fontFamily: "Tenor Sans", fontSize: 26, color: gold }}>{where}</div>
        )}
      </div>

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
    </div>,
    { ...size, fonts },
  );
}
