"use client";

import { Plus } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Questions and answers that expand in place. Arrow keys move between questions. */
export function Accordion({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      className={cn(
        "flex flex-col divide-y divide-line rounded-lg border border-line bg-surface shadow-raised",
        className,
      )}
      {...props}
    />
  );
}

type AccordionItemProps = Omit<ComponentProps<typeof AccordionPrimitive.Item>, "title"> & {
  title: ReactNode;
  /** The heading level of the question, so it fits the page outline. */
  headingLevel?: 2 | 3 | 4;
};

export function AccordionItem({
  title,
  headingLevel = 3,
  className,
  children,
  ...props
}: AccordionItemProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <AccordionPrimitive.Item className={cn("group/item", className)} {...props}>
      <AccordionPrimitive.Header asChild>
        <Heading className="flex">
          <AccordionPrimitive.Trigger
            className={cn(
              "group flex min-h-14 flex-1 cursor-pointer items-center justify-between gap-4 px-5 py-4 text-start font-semibold text-ink transition-colors sm:px-6",
              "hover:text-accent-text focus-visible:outline-offset-[-3px]",
              "group-first/item:rounded-t-lg group-last/item:data-[state=closed]:rounded-b-lg",
            )}
          >
            <span className="min-w-0 text-pretty">{title}</span>
            <span
              aria-hidden
              className="grid size-8 shrink-0 place-items-center rounded-full border border-line bg-surface-2 text-accent-text transition-[transform,background-color] duration-300 ease-out-expo group-data-[state=open]:rotate-45 group-data-[state=open]:bg-marigold/15"
            >
              <Plus className="size-4" strokeWidth={2.5} />
            </span>
          </AccordionPrimitive.Trigger>
        </Heading>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="px-5 pb-5 text-ink-muted sm:px-6 sm:pe-16">{children}</div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}
