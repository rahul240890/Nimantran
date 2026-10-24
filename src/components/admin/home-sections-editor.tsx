"use client";

import { ArrowDown, ArrowUp, ListRestart, Pencil, Plus, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveHomeSectionsSettings } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";
import {
  SECTION_PICKS,
  SECTION_SHOWN,
  type HomeSectionId,
  type HomeSections,
} from "@/lib/gallery/home-sections";

/** A section as the admin page knows it: its name, the designs it may show, and its own fill. */
export type SectionInfo = {
  id: HomeSectionId;
  title: string;
  /** Every design the section may be given. */
  choices: string[];
  /** What it shows when it fills itself. */
  auto: string[];
};

/** One list moved: the item at `index` swaps with its neighbour `by` away. */
function swap<T>(list: readonly T[], index: number, by: -1 | 1): T[] {
  const next = [...list];
  const other = index + by;
  if (other < 0 || other >= next.length) return next;
  [next[index], next[other]] = [next[other]!, next[index]!];
  return next;
}

/**
 * The home page's sections (Admin, Home page): each switched on or off, moved up or down,
 * and given its own designs or left to fill itself. One Save for all of it.
 */
export function HomeSectionsEditor({
  sections,
  names,
  saved,
}: {
  sections: SectionInfo[];
  /** Each design's name and kind, by id. */
  names: Record<string, string>;
  saved: HomeSections;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [order, setOrder] = useState(saved.order);
  const [hidden, setHidden] = useState(saved.hidden);
  const [designs, setDesigns] = useState(saved.designs);
  const [open, setOpen] = useState<HomeSectionId | null>(null);
  const info = new Map(sections.map((section) => [section.id, section]));
  const name = (id: string) => names[id] ?? id;
  const changed =
    JSON.stringify({ order, hidden, designs }) !==
    JSON.stringify({ order: saved.order, hidden: saved.hidden, designs: saved.designs });

  const setChosen = (id: HomeSectionId, list: string[] | null) =>
    setDesigns((all) => {
      const next = { ...all };
      if (list && list.length) next[id] = list;
      else delete next[id];
      return next;
    });

  const save = () =>
    startTransition(async () => {
      const ok = await saveHomeSectionsSettings({ order, hidden, designs }).catch(() => null);
      if (ok) {
        toast({
          title: "Home page saved",
          description: "The home page shows it within a minute.",
          tone: "success",
        });
        router.refresh();
      } else {
        toast({ title: "Couldn't save. Try again.", tone: "error" });
      }
    });

  return (
    <div className="flex flex-col gap-4">
      <ol className="flex flex-col gap-3">
        {order.map((id, index) => {
          const section = info.get(id);
          if (!section) return null;
          const shown = !hidden.includes(id);
          const chosen = designs[id] ?? null;
          const editing = open === id;
          return (
            <li key={id} data-home-section={id}>
              <Card className={cn(!shown && "border-dashed")}>
                <CardBody className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <h2 className="font-display text-xl leading-tight">
                        {index + 1}. {section.title}
                      </h2>
                      <p className="text-sm text-ink-muted">
                        {chosen ? `Your ${chosen.length} chosen designs` : "Fills itself"}
                        {shown ? "" : " · Hidden"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <IconButton
                        label={`Move ${section.title} up`}
                        icon={<ArrowUp />}
                        variant="ghost"
                        disabled={index === 0}
                        onClick={() => setOrder((list) => swap(list, index, -1))}
                      />
                      <IconButton
                        label={`Move ${section.title} down`}
                        icon={<ArrowDown />}
                        variant="ghost"
                        disabled={index === order.length - 1}
                        onClick={() => setOrder((list) => swap(list, index, 1))}
                      />
                    </div>
                  </div>
                  <Switch
                    label="Show on the home page"
                    checked={shown}
                    onCheckedChange={(on) =>
                      setHidden((list) => (on ? list.filter((item) => item !== id) : [...list, id]))
                    }
                  />
                  <div className="flex flex-col gap-2">
                    <p className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase">
                      {chosen ? "Designs, in order" : "Shows now"}
                    </p>
                    <p className="text-sm text-ink-muted">
                      {(chosen ?? section.auto).slice(0, SECTION_SHOWN).map(name).join(" · ") ||
                        "Nothing yet"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        aria-expanded={editing}
                        onClick={() => {
                          if (!chosen) setChosen(id, section.auto.slice(0, SECTION_PICKS));
                          setOpen(editing ? null : id);
                        }}
                      >
                        <Pencil aria-hidden />
                        {chosen ? (editing ? "Done" : "Change designs") : "Choose designs"}
                      </Button>
                      {chosen && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setChosen(id, null);
                            setOpen(null);
                          }}
                        >
                          <ListRestart aria-hidden />
                          Let it fill itself
                        </Button>
                      )}
                    </div>
                  </div>
                  {editing && chosen && (
                    <DesignList
                      sectionTitle={section.title}
                      list={chosen}
                      choices={section.choices}
                      name={name}
                      onChange={(list) => setChosen(id, list)}
                    />
                  )}
                </CardBody>
              </Card>
            </li>
          );
        })}
      </ol>
      <div className="sticky bottom-4 z-10 flex justify-end">
        <Button onClick={save} loading={pending} disabled={!changed} className="shadow-float">
          <Save aria-hidden />
          Save the home page
        </Button>
      </div>
    </div>
  );
}

/** A section's own designs: moved up, taken out, or added by name. */
function DesignList({
  sectionTitle,
  list,
  choices,
  name,
  onChange,
}: {
  sectionTitle: string;
  list: string[];
  choices: string[];
  name: (id: string) => string;
  onChange: (list: string[]) => void;
}) {
  const [query, setQuery] = useState("");
  const words = query.trim().toLowerCase();
  const matches = words
    ? choices
        .filter((id) => !list.includes(id) && `${name(id)} ${id}`.toLowerCase().includes(words))
        .slice(0, 8)
    : [];
  const full = list.length >= SECTION_PICKS;
  const searchId = `add-${sectionTitle.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div className="flex flex-col gap-4 border-t border-line pt-4">
      <ol className="flex flex-col gap-1">
        {list.map((id, index) => (
          <li
            key={id}
            className="flex items-center justify-between gap-2 rounded-md border border-line px-3 py-1"
          >
            <span className="min-w-0 truncate text-sm font-semibold">
              {index + 1}. {name(id)}
              {index >= SECTION_SHOWN && (
                <span className="font-normal text-ink-muted"> · on View all only</span>
              )}
            </span>
            <span className="flex shrink-0 items-center">
              <IconButton
                label={`Move ${name(id)} up`}
                icon={<ArrowUp />}
                size="sm"
                variant="ghost"
                disabled={index === 0}
                onClick={() => onChange(swap(list, index, -1))}
              />
              <IconButton
                label={`Take ${name(id)} out`}
                icon={<X />}
                size="sm"
                variant="ghost"
                onClick={() => onChange(list.filter((item) => item !== id))}
              />
            </span>
          </li>
        ))}
      </ol>
      <div className="flex flex-col gap-2">
        <label
          htmlFor={searchId}
          className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase"
        >
          Add a design to {sectionTitle}
        </label>
        <Input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={full ? `Up to ${SECTION_PICKS} designs` : "Search by name"}
          disabled={full}
          autoComplete="off"
        />
        {matches.length > 0 && (
          <ul className="flex flex-col gap-1">
            {matches.map((id) => (
              <li key={id}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    onChange([...list, id]);
                    setQuery("");
                  }}
                >
                  <Plus aria-hidden />
                  {name(id)}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
