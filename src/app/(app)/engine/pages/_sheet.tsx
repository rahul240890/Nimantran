"use client";

import { useMemo } from "react";
import { StoryPage } from "@/components/invitation/story/story-player";
import { ReviewHeader } from "@/components/shell/review-header";
import { useLocale, useText } from "@/i18n/client";
import { uiText } from "@/i18n/copy/ui";
import { draftCopy, newDraft, type InviteDraft } from "@/lib/editor/draft";
import { pageType } from "@/lib/editor/type";
import { storyBeats } from "@/lib/engine/story";
import { cardFunctions, draftBlessing, storyFamily, storyFunctions } from "@/lib/publish/story";
import { SUITES, SUITE_IDS, pageLook, type SuiteId } from "@/lib/suites/catalog";
import type { CardLanguage } from "@/lib/templates/card-languages";
import { CARD_STORY_WORDS } from "@/lib/templates/story-words";
import "@/components/invitation/type/fonts.css";

const noop = () => {};

/** The tradition each card language's sample family follows. */
const TRADITION: Record<CardLanguage, string | null> = {
  en: null,
  hi: "north-hindu",
  mr: "marathi",
  gu: "gujarati",
  bn: "bengali",
  ta: "tamil",
};

type Sample = {
  first: string;
  second: string;
  parents: [string, string];
  towns: [string, string];
  memory: string;
  blessingsFrom: string;
  requesters: string;
  venues: [home: string, lawns: string, palace: string];
};

/* Made-up families of a typical length, written as hosts write them in each script */
const SAMPLES: Record<CardLanguage, Sample> = {
  en: {
    first: "Arjun",
    second: "Meenakshi",
    parents: ["Smt. Sunita & Shri Ramesh Sharma", "Smt. Kavita & Shri Anil Mehta"],
    towns: ["Jaipur", "Udaipur"],
    memory: "Late Shri Mohan Lal Sharma",
    blessingsFrom: "Smt. Kamla Devi & Shri Mohan Lal Sharma",
    requesters: "The Sharma and Mehta families",
    venues: [
      "Sharma Niwas, Sardarpura",
      "Rooftop lawns, Umaid Bhawan",
      "Umaid Bhawan Palace, Jodhpur",
    ],
  },
  hi: {
    first: "अर्जुन",
    second: "मीनाक्षी",
    parents: ["श्रीमती सुनीता एवं श्री रमेश शर्मा", "श्रीमती कविता एवं श्री अनिल मेहता"],
    towns: ["जयपुर", "उदयपुर"],
    memory: "स्व. श्री मोहन लाल शर्मा",
    blessingsFrom: "श्रीमती कमला देवी एवं श्री मोहन लाल शर्मा",
    requesters: "शर्मा एवं मेहता परिवार",
    venues: ["शर्मा निवास, सरदारपुरा", "उम्मेद भवन का छत बाग़", "उम्मेद भवन पैलेस, जोधपुर"],
  },
  mr: {
    first: "अर्जुन",
    second: "मीनाक्षी",
    parents: ["सौ. सुनीता व श्री. रमेश देशपांडे", "सौ. कविता व श्री. अनिल कुलकर्णी"],
    towns: ["पुणे", "नाशिक"],
    memory: "कै. श्री. मोहन देशपांडे",
    blessingsFrom: "सौ. कमला व श्री. मोहन देशपांडे",
    requesters: "देशपांडे व कुलकर्णी परिवार",
    venues: ["देशपांडे वाडा, सदाशिव पेठ", "शुभमंगल लॉन्स, बाणेर", "शुभमंगल कार्यालय, पुणे"],
  },
  gu: {
    first: "અર્જુન",
    second: "મીનાક્ષી",
    parents: ["શ્રીમતી સુનીતાબેન અને શ્રી રમેશભાઈ પટેલ", "શ્રીમતી કવિતાબેન અને શ્રી અનિલભાઈ શાહ"],
    towns: ["અમદાવાદ", "વડોદરા"],
    memory: "સ્વ. શ્રી મોહનભાઈ પટેલ",
    blessingsFrom: "શ્રીમતી કમળાબેન અને શ્રી મોહનભાઈ પટેલ",
    requesters: "પટેલ પરિવાર અને શાહ પરિવાર",
    venues: ["પટેલ નિવાસ, નવરંગપુરા", "કર્ણાવતી ક્લબ લૉન્સ", "હોટેલ ગ્રાન્ડ, અમદાવાદ"],
  },
  bn: {
    first: "অর্জুন",
    second: "মীনাক্ষী",
    parents: ["শ্রীমতী সুনীতা ও শ্রী রমেশ বসু", "শ্রীমতী কবিতা ও শ্রী অনিল সেন"],
    towns: ["কলকাতা", "শান্তিনিকেতন"],
    memory: "স্বর্গীয় শ্রী মোহন বসু",
    blessingsFrom: "শ্রীমতী কমলা ও শ্রী মোহন বসু",
    requesters: "বসু ও সেন পরিবার",
    venues: ["বসু বাড়ি, বালিগঞ্জ", "গঙ্গার ধারে বাগান", "রাজবাড়ি, কলকাতা"],
  },
  ta: {
    first: "அர்ஜுன்",
    second: "மீனாட்சி",
    parents: ["திருமதி சுனிதா & திரு ரமேஷ் ஐயர்", "திருமதி கவிதா & திரு அனில் ராமன்"],
    towns: ["சென்னை", "மதுரை"],
    memory: "அமரர் திரு மோகன் ஐயர்",
    blessingsFrom: "திருமதி கமலா & திரு மோகன் ஐயர்",
    requesters: "ஐயர் மற்றும் ராமன் குடும்பத்தினர்",
    venues: ["ஐயர் இல்லம், மயிலாப்பூர்", "கடற்கரை தோட்டம், ஈசிஆர்", "ஸ்ரீ கல்யாண மண்டபம், சென்னை"],
  },
};

