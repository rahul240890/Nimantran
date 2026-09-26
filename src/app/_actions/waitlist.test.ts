import { beforeEach, describe, expect, it, vi } from "vitest";

const store = vi.hoisted(() => vi.fn());
vi.mock("@/lib/waitlist/store", () => ({ storeWaitlistEntry: store }));

const { joinWaitlist } = await import("./waitlist");

const entry = { name: "Meera Sharma", email: "meera@example.com", phone: "", occasion: "wedding" };

describe("joinWaitlist", () => {
  beforeEach(() => store.mockReset());

  it("stores a valid entry and thanks the person by name", async () => {
    store.mockResolvedValue("stored");
    await expect(joinWaitlist(entry, "")).resolves.toEqual({
      status: "joined",
      name: "Meera Sharma",
    });
    expect(store).toHaveBeenCalledWith(entry);
  });

  it("re-validates on the server and stores nothing when invalid", async () => {
    const result = await joinWaitlist({ ...entry, email: "nope" }, "");
    expect(result.status).toBe("invalid");
    expect(store).not.toHaveBeenCalled();
  });

  it("quietly ignores bots that fill the hidden field", async () => {
    await expect(joinWaitlist(entry, "https://spam.example")).resolves.toMatchObject({
      status: "joined",
    });
    expect(store).not.toHaveBeenCalled();
  });

  it("reports a failure when the entry could not be stored", async () => {
    store.mockResolvedValue("unavailable");
    await expect(joinWaitlist(entry, "")).resolves.toEqual({ status: "error" });
  });
});
