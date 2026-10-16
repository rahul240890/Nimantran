"use client";

import { DecorSvg } from "@/components/invitation/art/decor-svg";
import { NO_SYMBOL, SYMBOLS, glyphScale } from "@/components/invitation/art/symbols";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { draftFaith, draftSymbol, draftTradition, symbolOptions } from "@/lib/editor/draft";
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
          // Drawn like the other symbols, a picture beside its name, sized to fit the chip
          <svg aria-hidden viewBox="0 0 24 24" className="size-8 overflow-visible">
            <text
              x="12"
              y="12.5"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={22 * glyphScale(sacred)}
              fill="var(--card-gold-text)"
              className={sacred.font === "display" ? "font-display" : "font-sans"}
            >
              {sacred.text}
            </text>
          </svg>
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
 * The top of the card in the card words: its sacred symbol, offered to every family by
 * their faith (a Khanda, a crescent, a cross, Shri or a kalash), and a tradition's own
 * invocation (Shri Ganeshaya Namah and the like), each prefilled from the tradition.
 * Choosing an invocation puts it back in the blessing line, over anything typed there.
 */
export function SacredElements({ draft, update }: Pick<StepProps, "draft" | "update">) {
  const { traditionCopy } = useText(editorText);
  const options = symbolOptions(draft);
  const found = draftTradition(draft);
  const pack = found && found.community !== "modern" && draftFaith(draft) !== "none" ? found : null;
  const invocation = pack?.invocation ?? null;
  if (options.length === 0 && !invocation) return null;
  const symbol = draftSymbol(draft);
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
          {invocation ? traditionCopy.elements : traditionCopy.symbol}
        </h2>
        <p className="text-sm text-ink-muted">
          {pack
            ? traditionCopy.elementsIntro(traditionCopy.names[pack.id])
            : traditionCopy.symbolIntro}
        </p>
      </div>

      {options.length > 0 && (
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
            {[...options, null].map((id) => (
              <RadioItem
                key={id ?? NONE}
                value={id ?? NONE}
                label={id ? traditionCopy.symbolNames[id] : traditionCopy.noSymbol}
                icon={<SymbolChip symbol={id} draft={draft} />}
              />
            ))}
          </RadioGroup>
          {/* The painted gods are Hindu: only a Hindu card is pointed to them */}
          {draftFaith(draft) === "hindu" && (
            <p className="text-sm text-ink-muted">{traditionCopy.symbolNote}</p>
          )}
        </div>
      )}

      {pack && invocation && (
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
