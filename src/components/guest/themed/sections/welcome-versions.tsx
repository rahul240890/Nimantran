"use client";

import { useGuestText } from "@/components/guest/guest-language";
import { GALLERY_ASPECT, type GuestPhoto } from "@/components/guest/guest-photo";
import { FramedPhoto } from "@/components/invitation/story/framed-photo";
import { cn } from "@/lib/cn";
import type { GuestLook } from "@/lib/suites/guest-look";
import type { CardLanguage } from "@/lib/templates/card-languages";
import type { CardCopy } from "@/lib/templates/content";
import { CARD_THEMED_WORDS } from "@/lib/templates/themed-words";
import { Bloom, Garland, PetalDrift } from "../flowers";
import { Framed, Ground, Reveal } from "./parts";

/*
 * The welcome as each experience family meets its guests (recipe.ts, SECTION_VERSIONS):
 * a magazine's masthead (editorial), a love letter (floral) and the names under a palace's
 * great arch (royal). The garland welcome every theme had before is in welcome.tsx.
 */

type WelcomeProps = {
  copy: CardCopy;
  lang: CardLanguage;
  look: GuestLook;
  /** The couple together, or one each, by the names in the card's order. */
  photos: readonly GuestPhoto[];
};

/** The word between the names, or none when there is one name. */
function joinerOf(copy: CardCopy): string {
  if (!copy.second.trim()) return "";
  return !copy.joiner || copy.joiner === "&" ? "&" : copy.joiner;
}

/** The couple's photos, each in the theme's frame, at the width the version gives. */
function Photos({
  photos,
  look,
  copy,
  lang,
  width,
  captions = false,
  className,
}: {
  photos: readonly GuestPhoto[];
  look: GuestLook;
  copy: CardCopy;
  lang: CardLanguage;
  /** Each frame's width, as a CSS length. */
  width: string;
  /** Each photo's name under it, when there is one each. */
  captions?: boolean;
  className?: string;
}) {
  const { guestCopy } = useGuestText();
  if (photos.length === 0) return null;
  const shown = photos.slice(0, 2);
  return (
    <div className={cn("flex items-start justify-center gap-5 sm:gap-8", className)}>
      {shown.map((photo, index) => {
        const name = index === 0 ? copy.first : copy.second;
        return (
          <figure
            key={photo.id}
            style={{ width }}
            className={cn(
              "flex min-w-0 flex-col items-center gap-3",
              shown.length > 1 && index === 1 && "mt-10 sm:mt-14",
            )}
          >
            <Framed look={look} className="w-full">
              <FramedPhoto
                photo={{ src: photo.url, alt: "", fit: photo.fit }}
                alt={guestCopy.photoAlt(index + 1)}
                frameAspect={GALLERY_ASPECT}
                className="size-full"
              />
            </Framed>
            {captions && shown.length > 1 && name.trim() && (
              <figcaption
                lang={lang}
                className="max-w-full text-center font-display text-lg leading-tight break-words text-ink"
              >
                {name}
              </figcaption>
            )}
          </figure>
        );
      })}
    </div>
  );
}

/**
 * Editorial: a magazine's masthead. A rule above and below the issue line (who invites and
 * the date), the names set as large as the screen allows, and the welcome beside a plain
 * print of the couple. No garland and nothing drifting: the type is the ornament.
 */
