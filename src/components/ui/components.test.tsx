import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";
import { Field } from "./field";
import { Input } from "./input";
import { Stepper } from "./stepper";

describe("Button", () => {
  it("defaults to type=button so it never submits a form by accident", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("type", "button");
  });

  it("ignores clicks while loading but stays focusable and named", () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Send
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Send" });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).not.toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("Field", () => {
  it("labels the control and describes it with the hint", () => {
    render(
      <Field label="Bride's name" hint="As on the invite">
        <Input />
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Bride's name" });
    expect(input).toHaveAccessibleDescription("As on the invite");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("replaces the hint with the error and marks the control invalid", () => {
    render(
      <Field label="Mobile" hint="10 digits" error="Enter a 10-digit number." required>
        <Input />
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: /Mobile/ });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toBeRequired();
    expect(input).toHaveAccessibleDescription("Enter a 10-digit number.");
  });
});

describe("Stepper", () => {
  it("marks the current step and says which are done", () => {
    render(
      <Stepper
        steps={[
          { id: "a", label: "Design" },
          { id: "b", label: "Couple" },
          { id: "c", label: "Preview" },
        ]}
        current={1}
        label="Invite progress"
        progressText="Step 2 of 3"
        doneLabel="done"
      />,
    );
    // The full list (tablet and up); phones get a compact summary instead
    const list = within(screen.getByRole("list"));
    expect(list.getByText("Couple").closest("li")).toHaveAttribute("aria-current", "step");
    expect(list.getByText("Design").closest("li")).toHaveTextContent("Design, done");
  });
});

describe("Accordion", () => {
  it("opens one answer at a time and reports it", async () => {
    const { Accordion, AccordionItem } = await import("./accordion");
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="a" title="Dress code?">
          Pastels
        </AccordionItem>
        <AccordionItem value="b" title="Parking?">
          Valet
        </AccordionItem>
      </Accordion>,
    );
    const first = screen.getByRole("button", { name: "Dress code?" });
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(first.parentElement?.tagName).toBe("H3");
    fireEvent.click(first);
    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Pastels")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Parking?" }));
    expect(first).toHaveAttribute("aria-expanded", "false");
  });
});
