import { LegalPage } from "@/components/seo/legal-page";
import { publicMetadata } from "@/components/seo/pages";

export const metadata = publicMetadata({ kind: "privacy" }, "en");

/* The address to write to can come from Admin, Business details; saving them refreshes this page. */
export const revalidate = 3600;

export default async function Page() {
  return <LegalPage locale="en" kind="privacy" />;
}
