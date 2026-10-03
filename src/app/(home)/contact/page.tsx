import { ContactPage } from "@/components/seo/info-pages";
import { publicMetadata } from "@/components/seo/pages";
import { getBusiness } from "@/lib/payments/business";

export const metadata = publicMetadata({ kind: "contact" }, "en");

/* The business lines come from Admin, Business details; saving them refreshes this page. */
export const revalidate = 3600;

export default async function Page() {
  return <ContactPage locale="en" business={await getBusiness()} />;
}
