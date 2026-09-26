"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { GateCard } from "@/components/brand/gate-card";
import { landingText } from "@/i18n/copy";
import { useText } from "@/i18n/client";
import {
  approach,
  clamp,
  createFrameBudget,
  motionTier,
  openAmount,
  readDeviceHints,
  trackProgress,
} from "@/lib/hero-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/** Sticky header height in px; the stage pins just below it. */
const HEADER = 64;
/** Scrolling this far after a tap hands control back to the scroll position. */
const RELEASE_AFTER_SCROLL = 96;
const MAX_TILT = 8;
const DESKTOP = "(min-width: 1024px)";

/*
 * Petals: horizontal start, fall duration, delay, size, sway and colour. Fixed values keep
 * the server and browser markup identical. Lite phones show only the first eight.
 */
const PETALS = [
  [8, 9.5, -1.2, 1, 38, "marigold"],
  [18, 12, -6.5, 0.8, -30, "rose"],
  [27, 10.5, -3.1, 1.15, 26, "accent"],
  [36, 13, -9.4, 0.7, -42, "marigold"],
  [47, 11, -0.4, 0.95, 34, "rose"],
  [58, 9, -5.2, 1.1, -24, "marigold"],
  [69, 12.5, -2.6, 0.85, 40, "accent"],
  [82, 10, -7.8, 1, -34, "rose"],
  [91, 13.5, -4.4, 0.75, 22, "marigold"],
  [13, 14, -11, 0.65, 30, "accent"],
  [32, 9.8, -8.2, 0.9, -28, "marigold"],
  [52, 12.2, -10.1, 0.75, 36, "rose"],
  [64, 10.8, -1.9, 1.2, -38, "marigold"],
  [76, 13.2, -6.9, 0.7, 28, "accent"],
  [87, 11.4, -3.7, 0.95, -22, "rose"],
  [42, 14.5, -12.5, 0.6, 44, "marigold"],
] as const;

/* Petals resting on the ground around the open card, for every tier including still */
const GROUND = [
  [6, 90, -30, 0.9, "marigold"],
  [15, 94, 50, 0.7, "rose"],
  [24, 88, 10, 0.8, "accent"],
  [74, 91, -60, 0.85, "rose"],
  [84, 87, 25, 1, "marigold"],
  [93, 93, -10, 0.7, "accent"],
] as const;

const petalColour = {
  marigold: "text-marigold",
  rose: "text-rose",
  accent: "text-card-accent",
} as const;

function Petal({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 32" className={className} style={style} aria-hidden>
      <path d="M12 1C19 8 22 17 12 31 2 17 5 8 12 1Z" fill="currentColor" fillOpacity="0.92" />
      <path d="M12 5v22" stroke="var(--gold-glint)" strokeOpacity="0.35" strokeWidth="1" />
    </svg>
  );
}

/**
 * The landing page's live invitation. Scrolling opens the doors, the pointer or a sideways
 * finger drag turns the card, petals drift down and warm light spills out as it opens.
 * Tapping or pressing Enter opens and closes it too. Still mode and slow phones get
 * a calmer version; see src/lib/hero-motion.ts.
 */
