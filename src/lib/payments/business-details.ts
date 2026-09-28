import { z } from "zod";

/*
 * The seller's details as the admin form and the server both check them. Kept apart from
 * business.ts, which only the server may load.
 */

export const GSTIN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

export const businessSchema = z.object({
  legalName: z.string().trim().min(1).max(100),
  address: z.string().trim().min(1).max(300),
  gstin: z
    .string()
    .trim()
    .toUpperCase()
    .refine((value) => value === "" || GSTIN.test(value)),
  email: z.union([z.literal(""), z.email().max(120)]),
  phone: z.string().trim().max(20),
});

export type Business = z.infer<typeof businessSchema>;

export const emptyBusiness: Business = {
  legalName: "",
  address: "",
  gstin: "",
  email: "",
  phone: "",
};

/** The state a GSTIN is registered in: its first two digits. */
export const gstinState = (gstin: string) => (GSTIN.test(gstin) ? gstin.slice(0, 2) : null);
