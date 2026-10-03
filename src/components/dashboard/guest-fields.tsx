"use client";

import { useId } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import type { HostFunction } from "@/lib/guests/list";
import { useText } from "@/i18n/client";
import { dashboardText } from "@/i18n/copy/dashboard";
import { editorText } from "@/i18n/copy/editor";

/* Pieces the guest forms share: which celebrations a guest is invited to. */

export function FunctionPicker({
  functions,
  value,
  onChange,
  error,
}: {
  functions: HostFunction[];
  value: string[];
  onChange: (value: string[]) => void;
  error: boolean;
}) {
  const copy = useText(dashboardText).dashboardCopy.form;
  const { functionCopy } = useText(editorText);
  const id = useId();
  if (functions.length < 2) return null;
  return (
    <fieldset aria-describedby={`${id}-hint`} className="flex flex-col gap-2">
      <legend className="mb-2 font-semibold">{copy.functions}</legend>
      <div className="grid gap-1 sm:grid-cols-2">
        {functions.map((fn) => (
          <Checkbox
            key={fn.id}
            label={functionCopy[fn.kind].name}
            checked={value.includes(fn.id)}
            invalid={error}
            onCheckedChange={(checked) =>
              onChange(
                checked === true
                  ? functions.filter((f) => value.includes(f.id) || f.id === fn.id).map((f) => f.id)
                  : value.filter((item) => item !== fn.id),
              )
            }
          />
        ))}
      </div>
      <p
        id={`${id}-hint`}
        className={error ? "text-sm font-medium text-danger" : "text-sm text-ink-muted"}
      >
        {error ? copy.functionsRequired : copy.functionsHint}
      </p>
    </fieldset>
  );
}

/** Everything invited to maps to an empty list, which the database reads as "all". */
export const toStored = (functions: HostFunction[], picked: string[]) =>
  picked.length === functions.length ? [] : picked;
