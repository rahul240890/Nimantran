"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useGuestText } from "@/components/guest/guest-language";
import type { LampBlessing } from "@/lib/suites/blessings";
import type { GuestLook } from "@/lib/suites/guest-look";
import type { SectionVersions } from "@/lib/suites/recipe";
import type { CardLanguage } from "@/lib/templates/card-languages";
import type { CardCopy } from "@/lib/templates/content";
import { CARD_THEMED_WORDS } from "@/lib/templates/themed-words";
import { LampStage } from "../lamp-blessing";
import { Festoon } from "../scenery";
import { Ground, Heading, Reveal, useFinish } from "./parts";

/** The reply's paper in each version (recipe.ts): the theme's card, a register, a note or a form. */
const REPLY_PAPER: Record<SectionVersions["reply"], string> = {
  card: "guest-card px-4 py-9 sm:px-10",
  register: "guest-card guest-register px-5 pt-12 pb-10 sm:px-12",
  note: "guest-card guest-note px-5 pt-12 pb-10 sm:px-12",
  form: "guest-ed-form py-10",
};

/**
 * Night: lamps the guest lights for the couple, the blessing, and the reply. A quiet night
 * leaves out the lamps, and on an editorial page the end stays on plain paper.
 */
export function Night({
  copy,
  lang,
  look,
  way,
  reply,
  quiet = false,
  paper = "card",
}: {
  copy: CardCopy;
  lang: CardLanguage;
  look: GuestLook;
  way: LampBlessing;
  reply: ReactNode;
  /** No lamps: the reply and the goodbye only. */
  quiet?: boolean;
  paper?: SectionVersions["reply"];
}) {
  const finish = useFinish();
  const editorial = finish === "editorial";
  const { guestCopy, rsvpCopy } = useGuestText();
  const words = guestCopy.themed;
  const light = words.lights[way];
  const cardWords = CARD_THEMED_WORDS[lang];
  const [lit, setLit] = useState(false);
  return (
    <div
      data-mood={editorial ? "day" : "night"}
      data-lit={lit || undefined}
      data-reply={paper}
      className={cn(
        "guest-sky relative isolate pb-10",
        editorial ? "guest-sky-flat" : "guest-night",
      )}
    >
      {!editorial && <Festoon className="guest-festoon h-12 w-full sm:h-16" />}
      {!quiet && (
        <section
          aria-label={words.lampsLabel}
          data-tour="7"
          className="relative flex min-h-svh flex-col justify-center px-4 pt-10 pb-6 sm:px-6"
        >
          <Reveal className="guest-stagger mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <p
              lang={lang}
              className="font-label text-xs tracking-[0.3em] text-accent-text uppercase"
            >
              {cardWords.blessingLabel}
            </p>
            {copy.blessing && (
              <p lang={lang} className="font-display text-2xl text-balance text-ink sm:text-3xl">
                {copy.blessing}
              </p>
            )}
            <div className="guest-lamps flex w-full justify-center">
              <LampStage way={way} flower={look.flower} />
            </div>
            <Button
              variant={lit ? "secondary" : "primary"}
              size="lg"
              onClick={() => setLit((was) => !was)}
              aria-pressed={lit}
              className="rounded-full"
            >
              {light.give}
            </Button>
            <p aria-live="polite" className="min-h-6 text-sm text-balance text-ink-muted">
              {lit ? light.given : ""}
            </p>
          </Reveal>
        </section>
      )}
      {reply && (
        <section
          id="rsvp"
          aria-labelledby="guest-rsvp"
          data-tour="end"
          className="relative flex min-h-svh scroll-mt-4 flex-col justify-center px-4 pt-6 pb-12 sm:px-6 sm:pb-16"
        >
          <Reveal
            className={cn("mx-auto flex w-full max-w-2xl flex-col gap-6", REPLY_PAPER[paper])}
          >
            <Heading
              id="guest-rsvp"
              lang={lang}
              label={cardWords.replyLabel}
              title={cardWords.joinUs}
            />
            <p className={cn("-mt-3 text-ink-muted", !editorial && "text-center")}>
              {rsvpCopy.intro}
            </p>
            {reply}
          </Reveal>
        </section>
      )}
      <p
        lang={lang}
        data-snap
        className="relative px-6 pt-10 pb-40 text-center font-display text-xl text-balance text-ink-muted sm:pb-48"
      >
        {cardWords.closing}
      </p>
      <Ground look={look} className="absolute inset-x-0 bottom-0 -z-10 h-28 w-full sm:h-36" />
    </div>
  );
}
