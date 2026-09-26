"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { Section, Specimen, StateLabel } from "./layout";

type Swatch = { name: string; className: string; use: string; ring?: boolean };

const colourGroups: { title: string; swatches: Swatch[] }[] = [
  {
    title: "Surfaces and lines",
    swatches: [
      { name: "paper", className: "bg-paper", use: "Page background", ring: true },
      { name: "surface", className: "bg-surface", use: "Cards, fields", ring: true },
      { name: "surface-2", className: "bg-surface-2", use: "Wells, hovers" },
      { name: "line", className: "bg-line", use: "Dividers" },
      { name: "line-strong", className: "bg-line-strong", use: "Card borders" },
      { name: "line-control", className: "bg-line-control", use: "Field borders, 3:1" },
    ],
  },
  {
    title: "Text",
    swatches: [
      { name: "ink", className: "bg-ink", use: "Body and headings" },
      { name: "ink-muted", className: "bg-ink-muted", use: "Secondary text" },
      { name: "ink-faint", className: "bg-ink-faint", use: "Icons, disabled" },
      { name: "accent-text", className: "bg-accent-text", use: "Gold text, links" },
    ],
  },
  {
    title: "Brand",
    swatches: [
      { name: "marigold", className: "bg-marigold", use: "Primary actions" },
      { name: "marigold-strong", className: "bg-marigold-strong", use: "Hover" },
      { name: "marigold-edge", className: "bg-marigold-edge", use: "Pressed-in edge" },
      { name: "rose", className: "bg-rose", use: "Accents" },
      { name: "gold-glint", className: "bg-gold-glint", use: "Shimmer light", ring: true },
    ],
  },
  {
    title: "Status",
    swatches: [
      { name: "success", className: "bg-success", use: "Attending, saved" },
      { name: "warning", className: "bg-warning", use: "Pending, limits" },
      { name: "danger", className: "bg-danger", use: "Errors, delete" },
      { name: "ring", className: "bg-ring", use: "Keyboard focus" },
    ],
  },
  {
    title: "Card stock (same in both themes)",
    swatches: [
      { name: "card-ivory", className: "bg-card-ivory", use: "Invitation paper", ring: true },
      { name: "card-gold", className: "bg-card-gold", use: "Foil borders" },
      { name: "card-gold-text", className: "bg-card-gold-text", use: "Foil text" },
      { name: "card-ink", className: "bg-card-ink", use: "Names, details" },
      { name: "card-accent-text", className: "bg-card-accent-text", use: "Highlights" },
      { name: "card-back", className: "bg-card-back", use: "Card back" },
    ],
  },
];

const typeScale = [
  {
    label: "Display · Rozha One",
    className: "font-display text-5xl leading-[1.05] sm:text-6xl",
    text: "Aarav & Meera",
  },
  {
    label: "Heading 1",
    className: "font-display text-4xl leading-tight",
    text: "Your wedding invite",
  },
  { label: "Heading 2", className: "font-display text-2xl leading-tight", text: "Sangeet evening" },
  {
    label: "Body large · Karla",
    className: "text-lg",
    text: "Guests tap the link and the card opens in 3D.",
  },
  {
    label: "Body",
    className: "text-base",
    text: "See who is coming, how many, and who still hasn't replied.",
  },
  {
    label: "Small",
    className: "text-sm text-ink-muted",
    text: "Replies update live as guests respond.",
  },
  {
    label: "Label · Tenor Sans",
    className: "font-label text-xs tracking-[0.28em] uppercase text-accent-text",
    text: "Shubh vivah · 12 December",
  },
  { label: "Indic fallback", className: "font-display text-3xl", text: "शुभ विवाह · আমন্ত্রণ" },
];

const radii = [
  { name: "sm · 6px", className: "rounded-sm" },
  { name: "md · 10px", className: "rounded-md" },
  { name: "lg · 16px", className: "rounded-lg" },
  { name: "xl · 24px", className: "rounded-xl" },
  { name: "full", className: "rounded-full" },
];

const spacing = [1, 2, 3, 4, 6, 8, 12, 16];

const depths = [
  { name: "Flat", note: "Border only", className: "border border-line" },
  { name: "Raised", note: "Cards, buttons", className: "border border-line shadow-raised" },
  { name: "Float", note: "Hover, popovers", className: "border border-line shadow-float" },
  { name: "Overlay", note: "Dialogs, toasts", className: "border border-line shadow-overlay" },
];

const easings = [
  { name: "ease-out-expo", use: "Things arriving", className: "ease-out-expo" },
  { name: "ease-spring", use: "Toggles, ticks", className: "ease-spring" },
  { name: "ease-in-soft", use: "Things leaving", className: "ease-in-soft" },
];

