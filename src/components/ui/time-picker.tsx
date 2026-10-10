"use client";

import type { Locale } from "date-fns";
import { enIN } from "date-fns/locale";
import { Clock } from "lucide-react";
import { useMemo } from "react";
import { formatTime, timeSlots } from "@/lib/time";
import { Select } from "./select";

type TimePickerProps = {
  /** 24-hour "HH:mm". */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Minutes between choices. Defaults to 15. */
  step?: number;
  /** Earliest and latest choices, as "HH:mm". */
  min?: string;
  max?: string;
  /** date-fns locale for display. Defaults to English (India). */
  locale?: Locale;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  className?: string;
  "aria-label"?: string;
  /** With no time chosen, the time the list opens at, as "HH:mm". */
  openAt?: string;
};

/**
 * Picks a time from a list, so there is nothing to mistype and every locale reads naturally.
 * Type a digit to jump (typeahead), or use the arrow keys.
 */
export function TimePicker({
  step = 15,
  min = "00:00",
  max = "23:59",
  locale = enIN,
  ...props
}: TimePickerProps) {
  const options = useMemo(
    () =>
      timeSlots(step, min, max).map((slot) => {
        const label = formatTime(slot, locale);
        return { value: slot, label, textValue: label };
      }),
    [step, min, max, locale],
  );

  // Snap the opening time onto the list's own steps (a muhurat lists every minute)
  const openAt = props.openAt && options.find((option) => option.value >= props.openAt!)?.value;
  return (
    <Select
      {...props}
      openAt={openAt}
      options={options}
      leading={<Clock />}
      contentClassName="max-h-72"
    />
  );
}
