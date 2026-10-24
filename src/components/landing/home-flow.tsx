"use client";

import {
  BookUser,
  Camera,
  Check,
  CheckCheck,
  FileSpreadsheet,
  Music2,
  Pause,
  Play,
  Users,
} from "lucide-react";
import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { SocialIcon } from "@/components/brand/social-links";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import "./home-flow.css";

/** How long each step's screen shows while the steps play. */
const STEP_MS = 3200;

/** The words the phone and its steps use, worked out on the server (plain strings only). */
export type FlowCopy = {
  heading: string;
  pause: string;
  play: string;
  steps: readonly { title: string; body: string; label: string }[];
  phone: {
    designs: string;
    use: string;
    bride: string;
    groom: string;
    date: string;
    brideName: string;
    groomName: string;
    joiner: string;
    dateValue: string;
    cardLanguage: string;
    languages: readonly string[];
    /** The second language's code, when it isn't the page's own (Hindi on an English page). */
    cardLang?: string;
    open: string;
    addGuests: string;
    sources: readonly string[];
    guests: readonly { name: string; people: string }[];
    chat: string;
    message: string;
    linkTitle: string;
    video: string;
    replies: string;
    coming: string;
    wish: string;
    tally: string;
  };
};

const noSubscribe = () => () => {};

/** A delay for one of the screen's animations (home-flow.css). */
const at = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

/** A finger's tap over whatever it sits in. */
function Tap({ delay }: { delay: number }) {
  return (
    <span
      data-flow="tap"
      style={at(delay)}
      className="pointer-events-none absolute top-1/2 left-1/2 -mt-5 -ml-5 size-10 rounded-full border-2 border-marigold bg-marigold/30 opacity-0"
    />
  );
}

function Picture({
  src,
  className,
  sizes = "8rem",
}: {
  src: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes={sizes}
      // Small, and every screen's pictures are ready before the screen comes round
      loading="eager"
      fetchPriority="low"
      className={cn("object-cover object-top", className)}
    />
  );
}

/** A screen's title bar. */
function Bar({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center justify-between px-3.5 pt-2 pb-2 font-display text-[0.95rem] leading-tight text-ink">
      {children}
    </p>
  );
}

function ChooseScreen({
  copy,
  pictures,
}: {
  copy: FlowCopy["phone"];
  pictures: readonly string[];
}) {
  return (
    <div className="relative flex h-full flex-col">
      <Bar>{copy.designs}</Bar>
      {/* More designs than the screen holds, the last row running under the button */}
      <div className="grid grid-cols-2 gap-2 overflow-hidden px-3">
        {pictures.slice(0, 6).map((src, index) => (
          <div
            key={src}
            data-flow={index === 1 ? "pick" : "rise"}
            style={at(index === 1 ? 0.9 : index * 0.08)}
            className={cn(
              "relative aspect-[3/4] overflow-hidden rounded-lg bg-surface-2",
              index === 1 && "z-10 scale-105 shadow-[0_0_0_2px_var(--marigold)]",
            )}
          >
            <Picture src={src} />
            {index === 1 && <Tap delay={0.55} />}
          </div>
        ))}
      </div>
      <div
        data-flow="rise"
        style={at(1.3)}
        className="absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-paper via-paper/90 to-transparent p-3 pt-10"
      >
        <span className="block rounded-full bg-marigold py-2.5 text-center text-xs font-semibold text-on-marigold shadow-raised">
          {copy.use}
        </span>
      </div>
    </div>
  );
}

/** A field in the phone's form, its value typed in at a moment of its own. */
function Field({ label, value, delay }: { label: string; value: string; delay: number }) {
  return (
    <span className="flex flex-col gap-1">
      <span className="text-[0.65rem] font-semibold text-ink-muted">{label}</span>
      <span className="flex h-8 items-center rounded-md border border-line-control bg-surface px-2.5 text-xs text-ink">
        <span data-flow="type" style={at(delay)} className="whitespace-nowrap">
          {value}
        </span>
      </span>
    </span>
  );
}

