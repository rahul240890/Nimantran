import { describe, expect, it } from "vitest";
import { stopToken, stopTokenValid, stopUrl } from "./stop-link";
import {
  discoverEmail,
  escapeHtml,
  receiptEmail,
  reminderEmail,
  welcomeEmail,
  type Brand,
  type EmailDesign,
  type EmailOffer,
} from "./templates";

const brand: Brand = {
  name: "Shubh Invitation",
  siteUrl: "https://shubhinvitations.com/",
  contactEmail: "hello@shubhinvitations.com",
};

const features = [
  { title: "Invitation website", body: "One link with every function, its map and replies." },
  { title: "Wedding videos", body: "Full-HD videos for WhatsApp Status and Reels." },
];
const welcome = { features, signedBy: "Ved" };

const withHelp: Brand = {
  ...brand,
  help: {
    whatsappUrl: "https://wa.me/917228827010?text=Hi",
    whatsappLabel: "+91 72288 27010",
    instagramUrl: "https://www.instagram.com/shubhinvitations.in/",
    instagramHandle: "@shubhinvitations.in",
  },
};

const receipt = {
  orderId: "11111111-1111-4111-8111-111111111111",
  eventId: "22222222-2222-4222-8222-222222222222",
  buyerName: "Meera Iyer",
  names: "Aarav & Meera",
  packageName: "Celebration",
  invoiceNo: "SHUBH/2026-27/00012",
  listPricePaise: 149_900,
  discountPaise: 20_000,
  couponCode: "DIWALI",
  amountPaise: 129_900,
  paymentId: "pay_abc",
  paidAt: new Date("2026-10-15T06:00:00Z"),
  taxInvoice: false,
};

const offer: EmailOffer = {
  title: "Diwali offer",
  value: "20% off",
  description: "Light up your Diwali invitation.",
  code: "DIWALI26",
  note: "Valid till 11 Nov 2026 · For everyone · On every package",
  image: "https://shubhinvitations.com/occasions/festival-email.jpg",
};

const design: EmailDesign = {
  name: "Aasmaani",
  image: "https://shubhinvitations.com/suites/aasmaani/preview.jpg",
  href: "https://shubhinvitations.com/create?suite=aasmaani",
};

