import { fulfilOrder, markOrderFailed } from "@/lib/payments/editions";
import { webhookSignatureValid } from "@/lib/payments/razorpay";

/*
 * Razorpay tells us about payments here too, so an edition unlocks even when the host's
 * browser closes before the checkout returns. Signed with RAZORPAY_WEBHOOK_SECRET; the
 * address to paste into Razorpay is on Admin, Razorpay.
 */

type PaymentEntity = { id?: unknown; order_id?: unknown; status?: unknown };
type WebhookEvent = { event?: unknown; payload?: { payment?: { entity?: PaymentEntity } } };

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  if (!secret) return new Response("Webhook not set up", { status: 503 });
  const body = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  if (!signature || !webhookSignatureValid(secret, body, signature)) {
    return new Response("Bad signature", { status: 401 });
  }

  let event: WebhookEvent;
  try {
    event = JSON.parse(body) as WebhookEvent;
  } catch {
    return new Response("Bad body", { status: 400 });
  }
  const payment = event.payload?.payment?.entity;
  const orderId = typeof payment?.order_id === "string" ? payment.order_id : null;
  const paymentId = typeof payment?.id === "string" ? payment.id : null;
  if (!orderId || !paymentId) return Response.json({ ok: true, ignored: true });

  if (event.event === "payment.captured" || event.event === "order.paid") {
    const plan = await fulfilOrder(orderId, paymentId);
    // Not recorded (the database was unreachable, or an order made outside the app):
    // Razorpay tries again later
    return plan ? Response.json({ ok: true, plan }) : new Response("Not recorded", { status: 500 });
  }
  if (event.event === "payment.failed") {
    await markOrderFailed(orderId);
    return Response.json({ ok: true });
  }
  return Response.json({ ok: true, ignored: true });
}
