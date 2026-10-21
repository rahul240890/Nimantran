import { describe, expect, it } from "vitest";
import { stopToken, stopTokenValid, stopUrl } from "./stop-link";
import {
  discoverEmail,
  draftReminderEmail,
  escapeHtml,
  receiptEmail,
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
    const email = welcomeEmail(brand, "<script>x</script>");
    expect(email.html).not.toContain("<script>");
  });

  it("welcomes by first name and links to a new invitation", () => {
    const email = welcomeEmail(brand, "Meera Iyer");
    expect(email.subject).toBe("Welcome to Shubh Invitation");
    expect(email.text).toContain("Namaste Meera,");
    expect(email.html).toContain("https://shubhinvitations.com/create");
    expect(welcomeEmail(brand, "").text).toContain("Namaste,");
  });

  it("shows the offers and designs a new account can use in the welcome", () => {
    const email = welcomeEmail(brand, "Meera", {
      offers: [offer, { ...offer, title: "Festival", code: null }],
      designs: [design],
    });
    expect(email.html).toContain("DIWALI26");
    expect(email.html).toContain("festival-email.jpg");
    expect(email.html).toContain("No code needed");
    expect(email.html).toContain("suites/aasmaani/preview.jpg");
    expect(email.text).toContain("20% off: Diwali offer. Code DIWALI26");
    expect(email.text).toContain("Aasmaani: https://shubhinvitations.com/create?suite=aasmaani");
    expect(welcomeEmail(brand, "Meera").html).not.toContain("Offers for you");
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
  });

  it("splits GST once the business has a GSTIN", () => {
    const email = receiptEmail(brand, { ...receipt, taxInvoice: true, discountPaise: 0 });
    expect(email.subject).toMatch(/^Tax invoice /);
    expect(email.text).toContain("CGST 9%");
    expect(email.text).not.toContain("Discount");
  });

  it("reminds about a draft with a way back and a way out", () => {
    const email = draftReminderEmail(brand, {
      eventId: receipt.eventId,
      hostName: "Meera",
      names: "Aarav & Meera",
      stopUrl: "https://shubhinvitations.com/emails/stop?u=x&t=y",
    });
    expect(email.subject).toBe("Aarav & Meera's invitation is waiting");
    expect(email.html).toContain(`/create?invite=${receipt.eventId}`);
    expect(email.html).toContain("Stop these reminders");
    expect(email.text).toContain("emails/stop?u=x&t=y");
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
