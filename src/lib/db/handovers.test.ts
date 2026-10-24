// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { createTestDb, type TestDb } from "./test-db";

/* Hand-over links (update 5): Shubh makes an invite, the family who opens its link takes it. */

let t: TestDb;
let shubh: string;
let cousin: string;
let family: string;
let stranger: string;
let event: string;

const q = <T = Record<string, unknown>>(sql: string, params: unknown[] = []) =>
  t.db.query<T>(sql, params).then((result) => result.rows);

/** A link, made as the admin pages make them: by the server, for the invite's maker. */
const link = (expires = "now() + interval '30 days'") =>
  t
    .as("service", () =>
      q<{ token: string }>(
        `insert into event_handovers (event_id, created_by, expires_at)
         values ($1, $2, ${expires}) returning token`,
        [event, shubh],
      ),
    )
    .then((rows) => rows[0]!.token);

const claim = (who: string | null, token: string) =>
  t
    .as(who, () => q<{ id: string }>("select public.claim_handover($1) as id", [token]))
    .then((rows) => rows[0]!.id);

const preview = (token: string) =>
  t.as(null, () =>
    q<{ event_id: string; content: Record<string, string> }>(
      "select * from public.handover_preview($1)",
      [token],
    ),
  );

const hosts = () =>
  q<{ user_id: string; role: string }>(
    "select user_id, role from event_hosts where event_id = $1 order by role desc, user_id",
    [event],
  );

beforeAll(async () => {
  t = await createTestDb();
  shubh = await t.createUser({ name: "Shubh" });
  cousin = await t.createUser({ name: "Cousin" });
  family = await t.createUser({ name: "Meera" });
  stranger = await t.createUser({ name: "Stranger" });
  event = await t.as(shubh, async () => {
    const [row] = await q<{ id: string }>(
      `insert into events (category_id, template_id, content)
       values ('wedding', 'marigold', '{"first": "Meera", "second": "Kabir"}') returning id`,
    );
    await q("insert into guests (event_id, name, phone) values ($1, 'Nani', '+919812345678')", [
      row!.id,
    ]);
    await q("insert into event_hosts (event_id, user_id) values ($1, $2)", [row!.id, cousin]);
    return row!.id;
  });
}, 30_000);

describe("hand-over links", () => {
  let token: string;

  it("are made by the server only, and nobody reads them from the browser", async () => {
    token = await link();
    expect(token).toMatch(/^[0-9a-f]{48}$/);
    await expect(
      t.as(shubh, () =>
        q("insert into event_handovers (event_id, created_by) values ($1, $2)", [event, shubh]),
      ),
    ).rejects.toThrow(/row-level security/);
    expect(await t.as(shubh, () => q("select token from event_handovers"))).toEqual([]);
    expect(await t.as(null, () => q("select token from event_handovers"))).toEqual([]);
  });

  it("show the invite to anyone holding the link, and nothing for any other token", async () => {
    const [row] = await preview(token);
    expect(row).toMatchObject({ event_id: event, content: { first: "Meera", second: "Kabir" } });
    expect(await preview("0".repeat(48))).toEqual([]);
  });

  it("need a sign-in to take, and say so to whoever made the invite", async () => {
    await expect(claim(null, token)).rejects.toThrow();
    await expect(claim(shubh, token)).rejects.toThrow(/already yours/);
  });

  it("make whoever takes one the owner, with the guest list, and the maker leaves", async () => {
    expect(await t.as(family, () => q("select id from guests"))).toEqual([]);
    expect(await claim(family, token)).toBe(event);
    const [row] = await q<{ owner_id: string }>("select owner_id from events where id = $1", [
      event,
    ]);
    expect(row!.owner_id).toBe(family);
    // The co-host stays; the one owner is now the family
    expect(await hosts()).toEqual([
      { user_id: family, role: "owner" },
      { user_id: cousin, role: "cohost" },
    ]);
    expect(await t.as(family, () => q("select name from guests"))).toEqual([{ name: "Nani" }]);
    expect(await t.as(shubh, () => q("select id from events"))).toEqual([]);
  });

  it("work once", async () => {
    expect(await preview(token)).toEqual([]);
    await expect(claim(stranger, token)).rejects.toThrow(/used or has expired/);
    const [row] = await q<{ claimed_by: string }>(
      "select claimed_by from event_handovers where token = $1",
      [token],
    );
    expect(row!.claimed_by).toBe(family);
  });

  it("stop working when they expire", async () => {
    const old = await link("now() - interval '1 day'");
    expect(await preview(old)).toEqual([]);
    await expect(claim(stranger, old)).rejects.toThrow(/used or has expired/);
  });

  it("still never let a host move an invite's owner by editing it", async () => {
    await expect(
      t.as(cousin, () => q("update events set owner_id = $2 where id = $1", [event, cousin])),
    ).rejects.toThrow(/keeps its owner/);
    await expect(
      t.as(family, () => q("update events set owner_id = $2 where id = $1", [event, stranger])),
    ).rejects.toThrow(/keeps its owner/);
  });
});
