/*
 * The master admin's pages, in menu order. A new page is one entry here and one folder
 * under src/app/(app)/admin; the menu, the overview and the tests pick it up.
 */

export type AdminPageIcon = "overview" | "payments" | "orders";

export type AdminPage = {
  href: `/admin${string}`;
  label: string;
  /** One line on the overview. */
  description: string;
  icon: AdminPageIcon;
};

export const ADMIN_PAGES: readonly AdminPage[] = [
  {
    href: "/admin",
    label: "Overview",
    description: "How the site is set up, at a glance.",
    icon: "overview",
  },
  {
    href: "/admin/razorpay",
    label: "Razorpay",
    description: "Payment keys, webhook and the checkout switch.",
    icon: "payments",
  },
  {
    href: "/admin/orders",
    label: "Orders",
    description: "Every edition bought, and editions given by hand.",
    icon: "orders",
  },
];

/** The menu entry for a path, the longest match winning so /admin doesn't claim every page. */
export function activeAdminPage(pathname: string): AdminPage | undefined {
  return [...ADMIN_PAGES]
    .sort((a, b) => b.href.length - a.href.length)
    .find((page) => pathname === page.href || pathname.startsWith(`${page.href}/`));
}
