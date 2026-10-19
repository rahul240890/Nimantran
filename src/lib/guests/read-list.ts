import { z } from "zod";
import type { ImportSource } from "./import";
import { GUEST_RULES } from "./list";

/*
 * Reading a guest list with AI: a photo of a handwritten diary or register page, a printed
 * list, a PDF, a Word file or messy notes, in any Indian language. The AI answers in the
 * shape below; each guest becomes an import row the host checks and edits before adding,
 * the same review as any other import. The AI never fills in a digit it can't read: it
 * writes "?" there and says it was unsure, so the row is flagged for the host.
 */

/** What can be wrong with one page, for a message that says how to take it again. */
export const PAGE_PROBLEMS = ["none", "blurred", "dark", "cut", "not-a-list"] as const;
export type PageProblem = (typeof PAGE_PROBLEMS)[number];

export const readingSchema = z.object({
  problem: z.enum(PAGE_PROBLEMS),
  guests: z.array(
    z.object({
      name: z.string(),
      phone: z.string(),
      group: z.string(),
      people: z.number(),
      unsureName: z.boolean(),
      unsurePhone: z.boolean(),
    }),
  ),
});
export type Reading = z.infer<typeof readingSchema>;

/** The answer's shape, spelled out for models without structured output. */
export const READING_SHAPE =
  '{"problem":"none|blurred|dark|cut|not-a-list","guests":[{"name":"","phone":"","group":"","people":1,"unsureName":false,"unsurePhone":false}]}';

export const READING_SYSTEM = `You read guest lists that Indian families keep for invitations: handwritten diary or register pages, the back of an old card, printed lists, typed notes, chat messages and spreadsheets turned into text. They may be in any language or script (Hindi, Gujarati, Marathi, Bengali, Tamil, English, often mixed), with headings, serial numbers, ticks and crossings-out.

Return every person or family being invited, in the order they appear, as one guest each:
- name: exactly as written, in the script it was written in. Keep relations and titles that say who it is ("Sharma uncle", "Ramesh bhai", "Patel parivar", "& family"). Leave out serial numbers, ticks and bullet marks.
- phone: the digits exactly as written, with the country code only if one is written. Never guess, complete or correct a number. Write "?" for each digit you can't read and set unsurePhone. An empty string when no number is written.
- group: the heading or section the name sits under ("Mama paksh", "Office", "पड़ोसी"), or an empty string.
- people: how many people the invitation is for when the list says so ("(4)", "x4", "4 log"), otherwise 1.
- unsureName: true when any part of the name is hard to read.

Skip anything that is not an invited person: titles, dates, totals, page numbers, addresses on their own lines and names that are crossed out.

problem: "blurred" or "dark" when the photo is too blurred or too dark to read most of it, "cut" when the page is cut off and some names are missing (still return the ones you can read), "not-a-list" when there is no guest list at all, otherwise "none".`;

export function readingPrompt(options: { english: boolean; text?: string }): string {
  const script = options.english
    ? "Write every name in English letters, spelling it the way it sounds (don't translate it)."
    : "Keep every name in the script it was written in.";
  return options.text
    ? `${script}\n\nThe guest list:\n<list>\n${options.text}\n</list>`
    : `${script}\n\nRead the guest list in the attached page.`;
}

/** The AI's guests as import sources, cleaned and marked with their page. */
export function readingSources(reading: Reading, page: number): ImportSource[] {
  return reading.guests.flatMap((guest) => {
    const name = guest.name.replace(/\s+/g, " ").trim().slice(0, GUEST_RULES.name);
    const phone = guest.phone.trim();
    if (!name && !/\d/.test(phone)) return [];
    const unsure = [
      ...(guest.unsureName ? (["name"] as const) : []),
      ...(guest.unsurePhone || phone.includes("?") ? (["phone"] as const) : []),
    ];
    return [
      {
        name,
        phones: phone ? [phone] : [],
        group: guest.group.trim().slice(0, GUEST_RULES.group),
        partySize: Number.isFinite(guest.people) ? guest.people : 1,
        page,
        ...(unsure.length ? { unsure } : {}),
      },
    ];
  });
}

/* ---------- Limits ---------- */

/** One request reads one photo, or one file of at most this many pages. */
export const MAX_READ_PAGES = 10;
/** A photo the browser has shrunk is a few hundred KB; a PDF can be bigger. */
export const MAX_READ_BYTES = 4 * 1024 * 1024;
/** Text beyond this is read as more pages, so a long notes file counts fairly. */
export const TEXT_PAGE_CHARS = 6000;
export const MAX_READ_TEXT = TEXT_PAGE_CHARS * MAX_READ_PAGES;

/** How many pages a PDF has, from its page objects; at least 1. */
export function pdfPages(bytes: Uint8Array): number {
  const text = new TextDecoder("latin1").decode(bytes);
  return Math.max(1, (text.match(/\/Type\s*\/Page(?![s\w])/g) ?? []).length);
}

export const textPages = (text: string) => Math.max(1, Math.ceil(text.length / TEXT_PAGE_CHARS));

export type ReadResult =
  | { ok: true; problem: PageProblem; sources: ImportSource[]; left: number }
  | {
      ok: false;
      reason: "off" | "unsupported" | "used-up" | "too-big" | "not-found" | "failed";
      /** Pages the invite can still have read, when that's why. */
      left?: number;
    };
