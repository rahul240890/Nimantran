import { z } from "zod";
import { SLOT_RULES, type SlotId } from "./ids";
import { slotsOf } from "./content";
import type { Template } from "./schema";

/**
 * Validates a host's wording for one template: only its slots, trimmed, within each
 * slot's length, and the names, date and venue filled in. Messages are keys for the UI.
 */
export function contentSchema(template: Template) {
  const shape: Partial<Record<SlotId, z.ZodType<string | undefined>>> = {};
  for (const id of slotsOf(template)) {
    const rule = SLOT_RULES[id];
    const base = z.string().trim().max(rule.maxLength, { message: "too-long" });
    shape[id] = rule.required ? base.min(1, { message: "required" }) : base.optional();
  }
  return z.object(shape as Record<SlotId, z.ZodType<string | undefined>>);
}
