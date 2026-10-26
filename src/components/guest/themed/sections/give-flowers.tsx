"use client";

import { Flower2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGuestText } from "@/components/guest/guest-language";
import type { FlowerBlessing } from "@/lib/suites/blessings";
import type { GuestLook } from "@/lib/suites/guest-look";
import type { CardLanguage } from "@/lib/templates/card-languages";
import { FlowerStage } from "../flower-blessing";
import { PetalDrift } from "../flowers";
import { Heading, Reveal } from "./parts";

/**
 * The flowers the guest gives after the welcome, in this theme's own way (blessings.ts):
 * a drawing that moves each time they give, and words that thank them.
 */
export function GiveFlowers({
  way,
  look,
  lang,
  onGive,
}: {
  way: FlowerBlessing;
  look: GuestLook;
  lang: CardLanguage;
  onGive: () => void;
}) {
  const { guestCopy } = useGuestText();
  const words = guestCopy.themed;
  const gift = words.flowers[way];
  const [given, setGiven] = useState(0);
  return (
    <section
      aria-labelledby="guest-flowers"
      data-mood="dawn"
      data-tour="8"
      className="guest-sky relative isolate flex min-h-svh flex-col justify-center px-4 py-16 sm:px-6"
    >
      <PetalDrift flowers={[look.secondFlower, look.flower]} count={8} />
      <Reveal className="guest-stagger mx-auto flex w-full max-w-3xl flex-col items-center gap-5 text-center sm:gap-6">
        <Heading
          id="guest-flowers"
          lang={lang}
          label={words.flowersLabel}
          title={words.flowersTitle}
        />
        <FlowerStage
          way={way}
          flower={look.flower}
          second={look.secondFlower}
          given={given}
          className="bl-stage w-full max-w-[34rem]"
        />
        <Button
          onClick={() => {
            setGiven((was) => was + 1);
            onGive();
          }}
          size="lg"
          className="max-w-full rounded-full"
        >
          <Flower2 aria-hidden />
          {gift.give}
        </Button>
        <p aria-live="polite" className="-mt-2 min-h-6 text-sm text-balance text-ink-muted">
          {given > 0 ? gift.given : ""}
        </p>
      </Reveal>
    </section>
  );
}
