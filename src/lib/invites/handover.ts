import "server-only";
import { randomBytes } from "node:crypto";
import type { Account } from "@/lib/auth/account";
import { authMode } from "@/lib/auth/mode";
import { isCategoryId, type CategoryId } from "@/lib/categories/catalog";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseService } from "@/lib/supabase/service";
import { isSuiteId, suiteFor, type SuiteId } from "@/lib/suites/catalog";
import { isTemplateId, type TemplateId } from "@/lib/templates/ids";
import { isTraditionId } from "@/lib/traditions/catalog";
import { previewDb } from "./preview-db";

/*
 * Hand-over links (update 5; owner, 2026-10-24: "we'll make it for you"). Shubh makes an
 * invitation for a family in its own account, then sends them a link (/claim/<token>);
 * whoever opens it and signs in becomes the invite's owner, so they pay for it, send it and
 * keep the guest list and replies, and the maker leaves it. Links are made from Admin,
 * Hand over, only for the admin's own invites; one is open per invite, used once, and
 * stops working after 30 days. The database side is migration 20261024120000_handovers.sql.
 */

/** How long an unused link works. */
export const HANDOVER_DAYS = 30;

/** A link's token: 48 hex characters, as the database makes them. */
export const HANDOVER_TOKEN = /^[0-9a-f]{32,64}$/;

export type HandoverLink = { eventId: string; token: string; expiresAt: string };

export type HandoverPreview = {
  eventId: string;
  categoryId: CategoryId;
  templateId: TemplateId;
  /** The painted design it shows, as My invites shows it. */
  theme: SuiteId;
  content: Record<string, string>;
  status: string;
};

/** A link's preview from the invite's stored columns. */
function previewOf(row: {
  event_id: string;
  category_id: string;
  template_id: string;
  tradition_id?: string | null;
  suite?: unknown;
  content: Record<string, string> | null;
  status: string;
}): HandoverPreview {
  const categoryId = isCategoryId(row.category_id) ? row.category_id : "wedding";
  const templateId = isTemplateId(row.template_id) ? row.template_id : "marigold";
  return {
    eventId: row.event_id,
    categoryId,
    templateId,
    theme: suiteFor({
      suite: isSuiteId(row.suite) ? row.suite : null,
      tradition: isTraditionId(row.tradition_id) ? row.tradition_id : null,
      templateId,
      category: categoryId,
    }),
    content: row.content ?? {},
    status: row.status,
  };
}

export type ClaimResult =
  { ok: true; id: string } | { ok: false; reason: "used" | "own" | "failed" | "setup" };

export type HandoverStore = {
  /** The open link for each of these invites, by invite. */
  open(eventIds: readonly string[]): Promise<Map<string, HandoverLink>>;
  /** A new link for one of the admin's own invites; any older open one stops working. */
  create(admin: Account, eventId: string): Promise<HandoverLink | null>;
  /** Stops an invite's open link working. */
  withdraw(admin: Account, eventId: string): Promise<boolean>;
  /** What a link shows before it is taken, or null for a used, expired or unknown one. */
  preview(token: string): Promise<HandoverPreview | null>;
  /** Moves the invite to the signed-in person. */
  claim(account: Account, token: string): Promise<ClaimResult>;
};

