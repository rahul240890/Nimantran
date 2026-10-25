"use client";

import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { enIN } from "date-fns/locale";
import dynamic from "next/dynamic";
import { useId, useState } from "react";
import type { DayPickerLocale, Matcher } from "react-day-picker";
import { cn } from "@/lib/cn";
import { controlClasses, useField } from "./field";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useQuiet } from "./quiet";

/** The calendar's code, fetched as a field is about to open rather than with every page. */
const loadCalendar = () => import("./calendar");

/*
 * The month grid comes in once a field opens (or the pointer or focus nears it), so the
 * pages with a date field, the guest's reply form among them, don't carry the calendar
 * until someone picks a day. Meanwhile its space is held, so the popover doesn't jump.
 */
const Calendar = dynamic(() => loadCalendar().then((module) => module.Calendar), {
  ssr: false,
  loading: () => <span className="block h-[22.5rem] w-[19.25rem] max-w-full" />,
});

type DatePickerProps = {
  value?: Date;
  onValueChange?: (date: Date | undefined) => void;
  /** Shown when nothing is picked, from translations. */
  placeholder: string;
  /** Language for the calendar and the field's text, from `react-day-picker/locale`. Defaults to English (India). */
  locale?: DayPickerLocale;
  disabled?: boolean;
  disabledDays?: Matcher | Matcher[];
  startMonth?: Date;
  endMonth?: Date;
  className?: string;
};

export function DatePicker({
  value,
  onValueChange,
  placeholder,
  locale,
  disabled,
  disabledDays,
  startMonth,
  endMonth,
  className,
}: DatePickerProps) {
  const field = useField();
  const quiet = useQuiet();
  const [open, setOpen] = useState(false);
  const valueId = useId();

  // date-fns rather than Intl, so server and browser always agree and hydration never mismatches
  const words = locale ?? enIN;
  const text = value ? format(value, "PPPP", { locale: words }) : placeholder;
  // "Wed, 14 Oct 2026" when the field is too narrow for the weekday and month in full
  const short = value ? format(value, "EEE, d MMM yyyy", { locale: words }) : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={field?.id}
          disabled={disabled ?? field?.disabled}
          aria-labelledby={field ? `${field.labelId} ${valueId}` : undefined}
          aria-describedby={field?.describedBy}
          data-invalid={field?.invalid || undefined}
          // The calendar's code starts coming as the host or guest heads for the field
          onPointerEnter={() => void loadCalendar()}
          onFocus={() => void loadCalendar()}
          className={cn(
            controlClasses,
            "group @container flex cursor-pointer items-center gap-2.5 text-start data-invalid:border-danger data-[state=open]:border-ring",
            quiet ? "h-11 px-3 text-ui" : "h-12 px-3.5 text-base",
            className,
          )}
        >
          <CalendarDays aria-hidden className="size-5 shrink-0 text-ink-muted" />
          <span id={valueId} className="sr-only">
            {text}
          </span>
          <span aria-hidden className={cn("min-w-0 flex-1 truncate", !value && "text-ink-muted")}>
            <span className="@max-[17rem]:hidden">{text}</span>
            <span className="@min-[17rem]:hidden">{short}</span>
          </span>
        </button>
      </PopoverTrigger>
      {/* Seven 44px days need 308px, so on the narrowest phones the calendar runs edge to edge */}
      <PopoverContent
        collisionPadding={0}
        // A short phone may have room for the calendar neither above nor below the field
        className="max-h-(--radix-popover-content-available-height) max-w-screen overflow-y-auto p-[5px] min-[360px]:p-2 sm:p-3"
      >
        <Calendar
          autoFocus
          selected={value}
          defaultMonth={value}
          onSelect={(date) => {
            onValueChange?.(date);
            if (date) setOpen(false);
          }}
          disabled={disabledDays}
          startMonth={startMonth}
          endMonth={endMonth}
          locale={locale}
        />
      </PopoverContent>
    </Popover>
  );
}
