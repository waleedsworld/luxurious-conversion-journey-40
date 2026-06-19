import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Mock the collaborators so we test the payment orchestration in isolation.
vi.mock("@/utils/apiConfig", () => ({
  getApiKey: () => "test-key",
}));

const handleAction = vi.fn(() => Promise.resolve({ status: "sent" }));
vi.mock("@/utils/actionHandler", () => ({
  handleAction: (...args: unknown[]) => handleAction(...args),
}));

import { createPaymentIntent } from "./payment";

describe("createPaymentIntent", () => {
  beforeEach(() => {
    handleAction.mockClear();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("calls the Ziina endpoint with the bearer key and $15 payload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: "pi_123" }),
        })
      )
    );

    const data = await createPaymentIntent();

    expect(data).toEqual({ id: "pi_123" });
    const [url, init] = (fetch as unknown as ReturnType<typeof vi.fn>).mock
      .calls[0];
    expect(url).toBe("https://api-v2.ziina.com/api/payment_intent");
    expect(init.headers.Authorization).toBe("Bearer test-key");

    const body = JSON.parse(init.body);
    expect(body.amount).toBe(1500);
    expect(body.currency_code).toBe("USD");
  });

  it("records an authorized action on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: "order_9" }),
        })
      )
    );

    await createPaymentIntent();

    expect(handleAction).toHaveBeenCalledWith(
      "form_submit",
      expect.objectContaining({
        form_data: expect.objectContaining({
          status: "payment_authorized",
          order_id: "order_9",
          amount: 1500,
        }),
      })
    );
  });

  it("records a failed action and throws when the API responds with an error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ message: "card declined" }),
        })
      )
    );

    await expect(createPaymentIntent()).rejects.toThrow("card declined");

    expect(handleAction).toHaveBeenCalledWith(
      "form_submit",
      expect.objectContaining({
        form_data: expect.objectContaining({
          status: "payment_failed",
          error: "card declined",
        }),
      })
    );
  });

  it("propagates network errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("offline")))
    );

    await expect(createPaymentIntent()).rejects.toThrow("offline");
  });
});
