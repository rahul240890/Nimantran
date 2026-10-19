import { OffersPage } from "@/components/offers/offers";
import { publicMetadata } from "@/components/seo/pages";

export const metadata = publicMetadata({ kind: "offers" }, "en");

export default function Page() {
  return <OffersPage locale="en" />;
}
