import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const mode = vi.hoisted(() => ({ value: "supabase" as "supabase" | "preview" | "off" }));
vi.mock("@/lib/auth/mode", () => ({ authMode: () => mode.value }));

const { familyToken, readFamilyToken } = await import("./family-link");

const ID = "0b8c6a7e-5f43-4d2a-9c1e-2f6b8d4a1e90";

describe("family preview links", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    mode.value = "supabase";
  });

  it("open only the invite they were made for", () => {
    vi.stubEnv("FAMILY_LINK_SECRET", "a-long-secret");
    const token = familyToken(ID)!;
    expect(token).toMatch(new RegExp(`^${ID}\\.[A-Za-z0-9_-]{22}$`));
    expect(readFamilyToken(token)).toBe(ID);
    const other = "1b8c6a7e-5f43-4d2a-9c1e-2f6b8d4a1e90";
    expect(readFamilyToken(`${other}.${token.split(".")[1]}`)).toBeNull();
  });

  it("refuse a link changed by one letter, or made with another secret", () => {
    vi.stubEnv("FAMILY_LINK_SECRET", "a-long-secret");
    const token = familyToken(ID)!;
    const last = token.at(-1) === "A" ? "B" : "A";
    expect(readFamilyToken(token.slice(0, -1) + last)).toBeNull();
    expect(readFamilyToken(`${token}.extra`)).toBeNull();
    expect(readFamilyToken("not-a-link")).toBeNull();
    vi.stubEnv("FAMILY_LINK_SECRET", "another-secret");
    expect(readFamilyToken(token)).toBeNull();
  });

  it("sign with the database's server key when there is no secret of their own", () => {
    vi.stubEnv("FAMILY_LINK_SECRET", "");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "sb_secret_example");
    expect(readFamilyToken(familyToken(ID)!)).toBe(ID);
  });

  it("aren't made without a secret, outside preview mode", () => {
    vi.stubEnv("FAMILY_LINK_SECRET", "");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
    expect(familyToken(ID)).toBeNull();
    mode.value = "preview";
    expect(readFamilyToken(familyToken(ID)!)).toBe(ID);
    expect(familyToken("not-an-id")).toBeNull();
  });
});
