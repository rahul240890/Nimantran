"use client";

import { Image as ImageIcon, Layers } from "lucide-react";
import { isInviteFormat } from "@/lib/editor/formats";
import { TemplateCover } from "@/components/brand/template-cover";
import { TierBadge } from "@/components/pricing/tier-badge";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { draftCategory, draftTradition } from "@/lib/editor/draft";
import { isTemplateId, type TemplateId } from "@/lib/templates/ids";
import type { StepProps } from "./types";
import { SuiteThumb } from "@/components/invitation/story/suite-thumb";
import {
  SUITES,
  SUITE_IDS,
  hasBlessingPage,
  isSceneTheme,
  isSuiteId,
  suiteFor,
  suiteSuits,
  type SuiteId,
} from "@/lib/suites/catalog";
import { hasScene } from "@/lib/suites/scene";
import { OpeningPicker } from "@/components/editor/opening-picker";
import { useLocale, useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";

export function DesignStep({ draft, update }: StepProps) {
  const { designCopy, occasionCopy, stepCopy, suiteCopy } = useText(editorText);
  const locale = useLocale();
  const category = draftCategory(draft);
  // The tradition's designs lead, then the occasion's
  const tradition = draftTradition(draft);
  const suggested: readonly TemplateId[] = [
    ...new Set([...(tradition?.templates ?? []), ...category.templates]),
  ];
  // Only the designs made for this occasion and tradition, best first, and the one chosen
  const order = suggested.includes(draft.templateId) ? suggested : [...suggested, draft.templateId];
  const allSuggested = order.length === suggested.length;

  // The event pages' theme: the host's choice, else the one their tradition suggests
  const suggestedSuite = suiteFor({
    ...draft,
    suite: null,
    tradition: draft.tradition.id,
    category: draft.categoryId,
  });
  const suite = draft.suite ?? suggestedSuite;
  // A Scene theme only shows as a Scene, so there is no choice of kind to make
  const sceneOnly = isSceneTheme(suite);
  const offersFormats = hasScene(suite) && !sceneOnly;
  // The gallery design each choice makes, for its Free or Premium badge (Admin, Designs)
  const themeDesign = (id: SuiteId, format = draft.format) =>
    id === "classic"
      ? `card-${draft.templateId}`
      : (format === "scene" || isSceneTheme(id)) && hasScene(id)
        ? `${id}-scene`
        : id;

  return (
    <div className="flex flex-col gap-10">
      <RadioGroup
        label={stepCopy.design.eyebrow}
        variant="card"
        value={draft.templateId}
        onValueChange={(value) => {
          if (isTemplateId(value)) update((current) => ({ ...current, templateId: value }));
        }}
        className="grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-2 xl:grid-cols-3"
      >
        {order.map((id) => {
          const isSuggested = !allSuggested && suggested.includes(id);
          return (
            <RadioItem
              key={id}
              value={id}
              label={
                <>
                  {designCopy[id].name}
                  {isSuggested && (
                    <span className="sr-only">
                      , {occasionCopy.suggestedFor(category.names[locale])}
                    </span>
                  )}
                </>
              }
              description={
                <>
                  {/* A card's own price counts only when the card is the whole design */}
                  {suite === "classic" && (
                    <TierBadge
                      designId={`card-${id}`}
                      variant="plain"
                      className="mb-1.5 flex w-fit"
                    />
                  )}
                  {designCopy[id].description}
                </>
              }
              badge={
                isSuggested ? (
                  <Badge aria-hidden tone="gold" className="h-6 px-2 text-xs">
                    {occasionCopy.suggestedBadge}
                  </Badge>
                ) : undefined
              }
              icon={
                <span className="block w-16 sm:w-20">
                  <TemplateCover id={id} className="rounded-sm shadow-raised" />
                </span>
              }
            />
          );
        })}
      </RadioGroup>

      <section aria-labelledby="suite-heading" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <h3 id="suite-heading" className="font-display text-2xl leading-tight">
            {suiteCopy.heading}
          </h3>
          <p className="max-w-2xl text-ink-muted">{suiteCopy.intro}</p>
        </div>
        <RadioGroup
          label={suiteCopy.heading}
          variant="card"
          value={suite}
          onValueChange={(value) => {
            if (!isSuiteId(value)) return;
            const pair = SUITES[value].template;
            // A theme brings its matching card design with it
            update((current) => ({
              ...current,
              suite: value,
              templateId: pair ?? current.templateId,
            }));
          }}
          className="grid-cols-1 min-[400px]:grid-cols-2"
        >
          {SUITE_IDS.filter(
            // Themes painted for this occasion, the card colours, and whatever is chosen
            (id) => suiteSuits(id, draft.categoryId) || id === "classic" || id === suite,
          ).map((id) => {
            const pair = SUITES[id].template;
            const isSuggested = id === suggestedSuite;
            // Only a chosen tradition can be "yours"; otherwise the occasion's design suggests it
            const suggestion = draft.tradition.id
              ? suiteCopy.suggested
              : occasionCopy.suggestedBadge;
            return (
              <RadioItem
                key={id}
                value={id}
                label={
                  <>
                    {suiteCopy.names[id]}
                    {isSuggested && <span className="sr-only">, {suggestion}</span>}
                  </>
                }
                description={
                  <>
                    <TierBadge
                      designId={themeDesign(id)}
                      variant="plain"
                      className="mb-1.5 flex w-fit"
                    />
                    {suiteCopy.descriptions[id]}
                    {pair && pair !== draft.templateId && (
                      <span className="mt-1 block text-sm">
                        {suiteCopy.pairs(designCopy[pair].name)}
                      </span>
                    )}
                  </>
                }
                badge={
                  isSuggested ? (
                    <Badge aria-hidden tone="gold" className="h-6 px-2 text-xs">
                      {suiteCopy.suggested}
                    </Badge>
                  ) : undefined
                }
                icon={<SuiteThumb id={id} className="w-14 sm:w-16" />}
              />
            );
          })}
        </RadioGroup>
        {offersFormats && (
          <h4 className="font-display text-xl leading-tight">{suiteCopy.formatHeading}</h4>
        )}
        {offersFormats && (
          <RadioGroup
            label={suiteCopy.formatHeading}
            variant="card"
            value={draft.format}
            onValueChange={(value) => {
              if (isInviteFormat(value)) update((current) => ({ ...current, format: value }));
            }}
            className="grid-cols-1 min-[400px]:grid-cols-2"
          >
            {(["scene", "story"] as const).map((format) => (
              <RadioItem
                key={format}
                value={format}
                label={suiteCopy.formats[format].name}
                description={
                  <>
                    <TierBadge
                      designId={themeDesign(suite, format)}
                      variant="plain"
                      className="mb-1.5 flex w-fit"
                    />
                    {suiteCopy.formats[format].description}
                  </>
                }
                icon={
                  format === "scene" ? (
                    <ImageIcon aria-hidden className="size-6 text-accent-text" />
                  ) : (
                    <Layers aria-hidden className="size-6 text-accent-text" />
                  )
                }
              />
            ))}
          </RadioGroup>
        )}
        {SUITES[suite].art !== "card" && draft.format !== "scene" && !sceneOnly && (
          <Switch
            label={suiteCopy.textBox}
            description={suiteCopy.textBoxHint}
            checked={draft.textBox}
            onCheckedChange={(textBox) => update((current) => ({ ...current, textBox }))}
          />
        )}
        {hasBlessingPage(suite) && (
          <Switch
            label={suiteCopy.blessingPage}
            description={suiteCopy.blessingPageHint}
            checked={draft.blessingPage}
            onCheckedChange={(blessingPage) => update((current) => ({ ...current, blessingPage }))}
          />
        )}
      </section>

      <OpeningPicker
        draft={draft}
        suite={suite}
        scene={(draft.format === "scene" || sceneOnly) && hasScene(suite)}
        update={update}
      />
    </div>
  );
}