describe("emails", () => {
  it("escapes what people typed", () => {
    expect(escapeHtml(`<b>"A" & 'B'</b>`)).toBe(
      "&lt;b&gt;&quot;A&quot; &amp; &#39;B&#39;&lt;/b&gt;",
    );
    const email = welcomeEmail(brand, "<script>x</script>", welcome);
    expect(email.html).not.toContain("<script>");
  });

  it("welcomes by first name, plainly, with the features and one link", () => {
    const email = welcomeEmail(brand, "Meera Iyer", welcome);
    expect(email.subject).toBe("Welcome to Shubh Invitation, Meera");
    expect(email.text).toContain("Namaste Meera,");
    expect(email.text).toContain("- Wedding videos: Full-HD videos for WhatsApp Status and Reels.");
    expect(email.html).toContain("https://shubhinvitations.com/create");
    // Plain, so Gmail files it in Primary: no pictures, no offer codes, a single link
    expect(email.html).not.toContain("<img");
    expect(email.html.match(/<a /g)).toHaveLength(1);
    expect(welcomeEmail(brand, "", welcome).text).toContain("Namaste,");
    expect(welcomeEmail(brand, "", welcome).subject).toBe("Welcome to Shubh Invitation");
  });

  it("sends new designs with the offers, and a way out", () => {
    const email = discoverEmail(brand, {
      name: "Meera",
      offers: [offer],
      designs: [design, design, design, design],
      stopUrl: "https://shubhinvitations.com/emails/stop?u=x&t=y",
    });
    expect(email.subject).toBe("New designs for your invitation, and 20% off with DIWALI26");
    expect(email.html).toContain("Stop these emails");
    expect(email.html.match(/preview\.jpg/g)).toHaveLength(4);
    expect(email.text).toContain("Stop these emails: https://shubhinvitations.com/emails/stop");
    expect(
      discoverEmail(brand, { ...email, name: "", offers: [], designs: [], stopUrl: "x" }).subject,
    ).toBe("New designs for your invitation");
  });

  it("puts the amount, discount and invoice number on a receipt", () => {
    const email = receiptEmail(brand, receipt);
    expect(email.subject).toBe("Receipt SHUBH/2026-27/00012: Celebration package");
    expect(email.text).toContain("Paid: ₹1,299");
    expect(email.text).toContain("Discount (DIWALI): −₹200");
    expect(email.text).toContain("Date: 15 October 2026");
    expect(email.text).not.toContain("CGST");
    expect(email.html).toContain(`/invoice/${receipt.orderId}`);
    expect(email.html).not.toContain("Need help?");
  });

  it("gives help, Instagram and the bigger packages on a receipt", () => {
    const email = receiptEmail(withHelp, {
      ...receipt,
      packageName: "Basic",
      upgrades: [
        {
          name: "Grand",
          adds: ["Save the date and thank-you cards in your design"],
          pricePaise: 150_000,
          href: "https://shubhinvitations.com/invites/x/edition?plan=grand",
        },
      ],
    });
    expect(email.html).toContain("Need help?");
    expect(email.html).toContain("wa.me/917228827010");
    expect(email.text).toContain("Follow us on Instagram at @shubhinvitations.in");
    expect(email.text).toContain(
      "Grand, ₹1,500 more: https://shubhinvitations.com/invites/x/edition?plan=grand",
    );
    expect(receiptEmail(withHelp, { ...receipt, upgrades: [] }).html).not.toContain("Move up to");
  });

  it("splits GST once the business has a GSTIN", () => {
    const email = receiptEmail(brand, { ...receipt, taxInvoice: true, discountPaise: 0 });
    expect(email.subject).toMatch(/^Tax invoice /);
    expect(email.text).toContain("CGST 9%");
    expect(email.text).not.toContain("Discount");
  });

  it("reminds once with the designs they tried, the features in short, and a way out", () => {
    const base = {
      hostName: "Meera",
      names: "Aarav & Meera",
      date: new Date("2026-12-12T06:30:00Z"),
      tried: [design, { ...design, name: "Kayal" }],
      suggested: [],
      resumeUrl: `https://shubhinvitations.com/create?invite=${receipt.eventId}`,
      features: ["Videos for WhatsApp Status and Reels"],
      stopUrl: "https://shubhinvitations.com/emails/stop?u=x&t=y",
    };
    const email = reminderEmail(withHelp, base);
    expect(email.subject).toBe("Aarav & Meera's invitation is waiting for 12 December 2026");
    expect(email.html).toContain("The designs you tried");
    expect(email.html).toContain(`/create?invite=${receipt.eventId}`);
    expect(email.html).toContain("Stop these emails");
    expect(email.text).toContain("- Videos for WhatsApp Status and Reels");
    const fresh = reminderEmail(withHelp, {
      ...base,
      names: "",
      date: null,
      tried: [],
      suggested: [design],
    });
    expect(fresh.subject).toBe("Your invitation, ready in minutes");
    expect(fresh.html).toContain("Designs to start with");
  });
});

describe("stop links", () => {
  it("accepts only the signature for that account", () => {
    const token = stopToken("secret", "user-1");
    expect(stopTokenValid("secret", "user-1", token)).toBe(true);
    expect(stopTokenValid("secret", "user-2", token)).toBe(false);
    expect(stopTokenValid("other", "user-1", token)).toBe(false);
    expect(stopTokenValid("secret", "user-1", "short")).toBe(false);
    expect(stopUrl("https://shubhinvitations.com/", "secret", "user-1")).toBe(
      `https://shubhinvitations.com/emails/stop?u=user-1&t=${token}`,
    );
  });
});
