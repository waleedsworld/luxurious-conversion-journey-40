import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "./use-mobile";

type Listener = () => void;

// jsdom does not implement matchMedia, so provide a controllable stub that also
// lets us drive the "change" event the hook subscribes to.
function installMatchMedia(initialWidth: number) {
  let listener: Listener | null = null;

  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: initialWidth,
  });

  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: window.innerWidth < 768,
    media: query,
    addEventListener: (_: string, cb: Listener) => {
      listener = cb;
    },
    removeEventListener: () => {
      listener = null;
    },
  })) as unknown as typeof window.matchMedia;

  return {
    setWidth(width: number) {
      (window as unknown as { innerWidth: number }).innerWidth = width;
      listener?.();
    },
  };
}

describe("useIsMobile", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reports true for narrow viewports", () => {
    installMatchMedia(500);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("reports false for wide viewports", () => {
    installMatchMedia(1200);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("uses 768px as the breakpoint boundary", () => {
    installMatchMedia(768);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("updates when the media query fires a change", () => {
    const mm = installMatchMedia(1200);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    act(() => {
      mm.setWidth(400);
    });
    expect(result.current).toBe(true);
  });
});
