import { gstSplit } from "@/lib/payments/invoice";
import { formatRupees } from "@/lib/plans/catalog";

/*
 * The emails the site sends, as subject, HTML and plain text. Email apps ignore stylesheets
 * and CSS variables, so the colours are written out here: the light theme's paper, surface,
 * line, ink, ink-muted, marigold, accent-text and success from src/app/globals.css. Keep them
 * in step.
 */

const color = {
  paper: "#fbf6ec",
  surface: "#ffffff",
  line: "#e5d8c0",
  ink: "#2a1a24",
  inkMuted: "#6b5864",
  marigold: "#f0a431",
  accentText: "#9a4c08",
  success: "#1a6f45",
  /** A warm white for offer tickets, between paper and surface. */
  ticket: "#fffaf1",
} as const;

export type Email = { subject: string; html: string; text: string };

/** Who the email comes from and where its links point. */
export type Brand = {
  name: string;
  siteUrl: string;
  contactEmail: string | null;
  /** Where people get help and follow us, for the receipt and the reminder. */
  help?: Help;
};

/** Help by email, WhatsApp chat and Instagram, each left out when it isn't set. */
export type Help = {
  /** A wa.me chat link with a message ready, and the number as people read it. */
  whatsappUrl: string | null;
  whatsappLabel: string | null;
  instagramUrl: string;
  /** "@shubhinvitations.in". */
  instagramHandle: string;
};

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
  footer: { why: string; stopUrl?: string; stopLabel?: string },
): string {
  const contact = brand.contactEmail
    ? ` Questions? Write to <a href="mailto:${escapeHtml(brand.contactEmail)}" style="color:${color.accentText}">${escapeHtml(brand.contactEmail)}</a>.`
    : "";
  const stop = footer.stopUrl
    ? `<br><a href="${escapeHtml(footer.stopUrl)}" style="color:${color.accentText}">${escapeHtml(footer.stopLabel ?? "Stop these reminders")}</a>`
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

const textFooter = (brand: Brand, why: string, stopUrl?: string, stopLabel?: string) =>
  [
    "",
    "--",
    why,
    brand.contactEmail ? `Questions? Write to ${brand.contactEmail}.` : "",
    stopUrl ? `${stopLabel ?? "Stop these reminders"}: ${stopUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");

/* ---------- Offers and designs ---------- */

/** An offer as an email shows it: its painting, what it takes off, and its code. */
export type EmailOffer = {
  title: string;
  /** "20% off". */
  value: string;
  description: string;
  /** Null for a festival offer, which needs no code. */
  code: string | null;
  /** "Valid till 11 Nov 2026 · For everyone". */
  note: string;
  /** The painting, as an absolute address to a JPEG. */
  image: string;
};

/** A design as an email shows it: its cover and where it opens. */
export type EmailDesign = { name: string; image: string; href: string };

function label(text: string): string {
  return `<p style="margin:26px 0 12px;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:${color.accentText};font-weight:700">${escapeHtml(text)}</p>`;
}

/** Each offer as a ticket: the painting on top, a dashed tear, then the offer and its code. */
function offerTickets(brand: Brand, offers: EmailOffer[]): string {
  const page = link(brand, "/offers");
  return offers
    .map((offer) => {
      const code = offer.code
        ? `<p style="margin:12px 0 0"><span style="display:inline-block;padding:7px 14px;border:2px dashed ${color.marigold};border-radius:8px;background:${color.paper};font-family:'Courier New',monospace;font-size:19px;font-weight:700;letter-spacing:3px;color:${color.ink}">${escapeHtml(offer.code)}</span></p>`
        : `<p style="margin:12px 0 0;font-size:14px;font-weight:700;color:${color.success}">No code needed: it applies by itself at checkout.</p>`;
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;border:1px solid ${color.line};border-radius:14px;background:${color.ticket};border-collapse:separate">
<tr><td style="padding:0;line-height:0"><a href="${escapeHtml(page)}"><img src="${escapeHtml(offer.image)}" width="510" alt="" style="display:block;width:100%;max-width:510px;height:auto;border:0;border-radius:13px 13px 0 0"></a></td></tr>
<tr><td style="padding:16px 18px 18px;border-top:2px dashed ${color.line}">
<p style="margin:0;font-family:'Rozha One',Georgia,serif;font-size:32px;line-height:1.1;color:${color.accentText}">${escapeHtml(offer.value)}</p>
<p style="margin:4px 0 0;font-size:17px;font-weight:700;color:${color.ink}">${escapeHtml(offer.title)}</p>
${offer.description ? `<p style="margin:6px 0 0;font-size:15px;line-height:1.5;color:${color.inkMuted}">${escapeHtml(offer.description)}</p>` : ""}
${code}
<p style="margin:10px 0 0;font-size:13px;color:${color.inkMuted}">${escapeHtml(offer.note)}</p>
</td></tr>
</table>`;
    })
    .join("");
}

