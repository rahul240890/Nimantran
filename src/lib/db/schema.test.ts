// @vitest-environment node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { CATEGORIES, CATEGORY_IDS } from "@/lib/categories/catalog";
import { TEMPLATE_IDS, templateSchema } from "@/lib/templates/schema";
import { seedSql } from "./seed";
import { createTestDb, type TestDb } from "./test-db";

let t: TestDb;
let priya: string;
let rahul: string;
let stranger: string;
let wedding: string;

const q = <T = Record<string, unknown>>(sql: string, params: unknown[] = []) =>
  t.db.query<T>(sql, params).then((result) => result.rows);

async function newEvent(owner: string, category = "wedding") {
  return t.as(owner, async () => {
    const [row] = await q<{ id: string }>(
      "insert into events (category_id, template_id) values ($1, 'marigold') returning id",
      [category],
    );
    return row!.id;
  });
}

beforeAll(async () => {
  t = await createTestDb();
  priya = await t.createUser({ full_name: "Priya Sharma" }, "919876543210");
  rahul = await t.createUser({ name: "Rahul Verma", language: "hi" });
  stranger = await t.createUser();
  wedding = await newEvent(priya);
}, 30_000);

describe("seed", () => {
  it("is up to date with the catalogues (run npm run db:seed)", () => {
    expect(readFileSync(join(process.cwd(), "supabase/seed.sql"), "utf8")).toBe(seedSql());
  });

  it("loads every category and design, and designs still match their schema", async () => {
    const categories = await t.as(null, () =>
      q<{ id: string }>("select id from categories order by position"),
    );
    expect(categories.map((row) => row.id)).toEqual(CATEGORY_IDS);
    const templates = await t.as(null, () =>
      q<{ id: string; data: unknown }>("select id, data from templates order by position"),
    );
    expect(templates.map((row) => row.id)).toEqual([...TEMPLATE_IDS]);
    for (const row of templates) expect(templateSchema.safeParse(row.data).success).toBe(true);
    const links = await t.as(null, () =>
      q<{ template_id: string }>(
        "select template_id from category_templates where category_id = 'roka' order by position",
      ),
    );
    expect(links.map((row) => row.template_id)).toEqual([...CATEGORIES.roka.templates]);
  });

  it("can run again on a live database", async () => {
    await t.db.exec(readFileSync(join(process.cwd(), "supabase/seed.sql"), "utf8"));
    expect(await q("select id from categories")).toHaveLength(CATEGORY_IDS.length);
  });

  it("lets nobody but the server change the catalogues", async () => {
    await expect(
      t.as(priya, () => q("update categories set priority = 100 where id = 'roka'")),
    ).resolves.toEqual([]);
    const [roka] = await q<{ priority: number }>(
      "select priority from categories where id = 'roka'",
    );
    expect(roka!.priority).toBe(55);
    await expect(t.as(null, () => q("delete from templates"))).resolves.toEqual([]);
    expect(await q("select id from templates")).toHaveLength(TEMPLATE_IDS.length);
  });
});

describe("profiles", () => {
  it("are created on sign-in, named from Google or the profile", async () => {
    const rows = await q<{ id: string; name: string; language: string }>(
      "select id, name, language from profiles",
    );
    expect(rows.find((row) => row.id === priya)).toMatchObject({
      name: "Priya Sharma",
      language: "en",
    });
    expect(rows.find((row) => row.id === rahul)).toMatchObject({
      name: "Rahul Verma",
      language: "hi",
    });
    expect(rows.find((row) => row.id === stranger)).toMatchObject({ name: "" });
  });

  it("are private, and editable only by their owner", async () => {
    const seen = await t.as(stranger, () => q<{ id: string }>("select id from profiles"));
    expect(seen.map((row) => row.id)).toEqual([stranger]);
    await t.as(stranger, () => q("update profiles set name = 'Hacker' where id = $1", [priya]));
    const [row] = await q<{ name: string }>("select name from profiles where id = $1", [priya]);
    expect(row!.name).toBe("Priya Sharma");
    expect(await t.as(null, () => q("select id from profiles"))).toEqual([]);
  });
});

