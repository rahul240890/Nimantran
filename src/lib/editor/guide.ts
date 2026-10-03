import type { FunctionId } from "@/lib/events/functions";

/*
 * The event-day guide: what a guest needs on the way to each function besides its date,
 * venue and dress code. The host may paste the venue's own Google Maps link (a pin is
 * more exact than an address) and a line about parking. Saved inside events.religious
 * like the other card extras, so no column changes. Kept free of the validator so the
 * guest's page can read it without downloading zod.
 */

export const GUIDE_RULES = { pin: 300, parking: 120 } as const;

export type FunctionGuide = {
  /** The venue's Google Maps link, as the host pasted it; empty for none. */
  pin: string;
  /** Where to park, valet, a drop-off gate. */
  parking: string;
};

export type DraftGuide = Partial<Record<FunctionId, FunctionGuide>>;

export const noFunctionGuide: FunctionGuide = { pin: "", parking: "" };

export function functionGuide(guide: DraftGuide, kind: FunctionId): FunctionGuide {
  return guide[kind] ?? noFunctionGuide;
}

const MAPS_HOSTS = new Set([
  "maps.app.goo.gl",
  "goo.gl",
  "maps.google.com",
  "www.google.com",
  "google.com",
  "www.google.co.in",
  "google.co.in",
]);

export type MapsPin = {
  /** The link itself, safe to open. */
  url: string;
  /** "lat,lng" when the link carries the exact spot. */
  coords: string | null;
};

const COORD = /(-?\d{1,2}\.\d+),\s*(-?\d{1,3}\.\d+)/;

/**
 * A Google Maps link the host pasted, or null when it is empty or isn't one: only https
 * links on Google's maps addresses are opened for guests, never anything else.
 */
export function mapsPin(link: string): MapsPin | null {
  const text = link.trim();
  if (!text) return null;
  let url: URL;
  try {
    url = new URL(text);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || !MAPS_HOSTS.has(url.hostname)) return null;
  const short = url.hostname === "maps.app.goo.gl" || url.hostname === "goo.gl";
  if (!short && !url.hostname.startsWith("maps.") && !url.pathname.startsWith("/maps")) {
    return null;
  }
  // A place link carries its spot as @lat,lng in the path or as a query
  const query =
    url.searchParams.get("q") ??
    url.searchParams.get("query") ??
    url.searchParams.get("destination") ??
    url.searchParams.get("ll") ??
    "";
  const found = COORD.exec(query) ?? COORD.exec(url.pathname.match(/@[^/]+/)?.[0] ?? "");
  const coords = found && isSpot(found[1]!, found[2]!) ? `${found[1]},${found[2]}` : null;
  return { url: url.toString(), coords };
}

function isSpot(lat: string, lng: string): boolean {
  return Math.abs(Number(lat)) <= 90 && Math.abs(Number(lng)) <= 180;
}

function placeQuery(venue: string, address: string): string {
  return [venue.trim(), address.trim()].filter(Boolean).join(", ");
}

/**
 * One tap to directions from where the guest is: Google Maps opens its app on phones that
 * have it. The host's pin wins over the typed address. Null when there is nowhere to go.
 */
export function directionsUrl(venue: string, address: string, pin: string): string | null {
  const spot = mapsPin(pin);
  if (spot && !spot.coords) return spot.url;
  const destination = spot?.coords ?? placeQuery(venue, address);
  if (!destination) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

/** A small map of the venue to show in a frame, needing no key. Null when there is no place. */
export function mapEmbedUrl(venue: string, address: string, pin: string): string | null {
  const place = mapsPin(pin)?.coords ?? placeQuery(venue, address);
  if (!place) return null;
  return `https://maps.google.com/maps?q=${encodeURIComponent(place)}&z=15&output=embed`;
}
