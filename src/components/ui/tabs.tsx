"use client";

import { Tabs as TabsPrimitive } from "radix-ui";
import { useLayoutEffect, useRef, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export const Tabs = TabsPrimitive.Root;

type TabsListProps = ComponentProps<typeof TabsPrimitive.List> & { children: ReactNode };

/**
 * A segmented row of tabs. A raised pill slides to the active tab.
 * On narrow screens the row scrolls sideways instead of wrapping.
 */
export function TabsList({ className, children, ...props }: TabsListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    const pill = pillRef.current;
    if (!list || !pill) return;

    const place = () => {
      const active = list.querySelector<HTMLElement>('[role="tab"][data-state="active"]');
      if (!active) {
        pill.style.opacity = "0";
        return;
      }
      pill.style.opacity = "1";
      pill.style.width = `${active.offsetWidth}px`;
      pill.style.transform = `translateX(${active.offsetLeft}px)`;
    };

    // Keep the active tab in view inside the scrolling row, without scrolling the page
    const reveal = () => {
      const active = list.querySelector<HTMLElement>('[role="tab"][data-state="active"]');
      if (!active || list.scrollWidth <= list.clientWidth) return;
      const left = active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2;
      list.scrollTo({ left: Math.max(0, left) });
    };

    place();
    reveal();
    // Tab changes flip data-state; size changes come from fonts loading or the window resizing
    const mutations = new MutationObserver(() => {
      place();
      reveal();
    });
    mutations.observe(list, { subtree: true, attributes: true, attributeFilter: ["data-state"] });
    const resize = new ResizeObserver(place);
    resize.observe(list);
    return () => {
      mutations.disconnect();
      resize.disconnect();
    };
  }, []);

  return (
    // The list itself scrolls, so the scrolling region is the focusable tab list
    <TabsPrimitive.List
      ref={listRef}
      className={cn(
        "relative inline-flex max-w-full [scrollbar-width:none] items-center gap-1 overflow-x-auto rounded-full border border-line bg-surface-2 p-1 [&::-webkit-scrollbar]:hidden",
        className,
      )}
      {...props}
    >
      <span
        ref={pillRef}
        aria-hidden
        className="absolute start-0 top-1 bottom-1 rounded-full bg-surface opacity-0 shadow-raised ring-1 ring-line transition-[transform,width] duration-400 ease-out-expo rtl:start-auto rtl:left-0"
      />
      {children}
    </TabsPrimitive.List>
  );
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "relative z-10 inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 font-semibold whitespace-nowrap text-ink-muted transition-colors duration-200",
        "hover:text-ink data-[state=active]:text-ink",
        "focus-visible:outline-offset-1",
        "disabled:cursor-not-allowed disabled:text-ink-faint",
        "[&_svg]:size-4.5",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn("mt-5 outline-none data-[state=active]:animate-rise", className)}
      {...props}
    />
  );
}