describe("events and hosts", () => {
  it("makes the creator the owner", async () => {
    const hosts = await t.as(priya, () =>
      q<{ user_id: string; role: string }>(
        "select user_id, role from event_hosts where event_id = $1",
        [wedding],
      ),
    );
    expect(hosts).toEqual([{ user_id: priya, role: "owner" }]);
  });

  it("keeps events private to their hosts", async () => {
    expect(await t.as(priya, () => q("select id from events"))).toHaveLength(1);
    expect(await t.as(stranger, () => q("select id from events"))).toEqual([]);
    expect(await t.as(null, () => q("select id from events"))).toEqual([]);
    await t.as(stranger, () =>
      q('update events set content = \'{"first":"X"}\' where id = $1', [wedding]),
    );
    await t.as(stranger, () => q("delete from events where id = $1", [wedding]));
    const [row] = await q<{ content: object }>("select content from events where id = $1", [
      wedding,
    ]);
    expect(row!.content).toEqual({});
  });

  it("refuses an event created in someone else's name", async () => {
    await expect(
      t.as(stranger, () =>
        q(
          "insert into events (owner_id, category_id, template_id) values ($1, 'wedding', 'rose')",
          [priya],
        ),
      ),
    ).rejects.toThrow(/row-level security/);
  });

  it("lets the owner add a co-host, who then sees and edits the event", async () => {
    await t.as(priya, () =>
      q("insert into event_hosts (event_id, user_id, side) values ($1, $2, 'Groom''s family')", [
        wedding,
        rahul,
      ]),
    );
    const events = await t.as(rahul, () => q<{ id: string }>("select id from events"));
    expect(events.map((row) => row.id)).toEqual([wedding]);
    await t.as(rahul, () =>
      q('update events set content = \'{"first":"Aarav"}\' where id = $1', [wedding]),
    );
    const [row] = await q<{ content: object }>("select content from events where id = $1", [
      wedding,
    ]);
    expect(row!.content).toEqual({ first: "Aarav" });
    // Co-hosts see each other's names, strangers still see nobody
    const names = await t.as(rahul, () =>
      q<{ name: string }>("select name from profiles order by name"),
    );
    expect(names.map((row) => row.name)).toEqual(["Priya Sharma", "Rahul Verma"]);
  });

  it("stops co-hosts adding hosts, taking ownership or deleting the event", async () => {
    await expect(
      t.as(rahul, () =>
        q("insert into event_hosts (event_id, user_id) values ($1, $2)", [wedding, stranger]),
      ),
    ).rejects.toThrow(/row-level security/);
    await expect(
      t.as(rahul, () => q("update events set owner_id = $2 where id = $1", [wedding, rahul])),
    ).rejects.toThrow(/keeps its owner/);
    await expect(
      t.as(priya, () =>
        q("insert into event_hosts (event_id, user_id, role) values ($1, $2, 'owner')", [
          wedding,
          stranger,
        ]),
      ),
    ).rejects.toThrow();
    await t.as(rahul, () => q("delete from events where id = $1", [wedding]));
    expect(await q("select id from events where id = $1", [wedding])).toHaveLength(1);
    // Nobody removes the owner
    await t.as(priya, () =>
      q("delete from event_hosts where event_id = $1 and role = 'owner'", [wedding]),
    );
    expect(
      await q("select 1 from event_hosts where event_id = $1 and role = 'owner'", [wedding]),
    ).toHaveLength(1);
  });

  it("lets the owner invite a co-host by phone, visible to hosts only", async () => {
    await t.as(priya, () =>
      q("insert into event_host_invites (event_id, phone) values ($1, '+919812345678')", [wedding]),
    );
    expect(await t.as(rahul, () => q("select phone from event_host_invites"))).toHaveLength(1);
    expect(await t.as(stranger, () => q("select phone from event_host_invites"))).toEqual([]);
    await expect(
      t.as(rahul, () =>
        q("insert into event_host_invites (event_id, email) values ($1, 'a@b.in')", [wedding]),
      ),
    ).rejects.toThrow(/row-level security/);
  });
});

