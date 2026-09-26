/* Links that hand off to other apps: WhatsApp for sharing, maps for directions. */

/** Opens WhatsApp (app or web) with the message ready to send to any chat. */
export function whatsappShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/** Directions to a venue. Google Maps opens the app on phones that have it. */
export function mapsUrl(venue: string, address: string): string {
  const query = [venue.trim(), address.trim()].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** The address guests see: the site's own origin and /i/<slug>. */
export function inviteUrl(origin: string, slug: string): string {
  return `${origin.replace(/\/+$/, "")}/i/${slug}`;
}
