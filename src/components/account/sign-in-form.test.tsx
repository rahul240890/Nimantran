import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SignInForm } from "./sign-in-form";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }) }));
vi.mock("@/actions/auth", () => ({
  saveProfile: vi.fn(),
  sendCode: vi.fn(),
  sendEmailCode: vi.fn(),
  startGoogle: vi.fn(),
  verifyCode: vi.fn(),
  verifyEmailCode: vi.fn(),
}));

describe("the sign-in form", () => {
  afterEach(cleanup);

  it("offers Google alone while sign-in by number is off", () => {
    render(<SignInForm next="/invites" preview={false} phone={false} />);
    expect(screen.getByRole("button", { name: "Continue with Google" })).toBeVisible();
    expect(screen.queryByRole("textbox", { name: /Mobile number/ })).toBeNull();
    expect(screen.queryByRole("button", { name: "Send code" })).toBeNull();
    expect(screen.queryByText("or")).toBeNull();
  });

  it("offers the mobile number first, then Google, when it's on", () => {
    render(<SignInForm next="/invites" preview={false} phone />);
    expect(screen.getByRole("textbox", { name: /Mobile number/ })).toBeVisible();
    expect(screen.getByRole("button", { name: "Send code" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Continue with Google" })).toBeVisible();
  });

  it("offers an email code first, then Google, when the number is off", () => {
    render(<SignInForm next="/invites" preview={false} phone={false} email />);
    expect(screen.getByRole("textbox", { name: /Email/ })).toBeVisible();
    expect(screen.getByRole("button", { name: "Email me a code" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Continue with Google" })).toBeVisible();
    expect(screen.queryByRole("textbox", { name: /Mobile number/ })).toBeNull();
  });

  it("asks for a real address before sending a code", async () => {
    const { sendEmailCode } = await import("@/actions/auth");
    render(<SignInForm next="/invites" preview={false} phone={false} email />);
    fireEvent.change(screen.getByRole("textbox", { name: /Email/ }), {
      target: { value: "priya@" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Email me a code" }));
    expect(
      screen.getByText("That doesn't look like an email address. Check it for typos."),
    ).toBeVisible();
    expect(sendEmailCode).not.toHaveBeenCalled();
  });
});
