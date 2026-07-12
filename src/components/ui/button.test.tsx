import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const handleAction = vi.fn(() => Promise.resolve({ status: "sent" }));
vi.mock("@/utils/actionHandler", () => ({
  handleAction: (...args: unknown[]) => handleAction(...args),
}));

import { Button, buttonVariants } from "./button";

describe("Button", () => {
  beforeEach(() => {
    handleAction.mockClear();
  });

  it("renders its children", () => {
    render(<Button>Buy now</Button>);
    expect(
      screen.getByRole("button", { name: "Buy now" })
    ).toBeInTheDocument();
  });

  it("applies variant and size classes", () => {
    render(
      <Button variant="destructive" size="lg">
        Delete
      </Button>
    );
    const btn = screen.getByRole("button", { name: "Delete" });
    expect(btn.className).toContain("bg-destructive");
    expect(btn.className).toContain("h-11");
  });

  it("fires a tracked button_click action on click", async () => {
    const user = userEvent.setup();
    render(<Button id="cta">Start</Button>);

    await user.click(screen.getByRole("button", { name: "Start" }));

    expect(handleAction).toHaveBeenCalledWith("button_click", {
      button_id: "cta",
    });
  });

  it("still invokes the caller's onClick handler", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);

    await user.click(screen.getByRole("button", { name: "Click" }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it("falls back to 'unknown' when no id is provided", async () => {
    const user = userEvent.setup();
    render(<Button>No id</Button>);

    await user.click(screen.getByRole("button", { name: "No id" }));

    expect(handleAction).toHaveBeenCalledWith("button_click", {
      button_id: "unknown",
    });
  });

  it("renders as a child element when asChild is set", () => {
    render(
      <Button asChild>
        <a href="/pricing">Pricing</a>
      </Button>
    );
    const link = screen.getByRole("link", { name: "Pricing" });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toBe("/pricing");
  });

  it("buttonVariants produces a class string", () => {
    expect(typeof buttonVariants({ variant: "outline" })).toBe("string");
    expect(buttonVariants({ variant: "outline" })).toContain("border");
  });
});
