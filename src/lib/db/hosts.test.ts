// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { createTestDb, type TestDb } from "./test-db";

/* Co-hosts and the host dashboard (Step 11): who can join an invite, and what they see. */

let t: TestDb;
let priya: string;
let arjun: string;
let stranger: string;
let event: string;

const q = <T = Record<string, unknown>>(sql: string, params: unknown[] = []) =>
  t.db.query<T>(sql, params).then((result) => result.rows);

const invite = (who: string, label = "Arjun's family") =>
  t
    .as(who, () =>
      q<{ token: string }>(
        "insert into event_host_invites (event_id, label) values ($1, $2) returning token",
        [event, label],
      ),
    )
    .then((rows) => rows[0]!.token);

const accept = (who: string | null, token: string) =>
  t
    .as(who, () => q<{ id: string }>("select public.accept_host_invite($1) as id", [token]))
    .then((rows) => rows[0]!.id);

beforeAll(async () => {
  t = await createTestDb();
  priya = await t.createUser({ name: "Priya" });
  arjun = await t.createUser({ name: "Arjun" });
  stranger = await t.createUser({ name: "Stranger" });
  event = await t.as(priya, async () => {
    const [row] = await q<{ id: string }>(
      `insert into events (category_id, template_id, content)
       values ('wedding', 'marigold', '{"first": "Priya", "second": "Arjun"}') returning id`,
    );
    await q("insert into guests (event_id, name, phone) values ($1, 'Nani', '+919812345678')", [
      row!.id,
    ]);
    return row!.id;
  });
}, 30_000);

describe("co-host links", () => {
  let token: string;

  it("need no phone or email, only a label, and only the owner makes them", async () => {
    token = await invite(priya);
    expect(token).toMatch(/^[0-9a-f]{36}$/);
    await expect(invite(arjun)).rejects.toThrow(/row-level security/);
  });

  it("show who is asking before anyone accepts, to anyone holding the link", async () => {
    const [row] = await t.as(null, () =>
      q<{ preview: { event_id: string; label: string; invited_by: string } }>(
        "select public.host_invite_preview($1) as preview",
        [token],
      ),
    );
    expect(row!.preview).toMatchObject({
      event_id: event,
      label: "Arjun's family",
      invited_by: "Priya",
    });
    const [none] = await t.as(null, () =>
      q<{ preview: unknown }>("select public.host_invite_preview('nope') as preview"),
    );
    expect(none!.preview).toBeNull();
  });

  it("need a sign-in to accept", async () => {
    await expect(accept(null, token)).rejects.toThrow();
  });

  it("make the person who accepts a co-host, with the guest list", async () => {
    expect(await t.as(arjun, () => q("select id from guests"))).toEqual([]);
    expect(await accept(arjun, token)).toBe(event);
    const hosts = await t.as(arjun, () =>
      q<{ name: string; role: string; side: string }>(
        "select name, role, side from public.event_host_list($1)",
        [event],
      ),
    );
    expect(hosts).toEqual([
      { name: "Priya", role: "owner", side: "" },
      { name: "Arjun", role: "cohost", side: "Arjun's family" },
    ]);
    expect(await t.as(arjun, () => q("select name from guests"))).toEqual([{ name: "Nani" }]);
    // Co-hosts add guests and record reminders too
    await t.as(arjun, () =>
      q("insert into guests (event_id, name) values ($1, 'Mama ji')", [event]),
    );
    await t.as(arjun, () =>
      q("update guests set reminded_at = now() where event_id = $1", [event]),
    );
    expect(
      await t.as(priya, () => q("select id from guests where reminded_at is not null")),
    ).toHaveLength(2);
  });

  it("work once", async () => {
    await expect(accept(stranger, token)).rejects.toThrow(/used or withdrawn/);
    const [row] = await t.as(null, () =>
      q<{ preview: unknown }>("select public.host_invite_preview($1) as preview", [token]),
    );
    expect(row!.preview).toBeNull();
  });

  it("stop working when the owner withdraws them", async () => {
    const spare = await invite(priya, "Cousins");
    await t.as(priya, () => q("delete from event_host_invites where token = $1", [spare]));
    await expect(accept(stranger, spare)).rejects.toThrow(/used or withdrawn/);
  });

  it("leave the owner as owner when they open their own link", async () => {
    const own = await invite(priya, "Test");
    expect(await accept(priya, own)).toBe(event);
    const [row] = await t.as(priya, () =>
      q<{ role: string }>("select role from event_hosts where user_id = $1", [priya]),
    );
    expect(row!.role).toBe("owner");
  });

  it("never show the host list to anyone else", async () => {
    expect(
      await t.as(stranger, () => q("select * from public.event_host_list($1)", [event])),
    ).toEqual([]);
  });

  it("let a co-host leave, and the owner remove one", async () => {
    await t.as(arjun, () =>
      q("delete from event_hosts where event_id = $1 and user_id = $2", [event, arjun]),
    );
    expect(await t.as(arjun, () => q("select id from guests"))).toEqual([]);
    await accept(arjun, await invite(priya));
    await t.as(priya, () =>
      q("delete from event_hosts where event_id = $1 and user_id = $2", [event, arjun]),
    );
    expect(await t.as(arjun, () => q("select id from events"))).toEqual([]);
  });
});

