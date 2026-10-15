import { gstSplit } from "@/lib/payments/invoice";
import { formatRupees } from "@/lib/plans/catalog";

/*
 * The emails the site sends, as subject, HTML and plain text. Email apps ignore stylesheets
 * and CSS variables, so the colours are written out here: the light theme's paper, surface,
 * line, ink, ink-muted, marigold and accent-text from src/app/globals.css. Keep them in step.
 */

const color = {
  paper: "#fbf6ec",
  surface: "#ffffff",
  line: "#e5d8c0",
  ink: "#2a1a24",
  inkMuted: "#6b5864",
  marigold: "#f0a431",
  accentText: "#9a4c08",
} as const;

export type Email = { subject: string; html: string; text: string };

/** Who the email comes from and where its links point. */
export type Brand = { name: string; siteUrl: string; contactEmail: string | null };

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const link = (brand: Brand, path: string) => `${brand.siteUrl.replace(/\/$/, "")}${path}`;

const dated = new Intl.DateTimeFormat("en-IN", { dateStyle: "long", timeZone: "Asia/Kolkata" });

/** A first name to greet with, or nothing when the account has no name yet. */
const greeting = (name: string) => {
  const first = name.trim().split(/\s+/)[0];
  return first ? `Namaste ${first},` : "Namaste,";
};

function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0"><tr><td style="border-radius:999px;background:${color.marigold}"><a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 26px;font-weight:700;font-size:16px;color:${color.ink};text-decoration:none;border-radius:999px">${escapeHtml(label)}</a></td></tr></table>`;
}

function paragraph(text: string): string {
  return `<p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:${color.ink}">${escapeHtml(text)}</p>`;
}

function rows(items: [string, string][]): string {
  const cells = items
    .map(
      ([label, value], i) =>
        `<tr><td style="padding:8px 0;color:${color.inkMuted};${i ? `border-top:1px solid ${color.line};` : ""}">${escapeHtml(label)}</td><td style="padding:8px 0;text-align:right;color:${color.ink};font-weight:600;${i ? `border-top:1px solid ${color.line};` : ""}">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 4px;font-size:15px">${cells}</table>`;
}

/** The page every email shares: the name on top, a white card, and a quiet footer. */
function layout(
  brand: Brand,
  preheader: string,
  body: string,
  footer: { why: string; stopUrl?: string },
): string {
  const contact = brand.contactEmail
    ? ` Questions? Write to <a href="mailto:${escapeHtml(brand.contactEmail)}" style="color:${color.accentText}">${escapeHtml(brand.contactEmail)}</a>.`
    : "";
  const stop = footer.stopUrl
    ? `<br><a href="${escapeHtml(footer.stopUrl)}" style="color:${color.accentText}">Stop these reminders</a>`
    : "";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${escapeHtml(brand.name)}</title>
</head>
<body style="margin:0;padding:0;background:${color.paper};font-family:Karla,Helvetica,Arial,sans-serif">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${color.paper}">
<tr><td align="center" style="padding:28px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
<tr><td style="padding:0 4px 18px;font-family:'Rozha One',Georgia,serif;font-size:24px;color:${color.accentText}"><a href="${escapeHtml(brand.siteUrl)}" style="color:${color.accentText};text-decoration:none">${escapeHtml(brand.name)}</a></td></tr>
<tr><td style="background:${color.surface};border:1px solid ${color.line};border-radius:16px;padding:28px 24px">
${body}
</td></tr>
<tr><td style="padding:18px 4px;font-size:13px;line-height:1.6;color:${color.inkMuted}">${escapeHtml(footer.why)}${contact}${stop}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function heading(text: string): string {
  return `<h1 style="margin:0 0 16px;font-family:'Rozha One',Georgia,serif;font-weight:400;font-size:26px;line-height:1.25;color:${color.ink}">${escapeHtml(text)}</h1>`;
}

const textFooter = (brand: Brand, why: string, stopUrl?: string) =>
  [
    "",
    "--",
    why,
    brand.contactEmail ? `Questions? Write to ${brand.contactEmail}.` : "",
    stopUrl ? `Stop these reminders: ${stopUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");

/* ---------- Welcome ---------- */

export function welcomeEmail(brand: Brand, name: string): Email {
  const start = link(brand, "/create");
  const lines = [
    `Thank you for joining ${brand.name}. Your invitations live in your account, so you can start one now and finish it whenever you like.`,
    "Pick a design, add the names, family and each function, then share your link on WhatsApp. Guests open it on any phone and reply in one tap, and you see every reply on your guest list.",
  ];
  return {
    subject: `Welcome to ${brand.name}`,
    html: layout(
      brand,
      "Start your first invitation and share it on WhatsApp.",
      `${heading(`Welcome to ${brand.name}`)}${paragraph(greeting(name))}${lines.map(paragraph).join("")}${button(start, "Start an invitation")}`,
      { why: `You're getting this because you just made an account on ${brand.name}.` },
    ),
    text: [
      greeting(name),
      "",
      ...lines.flatMap((line) => [line, ""]),
      `Start an invitation: ${start}`,
      textFooter(brand, `You're getting this because you just made an account on ${brand.name}.`),
    ].join("\n"),
  };
}