function DetailsScreen({ copy, picture }: { copy: FlowCopy["phone"]; picture: string }) {
  return (
    <div className="flex h-full flex-col gap-3 px-3 pt-3">
      <div className="relative h-36 shrink-0 overflow-hidden rounded-xl bg-night">
        <Picture src={picture} sizes="16rem" />
        <span className="absolute inset-0 bg-linear-to-t from-night/85 via-night/20 to-transparent" />
        <span
          data-invitation
          data-flow="rise"
          style={at(1.5)}
          className="absolute inset-x-2 bottom-2.5 flex flex-col items-center text-center text-card-ivory"
        >
          <span className="font-display text-lg leading-tight">
            {copy.brideName} {copy.joiner} {copy.groomName}
          </span>
          <span className="font-label text-[0.6rem] tracking-[0.18em] uppercase">
            {copy.dateValue}
          </span>
        </span>
      </div>
      <Field label={copy.bride} value={copy.brideName} delay={0.2} />
      <Field label={copy.groom} value={copy.groomName} delay={0.85} />
      <Field label={copy.date} value={copy.dateValue} delay={1.5} />
      <span className="flex flex-col gap-1">
        <span className="text-[0.65rem] font-semibold text-ink-muted">{copy.cardLanguage}</span>
        <span className="flex gap-1.5">
          {copy.languages.map((language, index) => (
            <span
              key={language}
              lang={index === 1 ? copy.cardLang : undefined}
              data-flow={index === 1 ? "chip" : undefined}
              style={index === 1 ? at(2.1) : undefined}
              className={cn(
                "rounded-full border px-2.5 py-1 font-system text-[0.7rem] font-semibold",
                index === 1
                  ? "border-marigold-edge bg-marigold text-on-marigold"
                  : "border-line text-ink-muted",
              )}
            >
              {language}
            </span>
          ))}
        </span>
      </span>
    </div>
  );
}

/** Petals that fall once the doors open, each from a place and at a moment of its own. */
const PETALS = [
  { start: "8%", delay: 1.1, tone: "bg-marigold" },
  { start: "26%", delay: 1.6, tone: "bg-rose" },
  { start: "44%", delay: 1.3, tone: "bg-marigold" },
  { start: "62%", delay: 1.9, tone: "bg-rose" },
  { start: "78%", delay: 1.2, tone: "bg-marigold" },
  { start: "90%", delay: 1.7, tone: "bg-rose" },
];

function AliveScreen({ copy, picture }: { copy: FlowCopy["phone"]; picture: string }) {
  const door =
    "absolute inset-y-0 w-1/2 border-marigold/60 bg-night bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--marigold)_35%,transparent)_0_18%,transparent_19%)]";
  return (
    <div className="relative h-full overflow-hidden bg-night">
      <Picture src={picture} sizes="17rem" />
      <span className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-night/90 to-transparent" />
      <span
        data-invitation
        data-flow="rise"
        style={at(1.4)}
        className="absolute inset-x-3 bottom-8 flex flex-col items-center gap-1 text-center text-card-ivory"
      >
        <span className="font-display text-2xl leading-tight">
          {copy.brideName} {copy.joiner} {copy.groomName}
        </span>
        <span className="font-label text-[0.65rem] tracking-[0.2em] uppercase">
          {copy.dateValue}
        </span>
      </span>
      <span
        data-flow="pop"
        style={at(1.6)}
        className="absolute end-3 top-3 inline-flex items-center gap-1 rounded-full bg-night/70 px-2 py-1 text-card-ivory"
      >
        <Music2 aria-hidden className="size-3.5" />
        {[0, 1, 2].map((bar) => (
          <span
            key={bar}
            className="h-2.5 w-0.5 origin-bottom animate-sound-bar rounded-full bg-marigold motion-still:animate-none"
            style={{ animationDelay: `${bar * 0.2}s` }}
          />
        ))}
      </span>
      {PETALS.map((petal) => (
        <span
          key={petal.start}
          data-flow="fall"
          style={{ ...at(petal.delay), insetInlineStart: petal.start }}
          className={cn("absolute -top-4 size-2 rounded-[60%_0] motion-still:hidden", petal.tone)}
        />
      ))}
      {/* The doors, closed when the screen comes round, then opening on the invitation */}
      <span
        data-flow="door-start"
        style={at(0.55)}
        className={cn(door, "start-0 -translate-x-full border-e rtl:translate-x-full")}
      />
      <span
        data-flow="door-end"
        style={at(0.55)}
        className={cn(door, "end-0 translate-x-full border-s rtl:-translate-x-full")}
      />
      <span
        data-flow="fade-out"
        style={at(0.45)}
        className="absolute inset-x-6 bottom-10 rounded-full bg-marigold py-2.5 text-center text-xs font-semibold text-on-marigold opacity-0"
      >
        {copy.open}
        <Tap delay={0.15} />
      </span>
    </div>
  );
}

