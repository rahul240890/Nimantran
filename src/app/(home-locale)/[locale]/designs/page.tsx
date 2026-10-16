import { DesignsPage, publicMetadata } from "@/components/seo/pages";
import { routeLocale } from "../locale";

export async function generateMetadata({ params }: PageProps<"/[locale]/designs">) {
  return publicMetadata({ kind: "designs" }, await routeLocale(params));
}

export default async function Page({ params }: PageProps<"/[locale]/designs">) {
  return <DesignsPage locale={await routeLocale(params)} />;
}
