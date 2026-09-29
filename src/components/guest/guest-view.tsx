"use client";

import { CalendarPlus, MailCheck } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { BrandMark } from "@/components/brand/brand-mark";
import { Invitation, type InvitationStory } from "@/components/invitation/invitation";
import { DiyaCountdown } from "@/components/guest/diya-countdown";
import { Doorway } from "@/components/guest/doorway";
import { RsvpForm, type RsvpFunction } from "@/components/guest/rsvp-form";
import { FunctionFacts } from "@/components/guest/function-facts";
import { ThemedDetails } from "@/components/guest/themed/themed-details";
import { WatermarkLayer } from "@/components/guest/watermark";
import { useRagaMusic } from "@/components/invitation/use-raga-music";
import { Button } from "@/components/ui/button";
import { ThemeMenu } from "@/components/ui/theme-toggle";
import type { QualityChoice } from "@/content/engine-review";
import { CardLanguageToggle } from "@/components/invitation/card-language-toggle";
import {
  cardLanguages,
  draftCopy,
  draftTradition,
  mainFunction,
  templateWithRaga,
  type CardLanguage,
  type InviteDraft,
} from "@/lib/editor/draft";
import type { RsvpQuestionId } from "@/lib/categories/schema";
import type { FunctionId } from "@/lib/events/functions";
import { pageType } from "@/lib/editor/type";
import { storyBeats } from "@/lib/engine/story";
import "@/components/invitation/type/fonts.css";
import { applyPages } from "@/lib/editor/pages";
import { cardFunctions, draftBlessing, draftSuite, storyFamily } from "@/lib/publish/story";
import { CARD_COUNTDOWN_WORDS, CARD_STORY_WORDS, daysAway } from "@/lib/templates/story-words";
import { daysBetween, startsAt, todayInIndia } from "@/lib/publish/countdown";
import { SUITES } from "@/lib/suites/catalog";
import { guestLook } from "@/lib/suites/guest-look";
import { couplePagePhotos } from "@/lib/editor/couple-photos";
import type { PublicPhoto } from "@/lib/invites/public";
import { useLocale, useText } from "@/i18n/client";
import { publishText } from "@/i18n/copy/publish";
import { uiText } from "@/i18n/copy/ui";

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
  mapsUrl: string | null;
  googleCalendarUrl: string | null;
  icsUrl: string | null;
};

type GuestViewProps = {
  slug: string;
  draft: InviteDraft;
  quality: QualityChoice;
  names: string;
  occasion: string;
  functions: GuestFunction[];
  photos: PublicPhoto[];
  allIcsUrl: string | null;
  rsvpFunctions: RsvpFunction[];
  questions: RsvpQuestionId[];
  /** A Free invite once payments are on: "Made with Shubh" across the pages (Step 17). */
  watermark?: boolean;
};

