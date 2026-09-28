"use client";

import { format } from "date-fns";
import { TicketPercent } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addCoupon, switchCoupon } from "@/actions/admin";
import { planCopy } from "@/content/editions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { PAID_PLAN_IDS, type PaidPlanId } from "@/lib/plans/catalog";
import { cleanCouponCode } from "@/lib/plans/offers";

const FIELD_ERRORS: Record<string, string> = {
  code: "Use 3 to 20 letters and numbers.",
  value: "Percent off is 1 to 90; an amount is in rupees.",
  endsOn: "The last day can't be before the first.",
  maxUses: "Leave empty for no limit, or a whole number.",
};

const day = (date: Date | undefined) => (date ? format(date, "yyyy-MM-dd") : "");

/** Makes a coupon code or a festival offer that applies by itself between its dates. */
export function NewCoupon() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState<"percent" | "amount">("percent");
  const [value, setValue] = useState("");
  const [planIds, setPlanIds] = useState<PaidPlanId[]>([]);
  const [autoApply, setAutoApply] = useState(false);
  const [startsOn, setStartsOn] = useState<Date | undefined>();
  const [endsOn, setEndsOn] = useState<Date | undefined>();
  const [maxUses, setMaxUses] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  const reset = () => {
    setCode("");
    setLabel("");
    setValue("");
    setPlanIds([]);
    setAutoApply(false);
    setStartsOn(undefined);
    setEndsOn(undefined);
    setMaxUses("");
  };

  return (
    <form
      noValidate
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        setErrors({});
        startTransition(async () => {
          const result = await addCoupon({
            code,
            label,
            kind,
            value,
            planIds,
            autoApply,
            startsOn: day(startsOn),
            endsOn: day(endsOn),
            maxUses: maxUses.trim(),
          }).catch(() => null);
          if (result?.ok) {
            toast({ title: `${cleanCouponCode(code)} is ready`, tone: "success" });
            reset();
            router.refresh();
          } else if (result && result.reason === "invalid" && result.field) {
            setErrors({ [result.field]: FIELD_ERRORS[result.field] ?? "Check this field." });
          } else if (result && result.reason === "taken") {
            setErrors({ code: "A coupon already has this code." });
          } else {
            toast({ title: "Couldn't save the coupon. Try again.", tone: "error" });
          }
        });
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Code" hint="What hosts type, such as DIWALI25." error={errors.code} required>
          <Input
            value={code}
            onChange={(event) => setCode(cleanCouponCode(event.target.value).slice(0, 20))}
            placeholder="DIWALI25"
            autoCapitalize="characters"
            spellCheck={false}
            className="font-mono tracking-wider"
          />
        </Field>
        <Field label="Name hosts see" hint="Such as Diwali offer." optionalLabel="Optional">
          <Input
            value={label}
            maxLength={60}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="Diwali offer"
          />
        </Field>
      </div>

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

      <fieldset>
        <legend className="font-semibold">Editions</legend>
        <p className="text-sm text-ink-muted">Leave all unticked for every edition.</p>
        <div className="flex flex-wrap gap-x-6">
          {PAID_PLAN_IDS.map((id) => (
            <Checkbox
              key={id}
              label={planCopy[id].name}
              checked={planIds.includes(id)}
              onCheckedChange={(checked) =>
                setPlanIds((current) =>
                  checked === true ? [...current, id] : current.filter((planId) => planId !== id),
                )
              }
            />
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="First day" optionalLabel="Optional">
          <DatePicker value={startsOn} onValueChange={setStartsOn} placeholder="From today" />
        </Field>
        <Field label="Last day" optionalLabel="Optional" error={errors.endsOn}>
          <DatePicker value={endsOn} onValueChange={setEndsOn} placeholder="No end" />
        </Field>
        <Field label="Uses" optionalLabel="Optional" error={errors.maxUses}>
          <Input
            inputMode="numeric"
            value={maxUses}
            onChange={(event) => setMaxUses(event.target.value.replace(/[^0-9]/g, ""))}
            placeholder="No limit"
          />
        </Field>
      </div>

      <Switch
        label="Festival offer"
        description="Applies by itself between its dates, with no code to type."
        checked={autoApply}
        onCheckedChange={setAutoApply}
      />

      <Button
        type="submit"
        className="self-start"
        loading={pending}
        disabled={!code || !value}
        leadingIcon={<TicketPercent aria-hidden />}
      >
        Make coupon
      </Button>
    </form>
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
