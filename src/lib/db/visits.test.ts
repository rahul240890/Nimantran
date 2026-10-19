// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { createTestDb, type TestDb } from "./test-db";

/* Visitor counts (/admin/visitors): who can count a view and who can read the counts. */

let t: TestDb;
let owner: string;
let host: string;

const q = <T = Record<string, unknown>>(sql: string, params: unknown[] = []) =>
  t.db.query<T>(sql, params).then((result) => result.rows);

const record = (who: string | null, key: string, path: string, extra: unknown[] = []) =>
  t.as(who, () =>
    q("select public.record_visit($1, $2, $3, $4, $5, $6, $7, $8)", [
      key,
      path,
      ...extra,
      ...Array(6 - extra.length).fill(null),
    ]),
  );

type Summary = {
  days: number;
  now: number;
  totals: { views: number; visitors: number; signedIn: number; accounts: number; onePage: number };
  daily: { day: string; views: number; visitors: number; signedIn: number }[];
  pages: { label: string; views: number; visitors: number }[];
  lists: Record<string, { label: string; visitors: number }[]>;
};

const summary = (days: number) =>
  t
    .as("service", () => q<{ s: Summary }>("select public.visit_summary($1) as s", [days]))
    .then((rows) => rows[0]!.s);

beforeAll(async () => {
  t = await createTestDb({ seed: false });
  owner = await t.createUser({ name: "Rahul" });
  host = await t.createUser({ name: "Priya" });
  await q("insert into admins (user_id, role) values ($1, 'owner')", [owner]);
}, 30_000);

describe("visits", () => {
  it("are counted for visitors and signed-in hosts, but not admins", async () => {
    await record(null, "1.2.3.4|Chrome", "/", ["google.com", "whatsapp", "in", "mobile"]);
    await record(null, "1.2.3.4|Chrome", "/designs");
    await record(null, "5.6.7.8|Safari", "/i/[invite]", [null, null, "AE", "desktop"]);
    await record(host, "9.9.9.9|Firefox", "/dashboard", [null, null, "IN", "tablet"]);
    await record(owner, "8.8.8.8|Edge", "/admin");
    expect(await q("select count(*)::int as n from site_visits")).toEqual([{ n: 4 }]);
  });

  it("never store the address or browser they were counted from", async () => {
    const rows = await q<{ visitor: string; user_id: string | null }>(
      "select visitor, user_id from site_visits order by id",
    );
    expect(rows[0]!.visitor).toBe(rows[1]!.visitor);
    expect(rows[0]!.visitor).not.toContain("1.2.3.4");
    expect(rows.map((row) => row.user_id)).toEqual([null, null, null, host]);
  });

  it("ignore views that aren't a page of the site", async () => {
    await record(null, "", "/");
    await record(null, "1.2.3.4|Chrome", "https://elsewhere.example/");
    expect(await q("select count(*)::int as n from site_visits")).toEqual([{ n: 4 }]);
  });

  it("can be read only by the server", async () => {
    await expect(t.as(host, () => q("select * from site_visits"))).rejects.toThrow(
      /permission denied/,
    );
    await expect(t.as(null, () => q("select * from visit_salts"))).rejects.toThrow(
      /permission denied/,
    );
    await expect(t.as(owner, () => q("select public.visit_summary(7)"))).rejects.toThrow(
      /permission denied/,
    );
    await expect(
      t.as(null, () =>
        q("insert into site_visits (visitor, path, device) values ('x', '/', 'mobile')"),
      ),
    ).rejects.toThrow(/permission denied/);
  });

  it("add up per day for the admin", async () => {
    const s = await summary(7);
    expect(s.days).toBe(7);
    expect(s.now).toBe(3);
    expect(s.totals).toEqual({ views: 4, visitors: 3, signedIn: 1, accounts: 1, onePage: 2 });
    expect(s.daily).toHaveLength(7);
    expect(s.daily.at(-1)).toMatchObject({ views: 4, visitors: 3, signedIn: 1 });
    expect(s.pages[0]).toEqual({ label: "/", views: 1, visitors: 1 });
    expect(s.lists.referrers).toEqual([
      { label: "", visitors: 2 },
      { label: "google.com", visitors: 1 },
    ]);
    expect(s.lists.sources).toEqual([{ label: "whatsapp", visitors: 1 }]);
    expect(s.lists.countries).toEqual([
      { label: "IN", visitors: 2 },
      { label: "AE", visitors: 1 },
    ]);
    expect(s.lists.devices).toEqual([
      { label: "desktop", visitors: 1 },
      { label: "mobile", visitors: 1 },
      { label: "tablet", visitors: 1 },
    ]);
  });
});
