import { accountText } from "@/i18n/copy/account";
import { editionsText } from "@/i18n/copy/editions";
import { getLocale, getText } from "@/i18n/server";
import { getAccount } from "@/lib/auth/server";
import { rupeesCell, toCsv } from "@/lib/payments/csv";
import { paymentHistory } from "@/lib/payments/history";

/** The signed-in person's payment history as a spreadsheet (Account, Payments). */
export async function GET() {
  const account = await getAccount();
  if (!account) return new Response("Sign in to download your payments.", { status: 401 });
  const locale = await getLocale();
  const [{ paymentsCopy: copy }, { planCopy }, payments] = await Promise.all([
    getText(accountText, locale),
    getText(editionsText, locale),
    paymentHistory(account, locale),
  ]);
  // Dates as India sees them, in a form spreadsheets sort: 2026-10-15 and 19:42
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" });
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
  });
  const rows = payments.map((payment) => {
    const at = new Date(payment.paidAt ?? payment.createdAt);
    return [
      date.format(at),
      time.format(at),
      payment.invoiceNo ?? payment.id.slice(0, 8),
      planCopy[payment.planId].name,
      payment.item.occasion ?? "",
      payment.item.names,
      payment.item.design ?? "",
      copy.tier[payment.designTier],
      rupeesCell(payment.listPricePaise),
      rupeesCell(payment.discountPaise),
      payment.couponCode ?? "",
      rupeesCell(payment.amountPaise),
      payment.status === "refunded" ? copy.refunded : copy.paid,
      payment.providerPaymentId ?? "",
    ];
  });
  const today = date.format(new Date());
  return new Response(toCsv([copy.csv.headers, ...rows]), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${copy.csv.file}-${today}.csv"`,
      "cache-control": "private, no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}
