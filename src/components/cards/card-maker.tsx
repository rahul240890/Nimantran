"use client";

import { CalendarHeart, Download, HeartHandshake, Lock, RotateCcw, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CharacterCount, Textarea } from "@/components/ui/textarea";
import { useText } from "@/i18n/client";
import { cardsText } from "@/i18n/copy/cards";
import { publishText } from "@/i18n/copy/publish";
import {
  CARD_KINDS,
  CARD_NOTE_WORDS,
  NOTE_MAX,
  cardBeat,
  cardSceneItem,
  defaultNote,
  type CardKind,
} from "@/lib/cards/words";
import { couplePagePhotos, photoAspect, sceneCouple } from "@/lib/editor/couple-photos";
import {
  cardLanguages,
  draftCopy,
  draftTemplate,
  mainFunction,
  type InviteDraft,
} from "@/lib/editor/draft";
import { pageType } from "@/lib/editor/type";
import { LINE_IN, LINE_STAGGER } from "@/lib/engine/story";
import type { PublicPhoto } from "@/lib/invites/public";
import { draftShowsScene, draftSuite } from "@/lib/publish/story";
import { draftCouple } from "@/lib/publish/frames";
import { SUITES, type Mood } from "@/lib/suites/catalog";
import { voiceFaces } from "@/lib/suites/lettering";
import { scenePage } from "@/lib/suites/scene";
import { CARD_STORY_WORDS } from "@/lib/templates/story-words";
import { drawFrame, videoImages, type Fonts, type Palette } from "@/lib/video/draw";
import { loadFonts, loadImages, paletteReader, readFonts } from "@/lib/video/look";
import { drawSceneFrame, sceneVideoImages } from "@/lib/video/scene-draw";
import { SCENE_FLY, sceneTimeline } from "@/lib/video/scene-timeline";
import { LINES_START, type VideoTimeline } from "@/lib/video/timeline";
import { loadWatermarkLook, withWatermark, type WatermarkLook } from "@/lib/video/watermark";
import "@/components/invitation/type/fonts.css";

type CardMakerProps = {
  inviteId: string;
  draft: InviteDraft;
  /** The invite's photos, for a Scene design's photo frames. */
  photos: PublicPhoto[];
  names: string;
  /**
   * Whether the invite's package includes the cards (Grand, or everyone while payments are
   * off). Without it the host still makes and sees both, with the mark across them, and
   * `upgradeHref` gets the clean ones.
   */
  allowed: boolean;
  upgradeHref: string;
  initial?: CardKind;
};

/** What every drawing needs, loaded once: colours, fonts, paintings and the mark's look. */
type Tools = {
  fonts: Fonts;
  palette: (mood: Mood, tone: "light" | "dark" | null) => Palette;
  images: ReadonlyMap<string, CanvasImageSource>;
  mark: WatermarkLook;
};

const noSubscribe = () => () => {};
const noteKey = (inviteId: string, kind: CardKind) => `shubh-card-note:${inviteId}:${kind}`;

/* Notes kept in this browser; storage can be blocked, and then the note lasts the visit. */
const noteListeners = new Set<() => void>();
const subscribeNotes = (listener: () => void) => {
  noteListeners.add(listener);
  return () => void noteListeners.delete(listener);
};
function keptNote(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function keepNote(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Not kept, but the card still draws
  }
  noteListeners.forEach((listener) => listener());
}

/**
 * Save-the-date and thank-you cards (Step 24): each a still picture, 1080 by 1920, drawn
 * with the invitation video's own painter, so it is the same painting, lettering and
 * colours as the invitation. The host changes the note under the names, then downloads it
 * or shares it straight to WhatsApp from the phone's share sheet.
 */
