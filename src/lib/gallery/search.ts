import {
  OCCASIONS,
  WEDDING_KINDS,
  WEDDING_KIND_ENTRIES,
  allDesigns,
  type GalleryDesign,
  type WeddingKind,
} from "./catalog";

/*
 * Gallery search: occasions, wedding kinds and designs, found by any of their names in
 * English, Hindi or their own script, or by the words people use for them ("kankotri",
 * "sagai", "griha pravesh"). Every word typed must match somewhere, so "gujarati wedding"
 * finds the Gujarati wedding and not every wedding.
 */

export type SearchHit =
  | { type: "occasion"; id: string }
  | { type: "kind"; id: WeddingKind }
  | { type: "design"; design: GalleryDesign };

/** Names and descriptions the search reads, from every site language. */
export type SearchWords = {
  occasion: (id: string) => string[];
  kind: (id: WeddingKind) => string[];
  design: (design: GalleryDesign) => string[];
};

/** Lower case, without accents or punctuation, so "Mehndi," matches "mehndi". */
export function normalize(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, " ")
    .trim();
}

type Entry = { hit: SearchHit; name: string; text: string; rank: number };

function entries(words: SearchWords): Entry[] {
  const list: Entry[] = [];
  OCCASIONS.forEach((occasion, index) => {
    const names = words.occasion(occasion.id);
    list.push({
      hit: { type: "occasion", id: occasion.id },
      name: normalize(names[0] ?? occasion.id),
      text: normalize([...names, ...occasion.keywords, occasion.names.hi].join(" ")),
      // Ready occasions before the ones still coming
      rank: (occasion.category ? 0 : 100) + index,
    });
  });
  WEDDING_KINDS.forEach((kind, index) => {
    const entry = WEDDING_KIND_ENTRIES[kind];
    const names = words.kind(kind);
    list.push({
      hit: { type: "kind", id: kind },
      name: normalize(names[0] ?? kind),
      text: normalize(
        [
          ...names,
          ...entry.keywords,
          entry.nativeName?.text ?? "",
          "wedding shaadi vivah lagna विवाह शादी",
        ].join(" "),
      ),
      rank: 20 + index,
    });
  });
  allDesigns().forEach((design, index) => {
    const names = words.design(design);
    list.push({
      hit: { type: "design", design },
      name: normalize(names[0] ?? design.id),
      text: normalize([...names, design.suite, design.template].join(" ")),
      rank: 40 + index,
    });
  });
  return list;
}

/** Everything matching the query, best first: names starting with it, then the rest. */
export function searchGallery(query: string, words: SearchWords, limit = 24): SearchHit[] {
  const terms = normalize(query).split(" ").filter(Boolean);
  if (terms.length === 0) return [];
  const whole = terms.join(" ");
  return entries(words)
    .filter((entry) => terms.every((term) => entry.text.includes(term)))
    .map((entry) => ({
      entry,
      score:
        (entry.name.startsWith(whole) ? 0 : entry.name.includes(whole) ? 1000 : 2000) + entry.rank,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map(({ entry }) => entry.hit);
}
