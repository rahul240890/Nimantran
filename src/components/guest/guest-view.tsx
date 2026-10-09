"use client";

import { CalendarPlus, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { BrandMark } from "@/components/brand/brand-mark";
import type { InvitationStory } from "@/components/invitation/invitation";
import { EventDayBanner } from "@/components/guest/event-day-banner";
import { Opening } from "@/components/guest/opening/opening";
import { useGuestName } from "@/components/guest/guest-reply";
import { RsvpForm, type RsvpFunction } from "@/components/guest/rsvp-form";
import { FunctionFacts } from "@/components/guest/function-facts";
import { PhotoWall } from "@/components/guest/photo-wall";
import { ThemedDetails } from "@/components/guest/themed/themed-details";
import { WatermarkLayer } from "@/components/guest/watermark";
import { useRagaMusic } from "@/components/invitation/use-raga-music";
import { OneScene, SceneButton } from "@/components/invitation/scene/one-scene";
import { Button } from "@/components/ui/button";
import { ThemeMenu } from "@/components/ui/theme-toggle";
import { CardLanguageToggle } from "@/components/invitation/card-language-toggle";
import {
  cardLanguages,
  draftCopy,
  draftTemplate,
  mainFunction,
  type CardLanguage,
  type InviteDraft,
} from "@/lib/editor/draft";
import type { RsvpQuestionId } from "@/lib/categories/schema";
import type { FunctionId } from "@/lib/events/functions";
import { pageType } from "@/lib/editor/type";
import { storyBeats } from "@/lib/engine/story";
import "@/components/invitation/type/fonts.css";
import { applyPages } from "@/lib/editor/pages";
import {
  cardFunctions,
  draftBlessing,
  draftShowsScene,
  draftSuite,
  storyFamily,
} from "@/lib/publish/story";
import {
  CARD_COUNTDOWN_WORDS,
  CARD_GREETING_WORDS,
  CARD_STORY_WORDS,
  daysAway,
} from "@/lib/templates/story-words";
import { draftCouple } from "@/lib/publish/frames";
import { daysBetween, startsAt, todayInIndia } from "@/lib/publish/countdown";
import type { EventWindow } from "@/lib/publish/event-day";
import { SUITES } from "@/lib/suites/catalog";
import { guestLook } from "@/lib/suites/guest-look";
import { couplePagePhotos, photoAspect, sceneCouple } from "@/lib/editor/couple-photos";
import { scenePage } from "@/lib/suites/scene";
import { openingGod, openingStyle } from "@/lib/opening/catalog";
import { withClip } from "@/lib/editor/music-clip";
import type { PublicPhoto } from "@/lib/invites/public";
import { useLocale } from "@/i18n/client";
import { guestText } from "@/i18n/copy/guest";
import { GuestLanguage, useGuestText } from "@/components/guest/guest-language";

const noSubscribe = () => () => {};

export type GuestFunction = {
  kind: FunctionId;
  name: string;
  /** The ceremony's name in the family's tradition, in its own script. */
  localName: { text: string; lang: string } | null;
  date: string;
  /** "7:30 PM", or "9:47 AM to 10:31 AM" when it has an end. */
  time: string;
  /** The tradition's name for the wedding's auspicious time, shown with its window. */
  muhurat: { text: string; lang: string } | null;
  venue: string;
  address: string;
  dressCode: string;
  /** Where to park, from the host (the event-day guide). */
  parking: string;
  /** One tap to directions, to the host's pin when there is one. */
  mapsUrl: string | null;
  /** A small map of the venue, loaded only when the guest asks for it. */
  mapEmbedUrl: string | null;
  /** When it is on, in India time, for the "happening now" banner. */
  window: EventWindow | null;
  googleCalendarUrl: string | null;
  icsUrl: string | null;
};

type GuestViewProps = {
  slug: string;
  draft: InviteDraft;
  functions: GuestFunction[];
  photos: PublicPhoto[];
  /** The host's own music clip, played instead of the raga. */
  clipUrl?: string | null;
  allIcsUrl: string | null;
  rsvpFunctions: RsvpFunction[];
  questions: RsvpQuestionId[];
  /** A Free invite once payments are on: "Made with Shubh" across the pages (Step 17). */
  watermark?: boolean;
  /** A fixed moment for the event-day banner, on review pages. */
  previewNow?: number;
};

export function GuestView({
  slug,
  draft,
  functions,
  photos,
  clipUrl = null,
  allIcsUrl,
  rsvpFunctions,
  questions,
  watermark = false,
  previewNow,
}: GuestViewProps) {
  const locale = useLocale();
  const languages = cardLanguages(draft);
  // A two-language card opens in the guest's own language when it has it
  const [language, setLanguage] = useState<CardLanguage>(
    () => languages.find((code) => code === locale) ?? languages[0],
  );
  // Everything around the card speaks the card's language too, and switches with it
  const { guestCopy, rsvpCopy, invitation, theme } = guestText[language];
  const copy = useMemo(() => draftCopy(draft, language), [draft, language]);
  const designed = draftTemplate(draft);
  const template = useMemo(() => withClip(designed, clipUrl), [designed, clipUrl]);
  // A guest who came by their own link is greeted by name before the invitation opens
  const guestName = useGuestName(slug);
  const replies = rsvpFunctions.length > 0;
  // Today in India, for "In 5 days" on each event page; only known in the browser
  const today = useSyncExternalStore(noSubscribe, todayInIndia, () => null);
  // The pages and the details below them, named and dated as the card names and dates them
  const details = useMemo(
    () => cardFunctions(functions, draft, language),
    [functions, draft, language],
  );
  const told = useMemo(
    () =>
      details.map((fn) => ({
        ...fn,
        countdown: today
          ? daysAway(
              daysBetween(today, draft.functions[fn.kind].date),
              CARD_COUNTDOWN_WORDS[language],
            )
          : undefined,
      })),
    [details, draft, language, today],
  );
  const replyFunctions = useMemo(
    () =>
      rsvpFunctions.map((fn) => ({
        ...fn,
        name: details.find((item) => item.kind === fn.kind)?.name ?? fn.name,
      })),
    [rsvpFunctions, details],
  );
  const story = useMemo<InvitationStory>(
    () => ({
      beats: applyPages(
        storyBeats({
          copy,
          functions: told,
          replies,
          words: CARD_STORY_WORDS[language],
          family: storyFamily(draft, language),
          couple: couplePagePhotos(
            draftCouple(draft),
            photos.map((photo) => photo.id),
            (id) => photos.find((photo) => photo.id === id)?.url,
            copy,
            (id) => photoAspect(photos, id),
          ),
          blessing: draftBlessing(draft),
        }),
        draft.pages,
        language,
        draft.pageSeconds,
      ),
      suite: draftSuite(draft),
      textBox: draft.textBox,
      type: pageType(draft.type, [language]),
      reply: replies ? { href: "#rsvp", label: guestCopy.reply } : null,
    }),
    [copy, told, replies, language, guestCopy.reply, draft, photos],
  );
  // A painted theme (not the colour card) carries on in its own look below the opening
  const suite = draftSuite(draft);
  const doorway = SUITES[suite].art !== "card" && Boolean(SUITES[suite].images.cover);
  const mainKind = mainFunction(draft);
  const mainDate = mainKind ? draft.functions[mainKind].date : "";
  const mainAt = mainKind ? startsAt(mainDate, draft.functions[mainKind].time) : null;
  const main = mainAt === null ? null : { date: mainDate, at: mainAt };
  const music = useRagaMusic(template);
  // One Scene (pilot): the whole invitation on one painting, in place of the doorway and pages
  const scenePhotos = useMemo(
    () =>
      couplePagePhotos(
        sceneCouple(draftCouple(draft)),
        photos.map((photo) => photo.id),
        (id) => photos.find((photo) => photo.id === id)?.url,
        copy,
        (id) => photoAspect(photos, id),
      ),
    [draft, photos, copy],
  );
  const scene = draftShowsScene(draft) ? scenePage(suite, scenePhotos.length) : null;
  // Every invitation opens full height in the host's chosen style (Step 12x); a Scene can skip it
  const opening = openingStyle(draft.opening, suite, Boolean(scene), draft.categoryId);
  const god = openingGod(draft.opening, draft.categoryId);
  const [entered, setEntered] = useState(false);
  const showOpening = !entered && opening !== "none";
  // A theme with a guest look carries on below the pages; others keep the plain details
  const look = doorway ? guestLook(suite) : null;
  // The family's blocks in the language the guest is reading
  const family = storyFamily(draft, language);
  const rsvp =
    rsvpFunctions.length > 0 ? (
      <RsvpForm slug={slug} functions={replyFunctions} questions={questions} />
    ) : null;

  return (
    <GuestLanguage language={language}>
      <div lang={language} className="flex min-h-dvh flex-col">
        <EventDayBanner functions={details} previewNow={previewNow} />
        <div className="relative flex flex-1 flex-col">
          <div className="absolute end-3 top-[max(0.75rem,env(safe-area-inset-top))] z-30">
            <ThemeMenu labels={theme} />
          </div>

          {watermark && <WatermarkLayer />}
          <main id="main" className="flex flex-1 flex-col">
            {scene && !showOpening ? (
              <OneScene
                suite={suite}
                page={scene}
                copy={copy}
                lang={language}
                functions={told}
                photos={scenePhotos}
                reply={story.reply ?? null}
                type={story.type}
                detailsHref={doorway && guestLook(suite) ? "#guest-welcome" : undefined}
                header={
                  (guestName || languages.length > 1) && (
                    <>
                      {guestName && (
                        <p
                          lang={language}
                          className="rounded-full bg-card-ivory/85 px-4 py-1 text-center text-sm text-card-ink shadow-raised backdrop-blur"
                        >
                          {CARD_GREETING_WORDS[language].dear}{" "}
                          <span className="font-semibold">{guestName}</span>
                        </p>
                      )}
                      {languages.length > 1 && (
                        <CardLanguageToggle
                          label={guestCopy.cardLanguage}
                          languages={languages}
                          value={language}
                          onValueChange={setLanguage}
                        />
                      )}
                    </>
                  )
                }
                extra={
                  <SceneButton
                    label={music.playing ? invitation.pauseMusic : invitation.playMusic}
                    pressed={music.playing}
                    onClick={music.toggle}
                  >
                    {music.playing ? <Volume2 aria-hidden /> : <VolumeX aria-hidden />}
                  </SceneButton>
                }
              />
            ) : (
              <Opening
                suite={suite}
                style={opening}
                god={god}
                copy={copy}
                lang={language}
                languages={languages}
                onLanguage={setLanguage}
                type={story.type!}
                main={main}
                reply={story.reply ?? null}
                music={music}
                musicOnOpen={draft.music.playOnOpen}
                guest={guestName}
                after={
                  scene
                    ? { kind: "enter", onEnter: () => setEntered(true) }
                    : { kind: "pages", template, beats: story.beats, textBox: draft.textBox }
                }
              />
            )}

            {look ? (
              <ThemedDetails
                suite={suite}
                look={look}
                copy={copy}
                lang={language}
                functions={details}
                main={
                  mainKind && mainDate
                    ? { date: mainDate, venue: draft.functions[mainKind].venue.trim() }
                    : null
                }
                photos={photos}
                family={family}
                familyLang={language}
                allIcsUrl={allIcsUrl}
                music={music}
                reply={rsvp}
              />
            ) : (
              <>
                <FamilyWording family={family} lang={language} />

                <section
                  aria-labelledby="guest-functions"
                  className="border-t border-line bg-surface-2/50 px-4 py-12 sm:px-6 sm:py-16"
                >
                  <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                      <h2
                        id="guest-functions"
                        className="font-display text-[1.75rem] leading-tight sm:text-[2.2rem]"
                      >
                        {guestCopy.functions}
                      </h2>
                      {allIcsUrl && (
                        <Button asChild variant="secondary">
                          <a href={allIcsUrl} download>
                            <CalendarPlus aria-hidden />
                            {guestCopy.addAll}
                          </a>
                        </Button>
                      )}
                    </div>
                    <ol className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
                      {details.map((fn) => (
                        <li key={fn.kind}>
                          <FunctionCard fn={fn} />
                        </li>
                      ))}
                    </ol>
                  </div>
                </section>

                {photos.length > 0 && (
                  <section aria-labelledby="guest-photos" className="px-4 py-12 sm:px-6 sm:py-16">
                    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
                      <h2
                        id="guest-photos"
                        className="font-display text-[1.75rem] leading-tight sm:text-[2.2rem]"
                      >
                        {guestCopy.photos}
                      </h2>
                      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                        {photos.map((photo, index) => (
                          <li
                            key={photo.id}
                            className="overflow-hidden rounded-lg border border-line bg-surface-2 shadow-raised"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element -- short-lived signed links */}
                            <img
                              src={photo.url}
                              alt={guestCopy.photoAlt(index + 1)}
                              width={photo.width}
                              height={photo.height}
                              loading="lazy"
                              decoding="async"
                              className="aspect-[4/5] h-full w-full object-cover"
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </section>
                )}
                {rsvpFunctions.length > 0 && (
                  <section
                    id="rsvp"
                    aria-labelledby="guest-rsvp"
                    className="scroll-mt-4 border-t border-line px-4 py-12 sm:px-6 sm:py-16"
                  >
                    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
                      <div className="flex flex-col gap-2">
                        <h2
                          id="guest-rsvp"
                          className="font-display text-[1.75rem] leading-tight sm:text-[2.2rem]"
                        >
                          {rsvpCopy.heading}
                        </h2>
                        <p className="text-ink-muted">{rsvpCopy.intro}</p>
                      </div>
                      {rsvp}
                    </div>
                  </section>
                )}
              </>
            )}
            <PhotoWall slug={slug} />
          </main>

          <footer className="border-t border-line px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6">
            <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-start">
              <p className="flex items-center gap-2 text-sm text-ink-muted">
                <BrandMark className="size-6 text-accent-text" />
                {guestCopy.madeWith}
              </p>
              <Button asChild variant="ghost" size="sm">
                <Link href="/">{guestCopy.createYours}</Link>
              </Button>
            </div>
          </footer>
        </div>
      </div>
    </GuestLanguage>
  );
}

/** The family's labelled wording (blessings, parents, hosts, whom to call), when written. */
function FamilyWording({
  family,
  lang,
}: {
  family: readonly { id: string; title: string; text: string }[];
  lang: string;
}) {
  const { guestCopy } = useGuestText();
  if (family.length === 0) return null;
  return (
    <section aria-labelledby="guest-family" className="px-4 pb-12 sm:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 rounded-xl border border-line bg-surface px-5 py-8 text-center shadow-raised sm:px-10">
        <h2 id="guest-family" className="font-display text-2xl leading-tight">
          {guestCopy.family}
        </h2>
        <dl lang={lang} className="grid w-full gap-5 sm:grid-cols-2">
          {family.map((block) => (
            <div key={block.id} className="flex flex-col gap-1">
              <dt className="text-sm text-accent-text">{block.title}</dt>
              <dd className="text-lg break-words">{block.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function FunctionCard({ fn }: { fn: GuestFunction }) {
  const headingId = `fn-${fn.kind}`;
  return (
    <article
      aria-labelledby={headingId}
      className="flex h-full flex-col gap-4 rounded-lg border border-line bg-surface p-5 shadow-raised sm:p-6"
    >
      <h3 id={headingId} className="flex flex-col font-display text-2xl leading-tight">
        {fn.name}
        {fn.localName && (
          <span lang={fn.localName.lang} className="font-sans text-lg text-accent-text">
            {fn.localName.text}
          </span>
        )}
      </h3>
      <FunctionFacts fn={fn} />
    </article>
  );
}
