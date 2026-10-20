import "server-only";
import { askJson, readsAttachment, type AiAttachment } from "@/lib/ai/ask";
import type { Account } from "@/lib/auth/account";
import { authMode } from "@/lib/auth/mode";
import { invitePlan } from "@/lib/payments/editions";
import { PLANS } from "@/lib/plans/catalog";
import { supabaseService } from "@/lib/supabase/service";
import { aiConfig } from "@/lib/wording/providers";
import {
  READING_SHAPE,
  READING_SYSTEM,
  readingPrompt,
  readingSchema,
  readingSources,
  type ReadResult,
} from "./read-list";

/*
 * Reading one page of a guest list with AI, for one invite. Pages count against the
 * invite's package (one free page on every package, 30 on Grand), counted in the database before the model is asked, so a slow answer
 * can't be asked for twice for free. The photo or file is read and then dropped: nothing
 * of it is stored, only the guests the host adds.
 */

// Preview mode (tests, local runs without a database) counts in memory
const holder = globalThis as unknown as { __shubhListPages?: Map<string, number> };
const previewCounts = (holder.__shubhListPages ??= new Map());

/** Takes `pages` for the invite within `allowed`; the number used after, or null. */
async function takePages(eventId: string, pages: number, allowed: number): Promise<number | null> {
  if (authMode() === "preview") {
    const used = previewCounts.get(eventId) ?? 0;
    if (used + pages > allowed) return null;
    previewCounts.set(eventId, used + pages);
    return used + pages;
  }
  const supabase = supabaseService();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("use_list_pages", {
    target: eventId,
    pages,
    allowed,
  });
  if (error) throw error;
  return typeof data === "number" ? data : null;
}

/**
 * Pages the invite may have read in all, from the package it has paid for (or an admin
 * gave). Unlike the other package features this stays limited while checkout is off,
 * because every page is a paid AI call (owner, 2026-10-19).
 */
async function allowedPages(account: Account, eventId: string): Promise<number | null> {
  const edition = await invitePlan(account, eventId);
  return edition ? PLANS[edition.plan].listPages : null;
}

/** Whether reading lists is set up at all, and what it reads. */
export function listReading(): { photos: boolean; pdf: boolean } | null {
  const config = aiConfig();
  if (!config || !readsAttachment(config, "image")) return null;
  return { photos: true, pdf: readsAttachment(config, "pdf") };
}

export async function readGuestPage(
  account: Account,
  eventId: string,
  input: {
    attachment?: AiAttachment;
    text?: string;
    pages: number;
    english: boolean;
    page: number;
  },
): Promise<ReadResult> {
  const config = aiConfig();
  if (!config) return { ok: false, reason: "off" };
  if (input.attachment && !readsAttachment(config, input.attachment.kind)) {
    return { ok: false, reason: "unsupported" };
  }
  const allowed = await allowedPages(account, eventId);
  if (allowed === null) return { ok: false, reason: "not-found" };
  const used = await takePages(eventId, input.pages, allowed).catch(() => null);
  if (used === null)
    return { ok: false, reason: "used-up", left: await pagesLeft(eventId, allowed) };

  const reading = await askJson(config, {
    system: READING_SYSTEM,
    prompt: readingPrompt({ english: input.english, text: input.text }),
    schema: readingSchema,
    shape: READING_SHAPE,
    // Handwriting rewards a closer look than writing wording does
    effort: "medium",
    attachments: input.attachment ? [input.attachment] : [],
  }).catch((error: unknown) => {
    console.error("[server-error] AI: reading a guest list failed", error);
    return null;
  });
  if (!reading) {
    await givePagesBack(eventId, input.pages).catch(() => {});
    return { ok: false, reason: "failed" };
  }
  return {
    ok: true,
    problem: reading.problem,
    sources: readingSources(reading, input.page),
    left: Math.max(0, allowed - used),
  };
}

/** A page the AI couldn't read doesn't count. */
async function givePagesBack(eventId: string, pages: number) {
  if (authMode() === "preview") {
    previewCounts.set(eventId, Math.max(0, (previewCounts.get(eventId) ?? 0) - pages));
    return;
  }
  const supabase = supabaseService();
  const { data } = (await supabase
    ?.from("list_readings")
    .select("used")
    .eq("event_id", eventId)
    .maybeSingle()) ?? { data: null };
  const used = (data as { used?: number } | null)?.used;
  if (supabase && typeof used === "number") {
    await supabase
      .from("list_readings")
      .update({ used: Math.max(0, used - pages) })
      .eq("event_id", eventId);
  }
}

async function pagesLeft(eventId: string, allowed: number): Promise<number> {
  if (authMode() === "preview") return Math.max(0, allowed - (previewCounts.get(eventId) ?? 0));
  const { data } = (await supabaseService()
    ?.from("list_readings")
    .select("used")
    .eq("event_id", eventId)
    .maybeSingle()) ?? { data: null };
  return Math.max(0, allowed - ((data as { used?: number } | null)?.used ?? 0));
}

/** What the importer shows before anything is read: pages left, and the package's total. */
export async function listPagesLeft(
  account: Account,
  eventId: string,
): Promise<{ left: number; allowed: number } | null> {
  const allowed = await allowedPages(account, eventId);
  if (allowed === null) return null;
  return { left: await pagesLeft(eventId, allowed).catch(() => allowed), allowed };
}
