"use client";

import { CalendarPlus, Car, Clock, Map as MapIcon, MapPin, Navigation, Shirt } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGuestText } from "@/components/guest/guest-language";
import { cn } from "@/lib/cn";
import type { GuestFunction } from "./guest-view";

/**
 * A function's when, where, dress code and parking, with one-tap directions, a map the
 * guest opens when they want it (nothing loads from Google before), and "add to calendar".
 * Centred, it reads like an ornate card's (ornate-card.tsx): the day and time in spaced
 * capitals, the venue large, and pills under them.
 */
export function FunctionFacts({ fn, centered = false }: { fn: GuestFunction; centered?: boolean }) {
  const { guestCopy } = useGuestText();
  const [mapOpen, setMapOpen] = useState(false);
  const mapId = useId();
  return (
    <>
      {centered ? (
        <CentredFacts fn={fn} />
      ) : (
        <dl className="flex flex-col gap-3">
          {fn.date && (
            <div className="flex items-start gap-3">
              <dt className="mt-0.5 shrink-0">
                <Clock aria-hidden className="size-5 text-accent-text" />
                <span className="sr-only">{guestCopy.when}</span>
              </dt>
              <dd>
                {fn.date}
                {fn.time && !fn.muhurat && <span className="text-ink-muted"> · {fn.time}</span>}
                {fn.time && fn.muhurat && (
                  <span className="block">
                    <span lang={fn.muhurat.lang} className="font-semibold text-accent-text">
                      {fn.muhurat.text}
                    </span>
                    <span className="text-ink-muted"> · {fn.time}</span>
                  </span>
                )}
              </dd>
            </div>
          )}
          {(fn.venue || fn.address) && (
            <div className="flex items-start gap-3">
              <dt className="mt-0.5 shrink-0">
                <MapPin aria-hidden className="size-5 text-accent-text" />
                <span className="sr-only">{guestCopy.where}</span>
              </dt>
              <dd className="min-w-0 break-words">
                {fn.venue && <span className="block font-semibold">{fn.venue}</span>}
                {fn.address && <span className="block text-ink-muted">{fn.address}</span>}
              </dd>
            </div>
          )}
          {fn.dressCode && (
            <div className="flex items-start gap-3">
              <dt className="mt-0.5 shrink-0">
                <Shirt aria-hidden className="size-5 text-accent-text" />
                <span className="sr-only">{guestCopy.dressCode}</span>
              </dt>
              <dd className="min-w-0 break-words">{fn.dressCode}</dd>
            </div>
          )}
          {fn.parking && (
            <div className="flex items-start gap-3">
              <dt className="mt-0.5 shrink-0">
                <Car aria-hidden className="size-5 text-accent-text" />
                <span className="sr-only">{guestCopy.parking}</span>
              </dt>
              <dd className="min-w-0 break-words">{fn.parking}</dd>
            </div>
          )}
        </dl>
      )}
      <div className={cn("flex flex-wrap gap-2 pt-1", centered ? "justify-center" : "mt-auto")}>
        {fn.mapsUrl && (
          <Button asChild variant="secondary" size="sm" className={cn(centered && "rounded-full")}>
            <a href={fn.mapsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation aria-hidden />
              {guestCopy.directions}
            </a>
          </Button>
        )}
        {fn.mapEmbedUrl && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className={cn(centered && "rounded-full")}
            aria-expanded={mapOpen}
            aria-controls={mapId}
            leadingIcon={<MapIcon aria-hidden />}
            onClick={() => setMapOpen((open) => !open)}
          >
            {mapOpen ? guestCopy.hideMap : guestCopy.showMap}
          </Button>
        )}
        {fn.googleCalendarUrl && fn.icsUrl && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className={cn(centered && "rounded-full")}
                leadingIcon={<CalendarPlus aria-hidden />}
              >
                {guestCopy.addToCalendar}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <a href={fn.googleCalendarUrl} target="_blank" rel="noopener noreferrer">
                  {guestCopy.googleCalendar}
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={fn.icsUrl} download>
                  {guestCopy.appleCalendar}
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {fn.mapEmbedUrl && (
        <div id={mapId} hidden={!mapOpen} className={cn(centered && "w-full")}>
          {mapOpen && (
            <iframe
              src={fn.mapEmbedUrl}
              title={guestCopy.mapTitle(fn.venue || fn.name)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/3] w-full rounded-md border border-line bg-surface-2"
            />
          )}
        </div>
      )}
    </>
  );
}

/** The facts centred, with no icons: spaced capitals for the day, the venue large. */
function CentredFacts({ fn }: { fn: GuestFunction }) {
  const { guestCopy } = useGuestText();
  return (
    <dl className="flex w-full flex-col items-center gap-3 text-center">
      {fn.date && (
        <div className="flex flex-col items-center gap-1">
          <dt className="sr-only">{guestCopy.when}</dt>
          <dd className="font-label text-sm tracking-[0.22em] text-balance text-ink uppercase">
            {fn.date}
          </dd>
          {fn.time && fn.muhurat && (
            <dd lang={fn.muhurat.lang} className="font-semibold text-accent-text">
              {fn.muhurat.text}
            </dd>
          )}
          {fn.time && (
            <dd className="font-label text-base tracking-[0.2em] text-accent-text uppercase">
              {fn.time}
            </dd>
          )}
        </div>
      )}
      {(fn.venue || fn.address) && (
        <div className="flex max-w-full flex-col items-center">
          <dt className="sr-only">{guestCopy.where}</dt>
          {fn.venue && (
            <dd className="font-display text-2xl leading-tight text-balance break-words text-ink">
              {fn.venue}
            </dd>
          )}
          {fn.address && (
            <dd className="mt-1 text-sm text-balance break-words text-ink-muted">{fn.address}</dd>
          )}
        </div>
      )}
      {fn.dressCode && (
        <div className="flex max-w-full flex-col items-center gap-0.5">
          <dt className="font-label text-[0.7rem] tracking-[0.2em] text-ink-muted uppercase">
            {guestCopy.dressCode}
          </dt>
          <dd className="text-balance break-words text-ink">{fn.dressCode}</dd>
        </div>
      )}
      {fn.parking && (
        <div className="flex max-w-full flex-col items-center gap-0.5">
          <dt className="font-label text-[0.7rem] tracking-[0.2em] text-ink-muted uppercase">
            {guestCopy.parking}
          </dt>
          <dd className="text-sm text-balance break-words text-ink">{fn.parking}</dd>
        </div>
      )}
    </dl>
  );
}
