"use client";

import { Fragment, useState, type ReactNode } from "react";
import type { GuestFunction } from "@/components/guest/guest-view";
import type { FamilyBlock } from "@/components/guest/family-words";
import type { GuestPhoto } from "@/components/guest/guest-photo";
import { useGuestText } from "@/components/guest/guest-language";
import { MusicBars } from "@/components/invitation/music-bars";
import type { FunctionId } from "@/lib/events/functions";
import type { SuiteId } from "@/lib/suites/catalog";
import type { GuestLook } from "@/lib/suites/guest-look";
import { guestRecipe, type GuestSection } from "@/lib/suites/recipe";
import type { CardLanguage } from "@/lib/templates/card-languages";
import type { CardCopy } from "@/lib/templates/content";
import { FlowerDefs, PetalShower } from "./flowers";
import { Celebrations } from "./sections/celebrations";
import { Dusk } from "./sections/dusk";
import { GiveFlowers } from "./sections/give-flowers";
import { Night } from "./sections/night";
import { EventsChapters, EventsRooms } from "./sections/events-versions";
import { DateScratch, EventsCards } from "./sections/moments";
import { RecipeContext, type Music } from "./sections/parts";
import { DateOversized, SaveTheDate } from "./sections/save-the-date";
import { Welcome } from "./sections/welcome";
import { WelcomeDarbar, WelcomeLetter, WelcomeMasthead } from "./sections/welcome-versions";
import { useOnScreen } from "./use-in-view";
import "@/app/guest-sections.css";
import "@/app/guest-blessings.css";
import "@/app/guest-families.css";

/**
 * The guest page below a painted theme's pages (Step 12q). Scrolling down, the guest meets
 * the theme's sections in the order its recipe gives (recipe.ts): a welcome, flowers to
 * give the family, the date, each celebration, photos and family, and a light to give
 * before the reply. Each section is drawn in the version the recipe names, in the theme's
 * own colours, flowers and lamps (its `GuestLook`); the sections live in ./sections, one
 * file each.
 */
export function ThemedDetails({
  suite,
  look,
  copy,
  lang,
  functions,
  days,
  main,
  welcome,
  photos,
  family,
  familyLang,
  allIcsUrl,
  music,
  reply,
}: {
  suite: SuiteId;
  look: GuestLook;
  /** The card's words, in the card's language. */
  copy: CardCopy;
  /** The card's language: the page's own words follow it, like the pages above. */
  lang: CardLanguage;
  functions: readonly GuestFunction[];
  /** Each celebration's date (YYYY-MM-DD), for the date seals and stubs on its box. */
  days: Readonly<Partial<Record<FunctionId, string>>>;
  /** The main event's date (YYYY-MM-DD) and venue, for "Save the date". */
  main: { date: string; venue: string } | null;
  /** The photos the welcome shows: the couple's, or one each, from the design's own frames. */
  welcome: readonly GuestPhoto[];
  /** The other photos, for the gallery at dusk: each photo shows once on the page. */
  photos: readonly GuestPhoto[];
  family: readonly FamilyBlock[];
  familyLang: string | undefined;
  allIcsUrl: string | null;
  music: Music;
  /** The reply form, drawn in the theme's colours. */
  reply: ReactNode;
}) {
  // The music button floats while the guest reads this page
  const [top, onScreen] = useOnScreen<HTMLDivElement>();
  const [burst, setBurst] = useState(0);
  const flowers = [look.flower, look.secondFlower] as const;
  const recipe = guestRecipe(suite, look);
  const { layouts, versions } = recipe;
  const welcomeProps = { copy, lang, look, photos: welcome };
  const eventProps = { suite, look, lang, functions, days, allIcsUrl, box: recipe.box };

  // The registry: every section a recipe can name, drawn in the version it picks
  const sections: Record<GuestSection, () => ReactNode> = {
    welcome: () =>
      ({
        garland: <Welcome {...welcomeProps} />,
        masthead: <WelcomeMasthead {...welcomeProps} />,
        letter: <WelcomeLetter {...welcomeProps} />,
        darbar: <WelcomeDarbar {...welcomeProps} />,
      })[versions.welcome],
    flowers: () => (
      <GiveFlowers
        way={recipe.flowers}
        look={look}
        lang={lang}
        onGive={() => {
          if (recipe.flowers === "shower") setBurst((was) => was + 1);
        }}
      />
    ),
    date: () =>
      main &&
      {
        layout: <SaveTheDate main={main} look={look} lang={lang} layout={layouts.date} />,
        oversized: <DateOversized main={main} lang={lang} />,
        scratch: <DateScratch main={main} lang={lang} />,
      }[versions.date],
    events: () =>
      ({
        hours: <Celebrations {...eventProps} layouts={layouts} />,
        chapters: <EventsChapters {...eventProps} />,
        rooms: <EventsRooms {...eventProps} />,
        cards: <EventsCards {...eventProps} />,
      })[versions.events],
    dusk: () =>
      (photos.length > 0 || family.length > 0) && (
        <Dusk
          before={welcome.length}
          photos={photos}
          family={family}
          familyLang={familyLang}
          look={look}
          lang={lang}
          layouts={layouts}
        />
      ),
    night: () => (
      <Night
        copy={copy}
        lang={lang}
        look={look}
        way={recipe.lamp}
        reply={reply}
        quiet={versions.night === "quiet"}
        paper={versions.reply}
      />
    ),
  };

  return (
    <div
      ref={top}
      data-suite={suite}
      data-guest={look.style}
      data-family={recipe.family}
      data-finish={versions.finish}
      className="guest-themed relative isolate overflow-clip"
    >
      <RecipeContext value={recipe}>
        <FlowerDefs />
        {recipe.sections.map((section) => (
          <Fragment key={section}>{sections[section]()}</Fragment>
        ))}
        {onScreen && <FloatingMusic music={music} />}
        <PetalShower flowers={flowers} burst={burst} />
      </RecipeContext>
    </div>
  );
}

/** The music, one tap away while the guest reads on. */
function FloatingMusic({ music }: { music: Music }) {
  const { guestCopy } = useGuestText();
  const words = guestCopy.themed.music;
  return (
    <button
      type="button"
      onClick={music.toggle}
      aria-pressed={music.playing}
      aria-label={music.playing ? words.pause : words.play}
      data-playing={music.playing || undefined}
      className="guest-float-music fixed end-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-20 grid size-14 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <MusicBars playing={music.playing} className="size-6" />
    </button>
  );
}