function sampleDraft(suite: SuiteId, language: CardLanguage): InviteDraft {
  const theme = SUITES[suite];
  const category = theme.occasions?.[0] ?? "wedding";
  const draft = newDraft(theme.template ?? "marigold", category);
  const sample = SAMPLES[language];
  const wedding = category === "wedding";
  const at = (date: string, time: string, venue: string) => ({
    included: true,
    date,
    time,
    endTime: "",
    venue,
    address: "",
    dressCode: "",
  });
  const [home, lawns, palace] = sample.venues;
  const functions = wedding
    ? {
        ...draft.functions,
        haldi: at("2026-11-18", "10:00", home),
        mehendi: at("2026-11-18", "16:00", home),
        sangeet: at("2026-11-19", "19:30", lawns),
        baraat: at("2026-11-20", "17:00", palace),
        wedding: at("2026-11-20", "18:30", palace),
        reception: at("2026-11-21", "19:30", lawns),
      }
    : Object.fromEntries(
        Object.entries(draft.functions).map(([id, fn]) => [
          id,
          fn.included ? at("2026-11-20", "18:30", palace) : fn,
        ]),
      );
  return {
    ...draft,
    suite,
    languages: [language],
    tradition: {
      ...draft.tradition,
      id: wedding ? (TRADITION[language] as InviteDraft["tradition"]["id"]) : null,
      wording: wedding
        ? { blessingsFrom: sample.blessingsFrom, requesters: sample.requesters }
        : {},
    },
    content: { first: sample.first, ...(wedding ? { second: sample.second } : {}) },
    functions: functions as InviteDraft["functions"],
    family: wedding
      ? {
          first: { relation: "son", parents: sample.parents[0], town: sample.towns[0] },
          second: { relation: "daughter", parents: sample.parents[1], town: sample.towns[1] },
          memory: sample.memory,
          contacts: [],
        }
      : draft.family,
  };
}

/** Every page of one theme in phones, side by side, for checking how the words sit. */
export function PageSheet({
  suite,
  language,
  textBox,
}: {
  suite: SuiteId;
  language: CardLanguage;
  textBox: boolean;
}) {
  const locale = useLocale();
  const { uiStrings } = useText(uiText);
  const draft = useMemo(() => sampleDraft(suite, language), [suite, language]);
  const copy = useMemo(() => draftCopy(draft, language), [draft, language]);
  const beats = useMemo(
    () =>
      storyBeats({
        copy,
        functions: cardFunctions(storyFunctions(draft, locale), draft, language),
        replies: true,
        words: CARD_STORY_WORDS[language],
        family: storyFamily(draft, language),
        blessing: draftBlessing(draft),
      }),
    [copy, draft, language, locale],
  );
  const type = useMemo(() => pageType(draft.type, [language]), [draft.type, language]);

  return (
    <div className="flex min-h-dvh flex-col">
      <ReviewHeader label="Event pages sheet" />
      <main className="mx-auto flex w-full max-w-[110rem] flex-col gap-6 px-4 pt-24 pb-8 sm:px-6">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h1 className="font-display text-3xl">{suite}</h1>
          <p className="text-ink-muted">
            {language} · {SUITE_IDS.indexOf(suite) + 1} of {SUITE_IDS.length}
          </p>
        </div>
        <ul data-sheet className="grid grid-cols-[repeat(auto-fill,390px)] justify-center gap-4">
          {beats.map((beat) => (
            <li key={beat.id} className="flex flex-col items-center gap-2">
              <div
                lang={language}
                data-suite={suite}
                data-mood={pageLook(beat.scene).mood}
                className="[container-type:size] relative isolate h-[844px] w-[390px] overflow-hidden rounded-[1.6rem] border-[5px] border-night bg-night"
              >
                <StoryPage
                  beat={beat}
                  copy={copy}
                  suite={suite}
                  textBox={textBox}
                  type={type}
                  still
                  reply={null}
                  labels={uiStrings.invitation.story}
                  onReply={noop}
                  inert
                  lang={language}
                />
              </div>
              <p className="text-sm text-ink-muted">{beat.id}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
