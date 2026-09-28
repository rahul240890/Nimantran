import { KeyRound, Webhook, WalletCards } from "lucide-react";
import type { Metadata } from "next";
import { AdminHeading } from "@/components/admin/admin-shell";
import { CheckoutSwitch, CopyValue, TestConnection } from "@/components/admin/razorpay-controls";
import { SettingRow } from "@/components/admin/setting-row";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/admin/access";
import { authMode } from "@/lib/auth/mode";
import { checkoutProvider, checkoutSwitchedOn } from "@/lib/payments/editions";
import { razorpayStatus } from "@/lib/payments/razorpay";
import { requestOrigin } from "@/lib/request-origin";

export const metadata: Metadata = { title: "Razorpay" };

const WEBHOOK_EVENTS = ["payment.captured", "order.paid", "payment.failed"];

const set = (label = "Set") => ({ tone: "success" as const, label });
const missing = { tone: "warning" as const, label: "Not set" };

/** Payment keys, the webhook and the checkout switch. Secrets stay in Vercel. */
export default async function RazorpayPage() {
  await requireAdmin("/admin/razorpay");
  const status = razorpayStatus();
  const [switchedOn, origin] = await Promise.all([checkoutSwitchedOn(), requestOrigin()]);
  const provider = checkoutProvider();
  const webhookUrl = `${origin.replace(/\/+$/, "")}/api/razorpay/webhook`;
  const serviceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const live = switchedOn && Boolean(provider);

  return (
    <>
      <AdminHeading
        eyebrow="Payments"
        title="Razorpay"
        intro="Hosts pay for editions through Razorpay: UPI, cards and netbanking. The keys live in Vercel's environment variables, never in the database, and this page only ever shows their last four characters."
        action={
          <Badge tone={live ? "success" : "neutral"} dot>
            {live ? "Taking payments" : "Not taking payments"}
          </Badge>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <div className="flex min-w-0 flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <WalletCards aria-hidden className="size-5 text-accent-text" />
                Checkout
              </CardTitle>
              <CardDescription>
                While it&apos;s off, everything is free: no watermark and no limits, as before
                payments. Turning it on applies to every invite at once.
              </CardDescription>
            </CardHeader>
            <CardBody>
              <CheckoutSwitch on={switchedOn} canTurnOn={Boolean(provider)} />
              {provider === "preview" && (
                <p className="rounded-md border border-line bg-surface-2 px-4 py-3 text-sm text-ink-muted">
                  Preview mode: with no keys, hosts see a test payment instead of Razorpay and no
                  money moves.
                </p>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound aria-hidden className="size-5 text-accent-text" />
                Keys
              </CardTitle>
              <CardDescription>
                Read from Vercel on every request. After changing one there, redeploy for it to take
                effect.
              </CardDescription>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col divide-y divide-line">
                <SettingRow
                  name="Key id"
                  where="RAZORPAY_KEY_ID"
                  value={status.keyId ?? undefined}
                  state={
                    !status.keyId
                      ? missing
                      : !status.keyIdValid
                        ? { tone: "danger", label: "Not a Razorpay key id" }
                        : status.mode === "live"
                          ? { tone: "gold", label: "Live mode" }
                          : { tone: "neutral", label: "Test mode" }
                  }
                />
                <SettingRow
                  name="Key secret"
                  where="RAZORPAY_KEY_SECRET"
                  value={status.keySecret ?? undefined}
                  state={status.keySecret ? set() : missing}
                />
                <SettingRow
                  name="Webhook secret"
                  where="RAZORPAY_WEBHOOK_SECRET"
                  value={status.webhookSecret ?? undefined}
                  state={status.webhookSecret ? set() : missing}
                />
                <SettingRow
                  name="Supabase service key"
                  where="SUPABASE_SERVICE_ROLE_KEY, to record payments"
                  state={serviceKey || authMode() === "preview" ? set() : missing}
                />
              </div>
              <TestConnection disabled={!status.ready} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook aria-hidden className="size-5 text-accent-text" />
                Webhook
              </CardTitle>
              <CardDescription>
                Razorpay calls this address after each payment, so an edition unlocks even if the
                host&apos;s phone closes the page before paying finishes.
              </CardDescription>
            </CardHeader>
            <CardBody>
              <CopyValue label="Webhook URL" value={webhookUrl} />
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-ink">Events to tick</span>
                <ul className="flex flex-wrap gap-2">
                  {WEBHOOK_EVENTS.map((event) => (
                    <li key={event}>
                      <code className="inline-flex min-h-8 items-center rounded-md border border-line bg-surface-2 px-2.5 font-mono text-sm">
                        {event}
                      </code>
                    </li>
                  ))}
                </ul>
              </div>
            </CardBody>
          </Card>
        </div>

        <Card elevation="flat" className="self-start bg-surface-2/60">
          <CardHeader>
            <CardTitle>Setting it up</CardTitle>
          </CardHeader>
          <CardBody>
            <ol className="flex list-decimal flex-col gap-3 ps-5 text-sm text-ink-muted marker:font-semibold marker:text-accent-text">
              <li>
                In the Razorpay Dashboard, switch to <strong className="text-ink">Test mode</strong>{" "}
                (top bar), open <strong className="text-ink">Account &amp; Settings</strong>, then{" "}
                <strong className="text-ink">API Keys</strong>, and generate a key.
              </li>
              <li>
                In Vercel, open the project, then <strong className="text-ink">Settings</strong>,{" "}
                <strong className="text-ink">Environment Variables</strong>, and add{" "}
                <code>RAZORPAY_KEY_ID</code> and <code>RAZORPAY_KEY_SECRET</code>.
              </li>
              <li>
                In Razorpay, <strong className="text-ink">Webhooks</strong>, add the webhook URL
                above with a secret you make up, tick the three events, and add the same secret in
                Vercel as <code>RAZORPAY_WEBHOOK_SECRET</code>.
              </li>
              <li>
                Redeploy in Vercel, come back here, press{" "}
                <strong className="text-ink">Test connection</strong>, then turn checkout on.
              </li>
              <li>
                When Razorpay approves your account for live payments, repeat with the Live mode
                keys and a Live webhook.
              </li>
            </ol>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
