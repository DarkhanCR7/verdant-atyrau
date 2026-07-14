import { eq } from "drizzle-orm";
import { staffUsers } from "@/db/schema";
import { hashPassword } from "@/lib/password";

export interface DefaultAdminBootstrapInput {
  email?: string;
  password?: string;
}

export async function ensureDefaultAdminUser(
  dbLike: {
    select: (args?: unknown) => {
      from: (table: unknown) => {
        where: (condition: unknown) => {
          limit: (count?: number) => Promise<unknown[]>;
        };
      };
    };
    insert: (table: unknown) => {
      values: (data: unknown) => Promise<unknown[]>;
    };
  },
  input: DefaultAdminBootstrapInput = {},
) {
  const email = input.email ?? process.env.SEED_ADMIN_EMAIL ?? "admin@verdant-atyrau.kz";
  const password = input.password ?? process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

  const existing = await dbLike
    .select()
    .from(staffUsers)
    .where(eq(staffUsers.email, email))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  const passwordHash = await hashPassword(password);

  return dbLike.insert(staffUsers).values({
    email,
    passwordHash,
    fullName: "Администратор клиники",
    role: "ADMIN",
    isActive: true,
  });
}
