import type { CSSProperties } from "react";
import { DecorSvg } from "@/components/invitation/art/decor-svg";
import { FACE, type Layer } from "@/components/invitation/art/decor";
import {
  layoutDoor,
  layoutInside,
  symbolLayers,
  type TextRun,
} from "@/components/invitation/art/layout";
import { MOTIFS, type DoorSide, type Motif } from "@/components/invitation/art/motifs";
import { cn } from "@/lib/cn";
import { TEMPLATES } from "@/lib/templates/catalog";
import type { CardCopy } from "@/lib/templates/content";
import type { Template } from "@/lib/templates/schema";
import { CARD_VARS, stockStyle } from "@/lib/templates/stock";

/*
 * How far the doors have opened is the CSS variable --open (0 shut, 1 open) on any ancestor.
 * Everything below reads it in CSS, so scrolling and dragging never re-render React.
 */
const OPEN = "var(--open, 0)";

const FONT_CLASS = { display: "font-display", label: "font-label", sans: "font-sans" } as const;

/** Each line of the inside fades up in turn as the doors part. */
function reveal(index: number): { opacity: string; lift: string } {
  const t = `clamp(0, calc((${OPEN} - 0.35 - ${index} * 0.06) * 4), 1)`;
  return { opacity: t, lift: `calc((1 - ${t}) * 0.8cqw)` };
}

/** One line (or two) of words, placed in face units; 1 unit is 1% of the card's width. */
function Run({ run, index }: { run: TextRun; index?: number }) {
  const shown = index === undefined ? null : reveal(index);
  const style: CSSProperties = {
    top: `${run.top}cqw`,
    left: `${run.x}cqw`,
    fontSize: `${run.size}cqw`,
    lineHeight: `${run.lineHeight}cqw`,
    letterSpacing: run.tracking ? `${run.tracking}em` : undefined,
    color: `var(${CARD_VARS[run.ink]})`,
    transform: `translateX(-50%)${shown ? ` translateY(${shown.lift})` : ""}`,
    opacity: shown?.opacity,
  };
  return (
    <span
      className={cn(
        "absolute block text-center whitespace-nowrap",
        FONT_CLASS[run.font],
        run.italic && "italic",
      )}
      style={style}
    >
      {run.rows.map((row, i) => (
        <span key={i} className="block">
          {row}
        </span>
      ))}
    </span>
  );
}