export function GuestView({
  slug,
  draft,
  quality,
  names,
  occasion,
  functions,
  photos,
  allIcsUrl,
  rsvpFunctions,
  questions,
  watermark = false,
}: GuestViewProps) {
  const { guestCopy, rsvpCopy } = useText(publishText);
  const { uiStrings } = useText(uiText);
  const locale = useLocale();
  const languages = cardLanguages(draft);
  // A two-language card opens in the guest's own language when it has it
  const [language, setLanguage] = useState<CardLanguage>(
    () => languages.find((code) => code === locale) ?? languages[0],
  );
  const copy = useMemo(() => draftCopy(draft, language), [draft, language]);
  const template = useMemo(
    () => templateWithRaga(draft.templateId, draft.music.raga),
    [draft.templateId, draft.music.raga],
  );
  const [open, setOpen] = useState(false);
  const replies = rsvpFunctions.length > 0;
  // Today in India, for "In 5 days" on each event page; only known in the browser
  const today = useSyncExternalStore(noSubscribe, todayInIndia, () => null);
  const story = useMemo<InvitationStory>(
    () => ({
      beats: applyPages(
        storyBeats({
          copy,
          // The pages speak the card's language, not the site's
          functions: cardFunctions(functions, draft, language).map((fn) => ({
            ...fn,
            countdown: today
              ? daysAway(
                  daysBetween(today, draft.functions[fn.kind].date),
                  CARD_COUNTDOWN_WORDS[language],
                )
              : undefined,
          })),
          replies,
          words: CARD_STORY_WORDS[language],
          family: storyFamily(draft, language),
          couple: couplePagePhotos(
            draft.couplePhotos,
            photos.map((photo) => photo.id),
            (id) => photos.find((photo) => photo.id === id)?.url,
            copy,
          ),
          blessing: draftBlessing(draft),
        }),
        draft.pages,
        language,
      ),
      suite: draftSuite(draft),
      textBox: draft.textBox,
      type: pageType(draft.type, [language]),
      reply: replies ? { href: "#rsvp", label: guestCopy.reply } : null,
    }),
    [copy, functions, replies, language, guestCopy.reply, draft, today, photos],
  );
  // A painted theme opens as a doorway with a countdown; the card colours keep the 3D card
  const suite = draftSuite(draft);
  const doorway = SUITES[suite].art !== "card" && Boolean(SUITES[suite].images.cover);
  const mainKind = mainFunction(draft);
  const mainDate = mainKind ? draft.functions[mainKind].date : "";
  const mainAt = mainKind ? startsAt(mainDate, draft.functions[mainKind].time) : null;
  const main = mainAt === null ? null : { date: mainDate, at: mainAt };
  const music = useRagaMusic(template);
  // A theme with a guest look carries on below the pages; others keep the plain details
  const look = doorway ? guestLook(suite) : null;
  // The family's blocks in the language the guest is reading
  const family = storyFamily(draft, language);
  const rsvp =
    rsvpFunctions.length > 0 ? (
      <RsvpForm slug={slug} functions={rsvpFunctions} questions={questions} />
    ) : null;
  const dates = useMemo(
    () =>
      Object.values(draft.functions)
        .filter((f) => f.included)
        .map((f) => f.date),
    [draft.functions],
  );

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="absolute end-3 top-[max(0.75rem,env(safe-area-inset-top))] z-30">
        <ThemeMenu labels={uiStrings.theme} />
      </div>

      {watermark && <WatermarkLayer />}
      <main id="main" className="flex flex-1 flex-col">
        {doorway ? (
          <Doorway
            suite={suite}
            template={template}
            copy={copy}
            lang={language}
            languages={languages}
            onLanguage={setLanguage}
            beats={story.beats}
            textBox={draft.textBox}
            type={story.type!}
            main={main}
            reply={story.reply ?? null}
            music={music}
            musicOnOpen={draft.music.playOnOpen}
          />
        ) : (
          <>
            {/* The card, first and large, in a warm pool of light */}
            <section
              aria-labelledby="guest-names"
              className="relative isolate flex flex-col items-center gap-4 overflow-hidden px-4 pt-[max(3.5rem,calc(env(safe-area-inset-top)+3rem))] pb-10 sm:px-6"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute top-[45%] left-1/2 -z-10 aspect-square w-[min(140%,64rem)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(closest-side, color-mix(in srgb, var(--marigold) 26%, transparent), color-mix(in srgb, var(--rose) 8%, transparent) 60%, transparent)",
                }}
              />
              <p className="font-label text-xs tracking-[0.32em] text-accent-text uppercase">
                {guestCopy.invited}
              </p>
              <h1
                id="guest-names"
                className="max-w-3xl text-center font-display text-[2.1rem] leading-[1.08] break-words sm:text-[3rem]"
              >
                {names}
              </h1>
              <p className="text-ink-muted">{occasion}</p>
              <DiyaCountdown dates={dates} labels={guestCopy.countdown} />
              {languages.length > 1 && (
                <CardLanguageToggle
                  label={guestCopy.cardLanguage}
                  languages={languages}
                  value={language}
                  onValueChange={setLanguage}
                />
              )}
              <div className="flex h-[min(72svh,44rem)] min-h-[26rem] w-full max-w-4xl flex-col">
                <Invitation
                  copy={copy}
                  lang={language}
                  template={template}
                  quality={quality}
                  open={open}
                  onOpenChange={setOpen}
                  musicOnOpen={draft.music.playOnOpen}
                  tradition={draftTradition(draft)?.id ?? null}
                  story={story}
                />
              </div>
              <div className="flex flex-col items-center gap-3">
                {!open && <p className="text-sm text-ink-muted">{guestCopy.openHint}</p>}
                {rsvpFunctions.length > 0 && (
                  <Button asChild size="lg">
                    <a href="#rsvp">
                      <MailCheck aria-hidden />
                      {guestCopy.reply}
                    </a>
                  </Button>
                )}
              </div>
            </section>
          </>
        )}

        {look ? (
          <ThemedDetails
            suite={suite}
            look={look}
            copy={copy}
            lang={language}
            functions={cardFunctions(functions, draft, language)}
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
                  {functions.map((fn) => (
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
  const { guestCopy } = useText(publishText);
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
