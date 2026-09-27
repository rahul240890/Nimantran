import { firstGrapheme } from "@/lib/initials";
import type { SymbolId } from "@/lib/traditions/schema";
import { SLOT_IDS, type SlotId } from "./ids";
import type { Template } from "./schema";

/** What a host has written into a template's slots. Missing slots use the sample wording. */
export type TemplateContent = Partial<Record<SlotId, string>>;

/** The words a card draws. A slot the template doesn't use is an empty string. */
export type CardCopy = {
  doors: readonly [string, string];
  blessing: string;
  families: string;
  first: string;
  joiner: string;
  second: string;
  line: string;
  date: string;
  venue: string;
  /** A sacred symbol drawn top-centre, above every word (tradition packs, Step 12a). */
  symbol?: SymbolId | null;
};

export function slotsOf(template: Template): SlotId[] {
  // Always in reading order, whatever order the template lists them in
  return SLOT_IDS.filter((id) => template.slots.some((slot) => slot.id === id));
}

export function sampleContent(template: Template): Record<SlotId, string> {
  const content = Object.fromEntries(SLOT_IDS.map((id) => [id, ""])) as Record<SlotId, string>;
  for (const slot of template.slots) content[slot.id] = slot.sample;
  return content;
}

/** Fills a template's slots with a host's wording, falling back to the samples. */
export function toCardCopy(template: Template, content: TemplateContent = {}): CardCopy {
  const used = new Set(slotsOf(template));
  const samples = sampleContent(template);
  const read = (id: SlotId) => (used.has(id) ? (content[id] ?? samples[id]).trim() : "");
  return {
    doors: [read("doorLeft"), read("doorRight")],
    blessing: read("blessing"),
    families: read("families"),
    first: read("first"),
    joiner: read("joiner"),
    second: read("second"),
    line: read("line"),
    date: read("date"),
    venue: read("venue"),
  };
}

/** A name's first letter as a reader sees it, keeping combining marks (मी, not म). */
export function initialOf(name: string): string {
  return firstGrapheme(name.trim()).toLocaleUpperCase();
}