/* ---------- Receipt ---------- */

export type ReceiptDetails = {
  orderId: string;
  eventId: string | null;
  buyerName: string;
  /** "Aarav & Meera", or empty before the names are added. */
  names: string;
  packageName: string;
  invoiceNo: string | null;
  listPricePaise: number;
  discountPaise: number;
  couponCode: string | null;
  amountPaise: number;
  paymentId: string | null;
  paidAt: Date;
  /** Shows the GST lines when the business has a GSTIN. */
  taxInvoice: boolean;
};

export function receiptEmail(brand: Brand, r: ReceiptDetails): Email {
  const invoiceUrl = link(brand, `/invoice/${r.orderId}`);
  const kind = r.taxInvoice ? "Tax invoice" : "Receipt";
  const what = r.names ? `${r.names}'s invitation` : "your invitation";
  const gst = gstSplit(r.amountPaise);
  const items: [string, string][] = [
    ["Invitation", r.names || "Your invitation"],
    ["Package", r.packageName],
  ];
  if (r.discountPaise > 0) {
    items.push(["Price", formatRupees(r.listPricePaise)]);
    items.push([
      r.couponCode ? `Discount (${r.couponCode})` : "Discount",
      `−${formatRupees(r.discountPaise)}`,
    ]);
  }
  if (r.taxInvoice) {
    items.push(["Taxable value", formatRupees(gst.taxablePaise)]);
    items.push(["CGST 9%", formatRupees(gst.cgstPaise)]);
    items.push(["SGST 9%", formatRupees(gst.sgstPaise)]);
  }
  items.push(["Paid", formatRupees(r.amountPaise)]);
  items.push(["Date", dated.format(r.paidAt)]);
  if (r.invoiceNo) items.push([`${kind} no.`, r.invoiceNo]);
  if (r.paymentId) items.push(["Payment id", r.paymentId]);

  const thanks = `Thank you for your payment. The ${r.packageName} package is now on ${what}, and everything it includes is ready to use.`;
  const subject = r.invoiceNo
    ? `${kind} ${r.invoiceNo}: ${r.packageName} package`
    : `${kind}: ${r.packageName} package`;
  const why = `You're getting this because you paid for a package on ${brand.name}. Keep it for your records.`;
  return {
    subject,
    html: layout(
      brand,
      `${formatRupees(r.amountPaise)} paid for the ${r.packageName} package.`,
      `${heading("Payment received")}${paragraph(greeting(r.buyerName))}${paragraph(thanks)}${rows(items)}${button(invoiceUrl, `View or print ${kind.toLowerCase()}`)}`,
      { why },
    ),
    text: [
      greeting(r.buyerName),
      "",
      thanks,
      "",
      ...items.map(([label, value]) => `${label}: ${value}`),
      "",
      `View or print ${kind.toLowerCase()}: ${invoiceUrl}`,
      textFooter(brand, why),
    ].join("\n"),
  };
}

/* ---------- Unfinished draft ---------- */

export type DraftReminderDetails = {
  eventId: string;
  hostName: string;
  names: string;
  stopUrl: string;
};

export function draftReminderEmail(brand: Brand, d: DraftReminderDetails): Email {
  const resume = link(brand, `/create?invite=${encodeURIComponent(d.eventId)}`);
  const title = d.names ? `${d.names}'s invitation is waiting` : "Your invitation is waiting";
  const lines = [
    "You started an invitation and it's saved just as you left it.",
    "Finish the details, preview it, and share the link with your guests when you're ready. Replies come straight to your guest list.",
  ];
  const why = `You're getting this because you started an invitation on ${brand.name}. We send this reminder once for each invitation.`;
  return {
    subject: title,
    html: layout(
      brand,
      "Pick up where you left off.",
      `${heading(title)}${paragraph(greeting(d.hostName))}${lines.map(paragraph).join("")}${button(resume, "Finish your invitation")}`,
      { why, stopUrl: d.stopUrl },
    ),
    text: [
      greeting(d.hostName),
      "",
      ...lines.flatMap((line) => [line, ""]),
      `Finish your invitation: ${resume}`,
      textFooter(brand, why, d.stopUrl),
    ].join("\n"),
  };
}
