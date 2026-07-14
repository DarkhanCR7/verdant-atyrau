import { beforeEach, describe, expect, it, vi } from "vitest";
import { ensureDefaultAdminUser } from "@/lib/admin-bootstrap";
import { hashPassword } from "@/lib/password";

vi.mock("@/lib/password", () => ({
  hashPassword: vi.fn(),
}));

describe("ensureDefaultAdminUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a fallback admin account when none exists yet", async () => {
    const insertValues = vi.fn().mockResolvedValue([{ id: "admin-1" }]);
    const insert = vi.fn().mockReturnValue({ values: insertValues });
    const select = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue([]) }),
      }),
    });

    vi.mocked(hashPassword).mockResolvedValue("hashed-password");

    await ensureDefaultAdminUser({ select, insert } as never, {
      email: "admin@verdant-atyrau.kz",
      password: "ChangeMe123!",
    });

    expect(insert).toHaveBeenCalled();
    expect(insertValues).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "admin@verdant-atyrau.kz",
        passwordHash: "hashed-password",
        role: "ADMIN",
        isActive: true,
      }),
    );
  });
});
