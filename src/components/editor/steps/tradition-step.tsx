"use client";

import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { DecorSvg } from "@/components/invitation/art/decor-svg";
import { NO_SYMBOL, SYMBOLS } from "@/components/invitation/art/symbols";
import { useVisitor } from "@/lib/categories/use-visitor";
import {
  ceremonyName,
  draftCategory,
  draftSymbol,
  draftTradition,
  includedFunctions,
  withTradition,
} from "@/lib/editor/draft";
import { TEMPLATES } from "@/lib/templates/catalog";
import { stockStyle } from "@/lib/templates/stock";
import { allowsTradition, isTraditionId, rankTraditions } from "@/lib/traditions/catalog";
import {
  INVOCATION_MODES,
  type InvocationMode,
  type SymbolId,
  type TraditionPack,
} from "@/lib/traditions/schema";
import type { StepProps } from "./types";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";

const NONE = "none";

/** A sacred symbol on a chip of the chosen design's card stock. */
function SymbolChip({ symbol, draft }: { symbol: SymbolId | null; draft: StepProps["draft"] }) {
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

function ReligiousElements({ draft, update, pack }: StepProps & { pack: TraditionPack }) {
  const { traditionCopy } = useText(editorText);
  const symbol = draftSymbol(draft);
  const invocation = pack.invocation;
  const setTradition = (change: Partial<StepProps["draft"]["tradition"]>) =>
    update((current) => ({ ...current, tradition: { ...current.tradition, ...change } }));

  return (
    <section
      aria-labelledby="elements-heading"
      className="flex flex-col gap-6 border-t border-line pt-6"
    >
      <h2 id="elements-heading" className="font-display text-xl">
        {traditionCopy.elements}
      </h2>

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
            onValueChange={(value) => setTradition({ invocation: value as InvocationMode })}
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

function Ceremonies({ draft, pack }: Pick<StepProps, "draft"> & { pack: TraditionPack }) {
  const { functionCopy, traditionCopy } = useText(editorText);
  const named = includedFunctions(draft).flatMap((id) => {
    const local = ceremonyName(draft, id);
    return local ? [{ id, local }] : [];
  });
  if (named.length === 0) return null;
  return (
    <section
      aria-labelledby="ceremonies-heading"
      className="flex flex-col gap-3 border-t border-line pt-6"
    >
      <div className="flex flex-col gap-1">
        <h2 id="ceremonies-heading" className="font-display text-xl">
          {traditionCopy.ceremonies}
        </h2>
        <p className="text-sm text-ink-muted">{traditionCopy.ceremoniesIntro}</p>
      </div>
      <dl className="grid gap-x-6 gap-y-2 text-sm min-[480px]:grid-cols-2">
        {named.map(({ id, local }) => (
          <div key={id} className="flex flex-wrap items-baseline gap-x-2">
            <dt className="text-ink-muted">{functionCopy[id].name}</dt>
            <dd className="font-semibold">
              <span lang={pack.language}>{local.native}</span>
              <span className="font-normal text-ink-muted"> ({local.latin})</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function TraditionStep(props: StepProps) {
  const { draft, update } = props;
  const { traditionCopy } = useText(editorText);
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
          // A new tradition starts from its own symbol and suggests its own card language
          update((current) => withTradition(current, isTraditionId(value) ? value : null))
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
        <>
          <ReligiousElements {...props} pack={pack} />
          <Ceremonies draft={draft} pack={pack} />
        </>
      )}
    </div>
  );
}
