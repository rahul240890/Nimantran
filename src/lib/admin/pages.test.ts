import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ADMIN_PAGES, activeAdminPage } from "./pages";

describe("admin pages", () => {
  it("each have a page in the app", () => {
    for (const page of ADMIN_PAGES) {
      const dir = join(process.cwd(), "src/app/(app)", page.href);
      expect(existsSync(join(dir, "page.tsx")), page.href).toBe(true);
    }
  });

  it("mark the right menu entry, even on pages below one", () => {
    expect(activeAdminPage("/admin")?.label).toBe("Overview");
    expect(activeAdminPage("/admin/razorpay")?.label).toBe("Razorpay");
    expect(activeAdminPage("/admin/orders/123")?.label).toBe("Orders");
  });
});
