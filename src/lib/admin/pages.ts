/*
 * The master admin's pages, in menu order. A new page is one entry here and one folder
 * under src/app/(app)/admin; the menu, the overview and the tests pick it up.
 */

export type AdminPageIcon =
  | "overview"
  | "payments"
  | "designs"
  | "orders"
  | "coupons"
  | "invites"
  | "visitors"
  | "blog"
  | "ai"
  | "business"
  | "emails";

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
    href: "/admin/designs",
    label: "Designs and prices",
    description: "Which designs are Free, Premium or Royal, and what each edition costs.",
    icon: "designs",
  },
  {
    href: "/admin/orders",
    label: "Orders",
    description: "Every edition bought, refunds, and editions given by hand.",
    icon: "orders",
  },
  {
    href: "/admin/coupons",
    label: "Offers",
    description: "Offers and coupon codes, the offers page and the home page's offers.",
    icon: "coupons",
  },
  {
    href: "/admin/emails",
    label: "Emails",
    description: "The welcome and new-designs emails, with a test send.",
    icon: "emails",
  },
  {
    href: "/admin/invites",
    label: "Invites",
    description: "Every invite and its edition, newest first.",
    icon: "invites",
  },
  {
    href: "/admin/visitors",
    label: "Visitors",
    description: "How many people visit, signed in or not, and where they come from.",
    icon: "visitors",
  },
  {
    href: "/admin/blog",
    label: "Blog",
    description: "Write, schedule and publish blog posts.",
    icon: "blog",
  },
  {
    href: "/admin/ai",
    label: "AI",
    description: "Which AI writes wording and blog drafts, and whether its key works.",
    icon: "ai",
  },
  {
    href: "/admin/business",
    label: "Business details",
    description: "The name, address and GSTIN on every invoice.",
    icon: "business",
  },
];

/** The menu entry for a path, the longest match winning so /admin doesn't claim every page. */
export function activeAdminPage(pathname: string): AdminPage | undefined {
  return [...ADMIN_PAGES]
    .sort((a, b) => b.href.length - a.href.length)
    .find((page) => pathname === page.href || pathname.startsWith(`${page.href}/`));
}