export function CardMaker(props: CardMakerProps) {
  const { cardsCopy } = useText(cardsText);
  const [kind, setKind] = useState<CardKind>(props.initial ?? "save-the-date");
  const still = useCardStill(props.draft, props.photos);
  const icons = { "save-the-date": CalendarHeart, "thank-you": HeartHandshake };

  return (
    <Card className="gap-5 p-5 sm:p-6">
      <Tabs value={kind} onValueChange={(value) => setKind(value as CardKind)}>
        <TabsList aria-label={cardsCopy.heading} className="w-full sm:w-auto">
          {CARD_KINDS.map((id) => {
            const Icon = icons[id];
            return (
              // Both fit a 320px phone side by side, without their icons
              <TabsTrigger key={id} value={id} className="flex-1 px-3 sm:flex-none sm:px-4">
                <Icon aria-hidden className="max-sm:hidden" />
                {cardsCopy.kinds[id]}
              </TabsTrigger>
            );
          })}
        </TabsList>
        {CARD_KINDS.map((id) => (
          <TabsContent key={id} value={id}>
            <CardPanel {...props} kind={id} still={still} />
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}

function CardPanel({
  inviteId,
  names,
  allowed,
  upgradeHref,
  kind,
  still,
}: CardMakerProps & { kind: CardKind; still: CardStill }) {
  const { cardsCopy } = useText(cardsText);
  const { videoCopy } = useText(publishText);
  const suggested = defaultNote(kind, CARD_NOTE_WORDS[still.language]);
  // The host's own note, kept on this device for when they come back
  const key = noteKey(inviteId, kind);
  const kept = useSyncExternalStore(
    subscribeNotes,
    () => keptNote(key),
    () => null,
  );
  const [typed, setTyped] = useState<string | null>(null);
  const note = (typed ?? kept ?? suggested).slice(0, NOTE_MAX);
  const [state, setState] = useState<"drawing" | "ready" | "failed">("drawing");
  // The picture to download or share, made once the words settle: Safari opens the share
  // sheet only straight from the tap, so it can't wait for the picture then
  const [file, setFile] = useState<File | null>(null);
  const [attempt, setAttempt] = useState(0);
  const canvas = useRef<HTMLCanvasElement>(null);
  const reason = useId();
  const marked = !allowed;
  const canShareFiles = useSyncExternalStore(
    noSubscribe,
    () => typeof navigator !== "undefined" && typeof navigator.canShare === "function",
    () => false,
  );

  const changeNote = (value: string) => {
    setTyped(value);
    keepNote(key, value === suggested ? null : value);
  };

  // Draws the card whenever its words change; the fonts and paintings load the first time
  useEffect(() => {
    let live = true;
    let settle: ReturnType<typeof setTimeout> | undefined;
    const frame = requestAnimationFrame(() => {
      void still
        .tools()
        .then((tools) => {
          const ctx = canvas.current?.getContext("2d");
          if (!live || !ctx) return;
          still.draw(ctx, tools, kind, note, marked ? videoCopy.mark : null);
          setState("ready");
          if (marked) return;
          settle = setTimeout(
            () =>
              ctx.canvas.toBlob((blob) => {
                if (live && blob) {
                  setFile(new File([blob], cardsCopy.fileName(kind), { type: "image/png" }));
                }
              }, "image/png"),
            300,
          );
        })
        .catch(() => live && setState("failed"));
    });
    return () => {
      live = false;
      cancelAnimationFrame(frame);
      clearTimeout(settle);
      setFile(null);
    };
  }, [still, kind, note, marked, videoCopy.mark, cardsCopy, attempt]);

  const download = () => {
    if (!file) return;
    const href = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = href;
    link.download = file.name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(href), 10_000);
  };

  const share = async () => {
    if (!file) return;
    if (!navigator.canShare?.({ files: [file] })) return download();
    try {
      await navigator.share({ files: [file] });
    } catch {
      // Closing the share sheet is not an error
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
      <div className="relative aspect-[9/16] w-full max-w-64 shrink-0 overflow-hidden rounded-lg border border-line bg-night shadow-raised">
        <canvas
          ref={canvas}
          width={1080}
          height={1920}
          role="img"
          aria-label={cardsCopy.picture(cardsCopy.kinds[kind], names)}
          className="size-full"
        />
        {state === "drawing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-night/70 p-4 text-center text-sm text-card-ivory">
            <Spinner />
            <p role="status">{cardsCopy.preparing}</p>
          </div>
        )}
        {marked && state === "ready" && (
          <span className="pointer-events-none absolute start-2 top-2 rounded-full bg-night/65 px-2.5 py-1 font-label text-[0.65rem] tracking-[0.18em] text-card-ivory uppercase">
            {cardsCopy.preview}
          </span>
        )}
      </div>

      <div className="flex w-full min-w-0 flex-col gap-4">
        <p className="text-sm text-ink-muted">{cardsCopy.kindBody[kind]}</p>
        <Field
          label={cardsCopy.noteLabel[kind]}
          hint={cardsCopy.noteHint}
          aside={
            <CharacterCount
              value={note.length}
              max={NOTE_MAX}
              label={cardsCopy.noteCount(note.length, NOTE_MAX)}
            />
          }
        >
          <Textarea
            value={note}
            maxLength={NOTE_MAX}
            rows={2}
            lang={still.language}
            onChange={(event) => changeNote(event.target.value)}
          />
        </Field>
        {note !== suggested && (
          <Button
            variant="ghost"
            size="sm"
            className="self-start"
            leadingIcon={<RotateCcw aria-hidden />}
            onClick={() => changeNote(suggested)}
          >
            {cardsCopy.reset}
          </Button>
        )}

        {state === "failed" ? (
          <div className="flex flex-col gap-3">
            <p role="alert" className="text-sm font-medium text-danger">
              {cardsCopy.failed}
            </p>
            <Button
              variant="secondary"
              className="self-start"
              onClick={() => {
                setState("drawing");
                setAttempt((count) => count + 1);
              }}
            >
              {cardsCopy.retry}
            </Button>
          </div>
        ) : marked ? (
          <div className="flex flex-col gap-3 rounded-md border border-marigold/45 bg-marigold/10 p-4">
            <p id={reason} className="text-sm text-ink-muted">
              {cardsCopy.previewNote}
            </p>
            {/* Download shows from the start, locked, and leads to the package that unlocks it */}
            <Button asChild className="self-start">
              <Link href={upgradeHref} aria-describedby={reason}>
                <Lock aria-hidden />
                {cardsCopy.download}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {canShareFiles && (
              <Button
                disabled={!file}
                leadingIcon={<Share2 aria-hidden />}
                onClick={() => void share()}
              >
                {cardsCopy.share}
              </Button>
            )}
            <Button
              variant={canShareFiles ? "secondary" : "primary"}
              disabled={!file}
              leadingIcon={<Download aria-hidden />}
              onClick={download}
            >
              {cardsCopy.download}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

type CardStill = ReturnType<typeof useCardStill>;

/**
 * What the cards are drawn from: the invitation's words, design and lettering in its first
 * card language. A Scene design draws its painting with the card flown in; every other
 * design draws one of the story's pages, as the video's poster does.
 */
function useCardStill(draft: InviteDraft, photos: PublicPhoto[]) {
  const language = cardLanguages(draft)[0];
  return useMemo(() => {
    const template = draftTemplate(draft);
    const copy = draftCopy(draft, language);
    const suite = draftSuite(draft);
    const type = pageType(draft.type, [language]);
    const story = CARD_STORY_WORDS[language];
    const words = CARD_NOTE_WORDS[language];
    const scenePhotos = couplePagePhotos(
      sceneCouple(draftCouple(draft)),
      photos.map((photo) => photo.id),
      (id) => photos.find((photo) => photo.id === id)?.url,
      copy,
      (id) => photoAspect(photos, id),
    );
    const page = draftShowsScene(draft) ? scenePage(suite, scenePhotos.length) : null;
    const main = mainFunction(draft) ?? "wedding";
    // Both cards' pages, so their paintings load together
    const beats = CARD_KINDS.map((kind) => cardBeat(kind, copy, story, words, ""));
    const ending = { brand: "", open: "", link: "" };
    let loading: Promise<Tools> | null = null;

    const tools = () => {
      loading ??= (async (): Promise<Tools> => {
        const fonts = readFonts();
        const sample = [
          ...beats.flatMap((beat) => beat.lines.map((line) => line.text)),
          ...Object.values(words),
          copy.first,
          copy.second,
          copy.joiner,
          copy.blessing,
          copy.date,
          copy.venue,
        ].join(" ");
        const families = [fonts.display, fonts.sans, fonts.label, type.names, type.words];
        await loadFonts(
          families.filter((family): family is string => Boolean(family)),
          sample,
        );
        await Promise.all(
          voiceFaces(SUITES[suite].voice ?? "regal", language).map((font) =>
            document.fonts.load(font, sample).catch(() => []),
          ),
        );
        const urls = page
          ? sceneVideoImages({ page, photos: scenePhotos, suite })
          : videoImages(timelineOf(beats), suite);
        return {
          fonts,
          palette: paletteReader(suite, template),
          images: await loadImages(urls),
          mark: await loadWatermarkLook(),
        };
      })();
      // A failed load tries again next time
      loading.catch(() => (loading = null));
      return loading;
    };

    const draw = (
      ctx: CanvasRenderingContext2D,
      { fonts, palette, images, mark }: Tools,
      kind: CardKind,
      note: string,
      watermark: string | null,
    ) => {
      const film = {
        total: 1,
        draw: (c: CanvasRenderingContext2D) => {
          c.setTransform(1, 0, 0, 1, 0, 0);
          c.clearRect(0, 0, c.canvas.width, c.canvas.height);
          if (page) {
            const timeline = sceneTimeline(1);
            const first = timeline.shots[0];
            drawSceneFrame(
              c,
              {
                // The card carries the words; the painting keeps the names
                copy: { ...copy, line: "" },
                suite,
                page,
                items: [cardSceneItem(kind, copy, story, words, note, main)],
                photos: scenePhotos,
                timeline,
                lang: language,
                type,
                fonts,
                palette,
                images,
                ending,
              },
              // The card has landed, as the video's poster shows it
              first ? first.start + SCENE_FLY + 0.6 : 2,
            );
            return;
          }
          const beat = cardBeat(kind, copy, story, words, note);
          drawFrame(
            c,
            {
              timeline: timelineOf([beat]),
              copy,
              suite,
              textBox: draft.textBox,
              type,
              lang: language,
              fonts,
              palette,
              images,
              ending,
            },
            // Every line has risen in (the sacred symbol counts as one), before the drift
            LINES_START + (beat.lines.length + 1) * LINE_STAGGER + LINE_IN,
          );
        },
      };
      (watermark ? withWatermark(film, watermark, mark) : film).draw(ctx, 0);
    };

    return { language, tools, draw };
  }, [draft, photos, language]);
}

/** The cards' pages as a timeline that holds each one, so a still lands on it. */
function timelineOf(beats: ReturnType<typeof cardBeat>[]): VideoTimeline {
  let start = 0;
  const entries = beats.map((beat) => {
    const entry = { beat, start, seconds: beat.seconds, stagger: LINE_STAGGER, lineIn: LINE_IN };
    start += beat.seconds;
    return entry;
  });
  return { beats: entries, end: start, total: start };
}
