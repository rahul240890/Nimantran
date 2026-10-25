"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type DayPickerLocale, type Matcher } from "react-day-picker";
import { enIN } from "react-day-picker/locale";
import { cn } from "@/lib/cn";

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
