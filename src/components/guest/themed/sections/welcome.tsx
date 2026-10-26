"use client";

import { useGuestText } from "@/components/guest/guest-language";
import { GALLERY_ASPECT, type GuestPhoto } from "@/components/guest/guest-photo";
import { FramedPhoto } from "@/components/invitation/story/framed-photo";
import { cn } from "@/lib/cn";
import type { GuestLook } from "@/lib/suites/guest-look";
import type { CardLanguage } from "@/lib/templates/card-languages";
import type { CardCopy } from "@/lib/templates/content";
import { CARD_THEMED_WORDS } from "@/lib/templates/themed-words";
import { Garland, PetalDrift } from "../flowers";
import { Balloons, Palm } from "../scenery";
import { Framed, Ground, Reveal } from "./parts";

export function Welcome({
  copy,
  lang,
  look,
  photos,
}: {
  copy: CardCopy;
  lang: CardLanguage;
  look: GuestLook;
  /** The couple together, or one each, by the names in the card's order. */
  photos: readonly GuestPhoto[];
}) {
  const { guestCopy } = useGuestText();
  const cardWords = CARD_THEMED_WORDS[lang];
  const joiner = !copy.second.trim() ? "" : !copy.joiner || copy.joiner === "&" ? "&" : copy.joiner;
  const welcome = [copy.families, copy.line].filter((text) => text.trim());
  const garden = look.style === "garden";

  return (
    <section
      aria-labelledby="guest-welcome"
      data-mood="dawn"
      data-tour="8"
      className="guest-sky relative isolate flex min-h-svh flex-col pb-28 sm:pb-36"
    >
      <Garland
        flower={look.flower}
        second={look.secondFlower}
        className="guest-garland relative z-10 h-24 w-full sm:h-32 lg:h-40"
      />
      <PetalDrift flowers={[look.flower, look.secondFlower]} />
      {look.style === "party" && <Balloons className="guest-balloons absolute inset-0 -z-10" />}
      {garden && (
        <>
          <Palm className="guest-palm absolute -start-10 bottom-8 -z-10 h-72 sm:h-96" />
          <Palm flip className="guest-palm absolute -end-10 bottom-8 -z-10 h-64 sm:h-88" />
        </>
      )}
      <Ground look={look} className="absolute inset-x-0 bottom-0 -z-10 h-24 w-full sm:h-32" />

      <div className="mx-auto my-auto grid w-full max-w-6xl items-center gap-8 px-4 pt-4 sm:gap-12 sm:px-6 sm:pt-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
        <Reveal className="guest-stagger flex flex-col items-center gap-4 text-center sm:gap-5 lg:items-start lg:text-start">
          <p lang={lang} className="font-label text-xs tracking-[0.3em] text-accent-text uppercase">
            {cardWords.invitedTo}
          </p>
          <h2
            id="guest-welcome"
            lang={lang}
            className="font-display text-[2.75rem] leading-[1.02] break-words text-ink sm:text-[4rem]"
          >
            {copy.first}
            {joiner && (
              <>
                <span className="block text-[0.5em] leading-snug text-accent-text">{joiner}</span>
                {copy.second}
              </>
            )}
          </h2>
          <div lang={lang} className="flex max-w-md flex-col gap-2 text-lg text-ink-muted">
            {welcome.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          {copy.date && (
            <p lang={lang} className="guest-date-chip font-display text-xl text-ink">
              {copy.date}
            </p>
          )}
        </Reveal>

        {photos.length === 1 && (
          <Reveal className="mx-auto w-[min(64vw,22rem,calc(40svh*0.8))] lg:me-8">
            <Framed look={look}>
              <FramedPhoto
                photo={{ src: photos[0]!.url, alt: "", fit: photos[0]!.fit }}
                alt={guestCopy.photoAlt(1)}
                frameAspect={GALLERY_ASPECT}
                className="size-full"
              />
            </Framed>
          </Reveal>
        )}
        {/* One each, side by side, each over its own name */}
        {photos.length > 1 && (
          <Reveal className="mx-auto flex w-full max-w-[28rem] items-start justify-center gap-5 sm:gap-8 lg:me-8">
            {photos.slice(0, 2).map((photo, index) => {
              const name = index === 0 ? copy.first : copy.second;
              return (
                <figure
                  key={photo.id}
                  className={cn(
                    "flex w-[min(40vw,15rem,calc(34svh*0.8))] min-w-0 flex-col items-center gap-4",
                    index === 1 && "mt-12 sm:mt-16",
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
                  {name.trim() && (
                    <figcaption
                      lang={lang}
                      className="max-w-full text-center font-display text-xl leading-tight break-words text-ink"
                    >
                      {name}
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </Reveal>
        )}
      </div>
    </section>
  );
}
