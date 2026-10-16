import { LegalPage } from "@/components/seo/legal-page";
import { publicMetadata } from "@/components/seo/pages";
import { routeLocale } from "../locale";

export async function generateMetadata({ params }: PageProps<"/[locale]/refunds">) {
  return publicMetadata({ kind: "refunds" }, await routeLocale(params));
}

/* The address to write to can come from Admin, Business details; saving them refreshes this page. */
export const revalidate = 3600;

export default async function Page({ params }: PageProps<"/[locale]/refunds">) {
  return <LegalPage locale={await routeLocale(params)} kind="refunds" />;
}
