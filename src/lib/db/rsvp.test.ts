// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { createTestDb, type TestDb } from "./test-db";

/* Guest replies (Step 10): anyone with the link can reply, and nothing more. */

let t: TestDb;
let priya: string;
let event: string;
let haldi: string;
let wedding: string;
let otherFunction: string;

const q = <T = Record<string, unknown>>(sql: string, params: unknown[] = []) =>
  t.db.query<T>(sql, params).then((result) => result.rows);

type Reply = { function_id: string; status: string; adults?: number; children?: number };

const submit = (
  replies: Reply[],
  { token = null, name = "Rohan Mehta", slug = "priya-weds-arjun", message = "" } = {} as {
    token?: string | null;
    name?: string;
    slug?: string;
    message?: string;
  },
) =>
  t
    .as(null, () =>
      q<{ token: string }>("select public.submit_rsvp($1, $2, $3, $4, $5, $6) as token", [
        slug,
        token,
        name,
        JSON.stringify(replies),
        message,
        JSON.stringify({}),
      ]),
    )
    .then((rows) => rows[0]!.token);

beforeAll(async () => {
  t = await createTestDb();
  priya = await t.createUser({ name: "Priya" });
  const stranger = await t.createUser();
  [event, haldi, wedding] = await t.as(priya, async () => {
    const [row] = await q<{ id: string }>(
      "insert into events (category_id, template_id, slug) values ('wedding', 'marigold', 'priya-weds-arjun') returning id",
    );
    const fns = await q<{ id: string; kind: string }>(
      `insert into functions (event_id, kind, position, date) values
       ($1, 'haldi', 2, '2026-12-11'), ($1, 'wedding', 5, '2026-12-12') returning id, kind`,
      [row!.id],
    );
    await q(
      `insert into rsvp_questions (event_id, preset, kind, label, options, position)
       values ($1, 'meal', 'choice', 'Meal preference', '["veg", "jain"]', 0)`,
      [row!.id],
    );
    return [
      row!.id,
      fns.find((fn) => fn.kind === "haldi")!.id,
      fns.find((fn) => fn.kind === "wedding")!.id,
    ];
  });
  otherFunction = await t.as(stranger, async () => {
    const [row] = await q<{ id: string }>(
      "insert into events (category_id, template_id) values ('wedding', 'rose') returning id",
    );
    const [fn] = await q<{ id: string }>(
      "insert into functions (event_id, kind) values ($1, 'wedding') returning id",
      [row!.id],
    );
    return fn!.id;
  });
}, 30_000);

describe("guest replies", () => {
  it("need the invitation to be published", async () => {
    await expect(submit([{ function_id: wedding, status: "attending" }])).rejects.toThrow(
      /invitation not found/,
    );
    await t.as(priya, () =>
      q("update events set status = 'published', published_at = now() where id = $1", [event]),
    );
  });

  it("shows guests the host's questions", async () => {
    const [row] = await t.as(null, () =>
      q<{ invite: { questions: { preset: string; options: string[] }[] } }>(
        "select public.published_invite('priya-weds-arjun') as invite",
      ),
    );
    expect(row!.invite.questions).toEqual([
      expect.objectContaining({ preset: "meal", options: ["veg", "jain"] }),
    ]);
  });

  let token: string;

  it("adds a guest from the open link and records each function", async () => {
    token = await submit(
      [
        { function_id: haldi, status: "declined", adults: 3 },
        { function_id: wedding, status: "attending", adults: 2, children: 1 },
      ],
      { message: "So happy for you!" },
    );
    expect(token).toMatch(/^[0-9a-f]{24}$/);
    const replies = await t.as(priya, () =>
      q<{ status: string; adults: number; children: number; message: string }>(
        "select status, adults, children, message from rsvps order by status",
      ),
    );
    expect(replies).toEqual([
      { status: "attending", adults: 2, children: 1, message: "So happy for you!" },
      // Declining counts nobody
      { status: "declined", adults: 0, children: 0, message: "So happy for you!" },
    ]);
    const [guest] = await t.as(priya, () =>
      q<{ name: string; party_size: number; self_added: boolean }>(
        "select name, party_size, self_added from guests",
      ),
    );
    expect(guest).toEqual({ name: "Rohan Mehta", party_size: 3, self_added: true });
  });

  it("lets the same guest change their reply with their token", async () => {
    await submit([{ function_id: haldi, status: "maybe", adults: 1 }], { token, name: "Rohan" });
    const rows = await t.as(priya, () =>
      q<{ status: string; name: string }>("select status, name from rsvps order by status"),
    );
    expect(rows).toEqual([
      { status: "attending", name: "Rohan Mehta" },
      { status: "maybe", name: "Rohan" },
    ]);
    expect(await t.as(priya, () => q("select id from guests"))).toHaveLength(1);

    const [row] = await t.as(null, () =>
      q<{ reply: { name: string; replies: { status: string }[] } }>(
        "select public.guest_reply('priya-weds-arjun', $1) as reply",
        [token],
      ),
    );
    expect(row!.reply.name).toBe("Rohan");
    expect(row!.reply.replies.map((reply) => reply.status).sort()).toEqual(["attending", "maybe"]);
  });

  it("gives nothing back for an unknown token", async () => {
    const [row] = await t.as(null, () =>
      q<{ reply: unknown }>("select public.guest_reply('priya-weds-arjun', 'nope') as reply"),
    );
    expect(row!.reply).toBeNull();
  });

  it("refuses another family's function, bad statuses and missing names", async () => {
    await expect(submit([{ function_id: otherFunction, status: "attending" }])).rejects.toThrow(
      /not part of this invitation/,
    );
    await expect(submit([{ function_id: wedding, status: "sure" }])).rejects.toThrow();
    await expect(
      submit([{ function_id: wedding, status: "attending" }], { name: "  " }),
    ).rejects.toThrow(/a name is needed/);
    await expect(submit([])).rejects.toThrow(/at least one function/);
  });

  it("keeps a listed guest to the functions they're invited to", async () => {
    const listed = await t.as(priya, async () => {
      const [row] = await q<{ token: string }>(
        "insert into guests (event_id, name, function_ids) values ($1, 'Nani', $2) returning token",
        [event, [wedding]],
      );
      return row!.token;
    });
    await expect(
      submit([{ function_id: haldi, status: "attending" }], { token: listed, name: "Nani" }),
    ).rejects.toThrow(/not invited/);
    await expect(
      submit([{ function_id: wedding, status: "attending" }], { token: listed, name: "Nani ji" }),
    ).resolves.toBe(listed);
    // The host's name for a listed guest stays as the host wrote it
    const [guest] = await t.as(priya, () =>
      q<{ name: string }>("select name from guests where token = $1", [listed]),
    );
    expect(guest!.name).toBe("Nani");
  });

  it("never lets guests read the replies or the guest list", async () => {
    expect(await t.as(null, () => q("select id from rsvps"))).toEqual([]);
    expect(await t.as(null, () => q("select id from guests"))).toEqual([]);
  });
});
