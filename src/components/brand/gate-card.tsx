import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { Mandala } from "./mandala";

export type GateCardCopy = {
  doors: readonly [string, string];
  families: string;
  first: string;
  second: string;
  line: string;
  date: string;
  venue: string;
};

/*
 * How far the doors have opened is the CSS variable --open (0 shut, 1 open) on any ancestor.
 * Everything below reads it in CSS, so scrolling and dragging never re-render React.
 */
const OPEN = "var(--open, 0)";

function Door({
  side,
  label,
  initial,
}: {
  side: "left" | "right";
  label: string;
  initial: string;
}) {
  const isLeft = side === "left";
  const style: CSSProperties = {
    transform: `rotateY(calc(${OPEN} * ${isLeft ? -110 : 110}deg))`,
    transformStyle: "preserve-3d",
  };

  return (
    <span
      className={cn(
        "absolute top-0 h-full w-1/2",
        isLeft ? "left-0 origin-left" : "right-0 origin-right",
      )}
      style={style}
    >
      {/* Front face */}
      <span
        className={cn(
          "absolute inset-0 overflow-hidden bg-card-ivory [backface-visibility:hidden]",
          isLeft ? "rounded-l-[var(--radius-md)]" : "rounded-r-[var(--radius-md)]",
        )}
      >
        <span className="absolute inset-[3.5%] border-2 border-card-gold" />
        <span className="absolute inset-[5.5%] border border-card-gold/60" />
        <Mandala
          className={cn(
            "absolute top-1/2 h-[72%] w-auto -translate-y-1/2 text-card-gold",
            isLeft ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2",
          )}
        />
        <span className="absolute inset-x-0 top-[12%] text-center font-label text-[2.6cqw] tracking-[0.35em] text-card-gold-text">
          {label}
        </span>
        <span className="absolute inset-x-0 bottom-[8%] text-center font-display text-[8cqw] leading-none text-card-accent-text">
          {initial}
        </span>
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

      {/* Back face: the inside of the door, a deep red with gold dots */}
      <span
        className={cn(
          "absolute inset-0 [transform:rotateY(180deg)] bg-card-back [backface-visibility:hidden]",
          isLeft ? "rounded-r-[var(--radius-md)]" : "rounded-l-[var(--radius-md)]",
        )}
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in srgb, var(--card-gold) 55%, transparent) 1.4px, transparent 1.6px)",
          backgroundSize: "14px 14px",
        }}
      >
        <span className="absolute inset-[4%] border border-card-gold/70" />
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

/** Each line of the inside fades up in turn as the doors part. */
function reveal(index: number): CSSProperties {
  const t = `clamp(0, calc((${OPEN} - 0.35 - ${index} * 0.07) * 4), 1)`;
  return { opacity: t, transform: `translateY(calc((1 - ${t}) * 6px))` };
}

/**
 * The gate-fold invitation in CSS 3D: an inside card, two doors that swing open,
 * and a thin gold edge behind so the card has thickness when it tilts.
 * Purely visual; the parent supplies the button, label and motion.
 */
export function GateCard({ copy, className }: { copy: GateCardCopy; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "[container-type:inline-size] relative block aspect-[5/4] w-full [transform-style:preserve-3d]",
        className,
      )}
    >
      {/* Card thickness */}
      <span className="absolute inset-0 [transform:translateZ(-4px)] rounded-[var(--radius-md)] bg-card-gold" />

      {/* Inside of the card */}
      <span className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-[var(--radius-md)] bg-card-ivory px-[8%] text-center text-card-ink shadow-[0_24px_60px_-24px_rgb(0_0_0/0.45)]">
        <span className="absolute inset-[2.5%] rounded-[4px] border-2 border-card-gold" />
        <span className="absolute inset-[4%] rounded-[2px] border border-card-gold/60" />
        {/* Warm light that spills out of the seam as the doors crack open */}
        <span
          className="absolute inset-0"
          style={{
            opacity: `min(calc(${OPEN} * 3), calc((1 - ${OPEN}) * 1.4))`,
            background:
              "radial-gradient(ellipse 22% 70% at 50% 50%, var(--gold-glint), color-mix(in srgb, var(--marigold) 35%, transparent) 55%, transparent 80%)",
          }}
        />
        <span
          className="relative font-label text-[2.9cqw] tracking-[0.3em] text-card-gold-text"
          style={reveal(0)}
        >
          {copy.families}
        </span>
        <span
          className="relative mt-[3%] font-display text-[8.5cqw] leading-[1.05]"
          style={reveal(1)}
        >
          {copy.first}
        </span>
        <span
          className="relative font-display text-[5cqw] leading-none text-card-accent-text"
          style={reveal(2)}
        >
          &amp;
        </span>
        <span className="relative font-display text-[8.5cqw] leading-[1.05]" style={reveal(3)}>
          {copy.second}
        </span>
        <span
          className="relative mt-[3%] text-[3.5cqw] text-card-ink-muted italic"
          style={reveal(4)}
        >
          {copy.line}
        </span>
        <span
          className="relative mt-[4%] font-label text-[3.4cqw] tracking-[0.12em]"
          style={reveal(5)}
        >
          {copy.date}
        </span>
        <span
          className="relative mt-[1.5%] font-display text-[4.2cqw] text-card-accent-text"
          style={reveal(6)}
        >
          {copy.venue}
        </span>
      </span>

      {/* Doors */}
      <span className="absolute inset-0 [transform-style:preserve-3d]">
        <Door side="left" label={copy.doors[0]} initial={copy.first.charAt(0)} />
        <Door side="right" label={copy.doors[1]} initial={copy.second.charAt(0)} />
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
