// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { createTestDb, type TestDb } from "./test-db";

/* Coupons, invoice numbers and refunds (Step 17): who can read and write what. */

let t: TestDb;
let owner: string;
let host: string;

const q = <T = Record<string, unknown>>(sql: string, params: unknown[] = []) =>
  t.db.query<T>(sql, params).then((result) => result.rows);

beforeAll(async () => {
  t = await createTestDb();
  owner = await t.createUser({ name: "Rahul" });
  host = await t.createUser({ name: "Priya" });
  await q("insert into admins (user_id, role) values ($1, 'owner')", [owner]);
}, 30_000);

const order = (paidAt: string, id: string) =>
  t.as("service", () =>
    q<{ id: string }>(
      `insert into orders (user_id, plan_id, amount_paise, provider_order_id, mode, status, paid_at)
       values ($1, 'celebration', 49900, $2, 'test', 'paid', $3) returning id`,
      [host, id, paidAt],
    ).then((rows) => rows[0]!.id),
  );

describe("coupons", () => {
  it("are made and read by admins only", async () => {
    await expect(
      t.as(host, () => q("insert into coupons (code, percent_off) values ('FREE90', 90)")),
    ).rejects.toThrow(/row-level security/);
    await expect(
      t.as(null, () => q("insert into coupons (code, percent_off) values ('FREE90', 90)")),
    ).rejects.toThrow(/permission denied/);
    await t.as(owner, () =>
      q("insert into coupons (code, percent_off, auto_apply) values ('DIWALI25', 25, true)"),
    );
    expect(await t.as(host, () => q("select code from coupons"))).toEqual([]);
    expect(await t.as(owner, () => q("select code from coupons"))).toEqual([{ code: "DIWALI25" }]);
  });

  it("take a percentage or an amount, never both, and keep codes tidy", async () => {
    await expect(
      t.as(owner, () =>
        q("insert into coupons (code, percent_off, amount_off_paise) values ('BOTH', 10, 100)"),
      ),
    ).rejects.toThrow(/check constraint/);
    await expect(
      t.as(owner, () => q("insert into coupons (code, percent_off) values ('lower', 10)")),
    ).rejects.toThrow(/check constraint/);
    await expect(
      t.as(owner, () => q("insert into coupons (code, percent_off) values ('DIWALI25', 10)")),
    ).rejects.toThrow(/duplicate key/);
  });

  it("are counted only by the server", async () => {
    const [coupon] = await q<{ id: string }>("select id from coupons where code = 'DIWALI25'");
    await expect(t.as(host, () => q("select public.use_coupon($1)", [coupon!.id]))).rejects.toThrow(
      /permission denied/,
    );
    await t.as("service", () => q("select public.use_coupon($1)", [coupon!.id]));
    const [row] = await q<{ used_count: number }>("select used_count from coupons where id = $1", [
      coupon!.id,
    ]);
    expect(row!.used_count).toBe(1);
  });
});

describe("offers", () => {
  it("keep their words, people and designs tidy", async () => {
    await t.as(owner, () =>
      q(
        `insert into coupons (code, percent_off, label, description, terms, audience, design_tiers,
           design_ids, per_user_limit, show_on_site, featured)
         values ('FIRST10', 10, 'First booking offer', '10% off', 'Once per account.',
           'first-order', '{royal}', '{kayal-scene}', 1, true, true)`,
      ),
    );
    const [row] = await q<{ audience: string; featured: boolean }>(
      "select audience, featured from coupons where code = 'FIRST10'",
    );
    expect(row).toEqual({ audience: "first-order", featured: true });
    // Old coupons keep working as before
    const [old] = await q<{ audience: string; show_on_site: boolean }>(
      "select audience, show_on_site from coupons where code = 'DIWALI25'",
    );
    expect(old).toEqual({ audience: "everyone", show_on_site: false });

    const bad = [
      "insert into coupons (code, percent_off, audience) values ('BADWHO', 10, 'friends')",
      "insert into coupons (code, percent_off, design_tiers) values ('BADTIER', 10, '{gold}')",
      "insert into coupons (code, percent_off, featured) values ('BADHOME', 10, true)",
      "insert into coupons (code, percent_off, per_user_limit) values ('BADUSES', 10, 0)",
    ];
    for (const sql of bad) {
      await expect(t.as(owner, () => q(sql))).rejects.toThrow(/check constraint/);
    }
  });

  it("are changed only by admins", async () => {
    await t.as(host, () => q("update coupons set percent_off = 90 where code = 'FIRST10'"));
    await t.as(owner, () => q("update coupons set terms = 'Changed.' where code = 'FIRST10'"));
    const [row] = await q<{ percent_off: number; terms: string }>(
      "select percent_off, terms from coupons where code = 'FIRST10'",
    );
    expect(row).toEqual({ percent_off: 10, terms: "Changed." });
  });
});

describe("invoice numbers", () => {
  it("run in order each financial year and never change", async () => {
    const march = await order("2027-03-31T19:00:00Z", "order_a"); // 00:30 on 1 April in India
    const october = await order("2026-10-20T06:00:00Z", "order_b");
    const assign = (id: string) =>
      t
        .as("service", () => q<{ no: string }>("select public.assign_invoice_no($1) as no", [id]))
        .then((rows) => rows[0]!.no);
    expect(await assign(october)).toBe("SHUBH/2026-27/00001");
    expect(await assign(march)).toBe("SHUBH/2027-28/00001");
    expect(await assign(october)).toBe("SHUBH/2026-27/00001");
    const november = await order("2026-11-02T06:00:00Z", "order_c");
    expect(await assign(november)).toBe("SHUBH/2026-27/00002");
  });

  it("are given only by the server", async () => {
    const id = await order("2026-11-03T06:00:00Z", "order_d");
    await expect(t.as(host, () => q("select public.assign_invoice_no($1)", [id]))).rejects.toThrow(
      /permission denied/,
    );
    await expect(t.as(host, () => q("select * from invoice_counters"))).rejects.toThrow(
      /permission denied/,
    );
  });
});
