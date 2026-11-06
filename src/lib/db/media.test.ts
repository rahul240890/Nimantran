// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { createTestDb, type TestDb } from "./test-db";

/*
 * A photo carried into a new invite keeps its id, so each invite needs its own row for it:
 * keyed by the id alone, saving the copy took the photo off the live invitation (2026-11-06).
 */

let t: TestDb;
let priya: string;

const q = <T = Record<string, unknown>>(sql: string, params: unknown[] = []) =>
  t.db.query<T>(sql, params).then((result) => result.rows);

const PHOTO = "00000000-0000-4000-8000-000000000001";

const newEvent = (slug: string | null) =>
  t.as(priya, async () => {
    const [row] = await q<{ id: string }>(
      "insert into events (category_id, template_id, slug) values ('wedding', 'marigold', $1) returning id",
      [slug],
    );
    return row!.id;
  });

const savePhoto = (event: string) =>
  t.as(priya, () =>
    q(
      `insert into media (id, event_id, kind, storage_path, width, height, position)
       values ($1, $2, 'photo', $3, 1200, 900, 0)
       on conflict (event_id, id) do update set position = excluded.position`,
      [PHOTO, event, `${event}/${PHOTO}.webp`],
    ),
  );

beforeAll(async () => {
  t = await createTestDb();
  priya = await t.createUser({ name: "Priya" });
}, 30_000);

describe("an invite's photos", () => {
  it("stay on the invite they came from when a copy saves the same photo", async () => {
    const live = await newEvent("priya-weds-arjun");
    const copy = await newEvent(null);
    await savePhoto(live);
    await savePhoto(copy);
    await savePhoto(copy);
    const rows = await t.as("service", () =>
      q<{ event_id: string }>("select event_id from media where id = $1 order by created_at", [
        PHOTO,
      ]),
    );
    expect(rows.map((row) => row.event_id).sort()).toEqual([live, copy].sort());
  });
});
