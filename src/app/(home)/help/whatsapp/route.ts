import { NextResponse, type NextRequest } from "next/server";
import { landingText } from "@/i18n/copy/landing";
import { isUiLocale } from "@/i18n/locales";
import { getBusiness } from "@/lib/payments/business";
import { supportWhatsAppUrl } from "@/lib/publish/links";
import { pagePath } from "@/lib/seo/paths";

/*
 * Help on WhatsApp, from the header: a chat with the number in Admin, Business details,
 * the first message already written in the visitor's language (?lang=hi). Until a number
 * is saved, the Contact page instead. Read at each visit, so a new number works at once.
 */
export async function GET(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get("lang");
  const locale = isUiLocale(lang) ? lang : "en";
  const { phone } = await getBusiness();
  const chat = supportWhatsAppUrl(phone, landingText[locale].shell.helpMessage);
  return NextResponse.redirect(chat ?? new URL(pagePath({ kind: "contact" }, locale), request.url));
}
