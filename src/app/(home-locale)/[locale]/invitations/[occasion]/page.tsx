import { notFound } from "next/navigation";
import { OccasionGalleryPage } from "@/components/gallery/gallery-pages";
import { publicMetadata } from "@/components/seo/pages";
import { CATEGORY_IDS, isCategoryId } from "@/lib/categories/catalog";
import { routeLocale } from "../../locale";

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORY_IDS.map((occasion) => ({ occasion }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/invitations/[occasion]">) {
  const locale = await routeLocale(params);
  const { occasion } = await params;
  return isCategoryId(occasion) ? publicMetadata({ kind: "occasion", id: occasion }, locale) : {};
}

export default async function Page({ params }: PageProps<"/[locale]/invitations/[occasion]">) {
  const locale = await routeLocale(params);
  const { occasion } = await params;
  if (!isCategoryId(occasion)) notFound();
  return <OccasionGalleryPage id={occasion} locale={locale} />;
}
