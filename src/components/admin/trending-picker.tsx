"use client";

import { ArrowUp, Plus, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveTrending } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { TRENDING_SIZE } from "@/lib/gallery/trending";

export type TrendingOption = { id: string; name: string; kind: string };

/**
 * The designs the admin pins to the head of the Trending row and badges. The rest of the
 * row fills with the designs hosts used most in the last month, then a starting list.
 */
export function TrendingPicker({
  options,
  pinned: saved,
  trending,
}: {
  options: TrendingOption[];
  pinned: string[];
  trending: string[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [pinned, setPinned] = useState(saved);
  const [query, setQuery] = useState("");
  const byId = new Map(options.map((option) => [option.id, option]));
  const label = (id: string) => {
    const option = byId.get(id);
    return option ? `${option.name} (${option.kind})` : id;
  };
  const words = query.trim().toLowerCase();
  const matches = words
    ? options
        .filter(
          (option) =>
            !pinned.includes(option.id) &&
            `${option.name} ${option.id} ${option.kind}`.toLowerCase().includes(words),
        )
        .slice(0, 8)
    : [];
  const full = pinned.length >= TRENDING_SIZE;
  const changed = pinned.join() !== saved.join();

  const save = () =>
    startTransition(async () => {
      const ok = await saveTrending(pinned).catch(() => null);
      if (ok) {
        toast({
          title: "Trending saved",
          description: "The site shows it within a few minutes.",
          tone: "success",
        });
        router.refresh();
      } else {
        toast({ title: "Couldn't save. Try again.", tone: "error" });
      }
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trending</CardTitle>
        <CardDescription>
          Designs pinned here lead the Trending row on the home page and the Designs page, with a
          Trending badge wherever they show. The rest of the {TRENDING_SIZE} places go to the
          designs hosts started the most invitations with in the last 30 days.
        </CardDescription>
      </CardHeader>
      <CardBody className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase">Pinned</p>
          {pinned.length === 0 ? (
            <p className="text-sm text-ink-muted">Nothing pinned: the row follows real use.</p>
          ) : (
            <ol className="flex flex-col gap-1">
              {pinned.map((id, index) => (
                <li
                  key={id}
                  className="flex items-center justify-between gap-2 rounded-md border border-line px-3 py-1"
                >
                  <span className="min-w-0 truncate text-sm font-semibold">
                    {index + 1}. {label(id)}
                  </span>
                  <span className="flex shrink-0 items-center">
                    <IconButton
                      label={`Move ${label(id)} up`}
                      icon={<ArrowUp />}
                      size="sm"
                      variant="ghost"
                      disabled={index === 0}
                      onClick={() =>
                        setPinned((list) => {
                          const next = [...list];
                          [next[index - 1], next[index]] = [next[index]!, next[index - 1]!];
                          return next;
                        })
                      }
                    />
                    <IconButton
                      label={`Unpin ${label(id)}`}
                      icon={<X />}
                      size="sm"
                      variant="ghost"
                      onClick={() => setPinned((list) => list.filter((item) => item !== id))}
                    />
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="trending-search"
            className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase"
          >
            Pin a design
          </label>
          <Input
            id="trending-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={full ? `Up to ${TRENDING_SIZE} designs can be pinned` : "Search by name"}
            disabled={full}
            autoComplete="off"
          />
          {matches.length > 0 && (
            <ul className="flex flex-col gap-1">
              {matches.map((option) => (
                <li key={option.id}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setPinned((list) => [...list, option.id]);
                      setQuery("");
                    }}
                  >
                    <Plus aria-hidden />
                    {label(option.id)}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase">
            Trending now, in order
          </p>
          <p className="text-sm text-ink-muted">{trending.map(label).join(" · ")}</p>
        </div>

        <Button onClick={save} loading={pending} disabled={!changed} className="self-start">
          <Save aria-hidden />
          Update trending
        </Button>
      </CardBody>
    </Card>
  );
}
