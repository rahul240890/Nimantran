import { format, parseISO } from "date-fns";
import { dateLocale } from "@/i18n/dates";
import type { UiLocale } from "@/i18n/locales";
import { editorText } from "@/i18n/copy/editor";
import { publishText } from "@/i18n/copy/publish";
import {
  ceremonyName,
  draftTradition,
  includedFunctions,
  muhuratName,
  needsTime,
  type InviteDraft,
} from "@/lib/editor/draft";
import type { FamilyLine, StoryFunction } from "@/lib/engine/story";
import { suiteFor, type SuiteId } from "@/lib/suites/catalog";
import { WORDING_IDS } from "@/lib/traditions/schema";
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

/** The tradition's family wording the host wrote, for the family page (Step 12e). */
export function storyFamily(draft: InviteDraft): FamilyLine[] {
  const pack = draftTradition(draft);
  if (!pack) return [];
  return WORDING_IDS.flatMap((id) => {
    const text = draft.tradition.wording[id]?.trim();
    const block = pack.wording[id];
    return text && block ? [{ title: block.title, text, lang: pack.language }] : [];
  });
}

/** The theme the invite's event pages use: the host's choice, else the tradition's. */
export function draftSuite(draft: InviteDraft): SuiteId {
  return suiteFor({
    suite: draft.suite,
    tradition: draft.tradition.id,
    templateId: draft.templateId,
  });
}