const SOURCE_ICONS = [BookUser, FileSpreadsheet, Camera];

/** A guest's first letter in a circle. */
function Initial({ name }: { name: string }) {
  return (
    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-marigold/20 text-[0.7rem] font-semibold text-accent-text">
      {Array.from(name)[0]}
    </span>
  );
}

function GuestsScreen({ copy, send }: { copy: FlowCopy["phone"]; send: string }) {
  return (
    <div className="relative flex h-full flex-col">
      <Bar>
        {copy.addGuests}
        <Users aria-hidden className="size-4 text-ink-muted" />
      </Bar>
      <div className="grid grid-cols-3 gap-1.5 px-3">
        {copy.sources.map((source, index) => {
          const Icon = SOURCE_ICONS[index] ?? BookUser;
          return (
            <span
              key={source}
              data-flow={index === 0 ? "pick" : undefined}
              style={index === 0 ? at(0.6) : undefined}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-lg border bg-surface px-1 py-2 text-center text-[0.62rem] leading-tight font-semibold text-ink",
                index === 0
                  ? "border-marigold-edge shadow-[0_0_0_1px_var(--marigold)]"
                  : "border-line",
              )}
            >
              <Icon aria-hidden className="size-4 text-accent-text" />
              {source}
              {index === 0 && <Tap delay={0.3} />}
            </span>
          );
        })}
      </div>
      <ul className="mt-3 flex flex-col gap-1.5 px-3">
        {copy.guests.map((guest, index) => (
          <li
            key={guest.name}
            data-flow="rise"
            style={at(1 + index * 0.3)}
            className="flex items-center gap-2 rounded-lg bg-surface px-2 py-1.5 ring-1 ring-line"
          >
            <Initial name={guest.name} />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-xs font-semibold text-ink">{guest.name}</span>
              <span className="text-[0.62rem] text-ink-muted">{guest.people}</span>
            </span>
            <Check aria-hidden className="size-4 text-success" strokeWidth={3} />
          </li>
        ))}
      </ul>
      <div data-flow="rise" style={at(2)} className="mt-auto p-3">
        <span className="flex items-center justify-center gap-1.5 rounded-full bg-marigold py-2.5 text-xs font-semibold text-on-marigold shadow-raised">
          <SocialIcon channel="whatsapp" className="size-4" />
          {send}
        </span>
      </div>
    </div>
  );
}

function SendScreen({ copy, picture }: { copy: FlowCopy["phone"]; picture: string }) {
  return (
    <div className="flex h-full flex-col bg-surface-2">
      <p className="flex items-center gap-2 border-b border-line bg-surface px-3 py-2">
        <span className="grid size-7 place-items-center rounded-full bg-success/15">
          <SocialIcon channel="whatsapp" className="size-4 text-success" />
        </span>
        <span className="truncate text-xs font-semibold text-ink">{copy.chat}</span>
      </p>
      <div className="flex flex-1 flex-col items-end gap-2 p-2.5">
        <div
          data-flow="rise"
          style={at(0.2)}
          className="w-[86%] overflow-hidden rounded-lg rounded-se-sm border border-success/25 bg-surface p-1 shadow-raised"
        >
          <span className="relative block aspect-[1.9] overflow-hidden rounded-md bg-surface-2">
            <Picture src={picture} sizes="14rem" />
          </span>
          <span className="block px-1.5 pt-1.5 text-[0.68rem] font-semibold text-ink">
            {copy.linkTitle}
          </span>
          <span className="block px-1.5 pt-0.5 pb-1 text-[0.66rem] leading-snug text-ink">
            {copy.message}
          </span>
          <span className="flex justify-end px-1.5 pb-0.5">
            <CheckCheck
              aria-hidden
              data-flow="read"
              style={at(1.2)}
              className="size-3.5 text-success"
            />
          </span>
        </div>
        <div
          data-flow="rise"
          style={at(1.4)}
          className="flex w-[62%] flex-col gap-1 rounded-lg rounded-se-sm border border-success/25 bg-surface p-1 shadow-raised"
        >
          <span className="relative block aspect-[4/5] overflow-hidden rounded-md bg-night">
            <Picture src={picture} sizes="10rem" className="opacity-85" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-9 place-items-center rounded-full bg-card-ivory/90 text-card-ink">
                <Play aria-hidden className="size-4 fill-current" />
              </span>
            </span>
          </span>
          <span className="self-start rounded-full bg-success/15 px-2 py-0.5 text-[0.62rem] font-semibold text-success">
            {copy.video}
          </span>
        </div>
      </div>
    </div>
  );
}

