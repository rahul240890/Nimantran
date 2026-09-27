"use client";

import { Music, Pause } from "lucide-react";
import dynamic from "next/dynamic";
import {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/cn";
import type { MusicPlayer } from "@/lib/engine/music-player";
import {
  pickQuality,
  readDeviceProfile,
  type DeviceProfile,
  type QualityLevel,
  type QualityReason,
} from "@/lib/engine/quality";
import { TEMPLATES } from "@/lib/templates/catalog";
import type { CardCopy } from "@/lib/templates/content";
import type { Template } from "@/lib/templates/schema";
import { stockStyle } from "@/lib/templates/stock";
import { useDarkTheme } from "@/lib/use-color-scheme";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { CARD_FORMATS, type CardFormatId } from "./formats";
import { useText } from "@/i18n/client";
import { uiText } from "@/i18n/copy";

const Stage = dynamic(() => import("./three/stage"), { ssr: false });

export type InvitationLabels = {
  open: string;
  close: string;
  playMusic: string;
  pauseMusic: string;
  preparing: string;
  and: string;
};

export type EngineState = "poster" | "loading" | "ready" | "fallback";

export type EngineStatus = {
  state: EngineState;
  /** What is drawing now. */
  level: QualityLevel;
  /** What the device was judged able to do on arrival. */
  detected: QualityLevel | null;
  reason: QualityReason;
};

export type InvitationProps = {
  copy: CardCopy;
  /** The design: scene, colours, type and music. */
  template?: Template;
  /** "auto" picks from the device; a level forces it (for review screens). */
  quality?: "auto" | QualityLevel;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Start the music when the guest opens the card (a tap, so browsers allow sound). */
  musicOnOpen?: boolean;
  labels?: InvitationLabels;
  /** The language the card's words are in, for screen readers. */
  lang?: string;
  onStatus?: (status: EngineStatus) => void;
  onFps?: (fps: number) => void;
  className?: string;
};

/* The device profile never changes during a visit, so read it once */
let cachedProfile: DeviceProfile | null = null;
const noSubscribe = () => () => {};
function useDeviceProfile(): DeviceProfile | null {
  return useSyncExternalStore(
    noSubscribe,
    () => (cachedProfile ??= readDeviceProfile()),
    () => null,
  );
}

const MUTED_KEY = "nimantran-music-muted";
function readMuted(): boolean {
  try {
    return sessionStorage.getItem(MUTED_KEY) === "1";
  } catch {
    return false;
  }
}
function writeMuted(muted: boolean) {
  try {
    if (muted) sessionStorage.setItem(MUTED_KEY, "1");
    else sessionStorage.removeItem(MUTED_KEY);
  } catch {
    // Storage blocked: the choice still holds for this page
  }
}

/** Falls back to the 2D card if the 3D code fails to load or throws. */
class StageBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override componentDidCatch() {
    this.props.onError();
  }
  override render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The invitation engine. A light 2D card paints at once (and is all that weak devices,
 * data saver and very slow networks ever load); capable devices then load the 3D scene
 * in the background and cross-fade to it when its first frame is ready. If frames run
 * slow the scene steps down a level, and on to the 2D card if it must.
 */
export function Invitation({
  copy,
  template = TEMPLATES.marigold,
  quality = "auto",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  musicOnOpen = true,
  labels: labelsProp,
  lang,
  onStatus,
  onFps,
  className,
}: InvitationProps) {
  const { uiStrings } = useText(uiText);
  const labels = labelsProp ?? uiStrings.invitation;
  const format: CardFormatId = template.scene.format;
  const Flat = CARD_FORMATS[format].Flat;
  const still = useReducedMotion();
  const dark = useDarkTheme();
  const profile = useDeviceProfile();

  const [openState, setOpenState] = useState(defaultOpen);
  const open = openProp ?? openState;

  // What the device can do, or what a reviewer forced
  const detected = profile ? pickQuality(profile) : null;
  const chosen: { level: QualityLevel; reason: QualityReason } | null = !detected
    ? null
    : quality === "auto"
      ? detected
      : quality !== "2d" && profile?.webgl === 0
        ? { level: "2d", reason: "no-webgl" }
        : { level: quality, reason: "chosen" };

  // A fresh stage for each forced level, so antialiasing and shadows are set up again
  const stageKey = `${quality}:${format}`;
  const [override, setOverride] = useState<{
    key: string;
    level: QualityLevel;
    reason: QualityReason;
  } | null>(null);
  const current = override?.key === stageKey ? override : chosen;
  const level = current?.level ?? "2d";
  const renders3d = current !== null && level !== "2d";

  // Load three.js only once the page has settled, so the first paint and taps stay quick
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    if (!renders3d || idle) return;
    const schedule = window.requestIdleCallback ?? ((fn: () => void) => window.setTimeout(fn, 200));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = schedule(() => setIdle(true), { timeout: 1500 });
    return () => cancel(handle);
  }, [renders3d, idle]);

  const [readyKey, setReadyKey] = useState<string | null>(null);
  const ready = renders3d && readyKey === stageKey;
  const onReady = useCallback(() => setReadyKey(stageKey), [stageKey]);
  const onStepDown = useCallback(
    (next: QualityLevel) => setOverride({ key: stageKey, level: next, reason: "slow-frames" }),
    [stageKey],
  );
  const onFail = useCallback(
    (reason: QualityReason) => setOverride({ key: stageKey, level: "2d", reason }),
    [stageKey],
  );
  const onLoadError = useCallback(() => onFail("load-failed"), [onFail]);

  // Draw nothing while the card is off screen or the tab is hidden
  const root = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(true);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) =>
      setOnScreen(entry?.isIntersecting ?? true),
    );
    observer.observe(element);
    const onVisibility = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const state: EngineState = !current
    ? "poster"
    : level === "2d"
      ? "fallback"
      : ready
        ? "ready"
        : "loading";

  useEffect(() => {
    onStatus?.({
      state,
      level,
      detected: detected?.level ?? null,
      reason: current?.reason ?? "chosen",
    });
  }, [onStatus, state, level, detected?.level, current?.reason]);

  // Music: composed live, so it costs no data; loaded only when first played
  const { raga, tempo } = template.music;
  const music = useMemo(() => ({ raga, tempo }), [raga, tempo]);
  const player = useRef<MusicPlayer | null>(null);
  const [playing, setPlaying] = useState(false);
  const playMusic = useCallback(async () => {
    try {
      if (!player.current) {
        const { MusicPlayer } = await import("@/lib/engine/music-player");
        player.current = new MusicPlayer(music);
      }
      await player.current.play();
      setPlaying(true);
    } catch {
      // No Web Audio: the button simply stays off
      setPlaying(false);
    }
  }, [music]);
  const pauseMusic = useCallback(() => {
    player.current?.pause();
    setPlaying(false);
  }, []);

  useEffect(() => {
    player.current?.setTrack(music);
  }, [music]);
  useEffect(() => () => player.current?.dispose(), []);

  // Quiet in a background tab; carry on when the guest comes back
  const resumeOnShow = useRef(false);
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden" && player.current?.isPlaying) {
        resumeOnShow.current = true;
        player.current.pause();
      } else if (document.visibilityState === "visible" && resumeOnShow.current) {
        resumeOnShow.current = false;
        void player.current?.play();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const toggleMusic = () => {
    if (playing) {
      writeMuted(true);
      pauseMusic();
    } else {
      writeMuted(false);
      void playMusic();
    }
  };

  const toggle = useCallback(() => {
    const next = !open;
    if (openProp === undefined) setOpenState(next);
    onOpenChange?.(next);
    if (next && musicOnOpen && !playing && !readMuted()) void playMusic();
  }, [open, openProp, onOpenChange, musicOnOpen, playing, playMusic]);

  const flatStyle = {
    ...stockStyle(template),
    "--open": open ? 1 : 0,
    transition: "--open 1.5s cubic-bezier(0.16, 1, 0.3, 1)",
  } as CSSProperties;

  return (
    <div
      ref={root}
      data-engine-state={state}
      data-engine-level={level}
      className={cn("flex h-full min-h-0 w-full flex-col", className)}
    >
      {/* The invitation itself, for screen readers; the pictures below are decorative */}
      <div className="sr-only" lang={lang}>
        {copy.blessing && <p>{copy.blessing}</p>}
        {copy.families && <p>{copy.families}</p>}
        <p>
          {copy.first} {!copy.joiner || copy.joiner === "&" ? labels.and : copy.joiner}{" "}
          {copy.second}
        </p>
        {copy.line && <p>{copy.line}</p>}
        <p>{copy.date}</p>
        <p>{copy.venue}</p>
      </div>

      <div className="relative min-h-0 flex-1">
        {/* 2D card: first paint, weak devices, and the fallback if 3D fails */}
        <div
          aria-hidden
          onClick={toggle}
          className={cn(
            "absolute inset-0 flex cursor-pointer items-center justify-center transition-opacity duration-500 [perspective:1100px]",
            ready && "pointer-events-none opacity-0",
          )}
          style={flatStyle}
        >
          <div
            className="w-[min(88%,30rem)] [transform-style:preserve-3d]"
            style={{
              transform:
                "rotateX(calc((1 - var(--open, 0)) * 10deg)) scale(calc(1 - var(--open, 0) * 0.16))",
            }}
          >
            <Flat copy={copy} template={template} />
          </div>
        </div>

        {renders3d && idle && (
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              ready ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <StageBoundary key={stageKey} onError={onLoadError}>
              <Stage
                key={stageKey}
                copy={copy}
                template={template}
                format={format}
                level={level}
                open={open}
                still={still}
                paused={!onScreen || !visible}
                dark={dark}
                onToggle={toggle}
                onReady={onReady}
                onStepDown={onStepDown}
                onFail={onFail}
                onFps={onFps}
              />
            </StageBoundary>
          </div>
        )}

        {state === "loading" && (
          <span
            aria-hidden
            className="absolute end-3 top-3 inline-flex items-center gap-2 rounded-full border border-line bg-surface/85 px-3 py-1.5 font-label text-[0.7rem] tracking-[0.18em] text-ink-muted uppercase shadow-raised backdrop-blur-sm"
          >
            <Spinner className="size-3.5" />
            {labels.preparing}
          </span>
        )}
      </div>

      <div className="flex shrink-0 items-center justify-center gap-3 pt-4">
        <Button variant={open ? "secondary" : "primary"} onClick={toggle} className="min-w-44">
          {open ? labels.close : labels.open}
        </Button>
        <IconButton
          label={playing ? labels.pauseMusic : labels.playMusic}
          icon={playing ? <Pause /> : <Music />}
          variant="secondary"
          onClick={toggleMusic}
        />
      </div>
    </div>
  );
}
