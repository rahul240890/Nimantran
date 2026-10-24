import { NextResponse, type NextRequest } from "next/server";
import { landingText } from "@/i18n/copy/landing";
import { isUiLocale } from "@/i18n/locales";
import { getBusiness } from "@/lib/payments/business";
import { supportWhatsAppUrl } from "@/lib/publish/links";
import { pagePath } from "@/lib/seo/paths";

/*
 * Help on WhatsApp, from the menu: a chat with the number in Admin, Business details,
 * the first message already written in the visitor's language (?lang=hi), asking for help
 * or, from the home page's We'll make it for you (?for=make), for us to make the
 * invitation. Until a number is saved, the Contact page instead. Read at each visit, so a
 * new number works at once.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const lang = params.get("lang");
  const locale = isUiLocale(lang) ? lang : "en";
  const { shell } = landingText[locale];
  const { phone } = await getBusiness();
  const chat = supportWhatsAppUrl(
    phone,
    params.get("for") === "make" ? shell.makeMessage : shell.helpMessage,
  );
  return NextResponse.redirect(chat ?? new URL(pagePath({ kind: "contact" }, locale), request.url));
}
