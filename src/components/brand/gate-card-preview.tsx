"use client";

import { useState, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { Mandala } from "./mandala";

const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

type DoorProps = {
  side: "left" | "right";
  open: boolean;
  label: string;
  initial: string;
};

function Door({ side, open, label, initial }: DoorProps) {
  const isLeft = side === "left";
  const angle = open ? 108 : 0;
  const style: CSSProperties = {
    transform: `rotateY(${isLeft ? -angle : angle}deg)`,
    transition: `transform 1100ms ${EASE}`,
    transformStyle: "preserve-3d",
  };

  return (
    <div
      className={cn(
        "absolute top-0 h-full w-1/2",
        isLeft ? "left-0 origin-left" : "right-0 origin-right",
      )}
      style={style}
    >
      {/* Front face */}
      <div
        className={cn(
          "absolute inset-0 overflow-hidden bg-card-ivory [backface-visibility:hidden]",
          isLeft ? "rounded-l-[var(--radius-md)]" : "rounded-r-[var(--radius-md)]",
        )}
      >
        <div className="absolute inset-[3.5%] border-2 border-card-gold" />
        <div className="absolute inset-[5.5%] border border-card-gold/60" />
        <Mandala
          className={cn(
            "absolute top-1/2 h-[72%] w-auto -translate-y-1/2 text-card-gold",
            isLeft ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2",
          )}
        />
        <span className="absolute inset-x-0 top-[12%] text-center font-label text-[2.6cqw] tracking-[0.35em] text-card-gold">
          {label}
        </span>
        <span className="absolute inset-x-0 bottom-[8%] text-center font-display text-[8cqw] leading-none text-card-accent">
          {initial}
        </span>
        {/* Soft shadow where the doors meet */}
        <div
          className={cn(
            "absolute inset-y-0 w-[6%] from-transparent to-black/10",
            isLeft ? "right-0 bg-gradient-to-r" : "left-0 bg-gradient-to-l",
          )}
        />
      </div>

      {/* Back face */}
      <div
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
        <div className="absolute inset-[4%] border border-card-gold/70" />
      </div>
    </div>
  );
}

type GateCardPreviewProps = {
  className?: string;
};

/**
 * A lightweight CSS 3D preview of the gate-fold invitation.
 * The full WebGL invitation engine arrives in Step 4; this keeps the holding page fast.
 */
export function GateCardPreview({ className }: GateCardPreviewProps) {
  const [open, setOpen] = useState(false);

  return (
    <figure
      className={cn(
        "mx-auto flex w-[88%] max-w-[460px] flex-col items-center gap-5 sm:w-full",
        className,
      )}
    >
      <button
        type="button"
        aria-pressed={open}
        aria-label={open ? "Close the sample invitation" : "Open the sample invitation"}
        onClick={() => setOpen((v) => !v)}
        className="group [container-type:inline-size] relative aspect-[5/4] w-full cursor-pointer rounded-[var(--radius-md)] [perspective:1600px]"
      >
        {/* Shrinks a little while open so the swung doors stay inside the column */}
        <span
          aria-hidden
          className="absolute inset-0 [transform-style:preserve-3d]"
          style={{
            transform: `scale(${open ? 0.7 : 1})`,
            transition: `transform 1100ms ${EASE}`,
          }}
        >
          {/* Ground shadow */}
          <span
            aria-hidden
            className="absolute -bottom-[7%] left-[8%] h-[10%] w-[84%] rounded-[50%] bg-black/25 blur-xl dark:bg-black/60"
          />

          {/* Inside of the card */}
          <span
            aria-hidden
            className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-[var(--radius-md)] bg-card-ivory px-[8%] text-center text-card-ink shadow-[0_24px_60px_-24px_rgb(0_0_0/0.45)]"
          >
            <span className="absolute inset-[2.5%] rounded-[4px] border-2 border-card-gold" />
            <span className="absolute inset-[4%] rounded-[2px] border border-card-gold/60" />
            <span className="font-label text-[2.9cqw] tracking-[0.3em] text-card-gold">
              TOGETHER WITH THEIR FAMILIES
            </span>
            <span className="mt-[3%] font-display text-[8.5cqw] leading-[1.05]">Aarav</span>
            <span className="font-display text-[5cqw] leading-none text-card-accent">&amp;</span>
            <span className="font-display text-[8.5cqw] leading-[1.05]">Meera</span>
            <span className="mt-[3%] text-[3.5cqw] text-card-ink-muted italic">
              invite you to celebrate their wedding
            </span>
            <span className="mt-[4%] font-label text-[3.4cqw] tracking-[0.12em]">
              SATURDAY, 12 DECEMBER 2026
            </span>
            <span className="mt-[1.5%] font-display text-[4.2cqw] text-card-accent">
              Pichola Lakeside Gardens, Udaipur
            </span>
          </span>

          {/* Doors, with a small hover nudge on devices that can hover */}
          <span
            aria-hidden
            className={cn(
              "absolute inset-0 transition-transform duration-500 [transform-style:preserve-3d]",
              !open && "group-hover:[transform:rotateX(4deg)_rotateY(-6deg)]",
            )}
          >
            <Door side="left" open={open} label="SHUBH" initial="A" />
            <Door side="right" open={open} label="VIVAH" initial="M" />
          </span>
        </span>
      </button>
      <figcaption className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase">
        Sample invite · tap to {open ? "close" : "open"}
      </figcaption>
    </figure>
  );
}
