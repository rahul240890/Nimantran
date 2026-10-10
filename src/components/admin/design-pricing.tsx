"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveDesignPricing } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { planCopy } from "@/content/editions";
import type { Covers } from "@/components/gallery/shelf-row";
import { PAID_PLAN_IDS, formatRupees, packagePrice } from "@/lib/plans/catalog";
import {
  DESIGN_TIERS,
  pricesInOrder,
  type DesignTier,
  type Pricing,
} from "@/lib/plans/design-tiers";
import { DesignTierList, TIER_NAMES, type DesignRow } from "./design-tier-list";

export type { DesignRow } from "./design-tier-list";

type Amounts = Pick<Pricing, "designs" | "packages" | "invites">;

/** The seven numbers above the designs: three design prices, two package add-ons, two invite counts. */
const FIELDS = [
  { id: "premium", label: "Premium design (₹)", rupees: true },
  { id: "royal", label: "Royal design (₹)", rupees: true },
  { id: "signature", label: "Signature design (₹)", rupees: true },
  { id: "celebration", label: "Celebration adds (₹)", rupees: true },
  { id: "grand", label: "Grand adds (₹)", rupees: true },
  { id: "basicInvites", label: "Invites in Basic and free designs", rupees: false },
  { id: "celebrationInvites", label: "Invites in Celebration", rupees: false },
] as const;
type FieldId = (typeof FIELDS)[number]["id"];

const fieldValues = (amounts: Amounts): Record<FieldId, number> => ({
  premium: amounts.designs.premium / 100,
  royal: amounts.designs.royal / 100,
  signature: amounts.designs.signature / 100,
  celebration: amounts.packages.celebration / 100,
  grand: amounts.packages.grand / 100,
  basicInvites: amounts.invites.basic,
  celebrationInvites: amounts.invites.celebration,
});

/** Package prices, invite counts and every design's tier, saved together. */
export function DesignPricingForm({
  rows,
  amounts,
  covers,
}: {
  rows: DesignRow[];
  amounts: Amounts;
  /** The 3D cards' covers, drawn on the server. */
  covers: Covers;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const saved = fieldValues(amounts);
  const [typed, setTyped] = useState<Record<FieldId, string>>(
    () =>
      Object.fromEntries(FIELDS.map(({ id }) => [id, String(saved[id])])) as Record<
        FieldId,
        string
      >,
  );
  const [tiers, setTiers] = useState<Record<string, DesignTier>>(() =>
    Object.fromEntries(rows.map((row) => [row.id, row.tier])),
  );
  const [tried, setTried] = useState(false);

  // Whole numbers from 1 to 1,00,000
  const numbers = Object.fromEntries(
    FIELDS.map(({ id }) => {
      const value = typed[id].trim();
      const number = /^\d{1,6}$/.test(value) ? Number(value) : NaN;
      return [id, number >= 1 && number <= 100_000 ? number : NaN];
    }),
  ) as Record<FieldId, number>;
  const fieldError = (id: FieldId) =>
    Number.isNaN(numbers[id]) ? "Enter a whole number, from 1 to 1,00,000." : undefined;
  const pricesValid = FIELDS.every(({ id }) => !fieldError(id));
  const next: Amounts = {
    designs: {
      premium: numbers.premium * 100,
      royal: numbers.royal * 100,
      signature: numbers.signature * 100,
    },
    packages: { celebration: numbers.celebration * 100, grand: numbers.grand * 100 },
    invites: { basic: numbers.basicInvites, celebration: numbers.celebrationInvites },
  };
  const ordered = pricesValid && pricesInOrder(next);

  const changed =
    rows.filter((row) => tiers[row.id] !== row.tier).length +
    FIELDS.filter(({ id }) => numbers[id] !== saved[id]).length;

  const save = () => {
    setTried(true);
    if (!pricesValid || !ordered) {
      toast({ title: "Check the prices and invites first.", tone: "error" });
      return;
    }
    startTransition(async () => {
      // Only the designs changed here, so another admin's changes stay as they are
      const changes = Object.fromEntries(
        rows.filter((row) => tiers[row.id] !== row.tier).map((row) => [row.id, tiers[row.id]]),
      );
      const result = await saveDesignPricing({ ...next, tiers: changes }).catch(() => null);
      if (result === "saved") {
        toast({
          title: "Designs and prices saved",
          description: "The site shows them within a minute.",
          tone: "success",
        });
        router.refresh();
      } else {
        toast({
          title:
            result === "out-of-order"
              ? "Royal must cost more than Premium, Signature at least as much as Royal, Grand add more than Celebration, and Celebration allow more invites than Basic."
              : result === "invalid"
                ? "Check the prices and try again."
                : "Couldn't save. Try again.",
          tone: "error",
        });
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      <Card>
        <CardHeader>
          <CardTitle>Packages</CardTitle>
          <CardDescription>
            Every invite chooses one of three packages. Basic is the design&apos;s own price (free
            designs are free, with a small &ldquo;Made with Shubh&rdquo; in the corner). Celebration
            and Grand add a fixed amount on top. Prices include GST; hosts who move up pay only the
            difference.
          </CardDescription>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {FIELDS.map(({ id, label, rupees }) => (
              <Field
                key={id}
                label={label}
                error={tried ? fieldError(id) : undefined}
                hint={
                  numbers[id] !== saved[id] && !fieldError(id)
                    ? `Now ${rupees ? formatRupees(saved[id] * 100) : saved[id]}`
                    : undefined
                }
                required
              >
                <Input
                  inputMode="numeric"
                  value={typed[id]}
                  maxLength={6}
                  onChange={(event) =>
                    setTyped((current) => ({
                      ...current,
                      [id]: event.target.value.replace(/[^\d]/g, ""),
                    }))
                  }
                  className="tabular-nums"
                />
              </Field>
            ))}
          </div>
          {pricesValid && !ordered && (
            <p role="alert" className="text-sm font-semibold text-danger">
              Royal must cost more than Premium, Signature at least as much as Royal, Grand must add
              more than Celebration, and Celebration must allow more invites than Basic.
            </p>
          )}
          {ordered && (
            <ul className="flex flex-col gap-1 text-sm text-ink-muted">
              {DESIGN_TIERS.map((tier) => (
                <li key={tier}>
                  <span className="font-semibold text-ink">{TIER_NAMES[tier]} design:</span>{" "}
                  {PAID_PLAN_IDS.map((plan) => {
                    const paise = packagePrice(plan, tier, next);
                    return `${planCopy[plan].name} ${paise ? formatRupees(paise) : "free"}`;
                  }).join(" · ")}
                </li>
              ))}
              <li>Grand has no limit on invites.</li>
            </ul>
          )}
        </CardBody>
      </Card>

      <DesignTierList
        rows={rows}
        tiers={tiers}
        onTiersChange={setTiers}
        designPrices={ordered ? next.designs : amounts.designs}
        covers={covers}
      />

      {/* Always in reach, however far down the list the admin has scrolled */}
      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur-sm sm:mx-0 sm:rounded-lg sm:border">
        <p aria-live="polite" className="text-sm text-ink-muted">
          {changed === 0
            ? "Everything is saved."
            : changed === 1
              ? "1 change not saved yet."
              : `${changed} changes not saved yet.`}
        </p>
        <Button onClick={save} loading={pending} disabled={changed === 0}>
          <Save aria-hidden />
          Save
        </Button>
      </div>
    </div>
  );
}
