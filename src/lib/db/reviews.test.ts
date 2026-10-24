// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { createTestDb, type TestDb } from "./test-db";

/* Reviews: only the server reads or writes them, one per account, and they're checked. */

let t: TestDb;
let host: string;

const q = <T = Record<string, unknown>>(sql: string, params: unknown[] = []) =>
  t.db.query<T>(sql, params).then((result) => result.rows);

const write = (who: string | null | "service", rating = 5, body = "Our guests loved it.") =>
  t.as(who, () =>
    q(
      `insert into reviews (user_id, rating, body, name) values ($1, $2, $3, 'Priya S.')
       on conflict (user_id) do update set rating = excluded.rating, body = excluded.body`,
      [host, rating, body],
    ),
  );

beforeAll(async () => {
  t = await createTestDb({ seed: false });
  host = await t.createUser({ name: "Priya" });
}, 30_000);

describe("reviews", () => {
  it("are written by the server only, never from a browser", async () => {
    await expect(write(host)).rejects.toThrow(/permission denied/);
    await expect(write(null)).rejects.toThrow(/permission denied/);
    await write("service");
    await expect(t.as(host, () => q("select * from reviews"))).rejects.toThrow(
      /permission denied/,
    );
  });

  it("are one per account, and wait for an admin before they show", async () => {
    await write("service", 4, "Easy to make, and the opening was lovely.");
    const rows = await q<{ rating: number; status: string }>("select rating, status from reviews");
    expect(rows).toEqual([{ rating: 4, status: "pending" }]);
  });

  it("check what goes in", async () => {
    await expect(write("service", 6)).rejects.toThrow(/check constraint/);
    await expect(write("service", 5, "Too short")).rejects.toThrow(/check constraint/);
  });
});
