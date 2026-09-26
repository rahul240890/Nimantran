"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { TemplateCover } from "@/components/brand/template-cover";
import { TiltCard } from "@/components/motion/tilt-card";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { templates } from "@/content/landing";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Section } from "./section";

/**
 * The launch designs in a row that scrolls sideways: swipe on phones, arrows or the
 * keyboard (Tab into the row, then arrow keys) everywhere. Cards snap into place.
 */
export function TemplatesCarousel() {
  const rowRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const still = useReducedMotion();

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const update = () => {
      // scrollLeft is negative in right-to-left layouts, so compare magnitudes
      const scrolled = Math.abs(row.scrollLeft);
      const max = row.scrollWidth - row.clientWidth;
      setEdges({ start: scrolled < 8, end: scrolled > max - 8 });
    };
    update();
    row.addEventListener("scroll", update, { passive: true });
    const resize = new ResizeObserver(update);
    resize.observe(row);
    return () => {
      row.removeEventListener("scroll", update);
      resize.disconnect();
    };
  }, []);

  const page = (direction: 1 | -1) => {
    const row = rowRef.current;
    if (!row) return;
    const rtl = getComputedStyle(row).direction === "rtl" ? -1 : 1;
    row.scrollBy({
      left: direction * rtl * row.clientWidth * 0.85,
      behavior: still ? "auto" : "smooth",
    });
  };

  return (
    <Section
      id="templates"
      eyebrow={templates.eyebrow}
      title={templates.title}
      intro={templates.intro}
      className="overflow-x-clip"
    >
      <div className="flex flex-col gap-6">
        <ul
          ref={rowRef}
          tabIndex={0}
          aria-label={templates.listLabel}
          className="mx-[calc(50%-50vw)] flex snap-x snap-mandatory scroll-px-(--gutter) [scrollbar-width:none] gap-5 overflow-x-auto px-(--gutter) pt-2 pb-8 [--gutter:1rem] sm:[--gutter:1.5rem] lg:[--gutter:max(2rem,calc(50vw-34rem))] [&::-webkit-scrollbar]:hidden"
        >
          {templates.items.map((item) => (
            <li
              key={item.id}
              className="w-[min(72vw,17rem)] shrink-0 snap-start sm:w-[16rem] lg:w-[calc((min(100vw,72rem)-4rem-3.75rem)/4)]"
            >
              <figure className="flex flex-col gap-4">
                <TiltCard className="rounded-md" maxTilt={6}>
                  <TemplateCover id={item.id} />
                </TiltCard>
                <figcaption className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-display text-xl leading-tight">{item.name}</span>
                  <Badge tone={item.tone as BadgeTone}>{item.kind}</Badge>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="secondary">
            <Link href="/create">
              {templates.tryEditor}
              <ArrowRight aria-hidden className="rtl:rotate-180" />
            </Link>
          </Button>
          <div className="flex gap-2">
            <IconButton
              label={templates.previous}
              icon={<ChevronLeft className="rtl:rotate-180" />}
              onClick={() => page(-1)}
              disabled={edges.start}
            />
            <IconButton
              label={templates.next}
              icon={<ChevronRight className="rtl:rotate-180" />}
              onClick={() => page(1)}
              disabled={edges.end}
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
