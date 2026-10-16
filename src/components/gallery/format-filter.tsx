"use client";

import { Image as ImageIcon, Layers, LayoutGrid, Rotate3d } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { createContext, useContext, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { useText } from "@/i18n/client";
import { galleryText } from "@/i18n/copy/gallery";

/** The kinds of design a gallery list can hold. */
export type DesignFormat = "scene" | "story" | "card";

const ICONS = { all: LayoutGrid, scene: ImageIcon, story: Layers, card: Rotate3d } as const;

/** Whether the designs past the first few are showing: Show all, or a kind chosen. */
const AllShown = createContext(true);

/** The designs a long list holds back until Show all, or until a kind is chosen. */
export function useAllShown() {
  return useContext(AllShown);
}

/**
 * Shows one kind of design at a time: Scenes, Stories or 3D cards. The first designs are
 * drawn on the server and the rest (`more`) wait for Show all, so a long list stays light
 * on a phone; choosing a kind shows every design of it, so none is missed. Otherwise the
 * choice only hides the others.
 */
export function FormatFilter({
  formats,
  more = 0,
  total,
  children,
}: {
  /** The kinds in this list, in the order they appear. */
  formats: readonly DesignFormat[];
  /** How many designs wait for Show all (rendered with useAllShown). */
  more?: number;
  /** Every design in the list, to count in Show all. */
  total?: number;
  children: ReactNode;
}) {
  const { galleryCopy } = useText(galleryText);
  const [shown, setShown] = useState<DesignFormat | "all">("all");
  const [expanded, setExpanded] = useState(false);
  const all = more === 0 || expanded || shown !== "all";
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
      <AllShown value={all}>{children}</AllShown>
      {!all && (
        <Button
          variant="secondary"
          size="lg"
          className="self-center"
          onClick={() => setExpanded(true)}
        >
          {galleryCopy.showAll(total ?? more)}
          <ChevronDown aria-hidden />
        </Button>
      )}
    </div>
  );
}
