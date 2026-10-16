import { ContactPage } from "@/components/seo/info-pages";
import { publicMetadata } from "@/components/seo/pages";
import { contactEmail, getBusiness } from "@/lib/payments/business";
import { routeLocale } from "../locale";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">) {
  return publicMetadata({ kind: "contact" }, await routeLocale(params));
}

/* The business lines come from Admin, Business details; saving them refreshes this page. */
export const revalidate = 3600;

export default async function Page({ params }: PageProps<"/[locale]/contact">) {
  const locale = await routeLocale(params);
  const [business, email] = await Promise.all([getBusiness(), contactEmail()]);
  return <ContactPage locale={locale} business={business} email={email} />;
}
