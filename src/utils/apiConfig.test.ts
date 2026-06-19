import { describe, it, expect, afterEach, vi } from "vitest";
import { getApiKey, API_KEY } from "./apiConfig";

describe("apiConfig", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("exposes the configured key as a string", () => {
    expect(typeof API_KEY).toBe("string");
  });

  it("getApiKey returns the module-level API_KEY", () => {
    expect(getApiKey()).toBe(API_KEY);
  });

  it("warns when the key is not configured", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const key = getApiKey();

    if (key === "") {
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining("VITE_ZIINA_API_KEY")
      );
    } else {
      expect(warn).not.toHaveBeenCalled();
    }
  });
});
