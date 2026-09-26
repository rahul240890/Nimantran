"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { useId, useState } from "react";
import { DayPicker, type DayPickerLocale, type Matcher } from "react-day-picker";
import { enIN } from "react-day-picker/locale";
import { cn } from "@/lib/cn";
import { controlClasses, useField } from "./field";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type CalendarProps = {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  /** Days that cannot be picked, for example `{ before: today }`. */
  disabled?: Matcher | Matcher[];
  defaultMonth?: Date;
  startMonth?: Date;
  endMonth?: Date;
  /** Calendar language from `react-day-picker/locale`. Defaults to English (India). */
  locale?: DayPickerLocale;
  autoFocus?: boolean;
  className?: string;
};

/** A month grid with full keyboard support (arrows, Page Up/Down, Home/End). */
export function Calendar({ className, locale = enIN, ...props }: CalendarProps) {
  return (
    <DayPicker
      locale={locale}
      mode="single"
      showOutsideDays
      fixedWeeks
      className={cn("w-fit select-none", className)}
      classNames={{
        months: "relative",
        month: "flex flex-col gap-3",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between",
        button_previous:
          "grid size-11 cursor-pointer place-items-center rounded-md text-ink hover:bg-surface-2 disabled:cursor-not-allowed disabled:text-ink-faint disabled:hover:bg-transparent",
        button_next:
          "grid size-11 cursor-pointer place-items-center rounded-md text-ink hover:bg-surface-2 disabled:cursor-not-allowed disabled:text-ink-faint disabled:hover:bg-transparent",
        month_caption: "flex h-11 items-center justify-center",
        caption_label: "font-display text-lg",
        month_grid: "border-collapse",
        weekdays: "",
        weekday:
          "size-11 font-label text-[0.7rem] font-normal tracking-[0.12em] text-ink-muted uppercase",
        week: "",
        day: "size-11 p-0.5 text-center",
        day_button:
          "size-10 cursor-pointer rounded-full text-base tabular-nums transition-[background-color,transform,box-shadow] duration-150 hover:bg-surface-2 active:scale-90 disabled:cursor-not-allowed",
        today: "font-bold text-accent-text [&>button]:ring-1 [&>button]:ring-line-control",
        selected:
          "[&>button]:bg-marigold [&>button]:font-semibold [&>button]:text-on-marigold [&>button]:shadow-[inset_0_1px_0_rgb(255_255_255/0.45),0_2px_0_var(--marigold-edge)] [&>button]:hover:bg-marigold-strong",
        outside: "text-ink-muted",
        disabled: "text-ink-faint line-through decoration-ink-faint/60",
        hidden: "invisible",
        focused: "",
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft aria-hidden className="size-5 rtl:rotate-180" />
          ) : (
            <ChevronRight aria-hidden className="size-5 rtl:rotate-180" />
          ),
      }}
      {...props}
    />
  );
}

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
  locale = enIN,
  disabled,
  disabledDays,
  startMonth,
  endMonth,
  className,
}: DatePickerProps) {
  const field = useField();
  const [open, setOpen] = useState(false);
  const valueId = useId();

  // date-fns rather than Intl, so server and browser always agree and hydration never mismatches
  const text = value ? format(value, "PPPP", { locale }) : placeholder;

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
          className={cn(
            controlClasses,
            "group flex h-12 cursor-pointer items-center gap-2.5 px-3.5 text-start text-base data-invalid:border-danger data-[state=open]:border-ring",
            className,
          )}
        >
          <CalendarDays aria-hidden className="size-5 shrink-0 text-ink-muted" />
          <span id={valueId} className={cn("min-w-0 flex-1 truncate", !value && "text-ink-muted")}>
            {text}
          </span>
        </button>
      </PopoverTrigger>
      {/* Seven 44px days need 308px, so on the narrowest phones the calendar runs edge to edge */}
      <PopoverContent collisionPadding={0} className="max-w-screen p-[5px] min-[360px]:p-2 sm:p-3">
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