/** Designs three to a row, each its cover over its name. */
function designGrid(designs: EmailDesign[]): string {
  const rowsOf = [];
  for (let i = 0; i < designs.length; i += 3) rowsOf.push(designs.slice(i, i + 3));
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 4px">${rowsOf
    .map(
      (row) =>
        `<tr>${[0, 1, 2]
          .map((i) => {
            const design = row[i];
            if (!design) return `<td width="33%" style="padding:0 4px 14px"></td>`;
            return `<td width="33%" valign="top" style="padding:0 4px 14px"><a href="${escapeHtml(design.href)}" style="text-decoration:none;color:${color.ink}"><img src="${escapeHtml(design.image)}" width="160" alt="" style="display:block;width:100%;max-width:160px;height:auto;border:0;border-radius:10px"><span style="display:block;margin-top:8px;font-size:14px;font-weight:700;line-height:1.3">${escapeHtml(design.name)}</span></a></td>`;
          })
          .join("")}</tr>`,
    )
    .join("")}</table>`;
}

const offerLines = (offers: EmailOffer[]) =>
  offers.flatMap((offer) => [
    `${offer.value}: ${offer.title}${offer.code ? `. Code ${offer.code}` : ". No code needed"}`,
    `  ${offer.note}`,
  ]);

/* ---------- Welcome ---------- */

/** What one invitation gives, in the words of the first-visit popup (offersCopy.welcome). */
export type Feature = { title: string; body: string };

/**
 * A plain note, written like a person would, so Gmail files it in Primary: no pictures, no
 * offer codes, no button and one link. Offers and designs come later, in the new-designs
 * email.
 */
function plainLayout(brand: Brand, preheader: string, body: string, why: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(brand.name)}</title>
</head>
<body style="margin:0;padding:0;background:${color.surface};font-family:Helvetica,Arial,sans-serif">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</div>
<div style="max-width:560px;margin:0 auto;padding:24px 16px;font-size:16px;line-height:1.6;color:${color.ink}">
${body}
<p style="margin:28px 0 0;font-size:13px;line-height:1.6;color:${color.inkMuted}">${escapeHtml(why)}</p>
</div>
</body>
</html>`;
}

const plainParagraph = (text: string) => `<p style="margin:0 0 14px">${escapeHtml(text)}</p>`;

