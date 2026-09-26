import type { WaitlistEntry } from "./schema";

export type StoreResult = "stored" | "unavailable" | "failed";

/**
 * Where sign-ups go until the database arrives in Step 8.
 * WAITLIST_WEBHOOK_URL receives each entry as JSON (a Google Sheet, Zapier or any form backend).
 * WAITLIST_LOG_ONLY=1 logs entries instead, for local work and browser tests. It is ignored
 * on the live Vercel site, so a copied setting can never quietly throw real sign-ups away.
 */
export async function storeWaitlistEntry(entry: WaitlistEntry): Promise<StoreResult> {
  const record = { ...entry, joinedAt: new Date().toISOString(), source: "landing" };

  if (process.env.WAITLIST_LOG_ONLY === "1" && process.env.VERCEL_ENV !== "production") {
    console.info("[waitlist]", record.email, record.occasion);
    return "stored";
  }

  const url = process.env.WAITLIST_WEBHOOK_URL;
  if (!url) {
    console.error("[waitlist] WAITLIST_WEBHOOK_URL is not set; the entry was not stored");
    return "unavailable";
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(record),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("[waitlist] webhook answered", res.status);
      return "failed";
    }
    return "stored";
  } catch (error) {
    console.error("[waitlist] webhook failed", error);
    return "failed";
  }
}
