import "server-only";
import { unstable_cache } from "next/cache";
import type { Account } from "@/lib/auth/account";
import { authMode } from "@/lib/auth/mode";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseService } from "@/lib/supabase/service";
import { DEFAULT_PRICING, parsePricing, type Pricing } from "./design-tiers";

/*
 * The admin's design tiers and edition prices (Admin, Designs), kept in app_settings under
 * "pricing". Every page shows them and checkout charges by them, so they are cached and
 * the cache is cleared when the admin saves.
 */

export const PRICING_TAG = "pricing";

const holder = globalThis as unknown as { __shubhPreviewPricing?: { value: Pricing } };
const preview = (holder.__shubhPreviewPricing ??= { value: DEFAULT_PRICING });
const isPreview = () => authMode() === "preview";

const stored = unstable_cache(
  async (): Promise<Pricing> => {
    // Preview mode keeps its settings in memory, but goes through the same cache and tag
    if (isPreview()) return preview.value;
    const service = supabaseService();
    if (!service) return DEFAULT_PRICING;
    const { data, error } = await service
      .from("app_settings")
      .select("value")
      .eq("key", "pricing")
      .maybeSingle();
    if (error) throw error;
    return parsePricing(data?.value);
  },
  ["pricing"],
  { tags: [PRICING_TAG], revalidate: 3600 },
);

export async function getPricing(): Promise<Pricing> {
  // A database hiccup never takes the site down: the defaults apply until it answers
  return stored().catch(() => DEFAULT_PRICING);
}

/** Only an admin's connection can write settings (row level security checks is_admin). */
export async function savePricing(pricing: Pricing, admin: Account): Promise<boolean> {
  if (isPreview()) {
    preview.value = pricing;
    return true;
  }
  const supabase = await supabaseServer();
  if (!supabase) return false;
  const { error } = await supabase.from("app_settings").upsert({
    key: "pricing",
    value: pricing,
    updated_at: new Date().toISOString(),
    updated_by: admin.id,
  });
  return !error;
}
