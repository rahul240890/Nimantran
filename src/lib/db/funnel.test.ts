// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { createTestDb, type TestDb } from "./test-db";

/* The admin's funnel (Admin, Visitors): steps counted with the same day's visitor code. */

let t: TestDb;
let owner: string;
let host: string;

const q = <T = Record<string, unknown>>(sql: string, params: unknown[] = []) =>
  t.db.query<T>(sql, params).then((result) => result.rows);

const visit = (who: string | null, key: string, path: string, source: string | null = null) =>
  t.as(who, () =>
    q("select public.record_visit($1, $2, null, $3, null, 'mobile', null, null)", [
      key,
      path,
      source,
    ]),
  );

const step = (who: string | null, key: string, name: string, design: string | null = null) =>
  t.as(who, () => q("select public.record_step($1, $2, $3, null)", [key, name, design]));

type Funnel = {
  steps: Record<string, number>;
  sources: { label: string; visitors: number; designs: number; preview: number; paid: number }[];
  designs: { label: string; visitors: number }[];
  outcomes: Record<string, number>;
};

const funnel = () =>
  t
    .as("service", () => q<{ f: Funnel }>("select public.funnel_summary(7) as f"))
    .then((rows) => rows[0]!.f);

beforeAll(async () => {
  t = await createTestDb();
  owner = await t.createUser({ name: "Rahul" });
  host = await t.createUser({ name: "Priya" });
  await q("insert into admins (user_id, role) values ($1, 'owner')", [owner]);
}, 30_000);

describe("funnel steps", () => {
  it("are counted under the visitor's code for the day, and not for admins", async () => {
    await visit(null, "1.1.1.1|Chrome", "/", "instagram");
    await step(null, "1.1.1.1|Chrome", "details", "rajwada-bagh");
    await step(null, "1.1.1.1|Chrome", "details", "rajwada-bagh");
    await step(null, "1.1.1.1|Chrome", "preview");
    await visit(null, "2.2.2.2|Safari", "/i/[invite]", "guest");
    await step(null, "2.2.2.2|Safari", "details", "kayal");
    await visit(host, "3.3.3.3|Firefox", "/create");
    await step(host, "3.3.3.3|Firefox", "checkout");
    await step(host, "3.3.3.3|Firefox", "paid");
    await step(owner, "4.4.4.4|Edge", "paid");
    const rows = await q<{ visitor: string; user_id: string | null }>(
      "select visitor, user_id from site_steps order by id",
    );
    expect(rows).toHaveLength(6);
    const [views] = await q<{ visitor: string }>(
      "select visitor from site_visits where path = '/' limit 1",
    );
    expect(rows[0]!.visitor).toBe(views!.visitor);
    expect(rows.at(-1)!.user_id).toBe(host);
  });

  it("ignore anything that isn't a known step", async () => {
    await step(null, "1.1.1.1|Chrome", "hacked");
    await step(null, "", "preview");
    expect(await q("select count(*)::int as n from site_steps")).toEqual([{ n: 6 }]);
  });

  it("show each step once per visitor and day, where visitors came from, and the designs", async () => {
    const result = await funnel();
    expect(result.steps).toMatchObject({
      visitors: 3,
      details: 2,
      preview: 1,
      signedIn: 1,
      checkout: 1,
      paid: 1,
    });
    expect(result.sources).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "instagram", visitors: 1, designs: 1, preview: 1 }),
        expect.objectContaining({ label: "guest", visitors: 1, designs: 1, preview: 0 }),
        expect.objectContaining({ label: "", visitors: 1, paid: 1 }),
      ]),
    );
    expect(result.designs).toEqual([
      { label: "kayal", visitors: 1 },
      { label: "rajwada-bagh", visitors: 1 },
    ]);
  });

  it("take accounts, invites and live payments straight from the tables", async () => {
    await t.as(host, () =>
      q("insert into events (category_id, template_id) values ('wedding', 'marigold')"),
    );
    const [event] = await q<{ id: string }>("select id from events limit 1");
    await q(
      `insert into orders (event_id, user_id, plan_id, amount_paise, status, provider_order_id, mode, paid_at)
       values ($1, $2, 'celebration', 79900, 'paid', 'order_live', 'live', now()),
              ($1, $2, 'celebration', 79900, 'paid', 'order_test', 'test', now())`,
      [event!.id, host],
    );
    expect((await funnel()).outcomes).toMatchObject({
      accounts: 2,
      invites: 1,
      payments: 1,
      revenuePaise: 79900,
    });
  });

  it("can be read only by the server", async () => {
    await expect(t.as(host, () => q("select * from site_steps"))).rejects.toThrow(
      /permission denied/,
    );
    await expect(t.as(owner, () => q("select public.funnel_summary(7)"))).rejects.toThrow(
      /permission denied/,
    );
  });
});
