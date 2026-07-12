import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getThemePreview } from "./themePreview";

const mockFetch = (impl: () => Promise<unknown>) =>
  vi.stubGlobal("fetch", vi.fn(impl as never));

describe("getThemePreview", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("merges a successful JSON response with the derived description", async () => {
    mockFetch(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        text: () =>
          Promise.resolve(
            JSON.stringify({
              search_query: "coffee shop",
              preview_url: "https://example.com/coffee",
            })
          ),
      })
    );

    const result = await getThemePreview({
      websiteName: "Bean There",
      category: "Ecommerce",
    });

    expect(result.preview_url).toBe("https://example.com/coffee");
    expect(result.search_query).toBe("coffee shop");
    expect(result.raw_response).toContain("coffee");
    // plain_description is constructed from the form data
    expect(result.plain_description).toContain("Bean There");
    expect(result.plain_description).toContain("ecommerce");
  });

  it("falls back to a category-specific URL on a 404", async () => {
    mockFetch(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        statusText: "Not Found",
      })
    );

    const result = await getThemePreview({
      category: "Ecommerce",
      goal: "Make passive income",
    });

    expect(result.preview_url).toBe("https://shopify.com/examples/dropshipping");
    expect(result.served_url).toBe(result.preview_url);
    expect(result.reasoning).toBeDefined();
  });

  it("maps by goal when the category is not recognised", async () => {
    mockFetch(() =>
      Promise.resolve({ ok: false, status: 404, statusText: "Not Found" })
    );

    const result = await getThemePreview({
      category: "Something Unknown",
      goal: "Build a community",
    });

    expect(result.preview_url).toBe(
      "https://www.wix.com/website/templates/html/community"
    );
  });

  it("uses the generic example URL when nothing matches", async () => {
    mockFetch(() =>
      Promise.resolve({ ok: false, status: 404, statusText: "Not Found" })
    );

    const result = await getThemePreview({ category: "", goal: "" });
    expect(result.preview_url).toBe("https://example.com");
  });

  it("falls back when the response body is not valid JSON", async () => {
    mockFetch(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve("<html>not json</html>"),
      })
    );

    const result = await getThemePreview({ category: "Blogs" });
    expect(result.preview_url).toBe("https://wordpress.com/themes/blog");
  });

  it("falls back when the request rejects (network error)", async () => {
    mockFetch(() => Promise.reject(new Error("boom")));

    const result = await getThemePreview({ category: "Events" });
    expect(result.preview_url).toBe(
      "https://www.squarespace.com/templates/events"
    );
  });

  it("builds a default description when the form is empty", async () => {
    mockFetch(() =>
      Promise.resolve({ ok: false, status: 404, statusText: "Not Found" })
    );

    const result = await getThemePreview({});
    expect(result.plain_description).toBe("I run a business website");
  });
});