function RepliesScreen({ copy }: { copy: FlowCopy["phone"] }) {
  return (
    <div className="flex h-full flex-col">
      <Bar>
        {copy.replies}
        <span
          data-flow="pop"
          style={at(1.5)}
          className="rounded-full bg-success/15 px-2 py-0.5 font-sans text-[0.68rem] font-semibold text-success"
        >
          {copy.tally}
        </span>
      </Bar>
      <ul className="flex flex-col gap-1.5 px-3">
        {copy.guests.map((guest, index) => (
          <li
            key={guest.name}
            className="flex items-center gap-2 rounded-lg bg-surface px-2 py-1.5 ring-1 ring-line"
          >
            <Initial name={guest.name} />
            <span className="flex min-w-0 flex-1 flex-col items-start gap-1">
              <span className="max-w-full truncate text-xs font-semibold text-ink">
                {guest.name}
              </span>
              <span
                data-flow="pop"
                style={at(0.4 + index * 0.35)}
                className="inline-flex max-w-full items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[0.62rem] font-semibold text-success"
              >
                <Check aria-hidden className="size-3 shrink-0" strokeWidth={3} />
                <span className="truncate">
                  {copy.coming} · {guest.people}
                </span>
              </span>
            </span>
          </li>
        ))}
      </ul>
      <p
        data-flow="rise"
        style={at(1.9)}
        className="mx-3 mt-3 self-start rounded-lg rounded-ss-sm bg-surface px-2.5 py-2 text-[0.7rem] text-ink shadow-raised ring-1 ring-line"
      >
        {copy.wish}
      </p>
    </div>
  );
}

/**
 * How Shubh works, played on a phone: choose a design, add the details, see it come alive,
 * add the guests, send it on WhatsApp, and the replies come in. Each step shows for a few
 * seconds and the steps loop while the phone is in view; Pause holds them, and any step
 * can be chosen. In still mode nothing plays by itself and each screen shows complete.
 * The phone is a picture (hidden from screen readers): the list of steps says it in words.
 */
