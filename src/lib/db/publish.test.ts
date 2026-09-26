// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { createTestDb, type TestDb } from "./test-db";

/* Publishing (Step 9): what guests can and can't reach through a published link. */

let t: TestDb;
let priya: string;
let stranger: string;
let event: string;

const q = <T = Record<string, unknown>>(sql: string, params: unknown[] = []) =>
  t.db.query<T>(sql, params).then((result) => result.rows);

type Invite = {
  id: string;
  slug: string;
  content: Record<string, string>;
  functions: { kind: string; venue: string; date: string }[];
  photos: { path: string; width: number }[];
};

const published = (slug: string) =>
  t
    .as(null, () =>
      q<{ invite: Invite | null }>("select public.published_invite($1) as invite", [slug]),
    )
    .then((rows) => rows[0]!.invite);

beforeAll(async () => {
  t = await createTestDb();
  priya = await t.createUser({ name: "Priya" });
  stranger = await t.createUser();
  event = await t.as(priya, async () => {
    const [row] = await q<{ id: string }>(
      `insert into events (category_id, template_id, content)
       values ('wedding', 'marigold', '{"first": "Aarav", "second": "Meera"}') returning id`,
    );
    await q(
      `insert into functions (event_id, kind, position, date, venue)
       values ($1, 'wedding', 5, '2026-12-12', 'The Leela'), ($1, 'haldi', 2, '2026-12-11', 'Home')`,
      [row!.id],
    );
    await q(
      "insert into media (event_id, storage_path, width, height) values ($1, $2, 1600, 1200)",
      [row!.id, `${row!.id}/one.webp`],
    );
    await q("insert into storage.objects (bucket_id, name) values ('event-media', $1)", [
      `${row!.id}/one.webp`,
    ]);
    return row!.id;
  });
}, 30_000);

describe("publishing", () => {
  it("needs a link", async () => {
    await expect(
      t.as(priya, () => q("update events set status = 'published' where id = $1", [event])),
    ).rejects.toThrow(/events_published_slug/);
  });

  it("keeps drafts private, even with a link set", async () => {
    await t.as(priya, () =>
      q("update events set slug = 'aarav-weds-meera' where id = $1", [event]),
    );
    expect(await published("aarav-weds-meera")).toBeNull();
    expect(await t.as(null, () => q("select name from storage.objects"))).toEqual([]);
  });

  it("gives guests the card, functions in order and photos once published", async () => {
    await t.as(priya, () =>
      q("update events set status = 'published', published_at = now() where id = $1", [event]),
    );
    const invite = await published("aarav-weds-meera");
    expect(invite?.content.first).toBe("Aarav");
    expect(invite?.functions.map((fn) => fn.kind)).toEqual(["haldi", "wedding"]);
    expect(invite?.photos).toEqual([
      expect.objectContaining({ path: `${event}/one.webp`, width: 1600 }),
    ]);
    expect(await t.as(null, () => q("select name from storage.objects"))).toHaveLength(1);
  });

  it("still keeps the tables closed to guests and strangers", async () => {
    expect(await t.as(null, () => q("select id from events"))).toEqual([]);
    expect(await t.as(null, () => q("select id from functions"))).toEqual([]);
    expect(await t.as(stranger, () => q("select id from events"))).toEqual([]);
    expect(await t.as(stranger, () => q("select id from media"))).toEqual([]);
  });

  it("answers whether a link is free without revealing whose it is", async () => {
    const free = (slug: string) =>
      t
        .as(stranger, () =>
          q<{ free: boolean }>("select public.slug_available($1) as free", [slug]),
        )
        .then((rows) => rows[0]!.free);
    expect(await free("aarav-weds-meera")).toBe(false);
    expect(await free("aarav-weds-meera-2")).toBe(true);
  });

  it("lets only one invite own a link", async () => {
    const other = await t.as(stranger, async () => {
      const [row] = await q<{ id: string }>(
        "insert into events (category_id, template_id) values ('wedding', 'rose') returning id",
      );
      return row!.id;
    });
    await expect(
      t.as(stranger, () => q("update events set slug = 'aarav-weds-meera' where id = $1", [other])),
    ).rejects.toThrow(/unique|duplicate/);
  });

  it("closes the link again when the invite goes back to a draft", async () => {
    await t.as(priya, () => q("update events set status = 'draft' where id = $1", [event]));
    expect(await published("aarav-weds-meera")).toBeNull();
    expect(await t.as(null, () => q("select name from storage.objects"))).toEqual([]);
  });
});
