"use client";

import { ArrowDown, ArrowUp, PenLine, Plus, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { languageName } from "@/components/invitation/card-language-toggle";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import type { CardLanguage, InviteDraft } from "@/lib/editor/draft";
import {
  ALIGNS,
  BOXES,
  EDIT_STYLES,
  LINE_MAX,
  MAX_LINES,
  PLACES,
  canHide,
  defaultLayout,
  editableLines,
  hasOwnWords,
  type EditStyle,
  type PageLayout,
  type PageLine,
} from "@/lib/editor/pages";
import type { PageType } from "@/lib/editor/type";
import type { StoryBeat } from "@/lib/engine/story";
import type { FunctionId } from "@/lib/events/functions";
import type { SuiteId } from "@/lib/suites/catalog";
import type { CardCopy } from "@/lib/templates/content";
import type { Template } from "@/lib/templates/schema";
import { useWording, WordingStatus } from "./ai-wording";
import { PagePreview } from "./page-preview";
import type { StepProps } from "./steps/types";

type PageWordsProps = {
  draft: InviteDraft;
  update: StepProps["update"];
  /** The page as the invite writes it, for the suggested words. */
  written: StoryBeat;
  /** The page as guests will see it, with the host's changes. */
  shown: StoryBeat;
  language: CardLanguage;
  copy: CardCopy;
  template: Template;
  suite: SuiteId;
  textBox: boolean;
  type: PageType;
};

/**
 * Editing one page (Step 12s part 3): its words line by line, each drawn as the kind of
 * line the host picks in the theme's own lettering; where they sit in the painting's calm
 * area; a box or none; or the page left out. The phone above shows every change, and says
 * when the words no longer fit even at their smallest.
 */
export function PageWords(props: PageWordsProps) {
  const { draft, update, written, shown, language } = props;
  const { pageWordsCopy: t, studioCopy, functionCopy } = useText(editorText);
  const [overflow, setOverflow] = useState(false);
  const { aiCopy } = useText(editorText);
  const wording = useWording(draft, update);
  const id = written.id;
  const name = id.startsWith("fn-")
    ? functionCopy[id.slice(3) as FunctionId].name
    : (studioCopy.pageNames[id as keyof typeof studioCopy.pageNames] ?? id);
  const own = hasOwnWords(draft.pages, language, id);
  const lines = own ? draft.pages.words[language]![id]! : editableLines(written);
  const layout = draft.pages.layout[id] ?? defaultLayout;
  const bilingual = draft.languages.length > 1;

  const setLines = (next: PageLine[]) =>
    update((current) => ({
      ...current,
      pages: {
        ...current.pages,
        words: {
          ...current.pages.words,
          [language]: { ...current.pages.words[language], [id]: next },
        },
      },
    }));
  const reset = () =>
    update((current) => {
      const words = { ...current.pages.words[language] };
      delete words[id];
      return {
        ...current,
        pages: { ...current.pages, words: { ...current.pages.words, [language]: words } },
      };
    });
  const setLayout = (change: Partial<PageLayout>) =>
    update((current) => ({
      ...current,
      pages: {
        ...current.pages,
        layout: {
          ...current.pages.layout,
          [id]: { ...(current.pages.layout[id] ?? defaultLayout), ...change },
        },
      },
    }));
  const change = (index: number, line: Partial<PageLine>) =>
    setLines(lines.map((l, i) => (i === index ? { ...l, ...line } : l)));
  const move = (index: number, by: -1 | 1) => {
    const next = [...lines];
    const [line] = next.splice(index, 1);
    next.splice(index + by, 0, line!);
    setLines(next);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="shrink-0">
          <PenLine aria-hidden />
          {t.open}
        </Button>
      </DialogTrigger>
      <DialogContent
        title={t.title(name)}
        description={t.description}
        closeLabel={t.close}
        className="max-w-4xl"
      >
        <div className="grid gap-6 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
          <div className="flex justify-center md:sticky md:top-0 md:self-start">
            <PagePreview
              beats={[shown]}
              copy={props.copy}
              template={props.template}
              suite={props.suite}
              textBox={props.textBox}
              type={props.type}
              lang={language}
              page={id}
              onPage={() => {}}
              list={false}
              onOverflow={setOverflow}
              className="h-[min(38dvh,26rem)] md:h-[30rem]"
            />
          </div>

          <div className="flex min-w-0 flex-col gap-6">
            {overflow && (
              <div className="flex flex-col gap-2 rounded-md border border-danger/40 bg-danger/10 px-3 py-2">
                <p role="status" className="text-sm text-ink">
                  {t.overflow}
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="self-start"
                  loading={wording.pending}
                  onClick={() => wording.ask([shown], language, "traditional", "shorten")}
                >
                  <Sparkles aria-hidden />
                  {aiCopy.shorten}
                </Button>
                <WordingStatus wording={wording} />
              </div>
            )}

            <section aria-labelledby="page-words-heading" className="flex flex-col gap-3">
              <h3 id="page-words-heading" className="font-display text-lg">
                {t.words}
              </h3>
              {bilingual && (
                <p className="text-sm text-ink-muted">{t.inLanguage(languageName(language))}</p>
              )}
              {own && <p className="text-sm text-ink-muted">{t.own}</p>}
              <ol className="flex flex-col gap-4">
                {lines.map((line, index) => {
                  const n = index + 1;
                  return (
                    <li
                      key={index}
                      className="flex flex-col gap-2 rounded-lg border border-line p-3"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Select
                          aria-label={t.kind(n)}
                          value={line.style}
                          onValueChange={(style) => change(index, { style: style as EditStyle })}
                          options={EDIT_STYLES.map((style) => ({
                            value: style,
                            label: t.kinds[style],
                          }))}
                          className="min-w-0 flex-1 sm:max-w-48"
                        />
                        <span className="ms-auto flex items-center">
                          <IconButton
                            label={t.up(n)}
                            icon={<ArrowUp />}
                            variant="ghost"
                            size="sm"
                            disabled={index === 0}
                            onClick={() => move(index, -1)}
                          />
                          <IconButton
                            label={t.down(n)}
                            icon={<ArrowDown />}
                            variant="ghost"
                            size="sm"
                            disabled={index === lines.length - 1}
                            onClick={() => move(index, 1)}
                          />
                          <IconButton
                            label={t.remove(n)}
                            icon={<Trash2 />}
                            variant="ghost"
                            size="sm"
                            onClick={() => setLines(lines.filter((_, i) => i !== index))}
                          />
                        </span>
                      </div>
                      <Textarea
                        aria-label={t.line(n)}
                        value={line.text}
                        maxLength={LINE_MAX}
                        rows={line.text.length > 40 ? 2 : 1}
                        lang={language}
                        onChange={(event) => change(index, { text: event.target.value })}
                        className="min-h-11 resize-y"
                      />
                    </li>
                  );
                })}
              </ol>
              <div className="flex flex-wrap gap-2">
                {lines.length < MAX_LINES && (
                  <Button
                    variant="secondary"
                    onClick={() => setLines([...lines, { text: "", style: "body" }])}
                  >
                    <Plus aria-hidden />
                    {t.add}
                  </Button>
                )}
                {own && (
                  <Button variant="ghost" onClick={reset}>
                    <RotateCcw aria-hidden />
                    {t.reset}
                  </Button>
                )}
              </div>
            </section>

            <section
              aria-labelledby="page-place-heading"
              className="flex flex-col gap-4 border-t border-line pt-5"
            >
              <h3 id="page-place-heading" className="font-display text-lg">
                {t.placement}
              </h3>
              <Choice
                label={t.place}
                value={layout.place}
                options={PLACES.map((place) => [place, t.places[place]])}
                onChange={(place) => setLayout({ place: place as PageLayout["place"] })}
              />
              <Choice
                label={t.align}
                value={layout.align}
                options={ALIGNS.map((align) => [align, t.aligns[align]])}
                onChange={(align) => setLayout({ align: align as PageLayout["align"] })}
              />
              <Choice
                label={t.box}
                value={layout.box}
                options={BOXES.map((box) => [box, t.boxes[box]])}
                onChange={(box) => setLayout({ box: box as PageLayout["box"] })}
              />
              {canHide(id) && (
                <Switch
                  label={t.hide}
                  description={t.hideHint}
                  checked={layout.hidden}
                  onCheckedChange={(hidden) => setLayout({ hidden })}
                />
              )}
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Choice({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: (readonly [string, string])[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span aria-hidden className="text-sm font-medium">
        {label}
      </span>
      <RadioGroup label={label} orientation="horizontal" value={value} onValueChange={onChange}>
        {options.map(([option, text]) => (
          <RadioItem key={option} value={option} label={text} />
        ))}
      </RadioGroup>
    </div>
  );
}
