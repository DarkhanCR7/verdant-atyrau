import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";
import { logoutFromAdmin } from "@/lib/admin-logout";

describe("checkRateLimit", () => {
  it("allows requests under the limit", () => {
    const key = `test-${Math.random()}`;
    const r1 = checkRateLimit(key, { windowMs: 60_000, max: 3 });
    const r2 = checkRateLimit(key, { windowMs: 60_000, max: 3 });
    expect(r1.success).toBe(true);
    expect(r2.success).toBe(true);
  });

  it("blocks requests once the limit is exceeded", () => {
    const key = `test-${Math.random()}`;
    checkRateLimit(key, { windowMs: 60_000, max: 2 });
    checkRateLimit(key, { windowMs: 60_000, max: 2 });
    const third = checkRateLimit(key, { windowMs: 60_000, max: 2 });
    expect(third.success).toBe(false);
  });

  it("tracks separate keys independently", () => {
    const keyA = `a-${Math.random()}`;
    const keyB = `b-${Math.random()}`;
    checkRateLimit(keyA, { windowMs: 60_000, max: 1 });
    const resultB = checkRateLimit(keyB, { windowMs: 60_000, max: 1 });
    expect(resultB.success).toBe(true);
  });
});

describe("logoutFromAdmin", () => {
  const originalFetch = global.fetch;
  const originalLocation = global.window?.location;

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    if (originalLocation) {
      Object.defineProperty(global, "window", {
        value: { location: originalLocation },
        configurable: true,
      });
    }
    global.fetch = originalFetch;
  });

  it("posts to the logout endpoint and redirects to the admin login page", async () => {
    const router = { replace: vi.fn(), refresh: vi.fn() };
    const assign = vi.fn();
    Object.defineProperty(global, "window", {
      value: { location: { assign } },
      configurable: true,
    });

    await logoutFromAdmin(router as never);

    expect(global.fetch).toHaveBeenCalledWith("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    expect(assign).toHaveBeenCalledWith("/admin/login");
  });
});
