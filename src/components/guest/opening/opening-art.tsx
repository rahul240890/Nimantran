import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { DecorSvg } from "@/components/invitation/art/decor-svg";
import { SYMBOLS } from "@/components/invitation/art/symbols";
import { cn } from "@/lib/cn";
import {
  Balloons,
  Diyas,
  Fireworks,
  FlowerCurtain,
  GiftBox,
  Jharokha,
  Mandap,
  Moonlit,
  Peacock,
  Rangoli,
  Scroll,
  SkyLanterns,
  Storybook,
} from "./opening-art-more";
import {
  GOD_PAINTINGS,
  isPaintedGate,
  type OpeningGod,
  type OpeningStyle,
} from "@/lib/opening/catalog";
import { PaintedGateArt } from "./opening-gate";

/*
 * The drawn pieces of each opening (Step 12x). Everything is sized in container units of the
 * stage (cqw, cqh), so the same art fills a phone, a desktop frame and an editor tile. The
 * colours come from the theme (--open-* in globals.css); the movement is in CSS and follows
 * the stage's data-open, so still mode simply shows the end of each move.
 */

/** Where the god sits and how much room the middle keeps, per style, in % of the stage. */
export const OPENING_LAYOUT: Record<OpeningStyle, { crest: number; gap: number }> = {
  "rajwada-pol": { crest: 22, gap: 0 },
  "gopuram-kadhavu": { crest: 22, gap: 0 },
  "noor-darwaza": { crest: 22, gap: 0 },
  "phoolon-ki-deewar": { crest: 22, gap: 0 },
  "haveli-kiwad": { crest: 22, gap: 0 },
  "shahi-parda": { crest: 22, gap: 0 },
  "deco-gates": { crest: 22, gap: 0 },
  "bagiya-gate": { crest: 22, gap: 0 },
  "mela-tamboo": { crest: 22, gap: 0 },
  doors: { crest: 22, gap: 0 },
  palace: { crest: 23, gap: 3 },
  temple: { crest: 24, gap: 4 },
  curtain: { crest: 22, gap: 2 },
  envelope: { crest: 27, gap: 11 },
  lotus: { crest: 21, gap: 0 },
  mandap: { crest: 24, gap: 2 },
  jharokha: { crest: 24, gap: 4 },
  phool: { crest: 22, gap: 0 },
  scroll: { crest: 22, gap: 0 },
  diyas: { crest: 22, gap: 0 },
  rangoli: { crest: 21, gap: 0 },
  peacock: { crest: 21, gap: 0 },
  storybook: { crest: 22, gap: 0 },
  lanterns: { crest: 22, gap: 0 },
  moonlit: { crest: 24, gap: 0 },
  fireworks: { crest: 22, gap: 0 },
  balloons: { crest: 22, gap: 0 },
  gift: { crest: 22, gap: 4 },
  none: { crest: 22, gap: 0 },
};

const range = (count: number) => Array.from({ length: count }, (_, i) => i);

/** The warm light beyond a doorway, with slow turning rays and lanterns rising. */
function Beyond({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("opening-beyond absolute overflow-hidden", className)}>
      <span className="opening-rays absolute top-1/2 left-1/2 aspect-square w-[260%]" />
      {range(6).map((i) => (
        <span
          key={i}
          className="opening-lantern absolute"
          style={{ left: `${12 + i * 15}%`, "--i": i } as CSSProperties}
        />
      ))}
    </div>
  );
}

/** A string of marigolds and mango leaves across the top. */
function Toran({ count = 11, className }: { count?: number; className?: string }) {
  return (
    <div aria-hidden className={cn("absolute inset-x-0 flex justify-around", className)}>
      {range(count).map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 44"
          className="opening-toran-drop w-[7.5cqw] origin-top"
          style={{ "--i": i } as CSSProperties}
        >
          <path d="M10 2 V12" stroke="var(--open-gilt)" strokeWidth="1" />
          <path
            d="M10 14 C3 20 3 32 10 42 C17 32 17 20 10 14Z"
            fill={i % 2 ? "var(--open-leaf)" : "var(--open-leaf-deep)"}
          />
          <circle cx="10" cy="10" r="6.2" fill="var(--marigold)" />
          <circle cx="10" cy="10" r="3.4" fill="var(--marigold-strong)" />
        </svg>
      ))}
    </div>
  );
}

/** Hanging strings of marigolds down either side. */
function Ladis({ className }: { className?: string }) {
  return (
    <>
      {(["left", "right"] as const).map((side) => (
        <span
          key={side}
          aria-hidden
          className={cn(
            "opening-ladi absolute top-0 w-[3.4cqw]",
            side === "left" ? "left-[3.5cqw]" : "right-[3.5cqw]",
            className,
          )}
        />
      ))}
    </>
  );
}

