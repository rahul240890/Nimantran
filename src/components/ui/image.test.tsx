import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Image } from "./image";

describe("Image", () => {
  it("asks the resizer first, and shows the picture as it is once the resizer refuses", () => {
    const onError = vi.fn();
    render(
      <Image
        src="/occasions/wedding.webp"
        alt="A wedding"
        width={320}
        height={240}
        onError={onError}
      />,
    );
    const img = screen.getByRole("img", { name: "A wedding" });
    // next/image writes the address back in full once the page is awake
    expect(img.getAttribute("src")).toMatch(/\/_next\/image\?url=%2Foccasions%2Fwedding\.webp/);
    fireEvent.error(img);
    expect(screen.getByRole("img", { name: "A wedding" }).getAttribute("src")).toMatch(
      /^(http:\/\/localhost:3000)?\/occasions\/wedding\.webp$/,
    );
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("leaves a picture that skips the resizer as it is", () => {
    render(<Image src="/suites/kayal/cover.webp" alt="Kayal" fill unoptimized />);
    expect(screen.getByRole("img", { name: "Kayal" }).getAttribute("src")).toMatch(
      /^(http:\/\/localhost:3000)?\/suites\/kayal\/cover\.webp$/,
    );
  });

  it("asks R2 for a theme painting directly, without the resizer, once R2 is set up", () => {
    vi.stubEnv("NEXT_PUBLIC_MEDIA_URL", "https://media.example.com");
    try {
      render(<Image src="/suites/kayal/cover.webp" alt="Kayal on R2" width={320} height={568} />);
      expect(screen.getByRole("img", { name: "Kayal on R2" }).getAttribute("src")).toBe(
        "https://media.example.com/suites/kayal/cover.webp",
      );
      // Anything else still goes through the resizer
      render(
        <Image src="/occasions/wedding.webp" alt="Resized wedding" width={320} height={240} />,
      );
      expect(screen.getByRole("img", { name: "Resized wedding" }).getAttribute("src")).toMatch(
        /\/_next\/image\?url=%2Foccasions%2Fwedding\.webp/,
      );
    } finally {
      vi.unstubAllEnvs();
    }
  });
});