function MotionDemo() {
  const [moved, setMoved] = useState(false);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        {easings.map((easing) => (
          <div key={easing.name} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <code className="font-semibold text-ink">{easing.name}</code>
              <span className="text-ink-muted">{easing.use}</span>
            </div>
            <div className="relative h-11 rounded-full bg-surface-2 ring-1 ring-line">
              <span
                aria-hidden
                className={cn(
                  "absolute top-1.5 left-1.5 size-8 rounded-full bg-marigold shadow-[inset_0_1px_0_rgb(255_255_255/0.45),0_2px_0_var(--marigold-edge)] transition-[left] duration-700",
                  easing.className,
                  moved && "left-[calc(100%-2.375rem)]",
                )}
              />
            </div>
          </div>
        ))}
      </div>
      <Button
        variant="secondary"
        size="sm"
        leadingIcon={<Play aria-hidden />}
        onClick={() => setMoved((value) => !value)}
        className="self-start"
      >
        Play the curves
      </Button>
    </div>
  );
}

export function Foundations() {
  return (
    <Section
      id="foundations"
      eyebrow="01 · Foundations"
      title="Colour, type, space, depth and motion"
      intro="Every component is built only from these tokens. Switch the theme at the top to check each one in light and dark."
    >
      <Specimen
        title="Colour"
        note="Text colours meet WCAG AA (4.5:1) on paper, surface and surface-2"
      >
        <div className="flex flex-col gap-7">
          {colourGroups.map((group) => (
            <div key={group.title}>
              <StateLabel>{group.title}</StateLabel>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {group.swatches.map((swatch) => (
                  <li key={swatch.name} className="flex min-w-0 flex-col gap-2">
                    <span
                      aria-hidden
                      className={cn(
                        "h-16 rounded-md shadow-raised",
                        swatch.className,
                        swatch.ring && "ring-1 ring-line-strong",
                      )}
                    />
                    <span className="flex min-w-0 flex-col">
                      <code className="truncate text-sm font-semibold text-ink">{swatch.name}</code>
                      <span className="text-sm text-ink-muted">{swatch.use}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Specimen>

      <Specimen title="Type" note="Rozha One for names, Karla for reading, Tenor Sans for labels">
        <dl className="flex flex-col divide-y divide-line">
          {typeScale.map((row) => (
            <div
              key={row.label}
              className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0 md:flex-row md:items-baseline md:gap-6"
            >
              <dt className="shrink-0 text-sm text-ink-muted md:w-44">{row.label}</dt>
              <dd className={cn("min-w-0 break-words", row.className)}>{row.text}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 font-display text-4xl leading-tight sm:text-5xl">
          <span className="text-gold-shimmer">Shubh Vivah</span>
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          Gold shimmer for large display text. A slow band of light every few seconds; still in
          reduced motion.
        </p>
      </Specimen>

      <div className="grid gap-6 lg:grid-cols-2">
        <Specimen title="Spacing" note="Tailwind's 4px scale">
          <ul className="flex flex-col gap-2.5">
            {spacing.map((step) => (
              <li key={step} className="flex items-center gap-4">
                <code className="w-10 shrink-0 text-sm text-ink-muted">{step}</code>
                <span
                  aria-hidden
                  className="h-3 rounded-full bg-marigold"
                  style={{ width: `${step * 4}px` }}
                />
                <span className="text-sm text-ink-muted">{step * 4}px</span>
              </li>
            ))}
          </ul>
        </Specimen>
        <Specimen title="Radius">
          <ul className="grid grid-cols-3 gap-4 sm:grid-cols-5">
            {radii.map((radius) => (
              <li key={radius.name} className="flex flex-col items-center gap-2 text-center">
                <span
                  aria-hidden
                  className={cn(
                    "size-16 border-2 border-marigold bg-marigold/15",
                    radius.className,
                  )}
                />
                <span className="text-sm text-ink-muted">{radius.name}</span>
              </li>
            ))}
          </ul>
        </Specimen>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Specimen
          title="Depth"
          note="Warm shadows in light, deep ones with a top highlight in dark"
        >
          <ul className="grid grid-cols-2 gap-5 p-2">
            {depths.map((depth) => (
              <li
                key={depth.name}
                className={cn(
                  "flex h-24 flex-col justify-end rounded-lg bg-surface p-3",
                  depth.className,
                )}
              >
                <span className="font-semibold">{depth.name}</span>
                <span className="text-sm text-ink-muted">{depth.note}</span>
              </li>
            ))}
          </ul>
        </Specimen>
        <Specimen title="Motion" note="Quick to respond, soft to settle">
          <MotionDemo />
        </Specimen>
      </div>
    </Section>
  );
}
