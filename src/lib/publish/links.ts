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

/** Opens WhatsApp on a chat with this number, the message ready to send. */
export function whatsappToUrl(phone: string | null, text: string): string {
  const digits = phone?.replace(/\D/g, "");
  return digits
    ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
    : whatsappShareUrl(text);
}

/**
 * A chat with the business on WhatsApp, from the phone in Admin, Business details: an
 * Indian number may be saved without +91. Null when there is no usable number.
 */
export function supportWhatsAppUrl(phone: string, text: string): string | null {
  const digits = phone.replace(/\D/g, "").replace(/^0+/, "");
  if (digits.length < 10) return null;
  return whatsappToUrl(digits.length === 10 ? `91${digits}` : digits, text);
}

/** A guest's own link: replies from it are theirs, and opening it shows on the guest list. */
export function personalUrl(inviteLink: string, token: string): string {
  return `${inviteLink}?g=${token}`;
}
