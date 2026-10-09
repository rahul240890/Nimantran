import { format, parseISO } from "date-fns";
import { dateLocale } from "@/i18n/dates";
import type { UiLocale } from "@/i18n/locales";
import { editorText } from "@/i18n/copy/editor";
import { publishText } from "@/i18n/copy/publish";
import { familyBlocks } from "@/lib/editor/family";
import {
  cardLanguages,
  ceremonyName,
  draftCopy,
  draftTradition,
  includedFunctions,
  languagePack,
  muhuratName,
  needsTime,
  type InviteDraft,
} from "@/lib/editor/draft";
import type { FamilyLine, StoryFunction } from "@/lib/engine/story";
import { hasBlessingPage, isSceneTheme, suiteFor, type SuiteId } from "@/lib/suites/catalog";
import { hasScene } from "@/lib/suites/scene";
import { CARD_FUNCTION_NAMES, CARD_MUHURAT_WORDS } from "@/lib/templates/card-function-names";
import { formatCardDate, formatCardTime, type CardLanguage } from "@/lib/templates/card-languages";
import { formatTime } from "@/lib/time";

/**
 * Each planned function as the guest reads it (Step 12d's story, the guest page's
 * function cards): its name, local name, date, time or muhurat window, and venue.
 */
export function storyFunctions(draft: InviteDraft, locale: UiLocale): StoryFunction[] {
  const { functionCopy } = editorText[locale];
  const { guestCopy } = publishText[locale];
  const language = draftTradition(draft)?.language ?? "en";
  const words = dateLocale[locale];
  const timed = needsTime(draft);
  return includedFunctions(draft).map((kind) => {
    const fn = draft.functions[kind];
    const local = ceremonyName(draft, kind);
    const muhurat = muhuratName(draft, kind);
    const start = timed && fn.time ? formatTime(fn.time, words) : "";
    return {
      kind,
      name: functionCopy[kind].name,
      localName: local ? { text: local.native, lang: language } : null,
      date: fn.date ? format(parseISO(fn.date), "EEEE, d MMMM yyyy", { locale: words }) : "",
      time: start && fn.endTime ? guestCopy.timeRange(start, formatTime(fn.endTime, words)) : start,
      muhurat: muhurat && start ? { text: muhurat.native, lang: language } : null,
      venue: fn.venue.trim(),
    };
  });
}

/**
 * The functions as the pages print them in one of the card's languages, and only in that
 * language: a Gujarati card is headed by each ceremony's Gujarati name and dated in
 * Gujarati, its English side by the same names in English letters, a Hindi card in Hindi.
 * Nothing falls back to the site's own language.
 */
export function cardFunctions<T extends StoryFunction>(
  functions: readonly T[],
  draft: InviteDraft,
  language: CardLanguage,
): T[] {
  const pack = draftTradition(draft);
  return functions.map((fn) => {
    const local = ceremonyName(draft, fn.kind);
    const muhurat = muhuratName(draft, fn.kind);
    const own = pack !== null && pack.language === language;
    const english = language === "en";
    const siteNames = editorText[language === "hi" ? "hi" : "en"].functionCopy;
    // A card in another language than its tradition's names each function as that
    // language's own cards do: its tradition's word where it has one, else the plain name
    const plain =
      language === "en" || language === "hi"
        ? siteNames[fn.kind].name
        : (languagePack(language)?.ceremonies[fn.kind]?.native ??
          CARD_FUNCTION_NAMES[language][fn.kind]);
    // A ceremony the tradition has no word for (a Tamil sangeet) takes the language's plain name
    const name = own
      ? (local?.native ?? plain)
      : english
        ? (local?.latin ?? siteNames[fn.kind].name)
        : plain;
    const { date, time, endTime } = draft.functions[fn.kind];
    return {
      ...fn,
      name,
      localName: null,
      date: date ? formatCardDate(date, language) : fn.date,
      // Only functions that show a time have one here (needsTime), so follow fn.time
      time: fn.time && time ? formatCardTime(time, endTime || null, language) : fn.time,
      muhurat:
        fn.muhurat && muhurat
          ? {
              text: own
                ? muhurat.native
                : english
                  ? muhurat.latin
                  : (languagePack(language)?.muhurat?.native ?? CARD_MUHURAT_WORDS[language]),
              lang: language,
            }
          : fn.muhurat,
    };
  });
}

/**
 * The family page's blocks in one of the card's languages (Step 12s): blessings, each
 * side's parents, a line in memory, the hosts and whom to call, as the family wrote them.
 */
export function storyFamily(
  draft: InviteDraft,
  language: CardLanguage = cardLanguages(draft)[0],
): (FamilyLine & { id: string })[] {
  const copy = draftCopy(draft, language);
  return familyBlocks({
    family: draft.family,
    wording: draft.tradition.wording,
    names: [copy.first, copy.second],
    pack: draftTradition(draft),
    language,
  });
}

/** The theme the invite's event pages use: the host's choice, else the occasion's or tradition's. */
export function draftSuite(draft: InviteDraft): SuiteId {
  return suiteFor({
    suite: draft.suite,
    tradition: draft.tradition.id,
    templateId: draft.templateId,
    category: draft.categoryId,
  });
}

/**
 * Whether the invite shows as One Scene: the host picked it and its theme has a scene, or
 * its theme is a Scene theme, which has no pages of its own.
 */
export function draftShowsScene(draft: InviteDraft): boolean {
  const suite = draftSuite(draft);
  return (draft.format === "scene" || isSceneTheme(suite)) && hasScene(suite);
}

/** Whether the pages open with the theme's painted god: when it has one and the host keeps it. */
export function draftBlessing(draft: InviteDraft): boolean {
  return draft.blessingPage && hasBlessingPage(draftSuite(draft));
}