/** A small oil lamp whose flame flickers. */
function Diya({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg aria-hidden viewBox="0 0 40 40" className={cn("absolute", className)} style={style}>
      <ellipse cx="20" cy="17" rx="8" ry="11" fill="var(--open-light)" opacity="0.35" />
      <path
        className="opening-flame"
        d="M20 6 C15 14 16 21 20 23 C24 21 25 14 20 6Z"
        fill="var(--marigold)"
      />
      <path d="M20 13 C18 17 18.5 21 20 22 C21.5 21 22 17 20 13Z" fill="var(--open-light)" />
      <path d="M4 24 H36 C34 33 28 37 20 37 C12 37 6 33 4 24Z" fill="var(--open-gilt-dark)" />
      <path d="M8 24 H32 C30 30 26 33 20 33 C14 33 10 30 8 24Z" fill="var(--open-gilt)" />
    </svg>
  );
}

/** Carved palace doors under a garlanded arch. */
function Palace() {
  return (
    <>
      <div className="opening-jaali absolute inset-0" />
      <Toran className="top-0 z-10" />
      <Ladis className="z-10 h-[62%]" />
      <div className="opening-arch-trim absolute inset-x-[7cqw] top-[24.5%] bottom-0" />
      <div className="opening-arch absolute inset-x-[10cqw] top-[27%] bottom-0 overflow-hidden [perspective:1400px]">
        <Beyond className="inset-0" />
        {(["left", "right"] as const).map((side) => (
          <div
            key={side}
            className={cn(
              "opening-door opening-door-wood absolute inset-y-0 flex w-1/2 flex-col gap-[3%] p-[4cqw]",
              side === "left" ? "opening-door-left left-0" : "opening-door-right right-0",
            )}
          >
            <span className="opening-panel h-[22%] rounded-t-[50%_60%]" />
            <span className="opening-panel grid flex-1 place-items-center">
              <svg viewBox="-20 -20 40 40" className="w-[70%]">
                {range(8).map((i) => (
                  <ellipse
                    key={i}
                    cx="0"
                    cy="-10"
                    rx="4"
                    ry="9"
                    transform={`rotate(${i * 45})`}
                    fill="none"
                    stroke="var(--open-gilt)"
                    strokeWidth="1.2"
                  />
                ))}
                <circle r="5" fill="var(--open-gilt)" />
                <circle r="2.2" fill="var(--open-wood-dark)" />
              </svg>
            </span>
            <span className="opening-panel h-[24%]" />
            {/* The ring knocker by the seam */}
            <span
              className={cn(
                "absolute top-[47%] size-[6cqw] rounded-full border-[0.9cqw] border-(--open-gilt) shadow-[0_0.6cqw_0.8cqw_var(--open-shadow)]",
                side === "left" ? "right-[2cqw]" : "left-[2cqw]",
              )}
            />
          </div>
        ))}
      </div>
      <Diya className="bottom-[1%] left-[1cqw] w-[11cqw]" />
      <Diya className="right-[1cqw] bottom-[1%] w-[11cqw]" style={{ animationDelay: "-0.4s" }} />
    </>
  );
}

