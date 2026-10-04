"use client";

import {
  Crown,
  Gift,
  Image as ImageIcon,
  Layers,
  Rotate3d,
  Save,
  Search,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { saveDesignPricing } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { planCopy } from "@/content/editions";
import { PAID_PLAN_IDS, formatRupees, type PaidPlanId } from "@/lib/plans/catalog";
import {
  DESIGN_TIERS,
  isDesignTier,
  pricesInOrder,
  type DesignTier,
  type PlanPrices,
} from "@/lib/plans/design-tiers";

export type DesignRow = {
  id: string;
  name: string;
  kind: "scene" | "story" | "card";
  /** A small picture of the design; none for the 3D cards. */
  image: string | null;
  tier: DesignTier;
  defaultTier: DesignTier;
};

const KIND_NAMES: Record<DesignRow["kind"], string> = {
  scene: "Scene",
  story: "Story",
  card: "3D card",
};
const KIND_ICONS = { scene: ImageIcon, story: Layers, card: Rotate3d };
const TIER_NAMES: Record<DesignTier, string> = { free: "Free", premium: "Premium", royal: "Royal" };
const TIER_ICONS = { free: Gift, premium: Sparkles, royal: Crown };

const toRupees = (paise: number) => String(paise / 100);

/** Edition prices and every design's tier, saved together. */
export function DesignPricingForm({ rows, prices }: { rows: DesignRow[]; prices: PlanPrices }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [rupees, setRupees] = useState<Record<PaidPlanId, string>>({
    premium: toRupees(prices.premium),
    royal: toRupees(prices.royal),
    bundle: toRupees(prices.bundle),
  });
  const [tiers, setTiers] = useState<Record<string, DesignTier>>(() =>
    Object.fromEntries(rows.map((row) => [row.id, row.tier])),
  );
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<"all" | DesignRow["kind"]>("all");
  const [tierFilter, setTierFilter] = useState<"all" | DesignTier>("all");
  const [bulk, setBulk] = useState<DesignTier>("premium");
  const [tried, setTried] = useState(false);

  // Whole rupees from ₹1 to ₹1,00,000
  const paise = Object.fromEntries(
    PAID_PLAN_IDS.map((id) => {
      const value = rupees[id].trim();
      const number = /^\d{1,6}$/.test(value) ? Number(value) : NaN;
      return [id, number >= 1 && number <= 100_000 ? number * 100 : NaN];
    }),
  ) as PlanPrices;
  const priceError = (id: PaidPlanId) =>
    Number.isNaN(paise[id]) ? "Enter whole rupees, from 1 to 1,00,000." : undefined;
  const pricesValid = PAID_PLAN_IDS.every((id) => !priceError(id));
  const ordered = pricesValid && pricesInOrder(paise);

  const shown = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return rows.filter(
      (row) =>
        (kind === "all" || row.kind === kind) &&
        (tierFilter === "all" || tiers[row.id] === tierFilter) &&
        words.every((word) => `${row.name} ${row.id}`.toLowerCase().includes(word)),
    );
  }, [rows, query, kind, tierFilter, tiers]);

  const counts = DESIGN_TIERS.map(
    (tier) => [tier, rows.filter((row) => tiers[row.id] === tier).length] as const,
  );
  const changed =
    rows.filter((row) => tiers[row.id] !== row.tier).length +
    PAID_PLAN_IDS.filter((id) => paise[id] !== prices[id]).length;

  const save = () => {
    setTried(true);
    if (!pricesValid || !ordered) {
      toast({ title: "Check the edition prices first.", tone: "error" });
      return;
    }
    startTransition(async () => {
      // Only the designs changed here, so another admin's changes stay as they are
      const changes = Object.fromEntries(
        rows.filter((row) => tiers[row.id] !== row.tier).map((row) => [row.id, tiers[row.id]]),
      );
      const result = await saveDesignPricing({ prices: paise, tiers: changes }).catch(() => null);
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
              ? "Each edition must cost more than the one before it."
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
          <CardTitle>Edition prices</CardTitle>
          <CardDescription>
            What each edition costs for one invite, GST included. A Premium design shows the Premium
            price on its tile, and a Royal design the Royal price. Hosts who upgrade pay only the
            difference.
          </CardDescription>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {PAID_PLAN_IDS.map((id) => (
              <Field
                key={id}
                label={`${planCopy[id].name} (₹)`}
                error={tried ? priceError(id) : undefined}
                hint={
                  paise[id] !== prices[id] && !priceError(id)
                    ? `Now ${formatRupees(prices[id])}`
                    : undefined
                }
                required
              >
                <Input
                  inputMode="numeric"
                  value={rupees[id]}
                  maxLength={6}
                  onChange={(event) =>
                    setRupees((current) => ({
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
              Each edition must cost more than the one before it: Premium, then Royal, then the
              Wedding bundle.
            </p>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            Designs
            {counts.map(([tier, count]) => (
              <Badge key={tier} tone={tier === "free" ? "success" : "gold"}>
                {count} {TIER_NAMES[tier]}
              </Badge>
            ))}
          </CardTitle>
          <CardDescription>
            New designs start as Premium Scenes or Stories and free 3D cards until you change them.
            The grandest wedding Stories, which open with a painted god, start as Royal.
          </CardDescription>
        </CardHeader>
        <CardBody className="flex flex-col gap-5">
          <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr]">
            <Field label="Search designs">
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Kayal, birthday, scene…"
                leading={<Search />}
              />
            </Field>
            <Field label="Kind">
              <Select
                value={kind}
                onValueChange={(value) => setKind(value as typeof kind)}
                options={[
                  { value: "all", label: "Every kind" },
                  { value: "scene", label: "Scene" },
                  { value: "story", label: "Story" },
                  { value: "card", label: "3D card" },
                ]}
              />
            </Field>
            <Field label="Tier">
              <Select
                value={tierFilter}
                onValueChange={(value) => setTierFilter(value as typeof tierFilter)}
                options={[
                  { value: "all", label: "Every tier" },
                  ...DESIGN_TIERS.map((tier) => ({ value: tier, label: TIER_NAMES[tier] })),
                ]}
              />
            </Field>
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-line bg-surface-2 p-4 sm:flex-row sm:items-end">
            <Field label={`Set the ${shown.length} designs shown to`} className="sm:w-56">
              <Select
                value={bulk}
                onValueChange={(value) => isDesignTier(value) && setBulk(value)}
                options={DESIGN_TIERS.map((tier) => ({ value: tier, label: TIER_NAMES[tier] }))}
              />
            </Field>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                disabled={shown.length === 0}
                onClick={() =>
                  setTiers((current) => ({
                    ...current,
                    ...Object.fromEntries(shown.map((row) => [row.id, bulk])),
                  }))
                }
              >
                Apply
              </Button>
              <Button
                variant="ghost"
                disabled={shown.length === 0}
                onClick={() =>
                  setTiers((current) => ({
                    ...current,
                    ...Object.fromEntries(shown.map((row) => [row.id, row.defaultTier])),
                  }))
                }
              >
                Back to defaults
              </Button>
            </div>
          </div>

          {shown.length === 0 ? (
            <p className="py-6 text-center text-ink-muted">No design matches. Try another word.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {shown.map((row) => {
                const KindIcon = KIND_ICONS[row.kind];
                const tier = tiers[row.id] ?? row.tier;
                return (
                  <li
                    key={row.id}
                    data-design-row={row.id}
                    className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="relative grid h-14 w-10 shrink-0 place-items-center overflow-hidden rounded-sm bg-surface-2 text-ink-muted">
                        {row.image ? (
                          <Image
                            src={row.image}
                            alt=""
                            fill
                            sizes="2.5rem"
                            className="object-cover"
                          />
                        ) : (
                          <Rotate3d aria-hidden className="size-5" />
                        )}
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate font-semibold">{row.name}</span>
                        <span className="flex flex-wrap items-center gap-x-2 text-sm text-ink-muted">
                          <span className="inline-flex items-center gap-1">
                            <KindIcon aria-hidden className="size-3.5" />
                            {KIND_NAMES[row.kind]}
                          </span>
                          {tier !== row.defaultTier && (
                            <span>Default {TIER_NAMES[row.defaultTier]}</span>
                          )}
                          {tier !== row.tier && (
                            <span className="font-semibold text-accent-text">Not saved</span>
                          )}
                        </span>
                      </span>
                    </div>
                    <RadioGroup
                      label={`${row.name} (${KIND_NAMES[row.kind]}) tier`}
                      variant="segment"
                      value={tier}
                      onValueChange={(value) =>
                        isDesignTier(value) &&
                        setTiers((current) => ({ ...current, [row.id]: value }))
                      }
                      className="w-full shrink-0 sm:w-80"
                    >
                      {DESIGN_TIERS.map((option) => {
                        const Icon = TIER_ICONS[option];
                        return (
                          <RadioItem
                            key={option}
                            value={option}
                            label={TIER_NAMES[option]}
                            icon={<Icon />}
                          />
                        );
                      })}
                    </RadioGroup>
                  </li>
                );
              })}
            </ul>
          )}
        </CardBody>
      </Card>

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
