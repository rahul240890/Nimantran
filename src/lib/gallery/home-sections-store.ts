import "server-only";
import { unstable_cache } from "next/cache";
import type { Account } from "@/lib/auth/account";
import { authMode } from "@/lib/auth/mode";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseService } from "@/lib/supabase/service";
import { BESTSELLER_DAYS, DEFAULT_BESTSELLERS, bestsellerDesigns } from "./bestsellers";
import { allDesigns } from "./catalog";
import {
  DEFAULT_HOME_SECTIONS,
  SECTION_PICKS,
  parseHomeSections,
  type HomeSections,
} from "./home-sections";
import type { InviteDesign } from "./trending";

/*
 * The home page's sections as the admin set them, kept in app_settings under
 * "home_sections" (no table of their own), and the best sellers counted from paid orders
 * and live invitations. Both are read at most every half hour, and the sections straight
 * away when the admin saves them.
 */

export const HOME_SECTIONS_TAG = "home-sections";
export const BESTSELLERS_TAG = "bestsellers";

const KEY = "home_sections";
const holder = globalThis as unknown as { __shubhPreviewHomeSections?: { value: HomeSections } };
const preview = (holder.__shubhPreviewHomeSections ??= { value: DEFAULT_HOME_SECTIONS });
const isPreview = () => authMode() === "preview";

const storedSections = unstable_cache(
  async (): Promise<HomeSections> => {
    if (isPreview()) return preview.value;
    const service = supabaseService();
    if (!service) return DEFAULT_HOME_SECTIONS;
    const { data, error } = await service
      .from("app_settings")
      .select("value")
      .eq("key", KEY)
      .maybeSingle();
    if (error) throw error;
    return parseHomeSections(data?.value);
  },
  ["home-sections", "v1"],
  { tags: [HOME_SECTIONS_TAG], revalidate: 1800 },
);

/** The sections, in order, with what the admin chose; the defaults if the database is away. */
export async function getHomeSections(): Promise<HomeSections> {
  // In preview there is no database: the page reads the setting fresh, as tests change it
  if (isPreview()) return preview.value;
  return storedSections().catch(() => DEFAULT_HOME_SECTIONS);
}

/** Only an admin's connection can write settings (row level security checks is_admin). */
export async function saveHomeSections(input: unknown, admin: Account): Promise<boolean> {
  const value = parseHomeSections(input);
  if (isPreview()) {
    preview.value = value;
    return true;
  }
  const supabase = await supabaseServer();
  if (!supabase) return false;
  const { error } = await supabase.from("app_settings").upsert({
    key: KEY,
    value,
    updated_at: new Date().toISOString(),
    updated_by: admin.id,
  });
  return !error;
}

const storedBestsellers = unstable_cache(
  async (): Promise<string[]> => {
    const known = new Set(allDesigns().map((design) => design.id));
    const service = isPreview() ? null : supabaseService();
    if (!service) return bestsellerDesigns([], [], known);
    const since = new Date(Date.now() - BESTSELLER_DAYS * 24 * 60 * 60 * 1000).toISOString();
    const [orders, live] = await Promise.all([
      service
        .from("orders")
        .select("design_id")
        .eq("status", "paid")
        .gte("paid_at", since)
        .limit(5000),
      service
        .from("events")
        .select("template:template_id, suite:religious->>suite, format:religious->>format")
        .eq("status", "published")
        .gte("created_at", since)
        .limit(5000),
    ]);
    if (orders.error) throw orders.error;
    if (live.error) throw live.error;
    return bestsellerDesigns(
      (orders.data ?? []).map((order) => (order as { design_id: string | null }).design_id),
      (live.data ?? []) as InviteDesign[],
      known,
    );
  },
  ["bestsellers", "v1"],
  { tags: [BESTSELLERS_TAG], revalidate: 1800 },
);

/** The best-selling designs, in order; the starting list if the database is away. */
export async function getBestsellers(): Promise<string[]> {
  return storedBestsellers().catch(() => DEFAULT_BESTSELLERS.slice(0, SECTION_PICKS));
}
