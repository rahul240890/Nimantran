"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveBusinessDetails } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { GSTIN, type Business } from "@/lib/payments/business-details";

/** The seller's name, address and GSTIN, printed on every invoice. */
export function BusinessForm({ initial }: { initial: Business }) {
  const router = useRouter();
  const [business, setBusiness] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [tried, setTried] = useState(false);
  const set = (key: keyof Business) => (value: string) =>
    setBusiness((current) => ({ ...current, [key]: value }));

  const gstin = business.gstin.trim().toUpperCase();
  const errors = {
    legalName: !business.legalName.trim() ? "Add the name on your GST or PAN papers." : undefined,
    address: !business.address.trim() ? "Add the address invoices come from." : undefined,
    gstin:
      gstin && !GSTIN.test(gstin)
        ? "A GSTIN has 15 letters and numbers, like 24ABCDE1234F1Z5."
        : undefined,
    email:
      business.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(business.email)
        ? "Check the email address."
        : undefined,
  };
  const invalid = Object.values(errors).some(Boolean);
  const shown = (key: keyof typeof errors) => (tried ? errors[key] : undefined);

  return (
    <form
      noValidate
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        setTried(true);
        if (invalid) return;
        startTransition(async () => {
          const result = await saveBusinessDetails({ ...business, gstin }).catch(() => null);
          if (result === "saved") {
            toast({ title: "Business details saved", tone: "success" });
            router.refresh();
          } else {
            toast({
              title:
                result === "invalid"
                  ? "Check the details and try again."
                  : "Couldn't save. Try again.",
              tone: "error",
            });
          }
        });
      }}
    >
      <Field label="Legal name" error={shown("legalName")} required>
        <Input
          value={business.legalName}
          maxLength={100}
          onChange={(event) => set("legalName")(event.target.value)}
          autoComplete="organization"
        />
      </Field>
      <Field label="Address" error={shown("address")} required>
        <Textarea
          value={business.address}
          maxLength={300}
          rows={3}
          onChange={(event) => set("address")(event.target.value)}
          autoComplete="street-address"
        />
      </Field>
      <Field
        label="GSTIN"
        optionalLabel="Optional"
        hint="With a GSTIN, buyers get a tax invoice showing CGST and SGST. Without one, they get a receipt."
        error={shown("gstin")}
      >
        <Input
          value={business.gstin}
          maxLength={15}
          onChange={(event) => set("gstin")(event.target.value.toUpperCase())}
          autoCapitalize="characters"
          spellCheck={false}
          className="font-mono tracking-wider"
          placeholder="24ABCDE1234F1Z5"
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email for invoices" optionalLabel="Optional" error={shown("email")}>
          <Input
            type="email"
            value={business.email}
            maxLength={120}
            onChange={(event) => set("email")(event.target.value.trim())}
            autoComplete="email"
          />
        </Field>
        <Field label="Phone" optionalLabel="Optional">
          <Input
            type="tel"
            value={business.phone}
            maxLength={20}
            onChange={(event) => set("phone")(event.target.value)}
            autoComplete="tel"
          />
        </Field>
      </div>
      <Button
        type="submit"
        className="self-start"
        loading={pending}
        leadingIcon={<Save aria-hidden />}
      >
        Save details
      </Button>
    </form>
  );
}
