"use client";

import { forwardRef } from "react";
import { useField } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import { OTP_LENGTH } from "@/lib/auth/phone";

type CodeInputProps = {
  value: string;
  onChange: (value: string) => void;
  /** Called once all six digits are in, typed or pasted or filled from the SMS. */
  onComplete?: (value: string) => void;
  disabled?: boolean;
};

/**
 * A one-time code shown as six boxes. Underneath it is one ordinary input, so the phone's
 * SMS autofill, pasting, screen readers and the keyboard all work as usual.
 */
export const CodeInput = forwardRef<HTMLInputElement, CodeInputProps>(function CodeInput(
  { value, onChange, onComplete, disabled },
  ref,
) {
  const field = useField();
  const active = Math.min(value.length, OTP_LENGTH - 1);
  return (
    <div className="group/code relative w-full max-w-sm">
      <input
        ref={ref}
        id={field?.id}
        value={value}
        disabled={disabled}
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="\d*"
        maxLength={OTP_LENGTH}
        aria-invalid={field?.invalid || undefined}
        aria-describedby={field?.describedBy}
        onChange={(event) => {
          const digits = event.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH);
          onChange(digits);
          if (digits.length === OTP_LENGTH) onComplete?.(digits);
        }}
        className="absolute inset-0 z-10 size-full cursor-text opacity-0 disabled:cursor-not-allowed"
      />
      <div aria-hidden className="grid grid-cols-6 gap-1.5 sm:gap-2.5">
        {Array.from({ length: OTP_LENGTH }, (_, index) => {
          const digit = value[index];
          const current = index === active;
          return (
            <span
              key={index}
              className={cn(
                "relative grid h-14 place-items-center rounded-md border bg-surface font-display text-2xl text-ink transition-[border-color,box-shadow] duration-150 sm:h-16 sm:text-3xl",
                field?.invalid ? "border-danger" : "border-line-control",
                digit && "border-marigold/70",
                current &&
                  "group-focus-within/code:border-marigold group-focus-within/code:shadow-[0_0_0_3px_color-mix(in_srgb,var(--marigold)_35%,transparent)]",
              )}
            >
              {digit ?? ""}
              {current && !digit && (
                <span className="absolute h-7 w-0.5 rounded-full bg-marigold opacity-0 group-focus-within/code:animate-pulse group-focus-within/code:opacity-100 motion-still:animate-none" />
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
});
