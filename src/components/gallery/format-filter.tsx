"use client";

import { Image as ImageIcon, Layers, LayoutGrid, Rotate3d } from "lucide-react";
import { useState, type ReactNode } from "react";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { useText } from "@/i18n/client";
import { galleryText } from "@/i18n/copy/gallery";

/** The kinds of design a gallery list can hold. */
export type DesignFormat = "scene" | "story" | "card";

const ICONS = { all: LayoutGrid, scene: ImageIcon, story: Layers, card: Rotate3d } as const;

/**
 * Shows one kind of design at a time: Scenes, Stories or 3D cards. The designs are drawn
 * on the server, so search engines read every one; the choice only hides the others.
 */
export function FormatFilter({
  formats,
  children,
}: {
  /** The kinds in this list, in the order they appear. */
  formats: readonly DesignFormat[];
  children: ReactNode;
}) {
  const { galleryCopy } = useText(galleryText);
  const [shown, setShown] = useState<DesignFormat | "all">("all");
  const choices = ["all", ...formats] as const;
  return (
    <div data-format-filter={shown} className="flex flex-col gap-4">
      {formats.length > 1 && (
        <RadioGroup
          label={galleryCopy.formats.label}
          variant="segment"
          value={shown}
          onValueChange={(value) => setShown(value as DesignFormat | "all")}
          className="w-full max-w-xl"
        >
          {choices.map((choice) => {
            const Icon = ICONS[choice];
            return (
              <RadioItem
                key={choice}
                value={choice}
                label={galleryCopy.formats[choice]}
                icon={<Icon />}
              />
            );
          })}
        </RadioGroup>
      )}
      {children}
    </div>
  );
}
