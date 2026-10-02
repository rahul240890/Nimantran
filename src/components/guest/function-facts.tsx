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
import { useText } from "@/i18n/client";
import { publishText } from "@/i18n/copy/publish";
import type { GuestFunction } from "./guest-view";

/**
 * A function's when, where, dress code and parking, with one-tap directions, a map the
 * guest opens when they want it (nothing loads from Google before), and "add to calendar".
 */
export function FunctionFacts({ fn }: { fn: GuestFunction }) {
  const { guestCopy } = useText(publishText);
  const [mapOpen, setMapOpen] = useState(false);
  const mapId = useId();
  return (
    <>
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
      <div className="mt-auto flex flex-wrap gap-2 pt-1">
        {fn.mapsUrl && (
          <Button asChild variant="secondary" size="sm">
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
              <Button variant="secondary" size="sm" leadingIcon={<CalendarPlus aria-hidden />}>
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
        <div id={mapId} hidden={!mapOpen}>
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
