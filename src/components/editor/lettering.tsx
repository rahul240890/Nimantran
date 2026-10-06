"use client";

import { Bold, CaseUpper, Italic, RotateCcw } from "lucide-react";
import { RadioGroup as RadioPrimitive } from "radix-ui";
import type { CSSProperties, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { cn } from "@/lib/cn";
import { cardLanguages, draftCopy, type InviteDraft } from "@/lib/editor/draft";
import {
  FONTS,
  NAME_COLOURS,
  NAME_COLOUR_VALUE,
  SCRIPT_SAMPLE,
  TYPE_SIZES,
  defaultType,
  fontStack,
  fontsFor,
  scriptOf,
  usableFont,
  type FontId,
  type TypeStyle,
} from "@/lib/editor/type";

const THEME = "theme";

/** A row of choices drawn as tiles: arrow keys move between them, as in any radio group. */
function Tiles({
  label,
  value,
  onValueChange,
  className,
  children,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <RadioPrimitive.Root
      aria-label={label}
      value={value}
      onValueChange={onValueChange}
      className={cn("grid gap-2", className)}
    >
      {children}
    </RadioPrimitive.Root>
  );
}

const TILE =
  "group/tile relative flex min-h-11 cursor-pointer flex-col rounded-lg border border-line-strong bg-surface text-start transition-[border-color,box-shadow,background-color] duration-200 hover:border-line-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[state=checked]:border-marigold data-[state=checked]:bg-[color-mix(in_srgb,var(--marigold)_10%,var(--surface))] data-[state=checked]:shadow-[0_0_0_1px_var(--marigold)]";

/** One font, shown writing the host's own words in it. */
function FontTile({
  value,
  name,
  sample,
  font,
  lang,
}: {
  value: string;
  name: string;
  sample: string;
  font?: string;
  lang: string;
}) {
  return (
    <RadioPrimitive.Item value={value} className={cn(TILE, "gap-1 px-3 py-2.5")}>
      <span
        aria-hidden
        lang={lang}
        className={cn(
          "block truncate text-[1.45rem] leading-tight text-ink",
          !font && "font-display",
        )}
        style={font ? { fontFamily: font } : undefined}
      >
        {sample}
      </span>
      <span className="truncate text-xs text-ink-muted">{name}</span>
    </RadioPrimitive.Item>
  );
}

/**
 * The lettering on the event pages (Step 12n): a font for the names and one for the other
 * words, each shown writing the host's own names, then size, bold, italic, capitals and the
 * names' colour. Only fonts that can write every one of the card's languages are offered.
 */
export function Lettering({
  draft,
  update,
  headless = false,
}: {
  draft: InviteDraft;
  update: (change: (draft: InviteDraft) => InviteDraft) => void;
  /** Inside a fold that already carries the heading and intro. */
  headless?: boolean;
}) {
  const { studioCopy } = useText(editorText);
  const languages = cardLanguages(draft);
  const main = languages[0];
  const { type } = draft;
  const set = (change: Partial<TypeStyle>) =>
    update((current) => ({ ...current, type: { ...current.type, ...change } }));

  const copy = draftCopy(draft, main);
  const nameSample = copy.first.trim() || SCRIPT_SAMPLE[scriptOf(main)];
  const wordSample = SCRIPT_SAMPLE[scriptOf(main)];
  const names = usableFont(type.names, languages, "names");
  const words = usableFont(type.words, languages, "words");

  const fontTiles = (role: "names" | "words", sample: string) => (
    <>
      <FontTile value={THEME} name={studioCopy.themeFont} sample={sample} lang={main} />
      {fontsFor(languages, role).map((id) => (
        <FontTile
          key={id}
          value={id}
          name={`${FONTS[id].family.replace(/ Variable$/, "")} · ${studioCopy.feels[FONTS[id].feel]}`}
          sample={sample}
          font={fontStack(id)}
          lang={main}
        />
      ))}
    </>
  );
  const pick = (value: string) => (value === THEME ? null : (value as FontId));
  const toggles: { key: "bold" | "italic" | "capitals"; label: string; icon: ReactNode }[] = [
    { key: "bold", label: studioCopy.bold, icon: <Bold aria-hidden /> },
    { key: "italic", label: studioCopy.italic, icon: <Italic aria-hidden /> },
    { key: "capitals", label: studioCopy.capitals, icon: <CaseUpper aria-hidden /> },
  ];
  const changed = JSON.stringify(type) !== JSON.stringify(defaultType);

  return (
    <section
      aria-labelledby={headless ? undefined : "lettering-heading"}
      aria-label={headless ? studioCopy.lettering : undefined}
      data-page-target="cover"
      className={cn("flex flex-col gap-6", !headless && "border-t border-line pt-6")}
    >
      {!headless && (
        <div className="flex flex-col gap-1">
          <h2 id="lettering-heading" className="font-display text-xl">
            {studioCopy.lettering}
          </h2>
          <p className="text-sm text-ink-muted">{studioCopy.letteringIntro}</p>
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        <h3 id="names-font" className="font-semibold text-ink">
          {studioCopy.namesFont}
        </h3>
        <Tiles
          label={studioCopy.namesFont}
          value={names ?? THEME}
          onValueChange={(value) => set({ names: pick(value) })}
          className="grid-cols-2 sm:grid-cols-3"
        >
          {fontTiles("names", nameSample)}
        </Tiles>
      </div>

      <div className="flex flex-col gap-2.5">
        <h3 className="font-semibold text-ink">{studioCopy.wordsFont}</h3>
        <Tiles
          label={studioCopy.wordsFont}
          value={words ?? THEME}
          onValueChange={(value) => set({ words: pick(value) })}
          className="grid-cols-2 sm:grid-cols-3"
        >
          {fontTiles("words", wordSample)}
        </Tiles>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2.5">
          <h3 className="font-semibold text-ink">{studioCopy.size}</h3>
          <Tiles
            label={studioCopy.size}
            value={type.size}
            onValueChange={(value) => set({ size: value as TypeStyle["size"] })}
            className="grid-cols-3"
          >
            {TYPE_SIZES.map((size, index) => (
              <RadioPrimitive.Item
                key={size}
                value={size}
                className={cn(TILE, "items-center justify-center gap-0.5 px-2 py-1.5")}
              >
                <span
                  aria-hidden
                  className="font-display leading-none text-ink"
                  style={{ fontSize: `${1 + index * 0.25}rem` }}
                >
                  {SCRIPT_SAMPLE.latin}
                </span>
                <span className="text-xs text-ink-muted">{studioCopy.sizes[size]}</span>
              </RadioPrimitive.Item>
            ))}
          </Tiles>
        </div>

        <div className="flex flex-col gap-2.5">
          <h3 id="name-style" className="font-semibold text-ink">
            {studioCopy.style}
          </h3>
          <div role="group" aria-labelledby="name-style" className="grid grid-cols-3 gap-2">
            {toggles.map(({ key, label, icon }) => (
              <button
                key={key}
                type="button"
                aria-pressed={type[key]}
                onClick={() => set({ [key]: !type[key] })}
                className={cn(
                  TILE,
                  "items-center justify-center gap-0.5 px-2 py-1.5 aria-pressed:border-marigold aria-pressed:bg-[color-mix(in_srgb,var(--marigold)_10%,var(--surface))] aria-pressed:shadow-[0_0_0_1px_var(--marigold)] [&_svg]:size-5 [&_svg]:text-ink",
                )}
              >
                {icon}
                <span className="text-xs text-ink-muted">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <h3 className="font-semibold text-ink">{studioCopy.colour}</h3>
        <Tiles
          label={studioCopy.colour}
          value={type.colour}
          onValueChange={(value) => set({ colour: value as TypeStyle["colour"] })}
          className="grid-cols-3 sm:grid-cols-6"
        >
          {NAME_COLOURS.map((colour) => (
            <RadioPrimitive.Item
              key={colour}
              value={colour}
              className={cn(TILE, "items-center gap-1.5 px-1.5 py-2")}
            >
              <span
                aria-hidden
                className={cn(
                  "block size-7 rounded-full border border-line-strong shadow-raised",
                  colour === THEME &&
                    "bg-[conic-gradient(var(--card-back),var(--card-gold-text),var(--card-accent-text),var(--card-ink),var(--card-back))]",
                )}
                style={
                  colour === THEME
                    ? undefined
                    : ({ background: NAME_COLOUR_VALUE[colour] } as CSSProperties)
                }
              />
              <span className="text-center text-xs leading-tight text-ink-muted">
                {studioCopy.colours[colour]}
              </span>
            </RadioPrimitive.Item>
          ))}
        </Tiles>
      </div>

      {changed && (
        <Button
          variant="ghost"
          size="sm"
          leadingIcon={<RotateCcw aria-hidden />}
          onClick={() => update((current) => ({ ...current, type: defaultType }))}
          className="self-start"
        >
          {studioCopy.reset}
        </Button>
      )}
    </section>
  );
}
