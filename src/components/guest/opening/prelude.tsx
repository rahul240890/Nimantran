"use client";

import { useEffect, useRef, useState } from "react";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/cn";
import { isPrelude, pickPrelude, type Prelude } from "@/lib/opening/preludes";
import { SUITES, type SuiteId } from "@/lib/suites/catalog";
import { lettering } from "@/lib/suites/lettering";
import type { CardLanguage } from "@/lib/templates/card-languages";
import type { Faith } from "@/lib/traditions/faith";
import { SCENES, type PreludeColors, type SceneKit } from "./prelude-scenes";
import "@/app/preludes.css";

/** The longest a prelude can hold the gate back, whatever happens in it. */
const CAP_MS = 12_000;
/** How long the prelude takes to fade from the gate. */
const LEAVE_MS = 1000;

type GuestPreludeProps = {
  suite: SuiteId;
  faith: Faith;
  lang: CardLanguage;
  names: { first: string; second: string; joiner: string };
  /** The names' first letters in English letters, whatever the card's language. */
  initials: { first: string; second: string };
  greeting: { dear: string; name: string } | null;
  skipLabel: string;
};

function readColors(root: HTMLElement): PreludeColors {
  const style = getComputedStyle(root);
  const token = (name: string) => style.getPropertyValue(`--${name}`).trim();
  return {
    night: token("night"),
    gold: token("suite-gold") || token("card-gold"),
    glint: token("gold-glint"),
    ivory: token("card-ivory"),
    marigold: token("marigold"),
    accent: token("suite-accent") || token("card-back"),
    light: token("suite-light") || token("marigold"),
    leaf: token("suite-leaf") || token("prelude-peacock-green"),
    cardAccent: token("card-accent"),
    henna: token("prelude-henna"),
    skin: token("prelude-skin"),
    thread: token("prelude-thread"),
    stripe: token("prelude-thread-stripe"),
    teal: token("prelude-peacock-teal"),
    blue: token("prelude-peacock-blue"),
    green: token("prelude-peacock-green"),
    clay: token("prelude-clay"),
    water: token("prelude-water"),
    fog: token("prelude-fog"),
  };
}

/**
 * A few seconds of motion the moment the guest opens the invitation, before the closed
 * gate (owner, 2026-11-04): one of ten, at random, never one this phone has just seen. It
 * covers the page while the gate's paintings load beneath it, then fades away from the
 * gate. A tap on Skip or Escape goes straight to the gate; reduced motion never sees it.
 */
export function GuestPrelude({
  suite,
  faith,
  lang,
  names,
  initials,
  greeting,
  skipLabel,
}: GuestPreludeProps) {
  // Drawn from the first paint (the page is cached), so the gate never flashes before it
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const fx = useRef<HTMLDivElement>(null);
  const frost = useRef<HTMLDivElement>(null);
  const leave = useRef<() => void>(() => {});
  // What the scene is told, fixed for the visit when the prelude starts
  const told = useRef({ suite, lang, names, initials, greeting });

  useEffect(() => {
    const still =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.dataset.motion === "reduce";
    let alive = true;
    let left = false;
    let timer = 0;
    const go = (fade: boolean) => {
      if (left) return;
      left = true;
      setLeaving(true);
      timer = window.setTimeout(
        () => {
          alive = false;
          setGone(true);
        },
        fade ? LEAVE_MS : 0,
      );
    };
    leave.current = () => {
      alive = false;
      go(false);
    };
    // ?prelude=kolam shows that one, to review it; automated browsers otherwise skip it
    const asked = new URLSearchParams(window.location.search).get("prelude");
    const forced = isPrelude(asked) ? asked : null;
    if (still || (navigator.webdriver && !forced)) {
      go(false);
      return () => window.clearTimeout(timer);
    }
    const chosen: Prelude = forced ?? pickPrelude(faith);
    // The misty window sets its glass over the gate itself, without the painting
    if (root.current) root.current.dataset.prelude = chosen;
    const cap = window.setTimeout(() => go(true), CAP_MS);
    // The scene starts once React has drawn the layers it paints into
    const start = requestAnimationFrame(() => {
      const el = root.current;
      const cv = canvas.current;
      const layer = fx.current;
      const glass = frost.current;
      if (!el || !cv || !layer || !glass) return go(false);
      const ctx = cv.getContext("2d");
      if (!ctx) return go(false);
      const lite =
        (navigator.hardwareConcurrency || 8) <= 4 ||
        ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 3;
      const dpr = Math.min(lite ? 1.5 : 2, window.devicePixelRatio || 1);
      const box = el.getBoundingClientRect();
      cv.width = Math.round(box.width * dpr);
      cv.height = Math.round(box.height * dpr);
      const { suite: theme, lang: language } = told.current;
      const voice = SUITES[theme].voice ?? "regal";
      const kit: SceneKit = {
        root: el,
        cv,
        ctx,
        fx: layer,
        frost: glass,
        w: cv.width,
        h: cv.height,
        dpr,
        lite,
        alive: () => alive,
        colors: readColors(el),
        names: told.current.names,
        initials: told.current.initials,
        greeting: told.current.greeting,
        faces: {
          names: lettering(voice, "names", language).family,
          hand: lettering("romantic", "names", language).family,
          latinHand: lettering("romantic", "names", "en").family,
          display: '"Cormorant Garamond", "Tiro Devanagari Hindi", Georgia, serif',
        },
        reveal: () => go(true),
      };
      SCENES[chosen](kit)
        .catch(() => {})
        .finally(() => go(true));
    });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") leave.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      alive = false;
      cancelAnimationFrame(start);
      window.clearTimeout(cap);
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [faith]);

  if (gone) return null;
  const cover = SUITES[suite].images.cover;
  return (
    <div
      ref={root}
      data-suite={suite}
      className={cn(
        "prelude fixed inset-0 z-[70] overflow-hidden bg-night transition-opacity duration-1000 ease-out",
        leaving && "pointer-events-none opacity-0",
      )}
    >
      {cover && (
        <Image
          src={cover}
          alt=""
          fill
          sizes="100vw"
          className="prelude-ground scale-105 object-cover blur-[5px] brightness-[0.42] saturate-[1.15]"
        />
      )}
      <div aria-hidden className="prelude-ground prelude-glow absolute inset-0" />
      <div ref={frost} aria-hidden className="absolute inset-0" />
      <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
      <div ref={fx} aria-hidden className="pointer-events-none absolute inset-0" />
      <button
        type="button"
        onClick={() => leave.current()}
        className="absolute top-[calc(env(safe-area-inset-top,0px)+0.75rem)] right-[calc(env(safe-area-inset-right,0px)+0.75rem)] inline-flex min-h-11 min-w-11 items-center rounded-full border border-card-ivory/30 bg-night/45 px-4 text-sm text-card-ivory backdrop-blur-sm hover:bg-night/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {skipLabel}
      </button>
    </div>
  );
}