function Door({
  side,
  copy,
  template,
  motif,
}: {
  side: DoorSide;
  copy: CardCopy;
  template: Template;
  motif: Motif;
}) {
  const isLeft = side === "left";
  const { label, initial } = layoutDoor(copy, template, motif, side);
  const { width, height } = FACE.door;

  return (
    <span
      className={cn(
        "absolute top-0 h-full w-1/2",
        isLeft ? "left-0 origin-left" : "right-0 origin-right",
      )}
      style={{
        transform: `rotateY(calc(${OPEN} * ${isLeft ? -110 : 110}deg))`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Front face */}
      <span
        className={cn(
          "absolute inset-0 overflow-hidden bg-card-ivory [backface-visibility:hidden]",
          isLeft ? "rounded-l-[var(--radius-md)]" : "rounded-r-[var(--radius-md)]",
        )}
      >
        <DecorSvg
          layers={motif.door(side)}
          width={width}
          height={height}
          className="absolute inset-0 size-full"
        />
        {label && <Run run={label} />}
        <Run run={initial} />
        {/* The door darkens as it turns away from the light */}
        <span
          className="absolute inset-0 bg-card-ink"
          style={{ opacity: `calc(${OPEN} * 0.35)` }}
        />
        <span
          className={cn(
            "absolute inset-y-0 w-[6%] from-transparent to-card-ink/15",
            isLeft ? "right-0 bg-linear-to-r" : "left-0 bg-linear-to-l",
          )}
        />
      </span>

      {/* Back face: the lining inside the door */}
      <span
        className={cn(
          "absolute inset-0 [transform:rotateY(180deg)] overflow-hidden bg-card-back [backface-visibility:hidden]",
          isLeft ? "rounded-r-[var(--radius-md)]" : "rounded-l-[var(--radius-md)]",
        )}
      >
        <DecorSvg
          layers={motif.lining}
          width={width}
          height={height}
          className="absolute inset-0 size-full"
        />
        {/* Light falls off toward the outer edge as the door swings wide */}
        <span
          className={cn(
            "absolute inset-0 from-transparent to-card-ink/45",
            isLeft ? "bg-linear-to-l" : "bg-linear-to-r",
          )}
        />
      </span>
    </span>
  );
}

/**
 * The gate-fold invitation in CSS 3D, drawn in a template's ornaments, type and colours:
 * an inside card, two doors that swing open, and a gilded edge behind so the card has
 * thickness when it tilts. Purely visual; the parent supplies the button, label and motion.
 */
export function GateCard({
  copy,
  template = TEMPLATES.marigold,
  className,
}: {
  copy: CardCopy;
  template?: Template;
  className?: string;
}) {
  const motif = MOTIFS[template.scene.motif];
  const inside = layoutInside(copy, template, motif);
  const { width, height } = FACE.inside;
  const divider: Layer[] | null =
    motif.divider && inside.divider !== null
      ? [{ items: [{ at: [50, inside.divider], children: [motif.divider] }] }]
      : null;
  const symbol = symbolLayers(copy, inside);
  // Reveal order: runs in reading order, with the divider and monogram in their places
  const order = (top: number) => inside.runs.filter((run) => run.top < top).length;

  return (
    <span
      aria-hidden
      className={cn(
        "[container-type:inline-size] relative block aspect-[5/4] w-full [transform-style:preserve-3d]",
        className,
      )}
      style={stockStyle(template)}
    >
      {/* Card thickness */}
      <span className="absolute inset-0 [transform:translateZ(-4px)] rounded-[var(--radius-md)] bg-card-gold" />

      {/* Inside of the card */}
      <span className="absolute inset-0 overflow-hidden rounded-[var(--radius-md)] bg-card-ivory shadow-[0_24px_60px_-24px_rgb(0_0_0/0.45)]">
        {/* Paper darkens a touch toward its edges */}
        <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,color-mix(in_srgb,var(--card-ink)_10%,transparent))]" />
        <DecorSvg
          layers={motif.inside}
          width={width}
          height={height}
          className="absolute inset-0 size-full"
        />
        {/* Warm light that spills out of the seam as the doors crack open */}
        <span
          className="absolute inset-0"
          style={{
            opacity: `min(calc(${OPEN} * 3), calc((1 - ${OPEN}) * 1.4))`,
            background:
              "radial-gradient(ellipse 22% 70% at 50% 50%, var(--gold-glint), color-mix(in srgb, var(--marigold) 35%, transparent) 55%, transparent 80%)",
          }}
        />
        {symbol && (
          <span className="absolute inset-0" style={{ opacity: reveal(0).opacity }}>
            <DecorSvg layers={symbol} width={width} height={height} className="size-full" />
          </span>
        )}
        {inside.monogram && (
          <span
            className="absolute flex items-center font-display leading-none text-card-ink"
            style={{
              top: `${inside.monogram.top}cqw`,
              left: `${inside.monogram.x}cqw`,
              height: `${inside.monogram.size}cqw`,
              fontSize: `${inside.monogram.size}cqw`,
              gap: `${inside.monogram.size * 0.24}cqw`,
              transform: `translateX(-50%) translateY(${reveal(order(inside.monogram.top)).lift})`,
              opacity: reveal(order(inside.monogram.top)).opacity,
            }}
          >
            <span>{inside.monogram.initials[0]}</span>
            <span className="h-[85%] w-px bg-card-gold" />
            <span>{inside.monogram.initials[1]}</span>
          </span>
        )}
        {inside.runs.map((run, i) => (
          <Run
            key={run.key}
            run={run}
            index={i + (inside.monogram && run.top > inside.monogram.top ? 1 : 0)}
          />
        ))}
        {divider && inside.divider !== null && (
          <span
            className="absolute inset-0"
            style={{ opacity: reveal(order(inside.divider) + (inside.monogram ? 1 : 0)).opacity }}
          >
            <DecorSvg layers={divider} width={width} height={height} className="size-full" />
          </span>
        )}
      </span>

      {/* Doors */}
      <span className="absolute inset-0 [transform-style:preserve-3d]">
        <Door side="left" copy={copy} template={template} motif={motif} />
        <Door side="right" copy={copy} template={template} motif={motif} />
      </span>

      {/* Light catching the surface where the pointer is */}
      <span
        className="pointer-events-none absolute inset-0 rounded-[var(--radius-md)] mix-blend-soft-light"
        style={{
          opacity: "var(--glare, 0)",
          background:
            "radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 30%), rgb(255 255 255 / 0.6), transparent 55%)",
        }}
      />
    </span>
  );
}
