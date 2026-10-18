import {
  AbsoluteFill,
  Html5Audio,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { color, font } from "./brand";
import { DESIGNS, type Design, type Lang } from "./designs";
import { BrandBadge, EndCard, Eyebrow } from "./parts/brand";
import { Gate } from "./parts/gate";
import { CoverLettering, EventCard, Plaque } from "./parts/invite";
import { clamp, CrossFade, easeInOut, musicVolume, Painted, Rise } from "./parts/motion";

/*
 * Design of the day (9:16, about 20 seconds): the design's own gate opens, the cover shows
 * the names, each function's page follows with its card, and the closing card says where to
 * try it. Faceless, no voice: the design's raga under on-screen words.
 */

export type DesignOfTheDayProps = { design: string; lang: Lang; number?: number };

const OVERLAP = 12;

type Scene =
  | { kind: "gate"; length: number }
  | { kind: "blessing"; length: number }
  | { kind: "cover"; length: number }
  | { kind: "page"; length: number; index: number }
  | { kind: "end"; length: number };

function scenes(design: Design): Scene[] {
  return [
    { kind: "gate", length: 172 },
    ...(design.blessingPage ? [{ kind: "blessing", length: 84 } as const] : []),
    { kind: "cover", length: 96 },
    ...design.pages.map((_, index) => ({ kind: "page", length: 70, index }) as const),
    { kind: "end", length: 150 },
  ];
}

/** Each scene's first frame: it starts as the one before begins to fade. */
function timeline(design: Design) {
  let at = 0;
  return scenes(design).map((scene) => {
    const start = at;
    at += scene.length - OVERLAP;
    return { scene, start };
  });
}

export function reelFrames(id: string): number {
  const design = DESIGNS[id]!;
  const last = timeline(design).at(-1)!;
  return last.start + last.scene.length;
}

const WORDS = {
  eyebrow: { en: "Design of the day", hi: "आज का डिज़ाइन" },
  points: {
    en: [
      "Opens at a gate of its own",
      "A painted page for every function",
      "Guests reply in one tap",
    ],
    hi: [
      "अपने ही द्वार से खुलता है",
      "हर रस्म का अपना चित्रित पन्ना",
      "मेहमान एक टैप में जवाब दें",
    ],
  },
  action: { en: "Try this design free", hi: "यह डिज़ाइन मुफ़्त आज़माइए" },
} as const;

function GateScene({ design, lang }: { design: Design; lang: Lang }) {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [64, 124], [0, 1], { ...clamp, easing: easeInOut });
  const push =
    frame < 64
      ? interpolate(frame, [0, 64], [1, 1.03], clamp)
      : interpolate(frame, [64, 172], [1.03, 1.75], { ...clamp, easing: easeInOut });
  const plaque = interpolate(frame, [58, 72], [1, 0], clamp);
  return (
    <AbsoluteFill>
      <Gate gate={design.gate.id} hole={design.gate.hole} open={open} push={push}>
        <Plaque design={design} lang={lang} opacity={plaque} />
      </Gate>
      {/* The title over a soft dark foot, gone before the doors part */}
      <AbsoluteFill
        style={{
          opacity: interpolate(frame, [54, 70], [1, 0], clamp),
          background:
            "linear-gradient(180deg, transparent 52%, rgba(18,15,36,0.88) 74%, rgba(18,15,36,0.95))",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 1180,
          textAlign: "center",
          color: color.nightInk,
        }}
      >
        <Rise delay={4} out={54}>
          <Eyebrow lang={lang}>{WORDS.eyebrow[lang]}</Eyebrow>
        </Rise>
        <Rise delay={9} out={56}>
          <div style={{ fontFamily: font.display, fontSize: 132, lineHeight: 1.15, marginTop: 10 }}>
            {design.name[lang]}
          </div>
        </Rise>
        <Rise delay={15} out={58}>
          <div
            style={{
              fontFamily: font.sans,
              fontSize: 42,
              color: color.nightInkMuted,
              marginTop: 8,
            }}
          >
            {design.about[lang]}
          </div>
          <div
            style={{
              fontFamily: font.sans,
              fontWeight: 600,
              fontSize: 38,
              color: color.nightAccent,
              marginTop: 14,
            }}
          >
            {design.tag[lang]}
          </div>
        </Rise>
      </div>
    </AbsoluteFill>
  );
}

function BlessingScene({ design, lang }: { design: Design; lang: Lang }) {
  const page = design.blessingPage!;
  // A deity is shown whole and still, with nothing written over the figure
  return (
    <AbsoluteFill>
      <Img
        src={staticFile(page.src)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          top: `${page.textTop}%`,
          left: 120,
          right: 120,
          textAlign: "center",
        }}
      >
        <Rise delay={14}>
          <div
            style={{
              fontFamily: lang === "hi" ? font.words : font.names,
              fontSize: lang === "hi" ? 64 : 58,
              lineHeight: 1.3,
              whiteSpace: "pre-line",
              color: design.cover.blessingColor,
              textShadow: design.cover.shadow,
            }}
          >
            {design.blessing[lang]}
          </div>
        </Rise>
      </div>
    </AbsoluteFill>
  );
}

export function DesignOfTheDay({ design: id, lang }: DesignOfTheDayProps) {
  const design = DESIGNS[id]!;
  const plan = timeline(design);
  const total = reelFrames(id);
  const frame = useCurrentFrame();
  const endStart = plan.at(-1)!.start;
  return (
    <AbsoluteFill style={{ backgroundColor: color.night }}>
      {plan.map(({ scene, start }, i) => (
        <Sequence key={i} from={start} durationInFrames={scene.length}>
          <CrossFade
            duration={scene.length}
            fade={OVERLAP}
            fadeIn={i > 0}
            fadeOut={i < plan.length - 1}
          >
            {scene.kind === "gate" && <GateScene design={design} lang={lang} />}
            {scene.kind === "blessing" && <BlessingScene design={design} lang={lang} />}
            {scene.kind === "cover" && (
              <AbsoluteFill>
                <Painted src={design.cover.src} from={1.02} to={1.08} duration={scene.length} />
                <CoverLettering design={design} lang={lang} />
              </AbsoluteFill>
            )}
            {scene.kind === "page" && (
              <AbsoluteFill>
                <Painted
                  src={design.pages[scene.index]!.src}
                  from={1}
                  to={1.07}
                  duration={scene.length}
                  style={design.keepTop ? { transformOrigin: "50% 0%" } : undefined}
                />
                <EventCard design={design} page={design.pages[scene.index]!} lang={lang} />
              </AbsoluteFill>
            )}
            {scene.kind === "end" && (
              <EndCard
                lang={lang}
                background={design.cover.src}
                eyebrow={WORDS.eyebrow[lang]}
                title={design.name[lang]}
                subtitle={design.tag[lang]}
                points={[...WORDS.points[lang]]}
                action={WORDS.action[lang]}
              />
            )}
          </CrossFade>
        </Sequence>
      ))}
      <BrandBadge
        lang={lang}
        opacity={interpolate(frame, [endStart, endStart + OVERLAP], [1, 0], clamp)}
      />
      <Html5Audio
        src={staticFile(`music/${design.raga}.wav`)}
        volume={(f) => musicVolume(f, total)}
      />
    </AbsoluteFill>
  );
}
