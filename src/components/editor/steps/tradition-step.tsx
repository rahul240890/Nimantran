"use client";

import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { useVisitor } from "@/lib/categories/use-visitor";
import { draftCategory, draftTradition, withTradition } from "@/lib/editor/draft";
import { allowsTradition, isTraditionId, rankTraditions } from "@/lib/traditions/catalog";
import type { StepProps } from "./types";
import { SymbolChip } from "./sacred-elements";
import { useLocale, useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";

const NONE = "none";

export function TraditionStep({ draft, update }: StepProps) {
  const { traditionCopy } = useText(editorText);
  const locale = useLocale();
  const visitor = useVisitor();
  const pack = draftTradition(draft);
  if (!allowsTradition(draftCategory(draft))) return null;

  return (
    <div className="flex flex-col gap-8">
      <p className="flex gap-3 rounded-lg border border-line bg-surface-2/60 p-4 text-sm text-ink-muted">
        <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-text" />
        {traditionCopy.draftNote}
      </p>

      <RadioGroup
        label={traditionCopy.group}
        variant="card"
        value={draft.tradition.id ?? NONE}
        onValueChange={(value) =>
          // A new tradition starts from its own symbol and suggests its own card language;
          // one without its own keeps the card in the site's language
          update((current) => withTradition(current, isTraditionId(value) ? value : null, locale))
        }
        className="grid-cols-1 min-[480px]:grid-cols-2 xl:grid-cols-3"
      >
        {rankTraditions(visitor).map((option) => {
          const near = Boolean(visitor.region && option.regions.includes(visitor.region));
          return (
            <RadioItem
              key={option.id}
              value={option.id}
              label={
                <span className="flex flex-col">
                  <span className="font-display text-lg leading-tight font-normal">
                    {traditionCopy.names[option.id]}
                  </span>
                  {option.nativeName && (
                    <span lang={option.language} className="text-sm font-normal text-accent-text">
                      {option.nativeName}
                    </span>
                  )}
                </span>
              }
              description={traditionCopy.hints[option.id]}
              badge={
                near ? (
                  <Badge tone="gold" className="h-6 px-2 text-xs">
                    {traditionCopy.nearYou}
                  </Badge>
                ) : undefined
              }
              icon={<SymbolChip symbol={option.symbols.default} draft={draft} />}
            />
          );
        })}
        <RadioItem
          value={NONE}
          label={
            <span className="font-display text-lg leading-tight font-normal">
              {traditionCopy.none}
            </span>
          }
          description={traditionCopy.noneHint}
          icon={<SymbolChip symbol={null} draft={draft} />}
        />
      </RadioGroup>

      {pack && pack.community !== "modern" && (
        <p className="text-sm text-ink-muted">{traditionCopy.elementsLater}</p>
      )}
    </div>
  );
}
