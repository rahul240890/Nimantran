import "server-only";
import type { Account } from "@/lib/auth/account";
import {
  GSTIN,
  businessSchema,
  emptyBusiness,
  gstinState,
  type Business,
} from "@/lib/payments/business-details";
import { authMode } from "@/lib/auth/mode";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseService } from "@/lib/supabase/service";

/*
 * The seller's details printed on every invoice (Admin, Business details): the legal name,
 * address and GSTIN. Kept in app_settings; admins write it, the server reads it for
 * invoices. Without a GSTIN the document is a receipt, not a tax invoice.
 */

export { GSTIN, businessSchema, emptyBusiness, gstinState, type Business };

const holder = globalThis as unknown as { __shubhPreviewBusiness?: { value: Business } };
const preview = (holder.__shubhPreviewBusiness ??= { value: emptyBusiness });
const isPreview = () => authMode() === "preview";

function parse(value: unknown): Business {
  const parsed = businessSchema.safeParse(value);
  return parsed.success ? parsed.data : emptyBusiness;
}

export async function getBusiness(): Promise<Business> {
  if (isPreview()) return preview.value;
  const service = supabaseService();
  if (!service) return emptyBusiness;
  const { data } = await service
    .from("app_settings")
    .select("value")
    .eq("key", "business")
    .maybeSingle();
  return parse(data?.value);
}

export async function saveBusiness(business: Business, admin: Account): Promise<boolean> {
  if (isPreview()) {
    preview.value = business;
    return true;
  }
  const supabase = await supabaseServer();
  if (!supabase) return false;
  const { error } = await supabase.from("app_settings").upsert({
    key: "business",
    value: business,
    updated_at: new Date().toISOString(),
    updated_by: admin.id,
  });
  return !error;
}
