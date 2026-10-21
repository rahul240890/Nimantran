import { OffersPage } from "@/components/offers/offers";
import { publicMetadata } from "@/components/seo/pages";
import { routeLocale } from "../locale";

export async function generateMetadata({ params }: PageProps<"/[locale]/offers">) {
  return publicMetadata({ kind: "offers" }, await routeLocale(params));
}

export default async function Page({ params }: PageProps<"/[locale]/offers">) {
  return <OffersPage locale={await routeLocale(params)} />;
}