export function welcomeEmail(
  brand: Brand,
  name: string,
  details: { features: readonly Feature[]; signedBy: string },
): Email {
  const start = link(brand, "/create");
  const startLabel = start.replace(/^https?:\/\//, "");
  const intro = `Thank you for joining ${brand.name}. One invitation here gives you everything, in one place:`;
  const help = brand.contactEmail
    ? `If you get stuck, just reply to this email or write to ${brand.contactEmail}. A person reads every message.`
    : "If you get stuck, just reply to this email. A person reads every reply.";
  const first = name.trim().split(/\s+/)[0];
  const why = `You're getting this because you just made an account on ${brand.name}.`;
  const items = details.features
    .map(
      (feature) =>
        `<li style="margin:0 0 6px"><strong>${escapeHtml(feature.title)}</strong>: ${escapeHtml(feature.body)}</li>`,
    )
    .join("");
  return {
    subject: first ? `Welcome to ${brand.name}, ${first}` : `Welcome to ${brand.name}`,
    html: plainLayout(
      brand,
      "Your website, video and cards, all from one invitation.",
      `${plainParagraph(greeting(name))}${plainParagraph(intro)}<ul style="margin:0 0 16px;padding-left:22px">${items}</ul><p style="margin:0 0 14px">Start your invitation: <a href="${escapeHtml(start)}" style="color:${color.accentText}">${escapeHtml(startLabel)}</a></p>${plainParagraph(help)}<p style="margin:20px 0 0">${escapeHtml(details.signedBy)}<br>${escapeHtml(brand.name)}</p>`,
      why,
    ),
    text: [
      greeting(name),
      "",
      intro,
      "",
      ...details.features.map((feature) => `- ${feature.title}: ${feature.body}`),
      "",
      `Start your invitation: ${start}`,
      "",
      help,
      "",
      details.signedBy,
      brand.name,
      "",
      "--",
      why,
    ].join("\n"),
  };
}

/* ---------- New designs and offers ---------- */

export type DiscoverDetails = {
  name: string;
  offers: EmailOffer[];
  designs: EmailDesign[];
  stopUrl: string;
};

/** A few days after joining: new painted designs, picked for each person, and the offers running. */
export function discoverEmail(brand: Brand, d: DiscoverDetails): Email {
  const gallery = link(brand, "/invitations");
  const first = d.offers.find((offer) => offer.code);
  const subject = first
    ? `New designs for your invitation, and ${first.value} with ${first.code}`
    : "New designs for your invitation";
  const intro =
    "We've just painted new designs: each opens like a storybook, page by page, with music and a reply button for your guests. Here are a few we picked for you.";
  const why = `You're getting this because you made an account on ${brand.name}. We send this once.`;
  const stopLabel = "Stop these emails";
  return {
    subject,
    html: layout(
      brand,
      first
        ? `Fresh painted designs, plus ${first.code} for ${first.value}.`
        : "Fresh painted designs for your invitation.",
      `${heading("New designs, picked for you")}${paragraph(greeting(d.name))}${paragraph(intro)}${designGrid(d.designs)}${button(gallery, "See every design")}${
        d.offers.length
          ? `${label("Offers running now")}${offerTickets(brand, d.offers)}${button(link(brand, "/offers"), "See every offer")}`
          : ""
      }`,
      { why, stopUrl: d.stopUrl, stopLabel },
    ),
    text: [
      greeting(d.name),
      "",
      intro,
      "",
      ...d.designs.map((design) => `${design.name}: ${design.href}`),
      "",
      `See every design: ${gallery}`,
      ...(d.offers.length ? ["", "Offers running now:", ...offerLines(d.offers)] : []),
      textFooter(brand, why, d.stopUrl, stopLabel),
    ].join("\n"),
  };
}

/* ---------- Help and Instagram ---------- */

/** "Need help?" with each way to reach us, then the ask to follow on Instagram. */
function helpBlock(brand: Brand): string {
  const help = brand.help;
  if (!help) return "";
  const ways = [
    help.whatsappUrl && help.whatsappLabel
      ? `WhatsApp: <a href="${escapeHtml(help.whatsappUrl)}" style="color:${color.accentText}">${escapeHtml(help.whatsappLabel)}</a>`
      : "",
    brand.contactEmail
      ? `Email: <a href="mailto:${escapeHtml(brand.contactEmail)}" style="color:${color.accentText}">${escapeHtml(brand.contactEmail)}</a>`
      : "",
    `Instagram message: <a href="${escapeHtml(help.instagramUrl)}" style="color:${color.accentText}">${escapeHtml(help.instagramHandle)}</a>`,
  ].filter(Boolean);
  return `${label("Need help?")}<p style="margin:0 0 10px;font-size:15px;line-height:1.6;color:${color.ink}">Message us for anything about your invitation or payment. A person replies.</p><p style="margin:0 0 14px;font-size:15px;line-height:1.9;color:${color.ink}">${ways.join("<br>")}</p><p style="margin:0;font-size:15px;line-height:1.6;color:${color.ink}">Follow us on Instagram at <a href="${escapeHtml(help.instagramUrl)}" style="color:${color.accentText};font-weight:700">${escapeHtml(help.instagramHandle)}</a> for new designs, ideas and offers.</p>`;
}

function helpLines(brand: Brand): string[] {
  const help = brand.help;
  if (!help) return [];
  const ways = [
    help.whatsappUrl && help.whatsappLabel
      ? `WhatsApp ${help.whatsappLabel}: ${help.whatsappUrl}`
      : null,
    brand.contactEmail ? `Email: ${brand.contactEmail}` : null,
    `Instagram: ${help.instagramHandle} ${help.instagramUrl}`,
  ].filter((line): line is string => Boolean(line));
  return [
    "",
    "Need help? Message us for anything about your invitation or payment. A person replies.",
    ...ways,
    "",
    `Follow us on Instagram at ${help.instagramHandle} for new designs, ideas and offers.`,
  ];
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
  /** The bigger packages they can still move to, smallest first; none after the top one. */
  upgrades?: EmailUpgrade[];
};

/** A bigger package on the same invitation: what it adds and what it costs now. */
export type EmailUpgrade = {
  name: string;
  /** What it adds to the package they have. */
  adds: string[];
  /** The difference to pay now. */
  pricePaise: number;
  href: string;
};

function upgradeBlock(upgrades: EmailUpgrade[]): string {
  if (!upgrades.length) return "";
  const cards = upgrades
    .map(
      (up) =>
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 12px;border:1px solid ${color.line};border-radius:12px;background:${color.ticket};border-collapse:separate"><tr><td style="padding:16px 18px">
<p style="margin:0;font-size:17px;font-weight:700;color:${color.ink}">${escapeHtml(up.name)} <span style="font-weight:400;color:${color.inkMuted}">· ${escapeHtml(formatRupees(up.pricePaise))} more</span></p>
<ul style="margin:8px 0 10px;padding-left:20px;font-size:15px;line-height:1.55;color:${color.ink}">${up.adds.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
<a href="${escapeHtml(up.href)}" style="font-size:15px;font-weight:700;color:${color.accentText}">Move up to ${escapeHtml(up.name)}</a>
</td></tr></table>`,
    )
    .join("");
  return `${label("Want more for your invitation?")}<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:${color.ink}">You can move up any time and pay only the difference.</p>${cards}`;
}

const upgradeLines = (upgrades: EmailUpgrade[]) =>
  upgrades.length
    ? [
        "",
        "Want more for your invitation? Move up any time and pay only the difference.",
        ...upgrades.flatMap((up) => [
          `${up.name}, ${formatRupees(up.pricePaise)} more: ${up.href}`,
          ...up.adds.map((item) => `  - ${item}`),
        ]),
      ]
    : [];

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
      `${heading("Payment received")}${paragraph(greeting(r.buyerName))}${paragraph(thanks)}${rows(items)}${button(invoiceUrl, `View or print ${kind.toLowerCase()}`)}${helpBlock(brand)}${upgradeBlock(r.upgrades ?? [])}`,
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
      ...helpLines(brand),
      ...upgradeLines(r.upgrades ?? []),
      textFooter(brand, why),
    ].join("\n"),
  };
}

