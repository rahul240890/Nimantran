"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { uiStrings } from "@/lib/ui-strings";

export const sections = [
  { id: "foundations", label: "Foundations" },
  { id: "buttons", label: "Buttons" },
  { id: "fields", label: "Forms" },
  { id: "choices", label: "Choices" },
  { id: "cards", label: "Cards and depth" },
  { id: "overlays", label: "Overlays" },
  { id: "navigation", label: "Tabs and stepper" },
  { id: "status", label: "Badges and avatars" },
  { id: "feedback", label: "Loading and empty" },
];

/** Lets a reviewer preview the still version without changing their device settings. */
function StillModeSwitch() {
  const [still, setStill] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (still) root.dataset.motion = "reduce";
    else delete root.dataset.motion;
    return () => {
      delete root.dataset.motion;
    };
  }, [still]);

  return (
    <Switch
      label={<span className="text-sm font-semibold whitespace-nowrap">Reduce motion</span>}
      checked={still}
      onCheckedChange={setStill}
      className="gap-3 py-0 max-sm:order-last max-sm:w-full max-sm:border-t max-sm:border-line max-sm:pt-1.5"
    />
  );
}

export function DesignHeader() {
  return (
    <header className="z-40 border-b border-line bg-paper/85 pt-[env(safe-area-inset-top)] backdrop-blur-md sm:sticky sm:top-0">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-5 gap-y-1.5 px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {/* Below 360px only the mandala shows, so the theme switch fits beside it */}
          <Logo className="max-[359px]:[&>span]:sr-only" />
          <span className="hidden font-label text-xs tracking-[0.24em] text-ink-muted uppercase md:inline">
            Design system
          </span>
        </div>
        {/* On phones the motion switch drops to its own row; from sm up both controls sit together */}
        <div className="contents sm:flex sm:items-center sm:gap-5">
          <StillModeSwitch />
          <ThemeToggle labels={uiStrings.theme} />
        </div>
      </div>
      <nav aria-label="Sections" className="lg:hidden">
        <ul className="mx-auto flex max-w-7xl [scrollbar-width:none] gap-1 overflow-x-auto px-3 pb-2 sm:px-5 [&::-webkit-scrollbar]:hidden">
          {sections.map((section) => (
            <li key={section.id} className="shrink-0">
              <a
                href={`#${section.id}`}
                className="inline-flex min-h-11 items-center rounded-full px-3.5 text-sm font-semibold whitespace-nowrap text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export function DesignSideNav() {
  return (
    <nav aria-label="Sections" className="sticky top-24 hidden self-start lg:block">
      <ul className="flex flex-col gap-0.5 border-s border-line">
        {sections.map((section, index) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="-ms-px flex min-h-11 items-center gap-3 border-s-2 border-transparent ps-4 pe-2 text-ink-muted transition-colors hover:border-marigold hover:text-ink"
            >
              <span className="w-5 shrink-0 font-label text-xs text-ink-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
