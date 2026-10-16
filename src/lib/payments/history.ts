import "server-only";
import { designWords } from "@/components/gallery/design-words";
import type { UiLocale } from "@/i18n/locales";
import type { Account } from "@/lib/auth/account";
import { designById } from "@/lib/gallery/catalog";
import { inviteStore } from "@/lib/invites/store";
import { draftDesignId } from "@/lib/plans/design-defaults";
import { inviteNames, occasionName } from "@/lib/publish/describe";
import { accountOrders, type AdminOrder } from "./editions";

/** What a payment bought, as receipts and the payment history describe it. */
export type PaymentItem = {
  /** The invite's names, "Aarav & Meera"; empty once the invite is deleted. */
  names: string;
  /** "Wedding", "Birthday"… */
  occasion: string | null;
  /**
   * The design the payment was for, by name; for orders from before payments named their
   * design, the one the invite uses now.
   */
  design: string | null;
};

export type Payment = AdminOrder & { item: PaymentItem };

/** The invites' names, occasions and designs for these orders, one look-up per invite. */
export async function paymentItems(
  account: Account,
  orders: AdminOrder[],
  locale: UiLocale,
): Promise<Map<string, PaymentItem>> {
  const store = inviteStore();
  const ids = [...new Set(orders.flatMap((order) => (order.eventId ? [order.eventId] : [])))];
  const drafts = await Promise.all(
    ids.map((id) => (store ? store.get(account, id).catch(() => null) : null)),
  );
  const items = new Map<string, PaymentItem>();
  ids.forEach((id, index) => {
    const draft = drafts[index];
    if (!draft) return;
    const design = designById(draftDesignId(draft));
    items.set(id, {
      names: inviteNames(draft),
      occasion: occasionName(draft, locale),
      design: design ? designWords(design, locale).name : null,
    });
  });
  return items;
}

/** What one order bought: its invite, named with the design that order paid for. */
export function orderItem(
  order: AdminOrder,
  items: Map<string, PaymentItem>,
  locale: UiLocale,
): PaymentItem {
  const item = (order.eventId ? items.get(order.eventId) : undefined) ?? {
    names: order.names,
    occasion: null,
    design: null,
  };
  const paidFor = order.designId ? designById(order.designId) : undefined;
  return paidFor ? { ...item, design: designWords(paidFor, locale).name } : item;
}

/** This person's payment history with what each payment bought, newest first. */
export async function paymentHistory(account: Account, locale: UiLocale): Promise<Payment[]> {
  const orders = await accountOrders(account);
  const items = await paymentItems(account, orders, locale);
  return orders.map((order) => ({ ...order, item: orderItem(order, items, locale) }));
}
