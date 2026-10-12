import "server-only";
import { unstable_cache } from "next/cache";
import type { Account } from "@/lib/auth/account";
import { authMode } from "@/lib/auth/mode";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseService } from "@/lib/supabase/service";
import {
  DEFAULT_TRENDING,
  NO_TRENDING_SETTINGS,
  TRENDING_DAYS,
  parseTrendingSettings,
  trendingDesigns,
  type InviteDesign,
  type TrendingSettings,
} from "./trending";

/*
 * The trending designs: the admin's picks, kept in app_settings under "trending", and the
 * designs of invitations started in the last month. Counted at most every half hour, and
 * straight away when the admin saves their picks.
 */

export const TRENDING_TAG = "trending";

const holder = globalThis as unknown as { __shubhPreviewTrending?: { value: TrendingSettings } };
const preview = (holder.__shubhPreviewTrending ??= { value: NO_TRENDING_SETTINGS });
const isPreview = () => authMode() === "preview";

async function settings(): Promise<TrendingSettings> {
  if (isPreview()) return preview.value;
  const service = supabaseService();
  if (!service) return NO_TRENDING_SETTINGS;
  const { data, error } = await service
    .from("app_settings")
    .select("value")
    .eq("key", "trending")
    .maybeSingle();
  if (error) throw error;
  return parseTrendingSettings(data?.value);
}

async function recentInvites(): Promise<InviteDesign[]> {
  const service = isPreview() ? null : supabaseService();
  if (!service) return [];
  const since = new Date(Date.now() - TRENDING_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await service
    .from("events")
    .select("template:template_id, suite:religious->>suite, format:religious->>format")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(5000);
  if (error) throw error;
  return (data ?? []) as InviteDesign[];
}

const stored = unstable_cache(
  async () => {
    const [{ pinned }, invites] = await Promise.all([settings(), recentInvites()]);
    return { pinned, trending: trendingDesigns(pinned, invites) };
  },
  ["trending", "v1"],
  { tags: [TRENDING_TAG], revalidate: 1800 },
);

/** The admin's picks and every trending design, in order. */
export async function getTrending(): Promise<{ pinned: string[]; trending: string[] }> {
  // A database hiccup never takes the row away: the starting list shows until it answers
  return stored().catch(() => ({ pinned: [], trending: [...DEFAULT_TRENDING] }));
}

/** Only an admin's connection can write settings (row level security checks is_admin). */
export async function saveTrendingPins(pinned: string[], admin: Account): Promise<boolean> {
  const value = parseTrendingSettings({ pinned });
  if (isPreview()) {
    preview.value = value;
    return true;
  }
  const supabase = await supabaseServer();
  if (!supabase) return false;
  const { error } = await supabase.from("app_settings").upsert({
    key: "trending",
    value,
    updated_at: new Date().toISOString(),
    updated_by: admin.id,
  });
  return !error;
}