export function WelcomeMasthead({ copy, lang, look, photos }: WelcomeProps) {
  const cardWords = CARD_THEMED_WORDS[lang];
  const joiner = joinerOf(copy);
  const welcome = [copy.families, copy.line].filter((text) => text.trim());
  return (
    <section
      aria-labelledby="guest-welcome"
      data-mood="day"
      data-tour="8"
      data-welcome="masthead"
      className="guest-sky guest-sky-flat relative isolate flex min-h-svh flex-col justify-center px-4 py-16 sm:px-6 sm:py-20"
    >
      <Reveal className="guest-stagger mx-auto flex w-full max-w-5xl flex-col gap-8 sm:gap-10">
        <p
          lang={lang}
          className="guest-ed-issue flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-3 font-label text-xs tracking-[0.3em] text-accent-text uppercase"
        >
          <span>{cardWords.invitedTo}</span>
          {copy.date && <span className="tabular-nums">{copy.date}</span>}
        </p>
        <h2
          id="guest-welcome"
          lang={lang}
          className="font-display text-[clamp(3rem,14vw,8.5rem)] leading-[0.95] break-words text-ink"
        >
          <span className="block">{copy.first}</span>
          {joiner && (
            <>
              <span className="my-2 block text-[0.3em] leading-tight text-accent-text">
                {joiner}
              </span>
              <span className="block sm:text-end">{copy.second}</span>
            </>
          )}
        </h2>
        <div className="grid items-end gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-14">
          <div
            lang={lang}
            className="guest-ed-lead flex max-w-md flex-col gap-3 ps-5 text-lg text-ink-muted"
          >
            {welcome.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          <Photos
            photos={photos}
            look={look}
            copy={copy}
            lang={lang}
            width={photos.length > 1 ? "min(40vw,13rem)" : "min(72vw,20rem,calc(42svh*0.8))"}
            captions
            className="md:justify-end"
          />
        </div>
      </Reveal>
    </section>
  );
}

/**
 * Floral: a love letter on the theme's paper, a sprig of the theme's flowers pressed in
 * its corner, the names written as its heading and the date as its signature. Petals
 * drift past, and the couple's photo rests against the letter.
 */
export function WelcomeLetter({ copy, lang, look, photos }: WelcomeProps) {
  const cardWords = CARD_THEMED_WORDS[lang];
  const joiner = joinerOf(copy);
  const welcome = [copy.families, copy.line].filter((text) => text.trim());
  return (
    <section
      aria-labelledby="guest-welcome"
      data-mood="dawn"
      data-tour="8"
      data-welcome="letter"
      className="guest-sky relative isolate flex min-h-svh flex-col justify-center px-4 py-16 sm:px-6 sm:py-20"
    >
      <PetalDrift flowers={[look.flower, look.secondFlower]} />
      <div className="mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-6">
        <Reveal className="guest-letter-wrap relative mx-auto w-full max-w-xl">
          <div className="guest-card guest-letter relative flex flex-col items-center gap-4 px-6 pt-14 pb-10 text-center sm:px-12 sm:pt-16 sm:pb-12">
            {/* A sprig pressed into the corner */}
            <svg
              aria-hidden
              viewBox="0 0 120 120"
              className="guest-sprig pointer-events-none absolute -start-8 -top-12 size-36 sm:-start-12 sm:-top-16 sm:size-44"
            >
              <path d="M12 108C40 84 62 58 98 18" className="guest-sprig-stem" />
              <path d="M44 74c-12-2-20 4-24 12 10 2 19-2 24-12z" className="guest-sprig-leaf" />
              <path d="M66 50c-2-12 4-20 12-24 2 10-2 19-12 24z" className="guest-sprig-leaf" />
              <Bloom kind={look.flower} x={98} y={18} size={34} />
              <Bloom kind={look.secondFlower} x={72} y={44} size={22} turn={30} />
              <Bloom kind={look.flower} x={46} y={72} size={18} turn={-20} />
            </svg>
            <p
              lang={lang}
              className="font-label text-xs tracking-[0.3em] text-accent-text uppercase"
            >
              {cardWords.invitedTo}
            </p>
            <h2
              id="guest-welcome"
              lang={lang}
              className="font-display text-[2.6rem] leading-[1.05] break-words text-ink italic sm:text-[3.6rem]"
            >
              {copy.first}
              {joiner && (
                <>
                  <span className="block text-[0.45em] leading-snug text-accent-text not-italic">
                    {joiner}
                  </span>
                  {copy.second}
                </>
              )}
            </h2>
            <span aria-hidden className="guest-rule" />
            <div lang={lang} className="flex max-w-md flex-col gap-2 text-lg text-ink-muted">
              {welcome.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
            {copy.date && (
              <p
                lang={lang}
                className="mt-2 self-end font-display text-xl text-accent-text italic sm:me-2"
              >
                {copy.date}
              </p>
            )}
          </div>
        </Reveal>
        <Reveal>
          <Photos
            photos={photos}
            look={look}
            copy={copy}
            lang={lang}
            width={photos.length > 1 ? "min(38vw,13rem)" : "min(62vw,19rem,calc(40svh*0.8))"}
            captions
            className="guest-letter-photos"
          />
        </Reveal>
      </div>
      <Ground look={look} className="absolute inset-x-0 bottom-0 -z-10 h-20 w-full sm:h-28" />
    </section>
  );
}

/**
 * Royal: the names under the palace's great arch. A toran hangs across the top, the arch
 * stands in the middle in the theme's cloth with a double gilt edge, and the couple's
 * photos stand in their own arches: one each at the arch's sides on a wide screen (side by
 * side above it on a phone), or one together above it. The skyline is at its foot.
 */
export function WelcomeDarbar({ copy, lang, look, photos }: WelcomeProps) {
  const { guestCopy } = useGuestText();
  const cardWords = CARD_THEMED_WORDS[lang];
  const joiner = joinerOf(copy);
  const welcome = [copy.families, copy.line].filter((text) => text.trim());
  const shown = photos.slice(0, 2);
  const pair = shown.length > 1;
  return (
    <section
      aria-labelledby="guest-welcome"
      data-mood="dawn"
      data-tour="8"
      data-welcome="darbar"
      className="guest-sky relative isolate flex min-h-svh flex-col pb-28 sm:pb-36"
    >
      <Garland
        flower={look.flower}
        second={look.secondFlower}
        className="guest-garland relative z-10 h-24 w-full sm:h-32 lg:h-40"
      />
      <Ground look={look} className="absolute inset-x-0 bottom-0 -z-10 h-24 w-full sm:h-32" />
      <div
        data-photos={shown.length}
        className="guest-darbar-court mx-auto my-auto grid w-full max-w-6xl items-end justify-items-center gap-x-5 gap-y-8 px-4 pt-4 sm:gap-x-8 sm:px-6"
      >
        {shown.map((photo, index) => {
          const name = index === 0 ? copy.first : copy.second;
          return (
            <Reveal
              key={photo.id}
              className="guest-darbar-photo w-[min(38vw,14rem,calc(30svh*0.8))]"
            >
              <figure className="flex flex-col items-center gap-3">
                <Framed look={look} className="w-full">
                  <FramedPhoto
                    photo={{ src: photo.url, alt: "", fit: photo.fit }}
                    alt={guestCopy.photoAlt(index + 1)}
                    frameAspect={GALLERY_ASPECT}
                    className="size-full"
                  />
                </Framed>
                {pair && name.trim() && (
                  <figcaption
                    lang={lang}
                    className="max-w-full text-center font-display text-lg leading-tight break-words text-ink"
                  >
                    {name}
                  </figcaption>
                )}
              </figure>
            </Reveal>
          );
        })}
        <Reveal className="guest-darbar-arch w-full max-w-[34rem]">
          <div className="guest-card guest-darbar flex flex-col items-center gap-4 px-6 pt-20 pb-10 text-center sm:px-12 sm:pt-28 sm:pb-12">
            <p
              lang={lang}
              className="font-label text-xs tracking-[0.3em] text-accent-text uppercase"
            >
              {cardWords.invitedTo}
            </p>
            <h2
              id="guest-welcome"
              lang={lang}
              className="font-display text-[2.6rem] leading-[1.02] break-words text-ink sm:text-[3.75rem]"
            >
              {copy.first}
              {joiner && (
                <>
                  <span className="block text-[0.45em] leading-snug text-accent-text">
                    {joiner}
                  </span>
                  {copy.second}
                </>
              )}
            </h2>
            <span aria-hidden className="guest-rule" />
            <div lang={lang} className="flex max-w-sm flex-col gap-2 text-lg text-ink-muted">
              {welcome.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
            {copy.date && (
              <p lang={lang} className="guest-date-chip font-display text-xl text-ink">
                {copy.date}
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
