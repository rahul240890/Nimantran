import { afterEach, describe, expect, it, vi } from "vitest";

const made = { look: "pages", url: "https://shubhinvitations.com/i/a", marked: false, music: true };

/** A fresh copy of the module, with blob addresses to hand (jsdom has none). */
async function keep() {
  vi.resetModules();
  vi.stubGlobal(
    "URL",
    Object.assign(URL, { createObjectURL: () => "blob:video", revokeObjectURL: () => {} }),
  );
  return import("./keep");
}

afterEach(() => vi.unstubAllGlobals());

describe("stopping a video being made", () => {
  it("stops at once, even while the work underneath hasn't reached a check", async () => {
    const { keptVideo, makeKept, stopKept } = await keep();
    let finish = () => {};
    const making = makeKept(
      "invite:theme:all",
      made,
      () => new Promise<Blob>((resolve) => (finish = () => resolve(new Blob(["late"])))),
    );
    expect(keptVideo("invite:theme:all")).toEqual({ step: "making", done: 0 });
    stopKept("invite:theme:all");
    await expect(making).rejects.toMatchObject({ name: "AbortError" });
    expect(keptVideo("invite:theme:all")).toBeNull();
    // What the work makes after the stop is thrown away
    finish();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(keptVideo("invite:theme:all")).toBeNull();
  });

  it("keeps the video made before", async () => {
    const { keptVideo, makeKept, stopKept } = await keep();
    await makeKept("invite:theme:all", made, async () => new Blob(["first"]));
    expect(keptVideo("invite:theme:all")).toMatchObject({ step: "ready", ...made });
    const again = makeKept("invite:theme:all", made, () => new Promise<Blob>(() => {}));
    stopKept("invite:theme:all");
    await expect(again).rejects.toMatchObject({ name: "AbortError" });
    expect(keptVideo("invite:theme:all")).toMatchObject({ step: "ready", ...made });
  });
});
