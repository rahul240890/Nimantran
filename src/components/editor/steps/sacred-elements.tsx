"use client";

import { DecorSvg } from "@/components/invitation/art/decor-svg";
import { NO_SYMBOL, SYMBOLS } from "@/components/invitation/art/symbols";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { draftSymbol, draftTradition } from "@/lib/editor/draft";
import { TEMPLATES } from "@/lib/templates/catalog";
import { stockStyle } from "@/lib/templates/stock";
import { INVOCATION_MODES, type InvocationMode, type SymbolId } from "@/lib/traditions/schema";
import type { StepProps } from "./types";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";

const NONE = "none";

/** A sacred symbol on a chip of the chosen design's card stock. */
export function SymbolChip({
  symbol,
  draft,
}: {
  symbol: SymbolId | null;
  draft: StepProps["draft"];
}) {
  const sacred = symbol ? SYMBOLS[symbol] : null;
  return (
    <span
      style={stockStyle(TEMPLATES[draft.templateId])}
      className="grid size-11 place-items-center rounded-full border border-[color-mix(in_srgb,var(--card-gold)_55%,transparent)] shadow-raised"
    >
      <span
        className="grid size-full place-items-center rounded-full"
        style={{ background: "var(--card-paper)" }}
      >
        {sacred?.kind === "glyph" ? (
          <span
            className={sacred.font === "display" ? "font-display text-2xl" : "text-2xl"}
            style={{ color: "var(--card-gold-text)" }}
          >
            {sacred.text}
          </span>
        ) : (
          <DecorSvg
            layers={[
              {
                items: [
                  {
                    at: [12, 12],
                    scale: 9,
                    shapes: sacred?.kind === "art" ? sacred.shapes : NO_SYMBOL,
                  },
                ],
              },
            ]}
            width={24}
            height={24}
            className="size-8"
          />
        )}
      </span>
    </span>
  );
}

/**
 * The top of the card in the card words: the tradition's sacred symbol and its invocation
 * (Shri Ganeshaya Namah and the like), each prefilled from the tradition. Choosing an
 * invocation puts it back in the blessing line, over anything typed there.
 */
export function SacredElements({ draft, update }: Pick<StepProps, "draft" | "update">) {
  const { traditionCopy } = useText(editorText);
  const pack = draftTradition(draft);
  if (!pack || pack.community === "modern") return null;
  const symbol = draftSymbol(draft);
  const invocation = pack.invocation;
  if (pack.symbols.options.length === 0 && !invocation) return null;
  const setTradition = (change: Partial<StepProps["draft"]["tradition"]>) =>
    update((current) => ({ ...current, tradition: { ...current.tradition, ...change } }));
  const setInvocation = (mode: InvocationMode) =>
    update((current) => {
      const content = { ...current.content };
      delete content.blessing;
      return { ...current, content, tradition: { ...current.tradition, invocation: mode } };
    });

  return (
    <section
      aria-labelledby="elements-heading"
      data-page-target="cover"
      className="flex flex-col gap-6 border-b border-line pb-8"
    >
      <div className="flex flex-col gap-1">
        <h2 id="elements-heading" className="font-display text-xl">
          {traditionCopy.elements}
        </h2>
        <p className="text-sm text-ink-muted">
          {traditionCopy.elementsIntro(traditionCopy.names[pack.id])}
        </p>
      </div>

      {pack.symbols.options.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold">{traditionCopy.symbol}</h3>
          <RadioGroup
            label={traditionCopy.symbol}
            variant="card"
            value={symbol ?? NONE}
            onValueChange={(value) =>
              setTradition({ symbol: value === NONE ? "none" : (value as SymbolId) })
            }
            className="grid-cols-2 min-[480px]:grid-cols-3 lg:grid-cols-5"
          >
            {[...pack.symbols.options, null].map((id) => (
              <RadioItem
                key={id ?? NONE}
                value={id ?? NONE}
                label={id ? traditionCopy.symbolNames[id] : traditionCopy.noSymbol}
                icon={<SymbolChip symbol={id} draft={draft} />}
              />
            ))}
          </RadioGroup>
          <p className="text-sm text-ink-muted">{traditionCopy.symbolNote}</p>
        </div>
      )}

      {invocation && (
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold">{traditionCopy.invocation}</h3>
          <RadioGroup
            label={traditionCopy.invocation}
            value={draft.tradition.invocation}
            onValueChange={(value) => setInvocation(value as InvocationMode)}
          >
            {INVOCATION_MODES.map((mode) => (
              <RadioItem
                key={mode}
                value={mode}
                label={
                  mode === "off" ? (
                    traditionCopy.invocationModes.off
                  ) : (
                    <span className="flex flex-col">
                      <span>{traditionCopy.invocationModes[mode]}</span>
                      <span
                        lang={mode === "script" ? pack.language : "en"}
                        className="text-accent-text"
                      >
                        {invocation[mode]}
                      </span>
                    </span>
                  )
                }
                description={mode === "off" ? undefined : traditionCopy.meanings[invocation.latin]}
              />
            ))}
          </RadioGroup>
        </div>
      )}
    </section>
  );
}
