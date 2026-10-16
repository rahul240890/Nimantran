import { HomePage } from "@/components/landing/home-page";
import { pageAlternates } from "@/lib/seo/paths";
import { routeLocale } from "./locale";

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
  return { alternates: pageAlternates({ kind: "home" }, await routeLocale(params)) };
}

export default async function LocaleHome({ params }: PageProps<"/[locale]">) {
  return <HomePage locale={await routeLocale(params)} />;
}
