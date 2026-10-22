"use client";

import { format } from "date-fns";
import { Pencil, Search, TicketPercent, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { addCoupon, editCoupon, switchCoupon, type CouponInput } from "@/actions/admin";
import { planCopy } from "@/content/editions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { CharacterCount, Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { PAID_PLAN_IDS, type PaidPlanId } from "@/lib/plans/catalog";
import { DESIGN_TIERS, type DesignTier } from "@/lib/plans/design-tiers";
import {
  OFFER_ARTS,
  cleanCouponCode,
  offerArtImage,
  type Audience,
  type Coupon,
  type OfferArt,
} from "@/lib/plans/offers";
import { AUDIENCE_NAMES } from "./audience-names";

const FIELD_ERRORS: Record<string, string> = {
  code: "Use 3 to 20 letters and numbers.",
  label: "An offer on the offers page needs a title.",
  value: "Percent off is 1 to 100; an amount is in rupees. 100% off makes the package free.",
  endsOn: "The last day can't be before the first.",
  maxUses: "Leave empty for no limit, or a whole number.",
  perUserLimit: "Leave empty for no limit, or a whole number.",
  designIds: "One of the designs no longer exists. Take it off and save again.",
};

const ART_NAMES: Record<OfferArt, string> = {
  festival: "Festival lamps",
  wedding: "Wedding",
  engagement: "Engagement",
  haldi: "Haldi",
  mehendi: "Mehendi",
  sangeet: "Sangeet",
  anniversary: "Anniversary",
  birthday: "Birthday",
  baby: "Baby",
  housewarming: "Housewarming",
  party: "Party",
  business: "Business",
};

const TIER_NAMES: Record<DesignTier, string> = {
  free: "Free",
  premium: "Premium",
  royal: "Royal",
  signature: "Signature",
};

/** A design the admin can keep an offer to. */
export type DesignOption = { id: string; name: string; kind: string };

const day = (date: Date | undefined) => (date ? format(date, "yyyy-MM-dd") : "");

/** The admin's day in India for a saved start or end, for the date pickers. */
const pickerDay = (iso: string | null) => {
  if (!iso) return undefined;
  const [y, m, d] = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" })
    .format(new Date(iso))
    .split("-")
    .map(Number);
  return new Date(y!, m! - 1, d!);
};

/**
 * Makes an offer, or changes one (`coupon`): a code hosts type, or a festival offer that
 * applies by itself between its dates, with who and what it's for and where it shows.
 */
export function CouponForm({
  coupon = null,
  designs,
  onSaved,
}: {
  coupon?: Coupon | null;
  designs: readonly DesignOption[];
  onSaved?: () => void;
}) {
  const router = useRouter();
  const editing = coupon !== null;
  const [code, setCode] = useState(coupon?.code ?? "");
  const [label, setLabel] = useState(coupon?.label ?? "");
  const [description, setDescription] = useState(coupon?.description ?? "");
  const [terms, setTerms] = useState(coupon?.terms ?? "");
  const [kind, setKind] = useState<"percent" | "amount">(
    coupon?.amountOffPaise != null ? "amount" : "percent",
  );
  const [value, setValue] = useState(
    coupon ? String(coupon.percentOff ?? (coupon.amountOffPaise ?? 0) / 100) : "",
  );
  const [planIds, setPlanIds] = useState<PaidPlanId[]>(coupon?.planIds ?? []);
  const [designTiers, setDesignTiers] = useState<DesignTier[]>(coupon?.designTiers ?? []);
  const [designIds, setDesignIds] = useState<string[]>(coupon?.designIds ?? []);
  const [audience, setAudience] = useState<Audience>(coupon?.audience ?? "everyone");
  const [autoApply, setAutoApply] = useState(coupon?.autoApply ?? false);
  const [showOnSite, setShowOnSite] = useState(coupon?.showOnSite ?? true);
  const [featured, setFeatured] = useState(coupon?.featured ?? false);
  const [art, setArt] = useState<OfferArt>(coupon?.art ?? "festival");
  const [startsOn, setStartsOn] = useState<Date | undefined>(pickerDay(coupon?.startsAt ?? null));
  const [endsOn, setEndsOn] = useState<Date | undefined>(pickerDay(coupon?.endsAt ?? null));
  const [maxUses, setMaxUses] = useState(coupon?.maxUses ? String(coupon.maxUses) : "");
  const [perUserLimit, setPerUserLimit] = useState(
    coupon?.perUserLimit ? String(coupon.perUserLimit) : "",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  const reset = () => {
    setCode("");
    setLabel("");
    setDescription("");
    setTerms("");
    setValue("");
    setPlanIds([]);
    setDesignTiers([]);
    setDesignIds([]);
    setAudience("everyone");
    setAutoApply(false);
    setShowOnSite(true);
    setFeatured(false);
    setArt("festival");
    setStartsOn(undefined);
    setEndsOn(undefined);
    setMaxUses("");
    setPerUserLimit("");
  };

  const toggle = <T,>(list: T[], item: T, on: boolean) =>
    on ? [...list, item] : list.filter((entry) => entry !== item);

  return (
    <form
      noValidate
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        setErrors({});
        const input: CouponInput = {
          code,
          label,
          description,
          terms,
          kind,
          value,
          planIds,
          designTiers,
          designIds,
          audience,
          autoApply,
          showOnSite,
          featured,
          art,
          startsOn: day(startsOn),
          endsOn: day(endsOn),
          maxUses: maxUses.trim(),
          perUserLimit: perUserLimit.trim(),
        };
        startTransition(async () => {
          const result = await (editing ? editCoupon(coupon.id, input) : addCoupon(input)).catch(
            () => null,
          );
          if (result?.ok) {
            toast({
              title: editing ? `${coupon.code} is saved` : `${cleanCouponCode(code)} is ready`,
              tone: "success",
            });
            if (!editing) reset();
            onSaved?.();
            router.refresh();
          } else if (result && result.reason === "invalid" && result.field) {
            setErrors({ [result.field]: FIELD_ERRORS[result.field] ?? "Check this field." });
          } else if (result && result.reason === "taken") {
            setErrors({ code: "A coupon already has this code." });
          } else if (result && result.reason === "not-migrated") {
            toast({
              title: "Run the offers SQL in Supabase first",
              description: "supabase/migrations/20261019120000_offers.sql adds what offers need.",
              tone: "error",
            });
          } else {
            toast({ title: "Couldn't save the offer. Try again.", tone: "error" });
          }
        });
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Code"
          hint={editing ? "A code can't change once made." : "What hosts type, such as DIWALI25."}
          error={errors.code}
          required
        >
          <Input
            value={code}
            readOnly={editing}
            onChange={(event) => setCode(cleanCouponCode(event.target.value).slice(0, 20))}
            placeholder="DIWALI25"
            autoCapitalize="characters"
            spellCheck={false}
            className="font-mono tracking-wider"
          />
        </Field>
        <Field
          label="Title"
          hint="Such as Diwali offer. Hosts see it on the offers page and at checkout."
          error={errors.label}
          aside={<CharacterCount value={label.length} max={80} label={`${label.length} of 80`} />}
        >
          <Input
            value={label}
            maxLength={80}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="Diwali offer"
          />
        </Field>
      </div>

      <Field
        label="Short description"
        hint="One line under the title, such as 25% off every Royal design this Diwali."
        optionalLabel="Optional"
        aside={
          <CharacterCount
            value={description.length}
            max={200}
            label={`${description.length} of 200`}
          />
        }
      >
        <Input
          value={description}
          maxLength={200}
          onChange={(event) => setDescription(event.target.value)}
        />
      </Field>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 font-semibold">Discount</legend>
        <RadioGroup
          label="Discount"
          orientation="horizontal"
          value={kind}
          onValueChange={(next) => setKind(next as "percent" | "amount")}
        >
          <RadioItem value="percent" label="Percent off" />
          <RadioItem value="amount" label="Rupees off" />
        </RadioGroup>
        <Field
          label={kind === "percent" ? "Percent off" : "Rupees off"}
          error={errors.value}
          className="sm:max-w-xs"
          required
        >
          <Input
            inputMode="decimal"
            value={value}
            onChange={(event) => setValue(event.target.value.replace(/[^0-9.]/g, ""))}
            placeholder={kind === "percent" ? "20" : "200"}
            leading={kind === "amount" ? <span aria-hidden>₹</span> : undefined}
            trailing={kind === "percent" ? <span aria-hidden>%</span> : undefined}
          />
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 font-semibold">Who can use it</legend>
        <RadioGroup
          label="Who can use it"
          value={audience}
          onValueChange={(next) => setAudience(next as Audience)}
        >
          <RadioItem value="everyone" label={AUDIENCE_NAMES.everyone} />
          <RadioItem
            value="first-order"
            label={AUDIENCE_NAMES["first-order"]}
            description="Hosts who have never bought a package."
          />
          <RadioItem
            value="returning"
            label={AUDIENCE_NAMES.returning}
            description="Hosts who have bought at least one package."
          />
        </RadioGroup>
      </fieldset>

      <fieldset>
        <legend className="font-semibold">Packages</legend>
        <p className="text-sm text-ink-muted">Leave all unticked for every package.</p>
        <div className="flex flex-wrap gap-x-6">
          {PAID_PLAN_IDS.map((id) => (
            <Checkbox
              key={id}
              label={planCopy[id].name}
              checked={planIds.includes(id)}
              onCheckedChange={(checked) =>
                setPlanIds((list) => toggle(list, id, checked === true))
              }
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="font-semibold">Designs</legend>
        <p className="text-sm text-ink-muted">
          Tick kinds of design, pick designs by name, or both. Leave everything empty for every
          design.
        </p>
        <div className="flex flex-wrap gap-x-6">
          {DESIGN_TIERS.map((tier) => (
            <Checkbox
              key={tier}
              label={`${TIER_NAMES[tier]} designs`}
              checked={designTiers.includes(tier)}
              onCheckedChange={(checked) =>
                setDesignTiers((list) => toggle(list, tier, checked === true))
              }
            />
          ))}
        </div>
        <DesignChooser
          designs={designs}
          chosen={designIds}
          onChange={setDesignIds}
          error={errors.designIds}
        />
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First day" optionalLabel="Optional">
          <DatePicker value={startsOn} onValueChange={setStartsOn} placeholder="From today" />
        </Field>
        <Field label="Valid till" optionalLabel="Optional" error={errors.endsOn}>
          <DatePicker value={endsOn} onValueChange={setEndsOn} placeholder="No end" />
        </Field>
        <Field label="Uses in all" optionalLabel="Optional" error={errors.maxUses}>
          <Input
            inputMode="numeric"
            value={maxUses}
            onChange={(event) => setMaxUses(event.target.value.replace(/[^0-9]/g, ""))}
            placeholder="No limit"
          />
        </Field>
        <Field label="Uses per host" optionalLabel="Optional" error={errors.perUserLimit}>
          <Input
            inputMode="numeric"
            value={perUserLimit}
            onChange={(event) => setPerUserLimit(event.target.value.replace(/[^0-9]/g, ""))}
            placeholder="No limit"
          />
        </Field>
      </div>

      <Field
        label="Terms and conditions"
        hint="One condition per line. Shown under the offer on the offers page."
        optionalLabel="Optional"
        aside={<CharacterCount value={terms.length} max={2000} label={`${terms.length} of 2000`} />}
      >
        <Textarea
          value={terms}
          maxLength={2000}
          rows={4}
          onChange={(event) => setTerms(event.target.value)}
          placeholder={"Valid once per invitation.\nCan't be combined with other offers."}
        />
      </Field>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 font-semibold">Picture</legend>
        <p className="-mt-1 text-sm text-ink-muted">Shown on the offer on the site.</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {OFFER_ARTS.map((name) => (
            <label key={name} className="group relative cursor-pointer">
              <input
                type="radio"
                name="offer-art"
                value={name}
                checked={art === name}
                onChange={() => setArt(name)}
                className="peer absolute inset-0 z-10 size-full cursor-pointer appearance-none opacity-0"
              />
              <span className="block overflow-hidden rounded-md border-2 border-line transition-colors group-hover:border-line-strong peer-checked:border-marigold peer-checked:group-hover:border-marigold peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring">
                {/* eslint-disable-next-line @next/next/no-img-element -- small admin thumbnails */}
                <img
                  src={offerArtImage(name)}
                  alt=""
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              </span>
              <span className="mt-1 block text-center text-xs text-ink-muted peer-checked:font-semibold peer-checked:text-ink">
                {ART_NAMES[name]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-1">
        <Switch
          label="Festival offer"
          description="Applies by itself between its dates, with no code to type."
          checked={autoApply}
          onCheckedChange={setAutoApply}
        />
        <Switch
          label="Show on the offers page"
          description="Listed on /offers with its code, dates and terms. Off keeps the code private."
          checked={showOnSite}
          onCheckedChange={(on) => {
            setShowOnSite(on);
            if (!on) setFeatured(false);
          }}
        />
        <Switch
          label="Show on the home page"
          description="Also shown in the offers band on the home page."
          checked={featured}
          disabled={!showOnSite}
          onCheckedChange={setFeatured}
        />
      </div>

      <Button
        type="submit"
        className="self-start"
        loading={pending}
        disabled={!code || !value}
        leadingIcon={<TicketPercent aria-hidden />}
      >
        {editing ? "Save offer" : "Make offer"}
      </Button>
    </form>
  );
}

/** Picks designs by name: a search over every design, and the chosen ones as chips. */
function DesignChooser({
  designs,
  chosen,
  onChange,
  error,
}: {
  designs: readonly DesignOption[];
  chosen: string[];
  onChange: (ids: string[]) => void;
  error?: string;
}) {
  const [query, setQuery] = useState("");
  const names = useMemo(() => new Map(designs.map((design) => [design.id, design])), [designs]);
  const found = useMemo(() => {
    const words = query.trim().toLowerCase();
    if (!words) return [];
    return designs
      .filter(
        (design) =>
          !chosen.includes(design.id) &&
          `${design.name} ${design.id} ${design.kind}`.toLowerCase().includes(words),
      )
      .slice(0, 12);
  }, [designs, chosen, query]);

  return (
    <div className="flex flex-col gap-3">
      {chosen.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Designs chosen">
          {chosen.map((id) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => onChange(chosen.filter((entry) => entry !== id))}
                className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border border-marigold-edge bg-marigold/10 ps-3.5 pe-2.5 text-sm font-semibold transition-colors hover:bg-marigold/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {names.get(id)?.name ?? id}
                <X aria-hidden className="size-4" />
                <span className="sr-only">Take off</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <Field label="Add a design by name" optionalLabel="Optional" error={error}>
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Kayal, Rajwada, Haldi…"
          leading={<Search aria-hidden className="size-4" />}
        />
      </Field>
      {found.length > 0 && (
        <ul className="flex max-h-72 flex-col divide-y divide-line overflow-y-auto rounded-md border border-line bg-surface">
          {found.map((design) => (
            <li key={design.id}>
              <button
                type="button"
                onClick={() => {
                  onChange([...chosen, design.id]);
                  setQuery("");
                }}
                className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 px-3.5 py-2 text-start transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
              >
                <span className="font-semibold">{design.name}</span>
                <span className="text-sm text-ink-muted">{design.kind}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Opens an offer's form in a dialog to change it. */
export function EditCoupon({
  coupon,
  designs,
}: {
  coupon: Coupon;
  designs: readonly DesignOption[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        aria-label={`Edit ${coupon.code}`}
        leadingIcon={<Pencil aria-hidden />}
      >
        Edit
      </Button>
      {open && (
        <DialogContent title={`Edit ${coupon.code}`} closeLabel="Close" className="sm:max-w-2xl">
          <CouponForm coupon={coupon} designs={designs} onSaved={() => setOpen(false)} />
        </DialogContent>
      )}
    </Dialog>
  );
}

/** Switches one coupon on or off, saved as soon as it flips. */
export function CouponSwitch({ id, code, active }: { id: string; code: string; active: boolean }) {
  const router = useRouter();
  const [checked, setChecked] = useState(active);
  const [pending, startTransition] = useTransition();
  return (
    <Switch
      label={<span className="sr-only">{`${code} on`}</span>}
      checked={checked}
      disabled={pending}
      onCheckedChange={(next) => {
        setChecked(next);
        startTransition(async () => {
          const done = await switchCoupon(id, next).catch(() => false);
          if (done) {
            toast({ title: next ? `${code} is on` : `${code} is off`, tone: "success" });
            router.refresh();
          } else {
            setChecked(!next);
            toast({ title: "Couldn't save. Try again.", tone: "error" });
          }
        });
      }}
    />
  );
}