/** Brass temple doors with bells, under a stepped gopuram. */
function Temple() {
  return (
    <>
      <div className="opening-stone absolute inset-0" />
      {[0, 1, 2, 3].map((tier) => (
        <span
          key={tier}
          className="opening-tier absolute left-1/2 -translate-x-1/2"
          style={{
            width: `${96 - tier * 18}%`,
            top: `${20 - tier * 6.2}%`,
            height: "6.6%",
          }}
        />
      ))}
      {(["left", "right"] as const).map((side) => (
        <span
          key={side}
          className={cn(
            "opening-pillar absolute top-[26%] bottom-0 w-[11cqw]",
            side === "left" ? "left-[2cqw]" : "right-[2cqw]",
          )}
        />
      ))}
      <div className="opening-doorframe absolute inset-x-[13cqw] top-[29.5%] bottom-0 overflow-hidden [perspective:1400px]">
        <Beyond className="inset-0" />
        {(["left", "right"] as const).map((side) => (
          <div
            key={side}
            className={cn(
              "opening-door opening-door-brass absolute inset-y-0 flex w-1/2 flex-col gap-[2.5%] p-[3.5cqw]",
              side === "left" ? "opening-door-left left-0" : "opening-door-right right-0",
            )}
          >
            {[18, 30, 30, 22].map((height, i) => (
              <span
                key={i}
                className="opening-brass-panel grid place-items-center"
                style={{ height: `${height}%` }}
              >
                {i === 1 || i === 2 ? (
                  <svg viewBox="-20 -20 40 40" className="w-[62%]">
                    {range(i === 1 ? 8 : 12).map((p) => (
                      <path
                        key={p}
                        d="M0 -2 C-5 -8 -4 -15 0 -18 C4 -15 5 -8 0 -2Z"
                        transform={`rotate(${(360 / (i === 1 ? 8 : 12)) * p})`}
                        fill="var(--open-gilt-bright)"
                        stroke="var(--open-gilt-dark)"
                        strokeWidth="0.8"
                      />
                    ))}
                    <circle r="3.6" fill="var(--open-gilt-dark)" />
                  </svg>
                ) : null}
              </span>
            ))}
            <span
              className={cn(
                "absolute top-[44%] size-[7cqw] rounded-full border-[1cqw] border-(--open-gilt-dark) shadow-[0_0.6cqw_0.8cqw_var(--open-shadow)]",
                side === "left" ? "right-[2.5cqw]" : "left-[2.5cqw]",
              )}
            />
          </div>
        ))}
      </div>
      {/* The lintel and its bells */}
      <div className="opening-lintel absolute inset-x-[9cqw] top-[26.4%] h-[3.4%]" />
      <div className="absolute inset-x-[13cqw] top-[29.6%] z-10 flex justify-around">
        {range(7).map((i) => (
          <svg
            key={i}
            aria-hidden
            viewBox="0 0 20 34"
            className="opening-bell w-[5cqw] origin-top"
            style={{ "--i": i } as CSSProperties}
          >
            <path d="M10 0 V9" stroke="var(--open-gilt-dark)" strokeWidth="1.4" />
            <path d="M10 9 C4 9 3 16 3 26 H17 C17 16 16 9 10 9Z" fill="var(--open-gilt)" />
            <path d="M2 26 H18 V28 H2Z" fill="var(--open-gilt-dark)" />
            <circle cx="10" cy="30.5" r="2.6" fill="var(--open-gilt-dark)" />
          </svg>
        ))}
      </div>
      <Diya className="top-[33%] left-[1.5cqw] w-[12cqw]" />
      <Diya className="top-[33%] right-[1.5cqw] w-[12cqw]" style={{ animationDelay: "-0.6s" }} />
    </>
  );
}

/** Velvet curtains under a swagged pelmet, gathered aside to open. */
function Curtain() {
  return (
    <>
      <Beyond className="inset-0" />
      {(["left", "right"] as const).map((side) => (
        <div
          key={side}
          className={cn(
            "opening-curtain absolute top-[8%] bottom-0 w-[52%]",
            side === "left" ? "opening-curtain-left left-0" : "opening-curtain-right right-0",
          )}
        />
      ))}
      <div className="opening-pelmet absolute inset-x-0 top-0 h-[13%]" />
      <svg
        aria-hidden
        viewBox="0 0 120 22"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-[12.5%] h-[5.5%] w-full"
      >
        {range(4).map((i) => (
          <path
            key={i}
            d={`M${i * 30} 0 Q${i * 30 + 15} 26 ${i * 30 + 30} 0Z`}
            fill="var(--open-wood)"
            stroke="var(--open-gilt)"
            strokeWidth="1.6"
          />
        ))}
      </svg>
      <div className="absolute inset-x-0 top-[13.4%] flex justify-around px-[2cqw]">
        {range(14).map((i) => (
          <span
            key={i}
            className="opening-bulb size-[2.2cqw] rounded-full"
            style={
              { "--i": i, marginTop: `${Math.sin((i / 13) * Math.PI) * 3.4}cqw` } as CSSProperties
            }
          />
        ))}
      </div>
      {(["left", "right"] as const).map((side) => (
        <span
          key={side}
          className={cn(
            "opening-tassel absolute top-[46%] h-[16cqw] w-[5cqw]",
            side === "left" ? "left-[1.5cqw]" : "right-[1.5cqw]",
          )}
        />
      ))}
    </>
  );
}

