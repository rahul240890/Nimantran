import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { PageTransition } from "@/components/motion/page-transition";
import { requireAdmin } from "@/lib/admin/access";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { template: `%s · Admin · ${site.shortName}`, default: `Admin · ${site.shortName}` },
  robots: { index: false, follow: false },
};

/* The master admin. Every page under it, and every admin action, checks the admin again. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin("/admin");
  return (
    <PageTransition>
      <AdminShell>{children}</AdminShell>
    </PageTransition>
  );
}
