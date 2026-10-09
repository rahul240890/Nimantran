// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { createTestDb, type TestDb } from "./test-db";

/* The master admin and editions (Steps 15 to 17): who can read and write what. */

let t: TestDb;
let owner: string;
let host: string;
let stranger: string;
let event: string;

const q = <T = Record<string, unknown>>(sql: string, params: unknown[] = []) =>
  t.db.query<T>(sql, params).then((result) => result.rows);

const isAdmin = (who: string | null) =>
  t.as(who, () => q<{ ok: boolean }>("select public.is_admin() as ok")).then((r) => r[0]!.ok);

beforeAll(async () => {
  t = await createTestDb();
  owner = await t.createUser({ name: "Rahul" });
  host = await t.createUser({ name: "Priya" });
  stranger = await t.createUser();
  // The owner's own SQL, as supabase/README.md gives it
  await q("insert into admins (user_id, role) values ($1, 'owner')", [owner]);
  event = await t.as(host, async () => {
    const [row] = await q<{ id: string }>(
      `insert into events (category_id, template_id, content, status, slug)
       values ('wedding', 'marigold', '{"first":"Aarav"}', 'published', 'aarav-weds-meera') returning id`,
    );
    return row!.id;
  });
}, 30_000);

describe("admins", () => {
  it("knows who is an admin", async () => {
    expect(await isAdmin(owner)).toBe(true);
    expect(await isAdmin(host)).toBe(false);
    expect(await isAdmin(null)).toBe(false);
  });

  it("lets nobody make themselves an admin", async () => {
    await expect(
      t.as(stranger, () => q("insert into admins (user_id) values ($1)", [stranger])),
    ).rejects.toThrow(/permission denied/);
    expect(await isAdmin(stranger)).toBe(false);
    expect(await t.as(host, () => q("select user_id from admins"))).toEqual([]);
  });
});

describe("settings", () => {
  it("start with checkout off, for everyone to ask", async () => {
    const [row] = await t.as(null, () =>
      q<{ on: boolean }>("select public.checkout_enabled() as on"),
    );
    expect(row!.on).toBe(false);
  });

  it("change only for an admin", async () => {
    await expect(
      t.as(host, () =>
        q(`insert into app_settings (key, value) values ('payments', '{"checkoutEnabled": true}')`),
      ),
    ).rejects.toThrow(/row-level security/);
    await t.as(owner, () =>
      q(`insert into app_settings (key, value) values ('payments', '{"checkoutEnabled": true}')`),
    );
    const [row] = await t.as(null, () =>
      q<{ on: boolean }>("select public.checkout_enabled() as on"),
    );
    expect(row!.on).toBe(true);
    expect(await t.as(host, () => q("select key from app_settings"))).toEqual([]);
    expect(await t.as(null, () => q("select key from app_settings")).catch(() => [])).toEqual([]);
  });
});

describe("orders and editions", () => {
  it("are written only by the server", async () => {
    await expect(
      t.as(host, () =>
        q(
          `insert into orders (event_id, user_id, plan_id, amount_paise, provider_order_id, mode)
           values ($1, $2, 'grand', 100, 'order_fake', 'test')`,
          [event, host],
        ),
      ),
    ).rejects.toThrow(/permission denied/);
    await expect(
      t.as(host, () =>
        q("insert into event_plans (event_id, plan_id, source) values ($1, 'grand', 'admin')", [
          event,
        ]),
      ),
    ).rejects.toThrow(/permission denied/);
  });

  it("leave a published invite Free until paid, then show its edition", async () => {
    const plan = () =>
      t
        .as(null, () =>
          q<{ plan: string | null }>("select public.published_invite_plan($1) as plan", [
            "aarav-weds-meera",
          ]),
        )
        .then((rows) => rows[0]!.plan);
    expect(await plan()).toBe("free");
    await t.as("service", async () => {
      const [order] = await q<{ id: string }>(
        `insert into orders (event_id, user_id, plan_id, amount_paise, provider_order_id, mode, status)
         values ($1, $2, 'celebration', 49900, 'order_1', 'test', 'paid') returning id`,
        [event, host],
      );
      await q(
        "insert into event_plans (event_id, plan_id, source, order_id) values ($1, 'celebration', 'purchase', $2)",
        [event, order!.id],
      );
    });
    expect(await plan()).toBe("celebration");
    const [none] = await t.as(null, () =>
      q<{ plan: string | null }>("select public.published_invite_plan('nobody') as plan"),
    );
    expect(none!.plan).toBeNull();
  });

  it("are readable by the buyer, the invite's hosts and admins only", async () => {
    expect(await t.as(host, () => q("select id from orders"))).toHaveLength(1);
    expect(await t.as(owner, () => q("select id from orders"))).toHaveLength(1);
    expect(await t.as(stranger, () => q("select id from orders"))).toEqual([]);
    expect(await t.as(host, () => q("select plan_id from event_plans"))).toEqual([
      { plan_id: "celebration" },
    ]);
    expect(await t.as(stranger, () => q("select plan_id from event_plans"))).toEqual([]);
    expect(await t.as(owner, () => q("select plan_id from event_plans"))).toHaveLength(1);
  });

  it("keeps orders for the records when the invite goes", async () => {
    await t.as(host, () => q("delete from events where id = $1", [event]));
    const rows = await q<{ event_id: string | null }>("select event_id from orders");
    expect(rows).toEqual([{ event_id: null }]);
    expect(await q("select event_id from event_plans")).toEqual([]);
  });
});