export function HomeFlow({
  copy,
  pictures,
  className,
}: {
  copy: FlowCopy;
  /** Painted covers: four to choose from, the second the one chosen. */
  pictures: readonly string[];
  className?: string;
}) {
  const still = useReducedMotion();
  // Marks when the steps answer taps, for tests that wait for the page to come alive
  const live = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );
  const [step, setStep] = useState(0);
  // The visitor's own choice; still mode starts paused
  const [paused, setPaused] = useState<boolean | null>(null);
  const [inView, setInView] = useState(true);
  // Starts the screen and its bar over when the steps play again
  const [run, setRun] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const total = copy.steps.length;
  const holding = paused ?? still;
  const playing = !holding && inView;

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    let visible = true;
    let shown = document.visibilityState === "visible";
    let was = true;
    const update = () => {
      const now = visible && shown;
      setInView(now);
      // Back in view: the step starts over, so its bar and its timer agree
      if (now && !was) setRun((count) => count + 1);
      was = now;
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      update();
    });
    const onVisibility = () => {
      shown = document.visibilityState === "visible";
      update();
    };
    observer.observe(node);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setStep((current) => (current + 1) % total), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [playing, step, run, total]);

  const choose = (index: number) => {
    setStep(index);
    setRun((count) => count + 1);
  };
  const toggle = () => {
    if (holding) setRun((count) => count + 1);
    setPaused(!holding);
  };
  const chosen = pictures[1] ?? pictures[0] ?? "";
  const current = copy.steps[step]!;
  const screens = [
    <ChooseScreen key="choose" copy={copy.phone} pictures={pictures} />,
    <DetailsScreen key="details" copy={copy.phone} picture={chosen} />,
    <AliveScreen key="alive" copy={copy.phone} picture={chosen} />,
    <GuestsScreen key="guests" copy={copy.phone} send={copy.steps[4]?.title ?? ""} />,
    <SendScreen key="send" copy={copy.phone} picture={chosen} />,
    <RepliesScreen key="replies" copy={copy.phone} />,
  ];

  return (
    <div
      ref={root}
      data-flow-live={live}
      data-flow-step={step}
      data-flow-paused={playing ? undefined : ""}
      style={{ "--flow-step": `${STEP_MS}ms` } as CSSProperties}
      className={cn(
        "flex flex-col items-center gap-5 md:flex-row md:items-center md:justify-center md:gap-8",
        className,
      )}
    >
      {/* The phone */}
      <div
        aria-hidden
        className="relative h-[29rem] w-[14.5rem] shrink-0 rounded-[2.4rem] bg-night p-2 shadow-overlay ring-1 ring-line-strong sm:h-[33rem] sm:w-[16.5rem] dark:bg-line"
      >
        <span className="absolute top-3.5 left-1/2 z-20 h-4 w-16 -translate-x-1/2 rounded-full bg-night dark:bg-line" />
        <div
          key={run}
          className="flow-screen relative h-full overflow-hidden rounded-[1.9rem] bg-paper pt-7"
        >
          {screens.map((screen, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-x-0 top-7 bottom-0",
                // The doors fill the whole screen, under the camera
                index === 2 && "top-0",
                index !== step && "hidden",
              )}
            >
              {screen}
            </div>
          ))}
        </div>
      </div>

      {/* The steps: a list on a wider screen, a bar of six beside the step's words on a phone */}
      <div className="flex w-full max-w-[17rem] flex-col gap-3 md:max-w-[19rem] md:rounded-2xl md:bg-surface/90 md:p-2 md:shadow-raised md:ring-1 md:ring-line md:backdrop-blur-sm">
        <h2 className="sr-only">{copy.heading}</h2>
        <ol className="grid grid-cols-6 gap-1.5 md:flex md:flex-col md:gap-1">
          {copy.steps.map((item, index) => {
            const active = index === step;
            return (
              <li key={item.title}>
                <button
                  type="button"
                  onClick={() => choose(index)}
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "group flex h-11 w-full cursor-pointer items-center rounded-lg text-start transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:h-auto md:min-h-11 md:items-start md:gap-3 md:px-3 md:py-2.5",
                    active ? "md:bg-surface-2" : "md:hover:bg-surface-2/60",
                  )}
                >
                  <span
                    className={cn(
                      "hidden size-7 shrink-0 place-items-center rounded-full font-label text-xs md:grid",
                      active ? "bg-marigold text-on-marigold" : "bg-surface-2 text-ink-muted",
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className="flex w-full min-w-0 flex-col gap-1.5">
                    <span className="flex flex-col gap-0.5 max-md:sr-only">
                      <span className="text-[0.7rem] text-ink-muted max-md:sr-only md:hidden">
                        {item.label}
                      </span>
                      <span
                        className={cn(
                          "text-ui leading-snug font-semibold",
                          active ? "text-ink" : "text-ink-muted group-hover:text-ink",
                        )}
                      >
                        {item.title}
                      </span>
                      <span className={cn("text-sm text-ink-muted", !active && "hidden")}>
                        {item.body}
                      </span>
                    </span>
                    {/* How far along this step is */}
                    <span
                      className={cn(
                        "relative block h-1 overflow-hidden rounded-full bg-line",
                        !active && "md:hidden",
                        index < step && "max-md:bg-marigold",
                      )}
                    >
                      {active && (
                        <span
                          key={`${step}-${run}`}
                          className={cn(
                            "absolute inset-0 rounded-full bg-marigold",
                            !holding && "flow-progress",
                          )}
                        />
                      )}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        {/* On a phone, the step's words under its bar */}
        <p aria-hidden className="flex flex-col gap-0.5 text-center md:hidden">
          <span className="font-label text-xs tracking-[0.18em] text-accent-text uppercase">
            {current.label}
          </span>
          <span className="font-display text-lg leading-tight text-ink">{current.title}</span>
          <span className="text-sm text-ink-muted">{current.body}</span>
        </p>
        <button
          type="button"
          onClick={toggle}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 self-center rounded-full px-4 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:self-start"
        >
          {holding ? (
            <Play aria-hidden className="size-4 rtl:rotate-180" />
          ) : (
            <Pause aria-hidden className="size-4" />
          )}
          {holding ? copy.play : copy.pause}
        </button>
      </div>
    </div>
  );
}
