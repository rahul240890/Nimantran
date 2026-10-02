import { newDraft, type InviteDraft } from "@/lib/editor/draft";
import { CATEGORIES, type CategoryId } from "@/lib/categories/catalog";
import { SUITES, isSceneTheme, type SuiteId } from "@/lib/suites/catalog";

/* Made-up invites for the review pages: names, dates and pictures, nothing saved. */

/** Pictures standing in for the family's photos: any picture shows how the frames crop. */
export const SAMPLE_PHOTOS = [
  "/suites/kayal/haldi.webp",
  "/suites/rajbari/mehendi.webp",
  "/suites/noor-bagh/wedding.webp",
  "/suites/rajwada-bagh/sangeet.webp",
].map((url, index) => ({ id: `sample-${index}`, url, width: 768, height: 1365 }));

/** Stand-ins for the couple's own photos in One Scene's frames. */
export const SCENE_PHOTOS = ["/occasions/engagement.webp", "/occasions/mehendi.webp"].map(
  (url, index) => ({ id: `scene-${index}`, url, width: 1024, height: 1024 }),
);

export const at = (date: string, time: string, venue: string, address = "") => ({
  included: true,
  date,
  time,
  endTime: "",
  venue,
  address,
  dressCode: "",
});

export function sampleDraft(suite: SuiteId, hindi: boolean): InviteDraft {
  // A Scene theme painted for another occasion shows that occasion's own invite
  const occasion = SUITES[suite].occasions?.[0];
  if (occasion && isSceneTheme(suite)) return occasionDraft(suite, occasion, hindi);
  const draft = newDraft(SUITES[suite].template ?? "marigold");
  return {
    ...draft,
    suite,
    languages: hindi ? ["hi"] : draft.languages,
    tradition: {
      ...draft.tradition,
      id: SUITES[suite].traditions[0] ?? null,
      wording: {
        blessingsFrom: "Smt. Kamla Devi and Shri Mohan Lal Gupta",
        requesters: "Shri and Smt. Gupta, Shri and Smt. Sharma",
      },
    },
    content: {
      first: "Arjun",
      second: "Sia",
      blessing: "With the blessings of Lord Ganesha",
      families: "Together with their families",
      line: "request the pleasure of your company as they begin their journey together",
      date: "Friday, 20 November 2026",
      venue: "Umaid Bhawan, Jodhpur",
    },
    functions: {
      ...draft.functions,
      haldi: at("2026-11-18", "10:00", "Family home", "Sardarpura, Jodhpur"),
      sangeet: {
        ...at("2026-11-19", "19:30", "Rooftop lawns, Umaid Bhawan"),
        dressCode: "Festive",
      },
      wedding: at("2026-11-20", "18:30", "Umaid Bhawan, Jodhpur", "Circuit House Road"),
    },
  };
}

/** A theme painted for another occasion: its one celebration, with names to suit. */
function occasionDraft(suite: SuiteId, occasion: CategoryId, hindi: boolean): InviteDraft {
  const draft = newDraft(SUITES[suite].template ?? "marigold", occasion);
  const category = CATEGORIES[occasion];
  const one = "people" in category && category.people === "one";
  const primary = category.functions.primary;
  return {
    ...draft,
    suite,
    languages: hindi ? ["hi"] : draft.languages,
    content: {
      first: one ? "Aarav" : "Arjun",
      second: one ? "" : "Sia",
      line: "line" in category.wording ? category.wording.line : "",
      date: "Saturday, 21 November 2026",
      venue: "The Garden Terrace, Jodhpur",
    },
    functions: {
      ...draft.functions,
      [primary]: at("2026-11-21", "18:30", "The Garden Terrace, Jodhpur"),
    },
  };
}

/**
 * A Scene invite: a wedding gets five celebrations, so the slot shows every side they come
 * in from.
 */
export function sceneDraft(base: InviteDraft, photos: number): InviteDraft {
  // An occasion's own one celebration stays as it is
  if (base.categoryId !== "wedding") {
    return {
      ...base,
      format: "scene",
      couplePhotos: { layout: photos === 1 ? "one" : "two", ids: [] },
    };
  }
  return {
    ...base,
    format: "scene",
    functions: {
      ...base.functions,
      mehendi: at("2026-11-18", "16:00", "The courtyard, Ajit Bhawan"),
      reception: at("2026-11-21", "20:00", "Mehrangarh Fort lawns"),
    },
    couplePhotos: { layout: photos === 1 ? "one" : "two", ids: [] },
  };
}
