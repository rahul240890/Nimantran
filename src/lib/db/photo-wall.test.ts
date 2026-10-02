// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { createTestDb, type TestDb } from "./test-db";

/* The shared photo wall (Step 24): the server records guests' photos, hosts moderate them. */

let t: TestDb;
let priya: string;
let stranger: string;
let event: string;
let guestToken: string;

const q = <T = Record<string, unknown>>(sql: string, params: unknown[] = []) =>
  t.db.query<T>(sql, params).then((result) => result.rows);

const PHONE = "a".repeat(32);
const OTHER_PHONE = "b".repeat(32);
let photoCount = 0;

const add = (
  who: string | null | "service",
  {
    device = PHONE,
    token = null as string | null,
    slug = "priya-weds-arjun",
    folder = () => event,
    perDevice = 40,
  } = {},
) => {
  photoCount += 1;
  const id = `00000000-0000-4000-8000-${String(photoCount).padStart(12, "0")}`;
  return t.as(who, () =>
    q<{ event: string }>(
      "select public.add_wall_photo($1, $2, $3, $4, $5, $6, 1200, 900, $7) as event",
      [slug, token, device, "Rohan", id, `${folder()}/wall-${id}.webp`, perDevice],
    ),
  );
};

const wall = (who: string | null, device = PHONE) =>
  t.as(who, () =>
    q<{ wall: { id: string; name: string; mine: boolean }[] }>(
      "select public.wall_photos_for('priya-weds-arjun', $1) as wall",
      [device],
    ),
  );

beforeAll(async () => {
  t = await createTestDb();
  priya = await t.createUser({ name: "Priya" });
  stranger = await t.createUser();
  event = await t.as(priya, async () => {
    const [row] = await q<{ id: string }>(
      "insert into events (category_id, template_id, slug) values ('wedding', 'marigold', 'priya-weds-arjun') returning id",
    );
    const [guest] = await q<{ token: string }>(
      "insert into guests (event_id, name) values ($1, 'Rohan Mehta') returning token",
      [row!.id],
    );
    guestToken = guest!.token;
    return row!.id;
  });
}, 30_000);

describe("the photo wall", () => {
  it("only takes photos for a published invitation", async () => {
    await expect(add("service")).rejects.toThrow(/invitation not found/);
    await t.as(priya, () =>
      q("update events set status = 'published', published_at = now() where id = $1", [event]),
    );
    const [row] = await add("service", { token: guestToken });
    expect(row!.event).toBe(event);
  });

  it("is written only by the server, never by guests or hosts directly", async () => {
    await expect(add(null)).rejects.toThrow(/permission denied/);
    await expect(add(priya)).rejects.toThrow(/permission denied/);
    await expect(
      t.as(null, () =>
        q(
          "insert into wall_photos (event_id, device_key, storage_path, width, height) values ($1, $2, 'x', 1, 1)",
          [event, PHONE],
        ),
      ),
    ).rejects.toThrow(/permission denied/);
  });

  it("keeps each photo in its own invitation's folder", async () => {
    const other = await t.as(stranger, async () => {
      const [row] = await q<{ id: string }>(
        "insert into events (category_id, template_id) values ('wedding', 'rose') returning id",
      );
      return row!.id;
    });
    await expect(add("service", { folder: () => other })).rejects.toThrow(/folder/);
  });

  it("ties a photo to the guest whose link sent it", async () => {
    const rows = await q<{ guest_id: string | null }>(
      "select guest_id from wall_photos order by created_at limit 1",
    );
    expect(rows[0]!.guest_id).not.toBeNull();
  });

  it("shows guests the wall, marking this phone's own photos", async () => {
    await add("service", { device: OTHER_PHONE });
    const [mine] = await wall(null);
    expect(mine!.wall).toHaveLength(2);
    expect(mine!.wall.filter((photo) => photo.mine)).toHaveLength(1);
    expect(mine!.wall[0]!.name).toBe("Rohan");
  });

  it("stops one phone at its share", async () => {
    await expect(add("service", { device: OTHER_PHONE, perDevice: 1 })).rejects.toThrow(
      /its share/,
    );
  });

  it("lets hosts hide a photo from guests, and only hosts", async () => {
    const [first] = await wall(null);
    const target = first!.wall.find((photo) => photo.mine)!.id;
    const strangerHides = await t.as(stranger, () =>
      q("update wall_photos set hidden = true where id = $1 returning id", [target]),
    );
    expect(strangerHides).toHaveLength(0);
    await expect(
      t.as(priya, () => q("update wall_photos set device_key = $1 where id = $2", [PHONE, target])),
    ).rejects.toThrow(/permission denied/);
    await t.as(priya, () => q("update wall_photos set hidden = true where id = $1", [target]));
    const [after] = await wall(null);
    expect(after!.wall.map((photo) => photo.id)).not.toContain(target);
    const hostSees = await t.as(priya, () => q("select id from wall_photos"));
    expect(hostSees).toHaveLength(2);
    expect(await t.as(stranger, () => q("select id from wall_photos"))).toHaveLength(0);
  });

  it("lets a guest take back only their own photo", async () => {
    const [now] = await wall(null, OTHER_PHONE);
    const own = now!.wall.find((photo) => photo.mine)!.id;
    const remove = (device: string) =>
      t.as("service", () =>
        q<{ path: string | null }>(
          "select public.remove_wall_photo('priya-weds-arjun', $1, $2) as path",
          [device, own],
        ),
      );
    expect((await remove("c".repeat(32)))[0]!.path).toBeNull();
    await expect(
      t.as(null, () =>
        q("select public.remove_wall_photo('priya-weds-arjun', $1, $2)", [OTHER_PHONE, own]),
      ),
    ).rejects.toThrow(/permission denied/);
    expect((await remove(OTHER_PHONE))[0]!.path).toBe(`${event}/wall-${own}.webp`);
    const [after] = await wall(null, OTHER_PHONE);
    expect(after!.wall).toHaveLength(0);
  });

  it("goes when the invitation is deleted", async () => {
    await t.as(priya, () => q("delete from events where id = $1", [event]));
    expect(await q("select id from wall_photos")).toHaveLength(0);
  });
});
