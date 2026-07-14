import { db } from "@/db";
import { staffUsers } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { hashPassword, verifyPassword } from "@/lib/password";

export class WrongPasswordError extends Error {
  constructor() {
    super("Текущий пароль неверен.");
    this.name = "WrongPasswordError";
  }
}

export class EmailTakenError extends Error {
  constructor() {
    super("Сотрудник с таким email уже существует.");
    this.name = "EmailTakenError";
  }
}

export async function changeOwnPassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  const [user] = await db.select().from(staffUsers).where(eq(staffUsers.id, userId)).limit(1);
  if (!user) throw new Error("Пользователь не найден");

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) throw new WrongPasswordError();

  const newHash = await hashPassword(newPassword);
  await db.update(staffUsers).set({ passwordHash: newHash }).where(eq(staffUsers.id, userId));
}

export async function listStaff() {
  return db
    .select({
      id: staffUsers.id,
      email: staffUsers.email,
      fullName: staffUsers.fullName,
      role: staffUsers.role,
      isActive: staffUsers.isActive,
      createdAt: staffUsers.createdAt,
    })
    .from(staffUsers)
    .orderBy(asc(staffUsers.fullName));
}

export async function createStaffAccount(input: {
  fullName: string;
  email: string;
  password: string;
  role: "ADMIN" | "STAFF";
}) {
  const [existing] = await db
    .select({ id: staffUsers.id })
    .from(staffUsers)
    .where(eq(staffUsers.email, input.email))
    .limit(1);
  if (existing) throw new EmailTakenError();

  const passwordHash = await hashPassword(input.password);
  const [created] = await db
    .insert(staffUsers)
    .values({
      fullName: input.fullName,
      email: input.email,
      passwordHash,
      role: input.role,
    })
    .returning();
  return created && {
    id: created.id,
    email: created.email,
    fullName: created.fullName,
    role: created.role,
    isActive: created.isActive,
  };
}

export async function setStaffActive(id: string, isActive: boolean) {
  const [updated] = await db
    .update(staffUsers)
    .set({ isActive })
    .where(eq(staffUsers.id, id))
    .returning();
  return updated && {
    id: updated.id,
    email: updated.email,
    fullName: updated.fullName,
    role: updated.role,
    isActive: updated.isActive,
  };
}
