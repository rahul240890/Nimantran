"use client";

import { CalendarDays, MapPin } from "lucide-react";
import { TiltCard } from "@/components/motion/tilt-card";
import { Mandala } from "@/components/brand/mandala";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Section, Specimen } from "./layout";

/** A small invite on card stock: the same paper in both themes. */
function MiniInvite() {
  return (
    <div className="[container-type:inline-size] relative flex aspect-[4/5] flex-col items-center justify-center overflow-hidden rounded-lg bg-card-ivory px-6 text-center text-card-ink shadow-float">
      <span aria-hidden className="absolute inset-[3%] rounded-[6px] border-2 border-card-gold" />
      <span aria-hidden className="absolute inset-[5%] rounded-[4px] border border-card-gold/60" />
      <Mandala className="absolute top-[10%] left-1/2 h-auto w-[26%] -translate-x-1/2 text-card-gold" />
      <span className="relative mt-[26%] font-label text-[4cqw] tracking-[0.3em] text-card-gold-text">
        SHUBH VIVAH
      </span>
      <span className="relative mt-[4%] font-display text-[12cqw] leading-none">Aarav</span>
      <span className="relative font-display text-[7cqw] leading-none text-card-accent-text">
        &amp;
      </span>
      <span className="relative font-display text-[12cqw] leading-none">Meera</span>
      <span className="relative mt-[5%] font-label text-[4.2cqw] tracking-[0.14em]">
        12 · XII · 2026
      </span>
      <span className="relative mt-[2%] text-[4.4cqw] text-card-ink-muted italic">Udaipur</span>
    </div>
  );
}

export function Surfaces() {
  return (
    <Section
      id="cards"
      eyebrow="05 · Surfaces"
      title="Cards and depth"
      intro="Cards sit on the page with warm shadows. Invitation previews tilt toward the pointer like a card held in the hand, with light catching the surface."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Card elevation="flat">
          <CardHeader>
            <CardTitle>Flat</CardTitle>
            <CardDescription>Grouped content inside another surface.</CardDescription>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-ink-muted">Border only, no shadow.</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sangeet night</CardTitle>
            <CardDescription>Friday, 11 December · 7:30 PM</CardDescription>
          </CardHeader>
          <CardBody>
            <p className="flex items-center gap-2 text-sm text-ink-muted">
              <MapPin aria-hidden className="size-4 shrink-0" /> Lakeside lawns, Udaipur
            </p>
          </CardBody>
          <CardFooter>
            <Badge tone="success" dot>
              42 attending
            </Badge>
          </CardFooter>
        </Card>
        <Card elevation="interactive">
          <CardHeader>
            <CardTitle>
              <a
                href="#cards"
                className="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none"
              >
                Interactive card
              </a>
            </CardTitle>
            <CardDescription>
              Lifts on hover and on keyboard focus. The whole card is the link.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <p className="flex items-center gap-2 text-sm text-ink-muted">
              <CalendarDays aria-hidden className="size-4 shrink-0" /> 5 functions
            </p>
          </CardBody>
        </Card>
      </div>

      <Specimen
        title="3D tilt and light"
        note="Move a mouse over the cards. Touch screens and reduced motion keep them still."
        stageClassName="bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--marigold)_14%,transparent),transparent_70%)]"
      >
        <div className="mx-auto grid max-w-3xl gap-8 sm:grid-cols-2">
          <TiltCard className="rounded-lg">
            <MiniInvite />
          </TiltCard>
          <TiltCard className="rounded-lg" maxTilt={5}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-2xl">
                  <span className="text-gold-shimmer">Royal Scroll</span>
                </CardTitle>
                <CardDescription>
                  Premium template with gold foil, petals and shehnai music.
                </CardDescription>
              </CardHeader>
              <CardBody>
                <div className="flex flex-wrap gap-2">
                  <Badge tone="gold">Premium</Badge>
                  <Badge>Gate-fold</Badge>
                </div>
              </CardBody>
              <CardFooter>
                <Button size="sm">Use this design</Button>
              </CardFooter>
            </Card>
          </TiltCard>
        </div>
      </Specimen>
    </Section>
  );
}
