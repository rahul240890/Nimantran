import { ContactPage } from "@/components/seo/info-pages";
import { publicMetadata } from "@/components/seo/pages";
import { contactEmail, getBusiness } from "@/lib/payments/business";

export const metadata = publicMetadata({ kind: "contact" }, "hi");

/* The business lines come from Admin, Business details; saving them refreshes this page. */
export const revalidate = 3600;

export default async function Page() {
  const [business, email] = await Promise.all([getBusiness(), contactEmail()]);
  return <ContactPage locale="hi" business={business} email={email} />;
}
