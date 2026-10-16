import { PricingPage } from "@/components/seo/info-pages";
import { publicMetadata } from "@/components/seo/pages";
import { routeLocale } from "../locale";

export async function generateMetadata({ params }: PageProps<"/[locale]/pricing">) {
  return publicMetadata({ kind: "pricing" }, await routeLocale(params));
}

export default async function Page({ params }: PageProps<"/[locale]/pricing">) {
  return <PricingPage locale={await routeLocale(params)} />;
}
