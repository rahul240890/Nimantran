import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PAGE_ARTS } from "@/lib/suites/catalog";

/** The browser's Image, standing in: each painting comes in when the test says. */
const requested: string[] = [];
const arrive = new Map<string, () => void>();
class TestImage {
  decoding = "auto";
  private source = "";
  set src(value: string) {
    this.source = value;
    requested.push(value);
  }
  get src() {
    return this.source;
  }
  decode() {
    return new Promise<void>((resolve) => arrive.set(this.source, resolve));
  }
}

const BLUR = "data:image/webp;base64,UklGRg==";

/** A fresh copy of the module, with nothing fetched yet and each theme's blurs to hand. */
async function paintings() {
  vi.resetModules();
  requested.length = 0;
  arrive.clear();
  Object.defineProperty(window, "Image", { value: TestImage, configurable: true });
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) =>
      url === "/suites/kayal/blur.json"
        ? Response.json({ cover: BLUR, haldi: "javascript:alert(1)" })
        : new Response(null, { status: 404 }),
    ),
  );
  return import("./paintings");
}

/** Lets the promises in flight settle. */
const settle = () => act(async () => new Promise((resolve) => setTimeout(resolve, 0)));

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("warming the paintings", () => {
  it("fetches two at a time, the latest wanted first", async () => {
    const { warmPaintings } = await paintings();
    const page = (n: number) => `/suites/kayal/page-${n}.webp`;
    warmPaintings([page(1), page(2), page(3), page(4)]);
    expect(requested).toEqual([page(1), page(2)]);
    // The guest turned ahead: the pages after the new one come before the rest
    warmPaintings([page(4)]);
    arrive.get(page(1))!();
    await settle();
    expect(requested).toEqual([page(1), page(2), page(4)]);
    arrive.get(page(2))!();
    await settle();
    expect(requested).toEqual([page(1), page(2), page(4), page(3)]);
  });
});

describe("a page's painting", () => {
  it("comes in on its blurred copy after a moment, its time waiting for the painting", async () => {
    const { BLUR_WAIT_MS, usePainting, usePaintingBlur, warmBlurs } = await paintings();
    const cover = "/suites/kayal/cover.webp";
    warmBlurs([cover, "/suites/kayal/haldi.webp"]);
    await settle();
    // Only a picture's data counts as a blurred copy
    expect(renderHook(() => usePaintingBlur(cover)).result.current).toBe(BLUR);
    expect(renderHook(() => usePaintingBlur("/suites/kayal/haldi.webp")).result.current).toBe(
      undefined,
    );

    vi.useFakeTimers();
    const { result } = renderHook(() => usePainting(cover));
    expect(result.current).toEqual({ ready: false, loaded: false });
    act(() => vi.advanceTimersByTime(BLUR_WAIT_MS));
    expect(result.current).toEqual({ ready: true, loaded: false });
    await act(async () => {
      arrive.get(cover)!();
      await Promise.resolve();
    });
    expect(result.current).toEqual({ ready: true, loaded: true });
  });

  it("without a blurred copy waits longer, and a stalled one can't stop the story", async () => {
    const { BLUR_WAIT_MS, PAINTING_HOLD_MS, PAINTING_WAIT_MS, usePainting, warmBlurs } =
      await paintings();
    const page = "/suites/rajbari/cover.webp";
    warmBlurs([page]);
    await settle();
    vi.useFakeTimers();
    const { result } = renderHook(() => usePainting(page));
    act(() => vi.advanceTimersByTime(BLUR_WAIT_MS));
    expect(result.current).toEqual({ ready: false, loaded: false });
    act(() => vi.advanceTimersByTime(PAINTING_WAIT_MS - BLUR_WAIT_MS));
    expect(result.current).toEqual({ ready: true, loaded: false });
    act(() => vi.advanceTimersByTime(PAINTING_HOLD_MS - PAINTING_WAIT_MS));
    expect(result.current).toEqual({ ready: true, loaded: true });
  });

  it("is ready at once on a page without one", async () => {
    const { usePainting } = await paintings();
    expect(renderHook(() => usePainting(undefined)).result.current).toEqual({
      ready: true,
      loaded: true,
    });
  });
});

describe("the blurred copies", () => {
  // node scripts/painting-blurs.mjs makes them; a theme painted without running it fails here
  it("cover every page's painting, a few hundred bytes each", () => {
    const pages = new Set<string>([...PAGE_ARTS, "couple", "couple-two", "photo", "scene"]);
    const root = join(process.cwd(), "public", "suites");
    for (const theme of readdirSync(root)) {
      const files = readdirSync(join(root, theme));
      const paintings = files
        .filter((file) => file.endsWith(".webp"))
        .map((file) => file.replace(/\.webp$/, ""))
        .filter((name) => pages.has(name));
      if (!paintings.length) continue;
      expect(files, theme).toContain("blur.json");
      const blurs = JSON.parse(readFileSync(join(root, theme, "blur.json"), "utf8"));
      expect(Object.keys(blurs).sort(), theme).toEqual(paintings.sort());
      for (const url of Object.values<string>(blurs)) {
        expect(url.startsWith("data:image/webp;base64,"), theme).toBe(true);
        expect(url.length, theme).toBeLessThan(1000);
      }
    }
  });
});
