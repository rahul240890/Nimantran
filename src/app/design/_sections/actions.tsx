"use client";

import { ArrowRight, Heart, Pencil, Plus, Send, Share2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button, type ButtonVariant } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Section, Specimen, StateLabel } from "./layout";

const variants: { variant: ButtonVariant; label: string; note: string }[] = [
  { variant: "primary", label: "Send invites", note: "One per screen: the main next step" },
  { variant: "secondary", label: "Preview", note: "Other actions" },
  { variant: "ghost", label: "Skip for now", note: "Quiet actions" },
  { variant: "danger", label: "Delete invite", note: "Destructive, after confirming" },
];

function LoadingDemo() {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      loading={loading}
      trailingIcon={<Send aria-hidden />}
      onClick={() => {
        setLoading(true);
        window.setTimeout(() => setLoading(false), 1800);
      }}
    >
      {loading ? "Sending…" : "Try loading"}
    </Button>
  );
}

export function Actions() {
  return (
    <Section
      id="buttons"
      eyebrow="02 · Actions"
      title="Buttons"
      intro="Primary and danger buttons sit on a thin edge and press into it. A band of light crosses them on hover. Every size is at least 44px tall."
    >
      <Specimen title="Variants and states" note="Hover, press and Tab through them">
        <div className="flex flex-col gap-6">
          {variants.map(({ variant, label, note }) => (
            <div key={variant} className="flex flex-col gap-3">
              <StateLabel>
                {variant} · {note}
              </StateLabel>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant={variant}>{label}</Button>
                <Button variant={variant} loading>
                  {label}
                </Button>
                <Button variant={variant} disabled>
                  {label}
                </Button>
              </div>
            </div>
          ))}
          <p className="text-sm text-ink-muted">Each row: default, loading, disabled.</p>
        </div>
      </Specimen>

      <div className="grid gap-6 lg:grid-cols-2">
        <Specimen title="Sizes and icons">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button leadingIcon={<Plus aria-hidden />}>Add function</Button>
              <Button
                variant="secondary"
                trailingIcon={<ArrowRight aria-hidden className="rtl:rotate-180" />}
              >
                Next
              </Button>
            </div>
            <Button size="lg" fullWidth leadingIcon={<Share2 aria-hidden />}>
              Share on WhatsApp
            </Button>
          </div>
        </Specimen>
        <Specimen title="Icon buttons and live loading" note="Icon buttons always carry a label">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <IconButton label="Edit" icon={<Pencil aria-hidden />} />
              <IconButton label="Share" icon={<Share2 aria-hidden />} variant="primary" />
              <IconButton label="Save to favourites" icon={<Heart aria-hidden />} variant="ghost" />
              <IconButton label="Delete" icon={<Trash2 aria-hidden />} variant="danger" />
              <IconButton label="Saving" icon={<Heart aria-hidden />} loading />
              <IconButton label="Edit (unavailable)" icon={<Pencil aria-hidden />} disabled />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <LoadingDemo />
              <Button asChild variant="secondary">
                <a href="#top">A link styled as a button</a>
              </Button>
            </div>
          </div>
        </Specimen>
      </div>
    </Section>
  );
}
