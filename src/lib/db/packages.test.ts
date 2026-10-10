// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { createTestDb, migrationFiles, migrationSql, type TestDb } from "./test-db";

/* The move from editions to packages: what existing buyers, orders and coupons become. */

const PACKAGES = migrationFiles().find((file) => file.endsWith("_packages.sql"))!;

let t: TestDb;
const events: Record<string, string> = {};

const q = <T = Record<string, unknown>>(sql: string, params: unknown[] = []) =>
  t.db.query<T>(sql, params).then((result) => result.rows);

beforeAll(async () => {
  t = await createTestDb({ before: PACKAGES });
  const host = await t.createUser({ name: "Priya" });
  for (const plan of ["premium", "royal", "bundle"]) {
    events[plan] = await t.as(host, async () => {
      const [row] = await q<{ id: string }>(
        `insert into events (category_id, template_id, content) values ('wedding', 'marigold', '{}') returning id`,
      );
      return row!.id;
    });
    await q(
      `insert into orders (event_id, user_id, plan_id, from_plan_id, amount_paise, provider_order_id, mode, status)
       values ($1, $2, $3, 'free', 49900, $4, 'test', 'paid')`,
      [events[plan], host, plan, `order_${plan}`],
    );
    await q("insert into event_plans (event_id, plan_id, source) values ($1, $2, 'purchase')", [
      events[plan],
      plan,
    ]);
  }
  await q(
    `insert into coupons (code, percent_off, plan_ids) values ('DIWALI25', 25, array['premium', 'bundle'])`,
  );
  await t.db.exec(migrationSql(PACKAGES));
}, 30_000);

describe("packages migration", () => {
  it("gives Premium buyers Celebration for Premium designs, and Royal and bundle buyers Grand", async () => {
    const rows = await q<{ event_id: string; plan_id: string; design_tier: string }>(
      "select event_id, plan_id, design_tier from event_plans",
    );
    const by = Object.fromEntries(rows.map((row) => [row.event_id, row]));
    expect(by[events.premium!]).toMatchObject({ plan_id: "celebration", design_tier: "premium" });
    expect(by[events.royal!]).toMatchObject({ plan_id: "grand", design_tier: "royal" });
    expect(by[events.bundle!]).toMatchObject({ plan_id: "grand", design_tier: "royal" });
  });

  it("renames the packages on orders and coupons", async () => {
    const orders = await q<{ plan_id: string; from_plan_id: string; from_design_tier: string }>(
      "select plan_id, from_plan_id, from_design_tier from orders order by provider_order_id",
    );
    expect(orders.map((order) => order.plan_id)).toEqual(["grand", "celebration", "grand"]);
    expect(orders.every((order) => order.from_plan_id === "free")).toBe(true);
    expect(orders.every((order) => order.from_design_tier === "free")).toBe(true);
    const [coupon] = await q<{ plan_ids: string[] }>("select plan_ids from coupons");
    expect([...coupon!.plan_ids].sort()).toEqual(["celebration", "grand"]);
  });

  it("refuses the old names afterwards", async () => {
    await expect(
      q("update event_plans set plan_id = 'royal' where event_id = $1", [events.royal]),
    ).rejects.toThrow(/check/);
  });
});
