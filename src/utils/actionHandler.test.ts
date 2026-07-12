import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { handleAction } from "./actionHandler";

describe("handleAction", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: true })));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("posts the action to the tracking endpoint", async () => {
    await handleAction("button_click", { button_id: "cta" });

    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, init] = (fetch as unknown as ReturnType<typeof vi.fn>).mock
      .calls[0];
    expect(url).toBe("https://webdevs.applytocollege.pk/handle_action");
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toBe("application/json");

    const body = JSON.parse(init.body);
    expect(body.action_type).toBe("button_click");
    expect(body.action_data).toEqual({ button_id: "cta" });
  });

  it("resolves immediately with a 'sent' status and an ISO timestamp", async () => {
    const result = await handleAction("form_submit", {
      form_data: { status: "ok" },
    });

    expect(result.action_type).toBe("form_submit");
    expect(result.status).toBe("sent");
    // timestamp should be a valid ISO date string
    expect(Number.isNaN(Date.parse(result.timestamp))).toBe(false);
  });

  it("does not await the network call (fire-and-forget)", async () => {
    // A never-resolving fetch must not block handleAction from returning.
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {}))
    );

    const result = await handleAction("scroll", { direction: "down" });
    expect(result.status).toBe("sent");
  });

  it("returns an error response when fetch throws synchronously", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => {
        throw new Error("network down");
      })
    );
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await handleAction("link_click", { link_id: "x" });

    expect(result.status).toBe("error");
    expect(result.action_type).toBe("link_click");
    expect(errorSpy).toHaveBeenCalled();
  });
});