/* ---------- Not bought yet ---------- */

export type ReminderDetails = {
  hostName: string;
  /** "Aarav & Meera", or empty before the names are added. */
  names: string;
  /** The next function's date, or null when none is set. */
  date: Date | null;
  /** The designs they tried, newest first; empty when they haven't opened one. */
  tried: EmailDesign[];
  /** A few designs to start with, for someone who hasn't tried any. */
  suggested: EmailDesign[];
  /** Back to their latest invitation, or to the gallery. */
  resumeUrl: string;
  /** What one invitation gives, in a few words each. */
  features: readonly string[];
  stopUrl: string;
};

/**
 * Once per person, the day after they sign in without buying: what one invitation gives,
 * in short, and the designs they tried, with a way back to their invitation.
 */
export function reminderEmail(brand: Brand, d: ReminderDetails): Email {
  const started = d.tried.length > 0;
  const whose = d.names ? `${d.names}'s invitation` : "Your invitation";
  const when = d.date ? ` for ${dated.format(d.date)}` : "";
  const title = started ? `${whose} is waiting${when}` : "Your invitation, ready in minutes";
  const intro = started
    ? "Your invitation is saved just as you left it. Finish it, see every part free, and share it on WhatsApp when you're ready."
    : "Pick a design, add the names and each function, and see every part free before you pay.";
  const designs = started ? d.tried : d.suggested;
  const designsLabel = started
    ? d.tried.length > 1
      ? "The designs you tried"
      : "The design you chose"
    : "Designs to start with";
  const action = started ? "Finish your invitation" : "Start your invitation";
  const why = `You're getting this because you made an account on ${brand.name}. We send this once.`;
  const stopLabel = "Stop these emails";
  return {
    subject: title,
    html: layout(
      brand,
      "Website, video and cards, all from one invitation.",
      `${heading(title)}${paragraph(greeting(d.hostName))}${paragraph(intro)}${
        designs.length ? `${label(designsLabel)}${designGrid(designs)}` : ""
      }${button(d.resumeUrl, action)}${label("One invitation gives you")}<p style="margin:0 0 4px;font-size:15px;line-height:1.9;color:${color.ink}">${d.features.map((feature) => `✓ ${escapeHtml(feature)}`).join("<br>")}</p>${helpBlock(brand)}`,
      { why, stopUrl: d.stopUrl, stopLabel },
    ),
    text: [
      greeting(d.hostName),
      "",
      intro,
      ...(designs.length
        ? ["", `${designsLabel}:`, ...designs.map((design) => `${design.name}: ${design.href}`)]
        : []),
      "",
      `${action}: ${d.resumeUrl}`,
      "",
      "One invitation gives you:",
      ...d.features.map((feature) => `- ${feature}`),
      ...helpLines(brand),
      textFooter(brand, why, d.stopUrl, stopLabel),
    ].join("\n"),
  };
}