/** A royal envelope: the flap lifts, the wax seal breaks and the card rises. */
function Envelope({ seal }: { seal: string }) {
  return (
    <div className="absolute inset-0 [perspective:1600px]">
      <div className="opening-envelope-back absolute inset-0" />
      <div className="opening-fold-side absolute inset-0 z-[1] [clip-path:polygon(0_0,52%_56%,0_100%)]" />
      <div className="opening-fold-side absolute inset-0 z-[1] -scale-x-100 [clip-path:polygon(0_0,52%_56%,0_100%)]" />
      <div className="opening-fold-bottom absolute inset-0 z-[1] [clip-path:polygon(0_100%,50%_47%,100%_100%)]" />
      {/* The card inside rises out of the pocket once the flap is up */}
      <div className="absolute inset-x-[9cqw] top-[3%] z-[3] h-[46%] overflow-hidden">
        <div className="opening-envelope-card absolute inset-x-0 bottom-0 grid h-[92%] place-items-center rounded-[2cqw]">
          <svg aria-hidden viewBox="-20 -20 40 40" className="w-[34%]">
            {range(12).map((i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-11"
                rx="3.4"
                ry="8"
                transform={`rotate(${i * 30})`}
                fill="none"
                stroke="var(--open-gilt)"
                strokeWidth="1"
              />
            ))}
            <circle r="4.5" fill="var(--open-jewel)" />
          </svg>
        </div>
      </div>
      <div className="opening-flap absolute inset-x-0 top-0 z-[4] h-[38%] origin-top [transform-style:preserve-3d]">
        <div className="opening-flap-edge absolute inset-0 [backface-visibility:hidden] [clip-path:polygon(0_0,100%_0,50%_100%)]" />
        <div className="opening-flap-front absolute inset-0 [backface-visibility:hidden] [clip-path:polygon(0_0,100%_0,50%_97%)]" />
        <div className="opening-flap-lining absolute inset-0 [transform:rotateX(180deg)] [backface-visibility:hidden] [clip-path:polygon(0_0,100%_0,50%_100%)]" />
      </div>
      <div className="absolute top-[38%] left-1/2 z-[5] aspect-square w-[22cqw] -translate-1/2">
        {(["left", "right"] as const).map((half) => (
          <span
            key={half}
            className={cn(
              "opening-seal absolute inset-0 grid place-items-center rounded-full",
              half === "left"
                ? "opening-seal-left [clip-path:inset(0_50%_0_0)]"
                : "opening-seal-right [clip-path:inset(0_0_0_50%)]",
            )}
          >
            <span className="grid size-[76%] place-items-center rounded-full border-[0.5cqw] border-(--open-seal-ring) font-display text-[8cqw] leading-none text-(--open-seal-ink)">
              {seal}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** A lotus of three rings of petals behind the names, which fly outward to open. */
export function LotusBloom() {
  const ring = (count: number, length: number, width: number, fill: string, offset = 0) =>
    range(count).map((i) => {
      const angle = (360 / count) * i + offset;
      return (
        <g
          key={`${length}-${i}`}
          className="opening-petal"
          style={{ "--a": `${angle}deg` } as CSSProperties}
        >
          <path
            d={`M0 0 C${-width} ${-length * 0.35} ${-width * 0.7} ${-length * 0.85} 0 ${-length} C${width * 0.7} ${-length * 0.85} ${width} ${-length * 0.35} 0 0Z`}
            fill={fill}
            stroke="var(--open-gilt)"
            strokeWidth="0.8"
          />
        </g>
      );
    });
  return (
    <svg
      aria-hidden
      viewBox="-100 -100 200 200"
      className="opening-lotus pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[118cqw] max-w-none -translate-1/2"
    >
      <circle
        r="98"
        fill="none"
        stroke="var(--open-gilt)"
        strokeWidth="0.6"
        strokeDasharray="1 3"
        className="opening-turn"
      />
      <circle r="90" fill="none" stroke="var(--open-gilt)" strokeWidth="0.4" />
      {ring(16, 92, 16, "var(--open-wood)", 11.25)}
      {ring(12, 80, 20, "var(--open-jewel)")}
      {ring(8, 64, 24, "var(--open-petal)", 22.5)}
    </svg>
  );
}

/** The theme's cover painting split down the middle as two doors. */
function CoverDoors({ cover }: { cover: string }) {
  return (
    <div className="absolute inset-0 [perspective:1600px]">
      <Beyond className="inset-0" />
      {(["left", "right"] as const).map((side) => (
        <div
          key={side}
          className={cn(
            "opening-door absolute inset-y-0 w-1/2 overflow-hidden",
            side === "left" ? "opening-door-out-left left-0" : "opening-door-out-right right-0",
          )}
        >
          <div
            className={cn("absolute inset-y-0 w-[200%]", side === "left" ? "left-0" : "right-0")}
          >
            <Image
              src={cover}
              alt=""
              fill
              priority
              sizes="(min-width: 40rem) 32rem, 100vw"
              className="object-cover"
            />
          </div>
          <span
            className={cn(
              "absolute inset-y-0 w-px bg-card-gold/50",
              side === "left" ? "right-0" : "left-0",
            )}
          />
        </div>
      ))}
    </div>
  );
}

/** Petals that shower down once the opening is opened. */
export function OpeningPetals() {
  return (
    <div
      aria-hidden
      className="opening-petals pointer-events-none absolute inset-0 z-20 overflow-hidden"
    >
      {range(16).map((i) => (
        <span
          key={i}
          className="opening-falling absolute -top-[6%]"
          style={
            {
              left: `${(i * 37) % 100}%`,
              "--i": i,
              "--sway": `${(i % 3) * 4 + 3}cqw`,
            } as CSSProperties
          }
        >
          <span
            className={cn(
              "block h-[3.2cqw] w-[2.4cqw] rounded-[60%_10%_60%_10%]",
              i % 3 === 0
                ? "bg-(--marigold)"
                : i % 3 === 1
                  ? "bg-(--open-petal-fall)"
                  : "bg-(--open-jewel)",
            )}
          />
        </span>
      ))}
    </div>
  );
}

/** The drawn opening for a style, behind the words. */
export function OpeningArt({
  style,
  cover,
  seal,
  sample,
}: {
  style: OpeningStyle;
  cover?: string;
  seal: string;
  /** A small tile in the editor: small files, loaded lazily. */
  sample?: boolean;
}): ReactNode {
  if (isPaintedGate(style)) return <PaintedGateArt gate={style} sample={sample} />;
  switch (style) {
    case "doors":
      return cover ? <CoverDoors cover={cover} /> : <Palace />;
    case "palace":
      return <Palace />;
    case "temple":
      return <Temple />;
    case "curtain":
      return <Curtain />;
    case "envelope":
      return <Envelope seal={seal} />;
    case "lotus":
      return (
        <>
          <div className="opening-rangoli absolute inset-0" />
          <Beyond className="inset-0 opacity-60" />
        </>
      );
    case "mandap":
      return <Mandap />;
    case "jharokha":
      return <Jharokha />;
    case "phool":
      return <FlowerCurtain />;
    case "scroll":
      return <Scroll />;
    case "diyas":
      return <Diyas />;
    case "rangoli":
      return <Rangoli />;
    case "peacock":
      return <Peacock />;
    case "storybook":
      return <Storybook />;
    case "lanterns":
      return <SkyLanterns />;
    case "moonlit":
      return <Moonlit />;
    case "fireworks":
      return <Fireworks />;
    case "balloons":
      return <Balloons />;
    case "gift":
      return <GiftBox />;
    case "none":
      return <div className="opening-rangoli absolute inset-0" />;
  }
}

/**
 * The god or sacred symbol, top-centre and whole, never under any words (TRADITIONS.md, 5):
 * the owner's painting in a gilt niche with a soft breathing halo, or a symbol on a medallion.
 */
export function GodCrest({ god, label }: { god: OpeningGod; label?: string }) {
  const painting = GOD_PAINTINGS[god];
  if (painting) {
    return (
      <div className="relative flex h-full max-w-[78%] items-end justify-center">
        <span aria-hidden className="opening-halo absolute -inset-[14%] rounded-full" />
        <div
          className="opening-niche relative h-full max-h-full"
          style={{ aspectRatio: String(painting.aspect) }}
        >
          <Image
            src={painting.src}
            alt={label ?? ""}
            fill
            sizes="(min-width: 40rem) 18rem, 60vw"
            className="object-contain"
          />
        </div>
      </div>
    );
  }
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className="relative grid aspect-square h-[78%] max-h-[34cqw] place-items-center"
    >
      <span aria-hidden className="opening-halo absolute -inset-[30%] rounded-full" />
      <span className="opening-medallion [container-type:size] relative grid size-full place-items-center rounded-full">
        <SymbolMark god={god} />
      </span>
    </div>
  );
}

/** A sacred symbol drawn to fill its (sized) parent, in the card's gold. */
export function SymbolMark({ god }: { god: OpeningGod }) {
  const symbol = god === "om" ? SYMBOLS.om : god === "swastik" ? SYMBOLS.swastik : SYMBOLS.kalash;
  return symbol.kind === "glyph" ? (
    <span
      aria-hidden
      className="font-display text-[62cqh] leading-none text-(--open-medallion-ink,var(--card-gold-text))"
    >
      {symbol.text}
    </span>
  ) : (
    <DecorSvg
      layers={[{ items: [{ at: [12, 12], scale: 9, shapes: symbol.shapes }] }]}
      width={24}
      height={24}
      className="size-[72%]"
    />
  );
}
