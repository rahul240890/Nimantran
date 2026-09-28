import { Building2 } from "lucide-react";
import type { Metadata } from "next";
import { AdminHeading } from "@/components/admin/admin-shell";
import { BusinessForm } from "@/components/admin/business-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/admin/access";
import { getBusiness } from "@/lib/payments/business";

export const metadata: Metadata = { title: "Business details" };

/** Who sells the editions: printed on every invoice and receipt. */
export default async function BusinessPage() {
  await requireAdmin("/admin/business");
  const business = await getBusiness();
  const ready = Boolean(business.legalName && business.address);

  return (
    <>
      <AdminHeading
        eyebrow="Payments"
        title="Business details"
        intro="Printed at the top of every invoice. Invoice numbers run in order each financial year, such as SHUBH/2026-27/00001, and are given once a payment is confirmed."
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            <Building2 aria-hidden className="size-5 text-accent-text" />
            Seller
            {business.gstin ? (
              <Badge tone="success" dot>
                Tax invoices
              </Badge>
            ) : (
              <Badge tone={ready ? "neutral" : "warning"} dot>
                {ready ? "Receipts" : "Not set up"}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Prices already include 18% GST. On a tax invoice it is split into CGST 9% and SGST 9%.
          </CardDescription>
        </CardHeader>
        <CardBody>
          <BusinessForm initial={business} />
        </CardBody>
      </Card>
    </>
  );
}