/* ---------- Error alert ---------- */

export type ErrorAlertDetails = {
  /** Where it broke: on the server, or in a visitor's browser. */
  where: "server" | "browser";
  message: string;
  stack?: string;
  /** The page, trimmed as for analytics so it names no invitation. */
  path: string;
  /** Anything else worth knowing, such as the route or the browser. */
  facts: [string, string][];
  at: Date;
};

const timed = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

/** To the people who look after the site, when a page breaks for someone. */
export function errorAlertEmail(brand: Brand, d: ErrorAlertDetails): Email {
  const place = d.where === "server" ? "on the server" : "in a visitor's browser";
  const title = `Something broke ${place}`;
  const stack = (d.stack ?? "").split("\n").slice(0, 12).join("\n");
  const details: [string, string][] = [
    ["Page", d.path],
    ["When", `${timed.format(d.at)} IST`],
    ...d.facts,
  ];
  const search = d.where === "server" ? "server-error" : "client-error";
  const lines = [
    `Vercel → Logs, searching for ${search}, shows every time it happened.`,
    "This email comes at most once a day for each kind of error, so a fix that works stops it.",
  ];
  const why = `You're getting this because you look after ${brand.name}'s site.`;
  const code = (value: string) =>
    `<pre style="margin:0 0 14px;padding:12px;white-space:pre-wrap;word-break:break-word;font-size:13px;line-height:1.5;background:${color.paper};border:1px solid ${color.line};border-radius:8px;color:${color.ink}">${escapeHtml(value)}</pre>`;
  return {
    subject: `${brand.name}: ${d.message.slice(0, 80)}`,
    html: layout(
      brand,
      `${d.message.slice(0, 120)} · ${d.path}`,
      `${heading(title)}${code(d.message)}${rows(details)}${stack ? code(stack) : ""}${lines.map(paragraph).join("")}`,
      { why },
    ),
    text: [
      title,
      "",
      d.message,
      "",
      ...details.map(([label, value]) => `${label}: ${value}`),
      ...(stack ? ["", stack] : []),
      "",
      ...lines,
      textFooter(brand, why),
    ].join("\n"),
  };
}
