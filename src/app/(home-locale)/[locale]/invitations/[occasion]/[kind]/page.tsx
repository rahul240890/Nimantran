import { notFound } from "next/navigation";
import { WeddingKindPage } from "@/components/gallery/gallery-pages";
import { publicMetadata } from "@/components/seo/pages";
import { WEDDING_KINDS, isWeddingKind } from "@/lib/gallery/catalog";
import { routeLocale } from "../../../locale";

export const dynamicParams = false;

/* Only a wedding has kinds: /hi/invitations/wedding/gujarati. */
export function generateStaticParams() {
  return WEDDING_KINDS.map((kind) => ({ occasion: "wedding", kind }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/invitations/[occasion]/[kind]">) {
  const locale = await routeLocale(params);
  const { occasion, kind } = await params;
  return occasion === "wedding" && isWeddingKind(kind)
    ? publicMetadata({ kind: "wedding-kind", id: kind }, locale)
    : {};
}

export default async function Page({
  params,
}: PageProps<"/[locale]/invitations/[occasion]/[kind]">) {
  const locale = await routeLocale(params);
  const { occasion, kind } = await params;
  if (occasion !== "wedding" || !isWeddingKind(kind)) notFound();
  return <WeddingKindPage kind={kind} locale={locale} />;
}
