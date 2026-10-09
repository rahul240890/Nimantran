import * as enCategories from "@/content/categories";
import * as hiCategories from "@/content/hi/categories";
import * as enPublish from "@/content/publish";
import * as hiPublish from "@/content/hi/publish";
import * as enWall from "@/content/photo-wall";
import * as hiWall from "@/content/hi/photo-wall";
import { uiStrings as hiUi } from "@/content/hi/ui";
import { guestText as bn } from "@/content/bn/guest";
import { guestText as gu } from "@/content/gu/guest";
import { guestText as mr } from "@/content/mr/guest";
import { guestText as ta } from "@/content/ta/guest";
import type { CardLanguage } from "@/lib/templates/card-languages";
import { uiStrings as enUi } from "@/lib/ui-strings";
import type { Translation } from "../text";

/** Everything a guest reads around the card: the opening, the details, the reply form and the photo wall. */
type GuestCopy = {
  guestCopy: typeof enPublish.guestCopy;
  rsvpCopy: typeof enPublish.rsvpCopy;
  wallCopy: typeof enWall.wallCopy;
  questionLabels: typeof enCategories.questionLabels;
  invitation: typeof enUi.invitation;
  theme: typeof enUi.theme;
};

export type GuestText = Translation<GuestCopy>;

/*
 * The guest's page speaks the card's language, not the site's, so a Gujarati card has a
 * Gujarati reply form (Step 12a). English and Hindi share the site's own strings; the
 * others are drafts for a native proofreader, like the card's own words in story-words.ts.
 */
export const guestText: Record<CardLanguage, GuestText> = {
  en: {
    guestCopy: enPublish.guestCopy,
    rsvpCopy: enPublish.rsvpCopy,
    wallCopy: enWall.wallCopy,
    questionLabels: enCategories.questionLabels,
    invitation: enUi.invitation,
    theme: enUi.theme,
  },
  hi: {
    guestCopy: hiPublish.guestCopy,
    rsvpCopy: hiPublish.rsvpCopy,
    wallCopy: hiWall.wallCopy,
    questionLabels: hiCategories.questionLabels,
    invitation: hiUi.invitation,
    theme: hiUi.theme,
  },
  mr,
  gu,
  bn,
  ta,
};
