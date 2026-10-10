import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";

/*
 * A real Postgres (PGlite, in memory) dressed like a Supabase project: the anon,
 * authenticated and service_role roles, auth.users and auth.uid(), a storage schema and
 * Supabase's default grants. The migrations and seed run on it unchanged, so tests
 * exercise the actual row level security policies.
 */

const root = join(process.cwd(), "supabase");

const SUPABASE_BASE = `
create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;

create schema auth;
create table auth.users (
  id uuid primary key default gen_random_uuid(),
  phone text,
  email text,
  raw_user_meta_data jsonb not null default '{}'
);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;
grant usage on schema auth to anon, authenticated, service_role;

create schema storage;
create table storage.buckets (
  id text primary key, name text not null, public boolean default false,
  file_size_limit bigint, allowed_mime_types text[]
);
create table storage.objects (
  id uuid primary key default gen_random_uuid(),
  bucket_id text references storage.buckets, name text not null, owner uuid
);
alter table storage.objects enable row level security;
grant usage on schema storage to anon, authenticated, service_role;
grant all on all tables in schema storage to anon, authenticated, service_role;

grant usage on schema public to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
`;

export type TestDb = Awaited<ReturnType<typeof createTestDb>>;

/** Every migration file, oldest first. */
export const migrationFiles = () =>
  readdirSync(join(root, "migrations"))
    .filter((f) => f.endsWith(".sql"))
    .sort();

export const migrationSql = (file: string) => readFileSync(join(root, "migrations", file), "utf8");

/** `before` stops short of the migration named, to test what it does to existing rows. */
export async function createTestDb({
  seed = true,
  before,
}: { seed?: boolean; before?: string } = {}) {
  const db = await PGlite.create({ extensions: { pgcrypto } });
  await db.exec(SUPABASE_BASE);
  const migrations = migrationFiles().filter((file) => !before || file < before);
  for (const file of migrations) await db.exec(migrationSql(file));
  if (seed) await db.exec(readFileSync(join(root, "seed.sql"), "utf8"));

  /** Creates a sign-in, which creates its profile through the trigger. */
  async function createUser(meta: Record<string, unknown> = {}, phone?: string) {
    await db.exec("reset role");
    const { rows } = await db.query<{ id: string }>(
      "insert into auth.users (phone, raw_user_meta_data) values ($1, $2) returning id",
      [phone ?? null, JSON.stringify(meta)],
    );
    return rows[0]!.id;
  }

  /** Runs queries as a signed-in person, a visitor (null) or the server (service). */
  async function as<T>(who: string | null | "service", work: () => Promise<T>): Promise<T> {
    if (who === "service") await db.exec("set role service_role");
    else if (who === null) await db.exec("set role anon; set request.jwt.claim.sub = ''");
    else {
      await db.exec(`set role authenticated; set request.jwt.claim.sub = '${who}'`);
    }
    try {
      return await work();
    } finally {
      await db.exec("reset role; set request.jwt.claim.sub = ''");
    }
  }

  return { db, createUser, as };
}
