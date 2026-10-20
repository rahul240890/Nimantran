"use client";

import { Flower2 } from "lucide-react";
import { useState } from "react";
import { FlowerStage } from "@/components/guest/themed/flower-blessing";
import { FlowerDefs } from "@/components/guest/themed/flowers";
import { LampStage } from "@/components/guest/themed/lamp-blessing";
import { Button } from "@/components/ui/button";
import { guestText } from "@/i18n/copy/guest";
import {
  FLOWER_BLESSINGS,
  LAMP_BLESSINGS,
  type FlowerBlessing,
  type LampBlessing,
} from "@/lib/suites/blessings";
import type { SuiteId } from "@/lib/suites/catalog";
import type { GuestLook } from "@/lib/suites/guest-look";
import type { CardLanguage } from "@/lib/templates/card-languages";
import "@/app/guest-sections.css";
import "@/app/guest-blessings.css";

/** Every way of giving flowers and light, side by side in one theme's colours. */
export function BlessingsBoard({
  suite,
  look,
  lang,
}: {
  suite: SuiteId;
  look: GuestLook;
  lang: CardLanguage;
}) {
  return (
    <div data-suite={suite} data-guest={look.style} className="guest-themed relative isolate">
      <FlowerDefs />
      <section data-mood="dawn" className="guest-sky px-4 py-10 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FLOWER_BLESSINGS.map((way) => (
            <FlowerTile key={way} way={way} look={look} lang={lang} />
          ))}
        </div>
      </section>
      <section data-mood="night" className="guest-sky guest-night px-4 py-10 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LAMP_BLESSINGS.map((way) => (
            <LampTile key={way} way={way} look={look} lang={lang} />
          ))}
        </div>
      </section>
    </div>
  );
}

function FlowerTile({
  way,
  look,
  lang,
}: {
  way: FlowerBlessing;
  look: GuestLook;
  lang: CardLanguage;
}) {
  const [given, setGiven] = useState(0);
  const words = guestText[lang].guestCopy.themed.flowers[way];
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <p className="font-label text-xs tracking-[0.3em] text-accent-text uppercase">{way}</p>
      <FlowerStage
        way={way}
        flower={look.flower}
        second={look.secondFlower}
        given={given}
        className="bl-stage w-full"
      />
      <Button onClick={() => setGiven((was) => was + 1)} className="max-w-full rounded-full">
        <Flower2 aria-hidden />
        {words.give}
      </Button>
      <p aria-live="polite" lang={lang} className="min-h-6 text-sm text-balance text-ink-muted">
        {given > 0 ? words.given : ""}
      </p>
    </div>
  );
}

function LampTile({ way, look, lang }: { way: LampBlessing; look: GuestLook; lang: CardLanguage }) {
  const [lit, setLit] = useState(false);
  const words = guestText[lang].guestCopy.themed.lights[way];
  return (
    <div data-lit={lit || undefined} className="flex flex-col items-center gap-3 text-center">
      <p className="font-label text-xs tracking-[0.3em] text-accent-text uppercase">{way}</p>
      <div className="guest-lamps flex min-h-44 w-full items-center justify-center">
        <LampStage way={way} flower={look.flower} />
      </div>
      <Button
        variant={lit ? "secondary" : "primary"}
        onClick={() => setLit((was) => !was)}
        aria-pressed={lit}
        className="max-w-full rounded-full"
      >
        {words.give}
      </Button>
      <p aria-live="polite" lang={lang} className="min-h-6 text-sm text-balance text-ink-muted">
        {lit ? words.given : ""}
      </p>
    </div>
  );
}