describe("what an event contains", () => {
  let haldi: string;
  let guest: string;

  beforeAll(async () => {
    [haldi, guest] = await t.as(priya, async () => {
      const [fn] = await q<{ id: string }>(
        "insert into functions (event_id, kind, date, start_time, venue) values ($1, 'haldi', '2026-12-11', '10:00', 'Home') returning id",
        [wedding],
      );
      const [g] = await q<{ id: string }>(
        "insert into guests (event_id, name, phone, party_size) values ($1, 'Meera Iyer', '+919876500000', 2) returning id",
        [wedding],
      );
      return [fn!.id, g!.id];
    });
  });

  it("is shared with co-hosts and hidden from everyone else", async () => {
    for (const table of ["functions", "guests"]) {
      expect(await t.as(rahul, () => q(`select id from ${table}`))).toHaveLength(1);
      expect(await t.as(stranger, () => q(`select id from ${table}`))).toEqual([]);
      expect(await t.as(null, () => q(`select id from ${table}`))).toEqual([]);
    }
  });

  it("keeps custom RSVP questions and replies inside their event", async () => {
    await t.as(priya, () =>
      q(
        `insert into rsvp_questions (event_id, preset, kind, label, options, function_id)
         values ($1, 'meal', 'choice', 'Meal preference', '["veg","jain"]', $2)`,
        [wedding, haldi],
      ),
    );
    await t.as(rahul, () =>
      q(
        `insert into rsvps (event_id, function_id, guest_id, name, status, adults, answers)
         values ($1, $2, $3, 'Meera Iyer', 'attending', 2, '{"meal":"jain"}')`,
        [wedding, haldi, guest],
      ),
    );
    expect(await t.as(priya, () => q("select id from rsvps"))).toHaveLength(1);
    expect(await t.as(stranger, () => q("select id from rsvps"))).toEqual([]);

    // A stranger's own event can't borrow Priya's function or guest
    const theirs = await newEvent(stranger, "roka");
    await expect(
      t.as(stranger, () =>
        q(
          "insert into rsvps (event_id, function_id, name, status) values ($1, $2, 'X', 'attending')",
          [theirs, haldi],
        ),
      ),
    ).rejects.toThrow(/is not part of event/);
    await expect(
      t.as(stranger, () =>
        q("insert into guests (event_id, name) values ($1, 'Sneaky')", [wedding]),
      ),
    ).rejects.toThrow(/row-level security/);
  });

  it("checks what goes in", async () => {
    await expect(
      t.as(priya, () =>
        q("insert into functions (event_id, kind) values ($1, 'Big Party!')", [wedding]),
      ),
    ).rejects.toThrow(/check constraint/);
    await expect(
      t.as(priya, () =>
        q("insert into guests (event_id, name, phone) values ($1, 'A', '98765')", [wedding]),
      ),
    ).rejects.toThrow(/check constraint/);
    await expect(
      t.as(priya, () =>
        q(
          "insert into rsvp_questions (event_id, kind, label, options) values ($1, 'choice', 'Pick', '[\"one\"]')",
          [wedding],
        ),
      ),
    ).rejects.toThrow(/check constraint/);
  });

  it("is ready for tradition packs: any ceremony id, local names and card languages", async () => {
    const [fn] = await t.as(priya, () =>
      q<{ name: string; end_time: string }>(
        "insert into functions (event_id, kind, name, start_time, end_time) values ($1, 'nalangu', 'Nalangu', '09:00', '10:30') returning name, end_time",
        [wedding],
      ),
    );
    expect(fn).toEqual({ name: "Nalangu", end_time: "10:30:00" });
    const [event] = await t.as(priya, () =>
      q<{ languages: string[]; religious: object }>(
        "update events set tradition_id = 'tamil-hindu', languages = '{ta,en}', religious = '{\"art\":\"ganesha\"}' where id = $1 returning languages, religious",
        [wedding],
      ),
    );
    expect(event).toEqual({ languages: ["ta", "en"], religious: { art: "ganesha" } });
    await expect(
      t.as(priya, () => q("update events set languages = '{ta,en,hi}' where id = $1", [wedding])),
    ).rejects.toThrow(/check constraint/);
    await expect(
      t.as(priya, () => q("update events set languages = '{xx}' where id = $1", [wedding])),
    ).rejects.toThrow(/check constraint/);
  });

  it("schedules sends and stores media for hosts only", async () => {
    await t.as(priya, () =>
      q(
        "insert into scheduled_sends (event_id, function_id, channel, send_at) values ($1, $2, 'sms', now() + interval '1 day')",
        [wedding, haldi],
      ),
    );
    await t.as(rahul, () =>
      q("insert into media (event_id, storage_path, width, height) values ($1, $2, 1600, 1200)", [
        wedding,
        `${wedding}/a.webp`,
      ]),
    );
    expect(await t.as(stranger, () => q("select id from scheduled_sends"))).toEqual([]);
    expect(await t.as(stranger, () => q("select id from media"))).toEqual([]);
    expect(await t.as(priya, () => q("select id from media"))).toHaveLength(1);
  });

  it("guards the photo bucket by event", async () => {
    await t.as(priya, () =>
      q("insert into storage.objects (bucket_id, name) values ('event-media', $1)", [
        `${wedding}/photo.webp`,
      ]),
    );
    await expect(
      t.as(stranger, () =>
        q("insert into storage.objects (bucket_id, name) values ('event-media', $1)", [
          `${wedding}/x.webp`,
        ]),
      ),
    ).rejects.toThrow(/row-level security/);
    expect(await t.as(rahul, () => q("select name from storage.objects"))).toHaveLength(1);
    expect(await t.as(stranger, () => q("select name from storage.objects"))).toEqual([]);
    expect(await t.as(null, () => q("select name from storage.objects"))).toEqual([]);
  });

  it("goes when the owner deletes the event", async () => {
    const extra = await newEvent(priya, "haldi");
    await t.as(priya, () =>
      q("insert into functions (event_id, kind) values ($1, 'haldi')", [extra]),
    );
    await t.as(priya, () => q("delete from events where id = $1", [extra]));
    expect(await q("select id from functions where event_id = $1", [extra])).toEqual([]);
    expect(await q("select 1 from event_hosts where event_id = $1", [extra])).toEqual([]);
  });
});