const supabaseStore: HandoverStore = {
  async open(eventIds) {
    const links = new Map<string, HandoverLink>();
    const service = supabaseService();
    if (!service || eventIds.length === 0) return links;
    const { data } = await service
      .from("event_handovers")
      .select("event_id, token, expires_at")
      .in("event_id", eventIds)
      .is("claimed_at", null)
      .gt("expires_at", new Date().toISOString());
    for (const row of (data ?? []) as { event_id: string; token: string; expires_at: string }[]) {
      links.set(row.event_id, {
        eventId: row.event_id,
        token: row.token,
        expiresAt: row.expires_at,
      });
    }
    return links;
  },

  async create(admin, eventId) {
    const service = supabaseService();
    if (!service) return null;
    // Only an invite the admin made, never someone else's
    const { data: event } = await service
      .from("events")
      .select("owner_id")
      .eq("id", eventId)
      .maybeSingle();
    if (!event || (event as { owner_id: string }).owner_id !== admin.id) return null;
    await service.from("event_handovers").delete().eq("event_id", eventId).is("claimed_at", null);
    const { data, error } = await service
      .from("event_handovers")
      .insert({ event_id: eventId, created_by: admin.id })
      .select("token, expires_at")
      .single();
    if (error || !data) return null;
    const row = data as { token: string; expires_at: string };
    return { eventId, token: row.token, expiresAt: row.expires_at };
  },

  async withdraw(admin, eventId) {
    const service = supabaseService();
    if (!service) return false;
    const { error } = await service
      .from("event_handovers")
      .delete()
      .eq("event_id", eventId)
      .eq("created_by", admin.id)
      .is("claimed_at", null);
    return !error;
  },

  async preview(token) {
    const supabase = await supabaseServer();
    if (!supabase) return null;
    const { data, error } = await supabase.rpc("handover_preview", { p_token: token });
    const row = (Array.isArray(data) ? data[0] : data) as
      Parameters<typeof previewOf>[0] | undefined;
    if (error || !row) return null;
    return previewOf(row);
  },

  async claim(_account, token) {
    const supabase = await supabaseServer();
    if (!supabase) return { ok: false, reason: "failed" };
    const { data, error } = await supabase.rpc("claim_handover", { p_token: token });
    if (error?.code === "P0002") return { ok: false, reason: "used" };
    if (error?.code === "SH001") return { ok: false, reason: "own" };
    // The function isn't there yet: the migration hasn't been run
    if (error?.code === "PGRST202" || error?.code === "42883")
      return { ok: false, reason: "setup" };
    if (error || typeof data !== "string") return { ok: false, reason: "failed" };
    return { ok: true, id: data };
  },
};

/* ---------- Preview mode ---------- */

type PreviewHandover = HandoverLink & { createdBy: string };

const holder = globalThis as unknown as { __shubhdwarHandovers?: PreviewHandover[] };
const previewLinks = (): PreviewHandover[] => (holder.__shubhdwarHandovers ??= []);

const live = (link: PreviewHandover) => new Date(link.expiresAt).getTime() > Date.now();

const previewStore: HandoverStore = {
  async open(eventIds) {
    const links = new Map<string, HandoverLink>();
    for (const link of previewLinks()) {
      if (eventIds.includes(link.eventId) && live(link)) {
        links.set(link.eventId, {
          eventId: link.eventId,
          token: link.token,
          expiresAt: link.expiresAt,
        });
      }
    }
    return links;
  },

  async create(admin, eventId) {
    const stored = previewDb.invites.get(eventId);
    if (!stored || stored.owner !== admin.id) return null;
    holder.__shubhdwarHandovers = previewLinks().filter((link) => link.eventId !== eventId);
    const link: PreviewHandover = {
      eventId,
      token: randomBytes(24).toString("hex"),
      expiresAt: new Date(Date.now() + HANDOVER_DAYS * 86_400_000).toISOString(),
      createdBy: admin.id,
    };
    previewLinks().push(link);
    return { eventId, token: link.token, expiresAt: link.expiresAt };
  },

  async withdraw(admin, eventId) {
    holder.__shubhdwarHandovers = previewLinks().filter(
      (link) => !(link.eventId === eventId && link.createdBy === admin.id),
    );
    return true;
  },

  async preview(token) {
    const link = previewLinks().find((item) => item.token === token && live(item));
    const stored = link && previewDb.invites.get(link.eventId);
    if (!stored) return null;
    return previewOf({
      ...stored.event,
      event_id: stored.event.id,
      suite: stored.event.religious?.suite,
    });
  },

  async claim(account, token) {
    const link = previewLinks().find((item) => item.token === token && live(item));
    const stored = link && previewDb.invites.get(link.eventId);
    if (!link || !stored) return { ok: false, reason: "used" };
    if (stored.owner === account.id) return { ok: false, reason: "own" };
    const previous = stored.owner;
    stored.owner = account.id;
    stored.hosts = [
      {
        userId: account.id,
        name: account.name,
        role: "owner",
        side: "",
        createdAt: new Date().toISOString(),
      },
      ...(stored.hosts ?? []).filter(
        (host) => host.userId !== previous && host.userId !== account.id,
      ),
    ];
    holder.__shubhdwarHandovers = previewLinks().filter((item) => item.eventId !== link.eventId);
    return { ok: true, id: stored.event.id };
  },
};

/** Hand-over links for the current sign-in service, or null when accounts are off. */
export function handoverStore(): HandoverStore | null {
  const mode = authMode();
  if (mode === "supabase") return supabaseStore;
  if (mode === "preview") return previewStore;
  return null;
}