/* Co-hosts, part 2: what each co-host may do, and how many each edition includes. */
describe("co-host access", () => {
  let helper: string;
  let cousin: string;

  const inviteWith = (access: "edit" | "guests", phone: string | null = null) =>
    t
      .as(priya, () =>
        q<{ token: string }>(
          "insert into event_host_invites (event_id, label, access, phone) values ($1, 'Mama ji', $2, $3) returning token",
          [event, access, phone],
        ),
      )
      .then((rows) => rows[0]!.token);

  beforeAll(async () => {
    helper = await t.createUser({ name: "Mama ji" });
    cousin = await t.createUser({ name: "Cousin" });
  });

  it("carry the access the owner chose, and the number the link went to", async () => {
    const token = await inviteWith("guests", "+919812345670");
    const [row] = await t.as(null, () =>
      q<{ preview: { access: string } }>("select public.host_invite_preview($1) as preview", [
        token,
      ]),
    );
    expect(row!.preview.access).toBe("guests");
    expect(await accept(helper, token)).toBe(event);
    const hosts = await t.as(helper, () =>
      q<{ name: string; access: string }>(
        "select name, access from public.event_host_list($1) where role = 'cohost'",
        [event],
      ),
    );
    expect(hosts).toEqual([{ name: "Mama ji", access: "guests" }]);
  });

  it("let a guests-only co-host run the guest list but not change the card", async () => {
    await t.as(helper, () =>
      q("insert into guests (event_id, name) values ($1, 'Bua ji')", [event]),
    );
    expect(await t.as(priya, () => q("select id from guests where name = 'Bua ji'"))).toHaveLength(
      1,
    );
    await t.as(helper, () =>
      q(`update events set content = '{"first": "Changed"}' where id = $1`, [event]),
    );
    const [card] = await t.as(priya, () =>
      q<{ content: { first: string } }>("select content from events where id = $1", [event]),
    );
    expect(card!.content.first).toBe("Priya");
    await expect(
      t.as(helper, () =>
        q("insert into functions (event_id, kind, position) values ($1, 'haldi', 0)", [event]),
      ),
    ).rejects.toThrow(/row-level security/);
    // Still reads the card and its functions, to show them on the dashboard
    expect(await t.as(helper, () => q("select id from events"))).toHaveLength(1);
  });

  it("let the owner change what a co-host can do, and nobody else", async () => {
    await t.as(helper, () =>
      q("update event_hosts set access = 'edit' where event_id = $1 and user_id = $2", [
        event,
        helper,
      ]),
    );
    const before = await t.as(priya, () =>
      q<{ access: string }>("select access from event_hosts where user_id = $1", [helper]),
    );
    expect(before).toEqual([{ access: "guests" }]);
    await t.as(priya, () =>
      q("update event_hosts set access = 'edit' where event_id = $1 and user_id = $2", [
        event,
        helper,
      ]),
    );
    await t.as(helper, () =>
      q(`update events set content = content || '{"line": "With love"}' where id = $1`, [event]),
    );
    const [card] = await t.as(priya, () =>
      q<{ content: { line: string } }>("select content from events where id = $1", [event]),
    );
    expect(card!.content.line).toBe("With love");
    await expect(
      t.as(priya, () =>
        q("update event_hosts set role = 'owner' where event_id = $1 and user_id = $2", [
          event,
          helper,
        ]),
      ),
    ).rejects.toThrow();
  });

  it("never let a co-host delete the invite or remove the owner", async () => {
    await t.as(helper, () => q("delete from events where id = $1", [event]));
    await t.as(helper, () =>
      q("delete from event_hosts where event_id = $1 and user_id = $2", [event, priya]),
    );
    expect(await t.as(priya, () => q("select id from events"))).toHaveLength(1);
    expect(
      await t.as(priya, () => q("select user_id from event_hosts where role = 'owner'")),
    ).toHaveLength(1);
  });

  it("stop at the edition's co-hosts once payments are on, and keep the link", async () => {
    await q(
      `insert into app_settings (key, value) values ('payments', '{"checkoutEnabled": true}')
       on conflict (key) do update set value = excluded.value`,
    );
    // Free includes one co-host, and Mama ji is already one
    const token = await inviteWith("edit");
    await expect(accept(cousin, token)).rejects.toThrow(/all the co-hosts/);
    await q("insert into event_plans (event_id, plan_id, source) values ($1, 'premium', 'admin')", [
      event,
    ]);
    expect(await accept(cousin, token)).toBe(event);
    await q("delete from app_settings where key = 'payments'");
  });
});