export function HeroInvite() {
  const { hero } = useText(landingText);
  const still = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const controls = useRef<{ kick: () => void } | null>(null);

  // Motion state lives in refs and CSS variables so scrolling never re-renders
  const motion = useRef({
    open: 0,
    target: 0,
    override: null as number | null,
    tapScrollY: 0,
    tiltX: 0,
    tiltY: 0,
    tiltTargetX: 0,
    tiltTargetY: 0,
    frame: 0,
    last: 0,
    wasOpen: false,
  });

  useEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track) return;
    const m = motion.current;

    const paint = () => {
      stage.style.setProperty("--open", m.open.toFixed(4));
      stage.style.setProperty("--tilt-x", `${m.tiltX.toFixed(2)}deg`);
      stage.style.setProperty("--tilt-y", `${m.tiltY.toFixed(2)}deg`);
      const isOpen = m.open > 0.5;
      if (isOpen !== m.wasOpen) {
        m.wasOpen = isOpen;
        setOpen(isOpen);
      }
    };

    if (still) {
      // No scroll-linked motion: the card only changes when tapped, instantly
      m.open = m.target = m.override ?? 0;
      m.tiltX = m.tiltY = m.tiltTargetX = m.tiltTargetY = 0;
      paint();
      return;
    }

    stage.dataset.tier = motionTier(readDeviceHints());
    const budget = createFrameBudget(() => {
      stage.dataset.tier = "lite";
    });
    const desktop = window.matchMedia(DESKTOP);

    const scrollTarget = () => {
      // On desktop the whole hero pins; on phones only the card's own track does
      const el = desktop.matches
        ? (track.closest<HTMLElement>("[data-hero-track]") ?? track)
        : track;
      const rect = el.getBoundingClientRect();
      return openAmount(trackProgress(rect.top, rect.height, window.innerHeight, HEADER));
    };

    const tick = (now: number) => {
      const dt = m.last ? Math.min(now - m.last, 100) : 16;
      m.last = now;
      // A tap swings the doors at a stately pace; scrolling follows the finger closely
      m.open = approach(m.open, m.target, m.override === null ? 11 : 3.2, dt);
      m.tiltX = approach(m.tiltX, m.tiltTargetX, 7, dt);
      m.tiltY = approach(m.tiltY, m.tiltTargetY, 7, dt);
      paint();
      budget(dt);
      const settled = m.open === m.target && m.tiltX === m.tiltTargetX && m.tiltY === m.tiltTargetY;
      m.frame = settled ? 0 : requestAnimationFrame(tick);
      if (settled) m.last = 0;
    };

    const kick = () => {
      if (!m.frame) m.frame = requestAnimationFrame(tick);
    };

    controls.current = { kick };

    const onScroll = () => {
      if (m.override !== null && Math.abs(window.scrollY - m.tapScrollY) > RELEASE_AFTER_SCROLL) {
        m.override = null;
      }
      m.target = m.override ?? scrollTarget();
      kick();
    };

    // Start where the page already is (a reload can restore a scrolled position)
    m.target = m.override ?? scrollTarget();
    m.open = m.target;
    paint();

    // Pointer: a mouse or pen tilts toward itself; a sideways finger drag turns the card
    let dragStartX: number | null = null;
    const onPointerMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      if (event.pointerType === "touch") {
        if (dragStartX === null) return;
        m.tiltTargetY = clamp(((event.clientX - dragStartX) / rect.width) * 60, -24, 24);
      } else {
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        m.tiltTargetX = (0.5 - py) * 2 * MAX_TILT;
        m.tiltTargetY = (px - 0.5) * 2 * MAX_TILT;
        stage.style.setProperty("--glare-x", `${(px * 100).toFixed(1)}%`);
        stage.style.setProperty("--glare-y", `${(py * 100).toFixed(1)}%`);
        stage.style.setProperty("--glare", "1");
      }
      kick();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") dragStartX = event.clientX;
    };
    const release = () => {
      dragStartX = null;
      m.tiltTargetX = m.tiltTargetY = 0;
      stage.style.setProperty("--glare", "0");
      kick();
    };
    const onPointerEnd = (event: PointerEvent) => {
      if (event.pointerType === "touch") release();
    };

    // Petals pause while the hero is off screen
    const visibility = new IntersectionObserver(([entry]) => {
      stage.dataset.paused = entry?.isIntersecting ? "false" : "true";
    });
    visibility.observe(stage);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    desktop.addEventListener("change", onScroll);
    stage.addEventListener("pointermove", onPointerMove, { passive: true });
    stage.addEventListener("pointerdown", onPointerDown, { passive: true });
    stage.addEventListener("pointerup", onPointerEnd);
    stage.addEventListener("pointercancel", onPointerEnd);
    stage.addEventListener("pointerleave", release);

    return () => {
      controls.current = null;
      cancelAnimationFrame(m.frame);
      m.frame = 0;
      m.last = 0;
      visibility.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      desktop.removeEventListener("change", onScroll);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointerup", onPointerEnd);
      stage.removeEventListener("pointercancel", onPointerEnd);
      stage.removeEventListener("pointerleave", release);
    };
  }, [still]);

  const toggle = () => {
    const m = motion.current;
    const next = m.target > 0.5 ? 0 : 1;
    m.override = next;
    m.tapScrollY = window.scrollY;
    m.target = next;
    if (controls.current) {
      controls.current.kick();
      return;
    }
    // Still mode: jump straight to the new state
    m.open = next;
    m.wasOpen = next === 1;
    stageRef.current?.style.setProperty("--open", String(next));
    setOpen(next === 1);
  };

  return (
    // Phones: this column is the scroll track and the card pins inside it.
    // Desktop: the whole hero is the track (see Hero), so this is a plain column.
    <div ref={trackRef} className="relative h-[165svh] lg:h-auto motion-still:h-auto">
      <div
        ref={stageRef}
        data-tier="full"
        data-paused="false"
        className="group/stage sticky top-16 flex h-[calc(100svh-4rem)] touch-pan-y flex-col items-center justify-center gap-6 [--open-shrink:0.26] lg:static lg:h-auto lg:[--open-shrink:0.14] motion-still:static motion-still:h-auto motion-still:py-6"
      >
        {/* Warm light behind the card, brighter as it opens */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 -z-10 aspect-square w-[min(130%,44rem)] rounded-full blur-2xl"
          style={{
            opacity: "calc(0.45 + var(--open, 0) * 0.55)",
            transform: "translate(-50%, -50%) scale(calc(0.8 + var(--open, 0) * 0.3))",
            background:
              "radial-gradient(closest-side, color-mix(in srgb, var(--marigold) 38%, transparent), color-mix(in srgb, var(--rose) 10%, transparent) 60%, transparent)",
          }}
        />

        {/* Falling petals, clipped to the stage so they never widen the page */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-16 bottom-0 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] motion-still:hidden"
          style={{ opacity: "calc(var(--open, 0) * 1.4 - 0.25)" }}
        >
          {PETALS.map(([x, duration, delay, size, sway, colour], i) => (
            <span
              key={i}
              className="absolute top-0 block animate-petal-fall group-data-[paused=true]/stage:[animation-play-state:paused] group-data-[tier=lite]/stage:nth-[n+9]:hidden"
              style={
                {
                  left: `${x}%`,
                  animationDuration: `${duration}s`,
                  animationDelay: `${delay}s`,
                } as CSSProperties
              }
            >
              <span
                className="block animate-petal-sway group-data-[paused=true]/stage:[animation-play-state:paused]"
                style={
                  {
                    "--sway": `${sway}px`,
                    animationDuration: `${duration / 3}s`,
                    animationDelay: `${delay}s`,
                  } as CSSProperties
                }
              >
                <Petal
                  className={`block h-auto ${petalColour[colour]}`}
                  style={{ width: `${Math.round(size * 16)}px` }}
                />
              </span>
            </span>
          ))}
        </div>

        <figure className="relative flex w-[86%] max-w-[26rem] flex-col items-center gap-7 sm:w-[70%] lg:w-full lg:max-w-[30rem]">
          {/* Petals already on the ground, visible once the card is open */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[-8%] top-0 bottom-0"
            style={{ opacity: "calc(var(--open, 0) * 1.2 - 0.2)" }}
          >
            {GROUND.map(([x, y, rotate, size, colour], i) => (
              <Petal
                key={i}
                className={`absolute h-auto ${petalColour[colour]}`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: `${Math.round(size * 14)}px`,
                  transform: `rotate(${rotate}deg) rotateX(60deg)`,
                }}
              />
            ))}
          </div>

          <button
            type="button"
            aria-pressed={open}
            aria-label={hero.cardLabel.closed}
            onClick={toggle}
            className="group relative block w-full cursor-pointer rounded-[var(--radius-md)] [perspective:900px] lg:[perspective:1100px]"
          >
            {/* A gentle float on capable phones and desktops */}
            <span className="block [transform-style:preserve-3d] group-data-[tier=full]/stage:animate-float motion-still:animate-none">
              <span
                className="relative block [transform-style:preserve-3d]"
                style={{
                  transform: [
                    "rotateX(calc(var(--tilt-x, 0deg) + (1 - var(--open, 0)) * 10deg))",
                    "rotateY(var(--tilt-y, 0deg))",
                    "scale(calc(1 - var(--open, 0) * var(--open-shrink)))",
                  ].join(" "),
                }}
              >
                <span
                  aria-hidden
                  className="absolute -bottom-[9%] left-[8%] h-[10%] w-[84%] rounded-[50%] bg-night/30 blur-xl dark:bg-black/60"
                  style={{ opacity: "calc(1 - var(--open, 0) * 0.35)" }}
                />
                <GateCard copy={hero.card} />
              </span>
            </span>
          </button>

          <figcaption className="flex min-h-5 items-center gap-2 font-label text-xs tracking-[0.2em] text-ink-muted uppercase">
            <span aria-hidden className="size-1.5 rounded-full bg-marigold" />
            {open ? (
              hero.hint.close
            ) : (
              <>
                {/* Swapped in CSS so the server and the browser always agree */}
                <span className="motion-still:hidden">{hero.hint.scroll}</span>
                <span className="hidden motion-still:inline">{hero.hint.tap}</span>
              </>
            )}
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
